/**
 * CyberWin AI OS — Brain (Client-side Orchestrator)
 *
 * Handles:
 * - Executing OS actions from AI tool calls
 * - Voice synthesis (Jarvis-style TTS)
 * - Coordinating between useChat and the OS store
 */

import { useOSStore } from '@/os/store';
import { appRegistry } from '@/os/apps/registry';
import { APP_FRIENDLY_NAMES, OPENABLE_APPS, type OSAction } from './tools';
import { addToMemory, type MemoryEntry } from './memory';

// ── Voice Synthesis (Jarvis-style TTS) ──

let currentUtterance: SpeechSynthesisUtterance | null = null;

/** Detect if text is Hindi/Devanagari */
function isHindi(text: string): boolean {
  return /[\u0900-\u097F]/.test(text);
}

/** Pick the best available voice for Jarvis-style speech */
function selectBestVoice(text: string): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  const hasHindi = isHindi(text);

  if (hasHindi) {
    return (
      voices.find((v) => v.lang === 'hi-IN' && v.name.includes('Google')) ??
      voices.find((v) => v.lang === 'hi-IN') ??
      voices.find((v) => v.lang.startsWith('hi')) ??
      voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) ??
      voices.find((v) => v.lang.startsWith('en')) ??
      voices[0]
    );
  }

  return (
    voices.find((v) => v.lang === 'en-IN' && v.name.includes('Google')) ??
    voices.find((v) => v.lang.startsWith('en') && v.name.includes('Google')) ??
    voices.find((v) => v.lang === 'en-US' && !v.name.includes('Female')) ??
    voices.find((v) => v.lang.startsWith('en') && v.name.includes('Natural')) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    voices[0]
  );
}

// Pre-load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    selectBestVoice('hello');
  };
}

/**
 * Jarvis-style TTS — speaks text with natural voice selection.
 */
export function speak(text: string, enabled: boolean): void {
  if (!enabled) return;
  speakDirect(text);
}

/**
 * Speak with explicit text — can be called from anywhere.
 */
export function speakDirect(text: string): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;

  const clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\n{2,}/g, '. ')
    .replace(/\n/g, ', ')
    .trim();

  if (!clean) return;

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1.05;
  utterance.pitch = 1.1;
  utterance.volume = 0.85;

  const voice = selectBestVoice(clean);
  if (voice) utterance.voice = voice;

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}

// ── OS Action Execution ──

export interface ActionResult {
  success: boolean;
  message: string;
}

export function executeOSAction(action: OSAction): ActionResult {
  const store = useOSStore.getState();

  switch (action.type) {
    case 'open_app': {
      const appId = action.appId;
      if (!OPENABLE_APPS.includes(appId as typeof OPENABLE_APPS[number])) {
        return { success: false, message: `Unknown app: ${appId}` };
      }
      const meta = appRegistry.find((a) => a.id === appId);
      if (!meta) {
        return { success: false, message: `App not found: ${appId}` };
      }
      store.openWindow(appId, meta.title, meta.defaultWidth, meta.defaultHeight, meta.minWidth, meta.minHeight);
      const friendly = APP_FRIENDLY_NAMES[appId] || appId;
      return { success: true, message: `✅ ${friendly} opened` };
    }

    case 'lock_screen': {
      store.setBootPhase('locked');
      return { success: true, message: '🔒 Screen locked' };
    }

    case 'create_note': {
      import('@/os/lib/db').then(({ dbSaveNote }) => {
        dbSaveNote({
          id: `note-${Date.now()}`,
          title: action.title || 'Untitled',
          content: action.content || '',
          updatedAt: new Date().toISOString(),
        });
      }).catch(() => {});
      return { success: true, message: `📝 Note "${action.title}" created` };
    }

    case 'show_tasks': {
      const todoMeta = appRegistry.find((a) => a.id === 'todo');
      if (todoMeta) {
        store.openWindow('todo', 'Todo', todoMeta.defaultWidth, todoMeta.defaultHeight, todoMeta.minWidth, todoMeta.minHeight);
      }
      return { success: true, message: '📋 Showing your tasks' };
    }

    case 'show_recent_files': {
      const fmMeta = appRegistry.find((a) => a.id === 'file-manager');
      if (fmMeta) {
        store.openWindow('file-manager', 'File Manager', fmMeta.defaultWidth, fmMeta.defaultHeight, fmMeta.minWidth, fmMeta.minHeight);
      }
      return { success: true, message: '📂 Showing recent files' };
    }

    default:
      return { success: false, message: `Unknown action type` };
  }
}

// ── Memory helpers ──

export function trackMessage(role: 'user' | 'assistant', content: string): void {
  const entry: MemoryEntry = {
    role,
    content: content.slice(0, 500),
    timestamp: Date.now(),
  };
  addToMemory(entry);
}