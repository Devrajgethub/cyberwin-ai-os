'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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

function generateAIResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('scan') || lower.includes('vulnerability') || lower.includes('vuln')) {
    return 'I can help with vulnerability scanning. Based on the current system configuration, I recommend:\n\n1. **Run a full port scan**: Use `nmap -sV -sC 192.168.1.0/24` to identify open services\n2. **Check for known CVEs**: Cross-reference discovered services against the NVD database\n3. **Review firewall rules**: Ensure no unnecessary ports are exposed\n\nThe Security Dashboard shows 1 critical and 2 high-severity vulnerabilities that need immediate attention. Would you like me to provide more details on any of these?';
  }
  if (lower.includes('network') || lower.includes('connection') || lower.includes('traffic')) {
    return 'Network analysis summary:\n\n📊 **Current Status**: 24 active connections\n📈 **Bandwidth**: ~2.5 Mbps down, ~400 Kbps up\n🔒 **Firewall**: Active with 10 rules (7 allow, 3 deny)\n\nRecent activity shows normal traffic patterns with a few notable events:\n- Port scan detected from 192.168.1.200 at 14:31\n- Unusual outbound traffic on port 4444 at 13:45\n- Rate limiting applied to 192.168.1.150\n\nWould you like me to investigate any specific connection or traffic pattern?';
  }
  if (lower.includes('firewall') || lower.includes('rule') || lower.includes('block')) {
    return 'Firewall status: **ACTIVE** ✅\n\nCurrent configuration:\n- **10 total rules** (8 active, 2 inactive)\n- **Allow rules**: 6 (HTTPS, HTTP, DNS, MySQL from LAN, SSH from LAN)\n- **Deny rules**: 4 (External SSH, ICMP from internal, Telnet, SMB)\n\n⚠️ **Recommendations**:\n1. Consider blocking port 445 (SMB) from all external sources\n2. Enable the WireGuard VPN rule for secure remote access\n3. Add rate limiting rules for SSH to prevent brute force\n\nShall I help you create a new firewall rule?';
  }
  if (lower.includes('log') || lower.includes('audit') || lower.includes('event')) {
    return 'Log analysis results:\n\n📋 **Total entries**: 22+ recorded events\n🔴 **Errors** (3): Failed login attempts, SSL cert issues, DB connection pool\n🟡 **Warnings** (4): Anomalous traffic, high memory, DNS tunneling, disk usage\n🟢 **Info** (12): Normal operations, connection logs, updates\n\n**Key findings**:\n- Multiple failed SSH login attempts from 45.33.32.156 — consider blocking this IP\n- Memory usage at 87% — monitor for potential memory leak\n- Self-signed certificate detected on external API connection\n\nI recommend running a full audit report. Would you like me to generate one?';
  }
  if (lower.includes('help') || lower.includes('what can')) {
    return 'I\'m CyberWin AI Assistant. Here\'s what I can help with:\n\n🔍 **Security Analysis**\n- Vulnerability scanning and assessment\n- Threat detection and response\n- Security event analysis\n\n🌐 **Network Tools**\n- Network traffic monitoring\n- Connection analysis\n- DNS and routing diagnostics\n\n🛡️ **Firewall Management**\n- Rule creation and review\n- Traffic filtering recommendations\n- Access control policies\n\n📋 **System Administration**\n- Log analysis and reporting\n- System health monitoring\n- Configuration recommendations\n\nJust ask me about any security or system topic!';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! 👋 Welcome to CyberWin AI Assistant.\n\nI\'m here to help you with cybersecurity operations, network analysis, and system management. The system is currently showing **LOW** threat level with all security services running normally.\n\nHow can I assist you today?';
  }

  const responses = [
    'I\'ve analyzed your request. Based on the current system state, everything appears to be operating within normal parameters. The threat level remains LOW and all security services are active.\n\nIs there a specific aspect you\'d like me to investigate further?',
    'That\'s a good question. From a security perspective, I\'d recommend:\n\n1. Regular vulnerability assessments\n2. Network segmentation monitoring\n3. Log review and anomaly detection\n4. Keeping all systems patched\n\nThe current system shows 24 active connections with the firewall actively filtering traffic. All critical services are operational.',
    'Based on the current system telemetry, here\'s what I can tell you:\n\n- System uptime: 3 days, 7 hours\n- Active security events: 0 critical in the last hour\n- Network bandwidth: Within normal range\n- Disk usage: 82% (monitor /var/log)\n\nWould you like me to dig deeper into any of these metrics?',
  ];
  return responses[Math.floor(Math.random() * responses.length)];
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
  const [msgId, setMsgId] = useState(1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: msgId, role: 'user', content: input.trim(), timestamp: getTimestamp() };
    setMsgId((p) => p + 1);
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    const userText = input.trim();
    setTimeout(() => {
      const response = generateAIResponse(userText);
      const aiMsg: ChatMessage = { id: msgId + 1, role: 'assistant', content: response, timestamp: getTimestamp() };
      setMsgId((p) => p + 2);
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
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
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1" ref={scrollRef}>
        <div className="p-4 space-y-4">
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

      {/* Input */}
      <div className="border-t border-white/[0.06] p-3 shrink-0">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about security..."
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