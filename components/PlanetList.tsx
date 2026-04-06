'use client';

import { useMemo } from 'react';
import type { AstralChart } from '@/lib/astro/types';
import { ELEMENT_COLOURS } from '@/lib/astro/data';
import { signOf } from '@/lib/astro/chart';

interface PlanetListProps {
  chart: AstralChart;
}

export default function PlanetList({ chart }: PlanetListProps) {
  const rows = useMemo(() => {
    const { planets, ascendant } = chart;
    const ascInfo = signOf(ascendant);

    return [
      {
        sym: 'AC', name: 'Ascendente',
        signSym: ascInfo.sign.sym, signName: ascInfo.sign.name,
        position: ascInfo.formatted,
        color: '#c9a84c',
        elementColor: ELEMENT_COLOURS[ascInfo.sign.el],
      },
      ...planets.map(p => {
        const info = signOf(p.lon);
        return {
          sym: p.sym, name: p.name,
          signSym: info.sign.sym, signName: info.sign.name,
          position: info.formatted,
          color: p.col,
          elementColor: ELEMENT_COLOURS[info.sign.el],
        };
      }),
    ];
  }, [chart]);

  return (
    <div style={s.container}>
      <div style={s.title} aria-hidden="true">✦ Posições Planetárias</div>
      <ul role="list" style={{ listStyle: 'none', padding: 0 }}>
        {rows.map(row => (
          <li
            key={row.name}
            role="listitem"
            style={s.row}
            className="planet-row"
            aria-label={`${row.name}: ${row.signName} ${row.position}`}
          >
            <span style={{ ...s.symbol, color: row.color }} aria-hidden="true">{row.sym}</span>
            <div style={s.info}>
              <div style={s.planetName}>{row.name}</div>
              <div style={s.position}>
                <span style={{ color: row.elementColor }}>{row.signSym} {row.signName}</span>
                &nbsp; {row.position}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

const s = {
  container: { flex: '1' } as React.CSSProperties,
  title: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.7rem', letterSpacing: '0.28em', textTransform: 'uppercase' as const,
    color: '#c9a84c', borderBottom: '1px solid rgba(201,168,76,0.15)',
    paddingBottom: '0.5rem', marginBottom: '0.8rem',
  },
  row: {
    display: 'flex', alignItems: 'center', gap: '0.75rem',
    padding: '0.55rem 0.65rem', borderRadius: '8px',
    border: '1px solid transparent', transition: 'all 0.2s',
    marginBottom: '0.3rem', cursor: 'default',
  } as React.CSSProperties,
  symbol: { fontSize: '1.25rem', width: '26px', textAlign: 'center' as const, flexShrink: 0 },
  info: { display: 'flex', flexDirection: 'column' as const, gap: '0.06rem' },
  planetName: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.76rem', color: '#ede0c8', letterSpacing: '0.04em',
  },
  position: { fontSize: '0.88rem', color: 'rgba(237,224,200,0.5)', marginTop: '0.06rem' },
};
