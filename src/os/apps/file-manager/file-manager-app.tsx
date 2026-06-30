'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ChevronRight, ChevronLeft, RefreshCw, LayoutGrid, List, Folder, FileText,
  ImageIcon, File, Music, Video, FolderPlus, FilePlus, Pencil, Trash2, Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AppProps } from '@/os/types';
import { dbGetAllFiles, dbSaveFile, dbDeleteFile, type StoredFile } from '@/os/lib/db';

// --- Seed data ---
const seedFiles: StoredFile[] = [
  { path: '/home/cyberwin', name: 'cyberwin', type: 'dir', modified: '2024-01-22' },
  { path: '/home/cyberwin/Documents', name: 'Documents', type: 'dir', modified: '2024-01-22' },
  { path: '/home/cyberwin/Downloads', name: 'Downloads', type: 'dir', modified: '2024-01-22' },
  { path: '/home/cyberwin/Desktop', name: 'Desktop', type: 'dir', modified: '2024-01-01' },
  { path: '/home/cyberwin/Pictures', name: 'Pictures', type: 'dir', modified: '2024-01-19' },
  { path: '/home/cyberwin/Projects', name: 'Projects', type: 'dir', modified: '2024-01-22' },
  { path: '/home/cyberwin/Music', name: 'Music', type: 'dir', modified: '2024-01-01' },
  { path: '/home/cyberwin/Videos', name: 'Videos', type: 'dir', modified: '2024-01-01' },
  { path: '/home/cyberwin/.ssh', name: '.ssh', type: 'dir', modified: '2024-01-20' },
  { path: '/home/cyberwin/.config', name: '.config', type: 'dir', modified: '2024-01-01' },

  { path: '/home/cyberwin/Documents/report.pdf', name: 'report.pdf', type: 'file', size: '2.4 MB', modified: '2024-01-15' },
  { path: '/home/cyberwin/Documents/notes.md', name: 'notes.md', type: 'file', size: '12 KB', modified: '2024-01-20', content: '# Notes\n\nSome important notes here.' },
  { path: '/home/cyberwin/Documents/audit-plan.docx', name: 'audit-plan.docx', type: 'file', size: '856 KB', modified: '2024-01-18' },
  { path: '/home/cyberwin/Documents/readme.txt', name: 'readme.txt', type: 'file', size: '1 KB', modified: '2024-01-22', content: 'Welcome to CyberWin AI OS.\nThis is your Documents folder.' },

  { path: '/home/cyberwin/Downloads/setup-tool.deb', name: 'setup-tool.deb', type: 'file', size: '45.2 MB', modified: '2024-01-10' },
  { path: '/home/cyberwin/Downloads/wallpaper.png', name: 'wallpaper.png', type: 'file', size: '1.8 MB', modified: '2024-01-18' },
  { path: '/home/cyberwin/Downloads/scan-script.sh', name: 'scan-script.sh', type: 'file', size: '4.2 KB', modified: '2024-01-22' },

  { path: '/home/cyberwin/Pictures/screenshot-01.png', name: 'screenshot-01.png', type: 'file', size: '2.1 MB', modified: '2024-01-19' },
  { path: '/home/cyberwin/Pictures/logo.svg', name: 'logo.svg', type: 'file', size: '8 KB', modified: '2024-01-05' },

  { path: '/home/cyberwin/Projects/cyber-tool', name: 'cyber-tool', type: 'dir', modified: '2024-01-22' },
  { path: '/home/cyberwin/Projects/web-scanner', name: 'web-scanner', type: 'dir', modified: '2024-01-21' },

  { path: '/home/cyberwin/Projects/cyber-tool/main.py', name: 'main.py', type: 'file', size: '4.2 KB', modified: '2024-01-22', content: '#!/usr/bin/env python3\nimport sys\n\ndef main():\n    print("CyberTool v1.0")\n\nif __name__ == "__main__":\n    main()\n' },
  { path: '/home/cyberwin/Projects/cyber-tool/README.md', name: 'README.md', type: 'file', size: '1.1 KB', modified: '2024-01-22', content: '# CyberTool\n\nA cybersecurity toolkit.' },
  { path: '/home/cyberwin/Projects/cyber-tool/requirements.txt', name: 'requirements.txt', type: 'file', size: '256 B', modified: '2024-01-22', content: 'scapy==2.5.0\nrequests==2.31.0\n' },

  { path: '/home/cyberwin/Projects/web-scanner/index.ts', name: 'index.ts', type: 'file', size: '6.8 KB', modified: '2024-01-21', content: 'import { Scanner } from "./scanner";\n\nconst s = new Scanner();\ns.run();\n' },
  { path: '/home/cyberwin/Projects/web-scanner/package.json', name: 'package.json', type: 'file', size: '512 B', modified: '2024-01-21', content: '{\n  "name": "web-scanner",\n  "version": "1.0.0"\n}\n' },

  { path: '/home/cyberwin/.ssh/id_rsa.pub', name: 'id_rsa.pub', type: 'file', size: '742 B', modified: '2023-12-15' },
  { path: '/home/cyberwin/.ssh/known_hosts', name: 'known_hosts', type: 'file', size: '3.4 KB', modified: '2024-01-20' },

  { path: '/home/cyberwin/.bashrc', name: '.bashrc', type: 'file', size: '2.1 KB', modified: '2024-01-01' },
  { path: '/home/cyberwin/notes.md', name: 'notes.md', type: 'file', size: '4.5 KB', modified: '2024-01-22', content: '# My Notes\n\nCyberWin AI OS is awesome.' },
  { path: '/home/cyberwin/scan_results.log', name: 'scan_results.log', type: 'file', size: '12 KB', modified: '2024-01-22' },
];

