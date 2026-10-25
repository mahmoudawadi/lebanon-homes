// Runs the assistant on Google Gemini (has a free plan)
import { ApiError, GoogleGenAI, type Content, type Part } from '@google/genai';
import { MAX_TOOL_ROUNDS, SYSTEM_PROMPT, type ChatTurn, type Send } from './prompt';
import { runToolForChat, toolSpecs } from './tools';

const MODEL = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
// The free plan allows only a few requests per minute per model, and each model has its
// own allowance, so when one is busy or out of quota the next one is tried
const BACKUP_MODELS = (process.env.GEMINI_BACKUP_MODELS || 'gemini-3-flash-preview,gemini-3.1-flash-lite,gemini-3.7-flash')
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);
const MODELS = [MODEL, ...BACKUP_MODELS.filter((m) => m !== MODEL)];

const isBusy = (err: unknown) => err instanceof ApiError && (err.status === 429 || err.status === 503);

// Google says how long to wait in its 429 response ("Please retry in 6.8s")
const retryDelayMs = (err: unknown) => {
  const seconds = parseFloat(String((err as Error)?.message).match(/retry in ([\d.]+)s/i)?.[1] || '');
  return Number.isFinite(seconds) ? Math.ceil(seconds * 1000) : null;
};

const functionDeclarations = toolSpecs.map((spec) => ({
  name: spec.name,
  description: spec.description,
  // Tools without arguments are declared without a schema
  ...(Object.keys(spec.parameters.properties).length > 0 ? { parametersJsonSchema: spec.parameters } : {}),
}));

export async function runGemini(turns: ChatTurn[], context: string, send: Send) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const contents: Content[] = turns.map((t, i) => ({
    role: t.role === 'assistant' ? 'model' : 'user',
    parts:
      i === turns.length - 1 && context
        ? [{ text: `[Context: ${context}]` }, { text: t.content }]
        : [{ text: t.content }],
  }));

  for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
    const request = (model: string) =>
      ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction: SYSTEM_PROMPT,
          tools: [{ functionDeclarations }],
        },
      });
    let stream;
    let lastError: unknown;
    for (const model of MODELS) {
      try {
        stream = await request(model);
        break;
      } catch (err) {
        if (!isBusy(err)) throw err;
        lastError = err;
      }
    }
    if (!stream) {
      // Every model is out of quota: wait once if the wait is short, then retry the main model
      const wait = retryDelayMs(lastError);
      if (wait === null || wait > 10_000) throw lastError;
      send({ type: 'status', tool: 'busy' });
      await new Promise((resolve) => setTimeout(resolve, wait));
      stream = await request(MODEL);
    }

    // Keep every part the model sends (including thought signatures) to echo it back
    const modelParts: Part[] = [];
    for await (const chunk of stream) {
      const parts = chunk.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        modelParts.push(part);
        if (part.text && !part.thought) send({ type: 'text', text: part.text });
      }
    }

    const calls = modelParts.filter((p) => p.functionCall);
    if (calls.length === 0) return;

    contents.push({ role: 'model', parts: modelParts });

    // Run all requested tools, then return every result in one turn
    const responses = await Promise.all(
      calls.map(async ({ functionCall }) => {
        const name = functionCall!.name || '';
        const result = await runToolForChat(name, functionCall!.args || {}, send);
        let output: unknown = result.content;
        try {
          output = JSON.parse(result.content);
        } catch {
          // Plain-text result
        }
        return {
          functionResponse: {
            id: functionCall!.id,
            name,
            response: result.isError ? { error: output } : { output },
          },
        };
      })
    );
    contents.push({ role: 'user', parts: responses });
  }
}

export function describeGeminiError(err: unknown) {
  if (!(err instanceof ApiError)) return null;
  if (err.status === 400 || err.status === 401 || err.status === 403) {
    return 'The assistant is not set up correctly (check the Gemini API key).';
  }
  if (err.status === 429) return 'The assistant has reached its free usage limit for now. Please try again in a little while.';
  if (err.status >= 500) return 'The assistant is busy right now. Please try again in a moment.';
  return null;
}
