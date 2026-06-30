'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AppProps } from '@/os/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Pencil,
  Eraser,
  Trash2,
  Circle,
} from 'lucide-react';

interface BrushSize {
  label: string;
  value: number;
  preview: number;
}

const brushSizes: BrushSize[] = [
  { label: 'S', value: 2, preview: 8 },
  { label: 'M', value: 6, preview: 14 },
  { label: 'L', value: 14, preview: 22 },
  { label: 'XL', value: 24, preview: 30 },
];

const presetColors = [
  '#00ffff', // cyan
  '#ff0055', // red/pink
  '#ff6600', // orange
  '#ffff00', // yellow
  '#00ff66', // green
  '#6633ff', // purple
  '#ff3399', // magenta
  '#ffffff', // white
  '#ff9999', // light red
  '#99ff99', // light green
];

const CANVAS_BG = '#1a1a2e';

export default function PaintApp({ windowId: _windowId }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00ffff');
  const [brushSize, setBrushSize] = useState(2);
  const [isEraser, setIsEraser] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Resize canvas to fill container
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const prevData = canvas.toDataURL();
      canvas.width = rect.width;
      canvas.height = rect.height;
      // Fill background
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = CANVAS_BG;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Restore previous drawing
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0);
        };
        img.src = prevData;
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const getPos = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }, []);

  const startDrawing = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      setIsDrawing(true);
      const pos = getPos(e);
      lastPos.current = pos;
      // Draw a dot
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fillStyle = isEraser ? CANVAS_BG : color;
      ctx.fill();
    },
    [getPos, brushSize, color, isEraser]
  );

  const draw = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const pos = getPos(e);
      const last = lastPos.current;
      if (!last) return;

      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = isEraser ? CANVAS_BG : color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      lastPos.current = pos;
    },
    [isDrawing, getPos, brushSize, color, isEraser]
  );

  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
    lastPos.current = null;
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = CANVAS_BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-slate-950/50 text-slate-200">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-700/50 bg-slate-900/80 shrink-0 flex-wrap">
        {/* Brush Sizes */}
        <div className="flex items-center gap-0.5">
          <Pencil className="h-3 w-3 text-slate-500 mr-1" />
          {brushSizes.map((size) => (
            <Button
              key={size.label}
              variant="ghost"
              size="icon"
              className={`h-7 w-7 text-slate-400 hover:text-slate-200 flex items-center justify-center ${
                brushSize === size.value && !isEraser ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : ''
              }`}
              onClick={() => {
                setBrushSize(size.value);
                setIsEraser(false);
              }}
              title={`${size.label} Brush (${size.value}px)`}
            >
              <div
                className="rounded-full bg-current"
                style={{ width: Math.min(size.preview, 18), height: Math.min(size.preview, 18) }}
              />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-4 bg-slate-700/50 mx-1" />

        {/* Eraser */}
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${isEraser ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          onClick={() => setIsEraser(true)}
          title="Eraser"
        >
          <Eraser className="h-3.5 w-3.5" />
        </Button>

        <Separator orientation="vertical" className="h-4 bg-slate-700/50 mx-1" />

        {/* Color Palette */}
        <div className="flex items-center gap-1">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setIsEraser(false);
              }}
              className={`w-6 h-6 rounded-full border-2 transition-all cursor-pointer ${
                color === c && !isEraser ? 'border-white shadow-[0_0_6px_rgba(255,255,255,0.3)] scale-110' : 'border-slate-600/50 hover:border-slate-400'
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>

        <div className="flex-1" />

        {/* Current tool indicator */}
        <div className="flex items-center gap-2 mr-2">
          {isEraser ? (
            <span className="text-[10px] text-amber-400">Eraser</span>
          ) : (
            <div className="flex items-center gap-1">
              <Circle className="h-3 w-3" style={{ fill: color, color }} />
              <span className="text-[10px] text-slate-500">{brushSize}px</span>
            </div>
          )}
        </div>

        {/* Clear */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
          onClick={clearCanvas}
          title="Clear Canvas"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Canvas Area */}
      <div ref={containerRef} className="flex-1 min-h-0 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-full cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={(e) => {
            e.preventDefault();
            startDrawing(e);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            draw(e);
          }}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Status bar */}
      <div className="px-3 py-1 border-t border-slate-700/50 bg-slate-900/60 flex items-center justify-between text-[10px] text-slate-500 shrink-0">
        <span>{isEraser ? 'Eraser' : 'Brush'} • {brushSize}px</span>
        <span className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: isEraser ? CANVAS_BG : color, border: isEraser ? '1px solid #555' : 'none' }} />
          {isEraser ? 'Background' : color.toUpperCase()}
        </span>
      </div>
    </div>
  );
}
