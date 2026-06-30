'use client';

import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, Plus, X, Globe, Star, Home, Lock, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { AppProps } from '@/os/types';

interface Tab {
  id: string;
  url: string;
  title: string;
}

const BOOKMARKS = [
  { label: 'CyberWin', url: 'cyberwin.local' },
  { label: 'Wikipedia', url: 'wikipedia.org' },
  { label: 'GitHub', url: 'github.com' },
  { label: 'StackOverflow', url: 'stackoverflow.com' },
  { label: 'MDN Docs', url: 'developer.mozilla.org' },
];

function SimulatedPage({ url }: { url: string }) {
  if (url.includes('cyberwin.local') || url === 'cyberwin.local') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-4 bg-gradient-to-b from-cyan-950/20 to-black/20">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={48} className="text-cyan-400" />
          <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-200 bg-clip-text text-transparent">
            CyberWin OS
          </span>
        </div>
        <p className="text-gray-400 text-sm max-w-md">
          The next-generation cyberpunk operating system. Secure, fast, and AI-powered for the modern digital world.
        </p>
        <div className="flex gap-3 mt-4">
          <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
            <Zap size={14} className="inline mr-1.5" />AI-Powered Security
          </div>
          <div className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
            <Lock size={14} className="inline mr-1.5" />End-to-End Encryption
          </div>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          {[
            { icon: Shield, label: 'Threat Detection', desc: 'Real-time' },
            { icon: Zap, label: 'Performance', desc: 'Blazing Fast' },
            { icon: Lock, label: 'Encryption', desc: 'AES-256' },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
              <item.icon size={20} className="text-cyan-400 mx-auto mb-1" />
              <div className="text-xs text-gray-200 font-medium">{item.label}</div>
              <div className="text-[10px] text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (url.includes('wikipedia.org')) {
    return (
      <div className="flex-1 overflow-y-auto p-6 bg-white/[0.02]">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-100 border-b border-white/[0.06] pb-2 mb-4">
            Cybersecurity
          </h1>
          <p className="text-xs text-gray-500 italic mb-4">
            From Wikipedia, the free encyclopedia
          </p>
          <div className="flex gap-4 mb-6">
            <div className="w-32 h-40 rounded bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Lock size={40} className="text-cyan-400/50" />
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Computer security, cybersecurity, or information technology security is the protection of computer systems and networks from attack by malicious actors that may result in unauthorized information disclosure, theft of, or damage to hardware, software, or data, as well as from the disruption or misdirection of the services they provide.
            </p>
          </div>
          <h2 className="text-lg font-semibold text-gray-200 mb-2">Contents</h2>
          <ul className="text-sm text-gray-400 space-y-1 mb-4 pl-4">
            <li>1 History</li>
            <li>2 Vulnerabilities and attacks</li>
            <li>3 Information security culture</li>
            <li>4 Systems at risk</li>
            <li>5 Impact of security breaches</li>
            <li>6 Computer protection</li>
          </ul>
          <h2 className="text-lg font-semibold text-gray-200 mb-2">History</h2>
          <p className="text-sm text-gray-300 leading-relaxed mb-3">
            Since the internet&apos;s creation and the world wide web&apos;s growth, the availability of information online has grown exponentially. This has created a need for cybersecurity measures to protect sensitive data from unauthorized access.
          </p>
          <h2 className="text-lg font-semibold text-gray-200 mb-2">Vulnerabilities and Attacks</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            A vulnerability is a weakness in design, implementation, operation, or internal control. Common vulnerabilities include SQL injection, cross-site scripting (XSS), and buffer overflows. Exploits are techniques that leverage vulnerabilities to gain unauthorized access.
          </p>
        </div>
      </div>
    );
  }

  if (url.includes('github.com')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 bg-black/20">
        <Globe size={48} className="text-gray-600" />
        <h2 className="text-xl font-bold text-gray-200">GitHub</h2>
        <p className="text-sm text-gray-400 max-w-sm">Where the world builds software. Millions of developers and companies build, ship, and maintain their software on GitHub.</p>
        <div className="mt-4 w-full max-w-xs h-8 rounded bg-white/[0.04] border border-white/[0.06]" />
        <div className="w-full max-w-xs h-8 rounded bg-cyan-500/20 border border-cyan-500/30 mt-2 flex items-center justify-center">
          <span className="text-xs text-cyan-300">Sign in</span>
        </div>
      </div>
    );
  }

  if (url.includes('stackoverflow.com')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 bg-black/20">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded bg-orange-500/20 flex items-center justify-center">
            <Zap size={18} className="text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-200">Stack Overflow</h2>
        </div>
        <p className="text-sm text-gray-400 max-w-sm">Where developers learn, share, and build careers. Find the best answer to your technical question.</p>
        <div className="mt-4 grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded bg-white/[0.03] border border-white/[0.06]">
            <div className="text-lg font-bold text-gray-200">24M+</div>
            <div className="text-[10px] text-gray-500">Questions</div>
          </div>
          <div className="p-3 rounded bg-white/[0.03] border border-white/[0.06]">
            <div className="text-lg font-bold text-gray-200">40M+</div>
            <div className="text-[10px] text-gray-500">Users</div>
          </div>
        </div>
      </div>
    );
  }

  if (url.includes('developer.mozilla.org')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 bg-black/20">
        <Globe size={48} className="text-blue-400/60" />
        <h2 className="text-xl font-bold text-gray-200">MDN Web Docs</h2>
        <p className="text-sm text-gray-400 max-w-sm">Resources for developers, by developers. Documentation for HTML, CSS, JavaScript, and Web APIs.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center gap-3 bg-black/20">
      <Globe size={48} className="text-gray-600" />
      <h2 className="text-lg font-medium text-gray-200">Page Loaded</h2>
      <p className="text-sm text-gray-500 max-w-sm break-all">{url || 'about:blank'}</p>
      <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
        <Lock size={12} />Connection simulated
      </div>
    </div>
  );
}

