// ─────────────────────────────────────────────────────────────────────────────
// lib/astro/types.ts
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

export interface House {
  number: number;
  sign: ZodiacSign;
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
  tz: number;
}

export interface AstralChart {
  birthData: BirthData;
  JD: number;
  N: number;
  obliquity: number;
  ascendant: number;
  mc: number;
  planets: Planet[];
  houses: House[];
}

export interface Aspect {
  planet1: string;
  planet2: string;
  type: AspectType;
  orb: number;
  angle: number;
  colour: string;
}

export interface SynastryAspect extends Aspect {
  planet1: string; // From Person A
  planet2: string; // From Person B
}

export interface City {
  n: string;
  lat: number | null;
  lon: number | null;
  tz: number | null;
}

export interface ElementalBalance {
  fire: number; earth: number; air: number; water: number;
}

export type AppState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; chart: AstralChart }
  | { status: 'error'; message: string };

export type WorkerRequest = { type: 'GENERATE_CHART'; payload: BirthData; };
export type WorkerResponse =
  | { type: 'CHART_SUCCESS'; payload: AstralChart }
  | { type: 'CHART_ERROR'; payload: string };