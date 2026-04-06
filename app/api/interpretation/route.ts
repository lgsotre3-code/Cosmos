import { NextRequest, NextResponse } from 'next/server';

export interface TarotRequest {
  question: string;
  spread: 1 | 3 | 5;
}

export interface TarotCard {
  name: string;
  arcana: string;
  position: string;
  reversed: boolean;
  message: string;
}

export interface TarotResponse {
  cards: TarotCard[];
  synthesis: string;
  generatedAt: string;
}

const SPREADS: Record<number, string[]> = {
  1: ['A Essência'],
  3: ['O Passado', 'O Presente', 'O Futuro'],
  5: ['A Situação', 'O Desafio', 'O Inconsciente', 'O Conselho', 'O Desfecho'],
};

async function generateTarotReading(question: string, spread: number): Promise<TarotResponse> {
  const positions = SPREADS[spread] ?? SPREADS[1];

  const prompt = `Você é o Oráculo das Estrelas — uma presença mística, poética e ancestral. Realize uma leitura de Tarot em português brasileiro para a seguinte questão: "${question}"

Tiragem: ${spread} carta(s)
Posições: ${positions.join(', ')}

REGRAS CRÍTICAS:
- Escolha cartas reais do Tarot (Arcanos Maiores preferencialmente, Menores se necessário)
- Para cada carta, decida aleatoriamente se está reversed: true ou false
- Cada "message" deve ter exatamente 2 frases poéticas e profundas sobre aquela posição
- A "synthesis" deve ter exatamente 3 frases unindo toda a leitura com sabedoria mística
- Use linguagem esotérica sofisticada, metáforas cósmicas, tom oracular
- Responda SOMENTE com JSON válido, sem markdown, sem texto antes ou depois

Formato exato (array com ${spread} carta(s)):
{
  "cards": [
    {
      "name": "Nome da Carta",
      "arcana": "Arcano Maior" ou "Arcano Menor",
      "position": "nome da posição",
      "reversed": true ou false,
      "message": "Duas frases poéticas sobre esta carta nesta posição."
    }
  ],
  "synthesis": "Três frases unindo toda a leitura com profundidade oracular."
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
      temperature: 0.92,
      max_tokens: 800,
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq error: ${response.status}`);
  }

  const data = await response.json();
  let text = data.choices[0].message.content.trim();
  text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

  const json = JSON.parse(text);

  return {
    cards: json.cards,
    synthesis: json.synthesis,
    generatedAt: new Date().toISOString(),
  };
}

export async function POST(request: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: 'API key não configurada.' }, { status: 500 });
  }

  try {
    const body = (await request.json()) as TarotRequest;

    if (!body.question || body.question.trim().length < 3) {
      return NextResponse.json({ error: 'Pergunta inválida.' }, { status: 400 });
    }

    const spread = [1, 3, 5].includes(body.spread) ? body.spread : 1;
    const reading = await generateTarotReading(body.question.trim(), spread);

    return NextResponse.json(reading, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[/api/tarot] Error:', error);
    return NextResponse.json(
      { error: 'Erro interno ao consultar o oráculo.' },
      { status: 500 },
    );
  }
}

export function GET() {
  return NextResponse.json({ error: 'Use POST.' }, { status: 405 });
}
