'use client';

import { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import type { AppState, BirthData } from '@/lib/astro/types';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import { useChartWorker } from '@/lib/workers/useChartWorker';
import { usePersistedChart, parseBirthFromUrl } from '@/lib/hooks/usePersistedChart';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const ChartSection = lazy(() => import('@/components/ChartSection'));

// ── Page ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [state, setState] = useState<AppState>({ status: 'idle' });
  const calculateChart    = useChartWorker();
  const { save, load, clear } = usePersistedChart();
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push('/login')
    })
  }, [])

  // ── Restore from URL params OR localStorage on mount ──────────────────
  useEffect(() => {
    // URL share link takes priority
    const fromUrl = parseBirthFromUrl(window.location.search);
    if (fromUrl) {
      runCalculation(fromUrl);
      return;
    }
    // Restore last session from localStorage
    const saved = load();
    if (saved) {
      setState({ status: 'success', chart: saved });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Core calculation (runs in Web Worker) ─────────────────────────────
  const runCalculation = useCallback(async (birth: BirthData) => {
    setState({ status: 'loading' });
    try {
      const chart = await calculateChart(birth);
      save(chart);
      setState({ status: 'success', chart });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao calcular o mapa astral.';
      setState({ status: 'error', message });
    }
  }, [calculateChart, save]);

  const handleFormSubmit = useCallback((birth: BirthData) => {
    // Clear URL params so the new chart doesn't collide with a shared link
    window.history.replaceState({}, '', window.location.pathname);
    runCalculation(birth);
  }, [runCalculation]);

  const handleReset = useCallback(() => {
    clear();
    setState({ status: 'idle' });
    window.history.replaceState({}, '', window.location.pathname);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [clear]);

  return (
    <>
      <StarField />

      <div style={styles.wrap}>
        {/* Header */}
        <header style={styles.header} role="banner">
          <h1 style={styles.h1}>✦ Cosmos ✦</h1>
          <p style={styles.tagline}>Mapa Astral Natal</p>
        </header>

        {/* Main — driven by the state machine */}
        <main>
          {(state.status === 'idle' || state.status === 'loading' || state.status === 'error') && (
            <BirthForm
              onSubmit={handleFormSubmit}
              isLoading={state.status === 'loading'}
            />
          )}

          {state.status === 'error' && (
            <p role="alert" style={styles.errorBanner}>
              ⚠ {state.message}
            </p>
          )}

          {state.status === 'success' && (
            <Suspense fallback={<ChartSkeleton />}>
              <ChartSection chart={state.chart} onReset={handleReset} />
            </Suspense>
          )}
        </main>

        <footer style={styles.footer} role="contentinfo">
          ✦ Cosmos — Mapa Astral &nbsp;·&nbsp; Feito com luz e código ✦
        </footer>
      </div>
    </>
  );
}

// ── Loading skeleton ───────────────────────────────────────────────────────
function ChartSkeleton() {
  return (
    <div
      style={skeletonStyles.wrapper}
      aria-label="Carregando mapa astral..."
      aria-live="polite"
      aria-busy="true"
    >
      <div style={skeletonStyles.circle} />
      <div style={skeletonStyles.lines}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ ...skeletonStyles.line, width: `${60 + i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const styles = {
  wrap: {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '1140px',
    margin: '0 auto',
    padding: '72px 1.5rem 1.5rem',
  },
  header: {
    textAlign: 'center' as const,
    padding: '3rem 0 2rem',
  },
  h1: {
    fontFamily: "var(--font-cinzel-decorative, 'Cinzel Decorative', serif)",
    fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
    color: '#c9a84c',
    textShadow: '0 0 60px rgba(201,168,76,0.4), 0 0 120px rgba(201,168,76,0.15)',
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  tagline: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.8rem',
    color: 'rgba(237,224,200,0.35)',
    letterSpacing: '0.38em',
    textTransform: 'uppercase' as const,
  },
  footer: {
    textAlign: 'center' as const,
    padding: '2.5rem',
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.64rem',
    letterSpacing: '0.22em',
    color: 'rgba(237,224,200,0.35)',
  },
  errorBanner: {
    maxWidth: '600px',
    margin: '1rem auto',
    padding: '0.85rem 1.25rem',
    borderRadius: '8px',
    background: 'rgba(220,80,80,0.08)',
    border: '1px solid rgba(220,80,80,0.25)',
    color: '#e07070',
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.8rem',
    letterSpacing: '0.1em',
    textAlign: 'center' as const,
  },
};

const skeletonStyles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2rem',
    padding: '4rem 0',
    opacity: 0.5,
  },
  circle: {
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'rgba(201,168,76,0.06)',
    border: '1px solid rgba(201,168,76,0.1)',
    animation: 'pulse-gold 2s ease-in-out infinite',
  },
  lines: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
    width: '100%',
    maxWidth: '400px',
  },
  line: {
    height: '12px',
    background: 'rgba(201,168,76,0.06)',
    borderRadius: '6px',
    animation: 'pulse-gold 2s ease-in-out infinite',
  },
};
