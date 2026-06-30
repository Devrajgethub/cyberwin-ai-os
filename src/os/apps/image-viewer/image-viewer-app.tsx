'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { AppProps } from '@/os/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  FolderOpen,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  FlipHorizontal2,
  FlipVertical2,
  Info,
} from 'lucide-react';

interface ImageItem {
  id: number;
  label: string;
  gradient: string;
  description: string;
  size: string;
  fileSize: string;
}

const images: ImageItem[] = [
  { id: 0, label: 'Cityscape', gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)', description: 'Night city skyline with neon lights', size: '1920×1080', fileSize: '2.4 MB' },
  { id: 1, label: 'Circuit Board', gradient: 'linear-gradient(135deg, #004d40, #00695c, #00897b)', description: 'Macro shot of green PCB traces', size: '2560×1440', fileSize: '3.1 MB' },
  { id: 2, label: 'Sunset Grid', gradient: 'linear-gradient(135deg, #e65100, #ff6d00, #ff9100)', description: 'Digital sunset over data grid', size: '1920×1080', fileSize: '1.8 MB' },
  { id: 3, label: 'Abstract Code', gradient: 'linear-gradient(135deg, #1a237e, #283593, #3949ab)', description: 'Abstract code rain visualization', size: '3840×2160', fileSize: '5.2 MB' },
  { id: 4, label: 'Cyber Face', gradient: 'linear-gradient(135deg, #880e4f, #ad1457, #c2185b)', description: 'Cyberpunk portrait overlay', size: '1920×1080', fileSize: '2.9 MB' },
];

export default function ImageViewerApp({ windowId: _windowId }: AppProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const current = images[currentIndex];

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i + 1) % images.length);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  }, []);
  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i - 1 + images.length) % images.length);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
  }, []);
  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 25, 300)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 25, 25)), []);
  const rotateCW = useCallback(() => setRotation((r) => (r + 90) % 360), []);
  const rotateCCW = useCallback(() => setRotation((r) => (r - 90 + 360) % 360), []);

  const toggleFlipH = useCallback(() => setFlipH((f) => !f), []);
  const toggleFlipV = useCallback(() => setFlipV((f) => !f), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === 'r' || e.key === 'R') rotateCW();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, zoomIn, zoomOut, rotateCW]);

  const transformStyle = {
    transform: `scale(${zoom / 100}) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950/50 text-slate-200">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-700/50 bg-slate-900/80 shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-cyan-400 hover:text-cyan-300" title="Open">
          <FolderOpen className="h-3.5 w-3.5" />
        </Button>
        <Separator orientation="vertical" className="h-4 bg-slate-700/50 mx-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={zoomOut} title="Zoom Out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <Slider
          value={[zoom]}
          onValueChange={(v) => setZoom(v[0])}
          min={25}
          max={300}
          step={5}
          className="w-20 h-7"
        />
        <span className="text-xs text-slate-400 w-10 text-center font-mono">{zoom}%</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={zoomIn} title="Zoom In">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Separator orientation="vertical" className="h-4 bg-slate-700/50 mx-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={rotateCCW} title="Rotate Left">
          <RotateCcw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={rotateCW} title="Rotate Right">
          <RotateCw className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={toggleFlipH} title="Flip Horizontal">
          <FlipHorizontal2 className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={toggleFlipV} title="Flip Vertical">
          <FlipVertical2 className="h-3.5 w-3.5" />
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${showInfo ? 'text-cyan-400' : 'text-slate-400'} hover:text-cyan-300`}
          onClick={() => setShowInfo((s) => !s)}
          title="Toggle Info"
        >
          <Info className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Main Image Area */}
      <div className="flex-1 min-h-0 relative flex items-center justify-center overflow-hidden bg-slate-950">
        {/* Checkerboard pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%)',
            backgroundSize: '20px 20px',
          }}
        />
        <div
          className="relative w-64 h-44 rounded-lg shadow-2xl shadow-cyan-500/10 border border-slate-700/30 transition-transform duration-200 ease-out"
          style={{ ...transformStyle, background: current.gradient }}
        >
          {/* Image content overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
            <div className="text-4xl mb-2">
              {['🏙', '🔧', '🌅', '💻', '🎭'][currentIndex]}
            </div>
            <p className="text-sm font-medium text-white/90">{current.label}</p>
            <p className="text-[10px] text-white/50 mt-1 text-center px-4">{current.description}</p>
          </div>
          {/* Info overlay */}
          {showInfo && (
            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
              <div className="bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-[10px] text-white/80 flex items-center gap-2">
                <span>{current.size}</span>
                <span className="text-white/40">•</span>
                <span>{current.fileSize}</span>
              </div>
              <span className="bg-black/60 backdrop-blur-sm rounded px-2 py-1 text-[10px] text-cyan-300 font-mono">
                {zoom}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="shrink-0 border-t border-slate-700/50 bg-slate-900/80 px-2 py-2">
        <div className="flex gap-2 justify-center">
          {images.map((img) => (
            <button
              key={img.id}
              onClick={() => setCurrentIndex(img.id)}
              className={`h-12 w-16 rounded border-2 transition-all shrink-0 cursor-pointer relative overflow-hidden ${
                currentIndex === img.id
                  ? 'border-cyan-400 shadow-[0_0_10px_rgba(0,255,255,0.25)] scale-105'
                  : 'border-slate-700/50 hover:border-slate-500'
              }`}
              style={{ background: img.gradient }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[8px] text-white/70 font-medium">{img.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
