// ─────────────────────────────────────────────────────────────────────────────
// lib/astro/data.ts
// All static lookup tables: signs, cities, element colours, interpretations.
// Kept separate so they can be tree-shaken when only types/math are needed.
// ─────────────────────────────────────────────────────────────────────────────

import type { ZodiacSign, City, Element } from './types';

export const SIGNS: ZodiacSign[] = [
  { name: 'Áries',       sym: '♈', el: 'fire',  modality: 'cardinal', ruler: 'Marte'    },
  { name: 'Touro',       sym: '♉', el: 'earth', modality: 'fixed',    ruler: 'Vênus'    },
  { name: 'Gêmeos',      sym: '♊', el: 'air',   modality: 'mutable',  ruler: 'Mercúrio' },
  { name: 'Câncer',      sym: '♋', el: 'water', modality: 'cardinal', ruler: 'Lua'      },
  { name: 'Leão',        sym: '♌', el: 'fire',  modality: 'fixed',    ruler: 'Sol'      },
  { name: 'Virgem',      sym: '♍', el: 'earth', modality: 'mutable',  ruler: 'Mercúrio' },
  { name: 'Libra',       sym: '♎', el: 'air',   modality: 'cardinal', ruler: 'Vênus'    },
  { name: 'Escorpião',   sym: '♏', el: 'water', modality: 'fixed',    ruler: 'Plutão'   },
  { name: 'Sagitário',   sym: '♐', el: 'fire',  modality: 'mutable',  ruler: 'Júpiter'  },
  { name: 'Capricórnio', sym: '♑', el: 'earth', modality: 'cardinal', ruler: 'Saturno'  },
  { name: 'Aquário',     sym: '♒', el: 'air',   modality: 'fixed',    ruler: 'Urano'    },
  { name: 'Peixes',      sym: '♓', el: 'water', modality: 'mutable',  ruler: 'Netuno'   },
];

export const ELEMENT_COLOURS: Record<Element, string> = {
  fire:  '#d46b3a',
  earth: '#5aaa70',
  air:   '#5b8fcc',
  water: '#8b65b8',
};

export const CITIES: City[] = [
  { n: 'São Paulo, SP',             lat: -23.55, lon: -46.63, tz: -3 },
  { n: 'Rio de Janeiro, RJ',        lat: -22.91, lon: -43.17, tz: -3 },
  { n: 'Brasília, DF',              lat: -15.78, lon: -47.93, tz: -3 },
  { n: 'Salvador, BA',              lat: -12.97, lon: -38.51, tz: -3 },
  { n: 'Fortaleza, CE',             lat:  -3.72, lon: -38.54, tz: -3 },
  { n: 'Belo Horizonte, MG',        lat: -19.92, lon: -43.94, tz: -3 },
  { n: 'Manaus, AM',                lat:  -3.10, lon: -60.02, tz: -4 },
  { n: 'Porto Alegre, RS',          lat: -30.03, lon: -51.22, tz: -3 },
  { n: 'Recife, PE',                lat:  -8.05, lon: -34.88, tz: -3 },
  { n: 'Belém, PA',                 lat:  -1.46, lon: -48.50, tz: -3 },
  { n: 'Goiânia, GO',               lat: -16.69, lon: -49.26, tz: -3 },
  { n: 'Curitiba, PR',              lat: -25.43, lon: -49.27, tz: -3 },
  { n: 'Maceió, AL',                lat:  -9.67, lon: -35.74, tz: -3 },
  { n: 'Natal, RN',                 lat:  -5.79, lon: -35.21, tz: -3 },
  { n: 'João Pessoa, PB',           lat:  -7.12, lon: -34.88, tz: -3 },
  { n: 'Teresina, PI',              lat:  -5.09, lon: -42.80, tz: -3 },
  { n: 'Campo Grande, MS',          lat: -20.45, lon: -54.62, tz: -4 },
  { n: 'Aracaju, SE',               lat: -10.91, lon: -37.05, tz: -3 },
  { n: 'São Luís, MA',              lat:  -2.53, lon: -44.30, tz: -3 },
  { n: 'Porto Velho, RO',           lat:  -8.76, lon: -63.90, tz: -4 },
  { n: 'Rio Branco, AC',            lat:  -9.97, lon: -67.81, tz: -5 },
  { n: 'Macapá, AP',                lat:   0.04, lon: -51.07, tz: -3 },
  { n: 'Boa Vista, RR',             lat:   2.82, lon: -60.67, tz: -4 },
  { n: 'Palmas, TO',                lat: -10.19, lon: -48.33, tz: -3 },
  { n: 'Florianópolis, SC',         lat: -27.60, lon: -48.55, tz: -3 },
  { n: 'Vitória, ES',               lat: -20.32, lon: -40.34, tz: -3 },
  { n: 'Campinas, SP',              lat: -22.91, lon: -47.06, tz: -3 },
  { n: 'Santos, SP',                lat: -23.96, lon: -46.33, tz: -3 },
  { n: 'Ribeirão Preto, SP',        lat: -21.17, lon: -47.81, tz: -3 },
  { n: 'Lisboa, Portugal',          lat:  38.72, lon:  -9.14, tz:  0 },
  { n: 'Buenos Aires, Argentina',   lat: -34.60, lon: -58.38, tz: -3 },
  { n: 'Nova York, EUA',            lat:  40.71, lon: -74.01, tz: -5 },
  { n: 'Londres, Inglaterra',       lat:  51.51, lon:  -0.13, tz:  0 },
  { n: 'Paris, França',             lat:  48.85, lon:   2.35, tz:  1 },
  { n: 'Tóquio, Japão',             lat:  35.68, lon: 139.69, tz:  9 },
  { n: 'Outra cidade...',           lat: null,   lon: null,   tz: null },
];

