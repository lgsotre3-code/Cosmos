import { NextRequest, NextResponse } from 'next/server';
<<<<<<< HEAD
import type { AstralChart } from '@/lib/astro';
import { signOf } from '@/lib/astro';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ─────────────────────────────────────────────────────────────────────────────
// /app/api/interpretation/route.ts
//
// AI-powered interpretation endpoint using Google Gemini-2.0-Flash-Exp.
// ─────────────────────────────────────────────────────────────────────────────

export interface InterpretationRequest {
  chart: AstralChart;
  focus?: string;
=======
import type { AstralChart } from '@/lib/astro/types';

export interface InterpretationRequest {
  chart: AstralChart;
>>>>>>> 539aaed (fix(deploy): resolve all merge conflicts, restore API route, and type errors)
}

export interface InterpretationResponse {
  summary: string;
  career: string;
  love: string;
  spiritual: string;
<<<<<<< HEAD
  generatedAt: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function generateInterpretation(
  chart: AstralChart,
  _focus = 'full'
): Promise<InterpretationResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const planetSigns = chart.planets
    .map(p => {
      const signInfo = signOf(p.lon);
      return `${p.name}: ${signInfo.sign.name}`;
    })
    .join('\n');

  const ascSign = signOf(chart.ascendant).sign.name;

  const prompt = `
    Aja como um Oráculo Ancestral e místico, um mestre das artes esotéricas que enxerga além do véu do tempo.
    Sua voz é profunda, poética e carregada de sabedoria arquetípica. Use metáforas cósmicas e trate o usuário diretamente como "você".
    
    Interprete o seguinte Mapa Astral Natal:
    Dados dos Luminares e Planetas:
    ${planetSigns}
    Ascendente: ${ascSign}
    
    Sua tarefa é fornecer uma leitura profunda e transformadora dividida em quatro partes:
    1. "summary": Uma visão geral da essência da alma, os fios de destino que se entrelaçam nesta encarnação.
    2. "career": O caminho do propósito, a vocação sagrada e como o indivíduo deve manifestar sua vontade no mundo material.
    3. "love": As águas do coração, como a alma busca união e o que as estrelas dizem sobre seus laços afetivos.
    4. "spiritual": A jornada do espírito em busca de luz, os desafios cármicos e o florescer da consciência.

    REGRAS CRÍTICAS:
    - O tom DEVE ser místico, poético e ancestral. Use palavras como "constelação", "fardo sagrado", "alquimia", "teia do tempo", etc.
    - Responda EXCLUSIVAMENTE em formato JSON no esquema abaixo.
    - O idioma deve ser Português Brasileiro (PT-BR).
    
    Schema da Resposta:
    {
      "summary": "texto místico",
      "career": "texto místico",
      "love": "texto místico",
      "spiritual": "texto místico"
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const json = JSON.parse(responseText);

    return {
      summary: json.summary || '',
      career: json.career || '',
      love: json.love || '',
      spiritual: json.spiritual || '',
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Falha ao consultar o oráculo estelar.');
  }
}

// ── Route handlers ──────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Chave de API não configurada no servidor.' },
      { status: 500 }
    );
  }

  try {
    const body = (await request.json()) as InterpretationRequest;

    if (!body.chart) {
      return NextResponse.json(
        { error: 'Dados do mapa (chart) são obrigatórios.' },
        { status: 400 }
      );
    }

    const interpretation = await generateInterpretation(body.chart, body.focus);

    return NextResponse.json(interpretation, {
=======
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
>>>>>>> 539aaed (fix(deploy): resolve all merge conflicts, restore API route, and type errors)
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
<<<<<<< HEAD
    console.error('[/api/interpretation] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao processar a interpretação astral.' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json(
    { error: 'Método não permitido. Use POST.' },
    { status: 405 }
  );
}
=======
    console.error('[/api/interpretation] error', error);
    return NextResponse.json({ error: 'Erro ao interpretar o mapa.' }, { status: 500 });
  }
}
>>>>>>> 539aaed (fix(deploy): resolve all merge conflicts, restore API route, and type errors)
