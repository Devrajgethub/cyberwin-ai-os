'use client';

import React, { useEffect, useState } from 'react';
import { useOSStore } from '@/os/store';
import { IconByName } from './desktop-icon';
import { Sun, Moon, Wifi, Battery, Volume2, Search, LayoutGrid, Bell, Lock } from 'lucide-react';

export default function Taskbar() {
  const windows = useOSStore((s) => s.windows);
  const activeWindowId = useOSStore((s) => s.activeWindowId);
  const focusWindow = useOSStore((s) => s.focusWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const toggleStartMenu = useOSStore((s) => s.toggleStartMenu);
  const isStartMenuOpen = useOSStore((s) => s.isStartMenuOpen);
  const theme = useOSStore((s) => s.theme);
  const toggleTheme = useOSStore((s) => s.toggleTheme);
  const toggleNotification = useOSStore((s) => s.toggleNotification);
  const notifications = useOSStore((s) => s.notifications);
  const setBootPhase = useOSStore((s) => s.setBootPhase);
  const [time, setTime] = useState(new Date());

  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  const handleAppClick = (windowId: string, isMinimized: boolean) => {
    if (isMinimized) focusWindow(windowId);
    else if (activeWindowId === windowId) minimizeWindow(windowId);
    else focusWindow(windowId);
  };

  const unread = notifications.filter((n) => !n.read).length;

  const appMap = new Map<string, { windowId: string; appId: string; title: string; isMinimized: boolean; isActive: boolean }>();
  for (let i = windows.length - 1; i >= 0; i--) {
    const w = windows[i];
    if (!appMap.has(w.appId)) appMap.set(w.appId, { windowId: w.id, appId: w.appId, title: w.title, isMinimized: w.isMinimized, isActive: w.id === activeWindowId });
  }
  const taskbarApps = Array.from(appMap.values());

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 z-50 no-select">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-xl border-t border-white/[0.06]" />
      <div className="relative z-10 h-full flex items-center px-2 gap-1">
        <div className="flex items-center gap-1">
          <button className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-150 ${isStartMenuOpen ? 'bg-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.2)]' : 'hover:bg-white/10'}`} onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}>
            <LayoutGrid size={18} className={isStartMenuOpen ? 'text-cyan-400' : 'text-cyan-400/70'} />
          </button>
          <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-white/10 transition-colors">
            <Search size={16} className="text-gray-400" />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center gap-1 overflow-x-auto">
          {taskbarApps.map((app) => (
            <button key={app.windowId} className={`flex items-center gap-2 h-10 px-3 rounded-lg transition-all duration-150 max-w-[180px] min-w-[44px] ${app.isActive && !app.isMinimized ? 'bg-white/[0.08] border-b-2 border-cyan-400' : app.isMinimized ? 'hover:bg-white/[0.05] opacity-60' : 'hover:bg-white/[0.05]'}`} onClick={(e) => { e.stopPropagation(); handleAppClick(app.windowId, app.isMinimized); }} title={app.title}>
              <IconByName name={app.appId} size={16} className="text-cyan-400/80 shrink-0" strokeWidth={1.5} />
              <span className="text-xs text-gray-300 truncate hidden sm:inline">{app.title}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          <button className="flex items-center justify-center w-8 h-10 rounded-lg hover:bg-white/10 transition-colors" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={15} className="text-gray-400" /> : <Moon size={15} className="text-gray-400" />}
          </button>
          <button className="relative flex items-center justify-center w-8 h-10 rounded-lg hover:bg-white/10 transition-colors" onClick={toggleNotification}>
            <Bell size={15} className="text-gray-400" />
            {unread > 0 && <span className="absolute top-1.5 right-1 w-2 h-2 bg-cyan-400 rounded-full" />}
          </button>
          <button className="flex items-center justify-center w-8 h-10 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setBootPhase('locked')}>
            <Lock size={14} className="text-gray-400" />
          </button>
          <div className="flex items-center justify-center w-8 h-10"><Wifi size={14} className="text-gray-400" /></div>
          <div className="flex items-center justify-center w-8 h-10"><Volume2 size={14} className="text-gray-400" /></div>
          <div className="flex items-center justify-center w-8 h-10"><Battery size={14} className="text-gray-400" /></div>
          <div className="flex flex-col items-end justify-center h-10 px-2 text-gray-300 cursor-pointer" onClick={() => setBootPhase('locked')}>
            <span className="text-[11px] leading-tight font-medium">{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="text-[10px] leading-tight text-gray-500 hidden sm:block">{time.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}