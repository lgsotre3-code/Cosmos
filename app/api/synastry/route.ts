import { NextRequest, NextResponse } from 'next/server';
import type { SynastryResult } from '@/lib/astro/synastry';

export interface SynastryInterpreterRequest {
  result: SynastryResult;
}

export interface SynastryInterpretationResponse {
  summary: string;
  romantic: string;
  challenge: string;
  synthesis: string;
}

async function interpretSynastry(data: SynastryResult): Promise<SynastryInterpretationResponse> {
  const { chart1, chart2, aspects } = data;

  const aspectList = aspects
    .slice(0, 10) // Interpretar apenas os 10 aspectos mais fortes para evitar estouro de tokens
    .map(a => `${a.planet1} da Pessoa A em ${a.type} com ${a.planet2} da Pessoa B (Orb: ${a.orb.toFixed(1)}°)`)
    .join('\n');

  const prompt = `Você é o Oráculo de Sinastria do Cosmos — um místico especializado em conexões cósmicas. Realize uma leitura de sinastria mística e sofisticada entre a Pessoa A (${chart1.birthData.name}) e a Pessoa B (${chart2.birthData.name}).

DADOS DE ASPECTOS:
${aspectList}

REGRAS DE INTERPRETAÇÃO:
1. "summary": Uma visão geral da conexão em 2 frases poéticas.
2. "romantic": Como a energia romântica e emocional flui entre eles (2 frases).
3. "challenge": O maior desafio cármico ou prático da relação (2 frases).
4. "synthesis": Uma frase final de sabedoria oracular que resume o propósito da união.

NOTAS CRÍTICAS:
- Use linguagem esotérica, sofisticada e envolvente.
- Fale diretamente sobre as almas e o destino.
- Responda APENAS com JSON válido.

FORMATO:
{
  "summary": "...",
  "romantic": "...",
  "challenge": "...",
  "synthesis": "..."
}`;

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.88,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  const result = await response.json();
  let text = result.choices[0].message.content.trim();
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  return JSON.parse(text);
}

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'API key não configurada.' }, { status: 500 });
  }

  try {
    const body = (await request.json()) as SynastryInterpreterRequest;

    if (!body.result || !body.result.aspects) {
      return NextResponse.json({ error: 'Dados de sinastria inválidos.' }, { status: 400 });
    }

    const interpretation = await interpretSynastry(body.result);

    return NextResponse.json(interpretation, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[/api/synastry] Error:', error);
    return NextResponse.json(
      { error: 'Erro ao interpretar a sinastria.' },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: 'Use POST.' }, { status: 405 });
}
