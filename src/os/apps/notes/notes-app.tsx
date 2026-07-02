'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AppProps } from '@/os/types';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

const SEED_NOTES: Note[] = [
  {
    id: '1',
    title: 'Security Audit Checklist',
    content: `Security Audit Checklist\n=====================\n\n1. Firewall Rules Review\n   - Verify all inbound rules\n   - Check port 22 access restrictions\n   - Ensure default deny policy\n\n2. SSL/TLS Configuration\n   - Check certificate expiration dates\n   - Verify TLS 1.3 is enforced\n   - Test cipher suite configuration\n\n3. Access Control\n   - Review user permissions\n   - Check for orphaned accounts\n   - Validate sudo access\n\n4. Network Security\n   - Scan for open ports\n   - Review IDS/IPS alerts\n   - Check VPN configurations\n\nDeadline: January 31, 2024`,
    updatedAt: '2024-01-22',
  },
  {
    id: '2',
    title: 'Network Configuration',
    content: `Network Configuration Notes\n===========================\n\nSubnet: 192.168.1.0/24\nGateway: 192.168.1.1\nDNS Primary: 1.1.1.1\nDNS Secondary: 8.8.8.8\n\nVLAN Configuration:\n- VLAN 10: Management (192.168.10.0/24)\n- VLAN 20: Development (192.168.20.0/24)\n- VLAN 30: Production (192.168.30.0/24)`,
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    title: 'Meeting Notes - Sprint Planning',
    content: `Sprint Planning - Jan 22, 2024\n=============================\n\nAttendees: Security Team\n\nAction Items:\n1. Complete vulnerability scan by Wednesday\n2. Update firewall rules for new subnet\n3. Deploy updated IDS signatures\n4. Review access logs from weekend incident`,
    updatedAt: '2024-01-22',
  },
];

export default function NotesApp({ windowId: _windowId }: AppProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    if (typeof window === 'undefined') return SEED_NOTES;
    try {
      const saved = localStorage.getItem('cyberwin_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { /* ignore */ }
    return SEED_NOTES;
  });
  const [activeNoteId, setActiveNoteId] = useState<string>(() => {
    if (typeof window === 'undefined') return SEED_NOTES[0].id;
    try {
      const saved = localStorage.getItem('cyberwin_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch { /* ignore */ }
    return SEED_NOTES[0].id;
  });

  const [searchQuery, setSearchQuery] = useState('');

  // Seed localStorage on first load
  useEffect(() => {
    const hasExisting = localStorage.getItem('cyberwin_notes');
    if (!hasExisting) {
      try { localStorage.setItem('cyberwin_notes', JSON.stringify(SEED_NOTES)); } catch { /* noop */ }
    }
  }, []);

  // Persist notes to localStorage whenever they change
  const saveNotes = useCallback((updated: Note[]) => {
    setNotes(updated);
    try { localStorage.setItem('cyberwin_notes', JSON.stringify(updated)); } catch { /* noop */ }
  }, []);

  const activeNote = notes.find((n) => n.id === activeNoteId);

  const filteredNotes = searchQuery
    ? notes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          n.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : notes;

  const updateNote = (id: string, content: string) => {
    saveNotes(
      notes.map((n) => {
        if (n.id !== id) return n;
        const firstLine = content.split('\n')[0] || 'Untitled';
        return { ...n, content, title: firstLine.replace(/[#*=\-_]/g, '').trim() || 'Untitled', updatedAt: new Date().toISOString().slice(0, 10) };
      })
    );
  };

  const createNote = () => {
    const id = Date.now().toString();
    const newNote: Note = { id, title: 'Untitled', content: '', updatedAt: new Date().toISOString().slice(0, 10) };
    saveNotes([newNote, ...notes]);
    setActiveNoteId(id);
  };

  const deleteNote = (id: string) => {
    const remaining = notes.filter((n) => n.id !== id);
    saveNotes(remaining);
    if (activeNoteId === id && remaining.length > 0) {
      setActiveNoteId(remaining[0].id);
    } else if (remaining.length === 0) {
      setActiveNoteId('');
    }
  };

  const wordCount = activeNote ? activeNote.content.trim().split(/\s+/).filter(Boolean).length : 0;
  const charCount = activeNote ? activeNote.content.length : 0;

  

  return (
    <div className="h-full w-full flex bg-black/20">
      {/* Sidebar */}
      <div className="w-56 shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="p-2 space-y-2">
          <div className="flex items-center gap-1.5">
            <div className="relative flex-1">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-7 pl-7 text-xs bg-white/[0.04] border-white/[0.06]"
              />
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={createNote}>
              <Plus size={14} className="text-cyan-400" />
            </Button>
          </div>
        </div>
        <Separator className="opacity-50" />
        <ScrollArea className="flex-1">
          <div className="p-1 space-y-0.5">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`group px-3 py-2 rounded-md cursor-pointer transition-colors ${
                  activeNoteId === note.id ? 'bg-cyan-500/10' : 'hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-medium truncate ${activeNoteId === note.id ? 'text-cyan-300' : 'text-gray-200'}`}>
                      {note.title}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                      {note.updatedAt} · {note.content.slice(0, 40).replace(/\n/g, ' ')}...
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNote(note.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col min-w-0">
        {activeNote ? (
          <>
            <textarea
              value={activeNote.content}
              onChange={(e) => updateNote(activeNote.id, e.target.value)}
              className="flex-1 w-full bg-transparent text-gray-200 text-sm p-4 resize-none outline-none font-mono leading-relaxed placeholder:text-gray-600"
              placeholder="Start typing..."
              spellCheck={false}
            />
            <Separator className="opacity-50" />
            <div className="flex items-center justify-between px-4 py-1.5 text-[11px] text-gray-500">
              <span>{wordCount} words · {charCount} characters</span>
              <span>Last edited: {activeNote.updatedAt}</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
            Select a note or create a new one
          </div>
        )}
      </div>
    </div>
  );
}