function getExt(name: string): string {
  const parts = name.split('.');
  return parts.length > 1 ? parts[parts.length - 1] : '';
}

function getFileIcon(ext: string) {
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

function getDirectChildren(files: StoredFile[], dirPath: string): StoredFile[] {
  const prefix = dirPath === '/home/cyberwin' ? '/home/cyberwin/' : dirPath + '/';
  return files.filter((f) => {
    if (f.path === dirPath) return false;
    if (!f.path.startsWith(prefix)) return false;
    const rest = f.path.slice(prefix.length);
    // Only direct children (no deeper nesting)
    return !rest.includes('/');
  }).sort((a, b) => {
    if (a.type === b.type) return a.name.localeCompare(b.name);
    return a.type === 'dir' ? -1 : 1;
  });
}

export default function FileManagerApp({ windowId: _windowId }: AppProps) {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [currentPath, setCurrentPath] = useState('/home/cyberwin');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selected, setSelected] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>(['/home/cyberwin']);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [viewerFile, setViewerFile] = useState<StoredFile | null>(null);

  // Load files from IndexedDB, seed if empty
  useEffect(() => {
    async function load() {
      try {
        let all = await dbGetAllFiles();
        if (all.length === 0) {
          for (const f of seedFiles) {
            await dbSaveFile(f);
          }
          all = seedFiles;
        }
        setFiles(all);
      } catch {
        setFiles(seedFiles);
      }
    }
    load();
  }, []);

  const navigate = useCallback((path: string) => {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(path);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setCurrentPath(path);
    setSelected(null);
    setViewerFile(null);
  }, [history, historyIdx]);

  const goBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setCurrentPath(history[historyIdx - 1]);
      setSelected(null);
      setViewerFile(null);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setCurrentPath(history[historyIdx + 1]);
      setSelected(null);
      setViewerFile(null);
    }
  };

  const goUp = () => {
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 2) {
      parts.pop();
      navigate('/' + parts.join('/'));
    }
  };

  const handleDoubleClick = (file: StoredFile) => {
    if (file.type === 'dir') {
      navigate(file.path);
    } else {
      const ext = getExt(file.name).toLowerCase();
      if (['txt', 'md', 'log', 'sh', 'py', 'ts', 'js', 'json', 'toml'].includes(ext) && file.content) {
        setViewerFile(file);
      } else {
        console.log('Open file:', file.path);
      }
    }
  };

  // File operations
  const doSaveFile = useCallback(async (file: StoredFile) => {
    await dbSaveFile(file);
    setFiles((prev) => {
      const idx = prev.findIndex((f) => f.path === file.path);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = file;
        return next;
      }
      return [...prev, file];
    });
  }, []);

  const doDeleteFile = useCallback(async (path: string) => {
    await dbDeleteFile(path);
    // Also delete all children if it's a dir
    setFiles((prev) => prev.filter((f) => !f.path.startsWith(path + '/') && f.path !== path));
  }, []);

  const handleNewFolder = () => {
    const name = window.prompt('New folder name:');
    if (!name) return;
    const safeName = name.trim();
    if (!safeName) return;
    const newPath = currentPath === '/home/cyberwin'
      ? `/home/cyberwin/${safeName}`
      : `${currentPath}/${safeName}`;
    const now = new Date().toISOString().slice(0, 10);
    const newFile: StoredFile = { path: newPath, name: safeName, type: 'dir', modified: now };
    doSaveFile(newFile);
  };

  const handleNewFile = () => {
    const name = window.prompt('New file name (e.g. document.txt):');
    if (!name) return;
    const safeName = name.trim();
    if (!safeName) return;
    const newPath = currentPath === '/home/cyberwin'
      ? `/home/cyberwin/${safeName}`
      : `${currentPath}/${safeName}`;
    const now = new Date().toISOString().slice(0, 10);
    const newFile: StoredFile = { path: newPath, name: safeName, type: 'file', size: '0 B', modified: now, content: '' };
    doSaveFile(newFile);
  };

  const handleRename = () => {
    if (!selected) return;
    const file = files.find((f) => f.path === currentPath + '/' + selected || (currentPath === '/home/cyberwin' && f.path === '/home/cyberwin/' + selected));
    if (!file) return;
    const newName = window.prompt('Rename to:', file.name);
    if (!newName || newName.trim() === file.name) return;
    const safeName = newName.trim();
    if (!safeName) return;
    const parentPath = file.path.substring(0, file.path.length - file.name.length);
    const newPath = parentPath + safeName;
    const now = new Date().toISOString().slice(0, 10);

    // If it's a directory, update all children paths
    if (file.type === 'dir') {
      const children = files.filter((f) => f.path.startsWith(file.path + '/'));
      for (const child of children) {
        const childNewPath = newPath + child.path.slice(file.path.length);
        const updated: StoredFile = { ...child, path: childNewPath };
        doSaveFile(updated);
      }
    }

    const updated: StoredFile = { ...file, path: newPath, name: safeName, modified: now };
    doSaveFile(updated);
    // Also delete the old entry
    dbDeleteFile(file.path);
    setFiles((prev) => prev.filter((f) => f.path !== file.path));
    setSelected(null);
  };

  const handleDelete = () => {
    if (!selected) return;
    const targetPath = currentPath === '/home/cyberwin'
      ? `/home/cyberwin/${selected}`
      : `${currentPath}/${selected}`;
    const confirmed = window.confirm(`Delete "${selected}"?`);
    if (!confirmed) return;
    doDeleteFile(targetPath);
    setSelected(null);
    setViewerFile(null);
  };

  const items = useMemo(() => getDirectChildren(files, currentPath), [files, currentPath]);
  const pathParts = currentPath.split('/').filter(Boolean);

  const selectedFile = selected
    ? items.find((i) => i.name === selected)
    : null;

  // File viewer
  if (viewerFile) {
    return (
      <div className="h-full w-full flex flex-col bg-black/20">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-white/[0.06]">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewerFile(null)}>
            <ChevronLeft size={14} />
          </Button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Eye size={14} className="text-cyan-400 shrink-0" />
            <span className="text-xs text-gray-200 truncate">{viewerFile.path}</span>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <pre className="p-4 text-xs text-gray-300 font-mono whitespace-pre-wrap leading-relaxed">
            {viewerFile.content || '(empty file)'}
          </pre>
        </ScrollArea>
      </div>
    );
  }

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
          {/* Action buttons */}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNewFolder} title="New Folder">
            <FolderPlus size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleNewFile} title="New File">
            <FilePlus size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleRename} disabled={!selected} title="Rename">
            <Pencil size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDelete} disabled={!selected} title="Delete">
            <Trash2 size={14} className="text-red-400/70" />
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
                <div className="grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-1.5 text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/[0.04]">
                  <span>Name</span>
                  <span>Size</span>
                  <span>Modified</span>
                </div>
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.path}
                      className={`grid grid-cols-[1fr_80px_100px] gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
                        selected === item.name ? 'bg-cyan-500/10 text-cyan-300' : 'hover:bg-white/[0.03] text-gray-300'
                      }`}
                      onClick={() => setSelected(item.name)}
                      onDoubleClick={() => handleDoubleClick(item)}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {item.type === 'dir' ? (
                          <Folder size={16} className="text-cyan-400 shrink-0" />
                        ) : (
                          getFileIcon(getExt(item.name))
                        )}
                        <span className="truncate">{item.name}</span>
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
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.path}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg cursor-pointer transition-colors ${
                        selected === item.name ? 'bg-cyan-500/10' : 'hover:bg-white/[0.03]'
                      }`}
                      onClick={() => setSelected(item.name)}
                      onDoubleClick={() => handleDoubleClick(item)}
                    >
                      {item.type === 'dir' ? (
                        <Folder size={32} className="text-cyan-400" />
                      ) : (
                        <div className="transform scale-[1.8] mb-2">{getFileIcon(getExt(item.name))}</div>
                      )}
                      <span className="text-xs text-gray-300 text-center truncate w-full">{item.name}</span>
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
                  <div className="text-gray-200">{selectedFile.type === 'dir' ? 'Folder' : 'File'}</div>
                </div>
                {selectedFile.size && (
                  <div>
                    <div className="text-gray-500">Size</div>
                    <div className="text-gray-200">{selectedFile.size}</div>
                  </div>
                )}
                {selectedFile.modified && (
                  <div>
                    <div className="text-gray-500">Modified</div>
                    <div className="text-gray-200">{selectedFile.modified}</div>
                  </div>
                )}
                <div>
                  <div className="text-gray-500">Extension</div>
                  <div className="text-gray-200">{getExt(selectedFile.name) || '--'}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}