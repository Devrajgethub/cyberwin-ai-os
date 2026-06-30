'use client';

import React, { useState } from 'react';
import { User, Monitor, Clock, Shield, Save, Terminal, Globe, HardDrive, Smartphone, CheckCircle2, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useOSStore } from '@/os/store';
import type { AppProps } from '@/os/types';

export default function ProfileApp({ windowId: _windowId }: AppProps) {
  const username = useOSStore((s) => s.username);

  const [displayName, setDisplayName] = useState('CyberWin Admin');
  const [bio, setBio] = useState('Cybersecurity professional. Building secure systems with CyberWin OS.');
  const [location, setLocation] = useState('Neon District, Sector 7');
  const [role, setRole] = useState('Security Administrator');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const handleSave = () => {
    setSaveFeedback('Profile saved successfully');
    setTimeout(() => setSaveFeedback(null), 2000);
  };

  const stats = [
    { label: 'Sessions Opened', value: '142', icon: Monitor },
    { label: 'Apps Launched', value: '1,847', icon: Smartphone },
    { label: 'Files Created', value: '326', icon: HardDrive },
  ];

  const systemInfo = [
    { label: 'Username', value: username, icon: Terminal },
    { label: 'Hostname', value: 'cyberwin-desktop', icon: Globe },
    { label: 'Shell', value: '/bin/cybersh', icon: Terminal },
    { label: 'Uptime', value: '3d 14h 22m', icon: Clock },
  ];

  return (
    <div className="h-full w-full bg-black/20 flex flex-col">
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center p-6 gap-5">
          {/* Avatar */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500/30 to-cyan-700/20 border-2 border-cyan-500/30 flex items-center justify-center">
              <User size={36} className="text-cyan-400/70" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-gray-900 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-green-400" />
            </div>
          </div>

          {/* Username display */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-100">@{username}</div>
            <Badge variant="outline" className="mt-1 text-[10px] border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
              <Shield size={10} className="mr-1" />
              Verified
            </Badge>
          </div>

          <div className="w-full max-w-xs space-y-4">
            {/* Editable fields */}
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Profile Information</div>
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400">Display Name</label>
                  <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="h-8 text-xs bg-white/[0.04] border-white/[0.06] text-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full h-auto rounded-md bg-white/[0.04] border border-white/[0.06] text-xs text-gray-200 px-3 py-2 outline-none resize-none focus:border-cyan-500/30 transition-colors placeholder:text-gray-600"
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400">Location</label>
                  <Input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-8 text-xs bg-white/[0.04] border-white/[0.06] text-gray-200"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400">Role</label>
                  <Input
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="h-8 text-xs bg-white/[0.04] border-white/[0.06] text-gray-200"
                  />
                </div>
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* System Info */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">System Information</div>
              <div className="space-y-1.5">
                {systemInfo.map((info) => (
                  <div key={info.label} className="flex items-center justify-between py-1">
                    <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <info.icon size={11} className="text-gray-600" />
                      {info.label}
                    </span>
                    <span className="text-[11px] text-gray-300 font-mono">{info.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Activity Stats */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Activity</div>
              <div className="grid grid-cols-3 gap-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <stat.icon size={16} className="text-cyan-400/60 mx-auto mb-1" />
                    <div className="text-sm font-semibold text-gray-200">{stat.value}</div>
                    <div className="text-[9px] text-gray-500 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="opacity-50" />

            {/* Security Section */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium">Security</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between py-1">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Clock size={11} className="text-gray-600" />
                    Last Login
                  </span>
                  <span className="text-[11px] text-gray-300">Today, 08:42 AM</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <Shield size={11} className="text-gray-600" />
                    Account Status
                  </span>
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-green-500/30 text-green-400 bg-green-500/10">
                    <CheckCircle2 size={8} className="mr-0.5" />
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                    <KeyRound size={11} className="text-gray-600" />
                    2FA Status
                  </span>
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                    Enabled
                  </Badge>
                </div>
              </div>
            </div>

            {/* Save button */}
            <div className="pt-2">
              <Button
                onClick={handleSave}
                className="w-full h-8 text-xs bg-cyan-600 hover:bg-cyan-500"
              >
                <Save size={13} className="mr-1.5" />
                Save Profile
              </Button>
              {saveFeedback && (
                <div className="mt-2 text-center text-[11px] text-cyan-400 flex items-center justify-center gap-1">
                  <CheckCircle2 size={12} />
                  {saveFeedback}
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}