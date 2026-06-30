'use client';

import React, { useEffect } from 'react';
import { useOSStore } from '@/os/store';
import Desktop from '@/os/components/desktop';
import Window from '@/os/components/window';
import Taskbar from '@/os/components/taskbar';
import StartMenu from '@/os/components/start-menu';
import type { AppProps } from '@/os/types';

// App imports
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

const appComponents: Record<string, React.ComponentType<AppProps>> = {
  terminal: TerminalApp,
  'file-manager': FileManagerApp,
  calculator: CalculatorApp,
  notes: NotesApp,
  'code-editor': CodeEditorApp,
  'security-dashboard': SecurityDashboardApp,
  'network-monitor': NetworkMonitorApp,
  firewall: FirewallApp,
  'log-viewer': LogViewerApp,
  'ai-assistant': AIAssistantApp,
  settings: SettingsApp,
};

export default function Home() {
  const theme = useOSStore((s) => s.theme);
  const windows = useOSStore((s) => s.windows);

  // Apply theme to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`h-screen w-screen overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Desktop background and icons */}
      <Desktop />

      {/* Windows */}
      {windows.map((win) => {
        const AppComponent = appComponents[win.appId];
        if (!AppComponent) return null;
        return (
          <Window key={win.id} windowState={win}>
            <AppComponent windowId={win.id} />
          </Window>
        );
      })}

      {/* Start Menu */}
      <StartMenu />

      {/* Taskbar */}
      <Taskbar />
    </div>
  );
}