'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { AppProps } from '@/os/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Play,
  Pause,
  Square,
  Volume2,
  VolumeX,
  Maximize,
  Film,
  MonitorPlay,
  Clapperboard,
  Tv,
  Video,
} from 'lucide-react';

interface VideoItem {
  id: number;
  title: string;
  duration: string;
  durationSec: number;
  resolution: string;
  codec: string;
  gradient: string;
  icon: React.ReactNode;
}

const videoList: VideoItem[] = [
  { id: 0, title: 'Cyber Security 101', duration: '12:34', durationSec: 754, resolution: '1920×1080', codec: 'H.264', gradient: 'linear-gradient(135deg, #0f172a, #1e293b)', icon: <Clapperboard className="h-6 w-6" /> },
  { id: 1, title: 'Network Analysis Demo', duration: '8:22', durationSec: 502, resolution: '1920×1080', codec: 'H.264', gradient: 'linear-gradient(135deg, #1e1b4b, #312e81)', icon: <MonitorPlay className="h-6 w-6" /> },
  { id: 2, title: 'Penetration Testing Walkthrough', duration: '15:47', durationSec: 947, resolution: '2560×1440', codec: 'H.265', gradient: 'linear-gradient(135deg, #14532d, #166534)', icon: <Film className="h-6 w-6" /> },
  { id: 3, title: 'AI Threat Detection', duration: '6:15', durationSec: 375, resolution: '1920×1080', codec: 'H.264', gradient: 'linear-gradient(135deg, #7f1d1d, #991b1b)', icon: <Tv className="h-6 w-6" /> },
  { id: 4, title: 'Forensics Deep Dive', duration: '22:03', durationSec: 1323, resolution: '3840×2160', codec: 'H.265', gradient: 'linear-gradient(135deg, #134e4a, #115e59)', icon: <Video className="h-6 w-6" /> },
];

function formatTime(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = Math.floor(sec % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoPlayerApp({ windowId: _windowId }: AppProps) {
  const [currentVideoIdx, setCurrentVideoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const currentVideo = videoList[currentVideoIdx];
  const stateRef = useRef({ durationSec: videoList[0].durationSec });

  useEffect(() => {
    stateRef.current = { durationSec: videoList[currentVideoIdx].durationSec };
  });

  const stopPlayback = useCallback(() => {
    if (animRef.current) {
      clearInterval(animRef.current);
      animRef.current = null;
    }
  }, []);

  const startPlayback = useCallback(() => {
    stopPlayback();
    animRef.current = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 1;
        if (next >= stateRef.current.durationSec) {
          setIsPlaying(false);
          stopPlayback();
          return stateRef.current.durationSec;
        }
        return next;
      });
    }, 1000);
  }, [stopPlayback]);

  useEffect(() => {
    if (isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
    return () => stopPlayback();
  }, [isPlaying, startPlayback, stopPlayback]);

  const handlePlayPause = useCallback(() => {
    if (progress >= currentVideo.durationSec) {
      setProgress(0);
    }
    setIsPlaying((p) => !p);
  }, [progress, currentVideo.durationSec]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const handleVideoClick = useCallback((idx: number) => {
    setCurrentVideoIdx(idx);
    setProgress(0);
    setIsPlaying(true);
  }, []);

  return (
    <div className="h-full w-full flex flex-col bg-slate-950/50 text-slate-200">
      {/* Video Display Area */}
      <div className="relative flex-1 min-h-0 bg-black flex items-center justify-center overflow-hidden">
        {/* Simulated video content */}
        <div
          className="absolute inset-0"
          style={{ background: currentVideo.gradient }}
        >
          {/* Scanlines effect */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
            }}
          />
          {/* Play button overlay when paused */}
          {!isPlaying && progress === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={handlePlayPause}
                className="w-16 h-16 rounded-full bg-cyan-500/20 border-2 border-cyan-500/50 flex items-center justify-center hover:bg-cyan-500/30 transition-colors cursor-pointer"
              >
                <Play className="h-7 w-7 text-cyan-400 ml-1" />
              </button>
            </div>
          )}
          {/* Playing indicator */}
          {isPlaying && (
            <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] text-white/80 font-medium">REC</span>
            </div>
          )}
          {/* Video title */}
          <div className="absolute bottom-3 left-3">
            <h3 className="text-sm font-semibold text-white/90">{currentVideo.title}</h3>
          </div>
          {/* Info overlay */}
          {showInfo && (
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm rounded px-2 py-1.5 text-[10px] text-white/70 space-y-0.5">
              <div>{currentVideo.resolution} • {currentVideo.codec}</div>
              <div className="text-white/50">FPS: 60 • Bitrate: 8.5 Mbps</div>
            </div>
          )}
        </div>
      </div>

      {/* Seek Bar */}
      <div className="px-3 pt-1 pb-0.5 shrink-0 bg-slate-900/80">
        <Slider
          value={[progress]}
          onValueChange={(v) => setProgress(v[0])}
          max={currentVideo.durationSec}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-0.5 font-mono">
          <span>{formatTime(progress)}</span>
          <span>{currentVideo.duration}</span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 bg-slate-900/80 border-t border-slate-700/30 shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-cyan-300" onClick={handlePlayPause} title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-cyan-300" onClick={handleStop} title="Stop">
          <Square className="h-3 w-3" />
        </Button>
        <Separator orientation="vertical" className="h-4 bg-slate-700/50 mx-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={() => setIsMuted((m) => !m)}>
          {isMuted || volume === 0 ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        </Button>
        <Slider
          value={[isMuted ? 0 : volume]}
          onValueChange={(v) => {
            setVolume(v[0]);
            if (v[0] > 0) setIsMuted(false);
          }}
          min={0}
          max={100}
          step={1}
          className="w-16"
        />
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-300" onClick={() => setShowInfo((s) => !s)} title="Toggle Info">
          <Maximize className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Video List */}
      <div className="h-28 shrink-0 border-t border-slate-700/50 bg-slate-900/60">
        <ScrollArea className="h-full">
          <div className="flex gap-2 p-2">
            {videoList.map((video) => (
              <button
                key={video.id}
                onClick={() => handleVideoClick(video.id)}
                className={`w-28 shrink-0 rounded-md border overflow-hidden transition-all cursor-pointer text-left ${
                  currentVideoIdx === video.id
                    ? 'border-cyan-500/50 shadow-[0_0_8px_rgba(0,255,255,0.15)]'
                    : 'border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <div
                  className="h-16 flex items-center justify-center"
                  style={{ background: video.gradient }}
                >
                  <div className="text-white/40">{video.icon}</div>
                  <span className="absolute bottom-1 right-1 bg-black/70 text-[9px] text-white/80 px-1 rounded font-mono">
                    {video.duration}
                  </span>
                </div>
                <div className="px-1.5 py-1 bg-slate-800/80">
                  <p className="text-[10px] text-slate-300 truncate">{video.title}</p>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
