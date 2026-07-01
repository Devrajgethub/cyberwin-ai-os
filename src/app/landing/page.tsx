'use client';

import React, { useRef, useSyncExternalStore } from 'react';
import Image from 'next/image';
import {
  Shield, Terminal, Bot, Lock, Eye, Monitor, Wifi, Paintbrush,
  Music, Video, FileText, Calculator, Calendar, Code, FolderOpen,
  HelpCircle, GraduationCap, Store, RefreshCw, Download,
  LayoutGrid, Search, Bell, Cpu, Zap, Database, Palette,
  ArrowRight, ExternalLink, Github, Check,
} from 'lucide-react';

/* ─── Data ─── */

const FEATURES = [
  { icon: Monitor, title: 'Full Desktop Shell', desc: 'Drag, resize, minimize, maximize — a complete windowed OS experience in the browser.' },
  { icon: Lock, title: 'Authentication System', desc: 'Login with credentials, lock screen, session persistence, and sign-out flow.' },
  { icon: Shield, title: 'Security Tools', desc: 'Firewall, network monitor, log viewer, and real-time security dashboard.' },
  { icon: Bot, title: 'AI Assistant', desc: 'Conversational AI chatbot with streaming responses integrated into the desktop.' },
  { icon: Database, title: 'Persistent Storage', desc: 'IndexedDB for files, notes, and settings. Sessions survive page reloads.' },
  { icon: Palette, title: 'Cyberpunk Theme', desc: 'Dark mode with cyan/teal neon accents, glassmorphism, and glowing UI elements.' },
  { icon: Zap, title: 'Boot Sequence', desc: 'Cinematic 3-phase boot animation with progress bar and status messages.' },
  { icon: Bell, title: 'Notification Center', desc: 'Slide-in panel with read/unread states, clear-all, and mark-all-read.' },
];

const APP_CATEGORIES = [
  {
    label: 'System',
    color: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/20',
    apps: [
      { icon: Terminal, name: 'Terminal' },
      { icon: FolderOpen, name: 'File Manager' },
      { icon: LayoutGrid, name: 'Start Menu' },
      { icon: SettingsIcon, name: 'Settings' },
      { icon: UserIcon, name: 'Profile' },
      { icon: Store, name: 'App Store' },
    ],
  },
  {
    label: 'Security',
    color: 'from-red-500/20 to-red-600/5 border-red-500/20',
    apps: [
      { icon: Shield, name: 'Security Dashboard' },
      { icon: Wifi, name: 'Network Monitor' },
      { icon: FirewallIcon, name: 'Firewall' },
      { icon: Eye, name: 'Log Viewer' },
    ],
  },
  {
    label: 'AI',
    color: 'from-purple-500/20 to-purple-600/5 border-purple-500/20',
    apps: [
      { icon: Bot, name: 'AI Assistant' },
      { icon: GraduationCap, name: 'Cyber Learning Lab' },
    ],
  },
  {
    label: 'Utility',
    color: 'from-amber-500/20 to-amber-600/5 border-amber-500/20',
    apps: [
      { icon: Calculator, name: 'Calculator' },
      { icon: FileText, name: 'Notes' },
      { icon: Code, name: 'Code Editor' },
      { icon: Calendar, name: 'Calendar' },
      { icon: CheckSquareIcon, name: 'Todo' },
      { icon: Search, name: 'Browser' },
    ],
  },
  {
    label: 'Media',
    color: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20',
    apps: [
      { icon: Music, name: 'Music Player' },
      { icon: Video, name: 'Video Player' },
      { icon: ImageIcon, name: 'Image Viewer' },
      { icon: FileIcon, name: 'PDF Viewer' },
      { icon: Paintbrush, name: 'Paint' },
    ],
  },
  {
    label: 'System Tools',
    color: 'from-sky-500/20 to-sky-600/5 border-sky-500/20',
    apps: [
      { icon: RefreshCw, name: 'System Update' },
      { icon: Download, name: 'Backup' },
      { icon: HelpCircle, name: 'Help Center' },
    ],
  },
];

const TECH_STACK = [
  { name: 'Next.js 16', desc: 'App Router' },
  { name: 'TypeScript 5', desc: 'Type Safety' },
  { name: 'Tailwind CSS 4', desc: 'Styling' },
  { name: 'shadcn/ui', desc: 'Components' },
  { name: 'Zustand', desc: 'State Management' },
  { name: 'Framer Motion', desc: 'Animations' },
  { name: 'IndexedDB', desc: 'Persistence' },
  { name: 'Lucide React', desc: 'Icons' },
];

/* ─── Inline icon aliases (avoid import conflicts with lucide) ─── */
function UserIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>; }
function SettingsIcon(props: any) { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>; }
function FirewallIcon(props: any) { return <Shield {...props} />; }
function ImageIcon(props: any) { return <Eye {...props} />; }
function FileIcon(props: any) { return <FileText {...props} />; }
function CheckSquareIcon(props: any) { return <Check {...props} />; }

/* ─── Component ─── */

