'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { AppProps } from '@/os/types';

interface Line {
  type: 'input' | 'output' | 'error';
  text: string;
}

const asciiArt = `
   ╔═══════════════════════════════════════╗
   ║     ██████╗██╗   ██╗██████╗ ███████╗  ║
   ║    ██╔════╝╚██╗ ██╔╝██╔══██╗██╔════╝  ║
   ║    ██║      ╚████╔╝ ██████╔╝█████╗    ║
   ║    ██║       ╚██╔╝  ██╔══██╗██╔══╝    ║
   ║    ╚██████╗   ██║   ██████╔╝███████╗  ║
   ║     ╚═════╝   ╚═╝   ╚═════╝ ╚══════╝  ║
   ║          A I   O P E R A T I N G   S Y S T E M  ║
   ╚═══════════════════════════════════════╝
`;

const fakeFiles = [
  { name: 'Documents', type: 'dir' },
  { name: 'Downloads', type: 'dir' },
  { name: 'Desktop', type: 'dir' },
  { name: 'Projects', type: 'dir' },
  { name: '.bashrc', type: 'file' },
  { name: '.config', type: 'dir' },
  { name: '.ssh', type: 'dir' },
  { name: 'notes.md', type: 'file' },
  { name: 'scan_results.log', type: 'file' },
];

