'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/os/store';
import DesktopIcon from './desktop-icon';
import FloatingAssistant from './floating-assistant';

// All wallpaper definitions (must match settings-app.tsx)
const WALLPAPERS: Record<string, string> = {
  // Gradients
  'cyber-dark': 'linear-gradient(135deg, #0a0a1a 0%, #0d1117 30%, #0a1628 60%, #050510 100%)',
  'matrix': 'linear-gradient(180deg, #000a00 0%, #001a00 50%, #000500 100%)',
  'deep-ocean': 'linear-gradient(135deg, #020024 0%, #090979 40%, #00d4ff 100%)',
  'sunset': 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #4a1942 60%, #1a0a2e 100%)',
  'midnight': 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
  // Image URLs
  'neon-city': 'url(/wallpapers/neon-city.svg) center/cover no-repeat',
  'motherboard': 'url(/wallpapers/motherboard-led.svg) center/cover no-repeat',
  'dark-wave': 'url(/wallpapers/cyber-dark-wave.svg) center/cover no-repeat',
  'neon-grid': 'url(/wallpapers/neon-grid.svg) center/cover no-repeat',
  'scene-1': 'url(/wallpapers/cyberpunk-scene-1.svg) center/cover no-repeat',
  'scene-2': 'url(/wallpapers/cyberpunk-scene-2.svg) center/cover no-repeat',
};

function getWallpaperBackground(id: string): string {
  return WALLPAPERS[id] || WALLPAPERS['cyber-dark'];
}

interface DesktopProps {
  onClick?: () => void;
}

export default function Desktop({ onClick }: DesktopProps) {
  const desktopIcons = useOSStore((s) => s.desktopIcons);
  const closeStartMenu = useOSStore((s) => s.closeStartMenu);
  const [wallpaperId, setWallpaperId] = useState(() => {
    if (typeof window === 'undefined') return 'cyber-dark';
    try { return localStorage.getItem('cyberwin_wallpaper') || 'cyber-dark'; } catch { return 'cyber-dark'; }
  });

  // Listen for wallpaper changes from Settings app
  useEffect(() => {
    const handler = (e: Event) => {
      const id = (e as CustomEvent).detail;
      if (id) {
        setWallpaperId(id);
        try { localStorage.setItem('cyberwin_wallpaper', id); } catch { /* noop */ }
      }
    };
    window.addEventListener('wallpaper-change', handler);
    return () => window.removeEventListener('wallpaper-change', handler);
  }, []);

  const handleClick = () => {
    closeStartMenu();
    onClick?.();
  };

  const isGradient = !wallpaperId.startsWith('url(') && !WALLPAPERS[wallpaperId]?.startsWith('url(');

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: getWallpaperBackground(wallpaperId),
      }}
      onClick={handleClick}
    >
      {isGradient && <div className="absolute inset-0 cyber-grid opacity-60" />}
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)', top: '20%', left: '60%' }} />
      <div className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)', top: '60%', left: '20%' }} />
      <div className="relative z-10 p-4 grid grid-flow-col auto-cols-[80px] auto-rows-[88px] gap-1 content-start">
        {desktopIcons.map((icon) => (
          <DesktopIcon key={icon.appId} appId={icon.appId} label={icon.label} icon={icon.icon} />
        ))}
      </div>
      <FloatingAssistant />
    </div>
  );
}