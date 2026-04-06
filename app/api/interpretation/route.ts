import { NextRequest, NextResponse } from 'next/server';
import type { AstralChart } from '@/lib/astroCalc';
import { signOf } from '@/lib/astroCalc';

// ─────────────────────────────────────────────────────────────────────────────
// /app/api/interpretation/route.ts
//
// AI-powered interpretation endpoint.
// Currently returns rule-based text; swap generateInterpretation()
// with an LLM call (OpenAI, Claude, etc.) when ready.
// ─────────────────────────────────────────────────────────────────────────────

export interface InterpretationRequest {
  chart: AstralChart;
  /** Optional: focus area — 'career' | 'love' | 'spiritual' | 'full' */
  focus?: string;
}

export interface InterpretationResponse {
  summary: string;
  career: string;
  love: string;
  spiritual: string;
  /** ISO timestamp of generation */
  generatedAt: string;
}

/**
 * Placeholder AI interpretation function.
 *
 * TO INTEGRATE AN LLM:
 * 1. Replace the body of this function with an API call to your LLM provider.
 * 2. Pass `chartSummary` as the user prompt.
 * 3. Parse and return the structured JSON response.
 *
 * Example with OpenAI:
 * ```ts
 * const completion = await openai.chat.completions.create({
 *   model: 'gpt-4o',
 *   messages: [
 *     { role: 'system', content: SYSTEM_PROMPT },
 *     { role: 'user',   content: chartSummary },
 *   ],
 *   response_format: { type: 'json_object' },
 * });
 * return JSON.parse(completion.choices[0].message.content!);
 * ```
 */
async function generateInterpretation(
  chart: AstralChart,
  _focus = 'full'
): Promise<InterpretationResponse> {
  const sun  = chart.planets.find(p => p.name === 'Sol')!;
  const moon = chart.planets.find(p => p.name === 'Lua')!;
  const asc  = chart.ascendant;

  const sunSign  = signOf(sun.lon).sign.name;
  const moonSign = signOf(moon.lon).sign.name;
  const ascSign  = signOf(asc).sign.name;

  // ── Rule-based fallback (replace with LLM call) ────────────────────────
  return {
    summary: `Com Sol em ${sunSign}, Lua em ${moonSign} e Ascendente em ${ascSign}, seu mapa revela uma alma de profunda complexidade. A tensão criativa entre sua essência solar e mundo emocional lunar define os maiores ciclos da sua vida.`,
    career:  `Sun in ${sunSign} sugere uma vocação ligada à expressão criativa e liderança natural. Seu caminho profissional se beneficia de ambientes que honram sua autenticidade.`,
    love:    `Com Lua em ${moonSign}, você busca conexões que ofereçam tanto intensidade emocional quanto espaço para crescimento. Seu coração floresce quando se sente verdadeiramente compreendido.`,
    spiritual: `Seu Ascendente em ${ascSign} indica que o crescimento espiritual acontece através da expansão da sua percepção de mundo. Rituais de contemplação e conexão com a natureza amplificam sua consciência.`,
    generatedAt: new Date().toISOString(),
  };
}

// ── Route handlers ─────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as InterpretationRequest;

    if (!body.chart) {
      return NextResponse.json(
        { error: 'Missing required field: chart' },
        { status: 400 }
      );
    }

    const interpretation = await generateInterpretation(body.chart, body.focus);

    return NextResponse.json(interpretation, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store', // interpretations are personalised
      },
    });
  } catch (error) {
    console.error('[/api/interpretation] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET not supported
export function GET() {
  return NextResponse.json({ error: 'Method not allowed. Use POST.' }, { status: 405 });
}
