'use client';

import { useState, useCallback, useEffect } from 'react';
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

interface AIInterpretation {
  summary: string;
  career: string;
  love: string;
  spiritual: string;
  generatedAt: string;
}

// ── AI Interpretation hook ─────────────────────────────────────────────────
function useAIInterpretation(chart: AstralChart) {
  const [ai, setAi] = useState<AIInterpretation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch('/api/interpretation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chart }),
    })
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.error) setError(data.error);
        else setAi(data as AIInterpretation);
      })
      .catch(() => {
        if (!cancelled) setError('O oráculo está em silêncio. Tente novamente.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [chart]);

  return { ai, loading, error };
}

// ── Shimmer loading card ───────────────────────────────────────────────────
function ShimmerCard() {
  return (
    <div style={s.shimmerCard}>
      <div style={s.shimmerLine1} />
      <div style={s.shimmerLine2} />
      <div style={s.shimmerLine3} />
    </div>
  );
}

// ── AI interpretation section ──────────────────────────────────────────────
function AISection({ chart }: { chart: AstralChart }) {
  const { ai, loading, error } = useAIInterpretation(chart);

  if (loading) {
    return (
      <div>
        <div style={s.aiHeader}>
          <span style={s.aiOrb}>✦</span>
          <span style={s.aiTitle}>O Oráculo Consulta as Estrelas…</span>
        </div>
        <div style={s.aiGrid}>
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
          <ShimmerCard />
        </div>
      </div>
    );
  }

  if (error || !ai) {
    return (
      <div style={s.errorBox}>
        <span style={{ fontSize: '1.3rem' }}>⚠</span>
        <span>{error ?? 'Não foi possível obter a interpretação.'}</span>
      </div>
    );
  }

  const sections = [
    { icon: '✦', label: 'Essência da Alma', text: ai.summary, accent: '#c9a84c' },
    { icon: '⚷', label: 'Vocação & Propósito', text: ai.career,  accent: '#7eb8d4' },
    { icon: '♡', label: 'Amor & União',       text: ai.love,    accent: '#d47eb8' },
    { icon: '☽', label: 'Jornada Espiritual', text: ai.spiritual, accent: '#9b7ed4' },
  ];

  return (
    <div>
      <div style={s.aiHeader}>
        <span style={s.aiOrb}>✦</span>
        <div>
          <div style={s.aiTitle}>Leitura do Oráculo</div>
          <div style={s.aiSubtitle}>Interpretação gerada pelos astros · IA Mística</div>
        </div>
      </div>

      <div style={s.aiGrid}>
        {sections.map(sec => (
          <div key={sec.label} style={{ ...s.aiCard, borderColor: `${sec.accent}22` }}>
            <div style={{ ...s.aiCardHeader, color: sec.accent }}>
              <span style={s.aiCardIcon}>{sec.icon}</span>
              <span style={s.aiCardLabel}>{sec.label}</span>
            </div>
            <p style={s.aiCardText}>{sec.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function ChartSection({ chart, onReset }: ChartSectionProps) {
  const { birthData } = chart;
  const [copied, setCopied] = useState(false);

  const ascInfo = signOf(chart.ascendant);
  const sunInfo = signOf(chart.planets.find(p => p.name === 'Sol')!.lon);
  const moonInfo = signOf(chart.planets.find(p => p.name === 'Lua')!.lon);

  const formattedDate = formatBirthDate(
    birthData.year,
    birthData.month,
    birthData.day,
    `${String(birthData.hour).padStart(2, '0')}:${String(birthData.minute).padStart(2, '0')}`,
  );

  const handleShare = useCallback(async () => {
    const url = buildShareUrl(birthData);
    try {
      await navigator.clipboard.writeText(url);
      window.history.replaceState({}, '', url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      window.history.replaceState({}, '', url);
    }
  }, [birthData]);

  return (
    <div style={s.container} className="animate-fade-in">

      {/* Controls */}
      <div style={s.controls}>
        <button onClick={onReset} style={s.backBtn} aria-label="Novo mapa">
          ← Novo Mapa
        </button>
        <button onClick={handleShare} style={s.shareBtn} aria-label="Compartilhar">
          {copied ? '✓ Copiado!' : '⤴ Compartilhar'}
        </button>
      </div>

      {/* Hero badges */}
      <div style={s.badges}>
        <span style={{ ...s.badge, borderColor: '#f5c84288', color: '#f5c842' }}>
          ☉ Sol em {sunInfo.sign.sym} {sunInfo.sign.name}
        </span>
        <span style={{ ...s.badge, borderColor: '#c8d4e888', color: '#c8d4e8' }}>
          ☽ Lua em {moonInfo.sign.sym} {moonInfo.sign.name}
        </span>
        <span style={{ ...s.badge, borderColor: '#c9a84c88', color: '#c9a84c' }}>
          ⬆ Asc. {ascInfo.sign.sym} {ascInfo.sign.name}
        </span>
      </div>

      {/* Chart + planets */}
      <div style={s.chartLayout} className="chart-layout-grid">
        <div style={s.chartBox}>
          <div style={s.chartName}>{birthData.name}</div>
          <div style={s.chartDate}>{formattedDate}</div>
          <AstralChartSVG chart={chart} />
        </div>
        <PlanetList chart={chart} />
      </div>

      {/* Divider */}
      <div style={s.divider} role="separator" />

      {/* Static elemental interpretation */}
      <Interpretation chart={chart} />

      {/* Divider */}
      <div style={s.divider} role="separator" />

      {/* AI Oracle interpretation */}
      <AISection chart={chart} />

      <p style={s.disclaimer}>
        Cálculos baseados em efemérides simplificadas · Interpretações geradas por IA · Uso reflexivo e esotérico
      </p>
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  container: {},

  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
  },

  backBtn: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.72rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(237,224,200,0.35)',
    cursor: 'pointer',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    background: 'transparent',
    transition: 'all 0.25s',
  },

  shareBtn: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.72rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: 'rgba(237,224,200,0.5)',
    cursor: 'pointer',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    background: 'transparent',
    transition: 'all 0.25s',
    marginLeft: 'auto',
  },

  badges: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '1.75rem',
  },

  badge: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.7rem',
    letterSpacing: '0.15em',
    padding: '0.35rem 0.85rem',
    borderRadius: '20px',
    border: '1px solid',
    background: 'rgba(255,255,255,0.03)',
  },

  chartLayout: {
    display: 'grid',
    gridTemplateColumns: '500px 1fr',
    gap: '2rem',
    alignItems: 'start',
  },

  chartBox: {
    background: 'rgba(255,255,255,0.018)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '18px',
    padding: '1.5rem',
    textAlign: 'center',
  },

  chartName: {
    fontFamily: "var(--font-cinzel-decorative,'Cinzel Decorative',serif)",
    color: '#c9a84c',
    fontSize: '1.3rem',
    marginBottom: '0.3rem',
  },

  chartDate: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
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

  // ── AI section ───────────────────────────────────────────────────────────

  aiHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.5rem',
  },

  aiOrb: {
    fontSize: '1.6rem',
    color: '#c9a84c',
    textShadow: '0 0 20px rgba(201,168,76,0.6)',
    flexShrink: 0,
  },

  aiTitle: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.8rem',
    letterSpacing: '0.25em',
    textTransform: 'uppercase',
    color: '#c9a84c',
  },

  aiSubtitle: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.62rem',
    letterSpacing: '0.15em',
    color: 'rgba(237,224,200,0.3)',
    marginTop: '0.25rem',
  },

  aiGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.25rem',
  },

  aiCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid',
    borderRadius: '14px',
    padding: '1.5rem',
    transition: 'background 0.2s',
  },

  aiCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.85rem',
  },

  aiCardIcon: {
    fontSize: '1rem',
  },

  aiCardLabel: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.68rem',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
  },

  aiCardText: {
    fontSize: '1rem',
    lineHeight: 1.85,
    color: 'rgba(237,224,200,0.88)',
    fontWeight: 400,
    letterSpacing: '0.01em',
  },

  // ── Shimmer ──────────────────────────────────────────────────────────────

  shimmerCard: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(201,168,76,0.08)',
    borderRadius: '14px',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },

  shimmerLine1: {
    height: '12px',
    width: '45%',
    borderRadius: '6px',
    background: 'rgba(201,168,76,0.08)',
    animation: 'pulse-gold 1.8s ease-in-out infinite',
  },

  shimmerLine2: {
    height: '10px',
    width: '90%',
    borderRadius: '6px',
    background: 'rgba(201,168,76,0.05)',
    animation: 'pulse-gold 1.8s ease-in-out infinite 0.2s',
  },

  shimmerLine3: {
    height: '10px',
    width: '75%',
    borderRadius: '6px',
    background: 'rgba(201,168,76,0.05)',
    animation: 'pulse-gold 1.8s ease-in-out infinite 0.4s',
  },

  // ── Error ────────────────────────────────────────────────────────────────

  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem 1.25rem',
    borderRadius: '10px',
    background: 'rgba(220,80,80,0.06)',
    border: '1px solid rgba(220,80,80,0.2)',
    color: '#e07070',
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.82rem',
    letterSpacing: '0.08em',
  },

  disclaimer: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.63rem',
    letterSpacing: '0.15em',
    color: 'rgba(237,224,200,0.25)',
    textAlign: 'center',
    margin: '1.5rem 0',
  },
};
