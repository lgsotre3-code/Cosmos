'use client';
import { useState } from 'react';

export default function TarotPage() {
  const [question, setQuestion] = useState('');
  const [spread, setSpread] = useState<1 | 3 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<any>(null);
  const [error, setError] = useState('');

  const handleConsult = async () => {
    if (!question.trim()) return;
    setLoading(true); setReading(null); setError('');
    try {
      const res = await fetch('/api/tarot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, spread }) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Erro na consulta');
      }
      setReading(await res.json());
    } catch (err: any) { setError(`O oráculo está em silêncio. (${err.message})`); } finally { setLoading(false); }
  };

  return (
    <main className="animate-fade-in" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '120px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 className="glow-gold" style={{ fontSize: 'clamp(2.5rem, 8vw, 4.5rem)', fontFamily: "var(--font-cinzel-decorative)", color: 'var(--gold)', letterSpacing: '0.1em' }}>Tarot</h1>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: '0.9rem', color: 'var(--text-faint)', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: '1rem' }}>✦ O Oráculo das Estrelas ✦</p>
      </header>

      <div className="glass-card" style={{ width: '100%', maxWidth: 640, padding: '3rem', boxShadow: '0 0 100px rgba(0,0,0,0.5)', background: 'rgba(13,21,53,0.4)', borderRadius: '24px', border: '1px solid rgba(201,168,76,0.15)' }}>
        <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.2em', color: 'var(--gold-dim)', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: 'var(--font-cinzel)' }}>Sua Questão ao Universo</label>
        <textarea 
          value={question} onChange={e => setQuestion(e.target.value)} 
          placeholder="O que você deseja saber?" rows={3} 
          className="cosmos-input" 
          style={{ fontSize: '1.2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}
        />
        <div style={{ display: 'flex', gap: '1rem', marginTop: 32, marginBottom: 32 }}>
          {[1, 3, 5].map(v => (
            <button key={v} onClick={() => setSpread(v as any)} style={{ 
              flex: 1, padding: '14px', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.3s',
              background: spread === v ? 'rgba(201,168,76,0.18)' : 'transparent', 
              border: spread === v ? '1px solid var(--gold)' : '1px solid rgba(201,168,76,0.2)',
              color: spread === v ? 'var(--gold)' : 'rgba(237,224,200,0.4)',
              fontFamily: 'var(--font-cinzel)', fontSize: '0.75rem', letterSpacing: '0.1em'
            }}>{v} Cartas</button>
          ))}
        </div>
        <button onClick={handleConsult} disabled={loading} className="btn-primary" style={{ 
          width: '100%', padding: '1.25rem', background: 'var(--gold)', color: '#04050f', border: 'none', borderRadius: '12px', 
          fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.2em', fontFamily: 'var(--font-cinzel)'
        }}>{loading ? 'CONSULTANDO...' : 'REVELAR AS CARTAS'}</button>
        {error && <p style={{ marginTop: 24, color: '#ff7070', textAlign: 'center', fontSize: '0.85rem' }}>⚠ {error}</p>}
      </div>

      {reading && (
        <section className="animate-card" style={{ marginTop: 80, width: '100%', maxWidth: 1140 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {reading.cards.map((c: any, i: number) => (
              <div key={i} className="glass-card animate-fade-up" style={{ padding: '3rem 2rem', textAlign: 'center', animationDelay: `${i * 0.15}s` }}>
                <div style={{ color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '1.5rem', textShadow: '0 0 20px rgba(201,168,76,0.3)' }}>✦</div>
                <h3 style={{ color: 'var(--gold)', fontSize: '1.25rem', fontFamily: 'var(--font-cinzel)', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>{c.name}</h3>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-faint)', textTransform: 'uppercase', letterSpacing: '0.25em', marginBottom: '1.5rem' }}>{c.position}</div>
                <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'var(--text-dim)', fontStyle: 'italic' }}>"{c.message}"</p>
              </div>
            ))}
          </div>
          <div className="glass-card animate-fade-in" style={{ marginTop: 48, padding: '4rem', textAlign: 'center', background: 'linear-gradient(rgba(13,21,53,0.6), rgba(4,5,15,0.8))' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--gold)', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: 'var(--font-cinzel)' }}>Síntese do Oráculo</div>
            <p style={{ fontSize: '1.3rem', lineHeight: 1.9, color: 'var(--text)', fontFamily: 'var(--font-garamond)', maxWidth: 720, margin: '0 auto' }}>{reading.synthesis}</p>
          </div>
        </section>
      )}
    </main>
  );
}