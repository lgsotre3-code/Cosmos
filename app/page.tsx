'use client';

import { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import type { AppState, BirthData } from '@/lib/astro/types';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import { useChartWorker } from '@/lib/workers/useChartWorker';
import { usePersistedChart, parseBirthFromUrl } from '@/lib/hooks/usePersistedChart';
import { createBrowserClient } from '@supabase/ssr'

const ChartSection = lazy(() => import('@/components/ChartSection'));

export default function HomePage() {
  const [state, setState] = useState<AppState>({ status: 'idle' });
  const calculateChart = useChartWorker();
  const { save, load, clear } = usePersistedChart();
  
  // Instancia o supabase fora do corpo principal se possível, ou garante que ele seja o mesmo
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // FIX: handleLogout mais robusto para Next.js 14/15
  const handleLogout = async () => {
    // 1. Limpa a sessao no Supabase (limpa cookies no navegador)
    await supabase.auth.signOut();
    
    // 2. Limpa dados locais (mapas salvos no localStorage se houver)
    clear(); 
    
    // 3. Força um reload completo para a tela de login
    // Usar window.location.href garante que o middleware re-valide a sessao do zero
    window.location.href = '/login';
  }

  useEffect(() => {
    const fromUrl = parseBirthFromUrl(window.location.search);
    if (fromUrl) {
      runCalculation(fromUrl);
      return;
    }
    const saved = load();
    if (saved) {
      setState({ status: 'success', chart: saved });
    }
  }, [load]);

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
        <header style={styles.header} role="banner">
          <h1 style={styles.h1}>✦ Cosmos ✦</h1>
          <p style={styles.tagline}>Mapa Astral Natal</p>
          <button onClick={handleLogout} style={styles.logoutButton}>Sair da Conta</button>
        </header>

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

function ChartSkeleton() {
  return (
    <div style={skeletonStyles.wrapper} aria-label="Carregando mapa astral..." aria-live="polite" aria-busy="true">
      <div style={skeletonStyles.circle} />
      <div style={skeletonStyles.lines}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} style={{ ...skeletonStyles.line, width: `${60 + i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  wrap: { position: 'relative' as const, zIndex: 1, maxWidth: '1140px', margin: '0 auto', padding: '72px 1.5rem 1.5rem' },
  header: { textAlign: 'center' as const, padding: '3rem 0 2rem' },
  h1: { fontFamily: "var(--font-cinzel-decorative, 'Cinzel Decorative', serif)", fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: '#c9a84c', textShadow: '0 0 60px rgba(201,168,76,0.4)', letterSpacing: '0.08em', marginBottom: '0.5rem' },
  tagline: { fontFamily: "var(--font-cinzel, 'Cinzel', serif)", fontSize: '0.8rem', color: 'rgba(237,224,200,0.35)', letterSpacing: '0.38em', textTransform: 'uppercase' as const },
  logoutButton: { marginTop: '1rem', padding: '0.5rem 1.25rem', borderRadius: '6px', background: 'rgba(220,80,80,0.05)', border: '1px solid rgba(220,80,80,0.2)', color: 'rgba(220,80,80,0.7)', fontFamily: "var(--font-cinzel, 'Cinzel', serif)", fontSize: '0.7rem', letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s' },
  footer: { textAlign: 'center' as const, padding: '2.5rem', fontFamily: "var(--font-cinzel, 'Cinzel', serif)", fontSize: '0.64rem', letterSpacing: '0.22em', color: 'rgba(237,224,200,0.35)' },
  errorBanner: { maxWidth: '600px', margin: '1rem auto', padding: '0.85rem 1.25rem', borderRadius: '8px', background: 'rgba(220,80,80,0.08)', border: '1px solid rgba(220,80,80,0.25)', color: '#e07070', fontFamily: "var(--font-cinzel, 'Cinzel', serif)", fontSize: '0.8rem', letterSpacing: '0.1em', textAlign: 'center' as const },
};

const skeletonStyles = {
  wrapper: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '2rem', padding: '4rem 0', opacity: 0.5 },
  circle: { width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.1)' },
  lines: { display: 'flex', flexDirection: 'column' as const, gap: '0.75rem', width: '100%', maxWidth: '400px' },
  line: { height: '12px', background: 'rgba(201,168,76,0.06)', borderRadius: '6px' },
};