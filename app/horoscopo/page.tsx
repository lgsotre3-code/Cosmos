'use client';

import { useState } from 'react';

const SIGNS = [
  { name: 'Áries',       sym: '♈', el: 'fire'  },
  { name: 'Touro',       sym: '♉', el: 'earth' },
  { name: 'Gêmeos',      sym: '♊', el: 'air'   },
  { name: 'Câncer',      sym: '♋', el: 'water' },
  { name: 'Leão',        sym: '♌', el: 'fire'  },
  { name: 'Virgem',      sym: '♍', el: 'earth' },
  { name: 'Libra',       sym: '♎', el: 'air'   },
  { name: 'Escorpião',   sym: '♏', el: 'water' },
  { name: 'Sagitário',   sym: '♐', el: 'fire'  },
  { name: 'Capricórnio', sym: '♑', el: 'earth' },
  { name: 'Aquário',     sym: '♒', el: 'air'   },
  { name: 'Peixes',      sym: '♓', el: 'water' },
];

const EL_COLORS: Record<string, string> = {
  fire:  '#e07050',
  earth: '#7ab060',
  air:   '#80b0d0',
  water: '#7080c0',
};

const SECTIONS = [
  { key: 'geral',    label: 'Energia do Dia', sym: '✦' },
  { key: 'amor',     label: 'Amor',           sym: '♀' },
  { key: 'trabalho', label: 'Trabalho',       sym: '♄' },
  { key: 'energia',  label: 'Vitalidade',     sym: '☀' },
  { key: 'conselho', label: 'Conselho',       sym: '☽' },
];

interface HoroscopoData {
  sign: string;
  date: string;
  geral: string;
  amor: string;
  trabalho: string;
  energia: string;
  conselho: string;
}

// Star field
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i, x: (i * 137.508) % 100, y: (i * 97.3) % 100,
  r: i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1 : 0.6,
  op: 0.2 + (i % 7) * 0.1,
}));

