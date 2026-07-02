'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AppProps } from '@/os/types';

interface LogEntry {
  id: number;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  source: string;
  message: string;
}

const sampleLogs: Omit<LogEntry, 'id'>[] = [
  { timestamp: '2024-01-22 14:32:15', level: 'INFO', source: 'firewall', message: 'Connection allowed: 192.168.1.100:443 → 10.0.0.1:443 [TCP]' },
  { timestamp: '2024-01-22 14:31:58', level: 'WARN', source: 'ids', message: 'Anomalous traffic pattern detected from 203.0.113.42' },
  { timestamp: '2024-01-22 14:31:44', level: 'ERROR', source: 'auth', message: 'Failed login attempt for user "admin" from 45.33.32.156 (3rd attempt)' },
  { timestamp: '2024-01-22 14:31:30', level: 'INFO', source: 'system', message: 'Cron job "daily-scan" started successfully' },
  { timestamp: '2024-01-22 14:31:12', level: 'DEBUG', source: 'network', message: 'DNS query resolved: api.cyberwin.local → 10.0.0.5 (2ms)' },
  { timestamp: '2024-01-22 14:30:55', level: 'INFO', source: 'firewall', message: 'Connection blocked: 198.51.100.23:23 → 10.0.0.1:23 [TCP] (Rule #7)' },
  { timestamp: '2024-01-22 14:30:42', level: 'ERROR', source: 'ssl', message: 'Certificate verification failed for external-api.example.com: self-signed certificate' },
  { timestamp: '2024-01-22 14:30:28', level: 'WARN', source: 'system', message: 'High memory usage detected: 87% (14.0 GB / 16.0 GB)' },
  { timestamp: '2024-01-22 14:30:15', level: 'INFO', source: 'updates', message: 'Security patches available: 3 critical, 5 moderate' },
  { timestamp: '2024-01-22 14:29:58', level: 'DEBUG', source: 'firewall', message: 'Rule evaluation: src=192.168.1.50 dst=10.0.0.1 port=8080 proto=TCP → ALLOW (Rule #1)' },
  { timestamp: '2024-01-22 14:29:40', level: 'INFO', source: 'ids', message: 'Port scan detected from 192.168.1.200: ports 1-1024 (24 open found)' },
  { timestamp: '2024-01-22 14:29:22', level: 'ERROR', source: 'database', message: 'Connection pool exhausted: max connections (100) reached' },
  { timestamp: '2024-01-22 14:29:10', level: 'WARN', source: 'auth', message: 'User "scanner" granted elevated privileges via sudo' },
  { timestamp: '2024-01-22 14:28:55', level: 'INFO', source: 'firewall', message: 'New rule added: DENY TCP from 10.0.0.0/8 to *:445 (Block SMB)' },
  { timestamp: '2024-01-22 14:28:38', level: 'DEBUG', source: 'system', message: 'Process started: /usr/bin/cyber-scan --target 192.168.1.0/24 --mode full' },
  { timestamp: '2024-01-22 14:28:20', level: 'INFO', source: 'vpn', message: 'WireGuard tunnel established: peer=10.0.0.2 endpoint=vpn.cyberwin.local:51820' },
  { timestamp: '2024-01-22 14:28:05', level: 'ERROR', source: 'ids', message: 'Signature match: ET DROP Suspicious inbound to SSH port 22' },
  { timestamp: '2024-01-22 14:27:48', level: 'WARN', source: 'disk', message: 'Disk usage at 82% on /var/log - consider rotation' },
  { timestamp: '2024-01-22 14:27:30', level: 'INFO', source: 'system', message: 'Service "cyber-monitor" restarted (uptime: 0s, PID: 12458)' },
  { timestamp: '2024-01-22 14:27:15', level: 'DEBUG', source: 'network', message: 'ARP table updated: 192.168.1.1 → aa:bb:cc:dd:ee:01 (eth0)' },
  { timestamp: '2024-01-22 14:26:58', level: 'INFO', source: 'firewall', message: 'Connection allowed: 192.168.1.100:53 → 1.1.1.1:53 [UDP]' },
  { timestamp: '2024-01-22 14:26:40', level: 'ERROR', source: 'auth', message: 'SSH key authentication failed for "deploy" from 10.0.0.50: invalid key format' },
];

