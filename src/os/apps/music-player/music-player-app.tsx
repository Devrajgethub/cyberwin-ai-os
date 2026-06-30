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
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  VolumeX,
  Music,
  Disc3,
} from 'lucide-react';

interface Song {
  id: number;
  title: string;
  artist: string;
  duration: string;
  durationSec: number;
  color: string;
}

const playlist: Song[] = [
  { id: 0, title: 'Cyber Dreams', artist: 'Digital Horizon', duration: '3:42', durationSec: 222, color: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  { id: 1, title: 'Neon Streets', artist: 'Synthwave Runner', duration: '4:15', durationSec: 255, color: 'linear-gradient(135deg, #a855f7, #7c3aed)' },
  { id: 2, title: 'Binary Sunset', artist: 'Electronic Pulse', duration: '3:58', durationSec: 238, color: 'linear-gradient(135deg, #f97316, #ea580c)' },
  { id: 3, title: 'Data Stream', artist: 'Network Echo', duration: '5:01', durationSec: 301, color: 'linear-gradient(135deg, #22c55e, #16a34a)' },
  { id: 4, title: 'Firewall', artist: 'Security Beats', duration: '3:24', durationSec: 204, color: 'linear-gradient(135deg, #ef4444, #dc2626)' },
  { id: 5, title: 'Encrypted', artist: 'Dark Protocol', duration: '4:33', durationSec: 273, color: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
  { id: 6, title: 'Root Access', artist: 'Kernel Panic', duration: '3:10', durationSec: 190, color: 'linear-gradient(135deg, #eab308, #ca8a04)' },
  { id: 7, title: 'Zero Day', artist: 'Exploit', duration: '4:48', durationSec: 288, color: 'linear-gradient(135deg, #ec4899, #db2777)' },
];

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function MusicPlayerApp({ windowId: _windowId }: AppProps) {
  const [currentSongIdx, setCurrentSongIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
  const animRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Refs to access latest values in interval callback without re-creating it
  const stateRef = useRef({
    repeat: repeat as 'off' | 'all' | 'one',
    shuffle,
    currentSongIdx,
    currentSongDurationSec: playlist[0].durationSec,
  });

  useEffect(() => {
    stateRef.current = {
      repeat,
      shuffle,
      currentSongIdx,
      currentSongDurationSec: playlist[currentSongIdx].durationSec,
    };
  });

  const currentSong = playlist[currentSongIdx];

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
        const next = prev + 0.5;
        const dur = stateRef.current.currentSongDurationSec;
        if (next >= dur) {
          // Song ended — handle transition in setState callback
          if (stateRef.current.repeat === 'one') {
            return 0;
          }
          // For non-one repeats, cap progress at duration
          // The song-end handler below will detect this
          return dur;
        }
        return next;
      });

      // Check for song end to trigger next song
      setProgress((prev) => {
        const dur = stateRef.current.currentSongDurationSec;
        if (prev >= dur) {
          if (stateRef.current.repeat === 'one') {
            return 0;
          } else if (stateRef.current.shuffle) {
            let next = Math.floor(Math.random() * playlist.length);
            while (next === stateRef.current.currentSongIdx && playlist.length > 1) {
              next = Math.floor(Math.random() * playlist.length);
            }
            setCurrentSongIdx(next);
            return 0;
          } else if (stateRef.current.currentSongIdx < playlist.length - 1 || stateRef.current.repeat === 'all') {
            setCurrentSongIdx((i) => (i + 1) % playlist.length);
            return 0;
          } else {
            setIsPlaying(false);
            stopPlayback();
            return prev;
          }
        }
        return prev;
      });
    }, 500);
  }, [stopPlayback]);

  // Play/pause control
  useEffect(() => {
    if (isPlaying) {
      startPlayback();
    } else {
      stopPlayback();
    }
    return () => stopPlayback();
  }, [isPlaying, startPlayback, stopPlayback]);

  const handlePlayPause = useCallback(() => {
    if (progress >= currentSong.durationSec) {
      setProgress(0);
    }
    setIsPlaying((p) => !p);
  }, [progress, currentSong.durationSec]);

  const handlePrev = useCallback(() => {
    if (progress > 3) {
      setProgress(0);
      return;
    }
    setCurrentSongIdx((i) => (i - 1 + playlist.length) % playlist.length);
    setProgress(0);
  }, [progress]);

  const handleNext = useCallback(() => {
    if (shuffle) {
      let next = Math.floor(Math.random() * playlist.length);
      while (next === currentSongIdx && playlist.length > 1) {
        next = Math.floor(Math.random() * playlist.length);
      }
      setCurrentSongIdx(next);
    } else {
      setCurrentSongIdx((i) => (i + 1) % playlist.length);
    }
    setProgress(0);
  }, [currentSongIdx, shuffle]);

  const cycleRepeat = useCallback(() => {
    setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));
  }, []);

  return (
    <div className="h-full w-full flex bg-slate-950/50 text-slate-200">
      {/* Main Player Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Now Playing Header */}
        <div className="flex items-center gap-4 p-4 shrink-0">
          {/* Album Art Placeholder */}
          <div
            className="w-24 h-24 rounded-lg shadow-lg shadow-cyan-500/10 shrink-0 flex items-center justify-center relative"
            style={{ background: currentSong.color }}
          >
            <Music className="h-8 w-8 text-white/40" />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Disc3 className="h-10 w-10 text-white/30 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-cyan-300 truncate">{currentSong.title}</h3>
            <p className="text-sm text-slate-400 truncate">{currentSong.artist}</p>
            <p className="text-xs text-slate-500 mt-1">CyberWin Music</p>
          </div>
        </div>

        {/* Seek Bar */}
        <div className="px-4 shrink-0">
          <Slider
            value={[progress]}
            onValueChange={(v) => setProgress(v[0])}
            max={currentSong.durationSec}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
            <span>{formatTime(progress)}</span>
            <span>{currentSong.duration}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 py-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${shuffle ? 'text-cyan-400' : 'text-slate-500'} hover:text-cyan-300`}
            onClick={() => setShuffle((s) => !s)}
            title="Shuffle"
          >
            <Shuffle className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200" onClick={handlePrev} title="Previous">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-11 w-11 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300"
            onClick={handlePlayPause}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-200" onClick={handleNext} title="Next">
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${repeat !== 'off' ? 'text-cyan-400' : 'text-slate-500'} hover:text-cyan-300`}
            onClick={cycleRepeat}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
          </Button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-2 px-6 pb-3 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-slate-400 hover:text-slate-200"
            onClick={() => setIsMuted((m) => !m)}
          >
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
            className="w-full"
          />
          <span className="text-[10px] text-slate-500 w-6 text-right font-mono">{isMuted ? 0 : volume}</span>
        </div>
      </div>

      <Separator orientation="vertical" className="bg-slate-700/50" />

      {/* Playlist Sidebar */}
      <div className="w-52 shrink-0 flex flex-col bg-slate-900/40">
        <div className="px-3 py-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider border-b border-slate-700/50">
          Playlist
          <span className="ml-2 text-slate-500 font-normal normal-case">({playlist.length})</span>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-1 space-y-0.5">
            {playlist.map((song) => (
              <button
                key={song.id}
                onClick={() => {
                  setCurrentSongIdx(song.id);
                  setProgress(0);
                  setIsPlaying(true);
                }}
                className={`w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors cursor-pointer ${
                  currentSongIdx === song.id
                    ? 'bg-cyan-500/10 text-cyan-300'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-300'
                }`}
              >
                <div
                  className="w-8 h-8 rounded shrink-0 flex items-center justify-center"
                  style={{ background: song.color }}
                >
                  {currentSongIdx === song.id && isPlaying ? (
                    <div className="flex items-end gap-[2px] h-3">
                      <div className="w-[2px] bg-white/80 animate-pulse rounded" style={{ height: '60%', animationDelay: '0ms' }} />
                      <div className="w-[2px] bg-white/80 animate-pulse rounded" style={{ height: '100%', animationDelay: '150ms' }} />
                      <div className="w-[2px] bg-white/80 animate-pulse rounded" style={{ height: '40%', animationDelay: '300ms' }} />
                    </div>
                  ) : (
                    <span className="text-[9px] text-white/60 font-mono">{song.id + 1}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate">{song.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{song.artist}</p>
                </div>
                <span className="text-[10px] text-slate-600 font-mono shrink-0">{song.duration}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
