'use client';

import React, { useState, useRef } from 'react';
import { Play, Plus, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { AppProps } from '@/os/types';

interface CodeFile {
  name: string;
  language: string;
  content: string;
}

const sampleFiles: CodeFile[] = [
  {
    name: 'main.py',
    language: 'python',
    content: `#!/usr/bin/env python3
"""CyberWin Security Scanner"""

import socket
import ssl
import sys
from datetime import datetime
from typing import List, Dict

class SecurityScanner:
    """Multi-purpose network security scanner."""
    
    def __init__(self, target: str):
        self.target = target
        self.results: List[Dict] = []
        self.start_time = datetime.now()
    
    def port_scan(self, ports: List[int]) -> List[Dict]:
        """Scan target for open ports."""
        open_ports = []
        for port in ports:
            try:
                sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                sock.settimeout(1.0)
                result = sock.connect_ex((self.target, port))
                if result == 0:
                    open_ports.append({
                        "port": port,
                        "state": "open",
                        "service": self._identify_service(port)
                    })
                sock.close()
            except Exception as e:
                self.results.append({
                    "port": port, "error": str(e)
                })
        return open_ports
    
    def _identify_service(self, port: int) -> str:
        services = {
            21: "ftp", 22: "ssh", 80: "http",
            443: "https", 3306: "mysql", 8080: "http-alt"
        }
        return services.get(port, "unknown")
    
    def check_ssl(self, port: int = 443) -> Dict:
        """Check SSL/TLS configuration."""
        context = ssl.create_default_context()
        try:
            with socket.create_connection((self.target, port), timeout=5) as sock:
                with context.wrap_socket(sock, server_hostname=self.target) as ssock:
                    cert = ssock.getpeercert()
                    return {
                        "protocol": ssock.version(),
                        "cipher": ssock.cipher(),
                        "valid": True
                    }
        except Exception as e:
            return {"valid": False, "error": str(e)}

if __name__ == "__main__":
    scanner = SecurityScanner("192.168.1.1")
    results = scanner.port_scan([21, 22, 80, 443, 3306, 8080])
    print(f"Found {len(results)} open ports")
    for r in results:
        print(f"  Port {r['port']}: {r['state']} ({r['service']})")`,
  },
  {
    name: 'index.ts',
    language: 'typescript',
    content: `import { NextRequest, NextResponse } from 'next/server';

interface ScanResult {
  target: string;
  ports: PortResult[];
  timestamp: string;
}

interface PortResult {
  port: number;
  state: 'open' | 'closed' | 'filtered';
  service?: string;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { target, ports } = body;

    if (!target) {
      return NextResponse.json(
        { error: 'Target is required' },
        { status: 400 }
      );
    }

    const defaultPorts = [21, 22, 80, 443, 3306, 5432, 8080, 8443];
    const scanPorts = ports || defaultPorts;

    // Simulated scan results
    const results: PortResult[] = scanPorts.map((port: number) => ({
      port,
      state: Math.random() > 0.7 ? 'open' as const : 'closed' as const,
      service: getServiceName(port),
      risk: getPortRisk(port),
    }));

    return NextResponse.json<ScanResult>({
      target,
      ports: results,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getServiceName(port: number): string {
  const services: Record<number, string> = {
    21: 'ftp', 22: 'ssh', 80: 'http', 443: 'https',
    3306: 'mysql', 5432: 'postgresql', 8080: 'http-proxy',
    8443: 'https-alt',
  };
  return services[port] || 'unknown';
}

function getPortRisk(port: number): 'low' | 'medium' | 'high' | 'critical' {
  if ([22, 3306, 5432].includes(port)) return 'high';
  if ([21, 8080].includes(port)) return 'medium';
  return 'low';
}`,
  },
  {
    name: 'scan.sh',
    language: 'bash',
    content: `#!/bin/bash
# CyberWin Network Scan Script
# Usage: ./scan.sh <target_ip>

set -euo pipefail

TARGET="\${1:-192.168.1.1}"
LOG_DIR="./scan_logs"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="\${LOG_DIR}/scan_\${TIMESTAMP}.log"

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
CYAN='\\033[0;36m'
NC='\\033[0m'

mkdir -p "\${LOG_DIR}"

echo -e "\${CYAN}========================================\${NC}"
echo -e "\${CYAN} CyberWin Network Scanner v1.0\${NC}"
echo -e "\${CYAN}========================================\${NC}"
echo -e "Target: \${GREEN}\${TARGET}\${NC}"
echo -e "Log: \${LOG_FILE}"
echo ""

# Port scan function
scan_ports() {
    local ports=(21 22 25 53 80 110 443 3306 5432 8080 8443)
    echo -e "\${YELLOW}[*] Starting port scan...\${NC}"
    
    for port in "\${ports[@]}"; do
        timeout 2 bash -c "echo > /dev/tcp/\${TARGET}/\${port}" 2>/dev/null && \\
            echo -e "  \${GREEN}[OPEN]\${NC} Port \${port}" | tee -a "\${LOG_FILE}" || \\
            echo -e "  \${RED}[CLOSED]\${NC} Port \${port}" >> "\${LOG_FILE}"
    done
}

# Ping test
ping_test() {
    echo -e "\${YELLOW}[*] Running ping test...\${NC}"
    if ping -c 3 "\${TARGET}" > /dev/null 2>&1; then
        echo -e "  \${GREEN}[UP]\${NC} Host is reachable" | tee -a "\${LOG_FILE}"
    else
        echo -e "  \${RED}[DOWN]\${NC} Host is unreachable" | tee -a "\${LOG_FILE}"
    fi
}

# Main
ping_test
echo ""
scan_ports
echo ""
echo -e "\${CYAN}[+] Scan complete. Results saved to \${LOG_FILE}\${NC}"`,
  },
];

export default function CodeEditorApp({ windowId: _windowId }: AppProps) {
  const [files, setFiles] = useState<CodeFile[]>(sampleFiles);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [output, setOutput] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeFile = files[activeFileIdx];

  const lineCount = activeFile.content.split('\n').length;

  const handleContentChange = (newContent: string) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === activeFileIdx ? { ...f, content: newContent } : f))
    );
  };

  const handleRun = () => {
    setIsRunning(true);
    setOutput(['$ Running ' + activeFile.name + '...']);
    setTimeout(() => {
      const lang = activeFile.language;
      let result: string[];
      if (lang === 'python') {
        result = [
          '$ python3 main.py',
          'Found 3 open ports',
          '  Port 22: open (ssh)',
          '  Port 80: open (http)',
          '  Port 443: open (https)',
          '',
          'Scan completed in 2.34s',
        ];
      } else if (lang === 'typescript') {
        result = [
          '$ npx tsx index.ts',
          '{ target: "192.168.1.1", ports: [...], timestamp: "..." }',
          'Server running on port 3000',
        ];
      } else {
        result = [
          '$ bash scan.sh 192.168.1.1',
          '========================================',
          ' CyberWin Network Scanner v1.0',
          '========================================',
          'Target: 192.168.1.1',
          '',
          '[*] Running ping test...',
          '  [UP] Host is reachable',
          '',
          '[*] Starting port scan...',
          '  [OPEN] Port 22',
          '  [OPEN] Port 80',
          '  [OPEN] Port 443',
          '',
          '[+] Scan complete.',
        ];
      }
      setOutput(result);
      setIsRunning(false);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const newContent = activeFile.content.substring(0, start) + '  ' + activeFile.content.substring(end);
        handleContentChange(newContent);
        requestAnimationFrame(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 2;
        });
      }
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-[#1e1e2e]">
      {/* Tabs */}
      <div className="flex items-center border-b border-white/[0.06] bg-black/20">
        {files.map((file, i) => (
          <button
            key={file.name}
            onClick={() => setActiveFileIdx(i)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs border-r border-white/[0.04] transition-colors ${
              i === activeFileIdx
                ? 'bg-[#1e1e2e] text-cyan-300 border-b-2 border-b-cyan-500'
                : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200'
            }`}
          >
            <FileCode size={13} />
            {file.name}
          </button>
        ))}
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="sm"
          className="h-8 mr-2 text-xs gap-1 text-cyan-400 hover:text-cyan-300"
          onClick={handleRun}
          disabled={isRunning}
        >
          <Play size={12} />
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </div>

      {/* Editor */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Line numbers + code */}
        <div className="flex-1 flex overflow-hidden">
          <div className="py-3 px-2 text-right text-gray-600 text-xs font-mono select-none overflow-hidden border-r border-white/[0.04] bg-black/10">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-5 h-5">{i + 1}</div>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            value={activeFile.content}
            onChange={(e) => handleContentChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-[#cdd6f4] text-xs font-mono p-3 resize-none outline-none leading-5 whitespace-pre overflow-auto"
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>

      {/* Output Panel */}
      <Separator className="opacity-50" />
      <div className="h-32 shrink-0 flex flex-col bg-black/30">
        <div className="flex items-center px-3 py-1 text-[10px] uppercase tracking-wider text-gray-500 border-b border-white/[0.04]">
          Output
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 font-mono text-xs text-green-400 whitespace-pre-wrap">
            {output.length > 0 ? output.join('\n') : '// Output will appear here after running code'}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}