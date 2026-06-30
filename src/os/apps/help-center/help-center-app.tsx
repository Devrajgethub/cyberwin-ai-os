'use client';

import React, { useState, useMemo } from 'react';
import {
  Search, ChevronDown, ChevronRight, BookOpen, Monitor, Shield, Settings2,
  Keyboard, AlertTriangle, ExternalLink, MessageSquare, Star, Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { AppProps } from '@/os/types';

interface Article {
  title: string;
  preview: string;
  content: string;
}

interface HelpCategory {
  name: string;
  icon: React.ReactNode;
  articles: Article[];
}

const quickLinks = [
  { title: 'Getting Started Guide', icon: <Zap size={14} className="text-cyan-400" />, tag: 'Popular' },
  { title: 'Keyboard Shortcuts', icon: <Keyboard size={14} className="text-cyan-400" />, tag: 'Reference' },
  { title: 'Security Setup', icon: <Shield size={14} className="text-cyan-400" />, tag: 'Essential' },
  { title: 'Troubleshooting', icon: <AlertTriangle size={14} className="text-cyan-400" />, tag: 'Help' },
];

const categories: HelpCategory[] = [
  {
    name: 'Getting Started',
    icon: <BookOpen size={14} />,
    articles: [
      {
        title: 'Welcome to CyberWin AI OS',
        preview: 'Learn the basics of navigating your new desktop environment.',
        content: 'CyberWin AI OS provides a complete desktop experience within your browser. The desktop displays icons for quick app access. Click any icon to launch an application. Use the taskbar at the bottom to see running apps, access the Start Menu, and check the system clock. The Start Menu (click the logo in the taskbar) lets you search for and launch any installed application. Windows can be dragged by their title bar and resized from edges and corners.',
      },
      {
        title: 'System Requirements & Compatibility',
        preview: 'What you need to run CyberWin AI OS smoothly.',
        content: 'CyberWin AI OS runs entirely in a modern web browser. We recommend using the latest version of Chrome, Firefox, Edge, or Safari. A stable internet connection is needed for AI features. The OS uses Web APIs including IndexedDB for file storage, Web Workers for background tasks, and the Canvas API for rendering. Ensure your browser allows pop-ups and third-party cookies for the best experience.',
      },
      {
        title: 'First-Time Setup Wizard',
        preview: 'Configure your system settings after first login.',
        content: 'After launching CyberWin AI OS for the first time, you will see the desktop with default settings. Open the Settings app from the Start Menu to customize your experience. Key initial settings include: Theme (dark or light mode), Display resolution and wallpaper, Network proxy if needed, and Security preferences. All settings are persisted in local storage and will be remembered across sessions.',
      },
    ],
  },
  {
    name: 'Window Management',
    icon: <Monitor size={14} />,
    articles: [
      {
        title: 'Moving and Resizing Windows',
        preview: 'How to arrange windows on your desktop.',
        content: 'To move a window, click and drag the title bar. To resize, hover over any edge or corner of the window — the cursor will change to indicate the resize direction. Click and drag to resize. You can also use the maximize button (double-square icon) in the title bar to make a window fill the entire desktop. Click it again to restore the original size. Minimize a window using the minus icon to hide it to the taskbar.',
      },
      {
        title: 'Taskbar & Window Switching',
        preview: 'Switch between open applications efficiently.',
        content: 'The taskbar at the bottom of the screen shows all running applications. Click any taskbar item to bring that window to the front. The active window appears with a cyan highlight in the taskbar. If a window is minimized, clicking its taskbar icon will restore it. You can also use Alt+Tab style switching by clicking different taskbar items in sequence.',
      },
      {
        title: 'Virtual Desktops & Workspaces',
        preview: 'Organize your work across multiple desktops.',
        content: 'CyberWin AI OS supports a single desktop workspace by default. All windows are managed within this space. Use minimize to temporarily hide windows and free up visual space. The Start Menu provides quick access to all applications regardless of what windows are open. Future versions may include virtual desktop support for advanced multitasking.',
      },
    ],
  },
  {
    name: 'Security Tools',
    icon: <Shield size={14} />,
    articles: [
      {
        title: 'Security Dashboard Overview',
        preview: 'Monitor your system security status at a glance.',
        content: 'The Security Dashboard provides a real-time overview of your system security posture. It displays key metrics including: Overall security score, Active threat count, Network connections, and Vulnerability status. The dashboard also features a network activity chart showing inbound and outbound traffic over time. Review the events log at the bottom for recent security-relevant activities.',
      },
      {
        title: 'Configuring Firewall Rules',
        preview: 'Manage inbound and outbound network rules.',
        content: 'The Firewall app lets you manage network access rules for your system. Each rule specifies: Action (Allow/Deny), Protocol (TCP/UDP/ICMP/Any), Port range, Source/Destination IP, and Direction (Inbound/Outbound). Toggle rules on or off with the switch. To add a new rule, click the "Add Rule" button and fill in the form. Rules are evaluated in order — the first matching rule determines the action. Use descriptive rule names for easy management.',
      },
      {
        title: 'Network Traffic Monitoring',
        preview: 'Inspect live network traffic and connections.',
        content: 'The Network Monitor displays real-time network activity. Packets are simulated to show what traffic monitoring looks like. You can filter by protocol (TCP, UDP, DNS, HTTP, HTTPS) to focus on specific traffic types. The bandwidth chart shows upload and download speeds over time. Each connection entry shows the source IP, destination, protocol, and current status.',
      },
      {
        title: 'Log Analysis & Threat Detection',
        preview: 'Use the Log Viewer to investigate security events.',
        content: 'The Log Viewer collects and displays system events categorized by severity: Critical (red), Warning (amber), Info (blue), and Debug (gray). Use the search bar to filter logs by keyword. The level filter buttons let you focus on specific severity levels. Auto-refresh keeps the log view current. Click on any log entry to see expanded details. Regular log review helps identify potential security issues early.',
      },
    ],
  },
  {
    name: 'Settings & Customization',
    icon: <Settings2 size={14} />,
    articles: [
      {
        title: 'Changing Themes & Appearance',
        preview: 'Personalize your desktop with themes and colors.',
        content: 'Open Settings and navigate to the Appearance section. Here you can toggle between Dark and Light mode. The cyberpunk dark theme uses a dark background with cyan accents for a futuristic look. Light mode provides better readability in bright environments. The wallpaper can also be customized from Display settings. All theme preferences are saved automatically.',
      },
      {
        title: 'Configuring Display Settings',
        preview: 'Adjust resolution, wallpaper, and visual effects.',
        content: 'In Settings > Display, you can configure: Wallpaper selection from preset cyberpunk backgrounds, Display density for scaling UI elements, and Animation preferences for window transitions. The system auto-detects your browser window size and adapts accordingly. For the best experience, use a window size of at least 1024x768 pixels.',
      },
      {
        title: 'Network & Storage Configuration',
        preview: 'Manage network connections and storage usage.',
        content: 'Settings > Network shows your current connection status and proxy configuration. Settings > Storage displays a breakdown of disk usage by category. You can view how much space is used by documents, applications, backups, and system files. The Backup app (available in the Start Menu) lets you manage backup schedules and restore points.',
      },
    ],
  },
  {
    name: 'Keyboard Shortcuts',
    icon: <Keyboard size={14} />,
    articles: [],
  },
  {
    name: 'Troubleshooting',
    icon: <AlertTriangle size={14} />,
    articles: [
      {
        title: 'Window Not Responding',
        preview: 'What to do when an application freezes.',
        content: 'If a window becomes unresponsive, try the following: 1) Click the minimize and restore buttons to reset the window state. 2) Close the window using the X button and relaunch the app. 3) If the issue persists, try refreshing the browser page. Note that all data in browser-based apps is stored in IndexedDB, so your files and notes will be preserved across refreshes.',
      },
      {
        title: 'Performance Issues',
        preview: 'Improve system responsiveness and speed.',
        content: 'For better performance: Close unused windows and applications to free memory. Use the Task Manager (future feature) to identify resource-heavy apps. Ensure your browser has hardware acceleration enabled. Reduce the number of simultaneously running apps. If using the Network Monitor with high traffic simulation, lowering the packet rate can help.',
      },
      {
        title: 'Data Recovery & Backup',
        preview: 'How to restore files and settings from backups.',
        content: 'CyberWin AI OS stores data in your browser\'s IndexedDB. Open the Backup app to create manual backups or configure automatic schedules. To restore: 1) Open Backup app, 2) Find the desired backup in history, 3) Click the Restore button. System settings are also backed up separately. Regular backups are recommended, especially before major system updates.',
      },
    ],
  },
];

const keyboardShortcuts = [
  { keys: 'Click Start Logo', desc: 'Open Start Menu' },
  { keys: 'Click Taskbar Icon', desc: 'Switch to application' },
  { keys: 'Drag Title Bar', desc: 'Move window' },
  { keys: 'Drag Window Edge', desc: 'Resize window' },
  { keys: 'Double-Click Title Bar', desc: 'Maximize / Restore window' },
  { keys: 'Click Minimize Button', desc: 'Minimize window to taskbar' },
  { keys: 'Click Close Button', desc: 'Close window' },
  { keys: 'Scroll in Window', desc: 'Scroll content' },
  { keys: 'Right-Click', desc: 'Context menu (where supported)' },
];

export default function HelpCenterApp({ windowId: _windowId }: AppProps) {
  const [search, setSearch] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Getting Started');
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories
      .map((cat) => ({
        ...cat,
        articles: cat.articles.filter(
          (a) =>
            a.title.toLowerCase().includes(q) ||
            a.preview.toLowerCase().includes(q) ||
            a.content.toLowerCase().includes(q)
        ),
      }))
      .filter((cat) => cat.name.toLowerCase().includes(q) || cat.articles.length > 0);
  }, [search]);

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      <div className="p-4 space-y-3 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search help articles..."
            className="h-8 text-xs bg-white/[0.04] border-white/[0.1] text-gray-200 placeholder:text-gray-500 pl-8"
          />
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {quickLinks.map((link, i) => (
            <button
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.08] hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-colors shrink-0"
              onClick={() => {
                setSearch('');
                setExpandedCategory('Getting Started');
                setExpandedArticle(link.title);
              }}
            >
              {link.icon}
              <span className="text-[11px] text-gray-300 whitespace-nowrap">{link.title}</span>
              <Badge variant="outline" className="text-[8px] px-1 py-0 border-cyan-500/30 text-cyan-400 bg-cyan-500/10">
                {link.tag}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06] flex-shrink-0" />

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1.5">
          {filteredCategories.map((cat) => {
            const isCatOpen = expandedCategory === cat.name;
            const isKbCat = cat.name === 'Keyboard Shortcuts';

            return (
              <div key={cat.name} className="rounded-lg border border-white/[0.06] bg-white/[0.01] overflow-hidden">
                {/* Category Header */}
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-white/[0.03] transition-colors"
                  onClick={() => setExpandedCategory(isCatOpen ? null : cat.name)}
                >
                  {isCatOpen ? (
                    <ChevronDown size={12} className="text-gray-500 shrink-0" />
                  ) : (
                    <ChevronRight size={12} className="text-gray-500 shrink-0" />
                  )}
                  <span className="text-cyan-400 shrink-0">{cat.icon}</span>
                  <span className="text-xs font-medium text-gray-200 flex-1">{cat.name}</span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-white/10 text-gray-500">
                    {isKbCat ? keyboardShortcuts.length : cat.articles.length}
                  </Badge>
                </button>

                {isCatOpen && (
                  <div className="border-t border-white/[0.04]">
                    {isKbCat ? (
                      /* Keyboard Shortcuts List */
                      <div className="px-3 py-2 space-y-1">
                        {keyboardShortcuts.map((sc, i) => (
                          <div key={i} className="flex items-center justify-between py-1">
                            <span className="text-[11px] text-gray-400">{sc.desc}</span>
                            <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.1] text-gray-300 font-mono">
                              {sc.keys}
                            </kbd>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Articles */
                      <div className="py-1">
                        {cat.articles.map((article) => {
                          const isArticleOpen = expandedArticle === article.title;
                          return (
                            <div key={article.title} className="px-1">
                              <button
                                className="w-full text-left px-2 py-2 rounded-md hover:bg-white/[0.03] transition-colors"
                                onClick={() => setExpandedArticle(isArticleOpen ? null : article.title)}
                              >
                                <div className="flex items-center gap-2">
                                  {isArticleOpen ? (
                                    <ChevronDown size={10} className="text-cyan-400 shrink-0" />
                                  ) : (
                                    <ChevronRight size={10} className="text-gray-600 shrink-0" />
                                  )}
                                  <span className={`text-[11px] ${isArticleOpen ? 'text-cyan-300' : 'text-gray-300'}`}>
                                    {article.title}
                                  </span>
                                </div>
                                {!isArticleOpen && (
                                  <div className="text-[10px] text-gray-500 mt-0.5 pl-5 truncate">{article.preview}</div>
                                )}
                              </button>
                              {isArticleOpen && (
                                <div className="px-4 pb-3">
                                  <p className="text-[11px] text-gray-400 leading-relaxed">{article.content}</p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact Support */}
          <div className="pt-4 pb-2">
            <Button
              variant="outline"
              className="w-full border-white/[0.1] text-gray-400 hover:text-cyan-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 text-xs h-9"
            >
              <MessageSquare size={14} className="mr-2" />
              Contact Support
              <ExternalLink size={10} className="ml-1.5" />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}