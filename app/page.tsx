'use client';
import { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import type { AppState, BirthData } from '@/lib/astro/types';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import { useChartWorker } from '@/lib/workers/useChartWorker';
import { usePersistedChart, parseBirthFromUrl } from '@/lib/hooks/usePersistedChart';

const ChartSection = lazy(() => import('@/components/ChartSection'));

export default function HomePage() {
  const [state, setState] = useState<AppState>({ status: 'idle' });
  const calculateChart = useChartWorker();
  const { save, load, clear } = usePersistedChart();

  useEffect(() => {
    const fromUrl = parseBirthFromUrl(window.location.search);
    if (fromUrl) { runCalculation(fromUrl); return; }
    const saved = load();
    if (saved) setState({ status: 'success', chart: saved });
  }, [load]);

  const runCalculation = useCallback(async (birth: BirthData) => {
    setState({ status: 'loading' });
    try {
      const chart = await calculateChart(birth);
      save(chart);
      setState({ status: 'success', chart });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setState({ status: 'error', message: err instanceof Error ? err.message : 'Erro no cálculo.' });
    }
  }, [calculateChart, save]);

  return (
    <>
      <StarField />
      <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1, maxWidth: '1140px', margin: '0 auto', padding: '72px 1.5rem 1.5rem' }}>
        <header style={{ textAlign: 'center', padding: '3rem 0 2rem' }}>
          <h1 className="glow-gold" style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: 'var(--gold)', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>✦ Cosmos ✦</h1>
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: '0.8rem', color: 'var(--text-faint)', letterSpacing: '0.38em', textTransform: 'uppercase' }}>Mapa Astral Natal</p>
          <form action="/auth/signout" method="post" style={{ marginTop: '1.5rem' }}>
            <button type="submit" style={{ padding: '0.6rem 1.4rem', borderRadius: '8px', background: 'rgba(220,80,80,0.1)', border: '1px solid rgba(220,80,80,0.3)', color: '#ff8080', cursor: 'pointer', fontFamily: "var(--font-cinzel)" }}>Sair da Conta</button>
          </form>
        </header>

        <main>
          {(state.status === 'idle' || state.status === 'loading' || state.status === 'error') && (
            <BirthForm onSubmit={runCalculation} isLoading={state.status === 'loading'} />
          )}
          {state.status === 'error' && (
             <p style={{ textAlign: 'center', color: '#ff7070', margin: '2rem 0', fontFamily: 'var(--font-cinzel)' }}>⚠ {state.message}</p>
          )}
          {state.status === 'success' && state.chart && (
            <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem', color: 'var(--gold)' }}>Carregando Mapa...</div>}>
              <ChartSection chart={state.chart} onReset={() => { clear(); setState({status:'idle'}); }} />
            </Suspense>
          )}
        </main>
      </div>
    </>
  );
}