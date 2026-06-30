'use client';

import React from 'react';
import { Shield, Wifi, ShieldAlert, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { AppProps } from '@/os/types';

const threatData = [
  { day: 'Mon', threats: 12 },
  { day: 'Tue', threats: 19 },
  { day: 'Wed', threats: 8 },
  { day: 'Thu', threats: 24 },
  { day: 'Fri', threats: 15 },
  { day: 'Sat', threats: 6 },
  { day: 'Sun', threats: 3 },
];

const securityEvents = [
  { time: '14:32:15', severity: 'high', desc: 'Failed SSH login attempt from 45.33.32.156' },
  { time: '14:28:42', severity: 'medium', desc: 'Port scan detected from 192.168.1.200' },
  { time: '14:15:03', severity: 'low', desc: 'Firewall rule updated: blocked port 23' },
  { time: '13:58:21', severity: 'info', desc: 'System update check completed' },
  { time: '13:45:10', severity: 'critical', desc: 'SQL injection attempt blocked on /api/users' },
  { time: '13:30:55', severity: 'low', desc: 'New certificate deployed for api.cyberwin.local' },
  { time: '13:12:44', severity: 'medium', desc: 'Unusual outbound traffic on port 4444' },
  { time: '12:58:30', severity: 'info', desc: 'Daily vulnerability scan completed' },
  { time: '12:40:15', severity: 'high', desc: 'Brute force attack detected on admin panel' },
  { time: '12:22:08', severity: 'low', desc: 'Backup completed successfully' },
];

const vulnerabilities = [
  { name: 'CVE-2024-0001', severity: 'critical', status: 'Open', cvss: 9.8 },
  { name: 'CVE-2024-0015', severity: 'high', status: 'In Progress', cvss: 7.5 },
  { name: 'CVE-2024-0023', severity: 'high', status: 'Open', cvss: 7.2 },
  { name: 'CVE-2023-4448', severity: 'medium', status: 'Patched', cvss: 5.3 },
  { name: 'CVE-2023-3891', severity: 'medium', status: 'Open', cvss: 4.8 },
  { name: 'CVE-2024-0102', severity: 'low', status: 'Patched', cvss: 3.1 },
];

function severityColor(sev: string) {
  switch (sev) {
    case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
    case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    default: return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
  }
}

function statusColor(status: string) {
  switch (status) {
    case 'Open': return 'text-red-400';
    case 'In Progress': return 'text-yellow-400';
    case 'Patched': return 'text-green-400';
    default: return 'text-gray-400';
  }
}

export default function SecurityDashboardApp({ windowId: _windowId }: AppProps) {
  return (
    <div className="h-full w-full overflow-y-auto p-4 bg-black/20">
      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Shield size={20} className="text-green-400" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Threat Level</div>
              <div className="text-lg font-bold text-green-400">LOW</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Wifi size={20} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Connections</div>
              <div className="text-lg font-bold text-white">24</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <ShieldAlert size={20} className="text-orange-400" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Blocked</div>
              <div className="text-lg font-bold text-white">1,247</div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Heart size={20} className="text-purple-400" />
            </div>
            <div>
              <div className="text-[11px] text-gray-500 uppercase tracking-wider">Health</div>
              <div className="text-lg font-bold text-white">98%</div>
              <Progress value={98} className="h-1 mt-1" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-white/[0.03] border-white/[0.06] mb-4">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-medium text-gray-300">Threat Activity — Last 7 Days</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={threatData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.06)' }} />
                <Tooltip
                  contentStyle={{ background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: 12 }}
                  labelStyle={{ color: '#9ca3af' }}
                />
                <Line type="monotone" dataKey="threats" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Events + Vulnerabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-gray-300">Recent Security Events</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-56">
              <div className="space-y-2">
                {securityEvents.map((evt, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <span className="text-gray-500 shrink-0 font-mono">{evt.time}</span>
                    <Badge variant="outline" className={`shrink-0 text-[10px] px-1.5 py-0 ${severityColor(evt.severity)}`}>
                      {evt.severity.toUpperCase()}
                    </Badge>
                    <span className="text-gray-300 leading-relaxed">{evt.desc}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-medium text-gray-300">System Vulnerabilities</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <ScrollArea className="h-56">
              <div className="space-y-1.5">
                {vulnerabilities.map((vuln, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs py-1">
                    <span className="text-cyan-400 font-mono w-28 shrink-0">{vuln.name}</span>
                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${severityColor(vuln.severity)}`}>
                      {vuln.severity.toUpperCase()}
                    </Badge>
                    <span className="text-gray-400 w-20 shrink-0">CVSS {vuln.cvss}</span>
                    <span className={`ml-auto ${statusColor(vuln.status)}`}>{vuln.status}</span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}