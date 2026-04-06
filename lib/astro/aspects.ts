// ─────────────────────────────────────────────────────────────────────────────
// lib/astro/aspects.ts
// Aspect detection between planets.
// ─────────────────────────────────────────────────────────────────────────────

import type { Planet, Aspect, AspectType } from './types';
import { angularDiff } from './math';

const ASPECT_DEFINITIONS: ReadonlyArray<{
  type: AspectType;
  angle: number;
  orb: number;
  colour: string;
}> = [
  { type: 'conjunction', angle: 0,   orb: 8, colour: 'rgba(245,200,66,0.28)'  },
  { type: 'sextile',     angle: 60,  orb: 6, colour: 'rgba(80,200,120,0.22)'  },
  { type: 'square',      angle: 90,  orb: 8, colour: 'rgba(220,80,80,0.22)'   },
  { type: 'trine',       angle: 120, orb: 8, colour: 'rgba(80,130,220,0.24)'  },
  { type: 'opposition',  angle: 180, orb: 8, colour: 'rgba(200,80,80,0.22)'   },
];

/** Compute all major aspects between a set of planets. */
export function computeAspects(planets: Planet[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const diff = angularDiff(planets[i].lon, planets[j].lon);
      for (const def of ASPECT_DEFINITIONS) {
        if (Math.abs(diff - def.angle) <= def.orb) {
          aspects.push({
            planet1: planets[i].name,
            planet2: planets[j].name,
            type:    def.type,
            angle:   def.angle,
            orb:     Math.abs(diff - def.angle),
            colour:  def.colour,
          });
          break; // only the tightest aspect per pair
        }
      }
    }
  }

  return aspects;
}

/** Compute major aspects between two sets of planets (Synastry). */
export function computeSynastryAspects(planets1: Planet[], planets2: Planet[]): Aspect[] {
  const aspects: Aspect[] = [];

  for (const p1 of planets1) {
    for (const p2 of planets2) {
      const diff = angularDiff(p1.lon, p2.lon);
      for (const def of ASPECT_DEFINITIONS) {
        if (Math.abs(diff - def.angle) <= def.orb) {
          aspects.push({
            planet1: p1.name,
            planet2: p2.name,
            type:    def.type,
            angle:   def.angle,
            orb:     Math.abs(diff - def.angle),
            colour:  def.colour,
          });
          break;
        }
      }
    }
  }

  return aspects;
}
