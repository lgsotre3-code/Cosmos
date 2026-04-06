'use client';

import { useMemo, useState, useCallback } from 'react';
import type { AstralChart, Planet } from '@/lib/astro/types';
import { SIGNS, ELEMENT_COLOURS } from '@/lib/astro/data';
import { computeAspects } from '@/lib/astro/aspects';
import { n360, D2R } from '@/lib/astro/math';
import { signOf } from '@/lib/astro/chart';

interface AstralChartProps {
  chart: AstralChart;
}

// ── SVG constants ──────────────────────────────────────────────────────────
const CX = 400, CY = 400;
const Rout = 372, Rzo = 356, Rzi = 296, Rhi = 238, Rpr = 210, Rasp = 178;

// coord() is a pure function — extracted so it can be reused without re-creating.
// No .toFixed() needed: SVG path numbers can be raw floats.
function coord(lon: number, r: number, asc: number) {
  const ang = (180 - (lon - asc)) * D2R;
  return {
    x: CX + r * Math.cos(ang),
    y: CY - r * Math.sin(ang),
  };
}

// Spread planets that are too close to avoid overlap
function spreadPlanetLons(planets: Planet[]): Map<string, number> {
  const placed: number[] = [];
  const result = new Map<string, number>();
  for (const p of planets) {
    let l = p.lon;
    for (let t = 0; t < 20; t++) {
      const tooClose = placed.some(pp => Math.abs(n360(l - pp + 180) - 180) < 14);
      if (!tooClose) break;
      l = n360(l + 15);
    }
    placed.push(l);
    result.set(p.name, l);
  }
  return result;
}

// ── Tooltip ────────────────────────────────────────────────────────────────
interface TooltipState {
  planet: Planet;
  svgX: number;
  svgY: number;
}

function PlanetTooltip({ tip, asc }: { tip: TooltipState; asc: number }) {
  const info = signOf(tip.planet.lon);
  // Place tooltip above or below the symbol depending on vertical position
  const above = tip.svgY > CY;
  const ty = above ? tip.svgY - 56 : tip.svgY + 22;

  return (
    <g role="tooltip" aria-label={`${tip.planet.name}: ${info.sign.sym} ${info.sign.name} ${info.formatted}`}>
      <rect
        x={tip.svgX - 62} y={ty - 14}
        width={124} height={40}
        rx={8}
        fill="#0b0e24"
        stroke={tip.planet.col}
        strokeOpacity={0.6}
        strokeWidth={1}
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.6))' }}
      />
      <text
        x={tip.svgX} y={ty + 2}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={12}
        fill={tip.planet.col}
        fontFamily="var(--font-cinzel,'Cinzel',serif)"
        fontWeight={600}
        style={{ animation: 'tooltipIn 0.15s ease both' }}
      >
        {tip.planet.sym} {tip.planet.name}
      </text>
      <text
        x={tip.svgX} y={ty + 18}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={10.5}
        fill={ELEMENT_COLOURS[info.sign.el]}
        fontFamily="serif"
      >
        {info.sign.sym} {info.sign.name} {info.formatted}
      </text>
    </g>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────

