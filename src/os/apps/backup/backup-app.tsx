'use client';

import React, { useState } from 'react';
import {
  CheckCircle2, Database, Clock, HardDrive, RotateCcw,
  Loader2, Plus, Calendar, Archive,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { AppProps } from '@/os/types';

interface BackupEntry {
  id: string;
  name: string;
  type: 'full' | 'documents' | 'settings' | 'security';
  size: string;
  date: string;
}

const backupHistory: BackupEntry[] = [
  { id: '1', name: 'Full System Backup', type: 'full', size: '2.4 GB', date: 'Jan 22, 2024' },
  { id: '2', name: 'Documents Only', type: 'documents', size: '156 MB', date: 'Jan 21, 2024' },
  { id: '3', name: 'Settings Backup', type: 'settings', size: '2 KB', date: 'Jan 20, 2024' },
  { id: '4', name: 'Security Config', type: 'security', size: '8 KB', date: 'Jan 19, 2024' },
  { id: '5', name: 'Full System Backup', type: 'full', size: '2.3 GB', date: 'Jan 18, 2024' },
];

function getTypeBadge(type: string) {
  switch (type) {
    case 'full': return { label: 'Full', className: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    case 'documents': return { label: 'Docs', className: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
    case 'settings': return { label: 'Config', className: 'bg-amber-500/15 text-amber-300 border-amber-500/30' };
    case 'security': return { label: 'Security', className: 'bg-red-500/15 text-red-300 border-red-500/30' };
    default: return { label: type, className: 'bg-gray-500/15 text-gray-300 border-gray-500/30' };
  }
}

export default function BackupApp({ windowId: _windowId }: AppProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [createProgress, setCreateProgress] = useState(0);
  const [backupDone, setBackupDone] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [schedule, setSchedule] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  const handleCreateBackup = () => {
    setIsCreating(true);
    setBackupDone(false);
    setCreateProgress(0);
    const interval = setInterval(() => {
      setCreateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCreating(false);
          setBackupDone(true);
          return 100;
        }
        return prev + 5;
      });
    }, 150);
  };

  const handleRestore = (id: string) => {
    setRestoring(id);
    setTimeout(() => {
      setRestoring(null);
    }, 1500);
  };

  const storageUsed = 4.8;
  const storageTotal = 20;
  const storagePercent = (storageUsed / storageTotal) * 100;

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Status Card */}
          <div className="rounded-lg border border-green-500/20 bg-green-500/[0.04] p-4 flex items-center gap-3">
            <CheckCircle2 size={20} className="text-green-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm text-gray-100">Backup system healthy</div>
              <div className="text-xs text-gray-500 mt-0.5">Last backup: 2 hours ago</div>
            </div>
            <Button
              onClick={handleCreateBackup}
              disabled={isCreating}
              className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs shrink-0"
              size="sm"
            >
              {isCreating ? (
                <Loader2 size={12} className="mr-1.5 animate-spin" />
              ) : (
                <Plus size={12} className="mr-1.5" />
              )}
              Create Backup Now
            </Button>
          </div>

          {/* Backup Progress */}
          {isCreating && (
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-200">
                <Loader2 size={14} className="text-cyan-400 animate-spin" />
                Creating backup...
              </div>
              <Progress value={createProgress} className="h-2 bg-white/[0.06]" />
              <div className="text-[10px] text-gray-500 text-right">{createProgress}%</div>
            </div>
          )}

          {backupDone && !isCreating && (
            <div className="rounded-lg border border-green-500/20 bg-green-500/[0.04] p-3 flex items-center gap-2">
              <CheckCircle2 size={14} className="text-green-400" />
              <span className="text-xs text-green-300">Backup complete</span>
            </div>
          )}

          <Separator className="bg-white/[0.06]" />

          {/* Storage Usage */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <HardDrive size={14} className="text-gray-400" />
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Storage</div>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4 space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-300">Backup Storage</span>
                <span className="text-gray-500">{storageUsed} GB / {storageTotal} GB</span>
              </div>
              <Progress value={storagePercent} className="h-2 bg-white/[0.06]" />
              <div className="text-[10px] text-gray-500">{(storageTotal - storageUsed).toFixed(1)} GB available</div>
            </div>
          </div>

          {/* Schedule */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-gray-400" />
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Schedule</div>
            </div>
            <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
              <RadioGroup value={schedule} onValueChange={(v) => setSchedule(v as typeof schedule)} className="space-y-2">
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="daily" id="daily" className="border-white/20 text-cyan-500" />
                  <Label htmlFor="daily" className="text-xs text-gray-300 cursor-pointer">Daily — at midnight</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="weekly" id="weekly" className="border-white/20 text-cyan-500" />
                  <Label htmlFor="weekly" className="text-xs text-gray-300 cursor-pointer">Weekly — every Sunday</Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="monthly" id="monthly" className="border-white/20 text-cyan-500" />
                  <Label htmlFor="monthly" className="text-xs text-gray-300 cursor-pointer">Monthly — 1st of month</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Backup History */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-gray-400" />
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Backup History</div>
            </div>
            <div className="space-y-1.5">
              {backupHistory.map((entry) => {
                const badge = getTypeBadge(entry.type);
                return (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.01] px-3 py-2.5"
                  >
                    <Database size={16} className="text-gray-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-gray-200 truncate">{entry.name}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{entry.date}</div>
                    </div>
                    <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border ${badge.className}`}>
                      {badge.label}
                    </Badge>
                    <div className="text-[10px] text-gray-500 w-14 text-right shrink-0">{entry.size}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0"
                      onClick={() => handleRestore(entry.id)}
                      disabled={restoring === entry.id}
                    >
                      {restoring === entry.id ? (
                        <Loader2 size={12} className="text-cyan-400 animate-spin" />
                      ) : (
                        <RotateCcw size={12} className="text-gray-400" />
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}