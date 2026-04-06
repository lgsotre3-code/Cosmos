'use client';

import { useMemo } from 'react';
import type { AstralChart } from '@/lib/astro/types';
import { ELEMENT_COLOURS, INTERP_SUN, INTERP_MON, INTERP_ASC } from '@/lib/astro/data';
import { signOf, computeElementalBalance } from '@/lib/astro/chart';

interface InterpretationProps {
  chart: AstralChart;
}

const ELEMENT_LABELS: Record<string, string> = {
  fire: '🔥 Fogo', earth: '🌿 Terra', air: '💨 Ar', water: '💧 Água',
};

export default function Interpretation({ chart }: InterpretationProps) {
  const cards = useMemo(() => {
    const sun  = chart.planets.find(p => p.name === 'Sol')!;
    const moon = chart.planets.find(p => p.name === 'Lua')!;
    const sunInfo  = signOf(sun.lon);
    const moonInfo = signOf(moon.lon);
    const ascInfo  = signOf(chart.ascendant);
    return [
      {
        planet: 'Sol', sym: '☉', label: 'Sua essência e identidade',
        signSym: sunInfo.sign.sym, signName: sunInfo.sign.name,
        elementColor: ELEMENT_COLOURS[sunInfo.sign.el],
        text: INTERP_SUN[sunInfo.sign.name] ?? 'Uma energia em formação.',
      },
      {
        planet: 'Lua', sym: '☽', label: 'Suas emoções e mundo interior',
        signSym: moonInfo.sign.sym, signName: moonInfo.sign.name,
        elementColor: ELEMENT_COLOURS[moonInfo.sign.el],
        text: INTERP_MON[moonInfo.sign.name] ?? 'Uma energia em formação.',
      },
      {
        planet: 'Ascendente', sym: '⬆', label: 'Como o mundo te percebe',
        signSym: ascInfo.sign.sym, signName: ascInfo.sign.name,
        elementColor: ELEMENT_COLOURS[ascInfo.sign.el],
        text: INTERP_ASC[ascInfo.sign.name] ?? 'Uma energia em formação.',
      },
    ];
  }, [chart]);

  const balance = useMemo(() => computeElementalBalance(chart), [chart]);
  const total   = Object.values(balance).reduce((a, b) => a + b, 0);

  return (
    <section aria-label="Interpretações astrológicas">
      <div style={s.grid}>
        {cards.map(card => (
          <article key={card.planet} style={s.card} className="interp-card">
            <h3 style={s.cardTitle}>
              {card.sym}{' '}
              {card.planet} em{' '}
              <span style={{ color: card.elementColor }}>{card.signSym} {card.signName}</span>
            </h3>
            <h4 style={s.cardSubtitle}>{card.label}</h4>
            <p style={s.cardText}>{card.text}</p>
          </article>
        ))}
      </div>

      {/* Elemental balance */}
      <div style={s.balanceCard} aria-label="Equilíbrio elemental">
        <div style={s.balanceTitle}>✦ Equilíbrio Elemental</div>
        <div style={s.balanceGrid}>
          {(Object.entries(balance) as [keyof typeof balance, number][]).map(([el, count]) => (
            <div key={el} style={s.balanceItem}>
              <div style={s.balanceLabel}>{ELEMENT_LABELS[el]}</div>
              <div style={s.barWrap} role="progressbar" aria-valuenow={count} aria-valuemax={total} aria-label={`${ELEMENT_LABELS[el]}: ${count}`}>
                <div style={{ ...s.bar, width: `${(count / total) * 100}%`, background: ELEMENT_COLOURS[el] }} />
              </div>
              <div style={{ ...s.balanceCount, color: ELEMENT_COLOURS[el] }}>{count}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.25rem' } as React.CSSProperties,
  card: {
    background: 'rgba(13,21,53,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '16px', padding: '1.4rem', transition: 'border-color 0.2s, background 0.2s',
  } as React.CSSProperties,
  cardTitle: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    color: '#c9a84c', fontSize: '0.76rem', letterSpacing: '0.2em',
    textTransform: 'uppercase' as const, marginBottom: '0.3rem',
  },
  cardSubtitle: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.64rem', letterSpacing: '0.15em', textTransform: 'uppercase' as const,
    color: 'rgba(237,224,200,0.35)', marginBottom: '0.65rem',
  },
  // CORRIGIDO: removido italic, aumentado tamanho, melhorado contraste e espaçamento
  cardText: {
    fontSize: '1.05rem',
    fontStyle: 'normal' as const,
    fontWeight: 400,
    lineHeight: 1.9,
    color: 'rgba(237,224,200,0.92)',
    letterSpacing: '0.01em',
  },
  balanceCard: {
    background: 'rgba(13,21,53,0.5)', backdropFilter: 'blur(10px)', border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '16px', padding: '1.5rem', marginTop: '1.25rem',
  } as React.CSSProperties,
  balanceTitle: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    color: '#c9a84c', fontSize: '0.72rem', letterSpacing: '0.25em',
    textTransform: 'uppercase' as const, marginBottom: '1rem',
  },
  balanceGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' } as React.CSSProperties,
  balanceItem: { display: 'flex', flexDirection: 'column' as const, gap: '0.35rem' },
  balanceLabel: { fontFamily: "var(--font-cinzel,'Cinzel',serif)", fontSize: '0.68rem', letterSpacing: '0.1em', color: 'rgba(237,224,200,0.55)' },
  barWrap: { height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' } as React.CSSProperties,
  bar: { height: '100%', borderRadius: '2px', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)' } as React.CSSProperties,
  balanceCount: { fontFamily: "var(--font-cinzel,'Cinzel',serif)", fontSize: '0.75rem', fontWeight: 600 },
};

