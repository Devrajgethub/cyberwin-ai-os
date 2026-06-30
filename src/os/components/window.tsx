'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Square, X, Copy } from 'lucide-react';
import { useOSStore } from '@/os/store';
import { IconByName } from './desktop-icon';
import type { WindowState } from '@/os/types';

type ResizeDirection = 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw';

interface WindowProps {
  windowState: WindowState;
  children: React.ReactNode;
}

const TASKBAR_HEIGHT = 48;

export default function Window({ windowState, children }: WindowProps) {
  const {
    id,
    appId,
    title,
    x,
    y,
    width,
    height,
    minWidth,
    minHeight,
    isMinimized,
    isMaximized,
    zIndex,
  } = windowState;

  const focusWindow = useOSStore((s) => s.focusWindow);
  const closeWindow = useOSStore((s) => s.closeWindow);
  const minimizeWindow = useOSStore((s) => s.minimizeWindow);
  const maximizeWindow = useOSStore((s) => s.maximizeWindow);
  const restoreWindow = useOSStore((s) => s.restoreWindow);
  const updateWindowPosition = useOSStore((s) => s.updateWindowPosition);
  const updateWindowSize = useOSStore((s) => s.updateWindowSize);

  const activeWindowId = useOSStore((s) => s.activeWindowId);
  const isActive = activeWindowId === id;

  // Drag state
  const dragRef = useRef<{
    startX: number;
    startY: number;
    startWinX: number;
    startWinY: number;
  } | null>(null);

  // Resize state
  const resizeRef = useRef<{
    direction: ResizeDirection;
    startX: number;
    startY: number;
    startWinX: number;
    startWinY: number;
    startWinW: number;
    startWinH: number;
  } | null>(null);

  // Pre-maximize state for restore
  const preMaxRef = useRef<{ x: number; y: number; w: number; h: number }>({
    x, y, w: width, h: height,
  });

  // --- Drag handlers ---
  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if (isMaximized) {
        // Unmaximize on drag start: position window so mouse is proportionally inside
        const rect = (e.currentTarget as HTMLElement).closest('[data-window]')?.getBoundingClientRect();
        if (rect) {
          const ratioX = (e.clientX - rect.left) / rect.width;
          const newX = e.clientX - width * ratioX;
          const newY = 0;
          preMaxRef.current = { x: newX, y: newY, w: width, h: height };
          restoreWindow(id);
          updateWindowPosition(id, Math.max(0, newX), newY);
        }
        // Set up drag for after unmaximize
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          startWinX: Math.max(0, e.clientX - width * 0.5),
          startWinY: 0,
        };
      } else {
        dragRef.current = {
          startX: e.clientX,
          startY: e.clientY,
          startWinX: x,
          startWinY: y,
        };
      }
      document.body.style.userSelect = 'none';
      focusWindow(id);
      e.preventDefault();
    },
    [id, x, y, width, height, isMaximized, focusWindow, restoreWindow, updateWindowPosition]
  );

  // --- Resize handlers ---
  const handleResizeStart = useCallback(
    (direction: ResizeDirection) => (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      document.body.style.userSelect = 'none';
      resizeRef.current = {
        direction,
        startX: e.clientX,
        startY: e.clientY,
        startWinX: x,
        startWinY: y,
        startWinW: width,
        startWinH: height,
      };
      focusWindow(id);
    },
    [id, x, y, width, height, focusWindow]
  );

  // Global mouse move/up for drag and resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        const newX = Math.max(0, dragRef.current.startWinX + dx);
        const newY = Math.max(0, dragRef.current.startWinY + dy);
        updateWindowPosition(id, newX, newY);
      }
      if (resizeRef.current) {
        const { direction, startX, startY, startWinX, startWinY, startWinW, startWinH } =
          resizeRef.current;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        let newX = startWinX;
        let newY = startWinY;
        let newW = startWinW;
        let newH = startWinH;

        if (direction.includes('e')) newW = Math.max(minWidth, startWinW + dx);
        if (direction.includes('w')) {
          newW = Math.max(minWidth, startWinW - dx);
          if (newW > minWidth) newX = startWinX + dx;
        }
        if (direction.includes('s')) newH = Math.max(minHeight, startWinH + dy);
        if (direction.includes('n')) {
          newH = Math.max(minHeight, startWinH - dy);
          if (newH > minHeight) newY = Math.max(0, startWinY + dy);
        }

        updateWindowPosition(id, newX, newY);
        updateWindowSize(id, newW, newH);
      }
    };

    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [id, minWidth, minHeight, updateWindowPosition, updateWindowSize]);

  // Title bar double-click toggle maximize
  const handleTitleBarDoubleClick = () => {
    if (isMaximized) {
      restoreWindow(id);
      updateWindowPosition(id, preMaxRef.current.x, preMaxRef.current.y);
      updateWindowSize(id, preMaxRef.current.w, preMaxRef.current.h);
    } else {
      preMaxRef.current = { x, y, w: width, h: height };
      maximizeWindow(id);
    }
  };

  const handleMinimize = () => minimizeWindow(id);
  const handleClose = () => closeWindow(id);
  const handleMaximizeToggle = () => {
    if (isMaximized) {
      restoreWindow(id);
      updateWindowPosition(id, preMaxRef.current.x, preMaxRef.current.y);
      updateWindowSize(id, preMaxRef.current.w, preMaxRef.current.h);
    } else {
      preMaxRef.current = { x, y, w: width, h: height };
      maximizeWindow(id);
    }
  };

  const handleWindowClick = () => {
    focusWindow(id);
  };

  if (isMinimized) return null;

  const windowStyle: React.CSSProperties = isMaximized
    ? {
        top: 0,
        left: 0,
        width: '100vw',
        height: `calc(100vh - ${TASKBAR_HEIGHT}px)`,
        borderRadius: 0,
      }
    : {
        top: y,
        left: x,
        width,
        height,
      };

  const resizeHandles: { dir: ResizeDirection; className: string }[] = [
    { dir: 'n', className: 'top-0 left-2 right-2 h-1.5 cursor-n-resize' },
    { dir: 'ne', className: 'top-0 right-0 w-3 h-3 cursor-ne-resize' },
    { dir: 'e', className: 'top-2 right-0 bottom-2 w-1.5 cursor-e-resize' },
    { dir: 'se', className: 'bottom-0 right-0 w-3 h-3 cursor-se-resize' },
    { dir: 's', className: 'bottom-0 left-2 right-2 h-1.5 cursor-s-resize' },
    { dir: 'sw', className: 'bottom-0 left-0 w-3 h-3 cursor-sw-resize' },
    { dir: 'w', className: 'top-2 left-0 bottom-2 w-1.5 cursor-w-resize' },
    { dir: 'nw', className: 'top-0 left-0 w-3 h-3 cursor-nw-resize' },
  ];

  return (
    <AnimatePresence>
      <motion.div
        data-window
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={`absolute flex flex-col no-select overflow-hidden
          ${isMaximized ? '' : 'rounded-xl'}
          ${isActive
            ? 'shadow-[0_0_30px_rgba(6,182,212,0.08),0_8px_32px_rgba(0,0,0,0.5)]'
            : 'shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
          }
          glass`}
        style={{
          ...windowStyle,
          zIndex,
          transition: isMaximized ? 'top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease, border-radius 0.2s ease' : undefined,
        }}
        onClick={handleWindowClick}
      >
        {/* Title bar */}
        <div
          className="flex items-center h-9 px-3 gap-2 shrink-0
            bg-white/[0.03] border-b border-white/[0.06]
            cursor-default"
          onMouseDown={handleDragStart}
          onDoubleClick={handleTitleBarDoubleClick}
        >
          <IconByName name={appId} size={14} className="text-cyan-400/80 shrink-0" strokeWidth={1.5} />
          <span className="text-xs font-medium text-gray-300 truncate flex-1">
            {title}
          </span>
          <div className="flex items-center gap-0.5">
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md
                hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleMinimize();
              }}
            >
              <Minus size={14} className="text-gray-400" />
            </button>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md
                hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                handleMaximizeToggle();
              }}
            >
              {isMaximized ? (
                <Copy size={12} className="text-gray-400" />
              ) : (
                <Square size={11} className="text-gray-400" />
              )}
            </button>
            <button
              className="w-7 h-7 flex items-center justify-center rounded-md
                hover:bg-red-500/80 transition-colors group"
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
            >
              <X size={14} className="text-gray-400 group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-hidden bg-black/40">
          {children}
        </div>

        {/* Resize handles (hidden when maximized) */}
        {!isMaximized &&
          resizeHandles.map(({ dir, className }) => (
            <div
              key={dir}
              className={`absolute z-10 ${className}`}
              onMouseDown={handleResizeStart(dir)}
            />
          ))}
      </motion.div>
    </AnimatePresence>
  );
}