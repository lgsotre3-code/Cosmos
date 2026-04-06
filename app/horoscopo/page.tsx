'use client';
import { useState } from 'react';

const SIGNS = [
  { name: 'Áries', sym: '♈', el: 'fire' }, { name: 'Touro', sym: '♉', el: 'earth' }, { name: 'Gêmeos', sym: '♊', el: 'air' },
  { name: 'Câncer', sym: '♋', el: 'water' }, { name: 'Leão', sym: '♌', el: 'fire' }, { name: 'Virgem', sym: '♍', el: 'earth' },
  { name: 'Libra', sym: '♎', el: 'air' }, { name: 'Escorpião', sym: '♏', el: 'water' }, { name: 'Sagitário', sym: '♐', el: 'fire' },
  { name: 'Capricórnio', sym: '♑', el: 'earth' }, { name: 'Aquário', sym: '♒', el: 'air' }, { name: 'Peixes', sym: '♓', el: 'water' }
];
const EL_COLORS: Record<string, string> = { fire: '#e07050', earth: '#7ab060', air: '#80b0d0', water: '#7080c0' };

export default function HoroscopoPage() {
  const [selected, setSelected] = useState<typeof SIGNS[0] | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSelect = async (sign: typeof SIGNS[0]) => {
    setSelected(sign); setData(null); setError(''); setLoading(true);
    try {
      const res = await fetch('/api/horoscopo', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sign: sign.name }) });
      if (!res.ok) throw new Error();
      setData(await res.json());
    } catch { setError('O oráculo está em silêncio. Tente novamente.'); } finally { setLoading(false); }
  };

  return (
    <main className="animate-fade-in" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '120px 20px 80px', maxWidth: 1000, margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: 64 }}>
        <h1 className="glow-gold" style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontFamily: "var(--font-cinzel-decorative)", fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.1em' }}>Horoscopo</h1>
        <p style={{ fontFamily: "var(--font-cinzel)", fontSize: '0.8rem', color: 'var(--text-faint)', letterSpacing: '0.4em', textTransform: 'uppercase', marginTop: '1rem' }}>✦ A Mensagem das Estrelas ✦</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem', marginBottom: 64 }} className="animate-fade-in">
        {SIGNS.map(sign => (
          <button key={sign.name} onClick={() => handleSelect(sign)} style={{ 
            display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 10px', 
            background: selected?.name === sign.name ? 'rgba(201,168,76,0.18)' : 'rgba(13,21,53,0.3)', 
            border: selected?.name === sign.name ? '1px solid var(--gold)' : '1px solid rgba(201,168,76,0.1)', 
            borderRadius: '16px', cursor: 'pointer', transition: 'all 0.3s ease',
            color: selected?.name === sign.name ? EL_COLORS[sign.el] : 'var(--text-dim)' 
          }}>
            <span style={{ fontSize: 28, marginBottom: 4 }}>{sign.sym}</span>
            <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "var(--font-cinzel)" }}>{sign.name}</span>
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '64px 0', animation: 'pulse-glow 1.5s infinite', color: 'var(--gold)', fontSize: '1.1rem', letterSpacing: '0.2em' }}>✦ CONSULTANDO OS ASTROS...</div>}
      {error && <p style={{ textAlign: 'center', color: '#ff7070', background: 'rgba(220,80,80,0.1)', padding: '1rem', borderRadius: '8px' }}>⚠ {error}</p>}

      {data && selected && (
        <div className="animate-fade-up">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ fontSize: 72, color: EL_COLORS[selected.el], filter: 'drop-shadow(0 0 20px rgba(201,168,76,0.4))' }}>{selected.sym}</div>
            <div style={{ fontSize: 28, fontFamily: "var(--font-cinzel-decorative)", color: EL_COLORS[selected.el], letterSpacing: '0.1em' }}>{selected.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-faint)', letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: '0.5rem' }}>{data.date}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {['geral', 'amor', 'trabalho', 'energia', 'conselho'].map((key, i) => (
              <article key={key} className="glass-card animate-fade-up" style={{ padding: '2.5rem', gridColumn: key === 'conselho' ? 'span 2' : 'span 1', animationDelay: `${i * 0.1}s` }}>
                <div style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '1.25rem', fontFamily: 'var(--font-cinzel)' }}>✦ {key}</div>
                <p style={{ fontSize: '1.1rem', color: 'var(--text)', lineHeight: 1.85, fontFamily: 'var(--font-garamond)' }}>{data[key]}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}