'use client';

import React, { useState, useCallback } from 'react';
import { useOSStore } from '@/os/store';
import { authenticate, AuthCredentials } from '@/os/lib/auth';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

type FieldError = string | null;

export default function LoginScreen() {
  const { setBootPhase, setAuthenticated, username, setUsername } = useOSStore();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    username: FieldError;
    password: FieldError;
  }>({ username: null, password: null });
  const [loading, setLoading] = useState(false);
  const [shaking, setShaking] = useState(false);

  /** Client-side field validation before calling the auth service */
  const validateFields = useCallback((): boolean => {
    const errors = { username: null as FieldError, password: null as FieldError };
    let valid = true;

    if (!username.trim()) {
      errors.username = 'Username is required';
      valid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      valid = false;
    }

    setFieldErrors(errors);
    return valid;
  }, [username, password]);

  /** Trigger a shake animation on the form card */
  const triggerShake = useCallback(() => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  }, []);

  const handleLogin = useCallback(async () => {
    setFormError(null);

    if (!validateFields()) return;

    setLoading(true);

    try {
      const credentials: AuthCredentials = { username: username.trim(), password };
      const result = await authenticate(credentials);

      if (result.success) {
        setAuthenticated(username.trim());
        setBootPhase('desktop');
      } else {
        setFormError(result.error ?? 'Authentication failed');
        triggerShake();
      }
    } catch {
      setFormError('An unexpected error occurred. Please try again.');
      triggerShake();
    } finally {
      setLoading(false);
    }
  }, [username, password, validateFields, triggerShake, setAuthenticated, setBootPhase]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin();
  };

  return (
    <div
      className="fixed inset-0 z-[998] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0a0a1a 0%, #0a1628 40%, #0d0a1a 100%)',
      }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.05] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />

      <div className="relative z-10 w-full max-w-sm px-6">
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-600/30 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <User size={36} className="text-cyan-400/80" />
          </div>
        </div>

        {/* Login Form Card */}
        <div
          className={`glass rounded-2xl p-6 transition-transform ${
            shaking ? 'animate-shake' : ''
          }`}
          style={{
            background: 'rgba(10,10,20,0.6)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <h2 className="text-center text-lg font-semibold text-white mb-1">
            Sign In
          </h2>
          <p className="text-center text-xs text-gray-500 mb-6">
            CyberWin AI OS v2.0
          </p>

          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">
                Username
              </label>
              <div
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.04] border transition-colors ${
                  fieldErrors.username
                    ? 'border-red-500/50 focus-within:border-red-500/70'
                    : 'border-white/[0.06] focus-within:border-cyan-500/30'
                }`}
              >
                <User size={14} className="text-gray-500 shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: null }));
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-600"
                  placeholder="Enter username"
                  autoFocus
                  autoComplete="username"
                  spellCheck={false}
                />
              </div>
              {fieldErrors.username && (
                <p className="text-[11px] text-red-400 mt-1 pl-1">{fieldErrors.username}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="text-[11px] text-gray-400 uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.04] border transition-colors ${
                  fieldErrors.password
                    ? 'border-red-500/50 focus-within:border-red-500/70'
                    : 'border-white/[0.06] focus-within:border-cyan-500/30'
                }`}
              >
                <Lock size={14} className="text-gray-500 shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: null }));
                  }}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-sm text-gray-200 outline-none placeholder:text-gray-600"
                  placeholder="Enter password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[11px] text-red-400 mt-1 pl-1">{fieldErrors.password}</p>
              )}
            </div>

            {/* Form-level Error */}
            {formError && (
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
                <AlertCircle size={14} className="text-red-400 shrink-0" />
                <p className="text-xs text-red-400">{formError}</p>
              </div>
            )}

            {/* Sign In Button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="w-full h-10 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-black font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-5 pt-4 border-t border-white/[0.04]">
            <p className="text-[10px] text-gray-600 text-center mb-2">Demo Credentials</p>
            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500">
              <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04] font-mono">
                dev
              </span>
              <span className="text-gray-700">/</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.04] font-mono">
                cyberwin123
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Shake animation styles */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 50%, 90% { transform: translateX(-6px); }
          30%, 70% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}