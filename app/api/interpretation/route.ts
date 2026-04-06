import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AstralChart } from '@/lib/astro/types';
import { signOf } from '@/lib/astro/chart';

export interface InterpretationRequest {
  chart: AstralChart;
}

export interface InterpretationResponse {
  summary: string;
  career: string;
  love: string;
  spiritual: string;
  generatedAt?: string;
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '');

async function generateInterpretation(chart: AstralChart): Promise<InterpretationResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
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
    - O tom DEVE ser místico, poético e ancestral.
    - Responda EXCLUSIVAMENTE em formato JSON no esquema abaixo.
    - O idioma deve ser Português Brasileiro (PT-BR).
    
    Schema da Resposta:
    {
      "summary": "2 a 3 frases místicas",
      "career": "2 a 3 frases místicas",
      "love": "2 a 3 frases místicas",
      "spiritual": "2 a 3 frases místicas"
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

export async function POST(request: NextRequest) {
  if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: 'Chave de API do oráculo não configurada no servidor.' },
      { status: 500 }
    );
  }

  try {
    const { chart } = (await request.json()) as InterpretationRequest;

    if (!chart) {
      return NextResponse.json(
        { error: 'Dados do mapa (chart) são obrigatórios.' },
        { status: 400 }
      );
    }

    const interpretation = await generateInterpretation(chart);

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
  return NextResponse.json(
    { error: 'Método não permitido. Use POST.' },
    { status: 405 }
  );
}
