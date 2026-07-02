'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Send, FileText, Terminal, FolderOpen, HelpCircle,
  Shield, Lock, EyeOff, Minus, Mic, MicOff, Loader2, Radio,
} from 'lucide-react';
import { useSpeechRecognition } from '@/os/hooks/use-speech-recognition';
import { speakDirect, stopSpeaking } from '@/os/ai/brain';
import { getAppMeta } from '@/os/apps/registry';
import { useOSStore } from '@/os/store';

// ─── Local response fallback ───────────────────────────────────────
function getLocalResponse(input: string): string {
  const lower = input.toLowerCase().trim();
  if (/^(hi|hello|hey)/i.test(lower)) return 'Hello! CyberSpider at your service. What do you need?';
  if (/help/i.test(lower)) return 'I can open apps, explain commands, or generate reports. Try the quick actions below!';
  if (/notes?/i.test(lower)) return 'Opening Notes for you...';
  if (/terminal|cmd/i.test(lower)) return 'Launching Terminal...';
  if (/file|folder/i.test(lower)) return 'Opening File Manager...';
  if (/lock/i.test(lower)) return 'Locking the screen now...';
  if (/hide|close/i.test(lower)) return 'Hiding for now. Re-enable me in Settings!';
  return 'Got it! For advanced help, try the AI Assistant app.';
}

// ─── Quick actions ─────────────────────────────────────────────────
const quickActions = [
  { id: 'open-notes', label: 'Open Notes', icon: FileText, appId: 'notes' },
  { id: 'open-terminal', label: 'Open Terminal', icon: Terminal, appId: 'terminal' },
  { id: 'open-files', label: 'Open Files', icon: FolderOpen, appId: 'file-manager' },
  { id: 'security-report', label: 'Security Report', icon: Shield, appId: 'report-generator' },
  { id: 'lock-screen', label: 'Lock Screen', icon: Lock },
  { id: 'hide-me', label: 'Hide Assistant', icon: EyeOff },
];

// ─── Animation CSS keyframes ───────────────────────────────────────
const keyframeStyles = `
@keyframes cyberFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
@keyframes cyberHanging {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}
@keyframes cyberSwing {
  0%, 100% { transform: rotate(-8deg); }
  50% { transform: rotate(8deg); }
}
@keyframes cyberIdle {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.04); opacity: 0.9; }
}
@keyframes micPulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.6); }
  50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
}
`;

function getAnimationStyle(mode: string, speed: string): React.CSSProperties {
  const duration = speed === 'fast' ? '1s' : speed === 'slow' ? '4s' : '2s';
  const name = mode === 'floating' ? 'cyberFloat'
    : mode === 'hanging' ? 'cyberHanging'
    : mode === 'swinging' ? 'cyberSwing'
    : 'cyberIdle';
  return { animation: `${name} ${duration} ease-in-out infinite` };
}

// ─── CyberSpider SVG mascot ────────────────────────────────────────
function CyberSpiderSVG({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Web thread from top */}
      <line x1="40" y1="0" x2="40" y2="22" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.7" />
      {/* Body - abdomen */}
      <ellipse cx="40" cy="50" rx="16" ry="14" fill="#0a0a1a" stroke="#00e5ff" strokeWidth="1.5" />
      {/* Body - cephalothorax */}
      <ellipse cx="40" cy="32" rx="11" ry="10" fill="#0a0a1a" stroke="#00e5ff" strokeWidth="1.5" />
      {/* Abdomen pattern */}
      <path d="M34 46 Q40 40 46 46" stroke="#00e5ff" strokeWidth="1" opacity="0.5" fill="none" />
      <path d="M35 52 Q40 47 45 52" stroke="#00e5ff" strokeWidth="1" opacity="0.4" fill="none" />
      <circle cx="40" cy="43" r="2" fill="#00e5ff" opacity="0.3" />
      {/* Eyes - main */}
      <circle cx="36" cy="29" r="3.5" fill="#0a0a1a" stroke="#ff0040" strokeWidth="1" />
      <circle cx="44" cy="29" r="3.5" fill="#0a0a1a" stroke="#ff0040" strokeWidth="1" />
      {/* Eye glow */}
      <circle cx="36" cy="29" r="1.8" fill="#ff0040" opacity="0.9" />
      <circle cx="44" cy="29" r="1.8" fill="#ff0040" opacity="0.9" />
      {/* Side eyes */}
      <circle cx="32" cy="32" r="1.5" fill="#ff0040" opacity="0.5" />
      <circle cx="48" cy="32" r="1.5" fill="#ff0040" opacity="0.5" />
      {/* Left legs */}
      <path d="M29 28 Q18 22 12 28" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M29 33 Q16 30 10 38" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M29 38 Q18 40 14 48" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M31 44 Q22 50 18 58" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Right legs */}
      <path d="M51 28 Q62 22 68 28" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M51 33 Q64 30 70 38" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M51 38 Q62 40 66 48" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M49 44 Q58 50 62 58" stroke="#00e5ff" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Fangs */}
      <line x1="37" y1="38" x2="35" y2="43" stroke="#ff0040" strokeWidth="1" opacity="0.7" />
      <line x1="43" y1="38" x2="45" y2="43" stroke="#ff0040" strokeWidth="1" opacity="0.7" />
    </svg>
  );
}

