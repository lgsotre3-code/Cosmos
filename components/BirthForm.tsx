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
  const [form, setForm]         = useState<FormState>(INITIAL_STATE);
  const [showManual, setShowManual] = useState(false);
  const [errors, setErrors]     = useState<Partial<FormState>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setForm(prev => ({ ...prev, [name]: value }));
      setErrors(prev => ({ ...prev, [name]: '' }));
    }, [],
  );

  const handleCityChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const idx  = parseInt(e.target.value, 10);
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
          tz:  String(city.tz),
        }));
      }
    }, [],
  );

  const validate = (): boolean => {
    const newErrors: Partial<FormState> = {};
    if (!form.date) newErrors.date = 'Informe a data de nascimento.';
    if (!form.cityIndex && (!form.lat || !form.lon))
      newErrors.cityIndex = 'Selecione uma cidade ou informe as coordenadas.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(() => {
    if (!validate() || isLoading) return;
    const [year, month, day]    = form.date.split('-').map(Number);
    const [hour, minute]        = form.time.split(':').map(Number);
    const cityIdx = parseInt(form.cityIndex, 10);
    const city    = !isNaN(cityIdx) && CITIES[cityIdx]?.lat !== null ? CITIES[cityIdx] : null;
    const lat = city ? city.lat! : parseFloat(form.lat);
    const lon = city ? city.lon! : parseFloat(form.lon);
    const tz  = city ? city.tz!  : parseFloat(form.tz);
    onSubmit({ name: form.name.trim() || 'Anônimo', year, month, day, hour, minute, lat, lon, tz });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, isLoading, onSubmit]);

  return (
    <div style={s.card}>
      <div style={s.cardTitle}>✦ Seus Dados Natais ✦</div>

      <div style={s.grid} className="form-grid">
        {/* Name */}
        <div style={{ ...s.field, gridColumn: '1 / -1' }}>
          <label style={s.label} htmlFor="name">Nome</label>
          <input id="name" name="name" type="text" placeholder="Seu nome completo"
            value={form.name} onChange={handleChange} style={s.input} />
        </div>

        {/* Date */}
        <div style={s.field}>
          <label style={s.label} htmlFor="date">
            Data de nascimento
            {errors.date && <span style={s.errorMsg}>{errors.date}</span>}
          </label>
          <input id="date" name="date" type="date" value={form.date} onChange={handleChange}
            style={{ ...s.input, ...(errors.date ? s.inputError : {}) }}
            aria-invalid={!!errors.date} aria-describedby={errors.date ? 'date-error' : undefined}
          />
        </div>

        {/* Time */}
        <div style={s.field}>
          <label style={s.label} htmlFor="time">Hora de nascimento</label>
          <input id="time" name="time" type="time" value={form.time} onChange={handleChange} style={s.input} />
        </div>

        {/* City */}
        <div style={{ ...s.field, gridColumn: '1 / -1' }}>
          <label style={s.label} htmlFor="cityIndex">
            Cidade de nascimento
            {errors.cityIndex && <span style={s.errorMsg}>{errors.cityIndex}</span>}
          </label>
          <select id="cityIndex" name="cityIndex" value={form.cityIndex} onChange={handleCityChange}
            style={{ ...s.input, ...s.select, ...(errors.cityIndex ? s.inputError : {}) }}
            aria-invalid={!!errors.cityIndex}
          >
            <option value="">— Selecione a cidade —</option>
            {CITIES.map((city, i) => (
              <option key={i} value={i}>{city.n}</option>
            ))}
          </select>
        </div>

        {/* Manual coordinates */}
        {showManual && (
          <div style={{ ...s.manualGrid, gridColumn: '1 / -1' }} className="manual-grid">
            {[
              { label: 'Latitude',  name: 'lat', placeholder: '-23.55' },
              { label: 'Longitude', name: 'lon', placeholder: '-46.63' },
              { label: 'Fuso (UTC)',name: 'tz',  placeholder: '-3', min: '-12', max: '14', step: '0.5' },
            ].map(f => (
              <div key={f.name} style={s.field}>
                <label style={s.label}>{f.label}</label>
                <input name={f.name} type="number" step={f.step ?? '0.01'}
                  min={f.min} max={f.max} placeholder={f.placeholder}
                  value={form[f.name as keyof FormState]}
                  onChange={handleChange} style={s.input}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        style={{ ...s.btn, ...(isLoading ? s.btnDisabled : {}) }}
        className="btn-primary"
        aria-busy={isLoading}
        aria-label={isLoading ? 'Calculando mapa astral...' : 'Revelar Mapa Astral'}
      >
        {isLoading ? (
          <span style={s.loadingContent}>
            <span style={s.spinner} aria-hidden="true" />
            Calculando...
          </span>
        ) : (
          '✦ Revelar Mapa Astral ✦'
        )}
      </button>

      <p style={s.note}>
        Para o Ascendente correto, informe a hora exata de nascimento.
      </p>
    </div>
  );
}

const s = {
  card: {
    background: 'rgba(255,255,255,0.025)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(201,168,76,0.15)',
    borderRadius: '18px',
    padding: '2.5rem',
    maxWidth: '700px',
    margin: '0 auto 3rem',
    boxShadow: '0 0 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)',
  } as React.CSSProperties,
  cardTitle: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    color: '#c9a84c', fontSize: '0.78rem', letterSpacing: '0.32em',
    textAlign: 'center', textTransform: 'uppercase', marginBottom: '2rem',
  } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' } as React.CSSProperties,
  manualGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' } as React.CSSProperties,
  field: { display: 'flex', flexDirection: 'column', gap: '0.45rem' } as React.CSSProperties,
  label: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.68rem', letterSpacing: '0.22em', textTransform: 'uppercase',
    color: 'rgba(201,168,76,0.72)', display: 'flex', alignItems: 'center',
    gap: '0.5rem', flexWrap: 'wrap',
  } as React.CSSProperties,
  errorMsg: { color: '#e05040', fontSize: '0.7em', letterSpacing: '0.1em' } as React.CSSProperties,
  input: {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(201,168,76,0.18)',
    borderRadius: '8px', color: '#ede0c8',
    padding: '0.72rem 1rem',
    fontFamily: "var(--font-garamond, 'EB Garamond', serif)",
    fontSize: '1.05rem',
    transition: 'border-color 0.25s, box-shadow 0.25s',
    outline: 'none', width: '100%', colorScheme: 'dark',
  } as React.CSSProperties,
  select: { WebkitAppearance: 'none', appearance: 'none', cursor: 'pointer' } as React.CSSProperties,
  inputError: { borderColor: 'rgba(220,80,80,0.5)' } as React.CSSProperties,
  btn: {
    width: '100%',
    background: 'linear-gradient(135deg, #c9a84c 0%, #8a6428 100%)',
    border: 'none', borderRadius: '8px', color: '#02030e',
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.25em',
    textTransform: 'uppercase', padding: '1rem',
    cursor: 'pointer', transition: 'all 0.3s', marginTop: '0.85rem',
  } as React.CSSProperties,
  btnDisabled: { opacity: 0.7, cursor: 'not-allowed', transform: 'none' } as React.CSSProperties,
  loadingContent: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' } as React.CSSProperties,
  spinner: {
    display: 'inline-block', width: '14px', height: '14px',
    border: '2px solid rgba(2,3,14,0.3)', borderTopColor: '#02030e',
    borderRadius: '50%', animation: 'spin-slow 0.7s linear infinite',
  } as React.CSSProperties,
  note: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.63rem', letterSpacing: '0.15em',
    color: 'rgba(237,224,200,0.35)', textAlign: 'center', marginTop: '1rem',
  } as React.CSSProperties,
} as const;
