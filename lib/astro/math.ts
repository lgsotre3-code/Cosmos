// ─────────────────────────────────────────────────────────────────────────────
// lib/astro/math.ts
// Pure mathematical and astronomical calculation helpers.
// All functions are deterministic, side-effect free, and unit-testable.
// ─────────────────────────────────────────────────────────────────────────────

export const D2R = Math.PI / 180;
export const R2D = 180 / Math.PI;

/** Normalise any angle to [0, 360) */
export function n360(a: number): number {
  return ((a % 360) + 360) % 360;
}

/** Angular difference, always ≤ 180° */
export function angularDiff(a: number, b: number): number {
  const diff = Math.abs(n360(a - b));
  return Math.min(diff, 360 - diff);
}

/**
 * Compute Julian Day Number.
 * Handles the Julian/Gregorian calendar transition automatically.
 */
export function julianDay(
  y: number, mo: number, d: number,
  h: number, mi: number, tz: number,
): number {
  const ut = h + mi / 60 - tz;
  const D = d + ut / 24;
  let Y = y, M = mo;
  if (M <= 2) { Y--; M += 12; }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return (
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    D + B - 1524.5
  );
}

/** Days since J2000.0 */
export function daysFromJ2000(JD: number): number {
  return JD - 2451545.0;
}

/** Mean obliquity of the ecliptic (degrees) */
export function obliquity(N: number): number {
  return 23.439 - 0.0000004 * N;
}

/** Greenwich Mean Sidereal Time (degrees) */
export function gmst(JD: number): number {
  return n360(280.46061837 + 360.98564736629 * (JD - 2451545));
}

/** Local Mean Sidereal Time (degrees) */
export function lmst(JD: number, lonDeg: number): number {
  return n360(gmst(JD) + lonDeg);
}

/** Sun's ecliptic longitude (low-precision, < 1° error) */
export function sunLongitude(N: number): number {
  const L = n360(280.460 + 0.9856474 * N);
  const g = n360(357.528 + 0.9856003 * N) * D2R;
  return n360(L + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g));
}

/** Moon's ecliptic longitude */
export function moonLongitude(N: number): number {
  const L0 = n360(218.316 + 13.176396 * N);
  const M  = n360(134.963 + 13.064993 * N) * D2R;
  const F  = n360(93.272  + 13.229350 * N) * D2R;
  return n360(L0 + 6.289 * Math.sin(M) - 1.274 * Math.sin(M - 2 * F) + 0.658 * Math.sin(2 * F));
}

/** Generic mean-motion planet longitude */
export function planetLongitude(N: number, L0: number, rate: number): number {
  return n360(L0 + rate * N);
}

/**
 * Compute the Ascendant (ecliptic longitude of the eastern horizon).
 */
export function computeAscendant(lmstDeg: number, latDeg: number, oblDeg: number): number {
  const L   = lmstDeg * D2R;
  const phi = latDeg  * D2R;
  const e   = oblDeg  * D2R;
  return n360(
    Math.atan2(
      -Math.cos(L),
      Math.sin(L) * Math.cos(e) + Math.tan(phi) * Math.sin(e),
    ) * R2D,
  );
}

/** Compute the Midheaven (MC). Simple equal-house: MC = ASC + 270. */
export function computeMC(asc: number): number {
  return n360(asc + 270);
}
