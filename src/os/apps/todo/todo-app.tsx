'use client';

import React, { useState } from 'react';
import { Plus, Trash2, ListFilter, CheckCircle2, Circle, Calendar, Flame, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AppProps } from '@/os/types';

type Priority = 'High' | 'Medium' | 'Low';
type Category = 'All' | 'Work' | 'Personal' | 'Security';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  category: Exclude<Category, 'All'>;
  completed: boolean;
}

const CATEGORIES: Category[] = ['All', 'Work', 'Personal', 'Security'];

const priorityBadge: Record<Priority, { className: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  High: { className: 'bg-red-500/15 text-red-300 border-red-500/30', icon: Flame },
  Medium: { className: 'bg-orange-500/15 text-orange-300 border-orange-500/30', icon: Minus },
  Low: { className: 'bg-green-500/15 text-green-300 border-green-500/30', icon: Circle },
};

const today = new Date();
const fmt = (d: Date) => d.toISOString().slice(0, 10);
const offset = (days: number) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return fmt(d);
};

const initialTasks: Task[] = [
  { id: '1', title: 'Run full system vulnerability scan', dueDate: today.toISOString().slice(0, 10), priority: 'High', category: 'Security', completed: false },
  { id: '2', title: 'Review firewall rules for Q1', dueDate: offset(1), priority: 'High', category: 'Security', completed: false },
  { id: '3', title: 'Update SSL certificates on prod servers', dueDate: offset(2), priority: 'High', category: 'Work', completed: false },
  { id: '4', title: 'Deploy IDS signature updates', dueDate: today.toISOString().slice(0, 10), priority: 'Medium', category: 'Security', completed: true },
  { id: '5', title: 'Audit user access permissions', dueDate: offset(3), priority: 'Medium', category: 'Work', completed: false },
  { id: '6', title: 'Review and patch CVE-2024-1234', dueDate: offset(1), priority: 'High', category: 'Security', completed: false },
  { id: '7', title: 'Set up 2FA for new team members', dueDate: offset(5), priority: 'Medium', category: 'Work', completed: false },
  { id: '8', title: 'Backup encryption keys to offline storage', dueDate: offset(4), priority: 'Low', category: 'Security', completed: true },
  { id: '9', title: 'Organize personal password vault', dueDate: offset(7), priority: 'Low', category: 'Personal', completed: false },
  { id: '10', title: 'Submit monthly security report', dueDate: offset(6), priority: 'Medium', category: 'Work', completed: false },
];

export default function TodoApp({ windowId: _windowId }: AppProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [sortBy, setSortBy] = useState<string>('priority');
  const [newPriority, setNewPriority] = useState<Priority>('Medium');

  const filteredTasks = tasks
    .filter((t) => activeCategory === 'All' || t.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === 'priority') {
        const order: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }
      if (sortBy === 'dueDate') return a.dueDate.localeCompare(b.dueDate);
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0;
    });

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;

  const toggleTask = (id: string) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const id = Date.now().toString();
    const task: Task = {
      id,
      title: newTaskTitle.trim(),
      dueDate: fmt(new Date()),
      priority: newPriority,
      category: activeCategory === 'All' ? 'Work' : (activeCategory as Exclude<Category, 'All'>),
      completed: false,
    };
    setTasks((prev) => [task, ...prev]);
    setNewTaskTitle('');
  };

  return (
    <div className="h-full w-full flex bg-black/20">
      {/* Sidebar */}
      <div className="w-40 shrink-0 border-r border-white/[0.06] flex flex-col">
        <div className="p-3 pb-2">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">Categories</div>
          <div className="space-y-0.5">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' ? tasks.length : tasks.filter((t) => t.category === cat).length;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                    activeCategory === cat ? 'bg-cyan-500/10 text-cyan-300' : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-300'
                  }`}
                >
                  <span>{cat}</span>
                  <span className="text-[10px] text-gray-600">{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        <Separator className="opacity-50" />
        <div className="p-3 flex-1">
          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-medium mb-2">Sort By</div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-7 text-xs bg-white/[0.04] border-white/[0.06] text-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-white/[0.08]">
              <SelectItem value="priority" className="text-gray-300">Priority</SelectItem>
              <SelectItem value="dueDate" className="text-gray-300">Due Date</SelectItem>
              <SelectItem value="name" className="text-gray-300">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Add task */}
        <div className="p-3 space-y-2 border-b border-white/[0.06]">
          <div className="flex gap-2">
            <Input
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Add a new task..."
              className="h-8 text-xs bg-white/[0.04] border-white/[0.06] text-gray-200"
            />
            <Button size="sm" className="h-8 px-3 bg-cyan-600 hover:bg-cyan-500 shrink-0" onClick={addTask}>
              <Plus size={14} />
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-gray-500">Priority:</span>
            {(['High', 'Medium', 'Low'] as Priority[]).map((p) => (
              <button
                key={p}
                onClick={() => setNewPriority(p)}
                className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                  newPriority === p ? priorityBadge[p].className : 'border-white/[0.06] text-gray-500 hover:text-gray-400'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Task list */}
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {filteredTasks.length === 0 ? (
              <div className="text-center text-xs text-gray-600 py-12">No tasks found</div>
            ) : (
              filteredTasks.map((task) => {
                const pBadge = priorityBadge[task.priority];
                const PIcon = pBadge.icon;
                return (
                  <div
                    key={task.id}
                    className={`group flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      task.completed ? 'opacity-60' : 'hover:bg-white/[0.03]'
                    }`}
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTask(task.id)}
                      className="shrink-0 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                    />
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs truncate ${task.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
                        {task.title}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-600 flex items-center gap-1">
                          <Calendar size={9} />
                          {task.dueDate}
                        </span>
                        <Badge variant="outline" className={`text-[9px] px-1.5 py-0 h-4 border ${pBadge.className}`}>
                          <PIcon size={8} className="mr-0.5" />
                          {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 border border-white/[0.08] text-gray-500">
                          {task.category}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 rounded"
                    >
                      <Trash2 size={12} className="text-red-400" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <Separator className="opacity-50" />
        <div className="px-3 py-2 flex items-center justify-between text-[10px] text-gray-500">
          <span>
            <CheckCircle2 size={10} className="inline mr-1 text-cyan-500/60" />
            {completedCount} / {totalCount} completed
          </span>
          {totalCount > 0 && (
            <span className="text-cyan-500/60">{Math.round((completedCount / totalCount) * 100)}%</span>
          )}
        </div>
      </div>
    </div>
  );
}