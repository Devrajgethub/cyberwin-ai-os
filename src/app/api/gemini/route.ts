import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are CyberWin AI, a JARVIS-like AI assistant built into CyberWin AI OS — a cyberpunk-themed web desktop operating system. You are helpful, concise, and security-focused. You speak in a mix of Hindi and English (Hinglish) unless the user writes in pure English. Keep responses short (2-4 sentences max). You can help with: security analysis, network diagnostics, system management, opening apps, and general questions.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    // Dynamic import to avoid issues if SDK is not available
    let ZAI: any;
    try {
      const mod = await import('z-ai-web-dev-sdk');
      ZAI = mod.ZAI || mod.default?.ZAI || mod;
    } catch {
      return NextResponse.json({ text: 'AI service is currently unavailable. Please try again later.' });
    }

    const ai = ZAI.create?.() ?? ZAI.create?.({}) ?? new (ZAI as any)();

    const chatMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ];

    let responseText = '';
    if (typeof ai.chat === 'function') {
      const result = await ai.chat({ messages: chatMessages });
      responseText = typeof result === 'string' ? result : result?.text || result?.content || result?.message?.content || JSON.stringify(result);
    } else if (typeof ai.completions === 'function') {
      const result = await ai.completions({ messages: chatMessages });
      responseText = typeof result === 'string' ? result : result?.text || result?.content || result?.choices?.[0]?.message?.content || JSON.stringify(result);
    } else {
      return NextResponse.json({ text: 'AI service is currently unavailable.' });
    }

    return NextResponse.json({ text: responseText });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json({ text: 'Sorry, I encountered an error. Please try again.' });
  }
}