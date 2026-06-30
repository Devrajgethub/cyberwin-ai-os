'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, RefreshCw, LayoutGrid, List, Folder, FileText, ImageIcon, File, Music, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AppProps } from '@/os/types';

interface FSItem {
  type: 'dir' | 'file';
  children?: Record<string, FSItem>;
  size?: string;
  modified?: string;
  ext?: string;
}

const fileSystem: FSItem = {
  type: 'dir',
  children: {
    Documents: {
      type: 'dir',
      children: {
        'report.pdf': { type: 'file', size: '2.4 MB', modified: '2024-01-15', ext: 'pdf' },
        'notes.md': { type: 'file', size: '12 KB', modified: '2024-01-20', ext: 'md' },
        'audit-plan.docx': { type: 'file', size: '856 KB', modified: '2024-01-18', ext: 'docx' },
      },
    },
    Downloads: {
      type: 'dir',
      children: {
        'setup-tool.deb': { type: 'file', size: '45.2 MB', modified: '2024-01-10', ext: 'deb' },
        'wallpaper.png': { type: 'file', size: '1.8 MB', modified: '2024-01-18', ext: 'png' },
        'scan-script.sh': { type: 'file', size: '4.2 KB', modified: '2024-01-22', ext: 'sh' },
      },
    },
    Desktop: { type: 'dir', children: {} },
    Pictures: {
      type: 'dir',
      children: {
        'screenshot-01.png': { type: 'file', size: '2.1 MB', modified: '2024-01-19', ext: 'png' },
        'logo.svg': { type: 'file', size: '8 KB', modified: '2024-01-05', ext: 'svg' },
      },
    },
    Projects: {
      type: 'dir',
      children: {
        'cyber-tool': {
          type: 'dir',
          children: {
            'main.py': { type: 'file', size: '4.2 KB', modified: '2024-01-22', ext: 'py' },
            'README.md': { type: 'file', size: '1.1 KB', modified: '2024-01-22', ext: 'md' },
            'requirements.txt': { type: 'file', size: '256 B', modified: '2024-01-22', ext: 'txt' },
          },
        },
        'web-scanner': {
          type: 'dir',
          children: {
            'index.ts': { type: 'file', size: '6.8 KB', modified: '2024-01-21', ext: 'ts' },
            'package.json': { type: 'file', size: '512 B', modified: '2024-01-21', ext: 'json' },
          },
        },
      },
    },
    Music: { type: 'dir', children: {} },
    Videos: { type: 'dir', children: {} },
    '.bashrc': { type: 'file', size: '2.1 KB', modified: '2024-01-01', ext: 'bashrc' },
    '.config': { type: 'dir', children: {} },
    '.ssh': {
      type: 'dir',
      children: {
        'id_rsa.pub': { type: 'file', size: '742 B', modified: '2023-12-15', ext: 'pub' },
        'known_hosts': { type: 'file', size: '3.4 KB', modified: '2024-01-20', ext: 'hosts' },
      },
    },
    'notes.md': { type: 'file', size: '4.5 KB', modified: '2024-01-22', ext: 'md' },
    'scan_results.log': { type: 'file', size: '12 KB', modified: '2024-01-22', ext: 'log' },
  },
};

function getFileIcon(ext?: string) {
  if (!ext) return <File size={18} className="text-gray-400" />;
  const e = ext.toLowerCase();
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(e)) return <ImageIcon size={18} className="text-purple-400" />;
  if (['mp3', 'wav', 'flac', 'ogg'].includes(e)) return <Music size={18} className="text-pink-400" />;
  if (['mp4', 'mkv', 'avi', 'webm'].includes(e)) return <Video size={18} className="text-orange-400" />;
  if (['md', 'txt', 'docx', 'pdf', 'doc'].includes(e)) return <FileText size={18} className="text-cyan-400" />;
  if (['py', 'ts', 'js', 'sh', 'json', 'toml'].includes(e)) return <FileText size={18} className="text-green-400" />;
  return <File size={18} className="text-gray-400" />;
}

const sidebarItems = [
  { name: 'Home', path: '/home/cyberwin' },
  { name: 'Documents', path: '/home/cyberwin/Documents' },
  { name: 'Downloads', path: '/home/cyberwin/Downloads' },
  { name: 'Desktop', path: '/home/cyberwin/Desktop' },
  { name: 'Pictures', path: '/home/cyberwin/Pictures' },
  { name: 'Projects', path: '/home/cyberwin/Projects' },
  { name: 'Music', path: '/home/cyberwin/Music' },
  { name: 'Videos', path: '/home/cyberwin/Videos' },
];

function getChildrenAtPath(path: string): { name: string; item: FSItem }[] | null {
  const parts = path.replace('/home/cyberwin', '').split('/').filter(Boolean);
  let current: FSItem = fileSystem;
  for (const part of parts) {
    if (current.type !== 'dir' || !current.children?.[part]) return null;
    current = current.children[part];
  }
  if (current.type !== 'dir' || !current.children) return null;
  return Object.entries(current.children)
    .map(([name, item]) => ({ name, item }))
    .sort((a, b) => {
      if (a.item.type === b.item.type) return a.name.localeCompare(b.name);
      return a.item.type === 'dir' ? -1 : 1;
    });
}

