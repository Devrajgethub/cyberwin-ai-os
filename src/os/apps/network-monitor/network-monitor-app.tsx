'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AppProps } from '@/os/types';

interface Packet {
  id: number;
  time: string;
  src: string;
  dst: string;
  protocol: string;
  size: string;
  status: 'Allowed' | 'Blocked' | 'Warning';
}

const protocols = ['TCP', 'UDP', 'ICMP', 'DNS', 'HTTP', 'HTTPS'];
const statuses: Packet['status'][] = ['Allowed', 'Blocked', 'Warning'];

function randomIP() {
  return `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
}

function randomSize() {
  return `${(Math.random() * 1500 + 40).toFixed(0)} B`;
}

function generatePacket(id: number, filter: string): Packet {
  let protocol = protocols[Math.floor(Math.random() * protocols.length)];
  if (filter !== 'All') protocol = filter;
  const status = Math.random() > 0.85 ? 'Blocked' : Math.random() > 0.9 ? 'Warning' : 'Allowed';
  const now = new Date();
  return {
    id,
    time: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`,
    src: randomIP(),
    dst: randomIP(),
    protocol,
    size: randomSize(),
    status,
  };
}

function initChartData() {
  const data = [];
  for (let i = 0; i < 20; i++) {
    data.push({
      time: `-${20 - i}s`,
      upload: Math.floor(Math.random() * 500 + 100),
      download: Math.floor(Math.random() * 2000 + 500),
    });
  }
  return data;
}

export default function NetworkMonitorApp({ windowId: _windowId }: AppProps) {
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [filter, setFilter] = useState('All');
  const [packets, setPackets] = useState<Packet[]>(() => {
    const init: Packet[] = [];
    for (let i = 0; i < 15; i++) init.push(generatePacket(i, 'All'));
    return init;
  });
  const [chartData, setChartData] = useState(initChartData);
  const [totalPackets, setTotalPackets] = useState(0);
  const [bandwidth, setBandwidth] = useState({ up: 0, down: 0 });
  const packetIdRef = useRef(15);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMonitoring) return;
    const interval = setInterval(() => {
      packetIdRef.current++;
      const newPacket = generatePacket(packetIdRef.current, filter);
      setPackets((prev) => {
        const next = [...prev, newPacket];
        if (next.length > 100) next.shift();
        return next;
      });
      setTotalPackets((p) => p + 1);
      const up = Math.floor(Math.random() * 500 + 100);
      const down = Math.floor(Math.random() * 2000 + 500);
      setBandwidth({ up, down });
      setChartData((prev) => {
        const next = [...prev.slice(1), { time: 'now', upload: up, download: down }];
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [isMonitoring, filter]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [packets]);

  const statusColor = (s: string) => {
    if (s === 'Allowed') return 'bg-green-500/20 text-green-400';
    if (s === 'Blocked') return 'bg-red-500/20 text-red-400';
    return 'bg-yellow-500/20 text-yellow-400';
  };

  const protocolColor = (p: string) => {
    if (p === 'HTTPS' || p === 'HTTP') return 'text-cyan-400';
    if (p === 'DNS') return 'text-purple-400';
    if (p === 'TCP') return 'text-green-400';
    if (p === 'UDP') return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06] shrink-0">
        <Button
          variant={isMonitoring ? 'destructive' : 'default'}
          size="sm"
          className="h-7 text-xs gap-1"
          onClick={() => setIsMonitoring(!isMonitoring)}
        >
          {isMonitoring ? <Pause size={12} /> : <Play size={12} />}
          {isMonitoring ? 'Stop' : 'Start'}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => {
          setPackets([]);
          setTotalPackets(0);
          setChartData(initChartData());
        }}>
          <RefreshCw size={13} />
        </Button>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-7 w-28 text-xs bg-white/[0.04] border-white/[0.06]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Protocols</SelectItem>
            {protocols.map((p) => (
              <SelectItem key={p} value={p}>{p}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart */}
      <div className="px-3 pt-3 shrink-0">
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="time" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
              <Tooltip contentStyle={{ background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: 11 }} />
              <Area type="monotone" dataKey="download" stroke="#06b6d4" fill="rgba(6,182,212,0.1)" strokeWidth={1.5} />
              <Area type="monotone" dataKey="upload" stroke="#a855f7" fill="rgba(168,85,247,0.1)" strokeWidth={1.5} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 px-3 py-2 shrink-0">
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-2 flex items-center gap-2">
            <div className="text-[10px] text-gray-500 uppercase">Packets</div>
            <div className="text-sm font-bold text-white ml-auto">{totalPackets}</div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-2 flex items-center gap-2">
            <div className="text-[10px] text-gray-500 uppercase">↓ Down</div>
            <div className="text-sm font-bold text-cyan-400 ml-auto">{(bandwidth.down / 1000).toFixed(1)} KB/s</div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-2 flex items-center gap-2">
            <div className="text-[10px] text-gray-500 uppercase">↑ Up</div>
            <div className="text-sm font-bold text-purple-400 ml-auto">{(bandwidth.up / 1000).toFixed(1)} KB/s</div>
          </CardContent>
        </Card>
      </div>

      {/* Packet Table */}
      <div className="flex-1 min-h-0 px-3 pb-3">
        <ScrollArea className="h-full" ref={scrollRef}>
          <div className="font-mono text-[11px]">
            <div className="grid grid-cols-[70px_1fr_1fr_60px_60px_60px] gap-1 text-gray-500 uppercase tracking-wider text-[9px] px-2 py-1 border-b border-white/[0.04] sticky top-0 bg-[#0a0a0f]">
              <span>Time</span><span>Source</span><span>Destination</span><span>Proto</span><span>Size</span><span>Status</span>
            </div>
            {packets.map((pkt) => (
              <div key={pkt.id} className="grid grid-cols-[70px_1fr_1fr_60px_60px_60px] gap-1 px-2 py-1 hover:bg-white/[0.02] border-b border-white/[0.02]">
                <span className="text-gray-500">{pkt.time.split('.')[0]}</span>
                <span className="text-gray-300 truncate">{pkt.src}</span>
                <span className="text-gray-300 truncate">{pkt.dst}</span>
                <span className={protocolColor(pkt.protocol)}>{pkt.protocol}</span>
                <span className="text-gray-400">{pkt.size}</span>
                <span><Badge variant="outline" className={`text-[9px] px-1 py-0 ${statusColor(pkt.status)}`}>{pkt.status}</Badge></span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}