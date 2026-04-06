'use client';

import { useState, useCallback } from 'react';
import type { BirthData } from '@/lib/astro/types';
import { CITIES } from '@/lib/astro/data';

interface BirthFormProps {
  onSubmit: (data: BirthData) => void;
  isLoading: boolean;
}

interface FormState {
  name: string;
  date: string;
  time: string;
  cityIndex: string;
  lat: string;
  lon: string;
  tz: string;
}

const INITIAL_STATE: FormState = {
  name: '', date: '', time: '12:00',
  cityIndex: '', lat: '', lon: '', tz: '-3',
};

export default function BirthForm({ onSubmit, isLoading }: BirthFormProps) {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [showManual, setShowManual] = useState(false);
  const [errors, setErrors] = useState<Partial<FormState>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }, [],
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const idx = parseInt(e.target.value, 10);
      const city = CITIES[idx];
      if (!city || city.lat === null) {
        setShowManual(true);
        setForm(prev => ({ ...prev, cityIndex: e.target.value, lat: '', lon: '', tz: '-3' }));
      } else {
        setShowManual(false);
        setForm(prev => ({
          ...prev,
          cityIndex: e.target.value,
          lat: String(city.lat),
          lon: String(city.lon),
          tz: String(city.tz),
        }));
      }
    }, [],
  );

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.date) newErrors.date = 'Informe a data de nascimento.';
    if (!form.cityIndex && (!form.lat || !form.lon))
      newErrors.cityIndex = 'Selecione uma cidade.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(() => {
    if (!validate() || isLoading) return;
    const [year, month, day] = form.date.split('-').map(Number);
    const [hour, minute] = form.time.split(':').map(Number);
    const cityIdx = parseInt(form.cityIndex, 10);
    const city = !isNaN(cityIdx) && CITIES[cityIdx]?.lat !== null ? CITIES[cityIdx] : null;
    const lat = city ? city.lat! : parseFloat(form.lat);
    const lon = city ? city.lon! : parseFloat(form.lon);
    const tz = city ? city.tz! : parseFloat(form.tz);
    onSubmit({ name: form.name.trim() || 'Anônimo', year, month, day, hour, minute, lat, lon, tz });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isLoading, onSubmit]);

  return (
    <div style={s.wrapper}>
      {/* Decorative orbs */}
      <div style={s.orbLeft} aria-hidden="true" />
      <div style={s.orbRight} aria-hidden="true" />

      <div style={s.card}>
        {/* Header */}
        <div style={s.headerWrap}>
          <div style={s.headerLine} />
          <span style={s.headerText}>Seus Dados Natais</span>
          <div style={s.headerLine} />
        </div>
        <p style={s.headerSub}>
          O céu no momento em que você chegou ao mundo guarda os segredos da sua alma
        </p>

        {/* Fields */}
        <div style={s.fieldsWrap}>

          {/* Name */}
          <div style={s.fieldGroup}>
            <label style={s.label} htmlFor="name">Nome</label>
            <input
              id="name" name="name" type="text"
              placeholder="Seu nome completo"
              value={form.name} onChange={handleChange}
              style={s.input}
              className="cosmos-input"
            />
          </div>

          {/* Date + Time */}
          <div style={s.row}>
            <div style={s.fieldGroup}>
              <label style={s.label} htmlFor="date">
                Data de Nascimento
                {errors.date && <span style={s.errorMsg}> · {errors.date}</span>}
              </label>
              <input
                id="date" name="date" type="date"
                value={form.date} onChange={handleChange}
                style={{ ...s.input, ...(errors.date ? s.inputError : {}) }}
                className="cosmos-input"
              />
            </div>
            <div style={s.fieldGroup}>
              <label style={s.label} htmlFor="time">Hora de Nascimento</label>
              <input
                id="time" name="time" type="time"
                value={form.time} onChange={handleChange}
                style={s.input}
                className="cosmos-input"
              />
            </div>
          </div>

          {/* City */}
          <div style={s.fieldGroup}>
            <label style={s.label} htmlFor="cityIndex">
              Cidade de Nascimento
              {errors.cityIndex && <span style={s.errorMsg}> · {errors.cityIndex}</span>}
            </label>
            <div style={s.selectWrap}>
              <select
                id="cityIndex" name="cityIndex"
                value={form.cityIndex} onChange={handleCityChange}
                style={{ ...s.input, ...s.select, ...(errors.cityIndex ? s.inputError : {}) }}
                className="cosmos-input"
              >
                <option value="">— Selecione a cidade —</option>
                {CITIES.map((city, i) => (
                  <option key={i} value={i}>{city.n}</option>
                ))}
              </select>
              <span style={s.selectArrow} aria-hidden="true">⌄</span>
            </div>
          </div>

          {/* Manual coordinates */}
          {showManual && (
            <div style={s.manualGrid} className="manual-grid">
              {[
                { label: 'Latitude', name: 'lat', placeholder: '-23.55' },
                { label: 'Longitude', name: 'lon', placeholder: '-46.63' },
                { label: 'Fuso UTC', name: 'tz', placeholder: '-3', step: '0.5' },
              ].map(f => (
                <div key={f.name} style={s.fieldGroup}>
                  <label style={s.label}>{f.label}</label>
                  <input
                    name={f.name} type="number"
                    step={f.step ?? '0.01'} placeholder={f.placeholder}
                    value={form[f.name as keyof FormState]}
                    onChange={handleChange}
                    style={s.input} className="cosmos-input"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{ ...s.btn, ...(isLoading ? s.btnDisabled : {}) }}
          className="btn-primary"
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span style={s.loadingContent}>
              <span style={s.spinner} aria-hidden="true" />
              Consultando os Astros…
            </span>
          ) : (
            <span style={s.btnContent}>
              <span style={s.btnStar}>✦</span>
              Revelar Mapa Astral
              <span style={s.btnStar}>✦</span>
            </span>
          )}
        </button>

        <p style={s.note}>
          Para o Ascendente correto, informe a hora exata de nascimento
        </p>
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  wrapper: {
    position: 'relative',
    maxWidth: '680px',
    margin: '0 auto 4rem',
  },

  orbLeft: {
    position: 'absolute',
    top: '10%',
    left: '-120px',
    width: '280px',
    height: '280px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  orbRight: {
    position: 'absolute',
    bottom: '10%',
    right: '-120px',
    width: '240px',
    height: '240px',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(100,120,220,0.05) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  card: {
    position: 'relative',
    zIndex: 1,
    background: 'rgba(10,12,35,0.7)',
    backdropFilter: 'blur(32px)',
    WebkitBackdropFilter: 'blur(32px)',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '24px',
    padding: '2.75rem 2.5rem',
    boxShadow: '0 0 120px rgba(201,168,76,0.1), 0 0 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03) inset, 0 1px 0 rgba(201,168,76,0.1) inset',
  },

  headerWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '0.75rem',
  },

  headerLine: {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3))',
  },

  headerText: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.72rem',
    letterSpacing: '0.38em',
    textTransform: 'uppercase' as const,
    color: '#c9a84c',
    whiteSpace: 'nowrap' as const,
  },

  headerSub: {
    fontFamily: "var(--font-garamond,'EB Garamond',serif)",
    fontSize: '0.95rem',
    color: 'rgba(237,224,200,0.38)',
    textAlign: 'center' as const,
    marginBottom: '2.25rem',
    fontStyle: 'italic',
    letterSpacing: '0.02em',
  },

  fieldsWrap: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
    marginBottom: '2rem',
  },

  row: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },

  fieldGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },

  label: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.64rem',
    letterSpacing: '0.24em',
    textTransform: 'uppercase' as const,
    color: 'rgba(201,168,76,0.65)',
  },

  errorMsg: {
    color: '#e07070',
    fontSize: '0.75em',
    letterSpacing: '0.05em',
    textTransform: 'none' as const,
  },

  selectWrap: {
    position: 'relative' as const,
  },

  selectArrow: {
    position: 'absolute' as const,
    right: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'rgba(201,168,76,0.5)',
    fontSize: '1.1rem',
    pointerEvents: 'none' as const,
  },

  input: {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '10px',
    color: '#ede0c8',
    padding: '0.8rem 1rem',
    fontFamily: "var(--font-garamond,'EB Garamond',serif)",
    fontSize: '1.08rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s',
    colorScheme: 'dark' as const,
  },

  select: {
    WebkitAppearance: 'none' as const,
    appearance: 'none' as const,
    cursor: 'pointer',
    paddingRight: '2.5rem',
  },

  inputError: {
    borderColor: 'rgba(220,80,80,0.45)',
  },

  manualGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.85rem',
  },

  btn: {
    width: '100%',
    background: 'linear-gradient(135deg, #d4b060 0%, #8a6428 50%, #c9a84c 100%)',
    backgroundSize: '200% 200%',
    border: 'none',
    borderRadius: '10px',
    color: '#02030e',
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontWeight: 700,
    fontSize: '0.82rem',
    letterSpacing: '0.28em',
    textTransform: 'uppercase' as const,
    padding: '1.1rem',
    cursor: 'pointer',
    transition: 'all 0.35s',
    marginBottom: '1rem',
    boxShadow: '0 4px 24px rgba(201,168,76,0.2)',
  },

  btnDisabled: {
    opacity: 0.65,
    cursor: 'not-allowed',
  },

  btnContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.75rem',
  },

  btnStar: {
    fontSize: '0.75rem',
    opacity: 0.7,
  },

  loadingContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.6rem',
  },

  spinner: {
    display: 'inline-block',
    width: '14px',
    height: '14px',
    border: '2px solid rgba(2,3,14,0.25)',
    borderTopColor: '#02030e',
    borderRadius: '50%',
    animation: 'spin-slow 0.7s linear infinite',
  },

  note: {
    fontFamily: "var(--font-cinzel,'Cinzel',serif)",
    fontSize: '0.6rem',
    letterSpacing: '0.18em',
    color: 'rgba(237,224,200,0.28)',
    textAlign: 'center' as const,
    textTransform: 'uppercase' as const,
  },
};

