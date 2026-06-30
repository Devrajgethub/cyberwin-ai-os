'use client';

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AppProps } from '@/os/types';

interface FirewallRule {
  id: number;
  action: 'Allow' | 'Deny';
  protocol: string;
  source: string;
  destination: string;
  port: string;
  status: boolean;
  description: string;
}

const initialRules: FirewallRule[] = [
  { id: 1, action: 'Allow', protocol: 'TCP', source: '0.0.0.0/0', destination: '*', port: '443', status: true, description: 'Allow HTTPS traffic' },
  { id: 2, action: 'Allow', protocol: 'TCP', source: '0.0.0.0/0', destination: '*', port: '80', status: true, description: 'Allow HTTP traffic' },
  { id: 3, action: 'Deny', protocol: 'TCP', source: '0.0.0.0/0', destination: '*', port: '22', status: true, description: 'Block external SSH' },
  { id: 4, action: 'Allow', protocol: 'UDP', source: '0.0.0.0/0', destination: '*', port: '53', status: true, description: 'Allow DNS queries' },
  { id: 5, action: 'Deny', protocol: 'ICMP', source: '10.0.0.0/8', destination: '*', port: '*', status: true, description: 'Block ICMP from internal' },
  { id: 6, action: 'Allow', protocol: 'TCP', source: '192.168.1.0/24', destination: '*', port: '3306', status: true, description: 'Allow MySQL from LAN' },
  { id: 7, action: 'Deny', protocol: 'TCP', source: '0.0.0.0/0', destination: '*', port: '23', status: true, description: 'Block Telnet' },
  { id: 8, action: 'Allow', protocol: 'TCP', source: '192.168.1.0/24', destination: '*', port: '22', status: true, description: 'Allow SSH from LAN' },
  { id: 9, action: 'Deny', protocol: 'TCP', source: '0.0.0.0/0', destination: '*', port: '445', status: true, description: 'Block SMB' },
  { id: 10, action: 'Allow', protocol: 'UDP', source: '0.0.0.0/0', destination: '*', port: '51820', status: false, description: 'WireGuard VPN (disabled)' },
];

export default function FirewallApp({ windowId: _windowId }: AppProps) {
  const [rules, setRules] = useState<FirewallRule[]>(initialRules);
  const [enabled, setEnabled] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newRule, setNewRule] = useState({ action: 'Allow' as 'Allow' | 'Deny', protocol: 'TCP', source: '0.0.0.0/0', destination: '*', port: '', description: '' });

  const toggleRule = (id: number) => {
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, status: !r.status } : r)));
  };

  const deleteRule = (id: number) => {
    setRules((prev) => prev.filter((r) => r.id !== id));
  };

  const addRule = () => {
    if (!newRule.port && newRule.port !== '*') return;
    const maxId = Math.max(...rules.map((r) => r.id), 0);
    setRules((prev) => [...prev, { ...newRule, id: maxId + 1, status: true }]);
    setNewRule({ action: 'Allow', protocol: 'TCP', source: '0.0.0.0/0', destination: '*', port: '', description: '' });
    setDialogOpen(false);
  };

  const activeRules = rules.filter((r) => r.status);
  const blockedCount = rules.filter((r) => r.action === 'Deny' && r.status).length;
  const allowedCount = rules.filter((r) => r.action === 'Allow' && r.status).length;

  return (
    <div className="h-full w-full flex flex-col bg-black/20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch checked={enabled} onCheckedChange={setEnabled} />
            <span className={`text-sm font-medium ${enabled ? 'text-green-400' : 'text-red-400'}`}>
              Firewall {enabled ? 'Active' : 'Disabled'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Badge variant="outline" className="text-green-400 border-green-500/30 bg-green-500/10">{allowedCount} Allow</Badge>
          <Badge variant="outline" className="text-red-400 border-red-500/30 bg-red-500/10">{blockedCount} Deny</Badge>
          <Badge variant="outline" className="text-gray-400">{activeRules.length} Active</Badge>
        </div>
      </div>

      {/* Rules Table */}
      <ScrollArea className="flex-1">
        <div className="p-3">
          {/* Table Header */}
          <div className="grid grid-cols-[40px_60px_55px_110px_100px_60px_1fr_50px] gap-1 text-[10px] uppercase tracking-wider text-gray-500 px-2 py-1.5 border-b border-white/[0.04] font-medium">
            <span>#</span><span>Action</span><span>Proto</span><span>Source</span><span>Dest</span><span>Port</span><span>Description</span><span></span>
          </div>
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`grid grid-cols-[40px_60px_55px_110px_100px_60px_1fr_50px] gap-1 px-2 py-2 text-xs border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors items-center ${!rule.status ? 'opacity-40' : ''}`}
            >
              <span className="text-gray-500">{rule.id}</span>
              <Badge variant="outline" className={`text-[10px] justify-center ${rule.action === 'Allow' ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                {rule.action}
              </Badge>
              <span className="text-gray-300">{rule.protocol}</span>
              <span className="text-gray-400 truncate font-mono text-[11px]">{rule.source}</span>
              <span className="text-gray-400 truncate font-mono text-[11px]">{rule.destination}</span>
              <span className="text-cyan-400 font-mono text-[11px]">{rule.port}</span>
              <span className="text-gray-400 truncate">{rule.description}</span>
              <div className="flex items-center gap-1">
                <Switch checked={rule.status} onCheckedChange={() => toggleRule(rule.id)} className="scale-75" />
                <button onClick={() => deleteRule(rule.id)} className="p-0.5 hover:bg-red-500/20 rounded transition-colors">
                  <Trash2 size={11} className="text-gray-500 hover:text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Add Rule */}
      <div className="border-t border-white/[0.06] p-3 shrink-0">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-8 text-xs gap-1 bg-cyan-600 hover:bg-cyan-500">
              <Plus size={13} /> Add Rule
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#111118] border-white/[0.08]">
            <DialogHeader>
              <DialogTitle className="text-sm">Add Firewall Rule</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Action</Label>
                <Select value={newRule.action} onValueChange={(v) => setNewRule({ ...newRule, action: v as 'Allow' | 'Deny' })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Allow">Allow</SelectItem>
                    <SelectItem value="Deny">Deny</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Protocol</Label>
                <Select value={newRule.protocol} onValueChange={(v) => setNewRule({ ...newRule, protocol: v })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TCP">TCP</SelectItem>
                    <SelectItem value="UDP">UDP</SelectItem>
                    <SelectItem value="ICMP">ICMP</SelectItem>
                    <SelectItem value="ANY">ANY</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Source</Label>
                <Input value={newRule.source} onChange={(e) => setNewRule({ ...newRule, source: e.target.value })} className="h-8 text-xs font-mono" placeholder="0.0.0.0/0" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Destination</Label>
                <Input value={newRule.destination} onChange={(e) => setNewRule({ ...newRule, destination: e.target.value })} className="h-8 text-xs font-mono" placeholder="*" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Port</Label>
                <Input value={newRule.port} onChange={(e) => setNewRule({ ...newRule, port: e.target.value })} className="h-8 text-xs font-mono" placeholder="80" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-gray-400">Description</Label>
                <Input value={newRule.description} onChange={(e) => setNewRule({ ...newRule, description: e.target.value })} className="h-8 text-xs" placeholder="Rule description" />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" size="sm" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-500" onClick={addRule}>Add Rule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}