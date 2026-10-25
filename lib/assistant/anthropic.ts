// Runs the assistant on Claude (Anthropic API)
import Anthropic from '@anthropic-ai/sdk';
import { MAX_TOOL_ROUNDS, SYSTEM_PROMPT, type ChatTurn, type Send } from './prompt';
import { runToolForChat, toolSpecs } from './tools';

const MODEL = process.env.ANTHROPIC_MODEL || 'claude-opus-5-5';

const tools: Anthropic.Beta.BetaTool[] = toolSpecs.map((spec) => ({
  name: spec.name,
  description: spec.description,
  input_schema: spec.parameters,
  eager_input_streaming: true,
}));

export async function runAnthropic(turns: ChatTurn[], context: string, send: Send) {
  const client = new Anthropic();
  const messages: Anthropic.Beta.BetaMessageParam[] = turns.map((t) => ({ role: t.role, content: t.content }));
  const last = messages[messages.length - 1];
  if (context && last.role === 'user') {
    last.content = [
      { type: 'text', text: `[Context: ${context}]` },
      { type: 'text', text: last.content as string },
    ];
  }

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      system: SYSTEM_PROMPT,
      tools,
      messages,
      // Chat replies don't need deep reasoning; low effort keeps them fast
      output_config: { effort: 'low' },
      cache_control: { type: 'ephemeral' },
      // If a reply is declined by a safety classifier, let the API retry on a fallback model
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
    });

    stream.on('text', (delta) => send({ type: 'text', text: delta }));

    let message: Anthropic.Beta.BetaMessage;
    try {
      message = await stream.finalMessage();
    } catch (err) {
      // A tool input that couldn't be parsed: re-issue the turn
      if (err instanceof Anthropic.APIError || round === MAX_TOOL_ROUNDS) throw err;
      continue;
    }

    if (message.stop_reason === 'refusal') {
      send({ type: 'text', text: "\n\nSorry, I can't help with that. Is there anything about properties I can help you with?" });
      return;
    }
    if (message.stop_reason === 'pause_turn') {
      messages.push({ role: 'assistant', content: message.content });
      continue;
    }

    const toolUses = message.content.filter(
      (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === 'tool_use'
    );
    if (toolUses.length === 0) return;
    if (message.stop_reason === 'max_tokens') throw new Error('Tool input was cut off');

    messages.push({ role: 'assistant', content: message.content });

    // Run all requested tools, then return every result in one user message
    const results = await Promise.all(
      toolUses.map(async (toolUse) => {
        const result = await runToolForChat(toolUse.name, toolUse.input, send);
        return {
          type: 'tool_result' as const,
          tool_use_id: toolUse.id,
          content: result.content,
          is_error: result.isError,
        };
      })
    );
    messages.push({ role: 'user', content: results });
  }
}

export function describeAnthropicError(err: unknown) {
  if (err instanceof Anthropic.AuthenticationError) return 'The assistant is not set up correctly (invalid API key).';
  if (err instanceof Anthropic.RateLimitError || err instanceof Anthropic.InternalServerError) {
    return 'The assistant is busy right now. Please try again in a moment.';
  }
  return null;
}
