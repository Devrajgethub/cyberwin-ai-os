'use client';

import React, { useState } from 'react';
import { useOSStore } from '@/os/store';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginScreen() {
  const { setBootPhase, username, setUsername } = useOSStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!username.trim()) { setError('Enter username'); return; }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setBootPhase('desktop');
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div className="fixed inset-0 z-[998] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #0a1628 40%, #0d0a1a 100%)' }}>
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)', top: '30%', left: '50%', transform: 'translate(-50%,-50%)' }} />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <User size={36} className="text-cyan-400/80" />
          </div>
        </div>

        {/* Form */}
        <div className="glass rounded-2xl p-6" style={{ background: 'rgba(10,10,20,0.6)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h2 className="text-center text-lg font-semibold text-white mb-1">Sign In</h2>
          <p className="text-center text-xs text-gray-500 mb-6">CyberWin AI OS v2.0</p>

          <div className="space-y-4">
            <div>
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">Username</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] focus-within:border-cyan-500/30 transition-colors">
                <User size={14} className="text-gray-500 shrink-0" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent text-sm text-gray-200 outline-none" placeholder="Enter username" autoFocus />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06] focus-within:border-cyan-500/30 transition-colors">
                <Lock size={14} className="text-gray-500 shrink-0" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={handleKeyDown} className="flex-1 bg-transparent text-sm text-gray-200 outline-none" placeholder="Enter password" />
                <button onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-gray-300">
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && <p className="text-xs text-red-400 text-center">{error}</p>}

            <button onClick={handleLogin} disabled={loading} className="w-full h-10 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-medium text-sm transition-colors disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p className="text-[10px] text-gray-600 text-center mt-4">Hint: any username and password works</p>
        </div>
      </div>
    </div>
  );
}