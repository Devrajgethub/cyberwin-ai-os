'use client';

import React, { useState, useMemo } from 'react';
import {
  ArrowLeft, BookOpen, CheckCircle2, Circle, GraduationCap,
  Shield, Lock, Crosshair, Search, Bug, Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import type { AppProps } from '@/os/types';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

interface Lesson {
  title: string;
  completed: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  category: string;
  totalLessons: number;
  lessons: Lesson[];
  icon: React.ReactNode;
}

const courses: Course[] = [
  {
    id: 'net-sec-intro',
    title: 'Introduction to Network Security',
    description: 'Learn the fundamentals of network security including protocols, firewalls, and intrusion detection.',
    difficulty: 'Beginner',
    category: 'Network Security',
    totalLessons: 12,
    icon: <Shield size={20} className="text-cyan-400" />,
    lessons: [
      { title: 'What is Network Security?', completed: true },
      { title: 'OSI Model Overview', completed: true },
      { title: 'TCP/IP Fundamentals', completed: true },
      { title: 'Common Network Attacks', completed: true },
      { title: 'Firewall Basics', completed: true },
      { title: 'Intrusion Detection Systems', completed: true },
      { title: 'Virtual Private Networks', completed: true },
      { title: 'Network Segmentation', completed: true },
      { title: 'Wireless Security', completed: true },
      { title: 'Network Monitoring Tools', completed: false },
      { title: 'Incident Response', completed: false },
      { title: 'Final Assessment', completed: false },
    ],
  },
  {
    id: 'crypto-fund',
    title: 'Cryptography Fundamentals',
    description: 'Explore symmetric and asymmetric encryption, hashing, and real-world cryptographic protocols.',
    difficulty: 'Beginner',
    category: 'Cryptography',
    totalLessons: 8,
    icon: <Lock size={20} className="text-purple-400" />,
    lessons: [
      { title: 'History of Cryptography', completed: true },
      { title: 'Symmetric Encryption', completed: true },
      { title: 'Asymmetric Encryption', completed: true },
      { title: 'Hash Functions', completed: false },
      { title: 'Digital Signatures', completed: false },
      { title: 'PKI and Certificates', completed: false },
      { title: 'TLS/SSL Deep Dive', completed: false },
      { title: 'Practical Crypto Exercises', completed: false },
    ],
  },
  {
    id: 'pentest-basics',
    title: 'Penetration Testing Basics',
    description: 'Learn ethical hacking methodologies, reconnaissance, and vulnerability assessment techniques.',
    difficulty: 'Intermediate',
    category: 'Penetration Testing',
    totalLessons: 15,
    icon: <Crosshair size={20} className="text-red-400" />,
    lessons: [
      { title: 'Ethical Hacking Principles', completed: true },
      { title: 'Reconnaissance Techniques', completed: false },
      { title: 'Scanning & Enumeration', completed: false },
      { title: 'Vulnerability Assessment', completed: false },
      { title: 'Exploitation Basics', completed: false },
      { title: 'Post-Exploitation', completed: false },
      { title: 'Web App Testing', completed: false },
      { title: 'Network Exploitation', completed: false },
      { title: 'Wireless Testing', completed: false },
      { title: 'Social Engineering', completed: false },
      { title: 'Reporting Findings', completed: false },
      { title: 'Legal & Compliance', completed: false },
      { title: 'Tool Mastery: Nmap', completed: false },
      { title: 'Tool Mastery: Metasploit', completed: false },
      { title: 'Capstone Project', completed: false },
    ],
  },
  {
    id: 'digital-forensics',
    title: 'Digital Forensics',
    description: 'Master forensic investigation techniques for disk, memory, and network analysis.',
    difficulty: 'Advanced',
    category: 'Digital Forensics',
    totalLessons: 10,
    icon: <Search size={20} className="text-amber-400" />,
    lessons: [
      { title: 'Forensics Methodology', completed: false },
      { title: 'Disk Forensics', completed: false },
      { title: 'File System Analysis', completed: false },
      { title: 'Memory Forensics', completed: false },
      { title: 'Network Forensics', completed: false },
      { title: 'Malware Forensics', completed: false },
      { title: 'Timeline Analysis', completed: false },
      { title: 'Evidence Handling', completed: false },
      { title: 'Reporting & Chain of Custody', completed: false },
      { title: 'Case Study Practicum', completed: false },
    ],
  },
  {
    id: 'malware-analysis',
    title: 'Malware Analysis',
    description: 'Static and dynamic analysis techniques for understanding and mitigating malware threats.',
    difficulty: 'Advanced',
    category: 'Malware Analysis',
    totalLessons: 12,
    icon: <Bug size={20} className="text-green-400" />,
    lessons: [
      { title: 'Malware Types & Taxonomy', completed: false },
      { title: 'Analysis Environment Setup', completed: false },
      { title: 'Static Analysis Techniques', completed: false },
      { title: 'Dynamic Analysis Sandbox', completed: false },
      { title: 'Behavioral Analysis', completed: false },
      { title: 'Code Analysis Basics', completed: false },
      { title: 'Rootkit Detection', completed: false },
      { title: 'Ransomware Analysis', completed: false },
      { title: 'APT Group Profiles', completed: false },
      { title: 'YARA Rule Writing', completed: false },
      { title: 'Automated Analysis Pipelines', completed: false },
      { title: 'Final Lab Exercise', completed: false },
    ],
  },
  {
    id: 'social-eng-defense',
    title: 'Social Engineering Defense',
    description: 'Understand social engineering tactics and build organizational defense strategies.',
    difficulty: 'Intermediate',
    category: 'Social Engineering',
    totalLessons: 8,
    icon: <Users size={20} className="text-pink-400" />,
    lessons: [
      { title: 'Psychology of Social Engineering', completed: false },
      { title: 'Phishing Techniques', completed: false },
      { title: 'Vishing & Smishing', completed: false },
      { title: 'Pretexting & Baiting', completed: false },
      { title: 'Tailgating Attacks', completed: false },
      { title: 'Building Awareness Programs', completed: false },
      { title: 'Simulated Attack Exercises', completed: false },
      { title: 'Incident Response Playbook', completed: false },
    ],
  },
];

function getDifficultyColor(d: Difficulty) {
  switch (d) {
    case 'Beginner': return 'bg-green-500/15 text-green-300 border-green-500/30';
    case 'Intermediate': return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'Advanced': return 'bg-red-500/15 text-red-300 border-red-500/30';
  }
}

function getProgress(course: Course) {
  const done = course.lessons.filter((l) => l.completed).length;
  return Math.round((done / course.totalLessons) * 100);
}

export default function CyberLearningApp({ windowId: _windowId }: AppProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [checkedLessons, setCheckedLessons] = useState<Record<string, Record<number, boolean>>>({});

  const stats = useMemo(() => {
    const merged = courses.map((c) => {
      const overrides = checkedLessons[c.id] || {};
      const lessons = c.lessons.map((l, i) => overrides[i] ?? l.completed);
      const done = lessons.filter(Boolean).length;
      return { ...c, lessons, completedLessons: done };
    });
    const started = merged.filter((c) => c.completedLessons > 0).length;
    const totalDone = merged.reduce((s, c) => s + c.completedLessons, 0);
    return { merged, started, totalDone };
  }, [checkedLessons]);

  const toggleLesson = (courseId: string, lessonIdx: number) => {
    setCheckedLessons((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [lessonIdx]: !(prev[courseId]?.[lessonIdx] ?? false),
      },
    }));
  };

  const selectedCourse = stats.merged.find((c) => c.id === selectedCourseId);

  if (selectedCourse) {
    const progress = Math.round((selectedCourse.completedLessons / selectedCourse.totalLessons) * 100);
    return (
      <div className="h-full w-full flex flex-col bg-black/20">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.06] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setSelectedCourseId(null)}>
              <ArrowLeft size={14} />
            </Button>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-100 truncate">{selectedCourse.title}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge variant="outline" className={`text-[9px] px-1.5 py-0 border ${getDifficultyColor(selectedCourse.difficulty)}`}>
                  {selectedCourse.difficulty}
                </Badge>
                <span className="text-[10px] text-gray-500">{selectedCourse.category}</span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px]">
              <span className="text-gray-400">{selectedCourse.completedLessons}/{selectedCourse.totalLessons} lessons completed</span>
              <span className="text-cyan-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/[0.06]" />
          </div>
        </div>

        {/* Lessons */}
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-0.5">
            {selectedCourse.lessons.map((lesson, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                  lesson.completed ? 'bg-green-500/[0.04]' : 'hover:bg-white/[0.03]'
                }`}
              >
                <Checkbox
                  checked={lesson.completed}
                  onCheckedChange={() => toggleLesson(selectedCourse.id, i)}
                  className="border-white/20 data-[state=checked]:bg-cyan-600 data-[state=checked]:border-cyan-600"
                />
                <span className={`text-xs flex-1 ${lesson.completed ? 'text-gray-400 line-through' : 'text-gray-200'}`}>
                  {lesson.title}
                </span>
                <span className="text-[10px] text-gray-600">Lesson {i + 1}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Overview */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <GraduationCap size={18} className="text-cyan-400" />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-100">Cybersecurity Academy</div>
              <div className="text-[10px] text-gray-500">
                {stats.started}/{courses.length} courses started, {stats.totalDone} total lessons completed
              </div>
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Course Grid */}
          <div className="grid grid-cols-2 gap-3">
            {stats.merged.map((course) => {
              const progress = Math.round((course.completedLessons / course.totalLessons) * 100);
              return (
                <button
                  key={course.id}
                  className="text-left rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 hover:bg-white/[0.04] hover:border-cyan-500/20 transition-colors"
                  onClick={() => setSelectedCourseId(course.id)}
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-8 w-8 rounded-md bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                      {course.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-100 leading-tight line-clamp-2">{course.title}</div>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Badge variant="outline" className={`text-[8px] px-1 py-0 border ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </Badge>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-1">{course.totalLessons} lessons</div>
                    </div>
                  </div>
                  <div className="mt-2.5 space-y-1">
                    <Progress value={progress} className="h-1 bg-white/[0.06]" />
                    <div className="flex justify-between text-[9px]">
                      <span className="text-gray-500">{course.category}</span>
                      <span className={progress > 0 ? 'text-cyan-400' : 'text-gray-600'}>{progress}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}