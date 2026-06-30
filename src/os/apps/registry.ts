import type { AppProps } from '@/os/types';

export interface AppMeta {
  id: string;
  title: string;
  icon: string;
  category: 'system' | 'utility' | 'security' | 'ai' | 'media';
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
}

export const appRegistry: AppMeta[] = [
  // ─── System ───
  { id: 'terminal', title: 'Terminal', icon: 'terminal', category: 'system', description: 'Command line interface', defaultWidth: 750, defaultHeight: 480, minWidth: 400, minHeight: 250 },
  { id: 'file-manager', title: 'File Manager', icon: 'folder', category: 'system', description: 'Browse and manage files', defaultWidth: 800, defaultHeight: 520, minWidth: 500, minHeight: 300 },
  { id: 'settings', title: 'Settings', icon: 'settings', category: 'system', description: 'System configuration', defaultWidth: 750, defaultHeight: 500, minWidth: 500, minHeight: 350 },
  { id: 'app-store', title: 'App Store', icon: 'store', category: 'system', description: 'Browse and install apps', defaultWidth: 800, defaultHeight: 560, minWidth: 500, minHeight: 350 },
  { id: 'profile', title: 'Profile', icon: 'profile', category: 'system', description: 'User profile', defaultWidth: 500, defaultHeight: 600, minWidth: 380, minHeight: 400 },
  { id: 'system-update', title: 'System Update', icon: 'update', category: 'system', description: 'Check for OS updates', defaultWidth: 600, defaultHeight: 500, minWidth: 400, minHeight: 350 },
  { id: 'backup', title: 'Backup', icon: 'backup', category: 'system', description: 'Backup and restore data', defaultWidth: 650, defaultHeight: 500, minWidth: 450, minHeight: 350 },
  { id: 'help-center', title: 'Help Center', icon: 'help', category: 'system', description: 'Documentation and support', defaultWidth: 700, defaultHeight: 520, minWidth: 450, minHeight: 350 },

  // ─── Security ───
  { id: 'security-dashboard', title: 'Security Dashboard', icon: 'shield', category: 'security', description: 'Security overview', defaultWidth: 850, defaultHeight: 580, minWidth: 600, minHeight: 400 },
  { id: 'network-monitor', title: 'Network Monitor', icon: 'network', category: 'security', description: 'Network traffic analysis', defaultWidth: 800, defaultHeight: 540, minWidth: 600, minHeight: 400 },
  { id: 'firewall', title: 'Firewall', icon: 'firewall', category: 'security', description: 'Firewall rules', defaultWidth: 820, defaultHeight: 500, minWidth: 600, minHeight: 350 },
  { id: 'log-viewer', title: 'Log Viewer', icon: 'scroll-text', category: 'security', description: 'System logs', defaultWidth: 780, defaultHeight: 500, minWidth: 500, minHeight: 300 },

  // ─── AI ───
  { id: 'ai-assistant', title: 'AI Assistant', icon: 'bot', category: 'ai', description: 'AI-powered assistant', defaultWidth: 420, defaultHeight: 560, minWidth: 320, minHeight: 400 },

  // ─── Utilities ───
  { id: 'calculator', title: 'Calculator', icon: 'calculator', category: 'utility', description: 'Mathematical calculations', defaultWidth: 320, defaultHeight: 460, minWidth: 280, minHeight: 400 },
  { id: 'notes', title: 'Notes', icon: 'notepad', category: 'utility', description: 'Quick notes and text', defaultWidth: 700, defaultHeight: 480, minWidth: 400, minHeight: 300 },
  { id: 'code-editor', title: 'Code Editor', icon: 'code', category: 'utility', description: 'Write and edit code', defaultWidth: 850, defaultHeight: 560, minWidth: 500, minHeight: 350 },
  { id: 'browser', title: 'Browser', icon: 'browser', category: 'utility', description: 'Web browser', defaultWidth: 900, defaultHeight: 600, minWidth: 500, minHeight: 350 },
  { id: 'calendar', title: 'Calendar', icon: 'calendar', category: 'utility', description: 'Schedule and events', defaultWidth: 800, defaultHeight: 520, minWidth: 500, minHeight: 350 },
  { id: 'todo', title: 'Todo', icon: 'todo', category: 'utility', description: 'Task manager', defaultWidth: 650, defaultHeight: 500, minWidth: 400, minHeight: 300 },
  { id: 'cyber-learning', title: 'Cyber Academy', icon: 'learning', category: 'utility', description: 'Cybersecurity courses', defaultWidth: 800, defaultHeight: 560, minWidth: 550, minHeight: 400 },

  // ─── Media ───
  { id: 'pdf-viewer', title: 'PDF Viewer', icon: 'notepad', category: 'media', description: 'View PDF documents', defaultWidth: 800, defaultHeight: 560, minWidth: 500, minHeight: 350 },
  { id: 'image-viewer', title: 'Image Viewer', icon: 'image', category: 'media', description: 'View and edit images', defaultWidth: 750, defaultHeight: 550, minWidth: 450, minHeight: 350 },
  { id: 'music-player', title: 'Music Player', icon: 'music', category: 'media', description: 'Listen to music', defaultWidth: 700, defaultHeight: 480, minWidth: 500, minHeight: 350 },
  { id: 'video-player', title: 'Video Player', icon: 'video', category: 'media', description: 'Watch videos', defaultWidth: 850, defaultHeight: 540, minWidth: 600, minHeight: 400 },
  { id: 'paint', title: 'Paint', icon: 'paint', category: 'media', description: 'Draw and create art', defaultWidth: 800, defaultHeight: 560, minWidth: 500, minHeight: 350 },
];

export const appMetaMap = new Map<string, AppMeta>(appRegistry.map((a) => [a.id, a]));

export function getAppMeta(appId: string): AppMeta | undefined {
  return appMetaMap.get(appId);
}

export const categoryLabels: Record<string, string> = {
  system: 'System',
  utility: 'Utilities',
  security: 'Security',
  ai: 'AI',
  media: 'Media',
};