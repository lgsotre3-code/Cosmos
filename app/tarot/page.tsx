'use client';
import { useState } from 'react';
import Link from 'next/link';

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
      if (!res.ok) throw new Error();
      setReading(await res.json());
    } catch { setError('O oráculo está em silêncio. Tente novamente.'); } finally { setLoading(false); }
  };

  return (
    <main className="animate-fade-in" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '72px 20px 80px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 className="glow-gold" style={{ fontSize: 'clamp(36px, 8vw, 64px)', fontFamily: "var(--font-cinzel)", color: 'var(--gold)' }}>Tarot</h1>
      </header>

      <div className="glass-card" style={{ width: '100%', maxWidth: 560, padding: 32 }}>
        <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Sua pergunta ao oráculo..." rows={3} className="cosmos-input" />
        <div style={{ display: 'flex', gap: 8, marginTop: 20, marginBottom: 24 }}>
          {[1, 3, 5].map(v => <button key={v} onClick={() => setSpread(v as any)} style={{ flex: 1, padding: 12, background: spread === v ? 'rgba(201,168,76,0.15)' : 'transparent', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 8, color: 'var(--gold)', cursor: 'pointer' }}>{v} Cartas</button>)}
        </div>
        <button onClick={handleConsult} disabled={loading} style={{ width: '100%', padding: 16, background: 'var(--gold)', color: '#04050f', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>{loading ? 'Consultando...' : 'Revelar as Cartas'}</button>
        {error && <p style={{ marginTop: 16, color: '#ff7070', textAlign: 'center' }}>{error}</p>}
      </div>

      {reading && (
        <div className="animate-card" style={{ marginTop: 48, width: '100%', maxWidth: 860 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center' }}>
            {reading.cards.map((c: any, i: number) => (
              <div key={i} className="glass-card" style={{ flex: 1, minWidth: 200, padding: 24, textAlign: 'center' }}>
                <div style={{ fontSize: 42, marginBottom: 12 }}>✦</div>
                <div style={{ color: 'var(--gold)', fontWeight: 700 }}>{c.name}</div>
                <div style={{ fontSize: 10, opacity: 0.5, textTransform: 'uppercase' }}>{c.position}</div>
                <p style={{ marginTop: 12, fontSize: 14, opacity: 0.8 }}>{c.message}</p>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ marginTop: 32, padding: 32, textAlign: 'center' }}>
            <p style={{ fontStyle: 'italic', opacity: 0.9 }}>{reading.synthesis}</p>
          </div>
        </div>
      )}
    </main>
  );
}