'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useOSStore } from '@/os/store';
import { verifySessionPassword } from '@/os/lib/auth';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';

export default function LockScreen() {
  const { bootPhase, setBootPhase, username, clearAuth } = useOSStore();
  const [password, setPassword] = useState('');
  const [time, setTime] = useState(new Date());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  }, []);

  const handleUnlock = useCallback(async () => {
    if (!password) {
      setError('Password is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const valid = await verifySessionPassword(username, password);
      if (valid) {
        setPassword('');
        setBootPhase('desktop');
      } else {
        setError('Incorrect password');
        triggerShake();
      }
    } catch {
      setError('Verification failed');
      triggerShake();
    } finally {
      setLoading(false);
    }
  }, [password, username, setBootPhase, triggerShake]);

  const handleSignOut = useCallback(() => {
    setPassword('');
    setError('');
    clearAuth();
  }, [clearAuth]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleUnlock();
  }, [handleUnlock]);

  if (bootPhase !== 'locked') return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0a1628 40%, #0d0a1a 100%)',
      }}
    >
      <div className="absolute inset-0 cyber-grid opacity-30" />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.06] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)',
          top: '25%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

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

        {/* Password Input */}
        <div className={`flex items-center gap-2 ${shaking ? 'animate-shake-lock' : ''}`}>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border w-64 transition-colors ${
              error ? 'border-red-500/50' : 'border-white/[0.06] focus-within:border-cyan-500/30'
            }`}
          >
            <Lock size={13} className="text-gray-500 shrink-0" />
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-600"
              placeholder="Password"
              autoFocus
            />
            {loading && <Loader2 size={13} className="text-cyan-400 animate-spin shrink-0" />}
          </div>
          <button
            type="button"
            onClick={handleUnlock}
            disabled={loading}
            className="h-10 w-10 rounded-lg bg-cyan-600/20 border border-cyan-500/20 flex items-center justify-center hover:bg-cyan-600/30 transition-colors disabled:opacity-50"
            aria-label="Unlock"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-cyan-400">
              <path d="M8 1l6 4v5c0 3.5-2.5 6-6 7.5-3.5-1.5-6-4-6-7.5V5l6-4z" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-1.5 mt-2">
            <AlertCircle size={11} className="text-red-400" />
            <p className="text-xs text-red-400">{error}</p>
          </div>
        )}

        {/* Sign Out */}
        <button
          type="button"
          onClick={handleSignOut}
          className="mt-6 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          Sign out
        </button>
      </div>

      {/* Shake animation */}
      <style jsx>{`
        @keyframes shakeLock {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-5px); }
          30%, 70% { transform: translateX(5px); }
        }
        .animate-shake-lock {
          animation: shakeLock 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}