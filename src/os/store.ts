import { create } from 'zustand';
import { WindowState, Theme, DesktopIconData } from './types';

interface OSState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;

  // Windows
  windows: WindowState[];
  activeWindowId: string | null;
  nextZIndex: number;
  openWindow: (appId: string, title: string, defaultWidth: number, defaultHeight: number, minWidth: number, minHeight: number) => string;
  closeWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  updateWindowPosition: (windowId: string, x: number, y: number) => void;
  updateWindowSize: (windowId: string, width: number, height: number) => void;

  // Start Menu
  isStartMenuOpen: boolean;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;

  // Desktop Icons
  desktopIcons: DesktopIconData[];
  setDesktopIcons: (icons: DesktopIconData[]) => void;

  // Clock
  currentTime: Date;
}

let windowCounter = 0;

export const useOSStore = create<OSState>((set, get) => ({
  // Theme
  theme: 'dark',
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

  // Windows
  windows: [],
  activeWindowId: null,
  nextZIndex: 100,

  openWindow: (appId, title, defaultWidth, defaultHeight, minWidth, minHeight) => {
    const id = `window-${++windowCounter}`;
    const { nextZIndex, windows } = get();
    const offset = (windows.length % 8) * 30;
    const newWindow: WindowState = {
      id,
      appId,
      title,
      x: 100 + offset,
      y: 60 + offset,
      width: defaultWidth || 700,
      height: defaultHeight || 500,
      minWidth: minWidth || 300,
      minHeight: minHeight || 200,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex,
    };
    set({
      windows: [...windows, newWindow],
      activeWindowId: id,
      nextZIndex: nextZIndex + 1,
      isStartMenuOpen: false,
    });
    return id;
  },

  closeWindow: (windowId) =>
    set((state) => {
      const newWindows = state.windows.filter((w) => w.id !== windowId);
      return {
        windows: newWindows,
        activeWindowId:
          state.activeWindowId === windowId
            ? newWindows.length > 0
              ? newWindows[newWindows.length - 1].id
              : null
            : state.activeWindowId,
      };
    }),

  minimizeWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMinimized: true } : w
      ),
      activeWindowId:
        state.activeWindowId === windowId
          ? (() => {
              const visible = state.windows.filter(
                (w) => w.id !== windowId && !w.isMinimized
              );
              return visible.length > 0
                ? visible.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id
                : null;
            })()
          : state.activeWindowId,
    })),

  maximizeWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMaximized: true, zIndex: state.nextZIndex, isMinimized: false } : w
      ),
      activeWindowId: windowId,
      nextZIndex: state.nextZIndex + 1,
    })),

  restoreWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, isMaximized: false } : w
      ),
    })),

  focusWindow: (windowId) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w
      ),
      activeWindowId: windowId,
      nextZIndex: state.nextZIndex + 1,
    })),

  updateWindowPosition: (windowId, x, y) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, x, y } : w
      ),
    })),

  updateWindowSize: (windowId, width, height) =>
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === windowId ? { ...w, width, height, isMaximized: false } : w
      ),
    })),

  // Start Menu
  isStartMenuOpen: false,
  toggleStartMenu: () =>
    set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  // Desktop Icons
  desktopIcons: [
    { appId: 'terminal', label: 'Terminal', icon: 'terminal', x: 0, y: 0 },
    { appId: 'file-manager', label: 'Files', icon: 'folder', x: 0, y: 1 },
    { appId: 'ai-assistant', label: 'AI Assistant', icon: 'bot', x: 0, y: 2 },
    { appId: 'security-dashboard', label: 'Security', icon: 'shield', x: 0, y: 3 },
    { appId: 'network-monitor', label: 'Network', icon: 'network', x: 0, y: 4 },
    { appId: 'code-editor', label: 'Code', icon: 'code', x: 1, y: 0 },
    { appId: 'notes', label: 'Notes', icon: 'notepad', x: 1, y: 1 },
    { appId: 'settings', label: 'Settings', icon: 'settings', x: 1, y: 2 },
    { appId: 'calculator', label: 'Calculator', icon: 'calculator', x: 1, y: 3 },
    { appId: 'firewall', label: 'Firewall', icon: 'firewall', x: 1, y: 4 },
  ],
  setDesktopIcons: (icons) => set({ desktopIcons: icons }),

  // Clock
  currentTime: new Date(),
}));