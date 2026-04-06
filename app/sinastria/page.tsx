'use client';

import { useState, useCallback } from 'react';
import type { AppState, BirthData, AstralChart } from '@/lib/astro/types';
import { useChartWorker } from '@/lib/workers/useChartWorker';
import StarField from '@/components/StarField';
import BirthForm from '@/components/BirthForm';
import { compareCharts, type SynastryResult } from '@/lib/astro/synastry';

export default function SynastryPage() {
  const [person1, setPerson1] = useState<AstralChart | null>(null);
  const [person2, setPerson2] = useState<AstralChart | null>(null);
  const [loading, setLoading] = useState(false);
  const [interpretation, setInterpretation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const calculateChart = useChartWorker();

  const handleCalculate = async (data1: BirthData, data2: BirthData) => {
    setLoading(true);
    setError(null);
    try {
      const chart1 = await calculateChart(data1);
      const chart2 = await calculateChart(data2);
      
      const result = compareCharts(chart1, chart2);
      
      // Call AI interpretation
      const res = await fetch('/api/synastry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result }),
      });
      
      if (!res.ok) throw new Error('Erro ao interpretar sinastria.');
      
      const interpretationData = await res.json();
      
      setPerson1(chart1);
      setPerson2(chart2);
      setInterpretation(interpretationData);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StarField />
      <div style={s.wrap}>
        <header style={s.header}>
          <h1 style={s.h1}>♾ Sinastria ♾</h1>
          <p style={s.tagline}>A Dança das Almas no Cosmo</p>
        </header>

        <main>
          {!interpretation ? (
            <SinastriaForm onSubmit={handleCalculate} isLoading={loading} />
          ) : (
            <div style={s.resultWrap}>
               <section style={s.aiSection}>
                  <h2 style={s.sectionTitle}>✧ Oráculo de Sinastria ✧</h2>
                  <div style={s.interpretationGrid}>
                    <div style={s.aiCard}>
                      <span style={s.aiLabel}>A Essência da União</span>
                      <p style={s.aiText}>{interpretation.summary}</p>
                    </div>
                    <div style={s.aiCard}>
                      <span style={s.aiLabel}>Fluxo Amoroso</span>
                      <p style={s.aiText}>{interpretation.romantic}</p>
                    </div>
                    <div style={s.aiCard}>
                      <span style={s.aiLabel}>Desafio Cármico</span>
                      <p style={s.aiText}>{interpretation.challenge}</p>
                    </div>
                    <div style={s.aiCard}>
                      <span style={s.aiLabel}>Síntese Oracular</span>
                      <p style={s.aiText}>{interpretation.synthesis}</p>
                    </div>
                  </div>
               </section>
               
               <button onClick={() => setInterpretation(null)} style={s.resetBtn}>Nova Consulta</button>
            </div>
          )}
          
          {error && <p style={s.error}>{error}</p>}
        </main>
      </div>
    </>
  );
}

function SinastriaForm({ onSubmit, isLoading }: { onSubmit: (d1: BirthData, d2: BirthData) => void, isLoading: boolean }) {
  const [data1, setData1] = useState<BirthData | null>(null);
  const [data2, setData2] = useState<BirthData | null>(null);

  const handleSubmit = () => {
    if (data1 && data2) {
      onSubmit(data1, data2);
    }
  };

  return (
    <div style={s.dualForm}>
      <div style={s.formColumn}>
        <h3 style={s.columnTitle}>Pessoa A</h3>
        <BirthForm onSubmit={setData1} isLoading={false} />
        {data1 && <p style={s.ready}>✓ Dados confirmados</p>}
      </div>
      
      <div style={s.formColumn}>
        <h3 style={s.columnTitle}>Pessoa B</h3>
        <BirthForm onSubmit={setData2} isLoading={false} />
        {data2 && <p style={s.ready}>✓ Dados confirmados</p>}
      </div>

      <div style={s.submitSection}>
        <button 
          onClick={handleSubmit} 
          disabled={!data1 || !data2 || isLoading}
          style={{...s.mainBtn, opacity: (!data1 || !data2 || isLoading) ? 0.5 : 1}}
        >
          {isLoading ? 'Lendo as Estrelas...' : 'Calcular Compatibilidade'}
        </button>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrap: { position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', padding: '100px 1.5rem 4rem' },
  header: { textAlign: 'center', marginBottom: '4rem' },
  h1: { fontFamily: "var(--font-cinzel-decorative, serif)", fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#c9a84c', letterSpacing: '0.1em' },
  tagline: { fontFamily: "var(--font-cinzel, serif)", color: 'rgba(237,224,200,0.4)', textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '0.8rem' },
  
  dualForm: { display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' },
  formColumn: { flex: '1', minWidth: '320px', maxWidth: '500px' },
  columnTitle: { textAlign: 'center', color: '#c9a84c', fontFamily: "var(--font-cinzel, serif)", marginBottom: '1.5rem', letterSpacing: '0.2em' },
  ready: { textAlign: 'center', color: '#80ff80', fontSize: '0.8rem', marginTop: '1rem' },
  
  submitSection: { width: '100%', display: 'flex', justifyContent: 'center', marginTop: '2rem' },
  mainBtn: { 
    background: 'linear-gradient(135deg, #d4b060 0%, #8a6428 100%)',
    border: 'none', borderRadius: '12px', padding: '1.2rem 3rem',
    color: '#02030e', fontFamily: "var(--font-cinzel, serif)", fontWeight: 700,
    fontSize: '1rem', letterSpacing: '0.2em', cursor: 'pointer', textTransform: 'uppercase'
  },
  
  resultWrap: { maxWidth: '900px', margin: '0 auto' },
  aiSection: { background: 'rgba(8,10,28,0.7)', backdropFilter: 'blur(20px)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '24px', padding: '3rem' },
  sectionTitle: { textAlign: 'center', color: '#c9a84c', fontSize: '1.4rem', marginBottom: '3rem', fontFamily: "var(--font-cinzel, serif)", letterSpacing: '0.3em' },
  interpretationGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2.5rem' },
  aiCard: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  aiLabel: { color: 'rgba(201,168,76,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: "var(--font-cinzel, serif)" },
  aiText: { color: '#ede0c8', fontSize: '1.1rem', lineHeight: '1.6', fontFamily: "var(--font-garamond, serif)", fontStyle: 'italic' },
  
  resetBtn: { display: 'block', margin: '3rem auto 0', background: 'transparent', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', padding: '0.8rem 1.8rem', borderRadius: '8px', cursor: 'pointer' },
  error: { textAlign: 'center', color: '#ff7070', marginTop: '2rem' }
};
