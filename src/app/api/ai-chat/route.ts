import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Simulated AI response - in production, this would use z-ai-web-dev-sdk
    const responses: Record<string, string> = {
      scan: 'I can help with vulnerability scanning. I recommend running a full port scan with nmap, checking for known CVEs, and reviewing firewall rules.',
      network: 'Network analysis: 24 active connections, bandwidth within normal range. Firewall is active with 10 rules configured.',
      firewall: 'Firewall is active with 8 rules enabled. I recommend blocking port 445 and enabling rate limiting for SSH.',
      help: 'I can help with: security analysis, network diagnostics, firewall management, log analysis, and system administration.',
    };

    const lower = message.toLowerCase();
    let response = 'Based on the current system state, everything is operating normally. The threat level is LOW and all security services are active.';

    for (const [key, value] of Object.entries(responses)) {
      if (lower.includes(key)) {
        response = value;
        break;
      }
    }

    return NextResponse.json({ response });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}