export const INTERP_SUN: Record<string, string> = {
  'Áries':       'Pioneirismo, coragem e iniciativa marcam sua essência. Você age antes de pensar, com uma chama que ilumina tudo ao redor.',
  'Touro':       'Determinação, prazer sensorial e amor pela beleza definem seu caminho. Você constrói com paciência o que os outros apenas sonham.',
  'Gêmeos':      'Mente brilhante e inquieta, você conecta ideias e pessoas com facilidade. A versatilidade é seu maior dom e desafio.',
  'Câncer':      'Intuição profunda e amor protetor guiam sua vida. Sua alma é um santuário para os que você escolhe abrigar.',
  'Leão':        'Você nasceu para brilhar. Generosidade, criatividade e um coração solar atraem os outros naturalmente para sua órbita.',
  'Virgem':      'Análise precisa e dedicação ao aperfeiçoamento são seus talentos. Você vê o que outros ignoram e serve com elegância.',
  'Libra':       'Harmonia, beleza e justiça são seus valores centrais. Você pesa cada lado com refinamento antes de decidir.',
  'Escorpião':   'Intensidade, perspicácia e poder de transformação fazem de você um alquimista da alma. Você mergulha onde outros temem.',
  'Sagitário':   'Expansão, filosofia e aventura são sua respiração. Você busca o sentido maior da existência com otimismo contagiante.',
  'Capricórnio': 'Ambição, disciplina e responsabilidade moldam cada passo seu. Você constrói impérios com paciência e determinação de ferro.',
  'Aquário':     'Inovação, humanismo e originalidade definem sua visão. Você enxerga o futuro antes do presente se concretizar.',
  'Peixes':      'Compaixão, espiritualidade e sensibilidade onírica são suas marcas. Você dissolve fronteiras e toca o transcendente.',
};

export const INTERP_MON: Record<string, string> = {
  'Áries':       'Emocionalmente impulsivo e corajoso. Você reage rápido e sente com intensidade ardente.',
  'Touro':       'Precisa de estabilidade e conforto para se sentir seguro. Emoções profundas, sensuais e duradouras.',
  'Gêmeos':      'Mente e emoção se mesclam. Precisa de estímulo intelectual constante para nutrir a alma.',
  'Câncer':      'Lua em casa — extremamente intuitivo, protetor e profundamente ligado às raízes e família.',
  'Leão':        'Coração generoso e necessidade de reconhecimento. Ama com grandiosidade e lealdade regais.',
  'Virgem':      'Emoções processadas pela análise. Cuida dos outros através de atos concretos e atenção ao detalhe.',
  'Libra':       'Busca equilíbrio emocional e harmonia nos relacionamentos. Sensível à injustiça e à discórdia.',
  'Escorpião':   'Emoções intensas e transformadoras. Você sente nas profundezas e perdoa com dificuldade.',
  'Sagitário':   'Otimismo emocional e sede de liberdade. Entedia-se com o rotineiro e busca horizontes novos.',
  'Capricórnio': 'Emoções contidas e maduras. Você sente profundamente mas exibe com cautela e reserva.',
  'Aquário':     'Emoções distanciadas, universais. Você cuida da humanidade antes do indivíduo próximo.',
  'Peixes':      'Ultra-sensível e empático. Absorve as emoções alheias como uma esponja cósmica.',
};

export const INTERP_ASC: Record<string, string> = {
  'Áries':       'Você se apresenta ao mundo com energia direta, iniciativa e uma presença marcante. Primeiro o impulso, depois a reflexão.',
  'Touro':       'Sua presença é sólida, confiável e esteticamente agradável. As pessoas sentem que podem confiar em você.',
  'Gêmeos':      'Você aparece como alguém curioso, comunicativo e jovial. Sua mente rápida é o que as pessoas percebem primeiro.',
  'Câncer':      'Você transmite cuidado, suavidade e uma aura protetora. As pessoas sentem que podem se abrir com você.',
  'Leão':        'Você entra num ambiente e ilumina a sala. Sua presença é magnética, digna e inegavelmente criativa.',
  'Virgem':      'Você aparece como preciso, organizado e atencioso. As pessoas percebem sua competência antes de tudo.',
  'Libra':       'Elegância, charme e equilíbrio são o que o mundo vê em você. Diplomacia como segunda natureza.',
  'Escorpião':   'Intensidade magnética e mistério envolvem sua presença. As pessoas sentem que há muito mais por baixo.',
  'Sagitário':   'Você irradia otimismo, entusiasmo e uma sede por aventura que é absolutamente contagiante.',
  'Capricórnio': 'Seriedade, autoridade e responsabilidade são sua primeira impressão. Você é levado a sério.',
  'Aquário':     'Você parece diferente, original e à frente do seu tempo. Magnetismo de quem pensa fora da caixa.',
  'Peixes':      'Você transmite sensibilidade, empatia e uma aura etérea. As pessoas se sentem compreendidas ao seu lado.',
};
