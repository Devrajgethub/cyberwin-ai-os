'use client';

import React, { useState, useEffect } from 'react';
import { useOSStore } from '@/os/store';
import { Lock, User } from 'lucide-react';

export default function LockScreen() {
  const { bootPhase, setBootPhase, username } = useOSStore();
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState('');

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (bootPhase !== 'locked') return null;

  const handleUnlock = () => {
    setError('');
    setBootPhase('desktop');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUnlock();
  };

  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0a1628 40%, #0d0a1a 100%)' }}>
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)', top: '25%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      <div className="relative z-10 flex flex-col items-center">
        {/* Time */}
        <div className="text-7xl font-extralight text-white mb-1 tracking-tight">
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm text-gray-400 mb-10">
          {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>

        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-600/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center mb-3">
          <User size={28} className="text-cyan-400/80" />
        </div>
        <p className="text-base font-medium text-white mb-4">{username}</p>

        {/* Password */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] focus-within:border-cyan-500/30 w-64">
            <Lock size={13} className="text-gray-500 shrink-0" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent text-sm text-gray-200 outline-none" placeholder="Password" autoFocus />
          </div>
          <button onClick={handleUnlock} className="h-10 w-10 rounded-lg bg-cyan-600/20 border border-cyan-500/20 flex items-center justify-center hover:bg-cyan-600/30 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-cyan-400"><path d="M8 1l6 4v5c0 3.5-2.5 6-6 7.5-3.5-1.5-6-4-6-7.5V5l6-4z" stroke="currentColor" strokeWidth="1.2" fill="none" /></svg>
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
      </div>
    </div>
  );
}