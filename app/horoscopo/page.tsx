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
    <main className="animate-fade-in" style={{ position: 'relative', zIndex: 1, minHeight: '100vh', padding: '72px 20px 80px', maxWidth: 860, margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 className="glow-gold" style={{ fontSize: 'clamp(32px, 7vw, 56px)', fontFamily: "var(--font-cinzel)", fontWeight: 700, color: 'var(--gold)', textTransform: 'uppercase' }}>Horóscopo</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 48 }}>
        {SIGNS.map(sign => (
          <button key={sign.name} onClick={() => handleSelect(sign)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '14px 8px', background: selected?.name === sign.name ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.14)', borderRadius: '10px', cursor: 'pointer', color: selected?.name === sign.name ? EL_COLORS[sign.el] : 'var(--text-faint)' }}>
            <span style={{ fontSize: 22 }}>{sign.sym}</span>
            <span style={{ fontSize: 9, textTransform: 'uppercase' }}>{sign.name}</span>
          </button>
        ))}
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '48px 0', animation: 'pulse-gold 1.2s infinite', color: 'var(--gold)' }}>✦ Consultando os astros...</div>}
      {error && <p style={{ textAlign: 'center', color: '#ff7070' }}>{error}</p>}

      {data && selected && (
        <div className="animate-fade-up">
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{ fontSize: 52, color: EL_COLORS[selected.el], filter: 'drop-shadow(0 0 16px rgba(201,168,76,0.4))' }}>{selected.sym}</div>
            <div style={{ fontSize: 22, fontFamily: "var(--font-cinzel)", color: EL_COLORS[selected.el] }}>{selected.name}</div>
          </div>
          <div style={{ display: 'grid', gap: 16 }}>
            {['geral', 'amor', 'trabalho', 'energia', 'conselho'].map(key => (
              <article key={key} className="glass-card" style={{ padding: '20px 22px' }}>
                <div style={{ fontSize: 9, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 8 }}>{key}</div>
                <p style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.75 }}>{data[key]}</p>
              </article>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}