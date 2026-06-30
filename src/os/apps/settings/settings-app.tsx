'use client';

import React, { useState } from 'react';
import { Monitor, Palette, HardDrive, Globe, ShieldCheck, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOSStore } from '@/os/store';
import type { AppProps } from '@/os/types';

const categories = [
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'system', label: 'System', icon: Monitor },
  { id: 'display', label: 'Display', icon: Monitor },
  { id: 'network', label: 'Network', icon: Globe },
  { id: 'storage', label: 'Storage', icon: HardDrive },
  { id: 'security', label: 'Privacy & Security', icon: ShieldCheck },
] as const;

type CategoryId = (typeof categories)[number]['id'];

const wallpapers = [
  { id: 'cyber-dark', label: 'Cyber Dark', gradient: 'linear-gradient(135deg, #0a0a1a 0%, #0d1117 30%, #0a1628 60%, #050510 100%)' },
  { id: 'matrix', label: 'Matrix', gradient: 'linear-gradient(180deg, #000a00 0%, #001a00 50%, #000500 100%)' },
  { id: 'deep-ocean', label: 'Deep Ocean', gradient: 'linear-gradient(135deg, #020024 0%, #090979 40%, #00d4ff 100%)' },
  { id: 'sunset', label: 'Cyber Sunset', gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d1b4e 30%, #4a1942 60%, #1a0a2e 100%)' },
  { id: 'midnight', label: 'Midnight', gradient: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
];

const accentColors = [
  { id: 'cyan', label: 'Cyan', color: '#06b6d4' },
  { id: 'teal', label: 'Teal', color: '#14b8a6' },
  { id: 'emerald', label: 'Emerald', color: '#10b981' },
  { id: 'amber', label: 'Amber', color: '#f59e0b' },
  { id: 'rose', label: 'Rose', color: '#f43f5e' },
];

function AppearanceSection() {
  const { theme, setTheme, toggleTheme } = useOSStore();
  const [selectedWallpaper, setSelectedWallpaper] = useState('cyber-dark');
  const [selectedAccent, setSelectedAccent] = useState('cyan');

  return (
    <div className="space-y-6">
      {/* Theme Toggle */}
      <div>
        <h3 className="text-sm font-medium text-gray-200 mb-3">Theme</h3>
        <div className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <div>
            <div className="text-sm text-gray-200">Dark Mode</div>
            <div className="text-xs text-gray-500 mt-0.5">Switch between dark and light appearance</div>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={() => toggleTheme()}
          />
        </div>
      </div>

      {/* Wallpaper */}
      <div>
        <h3 className="text-sm font-medium text-gray-200 mb-3">Wallpaper</h3>
        <div className="grid grid-cols-5 gap-2">
          {wallpapers.map((wp) => (
            <button
              key={wp.id}
              onClick={() => setSelectedWallpaper(wp.id)}
              className={`h-16 rounded-lg border-2 transition-all ${
                selectedWallpaper === wp.id
                  ? 'border-cyan-500 ring-1 ring-cyan-500/30'
                  : 'border-white/[0.06] hover:border-white/[0.15]'
              }`}
              style={{ background: wp.gradient }}
              title={wp.label}
            />
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">Selected: {wallpapers.find((w) => w.id === selectedWallpaper)?.label}</div>
      </div>

      {/* Accent Color */}
      <div>
        <h3 className="text-sm font-medium text-gray-200 mb-3">Accent Color</h3>
        <div className="flex gap-3">
          {accentColors.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedAccent(c.id)}
              className={`w-8 h-8 rounded-full transition-all ${
                selectedAccent === c.id ? 'ring-2 ring-offset-2 ring-offset-[#0a0a14]' : 'hover:scale-110'
              }`}
              style={{ background: c.color, ringColor: c.color }}
              title={c.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemSection() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'OS Name', value: 'CyberWin AI OS' },
          { label: 'Version', value: '1.0.0-beta' },
          { label: 'Kernel', value: '6.2.0-cyberwin' },
          { label: 'Architecture', value: 'x86_64' },
          { label: 'Desktop', value: 'CyberDE 1.0' },
          { label: 'Shell', value: 'cyber-sh 5.2.0' },
          { label: 'Uptime', value: '3 days, 7 hours' },
          { label: 'Hostname', value: 'cyberwin-desktop' },
        ].map((item) => (
          <div key={item.label} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
            <div className="text-[11px] text-gray-500 uppercase tracking-wider">{item.label}</div>
            <div className="text-sm text-gray-200 mt-1 font-mono">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DisplaySection() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center gap-3 mb-3">
          <Monitor size={18} className="text-cyan-400" />
          <div>
            <div className="text-sm font-medium text-gray-200">Primary Display</div>
            <div className="text-xs text-gray-500">CyberWin Virtual Display</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div><span className="text-gray-500">Resolution:</span> <span className="text-gray-300 font-mono">1920 × 1080</span></div>
          <div><span className="text-gray-500">Refresh Rate:</span> <span className="text-gray-300 font-mono">60 Hz</span></div>
          <div><span className="text-gray-500">Color Depth:</span> <span className="text-gray-300 font-mono">32-bit</span></div>
          <div><span className="text-gray-500">Scale:</span> <span className="text-gray-300 font-mono">100%</span></div>
        </div>
      </div>
    </div>
  );
}

function NetworkSection() {
  return (
    <div className="space-y-4">
      {[
        { iface: 'eth0', type: 'Ethernet', ip: '192.168.1.105', mask: '255.255.255.0', gw: '192.168.1.1', dns: '1.1.1.1', mac: '08:00:27:4e:66:a1', status: 'Connected' },
        { iface: 'wg0', type: 'WireGuard VPN', ip: '10.0.0.1', mask: '255.255.255.0', gw: '—', dns: '—', mac: '—', status: 'Connected' },
        { iface: 'lo', type: 'Loopback', ip: '127.0.0.1', mask: '255.0.0.0', gw: '—', dns: '—', mac: '—', status: 'Active' },
      ].map((net) => (
        <div key={net.iface} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-cyan-400" />
              <span className="text-sm font-medium text-gray-200">{net.iface}</span>
              <span className="text-xs text-gray-500">({net.type})</span>
            </div>
            <span className="text-[10px] text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full">{net.status}</span>
          </div>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div><span className="text-gray-500">IP:</span> <span className="text-gray-300 font-mono">{net.ip}</span></div>
            <div><span className="text-gray-500">Mask:</span> <span className="text-gray-300 font-mono">{net.mask}</span></div>
            {net.gw !== '—' && <div><span className="text-gray-500">Gateway:</span> <span className="text-gray-300 font-mono">{net.gw}</span></div>}
            {net.dns !== '—' && <div><span className="text-gray-500">DNS:</span> <span className="text-gray-300 font-mono">{net.dns}</span></div>}
            {net.mac !== '—' && <div className="col-span-2"><span className="text-gray-500">MAC:</span> <span className="text-gray-300 font-mono">{net.mac}</span></div>}
          </div>
        </div>
      ))}
    </div>
  );
}

function StorageSection() {
  const total = 256;
  const used = 80;
  const percent = Math.round((used / total) * 100);
  const items = [
    { label: 'System', size: 45, color: 'bg-cyan-500' },
    { label: 'Applications', size: 23, color: 'bg-purple-500' },
    { label: 'Documents', size: 8, color: 'bg-green-500' },
    { label: 'Other', size: 4, color: 'bg-gray-500' },
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium text-gray-200">Primary Disk (/dev/sda1)</div>
          <div className="text-xs text-gray-400">{used} GB / {total} GB</div>
        </div>
        <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden flex">
          {items.map((item) => (
            <div key={item.label} className={`${item.color} h-full`} style={{ width: `${(item.size / total) * 100}%` }} />
          ))}
        </div>
        <div className="text-xs text-gray-500 mt-2">{percent}% used — {total - used} GB available</div>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
              <span className="text-sm text-gray-300">{item.label}</span>
            </div>
            <span className="text-xs text-gray-400 font-mono">{item.size} GB</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div className="space-y-4">
      {[
        { label: 'Firewall', desc: 'Network traffic filtering', enabled: true },
        { label: 'Intrusion Detection', desc: 'IDS/IPS monitoring', enabled: true },
        { label: 'Automatic Updates', desc: 'Security patch management', enabled: true },
        { label: 'Disk Encryption', desc: 'Full disk encryption (LUKS)', enabled: false },
        { label: 'Two-Factor Auth', desc: '2FA for system access', enabled: true },
        { label: 'Audit Logging', desc: 'System event logging', enabled: true },
        { label: 'Network Isolation', desc: 'Separate security zones', enabled: false },
      ].map((item) => (
        <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
          <div>
            <div className="text-sm text-gray-200">{item.label}</div>
            <div className="text-xs text-gray-500 mt-0.5">{item.desc}</div>
          </div>
          <Switch defaultChecked={item.enabled} disabled />
        </div>
      ))}
    </div>
  );
}

const sections: Record<CategoryId, React.ComponentType> = {
  appearance: AppearanceSection,
  system: SystemSection,
  display: DisplaySection,
  network: NetworkSection,
  storage: StorageSection,
  security: SecuritySection,
};

export default function SettingsApp({ windowId: _windowId }: AppProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('appearance');
  const ActiveSection = sections[activeCategory];

  return (
    <div className="h-full w-full flex bg-black/20">
      {/* Sidebar */}
      <div className="w-48 shrink-0 border-r border-white/[0.06] p-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
          Settings
        </div>
        <div className="space-y-0.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs w-full text-left transition-colors ${
                activeCategory === cat.id
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
              }`}
            >
              <cat.icon size={15} />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 p-5">
        <h2 className="text-lg font-medium text-gray-100 mb-4">
          {categories.find((c) => c.id === activeCategory)?.label}
        </h2>
        <ActiveSection />
      </ScrollArea>
    </div>
  );
}