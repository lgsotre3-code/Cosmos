// ─────────────────────────────────────────────────────────────────────────────
// lib/hooks/usePersistedChart.ts
// Persist/restore the last chart and birth data across page reloads.
// Uses localStorage with a try/catch guard (private browsing, quota errors).
// ─────────────────────────────────────────────────────────────────────────────

'use client';

import { useCallback } from 'react';
import type { AstralChart, BirthData } from '../astro/types';

const STORAGE_KEY = 'cosmos:lastChart';

interface Persisted {
  chart: AstralChart;
  savedAt: number; // Unix ms — could be used to show "X hours ago"
}

export function usePersistedChart() {
  const save = useCallback((chart: AstralChart) => {
    try {
      const data: Persisted = { chart, savedAt: Date.now() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Quota exceeded or private mode — fail silently
    }
  }, []);

  const load = useCallback((): AstralChart | null => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed: Persisted = JSON.parse(raw);
      // Basic shape validation
      if (!parsed?.chart?.planets || !parsed?.chart?.birthData) return null;
      return parsed.chart;
    } catch {
      return null;
    }
  }, []);

  const clear = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { save, load, clear };
}

// ── URL sharing helpers ────────────────────────────────────────────────────

/** Build a shareable URL for the given birth data. Works in browser only. */
export function buildShareUrl(birth: BirthData): string {
  const params = new URLSearchParams({
    name: birth.name,
    y:  String(birth.year),
    mo: String(birth.month),
    d:  String(birth.day),
    h:  String(birth.hour),
    mi: String(birth.minute),
    lat: String(birth.lat),
    lon: String(birth.lon),
    tz:  String(birth.tz),
  });
  return `${window.location.origin}${window.location.pathname}?${params}`;
}

/** Parse BirthData from current URL search params. Returns null if invalid. */
export function parseBirthFromUrl(search: string): BirthData | null {
  try {
    const p = new URLSearchParams(search);
    const name   = p.get('name') ?? '';
    const year   = parseInt(p.get('y')   ?? '', 10);
    const month  = parseInt(p.get('mo')  ?? '', 10);
    const day    = parseInt(p.get('d')   ?? '', 10);
    const hour   = parseInt(p.get('h')   ?? '', 10);
    const minute = parseInt(p.get('mi')  ?? '', 10);
    const lat    = parseFloat(p.get('lat') ?? '');
    const lon    = parseFloat(p.get('lon') ?? '');
    const tz     = parseFloat(p.get('tz')  ?? '');
    if ([year, month, day, hour, minute, lat, lon, tz].some(isNaN)) return null;
    return { name, year, month, day, hour, minute, lat, lon, tz };
  } catch {
    return null;
  }
}
