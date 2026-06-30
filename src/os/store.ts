import { create } from 'zustand';
import { WindowState, Theme, DesktopIconData } from './types';

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  icon?: string;
  read: boolean;
}

interface OSState {
  // Boot / Login / Lock
  bootPhase: 'booting' | 'login' | 'desktop' | 'locked';
  setBootPhase: (phase: OSState['bootPhase']) => void;
  username: string;
  setUsername: (u: string) => void;
  avatar: string;
  setAvatar: (a: string) => void;
  isAuthenticated: boolean;
  setAuthenticated: (username: string) => void;
  clearAuth: () => void;

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

  // Notification Center
  notifications: Notification[];
  isNotificationOpen: boolean;
  toggleNotification: () => void;
  closeNotification: () => void;
  addNotification: (n: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  clearNotifications: () => void;
  markAllRead: () => void;

  // Desktop Icons
  desktopIcons: DesktopIconData[];
  setDesktopIcons: (icons: DesktopIconData[]) => void;
}

let windowCounter = 0;
let notifCounter = 0;

export const useOSStore = create<OSState>((set, get) => ({
  // Boot / Login / Lock
  bootPhase: 'booting',
  setBootPhase: (phase) => set({ bootPhase: phase }),
  username: '',
  setUsername: (u) => set({ username: u }),
  avatar: '',
  setAvatar: (a) => set({ avatar: a }),
  isAuthenticated: false,
  setAuthenticated: (username) => set({ username, isAuthenticated: true }),
  clearAuth: () => set({ isAuthenticated: false, bootPhase: 'login' }),

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
      id, appId, title,
      x: 100 + offset, y: 60 + offset,
      width: defaultWidth || 700, height: defaultHeight || 500,
      minWidth: minWidth || 300, minHeight: minHeight || 200,
      isMinimized: false, isMaximized: false, zIndex: nextZIndex,
    };
    set({ windows: [...windows, newWindow], activeWindowId: id, nextZIndex: nextZIndex + 1, isStartMenuOpen: false, isNotificationOpen: false });
    return id;
  },

  closeWindow: (windowId) => set((state) => {
    const newWindows = state.windows.filter((w) => w.id !== windowId);
    return { windows: newWindows, activeWindowId: state.activeWindowId === windowId ? (newWindows.length > 0 ? newWindows[newWindows.length - 1].id : null) : state.activeWindowId };
  }),

  minimizeWindow: (windowId) => set((state) => ({
    windows: state.windows.map((w) => w.id === windowId ? { ...w, isMinimized: true } : w),
    activeWindowId: state.activeWindowId === windowId ? (() => { const v = state.windows.filter((w) => w.id !== windowId && !w.isMinimized); return v.length > 0 ? v.reduce((a, b) => (a.zIndex > b.zIndex ? a : b)).id : null; })() : state.activeWindowId,
  })),

  maximizeWindow: (windowId) => set((state) => ({
    windows: state.windows.map((w) => w.id === windowId ? { ...w, isMaximized: true, zIndex: state.nextZIndex, isMinimized: false } : w),
    activeWindowId: windowId, nextZIndex: state.nextZIndex + 1,
  })),

  restoreWindow: (windowId) => set((state) => ({
    windows: state.windows.map((w) => w.id === windowId ? { ...w, isMaximized: false } : w),
  })),

  focusWindow: (windowId) => set((state) => ({
    windows: state.windows.map((w) => w.id === windowId ? { ...w, zIndex: state.nextZIndex, isMinimized: false } : w),
    activeWindowId: windowId, nextZIndex: state.nextZIndex + 1,
  })),

  updateWindowPosition: (windowId, x, y) => set((state) => ({
    windows: state.windows.map((w) => w.id === windowId ? { ...w, x, y } : w),
  })),

  updateWindowSize: (windowId, width, height) => set((state) => ({
    windows: state.windows.map((w) => w.id === windowId ? { ...w, width, height, isMaximized: false } : w),
  })),

  // Start Menu
  isStartMenuOpen: false,
  toggleStartMenu: () => set((state) => ({ isStartMenuOpen: !state.isStartMenuOpen, isNotificationOpen: false })),
  closeStartMenu: () => set({ isStartMenuOpen: false }),

  // Notification Center
  notifications: [
    { id: 'n1', title: 'Security Alert', message: 'Firewall blocked 3 suspicious connections', time: '2 min ago', icon: 'shield', read: false },
    { id: 'n2', title: 'System Update', message: 'CyberWin AI OS v2.1.0 is available', time: '1 hr ago', icon: 'refresh-cw', read: false },
    { id: 'n3', title: 'Scan Complete', message: 'Weekly vulnerability scan finished: 0 critical', time: '3 hrs ago', icon: 'activity', read: true },
  ],
  isNotificationOpen: false,
  toggleNotification: () => set((state) => ({ isNotificationOpen: !state.isNotificationOpen, isStartMenuOpen: false })),
  closeNotification: () => set({ isNotificationOpen: false }),
  addNotification: (n) => {
    const id = `notif-${++notifCounter}`;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    set((state) => ({ notifications: [{ ...n, id, time, read: false }, ...state.notifications] }));
  },
  clearNotifications: () => set({ notifications: [] }),
  markAllRead: () => set((state) => ({ notifications: state.notifications.map((n) => ({ ...n, read: true })) })),

  // Desktop Icons
  desktopIcons: [
    { appId: 'terminal', label: 'Terminal', icon: 'terminal', x: 0, y: 0 },
    { appId: 'file-manager', label: 'Files', icon: 'folder', x: 0, y: 1 },
    { appId: 'ai-assistant', label: 'AI Assistant', icon: 'bot', x: 0, y: 2 },
    { appId: 'security-dashboard', label: 'Security', icon: 'shield', x: 0, y: 3 },
    { appId: 'browser', label: 'Browser', icon: 'browser', x: 0, y: 4 },
    { appId: 'code-editor', label: 'Code', icon: 'code', x: 1, y: 0 },
    { appId: 'notes', label: 'Notes', icon: 'notepad', x: 1, y: 1 },
    { appId: 'calendar', label: 'Calendar', icon: 'calendar', x: 1, y: 2 },
    { appId: 'settings', label: 'Settings', icon: 'settings', x: 1, y: 3 },
    { appId: 'calculator', label: 'Calculator', icon: 'calculator', x: 2, y: 0 },
    { appId: 'todo', label: 'Todo', icon: 'todo', x: 2, y: 1 },
    { appId: 'music-player', label: 'Music', icon: 'music', x: 2, y: 2 },
    { appId: 'paint', label: 'Paint', icon: 'paint', x: 2, y: 3 },
    { appId: 'app-store', label: 'App Store', icon: 'store', x: 3, y: 0 },
    { appId: 'cyber-learning', label: 'Learning', icon: 'learning', x: 3, y: 1 },
  ],
  setDesktopIcons: (icons) => set({ desktopIcons: icons }),
}));