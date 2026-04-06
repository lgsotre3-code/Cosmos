

'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
interface TarotCard {
  name: string;
  arcana: string;
  position: string;
  reversed: boolean;
  message: string;
}

interface TarotReading {
  cards: TarotCard[];
  synthesis: string;
  generatedAt: string;
}

// ── Tarot card symbols (decorative) ───────────────────────────────────────
const CARD_SYMBOLS = ['☽', '☀', '★', '⚡', '♆', '♇', '⚸', '☿', '♀', '♂', '♃', '♄'];

function randomSym() {
  return CARD_SYMBOLS[Math.floor(Math.random() * CARD_SYMBOLS.length)];
}

// ── Star field (static) ───────────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (i * 137.508) % 100,
  y: (i * 97.3) % 100,
  r: i % 5 === 0 ? 1.5 : i % 3 === 0 ? 1 : 0.6,
  op: 0.2 + (i % 7) * 0.1,
}));

// ── Sub-components ─────────────────────────────────────────────────────────

function StarField() {
  return (
    <svg
      style={{
        position: 'fixed', inset: 0, width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
      aria-hidden
    >
      {STARS.map(s => (
        <circle key={s.id} cx={`${s.x}%`} cy={`${s.y}%`} r={s.r} fill="#fff" opacity={s.op} />
      ))}
    </svg>
  );
}

function SpreadButton({
  value, label, desc, selected, onClick,
}: {
  value: 1 | 3 | 5;
  label: string;
  desc: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px 8px',
        background: selected ? 'rgba(201,168,76,0.15)' : 'rgba(201,168,76,0.04)',
        border: `1px solid ${selected ? 'rgba(201,168,76,0.6)' : 'rgba(201,168,76,0.18)'}`,
        borderRadius: 8,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        textAlign: 'center' as const,
      }}
    >
      <div style={{
        fontSize: 18,
        color: selected ? '#c9a84c' : 'rgba(201,168,76,0.5)',
        fontFamily: "'Cinzel', serif",
        fontWeight: 700,
        marginBottom: 2,
      }}>
        {label}
      </div>
      <div style={{
        fontSize: 10,
        color: 'rgba(201,168,76,0.5)',
        fontFamily: "'Cormorant Garamond', serif",
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
      }}>
        {desc}
      </div>
    </button>
  );
}

