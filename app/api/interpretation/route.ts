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

  const prompt = `Interprete este Mapa Astral Natal como um Oráculo Ancestral místico e poético, usando metáforas cósmicas, em português brasileiro, tratando o usuário como "você".

Planetas:
${planetSigns}
Ascendente: ${ascSign}

Responda SOMENTE em JSON válido, sem markdown, sem explicações, exatamente neste formato:
{"summary":"...","career":"...","love":"...","spiritual":"..."}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama3-8b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices[0].message.content.trim();
  const json = JSON.parse(text);

  return {
    summary: json.summary || '',
    career: json.career || '',
    love: json.love || '',
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
    return NextResponse.json({ error: 'Erro interno ao processar a interpretação astral.' }, { status: 500 });
  }
}

export function GET() {
  return NextResponse.json({ error: 'Use POST.' }, { status: 405 });
}
