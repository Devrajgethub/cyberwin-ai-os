'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOSStore, type Notification } from '@/os/store';
import { IconByName } from './desktop-icon';
import { Bell, X, CheckCheck, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export default function NotificationCenter() {
  const { isNotificationOpen, closeNotification, notifications, markAllRead, clearNotifications } = useOSStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <AnimatePresence>
      {isNotificationOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed z-50 top-4 right-4 w-80 rounded-2xl overflow-hidden no-select"
          style={{ background: 'rgba(10, 10, 20, 0.85)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <Bell size={15} className="text-cyan-400" />
              <span className="text-sm font-medium text-white">Notifications</span>
              {unread > 0 && <span className="text-[10px] bg-cyan-500 text-black px-1.5 py-0.5 rounded-full font-bold">{unread}</span>}
            </div>
            <div className="flex items-center gap-1">
              <button onClick={markAllRead} className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors" title="Mark all read">
                <CheckCheck size={14} className="text-gray-400" />
              </button>
              <button onClick={clearNotifications} className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors" title="Clear all">
                <Trash2 size={14} className="text-gray-400" />
              </button>
              <button onClick={closeNotification} className="p-1.5 rounded-md hover:bg-white/[0.06] transition-colors">
                <X size={14} className="text-gray-400" />
              </button>
            </div>
          </div>
          <Separator className="opacity-30" />
          <ScrollArea className="max-h-80">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-gray-500 text-sm">No notifications</div>
            ) : (
              <div className="p-2 space-y-1">
                {notifications.map((n) => (
                  <div key={n.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${n.read ? 'opacity-50' : 'bg-white/[0.02]'}`}>
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <IconByName name={n.icon || 'bell'} size={14} className="text-cyan-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-200">{n.title}</span>
                        <span className="text-[10px] text-gray-500 shrink-0 ml-2">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 mt-1.5" />}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </motion.div>
      )}
    </AnimatePresence>
  );
}