// ─── Main component ────────────────────────────────────────────────
export default function FloatingAssistant() {
  const openWindow = useOSStore((s) => s.openWindow);
  const setBootPhase = useOSStore((s) => s.setBootPhase);

  // Local settings state
  const [animation] = useState<'floating' | 'hanging' | 'swinging' | 'idle'>('floating');
  const [speed] = useState<'fast' | 'normal' | 'slow'>('normal');
  const [size] = useState(80);
  const [voiceEnabled] = useState(true);
  const [enabled, setEnabled] = useState(true);

  // Position state with localStorage persistence
  const [pos, setPos] = useState<{ x: number; y: number }>(() => {
    if (typeof window === 'undefined') return { x: 24, y: 24 };
    try {
      const saved = localStorage.getItem('cyberwin_assistant_pos');
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return { x: 24, y: 24 };
  });

  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Drag state
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Speech recognition
  const {
    isListening, isSupported, interimTranscript, finalTranscript,
    startListening, stopListening,
  } = useSpeechRecognition();

  // Save position to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cyberwin_assistant_pos', JSON.stringify(pos));
    } catch { /* ignore */ }
  }, [pos]);

  // Handle final transcript from mic → send as message
  const stopListeningRef = useRef(stopListening);
  stopListeningRef.current = stopListening;

  useEffect(() => {
    if (finalTranscript) {
      handleSend(finalTranscript);
      stopListeningRef.current();
    }
  }, [finalTranscript, handleSend]);

  // ─── Drag handlers ─────────────────────────────────────────────
  const onDragStart = useCallback((clientX: number, clientY: number) => {
    isDragging.current = true;
    dragOffset.current = { x: clientX - pos.x, y: clientY - pos.y };
  }, [pos]);

  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    setPos({ x: clientX - dragOffset.current.x, y: clientY - dragOffset.current.y });
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Mouse drag
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (chatOpen) return; // don't drag when chat is open
    e.preventDefault();
    onDragStart(e.clientX, e.clientY);

    const handleMove = (ev: MouseEvent) => onDragMove(ev.clientX, ev.clientY);
    const handleUp = () => {
      onDragEnd();
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);
  }, [chatOpen, onDragStart, onDragMove, onDragEnd]);

  // Touch drag
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (chatOpen) return;
    const touch = e.touches[0];
    onDragStart(touch.clientX, touch.clientY);

    const handleMove = (ev: TouchEvent) => {
      const t = ev.touches[0];
      onDragMove(t.clientX, t.clientY);
    };
    const handleEnd = () => {
      onDragEnd();
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);
  }, [chatOpen, onDragStart, onDragMove, onDragEnd]);

  // ─── Send message ─────────────────────────────────────────────
  const handleSend = useCallback(async (text?: string) => {
    const msgText = (text || input).trim();
    if (!msgText || isLoading) return;

    const userMsg = { role: 'user', content: msgText };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })) }),
      });
      const data = await res.json();
      const aiText = data?.text || getLocalResponse(msgText);
      setMessages((prev) => [...prev, { role: 'assistant', content: aiText }]);
      if (voiceEnabled) speakDirect(aiText);
    } catch {
      const localResp = getLocalResponse(msgText);
      setMessages((prev) => [...prev, { role: 'assistant', content: localResp }]);
      if (voiceEnabled) speakDirect(localResp);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages, voiceEnabled]);

  // ─── Quick action handler ─────────────────────────────────────
  const handleQuickAction = useCallback((action: typeof quickActions[number]) => {
    if (action.id === 'lock-screen') {
      setBootPhase('locked');
      setChatOpen(false);
      return;
    }
    if (action.id === 'hide-me') {
      setEnabled(false);
      setChatOpen(false);
      return;
    }
    if (action.appId) {
      const meta = getAppMeta(action.appId);
      if (meta) {
        openWindow(action.appId, meta.title, meta.defaultWidth, meta.defaultHeight, meta.minWidth, meta.minHeight);
      }
      setChatOpen(false);
    }
  }, [openWindow, setBootPhase]);

  // ─── Toggle mic ───────────────────────────────────────────────
  const toggleMic = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  if (!enabled) return null;

  return (
    <>
      <style>{keyframeStyles}</style>
      <div
        ref={containerRef}
        data-no-wallpaper-menu
        className="fixed z-[9999] select-none"
        style={{ left: pos.x, top: pos.y }}
      >
        {/* Chat bubble — appears ABOVE the mascot */}
        {chatOpen && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Arrow pointing down */}
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-[#0c1222]/95 border-b border-r border-white/10" />

            <div className="rounded-xl bg-[#0c1222]/95 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-500/5 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
                <Radio size={14} className="text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-300 tracking-widest">CYBERSPIDER AI</span>
                <span className="ml-auto flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-[10px] text-green-400">ONLINE</span>
                </span>
                <button
                  onClick={() => setChatOpen(false)}
                  className="ml-1 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label="Minimize"
                >
                  <Minus size={14} />
                </button>
              </div>

              {/* Messages area */}
              <div className="max-h-48 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {messages.length === 0 && (
                  <div className="text-center text-gray-500 text-xs py-4">
                    <HelpCircle size={20} className="mx-auto mb-1 text-cyan-500/40" />
                    <p>Click a quick action or type a message</p>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-xs leading-relaxed rounded-lg px-2.5 py-2 ${
                      msg.role === 'user'
                        ? 'bg-cyan-600/15 text-cyan-100 ml-6 border border-cyan-500/10'
                        : 'bg-white/[0.04] text-gray-300 mr-6 border border-white/[0.06]'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-1 px-2.5 py-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                )}
              </div>

              {/* Interim transcript */}
              {isListening && interimTranscript && (
                <div className="px-3 py-1 text-[10px] text-red-400/80 italic truncate border-t border-white/[0.04]">
                  🎤 {interimTranscript}
                </div>
              )}

              {/* Input row */}
              <div className="flex items-center gap-1.5 px-3 py-2 border-t border-white/[0.06]">
                {isSupported && (
                  <button
                    onClick={toggleMic}
                    className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-white/[0.06] text-gray-400 hover:text-cyan-400'
                    }`}
                    style={isListening ? { animation: 'micPulse 1.5s ease-in-out infinite' } : undefined}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
                  >
                    {isListening ? <Mic size={13} /> : <MicOff size={13} />}
                  </button>
                )}
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={isListening ? '🎤 Listening...' : 'Ask CyberSpider...'}
                  className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 outline-none focus:border-cyan-500/30 transition-colors"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading || !input.trim()}
                  className="shrink-0 w-7 h-7 rounded-full bg-cyan-600/80 hover:bg-cyan-500 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors"
                  aria-label="Send"
                >
                  {isLoading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                </button>
              </div>

              {/* Quick actions */}
              <div className="flex flex-wrap gap-1 px-3 py-2 border-t border-white/[0.04]">
                {quickActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleQuickAction(action)}
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-gray-400 hover:text-cyan-300 hover:border-cyan-500/20 transition-colors"
                  >
                    <action.icon size={10} />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mascot — click to toggle chat */}
        <div
          className="cursor-pointer"
          style={getAnimationStyle(animation, speed)}
          onClick={() => {
            if (!isDragging.current) setChatOpen((prev) => !prev);
          }}
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
          role="button"
          tabIndex={0}
          aria-label="Toggle CyberSpider assistant"
        >
          <CyberSpiderSVG size={size} />
        </div>
      </div>
    </>
  );
}