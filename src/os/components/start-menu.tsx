'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore } from '@/os/store';
import { appRegistry, categoryLabels, getAppMeta } from '@/os/apps/registry';
import { IconByName } from './desktop-icon';
import { Power, Search } from 'lucide-react';

const pinnedAppIds = ['terminal', 'file-manager', 'ai-assistant', 'security-dashboard', 'browser', 'code-editor', 'app-store', 'settings'];

export default function StartMenu() {
  const isStartMenuOpen = useOSStore((s) => s.isStartMenuOpen);
  const closeStartMenu = useOSStore((s) => s.closeStartMenu);
  const openWindow = useOSStore((s) => s.openWindow);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAppClick = (appId: string, title: string) => {
    const meta = getAppMeta(appId);
    openWindow(appId, title, meta?.defaultWidth ?? 700, meta?.defaultHeight ?? 500, meta?.minWidth ?? 300, meta?.minHeight ?? 200);
    closeStartMenu();
    setSearchQuery('');
  };

  const filteredApps = searchQuery
    ? appRegistry.filter(
        (app) =>
          app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : appRegistry;

  const groupedApps = filteredApps.reduce<Record<string, typeof appRegistry>>((acc, app) => {
    const cat = app.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(app);
    return acc;
  }, {});

  const pinnedApps = pinnedAppIds.map((id) => appRegistry.find((a) => a.id === id)).filter(Boolean) as typeof appRegistry;

  return (
    <AnimatePresence>
      {isStartMenuOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="fixed z-40 bottom-14 left-1/2 -translate-x-1/2 w-[min(500px,calc(100vw-2rem))]
            rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(10, 10, 20, 0.8)',
            backdropFilter: 'blur(40px)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 1px rgba(6,182,212,0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Search bar */}
          <div className="p-4 pb-2">
            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg
                bg-white/[0.05] border border-white/[0.06]
                focus-within:border-cyan-500/30 transition-colors"
            >
              <Search size={15} className="text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Search apps..."
                className="flex-1 bg-transparent text-sm text-gray-200 placeholder:text-gray-500
                  outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-4 pb-3 max-h-[calc(70vh-120px)] overflow-y-auto">
            {/* Pinned section (only when not searching) */}
            {!searchQuery && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                  Pinned
                </h3>
                <div className="grid grid-cols-4 gap-1">
                  {pinnedApps.map((app) => (
                    <button
                      key={app.id}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-lg
                        hover:bg-white/[0.06] transition-colors"
                      onClick={() => handleAppClick(app.id, app.title)}
                    >
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <IconByName
                          name={app.icon}
                          size={20}
                          className="text-cyan-400"
                          strokeWidth={1.5}
                        />
                      </div>
                      <span className="text-[11px] text-gray-300 truncate w-full text-center">
                        {app.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* All Apps / Search Results */}
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-1">
                {searchQuery ? 'Search Results' : 'All Apps'}
              </h3>
              {Object.entries(groupedApps).map(([category, apps]) => (
                <div key={category} className="mb-3">
                  {!searchQuery && (
                    <span className="text-[10px] text-gray-600 uppercase tracking-wider px-1 mb-1 block">
                      {categoryLabels[category] ?? category}
                    </span>
                  )}
                  {apps.map((app) => (
                    <button
                      key={app.id}
                      className="flex items-center gap-3 w-full px-2.5 py-2 rounded-lg
                        hover:bg-white/[0.06] transition-colors"
                      onClick={() => handleAppClick(app.id, app.title)}
                    >
                      <div className="w-8 h-8 rounded-md bg-cyan-500/10 flex items-center justify-center shrink-0">
                        <IconByName
                          name={app.icon}
                          size={16}
                          className="text-cyan-400/90"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="text-left min-w-0">
                        <div className="text-sm text-gray-200 truncate">{app.title}</div>
                        <div className="text-[11px] text-gray-500 truncate">{app.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
              {filteredApps.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No apps found
                </div>
              )}
            </div>
          </div>

          {/* Bottom bar with power */}
          <div
            className="flex items-center justify-between px-4 py-2.5
              border-t border-white/[0.05]"
          >
            <span className="text-[11px] text-gray-600">CyberWin AI OS</span>
            <button
              className="flex items-center justify-center w-8 h-8 rounded-lg
                hover:bg-white/[0.06] transition-colors"
              onClick={closeStartMenu}
            >
              <Power size={15} className="text-gray-500" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}