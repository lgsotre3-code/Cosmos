import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: 'IA desconfigurada (chave faltando).' }, { status: 500 });

  try {
    const { question, spread } = await request.json();
    const positionsList = { 1: ['A Essência'], 3: ['Passado', 'Presente', 'Futuro'], 5: ['Situação', 'Desafio', 'Inconsciente', 'Conselho', 'Desfecho'] };
    const positions = positionsList[spread as 1|3|5] || ['A Essência'];

    const prompt = `Você é o Oráculo das Estrelas. Realize uma leitura de Tarot para: "${question}". Tiragem: ${positions.join(', ')}. Responda APENAS em JSON com os campos: cards (array de {name, arcana, position, reversed, message}) e synthesis (String). Duas frases místicas por message. Tres para synthesis.`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'system', content: 'Você é um oráculo de tarot místico e responde apenas com JSON válido.' }, { role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return NextResponse.json({ error: `Groq error: ${res.status}`, details: errorData }, { status: res.status });
    }

    const data = await res.json();
    const content = JSON.parse(data.choices[0].message.content);
    return NextResponse.json({ ...content, generatedAt: new Date().toISOString() }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'O oráculo falhou.', details: err.message }, { status: 500 });
  }
}