export default function TerminalApp({ windowId: _windowId }: AppProps) {
  const [lines, setLines] = useState<Line[]>([
    { type: 'output', text: asciiArt },
    { type: 'output', text: 'CyberWin AI OS v1.0.0-beta — Type "help" for available commands.\n' },
  ]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [currentDir, setCurrentDir] = useState('/home/cyberwin');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addOutput = useCallback((text: string, type: 'output' | 'error' = 'output') => {
    setLines((prev) => [...prev, { type, text }]);
  }, []);

  const processCommand = useCallback(
    (cmd: string) => {
      const parts = cmd.trim().split(/\s+/);
      const command = parts[0]?.toLowerCase();
      const args = parts.slice(1);

      setLines((prev) => [...prev, { type: 'input', text: `cyberwin@os:${currentDir}$ ${cmd}` }]);
      setHistory((prev) => [...prev, cmd]);
      setHistoryIdx(-1);

      switch (command) {
        case 'help':
          addOutput(
            'Available commands:\n' +
              '  help          - Show this help message\n' +
              '  ls            - List directory contents\n' +
              '  cd <dir>      - Change directory\n' +
              '  pwd           - Print working directory\n' +
              '  whoami        - Display current user\n' +
              '  date          - Show current date/time\n' +
              '  clear         - Clear terminal\n' +
              '  neofetch      - System information\n' +
              '  ping <host>   - Ping a host\n' +
              '  nmap <host>   - Port scan a host\n' +
              '  ifconfig      - Network configuration\n' +
              '  cat <file>    - Display file contents\n' +
              '  echo <text>   - Print text\n' +
              '  uname -a      - System information\n' +
              '  history       - Command history\n'
          );
          break;
        case 'ls':
          addOutput(
            fakeFiles.map((f) => `${f.type === 'dir' ? '📁' : '📄'} ${f.name}`).join('\n')
          );
          break;
        case 'cd':
          if (!args[0] || args[0] === '~') {
            setCurrentDir('/home/cyberwin');
          } else if (args[0] === '..') {
            const parts2 = currentDir.split('/').filter(Boolean);
            parts2.pop();
            setCurrentDir('/' + parts2.join('/'));
          } else {
            setCurrentDir(currentDir === '/' ? `/${args[0]}` : `${currentDir}/${args[0]}`);
          }
          break;
        case 'pwd':
          addOutput(currentDir);
          break;
        case 'whoami':
          addOutput('cyberwin');
          break;
        case 'date':
          addOutput(new Date().toString());
          break;
        case 'clear':
          setLines([]);
          break;
        case 'neofetch':
          addOutput(
            `${asciiArt}\n` +
              '  OS:         CyberWin AI OS 1.0.0-beta\n' +
              '  Kernel:     6.2.0-cyberwin\n' +
              '  Shell:      cyber-sh 5.2.0\n' +
              '  Resolution: ' + (typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080') + '\n' +
              '  DE:         CyberDE\n' +
              '  WM:         CyberWM\n' +
              '  Theme:      Cyberpunk Dark\n' +
              '  CPU:        Virtual Core x86_64\n' +
              '  Memory:     4096MiB / 16384MiB\n' +
              '  Uptime:     3 days, 7 hours, 42 minutes\n' +
              '  Security:   Active (Firewall ON, IDS Monitoring)\n'
          );
          break;
        case 'ping':
          if (!args[0]) {
            addOutput('Usage: ping <host>', 'error');
          } else {
            const host = args[0];
            let output = `PING ${host} (${Math.random().toFixed(3)}) 56(84) bytes of data.\n`;
            for (let i = 0; i < 4; i++) {
              const ms = (Math.random() * 30 + 5).toFixed(1);
              output += `64 bytes from ${host}: icmp_seq=${i + 1} ttl=64 time=${ms} ms\n`;
            }
            output += `\n--- ${host} ping statistics ---\n4 packets transmitted, 4 received, 0% packet loss`;
            addOutput(output);
          }
          break;
        case 'nmap':
          if (!args[0]) {
            addOutput('Usage: nmap <host>', 'error');
          } else {
            const host = args[0];
            const ports = [
              { port: 22, state: 'open', service: 'ssh' },
              { port: 80, state: 'open', service: 'http' },
              { port: 443, state: 'open', service: 'https' },
              { port: 3306, state: 'filtered', service: 'mysql' },
              { port: 8080, state: 'open', service: 'http-proxy' },
              { port: 21, state: 'closed', service: 'ftp' },
            ];
            let output = `Starting Nmap 7.94 ( https://nmap.org )\nNmap scan report for ${host}\n`;
            output += 'PORT      STATE     SERVICE\n';
            ports.forEach((p) => {
              const portStr = p.port.toString().padEnd(5);
              const stateStr = p.state.padEnd(9);
              const colored = p.state === 'open' ? `✓ ${portStr}${stateStr}${p.service}` : `✗ ${portStr}${stateStr}${p.service}`;
              output += colored + '\n';
            });
            output += `\nNmap done: 1 IP address (1 host up) scanned in 2.34 seconds`;
            addOutput(output);
          }
          break;
        case 'ifconfig':
          addOutput(
            'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500\n' +
              '        inet 192.168.1.105  netmask 255.255.255.0  broadcast 192.168.1.255\n' +
              '        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>\n' +
              '        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)\n' +
              '        RX packets 152489  bytes 198234567 (189.0 MiB)\n' +
              '        TX packets 98234  bytes 12456789 (11.8 MiB)\n\n' +
              'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536\n' +
              '        inet 127.0.0.1  netmask 255.0.0.0\n' +
              '        inet6 ::1  prefixlen 128  scopeid 0x10<host>\n' +
              '        loop  txqueuelen 1000  (Local Loopback)'
          );
          break;
        case 'cat':
          if (!args[0]) {
            addOutput('Usage: cat <file>', 'error');
          } else if (args[0] === 'notes.md') {
            addOutput('# Security Audit Notes\n\n- Check firewall rules for port 22\n- Update SSL certificates by Friday\n- Review access logs for anomalies\n- Patch kernel vulnerability CVE-2024-0001');
          } else if (args[0] === '.bashrc') {
            addOutput('# ~/.bashrc\nexport PATH=$PATH:/usr/local/cyber-tools\nalias ll="ls -la"\nalias cls="clear"\nexport PS1="\\u@cyberwin:\\w$ "');
          } else if (args[0] === 'scan_results.log') {
            addOutput('[2024-01-22 14:32:15] Starting vulnerability scan...\n[2024-01-22 14:32:18] Scanning 192.168.1.0/24\n[2024-01-22 14:33:45] Found 3 hosts\n[2024-01-22 14:34:12] Port scan complete\n[2024-01-22 14:34:15] 2 open ports found\n[2024-01-22 14:34:16] Scan complete. 0 critical vulnerabilities.');
          } else {
            addOutput(`cat: ${args[0]}: No such file or directory`, 'error');
          }
          break;
        case 'echo':
          addOutput(args.join(' '));
          break;
        case 'uname':
          addOutput('CyberWin 6.2.0-cyberwin #1 SMP x86_64 CyberWin OS');
          break;
        case 'history':
          addOutput(history.map((h, i) => `  ${i + 1}  ${h}`).join('\n') || '  (empty)');
          break;
        default:
          if (command) {
            addOutput(`cyber-sh: command not found: ${command}`, 'error');
          }
      }
    },
    [currentDir, history, addOutput]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    processCommand(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIdx = historyIdx < history.length - 1 ? historyIdx + 1 : historyIdx;
      setHistoryIdx(newIdx);
      if (history[newIdx]) setInput(history[newIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIdx = historyIdx > 0 ? historyIdx - 1 : -1;
      setHistoryIdx(newIdx);
      setInput(newIdx >= 0 && history[newIdx] ? history[newIdx] : '');
    }
  };

  return (
    <div
      className="h-full w-full flex flex-col bg-[#0a0a0f] font-mono text-sm p-3 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto overflow-x-hidden whitespace-pre-wrap break-all">
        {lines.map((line, i) => (
          <div
            key={i}
            className={
              line.type === 'input'
                ? 'text-cyan-400'
                : line.type === 'error'
                ? 'text-red-400'
                : 'text-green-400'
            }
          >
            {line.text}
          </div>
        ))}
        <form onSubmit={handleSubmit} className="flex items-center text-cyan-400">
          <span className="shrink-0">cyberwin@os:{currentDir}$&nbsp;</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none caret-cyan-400 text-cyan-300"
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
          <span className="cursor-blink text-cyan-400">▋</span>
        </form>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}