function CardDisplay({ card, index, total }: { card: TarotCard; index: number; total: number }) {
  const sym = useRef(randomSym()).current;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: 12,
      flex: 1,
      minWidth: total === 1 ? '100%' : total === 3 ? 'calc(33% - 8px)' : 'calc(20% - 8px)',
      maxWidth: total === 1 ? 320 : 'none',
      animation: `cardReveal 0.6s ease both`,
      animationDelay: `${index * 0.18}s`,
    }}>
      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 160,
        aspectRatio: '2/3.5',
        background: 'linear-gradient(160deg, #0d1535 0%, #070a1c 100%)',
        border: '1px solid rgba(201,168,76,0.35)',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px 12px',
        position: 'relative' as const,
        transform: card.reversed ? 'rotate(180deg)' : 'none',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 0 30px rgba(201,168,76,0.03)',
      }}>
        {/* Corner ornaments */}
        {['0 0', '0 auto', 'auto 0', 'auto auto'].map((m, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: i < 2 ? 6 : 'auto',
            bottom: i >= 2 ? 6 : 'auto',
            left: i % 2 === 0 ? 6 : 'auto',
            right: i % 2 !== 0 ? 6 : 'auto',
            width: 14, height: 14,
            borderTop: i < 2 ? '1px solid rgba(201,168,76,0.4)' : 'none',
            borderBottom: i >= 2 ? '1px solid rgba(201,168,76,0.4)' : 'none',
            borderLeft: i % 2 === 0 ? '1px solid rgba(201,168,76,0.4)' : 'none',
            borderRight: i % 2 !== 0 ? '1px solid rgba(201,168,76,0.4)' : 'none',
          }} />
        ))}
        {/* Symbol */}
        <div style={{ fontSize: 38, marginBottom: 8, filter: 'drop-shadow(0 0 8px rgba(201,168,76,0.5))' }}>
          {sym}
        </div>
        {/* Card name */}
        <div style={{
          fontSize: 11,
          color: '#c9a84c',
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          textAlign: 'center' as const,
          letterSpacing: '0.04em',
          lineHeight: 1.3,
        }}>
          {card.name}
        </div>
        {card.reversed && (
          <div style={{
            position: 'absolute',
            bottom: 20,
            fontSize: 8,
            color: 'rgba(201,168,76,0.45)',
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.1em',
            transform: 'rotate(180deg)',
          }}>
            INVERTIDA
          </div>
        )}
      </div>

      {/* Position label */}
      <div style={{
        fontSize: 9,
        color: 'rgba(201,168,76,0.5)',
        fontFamily: "'Cinzel', serif",
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        textAlign: 'center' as const,
      }}>
        {card.position}
      </div>

      {/* Message */}
      <div style={{
        fontSize: 13,
        color: 'rgba(201,168,76,0.75)',
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        lineHeight: 1.65,
        textAlign: 'center' as const,
        maxWidth: 200,
      }}>
        {card.message}
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function TarotPage() {
  const [question, setQuestion] = useState('');
  const [spread, setSpread] = useState<1 | 3 | 5>(1);
  const [loading, setLoading] = useState(false);
  const [reading, setReading] = useState<TarotReading | null>(null);
  const [error, setError] = useState('');

  const handleConsult = async () => {
    if (!question.trim() || question.trim().length < 3) {
      setError('Formule uma pergunta ao oráculo.');
      return;
    }
    setError('');
    setLoading(true);
    setReading(null);

    try {
      const res = await fetch('/api/tarot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question.trim(), spread }),
      });
      if (!res.ok) throw new Error('Erro na consulta');
      const data: TarotReading = await res.json();
      setReading(data);
    } catch {
      setError('O oráculo está em silêncio. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #04050f;
          min-height: 100vh;
          color: rgba(201,168,76,0.85);
          font-family: 'Cormorant Garamond', serif;
        }

        @keyframes cardReveal {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.6; }
          50%       { opacity: 1; }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        textarea::placeholder {
          color: rgba(201,168,76,0.3);
        }

        textarea:focus {
          outline: none;
          border-color: rgba(201,168,76,0.45) !important;
        }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(201,168,76,0.2); border-radius: 2px; }
      `}</style>

      <StarField />

      <main style={{
        position: 'relative',
        zIndex: 1,
        minHeight: '100vh',
        padding: '48px 20px 80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>

        {/* Back link */}
        <Link href="/" style={{
          alignSelf: 'flex-start',
          marginBottom: 32,
          fontSize: 11,
          color: 'rgba(201,168,76,0.4)',
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.15em',
          textDecoration: 'none',
          textTransform: 'uppercase',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.8)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,168,76,0.4)')}
        >
          ← Cosmos
        </Link>

        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{
            fontSize: 13,
            letterSpacing: '0.35em',
            color: 'rgba(201,168,76,0.45)',
            fontFamily: "'Cinzel', serif",
            marginBottom: 12,
            textTransform: 'uppercase',
          }}>
            ✦ Oráculo ✦
          </div>
          <h1 style={{
            fontSize: 'clamp(36px, 8vw, 64px)',
            fontFamily: "'Cinzel', serif",
            fontWeight: 700,
            letterSpacing: '0.18em',
            color: '#c9a84c',
            textShadow: '0 0 40px rgba(201,168,76,0.3)',
            textTransform: 'uppercase',
          }}>
            Tarot
          </h1>
          <p style={{
            marginTop: 12,
            fontSize: 15,
            fontStyle: 'italic',
            color: 'rgba(201,168,76,0.5)',
            letterSpacing: '0.05em',
          }}>
            As cartas revelam o que os astros sussurram
          </p>
        </header>

        {/* Form */}
        <div style={{
          width: '100%',
          maxWidth: 560,
          background: 'rgba(13,21,53,0.6)',
          border: '1px solid rgba(201,168,76,0.18)',
          borderRadius: 16,
          padding: 32,
          backdropFilter: 'blur(12px)',
          marginBottom: reading ? 40 : 0,
        }}>

          {/* Question */}
          <label style={{
            display: 'block',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'rgba(201,168,76,0.5)',
            fontFamily: "'Cinzel', serif",
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Sua Pergunta ao Oráculo
          </label>
          <textarea
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="O que as estrelas revelam sobre meu caminho?"
            rows={3}
            style={{
              width: '100%',
              background: 'rgba(201,168,76,0.04)',
              border: '1px solid rgba(201,168,76,0.22)',
              borderRadius: 8,
              padding: '12px 14px',
              color: 'rgba(201,168,76,0.9)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 15,
              lineHeight: 1.6,
              resize: 'vertical' as const,
              transition: 'border-color 0.2s',
            }}
          />

          {/* Spread selector */}
          <div style={{ marginTop: 20, marginBottom: 24 }}>
            <div style={{
              fontSize: 9,
              letterSpacing: '0.2em',
              color: 'rgba(201,168,76,0.5)',
              fontFamily: "'Cinzel', serif",
              textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              Tiragem
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <SpreadButton value={1} label="1" desc="Carta única" selected={spread === 1} onClick={() => setSpread(1)} />
              <SpreadButton value={3} label="3" desc="Passado · Presente · Futuro" selected={spread === 3} onClick={() => setSpread(3)} />
              <SpreadButton value={5} label="5" desc="Cruz Celta" selected={spread === 5} onClick={() => setSpread(5)} />
            </div>
          </div>

          {error && (
            <p style={{
              marginBottom: 16,
              fontSize: 12,
              color: 'rgba(220,100,100,0.8)',
              fontFamily: "'Cinzel', serif",
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}>
              {error}
            </p>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={handleConsult}
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px 0',
              background: loading
                ? 'rgba(201,168,76,0.08)'
                : 'linear-gradient(135deg, #c9a84c 0%, #a07830 100%)',
              border: 'none',
              borderRadius: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Cinzel', serif",
              fontWeight: 700,
              fontSize: 13,
              letterSpacing: '0.22em',
              color: loading ? 'rgba(201,168,76,0.4)' : '#04050f',
              textTransform: 'uppercase',
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? (
              <span style={{ animation: 'pulse-glow 1.2s ease infinite' }}>
                ✦ Consultando o Oráculo ✦
              </span>
            ) : (
              '✦ Revelar as Cartas ✦'
            )}
          </button>
        </div>

        {/* Reading result */}
        {reading && (
          <div style={{
            width: '100%',
            maxWidth: reading.cards.length === 5 ? 860 : 600,
            animation: 'cardReveal 0.5s ease both',
          }}>
            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 40,
            }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} />
              <span style={{
                fontSize: 18,
                color: 'rgba(201,168,76,0.4)',
                animation: 'spin-slow 12s linear infinite',
                display: 'inline-block',
              }}>✦</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(201,168,76,0.15)' }} />
            </div>

            {/* Cards grid */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap' as const,
              gap: 20,
              justifyContent: 'center',
              marginBottom: 48,
            }}>
              {reading.cards.map((card, i) => (
                <CardDisplay key={i} card={card} index={i} total={reading.cards.length} />
              ))}
            </div>

            {/* Synthesis */}
            <div style={{
              background: 'rgba(13,21,53,0.6)',
              border: '1px solid rgba(201,168,76,0.18)',
              borderRadius: 16,
              padding: '28px 32px',
              backdropFilter: 'blur(12px)',
              textAlign: 'center',
            }}>
              <div style={{
                fontSize: 9,
                letterSpacing: '0.25em',
                color: 'rgba(201,168,76,0.4)',
                fontFamily: "'Cinzel', serif",
                textTransform: 'uppercase',
                marginBottom: 14,
              }}>
                ✦ Síntese do Oráculo ✦
              </div>
              <p style={{
                fontSize: 16,
                fontStyle: 'italic',
                color: 'rgba(201,168,76,0.8)',
                lineHeight: 1.8,
                fontFamily: "'Cormorant Garamond', serif",
              }}>
                {reading.synthesis}
              </p>
            </div>

            {/* New reading */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button
                type="button"
                onClick={() => { setReading(null); setQuestion(''); }}
                style={{
                  background: 'none',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: 8,
                  padding: '10px 28px',
                  color: 'rgba(201,168,76,0.5)',
                  fontFamily: "'Cinzel', serif",
                  fontSize: 10,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = 'rgba(201,168,76,0.9)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(201,168,76,0.5)';
                  e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)';
                }}
              >
                Nova Consulta
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer style={{
          marginTop: 'auto',
          paddingTop: 64,
          fontSize: 10,
          color: 'rgba(201,168,76,0.2)',
          fontFamily: "'Cinzel', serif",
          letterSpacing: '0.2em',
          textAlign: 'center',
        }}>
          ✦ COSMOS — TAROT · FEITO COM LUZ E CÓDIGO ✦
        </footer>
      </main>
    </>
  );
}
