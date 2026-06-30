'use client';

import React, { useEffect, useState } from 'react';
import { useOSStore } from '@/os/store';

export default function BootAnimation({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0=logo, 1=loading, 2=done

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 800);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (stage !== 1) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setStage(2);
          setTimeout(onDone, 600);
          return 100;
        }
        return p + Math.random() * 8 + 2;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [stage, onDone]);

  return (
    <div className="fixed inset-0 z-[999] bg-[#050510] flex flex-col items-center justify-center">
      {/* Logo */}
      <div className={`transition-all duration-700 ${stage === 0 ? 'scale-75 opacity-0' : 'scale-100 opacity-100'}`}>
        <div className="relative">
          {/* Hexagonal glow */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-2xl bg-cyan-500/10 blur-2xl animate-pulse" />
          {/* Logo icon */}
          <div className="relative w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-cyan-600/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.15)]">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="text-cyan-400">
              <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M24 4v40M4 14l20 10 20-10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
              <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" fill="rgba(6,182,212,0.15)" />
              <path d="M21 24h6M24 21v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className={`mt-8 transition-all duration-500 ${stage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <h1 className="text-2xl font-bold text-white tracking-wider cyber-glow-text">CyberWin AI OS</h1>
        <p className="text-xs text-cyan-400/60 mt-1 tracking-widest uppercase">Version 2.0</p>
      </div>

      {/* Progress bar */}
      <div className={`mt-10 w-64 transition-all duration-500 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full transition-all duration-200" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>
        <p className="text-[10px] text-gray-600 mt-2 text-center">
          {progress < 30 ? 'Initializing kernel...' : progress < 60 ? 'Loading security modules...' : progress < 90 ? 'Starting desktop environment...' : 'Ready'}
        </p>
      </div>
    </div>
  );
}