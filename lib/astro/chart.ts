// ─────────────────────────────────────────────────────────────────────────────
// lib/astro/chart.ts
// ─────────────────────────────────────────────────────────────────────────────
import type { BirthData, AstralChart, SignPosition, ElementalBalance, House } from './types';
import { SIGNS, ELEMENT_COLOURS } from './data';
import {
  julianDay, daysFromJ2000, obliquity, lmst,
  computeAscendant, computeMC,
  sunLongitude, moonLongitude, planetLongitude,
} from './math';

export function signOf(lon: number): SignPosition {
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

export function generateAstralChart(birth: BirthData): AstralChart {
  const JD   = julianDay(birth.year, birth.month, birth.day, birth.hour, birth.minute, birth.tz);
  const N    = daysFromJ2000(JD);
  const obl  = obliquity(N);
  const LMST = lmst(JD, birth.lon);
  const asc  = computeAscendant(LMST, birth.lat, obl);
  const mc   = computeMC(asc);

  // Whole Sign House System: A casa 1 e o signo do Ascendente inteiro.
  const ascSignIndex = Math.floor(asc / 30);
  const houses: House[] = Array.from({ length: 12 }, (_, i) => {
    const signIndex = (ascSignIndex + i) % 12;
    return { number: i + 1, sign: SIGNS[signIndex] };
  });

  return {
    birthData: birth,
    JD, N, obliquity: obl, ascendant: asc, mc,
    houses,
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

export function computeElementalBalance(chart: AstralChart): ElementalBalance {
  const balance: ElementalBalance = { fire: 0, earth: 0, air: 0, water: 0 };
  const lons = [...chart.planets.map(p => p.lon), chart.ascendant];
  lons.forEach(lon => { balance[signOf(lon).sign.el]++; });
  return balance;
}

export function formatBirthDate(year: number, month: number, day: number, time: string): string {
  const months = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${String(day).padStart(2, '0')} ${months[month - 1]} ${year} · ${time}`;
}