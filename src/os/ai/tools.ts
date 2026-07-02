/**
 * CyberWin AI OS — AI Tool Definitions
 *
 * Defines the tools/actions the AI can perform within the OS,
 * plus helper maps for friendly names and openable app IDs.
 */

// ── Action types the AI can request ──

export type OSAction =
  | { type: 'open_app'; appId: string }
  | { type: 'lock_screen' }
  | { type: 'create_note'; title?: string; content?: string }
  | { type: 'show_tasks' }
  | { type: 'show_recent_files' };

// ── Friendly names for apps (shown in AI responses) ──

export const APP_FRIENDLY_NAMES: Record<string, string> = {
  terminal: 'Terminal',
  'file-manager': 'File Manager',
  settings: 'Settings',
  'app-store': 'App Store',
  profile: 'Profile',
  'system-update': 'System Update',
  backup: 'Backup',
  'help-center': 'Help Center',
  'security-dashboard': 'Security Dashboard',
  'network-monitor': 'Network Monitor',
  firewall: 'Firewall',
  'log-viewer': 'Log Viewer',
  'ai-assistant': 'AI Assistant',
  calculator: 'Calculator',
  notes: 'Notes',
  'code-editor': 'Code Editor',
  browser: 'Browser',
  calendar: 'Calendar',
  todo: 'Todo',
  'cyber-learning': 'Cyber Academy',
  'pdf-viewer': 'PDF Viewer',
  'image-viewer': 'Image Viewer',
  'music-player': 'Music Player',
  'video-player': 'Video Player',
  paint: 'Paint',
};

// ── Apps the AI is allowed to open ──

export const OPENABLE_APPS = [
  'terminal',
  'file-manager',
  'settings',
  'app-store',
  'profile',
  'ai-assistant',
  'calculator',
  'notes',
  'code-editor',
  'browser',
  'calendar',
  'todo',
  'cyber-learning',
  'pdf-viewer',
  'image-viewer',
  'music-player',
  'video-player',
  'paint',
  'security-dashboard',
  'network-monitor',
  'firewall',
  'log-viewer',
  'help-center',
  'system-update',
  'backup',
] as const;