import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const key = process.env.GROQ_API_KEY;
  if (!key) return NextResponse.json({ error: 'IA desconfigurada.' }, { status: 500 });

  try {
    const { sign, name } = await request.json();
    const prompt = `Gere o horóscopo diário para ${sign}${name ? ` (usuário: ${name})` : ''}. Responda APENAS em JSON com os campos: geral, amor, trabalho, energia, conselho. Duas frases místicas por campo.`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{ role: 'system', content: 'Você é um oráculo e responde apenas em JSON.' }, { role: 'user', content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.8,
      }),
    });

    if (!res.ok) return NextResponse.json({ error: 'Erro na conexão com o oráculo.' }, { status: res.status });

    const data = await res.json();
    const result = JSON.parse(data.choices[0].message.content);
    return NextResponse.json({ ...result, sign, date: new Date().toLocaleDateString('pt-BR') }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Falha ao ler os astros.' }, { status: 500 });
  }
}