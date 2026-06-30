import type { AppProps } from '@/os/types';

export interface AppMeta {
  id: string;
  title: string;
  icon: string;
  category: 'system' | 'utility' | 'security' | 'ai';
  description: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
}

export const appRegistry: AppMeta[] = [
  { id: 'terminal', title: 'Terminal', icon: 'terminal', category: 'system', description: 'Command line interface', defaultWidth: 750, defaultHeight: 480, minWidth: 400, minHeight: 250 },
  { id: 'file-manager', title: 'File Manager', icon: 'folder', category: 'system', description: 'Browse and manage files', defaultWidth: 800, defaultHeight: 520, minWidth: 500, minHeight: 300 },
  { id: 'settings', title: 'Settings', icon: 'settings', category: 'system', description: 'System configuration', defaultWidth: 750, defaultHeight: 500, minWidth: 500, minHeight: 350 },
  { id: 'calculator', title: 'Calculator', icon: 'calculator', category: 'utility', description: 'Mathematical calculations', defaultWidth: 320, defaultHeight: 460, minWidth: 280, minHeight: 400 },
  { id: 'notes', title: 'Notes', icon: 'notepad', category: 'utility', description: 'Quick notes and text', defaultWidth: 700, defaultHeight: 480, minWidth: 400, minHeight: 300 },
  { id: 'code-editor', title: 'Code Editor', icon: 'code', category: 'utility', description: 'Write and edit code', defaultWidth: 850, defaultHeight: 560, minWidth: 500, minHeight: 350 },
  { id: 'security-dashboard', title: 'Security Dashboard', icon: 'shield', category: 'security', description: 'Security overview', defaultWidth: 850, defaultHeight: 580, minWidth: 600, minHeight: 400 },
  { id: 'network-monitor', title: 'Network Monitor', icon: 'network', category: 'security', description: 'Network traffic analysis', defaultWidth: 800, defaultHeight: 540, minWidth: 600, minHeight: 400 },
  { id: 'firewall', title: 'Firewall', icon: 'firewall', category: 'security', description: 'Firewall rules', defaultWidth: 820, defaultHeight: 500, minWidth: 600, minHeight: 350 },
  { id: 'log-viewer', title: 'Log Viewer', icon: 'scroll-text', category: 'security', description: 'System logs', defaultWidth: 780, defaultHeight: 500, minWidth: 500, minHeight: 300 },
  { id: 'ai-assistant', title: 'AI Assistant', icon: 'bot', category: 'ai', description: 'AI-powered assistant', defaultWidth: 420, defaultHeight: 560, minWidth: 320, minHeight: 400 },
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
};