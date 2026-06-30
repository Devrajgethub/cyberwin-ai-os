export interface AppDefinition {
  id: string;
  title: string;
  icon: string; // lucide icon name
  component: React.ComponentType<AppProps>;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
  category?: 'utility' | 'security' | 'system' | 'ai';
  description?: string;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

export interface AppProps {
  windowId: string;
}

export interface DesktopIconData {
  appId: string;
  label: string;
  icon: string;
  x: number;
  y: number;
}

export type Theme = 'dark' | 'light';