export default function BrowserApp({ windowId: _windowId }: AppProps) {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: '1', url: 'cyberwin.local', title: 'CyberWin' },
  ]);
  const [activeTabId, setActiveTabId] = useState('1');
  const [urlInput, setUrlInput] = useState('cyberwin.local');
  const [history, setHistory] = useState<Record<string, string[]>>({ '1': ['cyberwin.local'] });
  const [historyIndex, setHistoryIndex] = useState<Record<string, number>>({ '1': 0 });

  const activeTab = tabs.find((t) => t.id === activeTabId);

  const navigate = (url: string) => {
    const cleanUrl = url.trim().replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '');
    if (!cleanUrl) return;

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId
          ? { ...t, url: cleanUrl, title: cleanUrl.split('.')[0] || cleanUrl }
          : t
      )
    );
    setUrlInput(cleanUrl);

    setHistory((prev) => {
      const tabHistory = [...(prev[activeTabId] || [])];
      const currentIdx = historyIndex[activeTabId] ?? tabHistory.length - 1;
      const newHistory = tabHistory.slice(0, currentIdx + 1);
      newHistory.push(cleanUrl);
      return { ...prev, [activeTabId]: newHistory };
    });
    setHistoryIndex((prev) => ({
      ...prev,
      [activeTabId]: (prev[activeTabId] ?? 0) + 1,
    }));
  };

  const goBack = () => {
    const idx = historyIndex[activeTabId] ?? 0;
    if (idx <= 0) return;
    const newIdx = idx - 1;
    const tabHistory = history[activeTabId] || [];
    const url = tabHistory[newIdx];
    if (!url) return;

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url, title: url.split('.')[0] || url } : t
      )
    );
    setUrlInput(url);
    setHistoryIndex((prev) => ({ ...prev, [activeTabId]: newIdx }));
  };

  const goForward = () => {
    const tabHistory = history[activeTabId] || [];
    const idx = historyIndex[activeTabId] ?? 0;
    if (idx >= tabHistory.length - 1) return;
    const newIdx = idx + 1;
    const url = tabHistory[newIdx];
    if (!url) return;

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url, title: url.split('.')[0] || url } : t
      )
    );
    setUrlInput(url);
    setHistoryIndex((prev) => ({ ...prev, [activeTabId]: newIdx }));
  };

  const refresh = () => {
    if (activeTab) {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeTabId ? { ...t } : t))
      );
    }
  };

  const addTab = () => {
    const id = Date.now().toString();
    setTabs((prev) => [...prev, { id, url: '', title: 'New Tab' }]);
    setHistory((prev) => ({ ...prev, [id]: [''] }));
    setHistoryIndex((prev) => ({ ...prev, [id]: 0 }));
    setActiveTabId(id);
    setUrlInput('');
  };

  const closeTab = (tabId: string) => {
    if (tabs.length <= 1) return;
    const newTabs = tabs.filter((t) => t.id !== tabId);
    setTabs(newTabs);
    if (activeTabId === tabId) {
      const idx = newTabs.length - 1;
      setActiveTabId(newTabs[idx].id);
      setUrlInput(newTabs[idx].url);
    }
  };

  const selectTab = (tabId: string) => {
    setActiveTabId(tabId);
    const tab = tabs.find((t) => t.id === tabId);
    if (tab) setUrlInput(tab.url);
  };

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      {/* Tab bar */}
      <div className="flex items-center bg-black/30 border-b border-white/[0.06] overflow-x-auto">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => selectTab(tab.id)}
            className={`group flex items-center gap-2 px-3 py-1.5 text-xs cursor-pointer border-r border-white/[0.04] min-w-[120px] max-w-[180px] shrink-0 transition-colors ${
              activeTabId === tab.id
                ? 'bg-black/40 text-gray-200 border-b-2 border-b-cyan-400'
                : 'text-gray-500 hover:bg-white/[0.03]'
            }`}
          >
            <Globe size={12} className="shrink-0" />
            <span className="truncate flex-1">{tab.title || 'New Tab'}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
              className="opacity-0 group-hover:opacity-100 hover:bg-white/[0.1] rounded p-0.5 transition-opacity"
            >
              <X size={10} />
            </button>
          </div>
        ))}
        <button onClick={addTab} className="px-2 py-1.5 text-gray-500 hover:text-gray-300 hover:bg-white/[0.03] transition-colors">
          <Plus size={14} />
        </button>
      </div>

      {/* URL bar */}
      <div className="flex items-center gap-1.5 px-2 py-1.5 bg-black/20 border-b border-white/[0.06]">
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={goBack}>
          <ArrowLeft size={14} className="text-gray-400" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={goForward}>
          <ArrowRight size={14} className="text-gray-400" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={refresh}>
          <RotateCw size={14} className="text-gray-400" />
        </Button>
        <div className="flex-1 relative">
          <Lock size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-600" />
          <Input
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') navigate(urlInput);
            }}
            placeholder="Enter URL..."
            className="h-7 pl-7 pr-14 text-xs bg-white/[0.04] border-white/[0.06] text-gray-200"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-0.5 top-0.5 h-6 px-2 text-[10px] text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
            onClick={() => navigate(urlInput)}
          >
            Go
          </Button>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => navigate('cyberwin.local')}>
          <Home size={14} className="text-gray-400" />
        </Button>
      </div>

      {/* Bookmarks bar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-black/10 border-b border-white/[0.04] overflow-x-auto">
        {BOOKMARKS.map((bm) => (
          <button
            key={bm.url}
            onClick={() => {
              setActiveTabId(activeTabId);
              setUrlInput(bm.url);
              navigate(bm.url);
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[11px] text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] transition-colors shrink-0"
          >
            <Star size={10} className="text-cyan-500/60" />
            {bm.label}
          </button>
        ))}
      </div>

      {/* Content area */}
      {activeTab ? (
        <SimulatedPage url={activeTab.url} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          No tab selected
        </div>
      )}
    </div>
  );
}