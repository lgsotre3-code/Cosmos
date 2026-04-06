// ─────────────────────────────────────────────────────────────────────────────
// lib/astro/chart.ts
// High-level chart generation API and sign/element helpers.
// ─────────────────────────────────────────────────────────────────────────────

import type { BirthData, AstralChart, SignPosition, ElementalBalance } from './types';
import { SIGNS, ELEMENT_COLOURS } from './data';
import {
  julianDay, daysFromJ2000, obliquity, lmst,
  computeAscendant, computeMC,
  sunLongitude, moonLongitude, planetLongitude,
} from './math';

/**
 * Resolve which zodiac sign a given ecliptic longitude falls in.
 * Result is pure data — no formatting side-effects.
 */
export function signOf(lon: number): SignPosition {
  // Inline n360 to avoid import cycle risk
  const l = ((lon % 360) + 360) % 360;
  const i   = Math.floor(l / 30);
  const deg = Math.floor(l % 30);
  const min = Math.floor((l % 1) * 60);
  return {
    index: i,
    sign:  SIGNS[i],
    deg,
    min,
    formatted: `${deg}°${String(min).padStart(2, '0')}'`,
  };
}

/**
 * Primary public API: generate a complete astral chart from birth data.
 * Pure function — safe to run in a Web Worker.
 */
export function generateAstralChart(birth: BirthData): AstralChart {
  const JD   = julianDay(birth.year, birth.month, birth.day, birth.hour, birth.minute, birth.tz);
  const N    = daysFromJ2000(JD);
  const obl  = obliquity(N);
  const LMST = lmst(JD, birth.lon);
  const asc  = computeAscendant(LMST, birth.lat, obl);
  const mc   = computeMC(asc);

  return {
    birthData: birth,
    JD,
    N,
    obliquity: obl,
    ascendant: asc,
    mc,
    planets: [
      { name: 'Sol',      sym: '☉', lon: sunLongitude(N),                       col: '#f5c842' },
      { name: 'Lua',      sym: '☽', lon: moonLongitude(N),                      col: '#c8d4e8' },
      { name: 'Mercúrio', sym: '☿', lon: planetLongitude(N, 252.251, 4.09233),  col: '#b0a870' },
      { name: 'Vênus',    sym: '♀', lon: planetLongitude(N, 181.980, 1.60213),  col: '#e89abe' },
      { name: 'Marte',    sym: '♂', lon: planetLongitude(N, 355.433, 0.52402),  col: '#e05040' },
      { name: 'Júpiter',  sym: '♃', lon: planetLongitude(N, 34.351,  0.08309),  col: '#d4a870' },
      { name: 'Saturno',  sym: '♄', lon: planetLongitude(N, 50.077,  0.03344),  col: '#a09870' },
      { name: 'Urano',    sym: '♅', lon: planetLongitude(N, 314.055, 0.01172),  col: '#70d4e0' },
      { name: 'Netuno',   sym: '♆', lon: planetLongitude(N, 304.349, 0.00598),  col: '#6090e0' },
      { name: 'Plutão',   sym: '♇', lon: planetLongitude(N, 238.929, 0.00397),  col: '#a070c8' },
    ],
  };
}

/** Count how many planets (including ASC) fall in each element. */
export function computeElementalBalance(chart: AstralChart): ElementalBalance {
  const balance: ElementalBalance = { fire: 0, earth: 0, air: 0, water: 0 };
  const lons = [...chart.planets.map(p => p.lon), chart.ascendant];
  for (const lon of lons) {
    balance[signOf(lon).sign.el]++;
  }
  return balance;
}

// Re-export colours so consumers don't need to import from data.ts
export { ELEMENT_COLOURS };

// ── Date Formatting ────────────────────────────────────────────────────────

const MONTHS_PT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export function formatBirthDate(year: number, month: number, day: number, time: string): string {
  return `${String(day).padStart(2, '0')} ${MONTHS_PT[month - 1]} ${year} · ${time}`;
}

// ── URL serialisation (for sharing) ───────────────────────────────────────

/** Encode BirthData into a URL query string. */
export function birthDataToParams(b: BirthData): URLSearchParams {
  return new URLSearchParams({
    name: b.name,
    y: String(b.year),
    mo: String(b.month),
    d: String(b.day),
    h: String(b.hour),
    mi: String(b.minute),
    lat: String(b.lat),
    lon: String(b.lon),
    tz: String(b.tz),
  });
}

/** Parse URLSearchParams back into BirthData. Returns null if params are invalid. */
export function birthDataFromParams(p: URLSearchParams): BirthData | null {
  try {
    const name = p.get('name') ?? 'Anônimo';
    const year = parseInt(p.get('y') ?? '', 10);
    const month = parseInt(p.get('mo') ?? '', 10);
    const day = parseInt(p.get('d') ?? '', 10);
    const hour = parseInt(p.get('h') ?? '', 10);
    const minute = parseInt(p.get('mi') ?? '', 10);
    const lat = parseFloat(p.get('lat') ?? '');
    const lon = parseFloat(p.get('lon') ?? '');
    const tz = parseFloat(p.get('tz') ?? '');

    if ([year, month, day, hour, minute, lat, lon, tz].some(isNaN)) return null;
    return { name, year, month, day, hour, minute, lat, lon, tz };
  } catch {
    return null;
  }
}
