'use client';

import { useState, useCallback } from 'react';
import type { AstralChart } from '@/lib/astro/types';
import { signOf, formatBirthDate } from '@/lib/astro/chart';
import { buildShareUrl } from '@/lib/hooks/usePersistedChart';
import AstralChartSVG from './AstralChart';
import PlanetList from './PlanetList';
import Interpretation from './Interpretation';

interface ChartSectionProps {
  chart: AstralChart;
  onReset: () => void;
}

export default function ChartSection({ chart, onReset }: ChartSectionProps) {
  const { birthData } = chart;
  const [copied, setCopied] = useState(false);

  const ascInfo = signOf(chart.ascendant);
  const sunInfo = signOf(chart.planets.find(p => p.name === 'Sol')!.lon);

  const formattedDate = formatBirthDate(
    birthData.year,
    birthData.month,
    birthData.day,
    `${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}`,
  );

  // ── Share via URL ────────────────────────────────────────────────────
  const handleShare = useCallback(async () => {
    const url = buildShareUrl(birthData);
    try {
      await navigator.clipboard.writeText(url);
      // Also update the browser URL so it's shareable from address bar
      window.history.replaceState({}, '', url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback: update URL only
      window.history.replaceState({}, '', url);
    }
  }, [birthData]);

  return (
    <div style={styles.container} className="animate-fade-in">
      {/* Controls row */}
      <div style={styles.controls}>
        <button
          onClick={onReset}
          style={styles.backBtn}
          className="back-btn"
          aria-label="Voltar ao formulário e criar novo mapa"
        >
          ← Novo Mapa
        </button>

        <button
          onClick={handleShare}
          style={styles.shareBtn}
          className="share-btn"
          aria-label="Copiar link para compartilhar este mapa astral"
          title="Copiar link de compartilhamento"
        >
          {copied ? '✓ Link copiado!' : '⤴ Compartilhar'}
        </button>
      </div>

      {/* Summary badges */}
      <div style={styles.badges} className="badges-row">
        <span style={{ ...styles.badge, borderColor: '#f5c842', color: '#f5c842' }}>
          ☉ Sol em {sunInfo.sign.sym} {sunInfo.sign.name}
        </span>
        <span style={{ ...styles.badge, borderColor: '#c9a84c', color: '#c9a84c' }}>
          ⬆ Asc. {ascInfo.sign.sym} {ascInfo.sign.name}
        </span>
      </div>

      {/* Chart layout: SVG + planet list */}
      <div style={styles.chartLayout} className="chart-layout-grid">
        <div style={styles.chartBox}>
          <div style={styles.chartName}>{birthData.name}</div>
          <div style={styles.chartDate}>{formattedDate}</div>
          <AstralChartSVG chart={chart} />
        </div>
        <PlanetList chart={chart} />
      </div>

      <div style={styles.divider} role="separator" />

      <Interpretation chart={chart} />

      <p style={styles.disclaimer}>
        Cálculos baseados em efemérides simplificadas. Para uso reflexivo e esotérico.
      </p>
    </div>
  );
}

const styles = {
  container: {} as React.CSSProperties,

  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap' as const,
  },

  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.72rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'rgba(237,224,200,0.35)',
    cursor: 'pointer',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    background: 'transparent',
    transition: 'all 0.25s',
  } as React.CSSProperties,

  shareBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.72rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase' as const,
    color: 'rgba(237,224,200,0.5)',
    cursor: 'pointer',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    background: 'transparent',
    transition: 'all 0.25s',
    marginLeft: 'auto',
  } as React.CSSProperties,

  badges: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '0.75rem',
    marginBottom: '1.75rem',
  },

  badge: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid',
    background: 'rgba(255,255,255,0.03)',
  } as React.CSSProperties,

  chartLayout: {
    display: 'grid',
    gridTemplateColumns: '500px 1fr',
    gap: '2rem',
    alignItems: 'start',
  } as React.CSSProperties,

  chartBox: {
    background: 'rgba(255,255,255,0.018)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '18px',
    padding: '1.5rem',
    textAlign: 'center' as const,
  },

  chartName: {
    fontFamily: "var(--font-cinzel-decorative, 'Cinzel Decorative', serif)",
    color: '#c9a84c',
    fontSize: '1.3rem',
    marginBottom: '0.3rem',
  },

  chartDate: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.68rem',
    color: 'rgba(237,224,200,0.35)',
    letterSpacing: '0.2em',
    marginBottom: '1rem',
  },

  divider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.15), transparent)',
    margin: '2.5rem 0',
  },

  disclaimer: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.63rem',
    letterSpacing: '0.15em',
    color: 'rgba(237,224,200,0.35)',
    textAlign: 'center' as const,
    margin: '1.5rem 0',
  },
};
