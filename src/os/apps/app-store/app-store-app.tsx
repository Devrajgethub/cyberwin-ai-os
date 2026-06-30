'use client';

import React, { useState } from 'react';
import {
  Search, Download, CheckCircle2, Star, Shield, FileText,
  Radio, Image, Code, Server, Activity, Monitor, Lock,
  Palette, Video, Zap, Wrench, Cpu,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AppProps } from '@/os/types';

type AppCategory = 'All' | 'Security' | 'Productivity' | 'Media' | 'Developer' | 'System';

interface StoreApp {
  id: string;
  name: string;
  description: string;
  category: Exclude<AppCategory, 'All'>;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  installed: boolean;
  featured?: boolean;
}

const CATEGORIES: AppCategory[] = ['All', 'Security', 'Productivity', 'Media', 'Developer', 'System'];

const initialApps: StoreApp[] = [
  { id: 'packet-analyzer', name: 'Packet Analyzer', description: 'Deep packet inspection and real-time traffic analysis for network security monitoring.', category: 'Security', icon: Radio, installed: true },
  { id: 'password-mgr', name: 'Password Manager', description: 'Secure vault for managing passwords with AES-256 encryption and auto-fill.', category: 'Security', icon: Lock, installed: false, featured: true },
  { id: 'port-scanner', name: 'Port Scanner', description: 'Fast multi-threaded port scanner with service detection and vulnerability flags.', category: 'Security', icon: Shield, installed: true },
  { id: 'vpn-client', name: 'VPN Client', description: 'Encrypted tunnel for secure browsing with multiple protocol support.', category: 'Security', icon: Zap, installed: false, featured: true },
  { id: 'markdown-editor', name: 'Markdown Editor', description: 'Feature-rich markdown editor with live preview, syntax highlighting, and export.', category: 'Productivity', icon: FileText, installed: true },
  { id: 'screen-recorder', name: 'Screen Recorder', description: 'High-quality screen recording with audio capture and GIF export.', category: 'Media', icon: Video, installed: false },
  { id: 'image-compressor', name: 'Image Compressor', description: 'Batch image compression with support for PNG, JPG, WebP formats.', category: 'Media', icon: Image, installed: false },
  { id: 'rest-client', name: 'REST Client', description: 'HTTP client for testing APIs with request history and environment variables.', category: 'Developer', icon: Code, installed: false },
  { id: 'log-analyzer', name: 'Log Analyzer', description: 'System log viewer with real-time tail, filtering, and pattern matching.', category: 'System', icon: Activity, installed: true },
  { id: 'sys-monitor', name: 'System Monitor', description: 'Real-time CPU, memory, disk, and network resource monitoring dashboard.', category: 'System', icon: Monitor, installed: true, featured: true },
  { id: 'theme-editor', name: 'Theme Editor', description: 'Customize CyberWin OS appearance with live preview and CSS variables.', category: 'System', icon: Palette, installed: false },
  { id: 'hex-editor', name: 'Hex Editor', description: 'Binary file editor with hex and ASCII views, pattern search, and diff.', category: 'Developer', icon: Cpu, installed: false },
];

const categoryIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Security: Shield,
  Productivity: FileText,
  Media: Video,
  Developer: Code,
  System: Wrench,
};

