import type { AstralChart, Aspect } from './types';
import { computeSynastryAspects } from './aspects';

export interface SynastryResult {
  chart1: AstralChart;
  chart2: AstralChart;
  aspects: Aspect[];
}

/**
 * Compare two Astral Charts for Synastry.
 * Computes planetary inter-aspects between person A and person B.
 */
export function compareCharts(chart1: AstralChart, chart2: AstralChart): SynastryResult {
  const aspects = computeSynastryAspects(chart1.planets, chart2.planets);
  
  return {
    chart1,
    chart2,
    aspects: aspects.sort((a, b) => a.orb - b.orb), // Tightest aspects first
  };
}