export default function LandingPage() {
  const mounted = useSyncExternalStore(
    (cb) => { requestAnimationFrame(cb); return () => {}; },
    () => true,
    () => false,
  );

  return (
    <div className="min-h-screen bg-[#06060e] text-white overflow-x-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none opacity-[0.04]" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,1) 0%, transparent 70%)' }} />

      <div className="relative z-10">
        {/* ─── Hero ─── */}
        <header className="pt-12 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            {/* Logo */}
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-600/30 to-purple-600/20 border border-cyan-500/30 mb-8 shadow-[0_0_50px_rgba(6,182,212,0.12)] transition-all duration-1000 ${mounted ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
              <svg width="40" height="40" viewBox="0 0 48 48" fill="none" className="text-cyan-400">
                <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" stroke="currentColor" strokeWidth="1.5" fill="none" />
                <path d="M24 4v40M4 14l20 10 20-10" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <circle cx="24" cy="24" r="6" stroke="currentColor" strokeWidth="1.5" fill="rgba(6,182,212,0.15)" />
                <path d="M21 24h6M24 21v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>

            <h1 className={`text-5xl sm:text-7xl font-bold tracking-tight mb-4 transition-all duration-1000 delay-200 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              <span className="bg-gradient-to-r from-cyan-300 via-cyan-400 to-teal-400 bg-clip-text text-transparent">CyberWin</span>
              <span className="text-white"> AI OS</span>
            </h1>

            <p className={`text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-1000 delay-400 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              A web-based Linux/Windows-inspired cyber security desktop prototype.
              <br className="hidden sm:block" />
              26 apps. Full desktop shell. Built for learning &amp; portfolio.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-500 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
              <a href="/" className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-semibold text-sm transition-all shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.35)]">
                Launch OS
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </a>
              <a href="#" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border border-white/10 hover:border-white/20 text-gray-300 hover:text-white font-medium text-sm transition-all bg-white/[0.03] hover:bg-white/[0.06]">
                <Github size={16} />
                View GitHub
              </a>
            </div>

            {/* Hero image */}
            <div className={`mt-16 transition-all duration-1000 delay-700 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
              <div className="relative rounded-2xl overflow-hidden border border-white/[0.06] shadow-2xl shadow-black/50">
                <Image
                  src="/screenshots/hero-cover.png"
                  alt="CyberWin AI OS Desktop"
                  width={1344}
                  height={768}
                  className="w-full h-auto"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06060e] via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </header>

        {/* ─── Features ─── */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Everything you need in a <span className="text-cyan-400">browser-based OS</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                From boot to desktop, CyberWin AI OS delivers a complete operating system experience — entirely in your browser.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {FEATURES.map((f, i) => (
                <div
                  key={i}
                  className="group relative p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/20 hover:bg-white/[0.04] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3 group-hover:bg-cyan-500/15 transition-colors">
                    <f.icon size={20} className="text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1.5">{f.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Apps Showcase ─── */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                <span className="text-cyan-400">26</span> Built-in Applications
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto">
                Security tools, media players, utilities, AI — all running inside draggable, resizable windows.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {APP_CATEGORIES.map((cat) => (
                <div
                  key={cat.label}
                  className={`rounded-xl border p-5 bg-gradient-to-br ${cat.color}`}
                >
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">
                    {cat.label}
                  </h3>
                  <div className="space-y-2">
                    {cat.apps.map((app) => (
                      <div key={app.name} className="flex items-center gap-3 text-sm">
                        <app.icon size={15} className="text-gray-400 shrink-0" />
                        <span className="text-gray-300">{app.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Tech Stack ─── */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Built with <span className="text-cyan-400">modern</span> tech
              </h2>
              <p className="text-gray-500">Production-grade tooling, zero compromises.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {TECH_STACK.map((t) => (
                <div
                  key={t.name}
                  className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-cyan-500/20 transition-colors"
                >
                  <Cpu size={20} className="text-cyan-400/60" />
                  <span className="text-sm font-semibold text-white">{t.name}</span>
                  <span className="text-[10px] text-gray-500">{t.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Screenshots Placeholder ─── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                See it in <span className="text-cyan-400">action</span>
              </h2>
              <p className="text-gray-500">Screenshots coming soon. Launch the OS to experience it live.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Boot Animation', 'Login Screen', 'Desktop', 'Security Dashboard', 'AI Assistant', 'Terminal'].map((label) => (
                <div key={label} className="aspect-video rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center">
                  <div className="text-center">
                    <Monitor size={24} className="text-gray-700 mx-auto mb-2" />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section className="py-24 px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="p-10 sm:p-14 rounded-2xl bg-gradient-to-br from-cyan-600/10 to-purple-600/5 border border-cyan-500/15 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl font-bold mb-3">Ready to explore?</h2>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Launch CyberWin AI OS now. No installation, no download — just click and go.
                </p>
                <a href="/" className="group inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-base transition-all shadow-[0_0_40px_rgba(6,182,212,0.25)] hover:shadow-[0_0_60px_rgba(6,182,212,0.4)]">
                  Launch CyberWin AI OS
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="py-8 px-6 border-t border-white/[0.04]">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 48 48" fill="none" className="text-cyan-400/60">
                <path d="M24 4L4 14v20l20 10 20-10V14L24 4z" stroke="currentColor" strokeWidth="2" fill="none" />
                <path d="M21 24h6M24 21v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-xs text-gray-500">CyberWin AI OS v2.1</span>
            </div>

            <p className="text-xs text-gray-600 text-center">
              Built by <span className="text-gray-400 font-medium">Dev</span> · For learning, portfolio, and ethical cyber security demo purposes only.
            </p>

            <div className="flex items-center gap-4">
              <a href="/" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Launch</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 transition-colors flex items-center gap-1">
                GitHub <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}