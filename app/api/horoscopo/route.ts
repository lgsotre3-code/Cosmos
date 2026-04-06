import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

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

function extractJSON(text: string): Record<string, string> {
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('No JSON object found');
  return JSON.parse(text.slice(start, end + 1));
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

  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(prompt);
  const rawText = result.response.text();

  const json = extractJSON(rawText);

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
  if (!process.env.GOOGLE_API_KEY) {
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
