'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AppProps } from '@/os/types';

interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  color: string;
  description?: string;
  location?: string;
}

const EVENT_COLORS = [
  { label: 'Cyan', value: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { label: 'Green', value: 'bg-green-500/20 text-green-300 border-green-500/30' },
  { label: 'Orange', value: 'bg-orange-500/20 text-orange-300 border-orange-500/30' },
  { label: 'Red', value: 'bg-red-500/20 text-red-300 border-red-500/30' },
  { label: 'Purple', value: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
];

const now = new Date();
const Y = now.getFullYear();
const M = String(now.getMonth() + 1).padStart(2, '0');
const D = String(now.getDate()).padStart(2, '0');
const today = `${Y}-${M}-${D}`;

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Security Audit', date: today, time: '09:00', color: EVENT_COLORS[0].value, description: 'Quarterly security audit review', location: 'Conference Room A' },
  { id: '2', title: 'Team Standup', date: today, time: '10:30', color: EVENT_COLORS[1].value, description: 'Daily team sync meeting' },
  { id: '3', title: 'Network Scan', date: getDayOffset(2), time: '14:00', color: EVENT_COLORS[2].value, description: 'Full network vulnerability scan', location: 'Server Room' },
  { id: '4', title: 'Patch Deployment', date: getDayOffset(-1), time: '22:00', color: EVENT_COLORS[3].value, description: 'Deploy critical security patches' },
  { id: '5', title: 'Incident Review', date: getDayOffset(3), time: '11:00', color: EVENT_COLORS[4].value, description: 'Review last week\'s security incident', location: 'Virtual' },
  { id: '6', title: 'Firewall Update', date: getDayOffset(5), time: '08:00', color: EVENT_COLORS[0].value, description: 'Update firewall rules and policies' },
];

function getDayOffset(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarApp({ windowId: _windowId }: AppProps) {
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(today);
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00');
  const [newColorIdx, setNewColorIdx] = useState(0);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(today);
  };

  const getEventsForDate = (dateStr: string) => events.filter((e) => e.date === dateStr);
  const selectedEvents = getEventsForDate(selectedDate);

  const addEvent = () => {
    if (!newTitle.trim()) return;
    const id = Date.now().toString();
    const ev: CalendarEvent = {
      id,
      title: newTitle.trim(),
      date: selectedDate,
      time: newTime,
      color: EVENT_COLORS[newColorIdx].value,
    };
    setEvents((prev) => [...prev, ev]);
    setNewTitle('');
    setNewTime('09:00');
    setNewColorIdx(0);
    setDialogOpen(false);
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);
  while (calendarDays.length % 7 !== 0) calendarDays.push(null);

  const selectedDateObj = new Date(selectedDate + 'T00:00:00');
  const selectedDayLabel = selectedDateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="h-full w-full flex bg-black/20">
      {/* Left: Calendar grid */}
      <div className="flex-1 flex flex-col border-r border-white/[0.06] min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
              <ChevronLeft size={16} className="text-gray-400" />
            </Button>
            <span className="text-sm font-semibold text-gray-200 min-w-[140px] text-center">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </span>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
              <ChevronRight size={16} className="text-gray-400" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10" onClick={goToday}>
            Today
          </Button>
        </div>

        <Separator className="opacity-50" />

        {/* Day headers */}
        <div className="grid grid-cols-7 px-2 pt-1">
          {DAY_NAMES.map((d) => (
            <div key={d} className="text-center text-[10px] text-gray-500 font-medium py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 px-2 pb-2 flex-1">
          {calendarDays.map((day, i) => {
            if (day === null) {
              return <div key={`empty-${i}`} className="aspect-square" />;
            }
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedDate;
            const dayEvents = getEventsForDate(dateStr);

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-colors relative ${
                  isSelected
                    ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300'
                    : isToday
                      ? 'text-cyan-400 font-semibold hover:bg-white/[0.04]'
                      : 'text-gray-300 hover:bg-white/[0.04]'
                }`}
              >
                <span>{day}</span>
                {dayEvents.length > 0 && (
                  <div className="flex gap-0.5 mt-0.5">
                    {dayEvents.slice(0, 3).map((ev, ei) => (
                      <div
                        key={ev.id}
                        className={`w-1.5 h-1.5 rounded-full ${
                          ev.color.includes('cyan') ? 'bg-cyan-400' :
                          ev.color.includes('green') ? 'bg-green-400' :
                          ev.color.includes('orange') ? 'bg-orange-400' :
                          ev.color.includes('red') ? 'bg-red-400' :
                          'bg-purple-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Events panel */}
      <div className="w-64 shrink-0 flex flex-col">
        <div className="px-3 py-2 flex items-center justify-between">
          <div className="text-xs font-medium text-gray-300 truncate">{selectedDayLabel}</div>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setDialogOpen(true)}>
            <Plus size={14} className="text-cyan-400" />
          </Button>
        </div>
        <Separator className="opacity-50" />
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {selectedEvents.length === 0 ? (
              <div className="text-center text-xs text-gray-600 py-8">
                No events scheduled
              </div>
            ) : (
              selectedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`group rounded-lg border p-2.5 cursor-default ${ev.color}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate">{ev.title}</div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] opacity-70">
                        <Clock size={10} />
                        {ev.time}
                        {ev.location && (
                          <>
                            <MapPin size={10} className="ml-1" />
                            {ev.location}
                          </>
                        )}
                      </div>
                      {ev.description && (
                        <div className="text-[10px] opacity-60 mt-1 truncate">{ev.description}</div>
                      )}
                    </div>
                    <button
                      onClick={() => deleteEvent(ev.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400/80 hover:text-red-300"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Add event dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-gray-900 border-white/[0.08] text-gray-200 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-sm">Add Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Title</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Event title..."
                className="h-8 text-xs bg-white/[0.04] border-white/[0.08]"
                onKeyDown={(e) => e.key === 'Enter' && addEvent()}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Time</Label>
              <Input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="h-8 text-xs bg-white/[0.04] border-white/[0.08]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Color</Label>
              <div className="flex gap-2 mt-1">
                {EVENT_COLORS.map((c, i) => (
                  <button
                    key={c.label}
                    onClick={() => setNewColorIdx(i)}
                    className={`w-6 h-6 rounded-full border-2 transition-colors ${c.value} ${
                      newColorIdx === i ? 'ring-2 ring-cyan-400 ring-offset-1 ring-offset-gray-900' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" className="text-xs text-gray-400" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" className="text-xs bg-cyan-600 hover:bg-cyan-500" onClick={addEvent}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}