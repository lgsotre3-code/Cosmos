// ─────────────────────────────────────────────────────────────────────────────
// lib/astro/types.ts
// Single source of truth for all astrological types.
// ─────────────────────────────────────────────────────────────────────────────

export type Element = 'fire' | 'earth' | 'air' | 'water';
export type Modality = 'cardinal' | 'fixed' | 'mutable';
export type AspectType = 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition';

export interface ZodiacSign {
  name: string;
  sym: string;
  el: Element;
  modality: Modality;
  ruler: string;
}

export interface Planet {
  name: string;
  sym: string;
  lon: number;
  col: string;
}

export interface SignPosition {
  index: number;
  sign: ZodiacSign;
  deg: number;
  min: number;
  formatted: string;
}

export interface BirthData {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  lat: number;
  lon: number;
  /** Timezone offset in hours, e.g. -3 for BRT */
  tz: number;
}

export interface AstralChart {
  birthData: BirthData;
  JD: number;
  N: number;
  obliquity: number;
  ascendant: number;
  planets: Planet[];
  mc: number;
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: AspectType;
  orb: number;
  angle: number;
  colour: string;
}

export interface City {
  n: string;
  lat: number | null;
  lon: number | null;
  tz: number | null;
}

export interface ElementalBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

// ── Type-safe State Machine ────────────────────────────────────────────────
// Replaces the fragile (appState + chart + isLoading) trio.
// Impossible states (e.g. chart=null while appState='chart') are eliminated
// at the type level.

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; chart: AstralChart }
  | { status: 'error'; message: string };

// ── Worker message contracts ───────────────────────────────────────────────

export type WorkerRequest = {
  type: 'GENERATE_CHART';
  payload: BirthData;
};

export type WorkerResponse =
  | { type: 'CHART_SUCCESS'; payload: AstralChart }
  | { type: 'CHART_ERROR'; payload: string };