function Defs() {
  return (
    <defs>
      <radialGradient id="bg-g" cx="50%" cy="50%" r="50%">
        <stop offset="0%"   stopColor="#0d1535" />
        <stop offset="100%" stopColor="#04050f" />
      </radialGradient>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function ZodiacRing({ asc }: { asc: number }) {
  // Pre-compute all 12 paths once — coord() is pure, result is stable
  const segments = useMemo(() =>
    SIGNS.map((sign, i) => {
      const lon0 = i * 30, lon1 = lon0 + 30;
      const p0o = coord(lon0, Rzo, asc), p1o = coord(lon1, Rzo, asc);
      const p0i = coord(lon0, Rzi, asc), p1i = coord(lon1, Rzi, asc);
      const mp  = coord(lon0 + 15, (Rzo + Rzi) / 2, asc);
      const col = ELEMENT_COLOURS[sign.el];
      const d = [
        `M${p0i.x},${p0i.y}`,
        `L${p0o.x},${p0o.y}`,
        `A${Rzo},${Rzo} 0 0,0 ${p1o.x},${p1o.y}`,
        `L${p1i.x},${p1i.y}`,
        `A${Rzi},${Rzi} 0 0,1 ${p0i.x},${p0i.y}Z`,
      ].join(' ');
      return { sign, col, d, mp, p0i, p0o };
    }),
  [asc]);

  return (
    <g aria-label="Anel zodiacal">
      {segments.map(({ sign, col, d, mp, p0i, p0o }) => (
        <g key={sign.name}>
          <path d={d} fill={col} fillOpacity={0.10} stroke={col} strokeOpacity={0.35} strokeWidth={0.6} />
          <line x1={p0i.x} y1={p0i.y} x2={p0o.x} y2={p0o.y} stroke={col} strokeOpacity={0.5} strokeWidth={0.7} />
          <text
            x={mp.x} y={mp.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={18} fill={col} fontFamily="serif" opacity={0.88}
            aria-label={sign.name}
          >
            {sign.sym}
          </text>
        </g>
      ))}
    </g>
  );
}

function HouseRing({ asc }: { asc: number }) {
  const houses = useMemo(() =>
    Array.from({ length: 12 }, (_, h) => {
      const lon = asc + h * 30;
      return {
        h,
        p1: coord(lon, Rhi, asc),
        p2: coord(lon, Rzi, asc),
        numP: coord(lon + 15, (Rhi + Rzi) / 2 - 2, asc),
        isAngular: h % 3 === 0,
      };
    }),
  [asc]);

  return (
    <g>
      <circle cx={CX} cy={CY} r={Rzi} fill="none" stroke="rgba(201,168,76,0.14)" strokeWidth={1} />
      <circle cx={CX} cy={CY} r={Rhi} fill="none" stroke="rgba(201,168,76,0.10)" strokeWidth={0.8} />
      {houses.map(({ h, p1, p2, numP, isAngular }) => (
        <g key={h}>
          <line
            x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
            stroke={isAngular ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.18)'}
            strokeWidth={isAngular ? 1.5 : 0.7}
          />
          <text
            x={numP.x} y={numP.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={11} fill="rgba(201,168,76,0.48)"
            fontFamily="var(--font-cinzel,'Cinzel',serif)"
          >
            {h + 1}
          </text>
        </g>
      ))}
    </g>
  );
}

function AspectLines({ planets, asc }: { planets: Planet[]; asc: number }) {
  const aspects = useMemo(() => computeAspects(planets), [planets]);
  const lines = useMemo(() =>
    aspects.map((aspect, i) => {
      const p1 = planets.find(p => p.name === aspect.planet1)!;
      const p2 = planets.find(p => p.name === aspect.planet2)!;
      return { key: i, c1: coord(p1.lon, Rasp, asc), c2: coord(p2.lon, Rasp, asc), colour: aspect.colour };
    }),
  [aspects, planets, asc]);

  return (
    <g aria-label="Linhas de aspecto">
      {lines.map(({ key, c1, c2, colour }) => (
        <line key={key} x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y} stroke={colour} strokeWidth={1.1} />
      ))}
    </g>
  );
}

function AngularAxes({ asc }: { asc: number }) {
  const pts = useMemo(() => ({
    asc: coord(asc,       Rhi - 4, asc),
    dsc: coord(asc + 180, Rhi - 4, asc),
    mc:  coord(asc + 270, Rhi - 4, asc),
    ic:  coord(asc + 90,  Rhi - 4, asc),
    ascL: coord(asc,       Rhi + 18, asc),
    dscL: coord(asc + 180, Rhi + 18, asc),
    mcL:  coord(asc + 270, Rhi + 18, asc),
    icL:  coord(asc + 90,  Rhi + 18, asc),
  }), [asc]);

  const labelStyle = {
    fontSize: 10, fill: '#c9a84c',
    fontFamily: "var(--font-cinzel,'Cinzel',serif)", fontWeight: 600,
  };

  return (
    <g>
      <line x1={pts.asc.x} y1={pts.asc.y} x2={pts.dsc.x} y2={pts.dsc.y} stroke="rgba(201,168,76,0.35)" strokeWidth={0.8} strokeDasharray="3,3" />
      <line x1={pts.mc.x}  y1={pts.mc.y}  x2={pts.ic.x}  y2={pts.ic.y}  stroke="rgba(201,168,76,0.35)" strokeWidth={0.8} strokeDasharray="3,3" />
      {([['AC', pts.ascL], ['DC', pts.dscL], ['MC', pts.mcL], ['IC', pts.icL]] as const).map(([label, p]) => (
        <text key={label} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" {...labelStyle}>{label}</text>
      ))}
    </g>
  );
}

function PlanetSymbols({
  planets, asc, onHover, onLeave,
}: {
  planets: Planet[];
  asc: number;
  onHover: (planet: Planet, svgX: number, svgY: number) => void;
  onLeave: () => void;
}) {
  const spreadMap = useMemo(() => spreadPlanetLons(planets), [planets]);

  const items = useMemo(() =>
    planets.map(p => {
      const adjLon    = spreadMap.get(p.name) ?? p.lon;
      const dotP      = coord(p.lon,   Rhi - 5,  asc);
      const symP      = coord(adjLon,  Rpr,       asc);
      const lineStart = coord(p.lon,   Rhi - 10,  asc);
      return { p, dotP, symP, lineStart };
    }),
  [planets, spreadMap, asc]);

  return (
    <g>
      {items.map(({ p, dotP, symP, lineStart }) => (
        <g
          key={p.name}
          style={{ cursor: 'pointer' }}
          onMouseEnter={() => onHover(p, symP.x, symP.y)}
          onMouseLeave={onLeave}
          onFocus={() => onHover(p, symP.x, symP.y)}
          onBlur={onLeave}
          tabIndex={0}
          role="img"
          aria-label={`${p.name}: posição ${p.lon.toFixed(1)}°`}
        >
          <circle cx={dotP.x} cy={dotP.y} r={2.8} fill={p.col} opacity={0.85} />
          <line
            x1={lineStart.x} y1={lineStart.y} x2={symP.x} y2={symP.y}
            stroke={p.col} strokeOpacity={0.35} strokeWidth={0.8}
          />
          {/* Hover target (larger invisible circle) */}
          <circle cx={symP.x} cy={symP.y} r={18} fill="transparent" />
          {/* Symbol bg */}
          <circle cx={symP.x} cy={symP.y} r={15} fill="#0b0e24" stroke={p.col} strokeOpacity={0.55} strokeWidth={1} />
          {/* Symbol */}
          <text
            x={symP.x} y={symP.y}
            textAnchor="middle" dominantBaseline="middle"
            fontSize={14} fill={p.col} fontFamily="serif"
          >
            {p.sym}
          </text>
        </g>
      ))}
    </g>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AstralChartSVG({ chart }: AstralChartProps) {
  const { ascendant: asc, planets } = chart;
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const handleHover = useCallback((planet: Planet, svgX: number, svgY: number) => {
    setTooltip({ planet, svgX, svgY });
  }, []);

  const handleLeave = useCallback(() => setTooltip(null), []);

  const sunInfo  = useMemo(() => signOf(planets.find(p => p.name === 'Sol')!.lon), [planets]);
  const ascInfo  = useMemo(() => signOf(asc), [asc]);

  return (
    <div style={styles.wrapper}>
      <svg
        viewBox="0 0 800 800"
        style={styles.svg}
        role="img"
        aria-labelledby="chart-title chart-desc"
      >
        {/* Accessibility: title + description */}
        <title id="chart-title">
          Mapa Astral de {chart.birthData.name}
        </title>
        <desc id="chart-desc">
          Sol em {sunInfo.sign.name}, Ascendente em {ascInfo.sign.name}.
          Mapa astral natal com posições planetárias e aspectos.
        </desc>

        <Defs />

        {/* Background */}
        <circle cx={CX} cy={CY} r={Rout} fill="url(#bg-g)" stroke="rgba(201,168,76,0.25)" strokeWidth={1.5} />

        <ZodiacRing asc={asc} />
        <HouseRing  asc={asc} />

        {/* Inner dark fill */}
        <circle cx={CX} cy={CY} r={Rhi - 1} fill="#070a1c" />

        <AspectLines planets={planets} asc={asc} />
        <AngularAxes asc={asc} />

        <PlanetSymbols
          planets={planets}
          asc={asc}
          onHover={handleHover}
          onLeave={handleLeave}
        />

        {/* Tooltip — rendered last so it's on top */}
        {tooltip && <PlanetTooltip tip={tooltip} asc={asc} />}

        {/* Centre ornament */}
        <circle cx={CX} cy={CY} r={22} fill="none" stroke="rgba(201,168,76,0.2)"  strokeWidth={1} />
        <circle cx={CX} cy={CY} r={14} fill="none" stroke="rgba(201,168,76,0.12)" strokeWidth={0.7} />
        <text x={CX} y={CY} textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="rgba(201,168,76,0.55)" fontFamily="serif">✦</text>
      </svg>
    </div>
  );
}

const styles = {
  wrapper: { textAlign: 'center' as const },
  svg: { width: '100%', maxWidth: '470px', height: 'auto', display: 'block', margin: '0 auto' },
};
