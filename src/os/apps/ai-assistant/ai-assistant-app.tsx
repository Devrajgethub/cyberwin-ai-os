'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSpeechRecognition } from '@/os/hooks/use-speech-recognition';
import { speakDirect, stopSpeaking } from '@/os/ai/brain';
import type { AppProps } from '@/os/types';

interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

function getTimestamp() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function generateLocalResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('scan') || lower.includes('vulnerability') || lower.includes('vuln')) {
    return 'I can help with vulnerability scanning. Based on the current system configuration, I recommend:\n\n1. **Run a full port scan**: Use `nmap -sV -sC 192.168.1.0/24` to identify open services\n2. **Check for known CVEs**: Cross-reference discovered services against the NVD database\n3. **Review firewall rules**: Ensure no unnecessary ports are exposed\n\nThe Security Dashboard shows 1 critical and 2 high-severity vulnerabilities that need immediate attention.';
  }
  if (lower.includes('network') || lower.includes('connection') || lower.includes('traffic')) {
    return 'Network analysis summary:\n\n📊 **Current Status**: 24 active connections\n📈 **Bandwidth**: ~2.5 Mbps down, ~400 Kbps up\n🔒 **Firewall**: Active with 10 rules (7 allow, 3 deny)\n\nRecent activity shows normal traffic patterns with a few notable events:\n- Port scan detected from 192.168.1.200 at 14:31\n- Unusual outbound traffic on port 4444 at 13:45';
  }
  if (lower.includes('firewall') || lower.includes('rule') || lower.includes('block')) {
    return 'Firewall status: **ACTIVE** ✅\n\nCurrent configuration:\n- **10 total rules** (8 active, 2 inactive)\n- **Allow rules**: 6 (HTTPS, HTTP, DNS, MySQL from LAN, SSH from LAN)\n- **Deny rules**: 4 (External SSH, ICMP from internal, Telnet, SMB)\n\n⚠️ **Recommendations**:\n1. Block port 445 (SMB) from all external sources\n2. Enable WireGuard VPN rule for secure remote access';
  }
  if (lower.includes('help') || lower.includes('what can')) {
    return "I'm **CyberWin AI Assistant**. I can help with:\n\n🔍 **Security Analysis** — Vulnerability scanning, threat detection\n🌐 **Network Tools** — Traffic monitoring, DNS diagnostics\n🛡️ **Firewall** — Rule management, access control\n📋 **System Admin** — Log analysis, health monitoring\n\nJust ask me anything!";
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! 👋 Welcome to **CyberWin AI Assistant**.\n\nSystem showing **LOW** threat level with all security services running normally.\n\nHow can I assist you today?';
  }
  return 'Based on the current system state, everything is operating within normal parameters. The threat level remains **LOW** and all security services are active.\n\nIs there a specific aspect you\'d like me to investigate further?';
}

export default function AIAssistantApp({ windowId: _windowId }: AppProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      role: 'assistant',
      content: 'Hello! I\'m **CyberWin AI Assistant**. I can help with security analysis, network diagnostics, and system management. How can I help you today?',
      timestamp: getTimestamp(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [msgId, setMsgId] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    isListening, isSupported, interimTranscript, finalTranscript,
    startListening, stopListening,
  } = useSpeechRecognition();

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const viewport = el.closest('[data-radix-scroll-area-viewport]') || el.parentElement;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages, isTyping]);

  // Mic transcript → auto-send
  useEffect(() => {
    if (finalTranscript) {
      setInput(finalTranscript);
      stopListening();
    }
  }, [finalTranscript, stopListening]);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    const userMsg: ChatMessage = { id: msgId, role: 'user', content: userText, timestamp: getTimestamp() };
    const nextId = msgId + 1;
    setMsgId(nextId + 1);
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    inputRef.current?.focus();

    // Try real API first, fallback to local
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: userText }] }),
      });
      const data = await res.json();
      const aiText = data?.text || generateLocalResponse(userText);
      const aiMsg: ChatMessage = { id: nextId, role: 'assistant', content: aiText, timestamp: getTimestamp() };
      setMessages((prev) => [...prev, aiMsg]);
      if (voiceEnabled) speakDirect(aiText);
    } catch {
      // Fallback to local response
      const response = generateLocalResponse(userText);
      const aiMsg: ChatMessage = { id: nextId, role: 'assistant', content: response, timestamp: getTimestamp() };
      setMessages((prev) => [...prev, aiMsg]);
      if (voiceEnabled) speakDirect(response);
    } finally {
      setIsTyping(false);
    }
  }, [input, msgId, voiceEnabled]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] shrink-0">
        <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center">
          <Bot size={15} className="text-cyan-400" />
        </div>
        <div>
          <div className="text-sm font-medium text-gray-200">CyberWin AI</div>
          <div className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
            Online
          </div>
        </div>
        <button
          onClick={() => setVoiceEnabled((v) => !v)}
          className={`ml-auto text-xs px-2 py-1 rounded-md transition-colors ${
            voiceEnabled ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/[0.04] text-gray-500'
          }`}
          title={voiceEnabled ? 'Voice ON' : 'Voice OFF'}
        >
          {voiceEnabled ? '🔊' : '🔇'}
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4" ref={scrollRef}>
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <Avatar className="h-7 w-7 shrink-0 mt-0.5">
                <AvatarFallback className={`text-[11px] ${msg.role === 'user' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </AvatarFallback>
              </Avatar>
              <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-cyan-600/20 text-cyan-100 border border-cyan-500/20'
                  : 'bg-white/[0.04] text-gray-200 border border-white/[0.06]'
              }`}>
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div className={`text-[10px] mt-1.5 ${msg.role === 'user' ? 'text-cyan-400/50' : 'text-gray-600'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarFallback className="bg-cyan-500/20 text-cyan-400 text-[11px]">
                  <Bot size={14} />
                </AvatarFallback>
              </Avatar>
              <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full bg-cyan-400/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Mic interim transcript */}
      {isListening && interimTranscript && (
        <div className="px-4 py-1 text-[11px] text-red-400/80 italic truncate border-t border-white/[0.04]">
          🎤 {interimTranscript}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-white/[0.06] p-3 shrink-0">
        <div className="flex items-center gap-2">
          {isSupported && (
            <button
              onClick={toggleMic}
              className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/[0.04] text-gray-400 hover:text-cyan-400'
              }`}
              style={isListening ? { animation: 'micPulse 1.5s ease-in-out infinite' } : undefined}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              {isListening ? <Mic size={16} /> : <MicOff size={16} />}
            </button>
          )}
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isListening ? '🎤 Listening...' : 'Ask me anything about security...'}
            className="bg-white/[0.04] border-white/[0.06] text-sm"
            disabled={isTyping}
          />
          <Button
            size="icon"
            className="h-9 w-9 bg-cyan-600 hover:bg-cyan-500 shrink-0"
            onClick={sendMessage}
            disabled={isTyping || !input.trim()}
          >
            {isTyping ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
}