export default function AppStoreApp({ windowId: _windowId }: AppProps) {
  const [apps, setApps] = useState<StoreApp[]>(initialApps);
  const [activeCategory, setActiveCategory] = useState<AppCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingId, setInstallingId] = useState<string | null>(null);

  const filteredApps = apps.filter((app) => {
    const matchCat = activeCategory === 'All' || app.category === activeCategory;
    const matchSearch = !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featuredApps = apps.filter((app) => app.featured);

  const handleInstall = (id: string) => {
    setInstallingId(id);
    setTimeout(() => {
      setApps((prev) =>
        prev.map((a) => (a.id === id ? { ...a, installed: true } : a))
      );
      setInstallingId(null);
    }, 1500);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      {/* Search bar */}
      <div className="px-4 pt-3 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className="h-8 pl-9 text-xs bg-white/[0.04] border-white/[0.06] text-gray-200"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 pb-2 flex items-center gap-1.5 overflow-x-auto">
        {CATEGORIES.map((cat) => {
          const CatIcon = categoryIcons[cat];
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] whitespace-nowrap transition-colors shrink-0 ${
                activeCategory === cat
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-gray-400 hover:text-gray-300 border border-transparent hover:border-white/[0.06] hover:bg-white/[0.03]'
              }`}
            >
              {CatIcon && <CatIcon size={11} />}
              {cat}
            </button>
          );
        })}
      </div>

      <Separator className="opacity-50" />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Featured section */}
          {!searchQuery && activeCategory === 'All' && featuredApps.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Star size={14} className="text-cyan-400" />
                <span className="text-xs font-semibold text-gray-200">Featured</span>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {featuredApps.map((app) => (
                  <div
                    key={`featured-${app.id}`}
                    className="min-w-[200px] max-w-[200px] p-3 rounded-xl bg-gradient-to-b from-cyan-500/10 to-transparent border border-cyan-500/15 shrink-0"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center mb-2">
                      <app.icon size={20} className="text-cyan-400" />
                    </div>
                    <div className="text-xs font-medium text-gray-200">{app.name}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-2">{app.description}</div>
                    <Button
                      size="sm"
                      className={`mt-2 h-6 text-[10px] w-full ${
                        app.installed
                          ? 'bg-white/[0.05] text-gray-400 hover:bg-white/[0.08]'
                          : 'bg-cyan-600 hover:bg-cyan-500'
                      } ${installingId === app.id ? 'opacity-70 pointer-events-none' : ''}`}
                      disabled={app.installed}
                      onClick={() => !app.installed && handleInstall(app.id)}
                    >
                      {installingId === app.id ? (
                        <><span className="inline-block w-3 h-3 border border-gray-300 border-t-transparent rounded-full animate-spin mr-1" />Installing...</>
                      ) : app.installed ? (
                        <><CheckCircle2 size={11} className="mr-1" />Installed</>
                      ) : (
                        <><Download size={11} className="mr-1" />Get</>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* App grid */}
          <div>
            {activeCategory !== 'All' && (
              <div className="text-xs font-semibold text-gray-300 mb-3 capitalize">{activeCategory}</div>
            )}
            {searchQuery && (
              <div className="text-xs text-gray-400 mb-3">
                {filteredApps.length} result{filteredApps.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
              </div>
            )}
            <div className="grid grid-cols-2 gap-2.5">
              {filteredApps.map((app) => {
                const isFeatured = app.featured && activeCategory === 'All' && !searchQuery;
                if (isFeatured) return null;
                return (
                  <div
                    key={app.id}
                    className="p-3 rounded-lg border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                        <app.icon size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-medium text-gray-200 truncate">{app.name}</span>
                          <Badge variant="outline" className="text-[8px] h-4 px-1 border-white/[0.08] text-gray-500 shrink-0">
                            {app.category}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">{app.description}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`mt-1.5 h-6 text-[10px] px-2 ${
                            app.installed
                              ? 'text-gray-500 hover:text-gray-400 hover:bg-white/[0.04]'
                              : 'text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10'
                          } ${installingId === app.id ? 'opacity-70 pointer-events-none' : ''}`}
                          disabled={app.installed || installingId === app.id}
                          onClick={() => handleInstall(app.id)}
                        >
                          {installingId === app.id ? (
                            <><span className="inline-block w-3 h-3 border border-gray-400 border-t-transparent rounded-full animate-spin mr-1" />Installing...</>
                          ) : app.installed ? (
                            <><CheckCircle2 size={10} className="mr-1" />Installed</>
                          ) : (
                            <><Download size={10} className="mr-1" />Get</>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredApps.filter((a) => !(a.featured && activeCategory === 'All' && !searchQuery)).length === 0 && (
              <div className="text-center text-xs text-gray-600 py-12">
                No apps found
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}