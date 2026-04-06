import { NextRequest, NextResponse } from 'next/server';
import type { AstralChart } from '@/lib/astro';
import { signOf } from '@/lib/astro';

export interface InterpretationRequest {
  chart: AstralChart;
  focus?: string;
}

export interface InterpretationResponse {
  summary: string;
  career: string;
  love: string;
  spiritual: string;
  generatedAt: string;
}

async function generateInterpretation(chart: AstralChart): Promise<InterpretationResponse> {
  const planetSigns = chart.planets.map(p => {
    const s = signOf(p.lon);
    return `${p.name}: ${s.sign.name}`;
  }).join('\n');

  const ascSign = signOf(chart.ascendant).sign.name;

  const prompt = `Você é um Oráculo Ancestral místico e poético. Interprete este Mapa Astral em português brasileiro, tratando o usuário como "você". Use metáforas cósmicas e linguagem esotérica sofisticada.

Mapa Astral:
${planetSigns}
Ascendente: ${ascSign}

REGRAS CRÍTICAS:
- Cada campo deve ter EXATAMENTE 2 a 3 frases — nem mais, nem menos
- Distribua o conteúdo igualmente entre os 4 campos
- Seja poético e profundo, mas conciso
- Responda SOMENTE em JSON válido, sem markdown, sem texto antes ou depois

Formato exato:
{"summary":"2 a 3 frases sobre a essência da alma e destino","career":"2 a 3 frases sobre vocação e propósito de vida","love":"2 a 3 frases sobre amor e relacionamentos","spiritual":"2 a 3 frases sobre jornada espiritual e karma"}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  const data = await response.json();
  let text = data.choices[0].message.content.trim();

  // Remove markdown code blocks if present
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const json = JSON.parse(text);

  return {
    summary:   json.summary   || '',
    career:    json.career    || '',
    love:      json.love      || '',
    spiritual: json.spiritual || '',
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'API key não configurada.' }, { status: 500 });
  }

  try {
    const body = (await request.json()) as InterpretationRequest;
    if (!body.chart) {
      return NextResponse.json({ error: 'Chart é obrigatório.' }, { status: 400 });
    }
    const interpretation = await generateInterpretation(body.chart);
    return NextResponse.json(interpretation, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[/api/interpretation] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a interpretação astral.' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ error: 'Use POST.' }, { status: 405 });
}