export default function HoroscopoPage() {
  const [selected, setSelected] = useState<typeof SIGNS[0] | null>(null);
  const [loading, setLoading]   = useState(false);
  const [data, setData]         = useState<HoroscopoData | null>(null);
  const [error, setError]       = useState('');

  const handleSelect = async (sign: typeof SIGNS[0]) => {
    setSelected(sign);
    setData(null);
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/horoscopo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sign: sign.name }),
      });
      if (!res.ok) throw new Error();
      const json: HoroscopoData = await res.json();
      setData(json);
    } catch {
      setError('O oráculo está em silêncio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const elColor = selected ? EL_COLORS[selected.el] : '#c9a84c';

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #04050f; min-height: 100vh; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-gold {
          0%,100% { opacity: 0.5; }
          50%      { opacity: 1; }
        }

        .sign-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 14px 8px;
          background: rgba(201,168,76,0.04);
          border: 1px solid rgba(201,168,76,0.14);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-cinzel, 'Cinzel', serif);
        }
        .sign-btn:hover {
          background: rgba(201,168,76,0.1);
          border-color: rgba(201,168,76,0.4);
        }
        .sign-btn.active {
          background: rgba(201,168,76,0.12);
          border-color: rgba(201,168,76,0.6);
        }
      `}</style>

      {/* Stars */}
      <svg style={{ position:'fixed',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0 }} aria-hidden>
        {STARS.map(s => <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.op} />)}
      </svg>

      <main style={{ position:'relative', zIndex:1, minHeight:'100vh', padding:'72px 20px 80px', maxWidth:860, margin:'0 auto' }}>

        {/* Header */}
        <header style={{ textAlign:'center', marginBottom:48 }}>
          <div style={{ fontSize:11, letterSpacing:'0.35em', color:'rgba(201,168,76,0.4)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", marginBottom:10, textTransform:'uppercase' }}>
            ✦ Oráculo Diário ✦
          </div>
          <h1 style={{ fontSize:'clamp(32px,7vw,56px)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", fontWeight:700, letterSpacing:'0.18em', color:'#c9a84c', textShadow:'0 0 40px rgba(201,168,76,0.3)', textTransform:'uppercase' }}>
            Horóscopo
          </h1>
          <p style={{ marginTop:10, fontSize:14, fontStyle:'italic', color:'rgba(201,168,76,0.45)', fontFamily:"var(--font-garamond,'EB Garamond',serif)" }}>
            O que os astros revelam para você hoje
          </p>
        </header>

        {/* Sign grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:8, marginBottom:48 }}>
          {SIGNS.map(sign => (
            <button
              key={sign.name}
              className={`sign-btn${selected?.name === sign.name ? ' active' : ''}`}
              onClick={() => handleSelect(sign)}
              style={{ color: selected?.name === sign.name ? EL_COLORS[sign.el] : 'rgba(201,168,76,0.5)' }}
            >
              <span style={{ fontSize:22 }}>{sign.sym}</span>
              <span style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase' }}>{sign.name}</span>
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign:'center', padding:'48px 0' }}>
            <div style={{ fontSize:32, animation:'pulse-gold 1.2s ease infinite', color:'#c9a84c' }}>✦</div>
            <p style={{ marginTop:16, fontSize:12, letterSpacing:'0.2em', color:'rgba(201,168,76,0.4)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", textTransform:'uppercase' }}>
              Consultando os astros...
            </p>
          </div>
        )}

        {/* Error */}
        {error && (
          <p style={{ textAlign:'center', color:'rgba(220,100,100,0.8)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", fontSize:12, letterSpacing:'0.1em' }}>
            {error}
          </p>
        )}

        {/* Result */}
        {data && selected && (
          <div style={{ animation:'fadeUp 0.5s ease both' }}>

            {/* Sign header */}
            <div style={{ textAlign:'center', marginBottom:36 }}>
              <div style={{ fontSize:52, marginBottom:8, filter:`drop-shadow(0 0 16px ${elColor}66)` }}>
                {selected.sym}
              </div>
              <div style={{ fontSize:22, fontFamily:"var(--font-cinzel,'Cinzel',serif)", fontWeight:700, letterSpacing:'0.15em', color:elColor, textTransform:'uppercase' }}>
                {selected.name}
              </div>
              <div style={{ marginTop:4, fontSize:11, color:'rgba(201,168,76,0.35)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", letterSpacing:'0.2em', textTransform:'uppercase' }}>
                {data.date}
              </div>
            </div>

            {/* Sections grid */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
              {SECTIONS.map(({ key, label, sym }, i) => (
                <article
                  key={key}
                  style={{
                    background:'rgba(13,21,53,0.55)',
                    border:'1px solid rgba(201,168,76,0.14)',
                    borderRadius:12,
                    padding:'20px 22px',
                    backdropFilter:'blur(10px)',
                    animation:'fadeUp 0.5s ease both',
                    animationDelay:`${i * 0.1}s`,
                    gridColumn: key === 'conselho' ? 'span 2' : 'span 1',
                  }}
                >
                  <div style={{ fontSize:9, letterSpacing:'0.22em', color:'rgba(201,168,76,0.45)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", textTransform:'uppercase', marginBottom:10 }}>
                    {sym} {label}
                  </div>
                  <p style={{ fontSize:15, color:'rgba(237,224,200,0.88)', fontFamily:"var(--font-garamond,'EB Garamond',serif)", lineHeight:1.75 }}>
                    {data[key as keyof HoroscopoData]}
                  </p>
                </article>
              ))}
            </div>

            {/* New reading */}
            <div style={{ textAlign:'center', marginTop:32 }}>
              <button
                onClick={() => { setData(null); setSelected(null); }}
                style={{ background:'none', border:'1px solid rgba(201,168,76,0.22)', borderRadius:8, padding:'10px 28px', color:'rgba(201,168,76,0.45)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", fontSize:10, letterSpacing:'0.2em', textTransform:'uppercase', cursor:'pointer' }}
              >
                Outro Signo
              </button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!selected && !loading && (
          <div style={{ textAlign:'center', padding:'24px 0', color:'rgba(201,168,76,0.25)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", fontSize:11, letterSpacing:'0.2em', textTransform:'uppercase' }}>
            Selecione seu signo acima
          </div>
        )}

        <footer style={{ textAlign:'center', marginTop:64, fontSize:10, color:'rgba(201,168,76,0.2)', fontFamily:"var(--font-cinzel,'Cinzel',serif)", letterSpacing:'0.2em' }}>
          ✦ COSMOS — HORÓSCOPO · FEITO COM LUZ E CÓDIGO ✦
        </footer>
      </main>
    </>
  );
}
