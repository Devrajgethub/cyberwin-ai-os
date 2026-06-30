'use client';

import React, { useMemo } from 'react';
import { useOSStore } from '@/os/store';
import { getAppMeta } from '@/os/apps/registry';
import {
  Terminal, FolderOpen, Bot, Settings, Shield, Wifi, Flame, ScrollText, FileText, Code,
  Calculator, Search, Power, User, Sun, Moon, Cpu, Activity, Lock,
  Store, FileDown, Image, Music, Video, Paintbrush, ListTodo, CalendarDays,
  Globe, Download, Database, UserCircle, HelpCircle, GraduationCap, Bell,
  RefreshCw, FolderPlus, FilePlus, Pencil, Trash2, MonitorPlay, BookOpen,
  ShieldCheck, type LucideProps,
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  terminal: Terminal, folder: FolderOpen, bot: Bot, settings: Settings, shield: Shield,
  network: Wifi, firewall: Flame, 'scroll-text': ScrollText, notepad: FileText,
  code: Code, calculator: Calculator, search: Search, power: Power, user: User,
  sun: Sun, moon: Moon, cpu: Cpu, activity: Activity, lock: Lock,
  store: Store, pdf: FileDown, image: Image, music: Music, video: Video,
  paint: Paintbrush, todo: ListTodo, calendar: CalendarDays, browser: Globe,
  update: Download, backup: Database, profile: UserCircle, help: HelpCircle,
  learning: GraduationCap, bell: Bell, 'refresh-cw': RefreshCw,
  'folder-plus': FolderPlus, 'file-plus': FilePlus, pencil: Pencil,
  trash: Trash2, 'play-circle': MonitorPlay, book: BookOpen,
  'shield-check': ShieldCheck,
};

/** Render a lucide icon by its string name. Use this instead of getIcon() in JSX. */
export function IconByName({ name, ...props }: { name: string } & LucideProps) {
  const Component = useMemo(() => iconMap[name] ?? Terminal, [name]);
  return <Component {...props} />;
}

export function getIcon(name: string): React.ComponentType<LucideProps> {
  return iconMap[name] ?? Terminal;
}

interface DesktopIconProps {
  appId: string;
  label: string;
  icon: string;
}

export default function DesktopIcon({ appId, label, icon }: DesktopIconProps) {
  const [selected, setSelected] = React.useState(false);
  const openWindow = useOSStore((s) => s.openWindow);

  const handleDoubleClick = () => {
    const meta = getAppMeta(appId);
    openWindow(appId, label, meta?.defaultWidth ?? 700, meta?.defaultHeight ?? 500, meta?.minWidth ?? 300, meta?.minHeight ?? 200);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected(true);
  };

  return (
    <button
      className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-lg w-20 h-20
        cursor-pointer transition-all duration-150 no-select group
        hover:bg-white/10 focus:outline-none"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onBlur={() => setSelected(false)}
    >
      <div
        className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-150
          ${selected
            ? 'bg-cyan-500/20 ring-1 ring-cyan-500/40'
            : 'group-hover:bg-white/5'
          }`}
      >
        <IconByName
          name={icon}
          size={24}
          className={
            selected
              ? 'text-cyan-400 drop-shadow-[0_0_6px_rgba(6,182,212,0.5)]'
              : 'text-cyan-300/80 group-hover:text-cyan-300'
          }
          strokeWidth={1.5}
        />
      </div>
      <span
        className="text-[11px] leading-tight text-center w-full truncate
          text-gray-300 dark:text-gray-300 group-hover:text-white
          drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        title={label}
      >
        {label}
      </span>
    </button>
  );
}