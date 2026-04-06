import { NextRequest, NextResponse } from 'next/server';

export interface HoroscopoRequest {
  sign: string;
  name?: string;
}

export interface HoroscopoResponse {
  sign: string;
  date: string;
  geral: string;
  amor: string;
  trabalho: string;
  energia: string;
  conselho: string;
  generatedAt: string;
}

function extractJSON(text: string): string {
  // Remove markdown code blocks
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  // Find first { and last }
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');

  return text.slice(start, end + 1);
}

function sanitizeJSON(text: string): string {
  // Fix common Groq JSON issues: unescaped quotes inside strings
  // Replace smart quotes
  text = text.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');
  return text;
}

async function generateHoroscopo(sign: string, name?: string): Promise<HoroscopoResponse> {
  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const prompt = `Você é o Oráculo Ancestral do Cosmos — uma voz mística, poética e sábia. Gere o horóscopo diário para ${sign} para hoje, ${today}.${name ? ` O nome do usuário é ${name}.` : ''}

REGRAS CRÍTICAS:
- Cada campo deve ter EXATAMENTE 2 frases poéticas e profundas
- Use linguagem esotérica sofisticada, metáforas cósmicas, tom oracular
- Trate o usuário como "você"
- Seja específico para o signo, não genérico
- NÃO use aspas duplas dentro dos valores do JSON
- Responda SOMENTE com JSON válido, sem markdown, sem texto antes ou depois

Formato exato:
{
  "geral": "2 frases sobre a energia geral do dia",
  "amor": "2 frases sobre amor e relacionamentos hoje",
  "trabalho": "2 frases sobre carreira e finanças hoje",
  "energia": "2 frases sobre saúde e energia vital hoje",
  "conselho": "2 frases com o conselho do oráculo para o dia"
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
      temperature: 0.8,
      max_tokens: 800,
    }),
  });

  if (!response.ok) throw new Error(`Groq error: ${response.status}`);

  const data = await response.json();
  const rawText = data.choices[0].message.content;

  let jsonStr = extractJSON(rawText);
  jsonStr = sanitizeJSON(jsonStr);

  let json: Record<string, string>;
  try {
    json = JSON.parse(jsonStr);
  } catch {
    // Last resort: try to extract fields manually
    throw new Error(`JSON parse failed: ${jsonStr.slice(0, 100)}`);
  }

  return {
    sign,
    date: today,
    geral:    json.geral    || '',
    amor:     json.amor     || '',
    trabalho: json.trabalho || '',
    energia:  json.energia  || '',
    conselho: json.conselho || '',
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'API key não configurada.' }, { status: 500 });
  }

  try {
    const body = (await request.json()) as HoroscopoRequest;
    if (!body.sign) {
      return NextResponse.json({ error: 'Signo é obrigatório.' }, { status: 400 });
    }

    const horoscopo = await generateHoroscopo(body.sign, body.name);
    return NextResponse.json(horoscopo, {
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=7200',
      },
    });
  } catch (error) {
    console.error('[/api/horoscopo] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao consultar o oráculo.' },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: 'Use POST.' }, { status: 405 });
}
