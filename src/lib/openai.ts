import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
