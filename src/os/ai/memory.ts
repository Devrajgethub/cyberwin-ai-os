/**
 * CyberWin AI OS — Simple in-memory conversation memory.
 *
 * Stores recent messages so the AI can reference short-term context.
 * All data lives in a client-side array (no persistence across reloads).
 */

export interface MemoryEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

const MAX_ENTRIES = 50;
const memory: MemoryEntry[] = [];

export function addToMemory(entry: MemoryEntry): void {
  memory.push(entry);
  // Trim oldest entries when we exceed the limit
  while (memory.length > MAX_ENTRIES) {
    memory.shift();
  }
}

export function getMemory(): MemoryEntry[] {
  return [...memory];
}

export function clearMemory(): void {
  memory.length = 0;
}

export function getRecentMemory(count = 10): MemoryEntry[] {
  return memory.slice(-count);
}