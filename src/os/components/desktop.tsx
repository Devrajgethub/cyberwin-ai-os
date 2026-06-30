'use client';

import React from 'react';
import { useOSStore } from '@/os/store';
import DesktopIcon from './desktop-icon';

export default function Desktop() {
  const desktopIcons = useOSStore((s) => s.desktopIcons);
  const closeStartMenu = useOSStore((s) => s.closeStartMenu);

  const handleDesktopClick = () => {
    closeStartMenu();
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #0a0a1a 0%, #0a1628 25%, #0a0a1a 50%, #0d1a2a 75%, #0a0a1a 100%)',
      }}
      onClick={handleDesktopClick}
    >
      {/* Cyber grid overlay */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Ambient glow spots */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.07] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.6) 0%, transparent 70%)',
          top: '20%',
          left: '60%',
        }}
      />
      <div
        className="absolute w-[400px] h-[400px] rounded-full opacity-[0.04] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)',
          top: '60%',
          left: '20%',
        }}
      />

      {/* Desktop icons grid */}
      <div className="relative z-10 p-4 grid grid-flow-col auto-cols-[80px] auto-rows-[88px] gap-1 content-start">
        {desktopIcons.map((icon) => (
          <DesktopIcon
            key={icon.appId}
            appId={icon.appId}
            label={icon.label}
            icon={icon.icon}
          />
        ))}
      </div>
    </div>
  );
}