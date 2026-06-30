'use client';

import React, { useState } from 'react';
import { Download, CheckCircle2, Loader2, Clock, History, ChevronDown, ChevronUp, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { AppProps } from '@/os/types';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'complete' | 'error';

interface UpdateHistoryEntry {
  version: string;
  date: string;
  size: string;
  highlights: string[];
}

const updateHistory: UpdateHistoryEntry[] = [
  {
    version: 'v2.0.0',
    date: '2024-01-20',
    size: '312 MB',
    highlights: ['New AI Assistant', 'Firewall management', 'Dark mode overhaul'],
  },
  {
    version: 'v1.9.2',
    date: '2024-01-10',
    size: '89 MB',
    highlights: ['Fixed memory leaks in Terminal', 'Improved window animations', 'Updated network drivers'],
  },
  {
    version: 'v1.9.0',
    date: '2023-12-28',
    size: '201 MB',
    highlights: ['Network Monitor app', 'Log Viewer with filtering', 'Security Dashboard redesign'],
  },
  {
    version: 'v1.8.5',
    date: '2023-12-15',
    size: '45 MB',
    highlights: ['Hotfix: startup crash', 'Patched TLS vulnerability', 'Improved font rendering'],
  },
];

const changelog = [
  { type: 'New', text: 'Notification Center' },
  { type: 'New', text: 'Lock Screen' },
  { type: 'Improved', text: 'File Manager with create/rename/delete' },
  { type: 'Fixed', text: 'Window resize performance' },
  { type: 'Security', text: 'Updated firewall signatures' },
];

function getBadgeColor(type: string) {
  switch (type) {
    case 'New': return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    case 'Improved': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'Fixed': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'Security': return 'bg-red-500/20 text-red-300 border-red-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
}

export default function SystemUpdateApp({ windowId: _windowId }: AppProps) {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  const handleCheckUpdates = () => {
    setStatus('checking');
    setTimeout(() => {
      setStatus('available');
    }, 2000);
  };

  const handleInstall = () => {
    setStatus('downloading');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setStatus('complete');
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-5">
          {/* Current Version */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Shield size={20} className="text-cyan-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-100">CyberWin AI OS</div>
                <div className="text-xs text-gray-500">v2.0.0 — Build 2024.01.20</div>
              </div>
            </div>
            <Badge variant="outline" className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">
              <CheckCircle2 size={10} className="mr-1" />
              Up to date
            </Badge>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Status Area */}
          <div className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-4">
            {status === 'idle' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <Clock size={32} className="text-gray-500" />
                <div className="text-sm text-gray-300">Your system is up to date</div>
                <div className="text-xs text-gray-500">Last checked: 2 hours ago</div>
                <Button
                  onClick={handleCheckUpdates}
                  className="mt-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
                  size="sm"
                >
                  Check for Updates
                </Button>
              </div>
            )}

            {status === 'checking' && (
              <div className="flex flex-col items-center gap-3 py-6">
                <Loader2 size={28} className="text-cyan-400 animate-spin" />
                <div className="text-sm text-gray-300">Checking for updates...</div>
                <div className="text-xs text-gray-500">Connecting to update server</div>
              </div>
            )}

            {status === 'available' && (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Download size={20} className="text-cyan-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-100">CyberWin AI OS v2.1.0</div>
                    <div className="text-xs text-gray-500 mt-0.5">245 MB • Released 2024-01-25</div>
                  </div>
                </div>
                <div className="space-y-1.5 pl-8">
                  {changelog.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border ${getBadgeColor(item.type)}`}>
                        {item.type}
                      </Badge>
                      <span className="text-gray-300">{item.text}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-1">
                  <Button
                    onClick={handleInstall}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs"
                    size="sm"
                  >
                    <Download size={14} className="mr-1.5" />
                    Download and Install
                  </Button>
                </div>
              </div>
            )}

            {status === 'downloading' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Loader2 size={16} className="text-cyan-400 animate-spin" />
                  <div className="text-sm text-gray-200">Installing v2.1.0...</div>
                </div>
                <Progress value={progress} className="h-2 bg-white/[0.06]" />
                <div className="flex justify-between text-[10px] text-gray-500">
                  <span>Downloading and installing...</span>
                  <span>{progress}%</span>
                </div>
              </div>
            )}

            {status === 'complete' && (
              <div className="flex flex-col items-center gap-3 py-4">
                <CheckCircle2 size={32} className="text-green-400" />
                <div className="text-sm font-medium text-gray-100">System is up to date</div>
                <div className="text-xs text-gray-500">CyberWin AI OS v2.1.0 installed successfully</div>
                <Button
                  onClick={() => { setStatus('idle'); setProgress(0); }}
                  variant="outline"
                  size="sm"
                  className="text-xs border-white/[0.1] text-gray-400"
                >
                  Done
                </Button>
              </div>
            )}
          </div>

          {/* Update History */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History size={14} className="text-gray-400" />
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Update History</div>
            </div>
            <div className="space-y-1.5">
              {updateHistory.map((entry) => (
                <div key={entry.version} className="rounded-lg border border-white/[0.06] bg-white/[0.01]">
                  <button
                    className="w-full flex items-center justify-between px-3 py-2 text-left"
                    onClick={() => setExpandedHistory(expandedHistory === entry.version ? null : entry.version)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-xs font-medium text-gray-200">{entry.version}</div>
                      <div className="text-[10px] text-gray-500">{entry.date}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">{entry.size}</span>
                      {expandedHistory === entry.version ? (
                        <ChevronUp size={12} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={12} className="text-gray-500" />
                      )}
                    </div>
                  </button>
                  {expandedHistory === entry.version && (
                    <div className="px-3 pb-2 border-t border-white/[0.04]">
                      <ul className="mt-2 space-y-1">
                        {entry.highlights.map((h, i) => (
                          <li key={i} className="text-[11px] text-gray-400 flex items-center gap-1.5">
                            <CheckCircle2 size={10} className="text-cyan-500/60 shrink-0" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}