const liveMessages = [
  { level: 'INFO' as const, source: 'firewall', message: 'Rate limit applied: 192.168.1.150 exceeded 100 req/min on port 80' },
  { level: 'DEBUG' as const, source: 'network', message: 'TCP connection established: 192.168.1.80:52431 → 10.0.0.1:443' },
  { level: 'WARN' as const, source: 'ids', message: 'Potential DNS tunneling detected from 192.168.1.200' },
  { level: 'INFO' as const, source: 'system', message: 'Log rotation completed: /var/log/cyberwin.log (rotated to .1)' },
  { level: 'ERROR' as const, source: 'ssl', message: 'TLS handshake failed with legacy client: unsupported cipher suite' },
  { level: 'INFO' as const, source: 'firewall', message: 'Connection blocked: 45.33.32.156:3389 → 10.0.0.1:3389 [TCP] (Rule #3)' },
];

function levelColor(level: string) {
  switch (level) {
    case 'INFO': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
    case 'WARN': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'ERROR': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'DEBUG': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    default: return 'bg-gray-500/20 text-gray-400';
  }
}

function getTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
}

export default function LogViewerApp({ windowId: _windowId }: AppProps) {
  const [logs, setLogs] = useState<LogEntry[]>(() =>
    sampleLogs.map((l, i) => ({ ...l, id: i }))
  );
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [logId, setLogId] = useState(sampleLogs.length);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      const msg = liveMessages[Math.floor(Math.random() * liveMessages.length)];
      const newLog: LogEntry = { ...msg, id: logId, timestamp: getTimestamp() };
      setLogId((p) => p + 1);
      setLogs((prev) => [...prev, newLog]);
    }, 3000);
    return () => clearInterval(interval);
  }, [autoRefresh, logId]);

  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current;
      const viewport = el.closest('[data-radix-scroll-area-viewport]') || el.parentElement;
      if (viewport) viewport.scrollTop = viewport.scrollHeight;
    }
  }, [logs]);

  const filteredLogs = logs.filter((log) => {
    if (filter !== 'All' && log.level !== filter) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase()) && !log.source.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const clearLogs = () => setLogs([]);

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] shrink-0">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-7 w-28 text-xs bg-white/[0.04] border-white/[0.06]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Levels</SelectItem>
            <SelectItem value="INFO">INFO</SelectItem>
            <SelectItem value="WARN">WARN</SelectItem>
            <SelectItem value="ERROR">ERROR</SelectItem>
            <SelectItem value="DEBUG">DEBUG</SelectItem>
          </SelectContent>
        </Select>
        <div className="relative flex-1 max-w-xs">
          <Input
            placeholder="Search logs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-7 text-xs bg-white/[0.04] border-white/[0.06] pl-2"
          />
        </div>
        <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer ml-auto">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="accent-cyan-500"
          />
          Auto-refresh
        </label>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={clearLogs}>
          <RefreshCw size={13} />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {}}>
          <Download size={13} />
        </Button>
      </div>

      {/* Log entries count */}
      <div className="flex items-center gap-3 px-3 py-1 text-[10px] text-gray-500 border-b border-white/[0.04] shrink-0">
        <span>{filteredLogs.length} entries</span>
        <span>·</span>
        <span className="text-cyan-400">{logs.filter((l) => l.level === 'INFO').length} INFO</span>
        <span className="text-yellow-400">{logs.filter((l) => l.level === 'WARN').length} WARN</span>
        <span className="text-red-400">{logs.filter((l) => l.level === 'ERROR').length} ERROR</span>
        <span className="text-gray-400">{logs.filter((l) => l.level === 'DEBUG').length} DEBUG</span>
      </div>

      {/* Log List */}
      <ScrollArea className="flex-1">
        <div className="font-mono text-xs" ref={scrollRef}>
          {filteredLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 px-3 py-1.5 hover:bg-white/[0.02] border-b border-white/[0.02]">
              <span className="text-gray-600 shrink-0 text-[11px]">{log.timestamp}</span>
              <Badge variant="outline" className={`shrink-0 text-[9px] px-1.5 py-0 font-mono min-w-[48px] justify-center ${levelColor(log.level)}`}>
                {log.level}
              </Badge>
              <span className="text-purple-400 shrink-0 w-20 text-[11px]">[{log.source}]</span>
              <span className="text-gray-300 text-[11px] leading-relaxed">{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}