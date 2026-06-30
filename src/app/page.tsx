'use client';

import React, { useEffect, useCallback } from 'react';
import { useOSStore } from '@/os/store';
import Desktop from '@/os/components/desktop';
import Window from '@/os/components/window';
import Taskbar from '@/os/components/taskbar';
import StartMenu from '@/os/components/start-menu';
import NotificationCenter from '@/os/components/notification-center';
import BootAnimation from '@/os/components/boot-animation';
import LoginScreen from '@/os/components/login-screen';
import LockScreen from '@/os/components/lock-screen';
import type { AppProps } from '@/os/types';

// V1 Apps
import TerminalApp from '@/os/apps/terminal/terminal-app';
import FileManagerApp from '@/os/apps/file-manager/file-manager-app';
import CalculatorApp from '@/os/apps/calculator/calculator-app';
import NotesApp from '@/os/apps/notes/notes-app';
import CodeEditorApp from '@/os/apps/code-editor/code-editor-app';
import SecurityDashboardApp from '@/os/apps/security-dashboard/security-dashboard-app';
import NetworkMonitorApp from '@/os/apps/network-monitor/network-monitor-app';
import FirewallApp from '@/os/apps/firewall/firewall-app';
import LogViewerApp from '@/os/apps/log-viewer/log-viewer-app';
import AIAssistantApp from '@/os/apps/ai-assistant/ai-assistant-app';
import SettingsApp from '@/os/apps/settings/settings-app';

// V2 Apps
import PdfViewerApp from '@/os/apps/pdf-viewer/pdf-viewer-app';
import ImageViewerApp from '@/os/apps/image-viewer/image-viewer-app';
import MusicPlayerApp from '@/os/apps/music-player/music-player-app';
import VideoPlayerApp from '@/os/apps/video-player/video-player-app';
import PaintApp from '@/os/apps/paint/paint-app';
import BrowserApp from '@/os/apps/browser/browser-app';
import CalendarApp from '@/os/apps/calendar/calendar-app';
import TodoApp from '@/os/apps/todo/todo-app';
import ProfileApp from '@/os/apps/profile/profile-app';
import AppStoreApp from '@/os/apps/app-store/app-store-app';
import SystemUpdateApp from '@/os/apps/system-update/system-update-app';
import BackupApp from '@/os/apps/backup/backup-app';
import HelpCenterApp from '@/os/apps/help-center/help-center-app';
import CyberLearningApp from '@/os/apps/cyber-learning/cyber-learning-app';

const appComponents: Record<string, React.ComponentType<AppProps>> = {
  terminal: TerminalApp, 'file-manager': FileManagerApp, calculator: CalculatorApp,
  notes: NotesApp, 'code-editor': CodeEditorApp, 'security-dashboard': SecurityDashboardApp,
  'network-monitor': NetworkMonitorApp, firewall: FirewallApp, 'log-viewer': LogViewerApp,
  'ai-assistant': AIAssistantApp, settings: SettingsApp, 'pdf-viewer': PdfViewerApp,
  'image-viewer': ImageViewerApp, 'music-player': MusicPlayerApp, 'video-player': VideoPlayerApp,
  paint: PaintApp, browser: BrowserApp, calendar: CalendarApp, todo: TodoApp,
  profile: ProfileApp, 'app-store': AppStoreApp, 'system-update': SystemUpdateApp,
  backup: BackupApp, 'help-center': HelpCenterApp, 'cyber-learning': CyberLearningApp,
};

export default function Home() {
  const theme = useOSStore((s) => s.theme);
  const bootPhase = useOSStore((s) => s.bootPhase);
  const setBootPhase = useOSStore((s) => s.setBootPhase);
  const windows = useOSStore((s) => s.windows);
  const closeStartMenu = useOSStore((s) => s.closeStartMenu);
  const closeNotification = useOSStore((s) => s.closeNotification);

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleBootDone = useCallback(() => setBootPhase('login'), [setBootPhase]);

  // Click desktop to close menus
  const handleDesktopClick = () => {
    closeStartMenu();
    closeNotification();
  };

  return (
    <div className={`h-screen w-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Phase: Boot */}
      {bootPhase === 'booting' && <BootAnimation onDone={handleBootDone} />}

      {/* Phase: Login */}
      {bootPhase === 'login' && <LoginScreen />}

      {/* Phase: Lock */}
      {bootPhase === 'locked' && <LockScreen />}

      {/* Phase: Desktop (also render during locked so windows stay behind) */}
      {(bootPhase === 'desktop' || bootPhase === 'locked') && (
        <>
          <Desktop onClick={handleDesktopClick} />

          {windows.map((win) => {
            const AppComponent = appComponents[win.appId];
            if (!AppComponent) return null;
            return (
              <Window key={win.id} windowState={win}>
                <AppComponent windowId={win.id} />
              </Window>
            );
          })}

          <StartMenu />
          <NotificationCenter />
          {bootPhase === 'desktop' && <Taskbar />}
        </>
      )}
    </div>
  );
}