import { NextRequest } from 'next/server';
import { z } from 'zod';
import type { AssistantEvent } from '@/lib/assistant/prompt';
import { describeAnthropicError, runAnthropic } from '@/lib/assistant/anthropic';
import { describeGeminiError, runGemini } from '@/lib/assistant/gemini';

export const dynamic = 'force-dynamic';

// AI_PROVIDER picks the model provider; otherwise use whichever key is set
function pickProvider(): 'gemini' | 'anthropic' | null {
  const wanted = process.env.AI_PROVIDER?.toLowerCase();
  if (wanted === 'gemini' && process.env.GEMINI_API_KEY) return 'gemini';
  if (wanted === 'anthropic' && process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  return null;
}

const requestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(40),
  language: z.enum(['en', 'ar', 'fr']).optional(),
  page: z.string().max(300).optional(),
});

const EMPTY_REPLY = {
  en: "Here's what I found - tap a listing for details, or tell me more about what you're looking for.",
  ar: 'إليك ما وجدته - اضغط على أي عقار لمعرفة التفاصيل، أو أخبرني المزيد عما تبحث عنه.',
  fr: "Voici ce que j'ai trouvé - touchez une annonce pour les détails, ou dites-m'en plus sur ce que vous cherchez.",
};

// Simple per-IP limit so the public endpoint can't be abused
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 30;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_REQUESTS;
}

export async function POST(request: NextRequest) {
  const provider = pickProvider();
  if (!provider) {
    return Response.json({ error: 'AI assistant is not configured' }, { status: 503 });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'local';
  if (rateLimited(ip)) {
    return Response.json({ error: 'Too many messages, please try again in a few minutes.' }, { status: 429 });
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success || parsed.data.messages[0].role !== 'user') {
    return Response.json({ error: 'Invalid request' }, { status: 400 });
  }
  const { messages, language, page } = parsed.data;
  const turns = messages.slice(-20);
  if (turns[0].role !== 'user') turns.shift();

  // Context about the visitor goes with their newest message
  const context = [
    language ? `Website language: ${language}.` : '',
    page ? `The visitor is currently on the page ${page}.` : '',
  ]
    .filter(Boolean)
    .join(' ');

  const encoder = new TextEncoder();
  const body = new ReadableStream({
    async start(controller) {
      let viewingSaved = false;
      let textSent = false;
      const send = (event: AssistantEvent) => {
        if (event.type === 'viewing_requested') viewingSaved = true;
        if (event.type === 'text' && event.text.trim()) textSent = true;
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      try {
        if (provider === 'gemini') await runGemini(turns, context, send);
        else await runAnthropic(turns, context, send);
        // Models occasionally finish without any text; never leave the visitor with a blank reply
        if (!textSent) send({ type: 'text', text: EMPTY_REPLY[language || 'en'] });
        send({ type: 'done' });
      } catch (err) {
        console.error(`AI assistant error (${provider}):`, err);
        if (viewingSaved) {
          // The request already reached the team; don't alarm the visitor
          send({ type: 'text', text: "\n\nYour request has been sent to our team - they'll contact you shortly." });
          return;
        }
        send({
          type: 'error',
          message:
            (provider === 'gemini' ? describeGeminiError(err) : describeAnthropicError(err)) ||
            'Something went wrong. Please try again, or contact us on WhatsApp.',
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
