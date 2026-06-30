'use client';

import React, { useState, useEffect, useCallback } from 'react';
import type { AppProps } from '@/os/types';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FileUp,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';

interface PdfPage {
  pageNum: number;
  label: string;
  content: React.ReactNode;
}

function TitlePage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-16 h-16 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center mb-6">
        <span className="text-3xl font-bold text-cyan-400">🛡</span>
      </div>
      <h1 className="text-2xl font-bold text-cyan-300 mb-2">Security Assessment Report</h1>
      <h2 className="text-lg text-cyan-400/70 mb-6">CyberWin AI Infrastructure</h2>
      <Separator className="w-48 bg-cyan-500/30 mb-6" />
      <div className="space-y-1 text-sm text-slate-400">
        <p>Prepared by: CyberWin Security Team</p>
        <p>Date: January 15, 2025</p>
        <p>Classification: CONFIDENTIAL</p>
        <p>Version: 2.1.0</p>
      </div>
      <div className="mt-8 px-4 py-2 rounded border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs">
        This document contains sensitive security information. Handle according to clearance level.
      </div>
    </div>
  );
}

function TableOfContents() {
  const items = [
    { num: '1', title: 'Executive Summary', page: 3 },
    { num: '2', title: 'Vulnerability Assessment', page: 3 },
    { num: '3', title: 'Network Architecture Review', page: 4 },
    { num: '4', title: 'Penetration Testing Results', page: 4 },
    { num: '5', title: 'Recommendations & Remediation', page: 5 },
    { num: '6', title: 'Appendix: Scan Data', page: 5 },
  ];
  return (
    <div className="px-8 py-6">
      <h2 className="text-xl font-bold text-cyan-300 mb-6">Table of Contents</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.num} className="flex justify-between border-b border-slate-700/50 pb-2">
            <span className="text-sm text-slate-300">
              <span className="text-cyan-400 mr-3">{item.num}.</span>
              {item.title}
            </span>
            <span className="text-xs text-slate-500">{item.page}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExecutiveSummary() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h2 className="text-xl font-bold text-cyan-300">1. Executive Summary</h2>
      <p className="text-sm text-slate-300 leading-relaxed">
        A comprehensive security assessment was conducted on the CyberWin AI infrastructure between
        January 1-14, 2025. The assessment included vulnerability scanning, network architecture review,
        and targeted penetration testing of critical systems.
      </p>
      <div className="grid grid-cols-3 gap-3 my-4">
        {[
          { label: 'Critical', value: '3', color: 'text-red-400 bg-red-500/10 border-red-500/30' },
          { label: 'High', value: '7', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
          { label: 'Medium', value: '12', color: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30' },
        ].map((item) => (
          <div key={item.label} className={`rounded-lg border p-3 text-center ${item.color}`}>
            <div className="text-2xl font-bold">{item.value}</div>
            <div className="text-xs mt-1">{item.label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        The assessment identified <span className="text-red-400 font-medium">3 critical</span> vulnerabilities
        requiring immediate remediation, primarily related to unpatched authentication services and exposed
        API endpoints. Seven high-severity findings were related to outdated TLS configurations and insufficient
        access controls on internal services.
      </p>
      <p className="text-sm text-slate-300 leading-relaxed">
        Immediate action is recommended to address the critical findings before the next deployment cycle.
        A detailed remediation plan is provided in Section 5.
      </p>
    </div>
  );
}

function VulnerabilityAssessment() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h2 className="text-xl font-bold text-cyan-300">2. Vulnerability Assessment</h2>
      <p className="text-sm text-slate-300 leading-relaxed">
        Automated and manual vulnerability scanning was performed using industry-standard tools including
        Nessus, OpenVAS, and custom CyberWin scanner modules. The scan covered all 247 registered hosts
        across three network segments.
      </p>
      <div className="rounded-lg border border-slate-700/50 overflow-hidden">
        <div className="bg-slate-800/50 px-4 py-2 text-xs font-medium text-slate-400 grid grid-cols-4 gap-2">
          <span>Severity</span>
          <span>Host</span>
          <span>Vulnerability</span>
          <span>Status</span>
        </div>
        {[
          { severity: 'CRITICAL', color: 'text-red-400', host: '10.0.1.5', vuln: 'CVE-2025-0128 - Auth Bypass', status: 'Open' },
          { severity: 'CRITICAL', color: 'text-red-400', host: '10.0.1.12', vuln: 'CVE-2025-0201 - SQL Injection', status: 'Open' },
          { severity: 'HIGH', color: 'text-amber-400', host: '10.0.2.3', vuln: 'TLS 1.0 Enabled', status: 'In Progress' },
          { severity: 'HIGH', color: 'text-amber-400', host: '10.0.2.7', vuln: 'Weak SSH Key Exchange', status: 'Open' },
          { severity: 'MEDIUM', color: 'text-yellow-400', host: '10.0.3.1', vuln: 'CORS Misconfiguration', status: 'Fixed' },
        ].map((item, i) => (
          <div key={i} className="px-4 py-2 text-xs grid grid-cols-4 gap-2 border-t border-slate-700/30">
            <span className={item.color}>{item.severity}</span>
            <span className="text-slate-300 font-mono">{item.host}</span>
            <span className="text-slate-400">{item.vuln}</span>
            <span className={item.status === 'Fixed' ? 'text-green-400' : item.status === 'In Progress' ? 'text-yellow-400' : 'text-red-400'}>
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetworkReview() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h2 className="text-xl font-bold text-cyan-300">3. Network Architecture Review</h2>
      <p className="text-sm text-slate-300 leading-relaxed">
        The network architecture was reviewed against NIST SP 800-53 security controls. The infrastructure
        utilizes a three-tier network design with dedicated DMZ, internal, and restricted segments.
      </p>
      <div className="rounded-lg border border-slate-700/50 p-4 space-y-2">
        <h3 className="text-sm font-semibold text-cyan-400">Network Segments</h3>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-slate-400">DMZ (10.0.0.0/24)</span><span className="text-green-400">Compliant</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Internal (10.0.1.0/24)</span><span className="text-amber-400">Issues Found</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Restricted (10.0.2.0/24)</span><span className="text-amber-400">Issues Found</span></div>
          <div className="flex justify-between"><span className="text-slate-400">Management (10.0.3.0/24)</span><span className="text-green-400">Compliant</span></div>
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        Two issues were identified in the internal network segment: a missing VLAN segregation between
        development and production subnets, and an unauthenticated SNMP service on the management interface.
        Both findings are classified as HIGH severity and require immediate attention.
      </p>
    </div>
  );
}

function PenTestResults() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h2 className="text-xl font-bold text-cyan-300">4. Penetration Testing Results</h2>
      <p className="text-sm text-slate-300 leading-relaxed">
        A black-box penetration test was conducted simulating external threat actor scenarios. The engagement
        tested web applications, API endpoints, and perimeter defenses.
      </p>
      <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
        <h3 className="text-sm font-semibold text-red-400 mb-2">⚡ Critical Finding: Authentication Bypass</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          The authentication module at /api/v2/auth was found vulnerable to session token forgery. An attacker
          could craft valid session tokens without valid credentials, granting full administrative access to
          the CyberWin AI control panel. This was successfully exploited during testing.
        </p>
        <div className="mt-2 flex gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-300">CVSS: 9.8</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Remediation: Immediate</span>
        </div>
      </div>
      <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
        <h3 className="text-sm font-semibold text-amber-400 mb-2">⚠ High Finding: Data Exfiltration via API</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Multiple API endpoints lacked proper rate limiting and data validation, allowing potential
          bulk extraction of user data through crafted queries. The /api/v2/users endpoint could return
          all user records without pagination enforcement.
        </p>
        <div className="mt-2 flex gap-2">
          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">CVSS: 7.5</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">Remediation: 48 hours</span>
        </div>
      </div>
    </div>
  );
}

function Recommendations() {
  return (
    <div className="px-8 py-6 space-y-4">
      <h2 className="text-xl font-bold text-cyan-300">5. Recommendations & Remediation</h2>
      <div className="space-y-3">
        {[
          { priority: 'P1', color: 'bg-red-500', text: 'Immediately patch authentication service and invalidate all existing sessions' },
          { priority: 'P1', color: 'bg-red-500', text: 'Implement JWT token validation with cryptographic signing' },
          { priority: 'P2', color: 'bg-amber-500', text: 'Enable rate limiting on all public API endpoints' },
          { priority: 'P2', color: 'bg-amber-500', text: 'Upgrade all TLS connections to minimum TLS 1.2 with strong cipher suites' },
          { priority: 'P3', color: 'bg-yellow-500', text: 'Implement network segmentation between dev and production VLANs' },
          { priority: 'P3', color: 'bg-yellow-500', text: 'Deploy WAF rules to prevent SQL injection and XSS attacks' },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-3 text-sm">
            <span className={`${item.color} text-[10px] text-white px-1.5 py-0.5 rounded font-bold mt-0.5 shrink-0`}>
              {item.priority}
            </span>
            <span className="text-slate-300">{item.text}</span>
          </div>
        ))}
      </div>
      <Separator className="bg-cyan-500/20" />
      <div className="text-xs text-slate-500 text-center">
        <p>End of Security Assessment Report v2.1.0</p>
        <p className="mt-1">© 2025 CyberWin Security Division — All Rights Reserved</p>
      </div>
    </div>
  );
}

const pages: PdfPage[] = [
  { pageNum: 1, label: 'Cover', content: <TitlePage /> },
  { pageNum: 2, label: 'Contents', content: <TableOfContents /> },
  { pageNum: 3, label: 'Summary', content: <ExecutiveSummary /> },
  { pageNum: 4, label: 'Vuln Scan', content: <VulnerabilityAssessment /> },
  { pageNum: 5, label: 'Network', content: <NetworkReview /> },
  { pageNum: 6, label: 'Pentest', content: <PenTestResults /> },
  { pageNum: 7, label: 'Fixes', content: <Recommendations /> },
];

export default function PdfViewerApp({ windowId: _windowId }: AppProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const totalPages = pages.length;

  const goNext = useCallback(() => setCurrentPage((p) => Math.min(p + 1, totalPages - 1)), [totalPages]);
  const goPrev = useCallback(() => setCurrentPage((p) => Math.max(p - 1, 0)), []);
  const zoomIn = useCallback(() => setZoom((z) => Math.min(z + 25, 200)), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(z - 25, 50)), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goPrev();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goNext();
      if (e.key === '+' || e.key === '=') zoomIn();
      if (e.key === '-') zoomOut();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goNext, goPrev, zoomIn, zoomOut]);

  return (
    <div className="h-full w-full flex flex-col bg-slate-950/50 text-slate-200">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-700/50 bg-slate-900/80 shrink-0">
        <Button variant="ghost" size="icon" className="h-7 w-7 text-cyan-400 hover:text-cyan-300" title="Open File">
          <FileUp className="h-3.5 w-3.5" />
        </Button>
        <Separator orientation="vertical" className="h-4 bg-slate-700/50 mx-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={zoomOut} title="Zoom Out">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-slate-400 w-10 text-center font-mono">{zoom}%</span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={zoomIn} title="Zoom In">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
        <Separator orientation="vertical" className="h-4 bg-slate-700/50 mx-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={goPrev} disabled={currentPage === 0}>
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>
        <span className="text-xs text-slate-300 min-w-[60px] text-center">
          {currentPage + 1} / {totalPages}
        </span>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" onClick={goNext} disabled={currentPage === totalPages - 1}>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
        <div className="flex-1" />
        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-200" title="Fit to Width">
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-cyan-400 hover:text-cyan-300"
          onClick={() => setSidebarOpen((s) => !s)}
          title="Toggle Sidebar"
        >
          {sidebarOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
        </Button>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar Thumbnails */}
        {sidebarOpen && (
          <div className="w-28 shrink-0 border-r border-slate-700/50 bg-slate-900/40 overflow-y-auto p-2 space-y-2">
            {pages.map((page) => (
              <button
                key={page.pageNum}
                onClick={() => setCurrentPage(page.pageNum - 1)}
                className={`w-full aspect-[3/4] rounded border text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
                  currentPage === page.pageNum - 1
                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_8px_rgba(0,255,255,0.15)]'
                    : 'border-slate-700/50 bg-slate-800/40 hover:border-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold text-slate-400">{page.pageNum}</span>
                <span className="text-[8px] text-slate-500 mt-0.5">{page.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-slate-950/30 flex justify-center py-4">
          <div
            className="bg-white text-slate-900 rounded-sm shadow-lg w-full max-w-[595px] min-h-[842px] relative transition-transform"
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
          >
            {pages[currentPage].content}
          </div>
        </div>
      </div>
    </div>
  );
}
