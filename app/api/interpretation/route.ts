import { NextRequest, NextResponse } from 'next/server';
import type { AstralChart } from '@/lib/astro/types';

export interface InterpretationRequest {
  chart: AstralChart;
}

export interface InterpretationResponse {
  summary: string;
  career: string;
  love: string;
  spiritual: string;
}

async function generateInterpretation(chart: AstralChart): Promise<InterpretationResponse> {
  const sun = chart.planets.find(p => p.name === 'Sol');
  const moon = chart.planets.find(p => p.name === 'Lua');
  const asc = chart.houses?.[0]?.sign;

  const prompt = `Você é o Oráculo do Cosmos, um místico lendo um mapa astral. 
O consulente se chama ${chart.birthData.name}. 
Eles têm o Sol em ${sun?.lon ? Math.floor(sun.lon / 30) : 'desconhecido'}, Lua em ${moon?.lon ? Math.floor(moon.lon / 30) : 'desconhecido'}, e Ascendente em ${asc ? asc.name : 'desconhecido'}.

Responda APENAS com JSON no seguinte formato:
{
  "summary": "2 frases sobre a essência principal do mapa",
  "career": "2 frases sobre vocação e carreira",
  "love": "2 frases sobre vida amorosa e relacionamentos",
  "spiritual": "2 frases sobre propósito kármico"
}

Tom: Esotérico, poético e profundo.`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.8,
      max_tokens: 500,
    }),
  });

  if (!response.ok) {
    throw new Error('Groq API Error');
  }

  const data = await response.json();
  let text = data.choices[0].message.content.trim();
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return JSON.parse(text);
}

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'Oráculo não configurado.' }, { status: 500 });
  }

  try {
    const { chart } = (await request.json()) as InterpretationRequest;

    if (!chart || !chart.birthData) {
      return NextResponse.json({ error: 'Dados do mapa inválidos.' }, { status: 400 });
    }

    const result = await generateInterpretation(chart);

    return NextResponse.json(result, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[/api/interpretation] error', error);
    return NextResponse.json({ error: 'Erro ao interpretar o mapa.' }, { status: 500 });
  }
}