export default function FileManagerApp({ windowId: _windowId }: AppProps) {
  const [currentPath, setCurrentPath] = useState('/home/cyberwin');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(['/home/cyberwin']);
  const [historyIdx, setHistoryIdx] = useState(0);

  const items = useMemo(() => getChildrenAtPath(currentPath), [currentPath]);
  const pathParts = currentPath.split('/').filter(Boolean);

  const navigate = (path: string) => {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setCurrentPath(path);
    setSelected(null);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setCurrentPath(history[historyIdx - 1]);
      setSelected(null);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setCurrentPath(history[historyIdx + 1]);
      setSelected(null);
    }
  };

  const goUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 2) {
      parts.pop();
      navigate('/' + parts.join('/'));
    }
  };

  const handleDoubleClick = (name: string, item: FSItem) => {
    if (item.type === 'dir') {
      navigate(currentPath === '/' ? `/${name}` : `${currentPath}/${name}`);
    }
  };

  const selectedFile = selected && items
    ? items.find((i) => i.name === selected)
    : null;

  return (
    <div className="h-full w-full flex bg-black/20">
      {/* Sidebar */}
      <div className="w-44 shrink-0 border-r border-white/[0.06] p-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
          Quick Access
        </div>
        <ScrollArea className="h-[calc(100%-28px)]">
          <div className="flex flex-col gap-0.5">
            {sidebarItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors text-left w-full ${
                  currentPath === item.path
                    ? 'bg-cyan-500/10 text-cyan-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                }`}
              >
                <Folder size={14} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-3 py-2 border-b border-white/[0.06]">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goBack} disabled={historyIdx <= 0}>
            <ChevronLeft size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goForward} disabled={historyIdx >= history.length - 1}>
            <ChevronRight size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={goUp}>
            <ChevronRight size={14} className="rotate-[-90deg]" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => navigate('/home/cyberwin')}>
            <RefreshCw size={12} />
          </Button>
          <Separator orientation="vertical" className="h-5 mx-1" />
          {/* Breadcrumb */}
          <div className="flex-1 flex items-center gap-0.5 text-xs text-gray-400 overflow-x-auto min-w-0">
            {pathParts.map((part, i) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight size={10} className="shrink-0 text-gray-600" />}
                <button
                  onClick={() => navigate('/' + pathParts.slice(0, i + 1).join('/'))}
                  className="hover:text-cyan-400 transition-colors shrink-0"
                >
                  {part}
                </button>
              </React.Fragment>
            ))}
          </div>
          <Separator orientation="vertical" className="h-5 mx-1" />
          <div className="flex gap-0.5">
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('list')}
            >
              <List size={14} />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={14} />
            </Button>
          </div>
        </div>

        {/* File List */}
        <div className="flex-1 flex min-h-0">
          <ScrollArea className="flex-1">
            {viewMode === 'list' ? (
              <div className="p-1">
                {/* Header */}
                <div className="grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/[0.04]">
                  <span>Name</span>
                  <span>Size</span>
                  <span>Modified</span>
                </div>
                {items && items.length > 0 ? (
                  items.map(({ name, item }) => (
                    <div
                      key={name}
                      className={`grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
                        selected === name ? 'bg-cyan-500/10 text-cyan-300' : 'hover:bg-white/[0.03] text-gray-300'
                      }`}
                      onClick={() => setSelected(name)}
                      onDoubleClick={() => handleDoubleClick(name, item)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.type === 'dir' ? (
                          <Folder size={16} className="text-cyan-400 shrink-0" />
                        ) : (
                          getFileIcon(item.ext)
                        )}
                        <span className="truncate">{name}</span>
                      </div>
                      <span className="text-gray-500 text-xs">{item.size || '--'}</span>
                      <span className="text-gray-500 text-xs">{item.modified || '--'}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                    Empty folder
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 p-3">
                {items && items.length > 0 ? (
                  items.map(({ name, item }) => (
                    <div
                      key={name}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer transition-colors ${
                        selected === name ? 'bg-cyan-500/10' : 'hover:bg-white/[0.03]'
                      }`}
                      onClick={() => setSelected(name)}
                      onDoubleClick={() => handleDoubleClick(name, item)}
                    >
                      {item.type === 'dir' ? (
                        <Folder size={32} className="text-cyan-400" />
                      ) : (
                        <div className="transform scale-[1.8] mb-2">{getFileIcon(item.ext)}</div>
                      )}
                      <span className="text-xs text-gray-300 text-center truncate w-full">{name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-4 flex items-center justify-center h-32 text-gray-500 text-sm">
                    Empty folder
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Details Panel */}
          {selectedFile && (
            <div className="w-48 shrink-0 border-l border-white/[0.06] p-3">
              <div className="text-xs font-semibold text-gray-400 mb-3">Details</div>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="text-gray-500">Name</div>
                  <div className="text-gray-200">{selectedFile.name}</div>
                </div>
                <div>
                  <div className="text-gray-500">Type</div>
                  <div className="text-gray-200">{selectedFile.item.type === 'dir' ? 'Folder' : 'File'}</div>
                </div>
                {selectedFile.item.size && (
                  <div>
                    <div className="text-gray-500">Size</div>
                    <div className="text-gray-200">{selectedFile.item.size}</div>
                  </div>
                )}
                {selectedFile.item.modified && (
                  <div>
                    <div className="text-gray-500">Modified</div>
                    <div className="text-gray-200">{selectedFile.item.modified}</div>
                  </div>
                )}
                {selectedFile.item.ext && (
                  <div>
                    <div className="text-gray-500">Extension</div>
                    <div className="text-gray-200">.{selectedFile.item.ext}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}