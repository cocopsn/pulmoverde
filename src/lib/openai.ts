import OpenAI from "openai";

export const CHAT_MODEL = "gpt-4o-mini";
export const EMBEDDING_MODEL = "text-embedding-3-small";
export const EMBEDDING_DIM = 1536;

// Pricing (USD per 1M tokens) — as of 2026-05.
const COST_PER_1M = {
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "text-embedding-3-small": { input: 0.02, output: 0 },
} as const;

export function estimateCost(
  model: keyof typeof COST_PER_1M,
  tokensIn: number,
  tokensOut: number,
): number {
  const p = COST_PER_1M[model];
  return (tokensIn * p.input + tokensOut * p.output) / 1_000_000;
}

let _client: OpenAI | null = null;

/**
 * Lazy OpenAI client. Constructing OpenAI at module-load time crashes
 * `next build` page-data collection on Vercel when OPENAI_API_KEY is
 * missing — even if the route is dynamic and would only run at request
 * time. Defer construction until the first call so build succeeds and
 * routes only fail at runtime if the key is genuinely absent.
 */
export function getOpenAI(): OpenAI {
  if (_client) return _client;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY is not set. Add it to .env.local locally or to your Vercel project Environment Variables.",
    );
  }
  _client = new OpenAI({ apiKey });
  return _client;
}
