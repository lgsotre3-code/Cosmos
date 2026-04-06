'use client';
<<<<<<< HEAD
=======

>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
<<<<<<< HEAD
  { href: '/', label: 'Mapa', sym: '✦' },
  { href: '/tarot', label: 'Tarot', sym: '☽' },
  { href: '/horoscopo', label: 'Horóscopo', sym: '☀' },
=======
  { href: '/',           label: 'Mapa Astral', sym: '✦' },
  { href: '/sinastria',  label: 'Sinastria',   sym: '♾' },
  { href: '/tarot',      label: 'Tarot',       sym: '☽' },
  { href: '/horoscopo',  label: 'Horóscopo',   sym: '☀' },
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
];

export default function Nav() {
  const path = usePathname();
<<<<<<< HEAD
  return (
    <nav style={{ position: 'fixed', top: '1.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 1000, width: 'fit-content' }}>
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', borderRadius: '40px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ padding: '0 1rem', color: 'var(--gold)', fontFamily: 'var(--font-cinzel-decorative)', fontSize: '0.9rem', letterSpacing: '0.1em' }}>COSMOS</div>
        <div style={{ width: '1px', height: '20px', background: 'rgba(201,168,76,0.2)' }} />
        {LINKS.map(({ href, label, sym }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '30px',
              fontFamily: "var(--font-cinzel)", fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none',
              color: active ? '#04050f' : 'rgba(201,168,76,0.6)',
              background: active ? 'var(--gold)' : 'transparent',
              transition: 'all 0.3s ease',
              boxShadow: active ? '0 0 20px rgba(201,168,76,0.4)' : 'none'
            }}>
              <span>{sym}</span>
              <span>{label}</span>
=======

  return (
    <nav style={s.nav} aria-label="Navegação principal">
      <div style={s.inner}>
        {LINKS.map(({ href, label, sym }) => {
          const active = path === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                ...s.link,
                color: active ? '#c9a84c' : 'rgba(201,168,76,0.38)',
                borderBottom: active
                  ? '2px solid rgba(201,168,76,0.5)'
                  : '1px solid transparent',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <span style={s.sym}>{sym}</span>
              <span style={s.label}>{label}</span>
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
            </Link>
          );
        })}
      </div>
    </nav>
  );
<<<<<<< HEAD
}
=======
}

const s: Record<string, React.CSSProperties> = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    background: 'rgba(4,5,15,0.75)',
    backdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(201,168,76,0.1)',
  },
  inner: {
    maxWidth: '1140px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    height: '52px',
    justifyContent: 'center',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.68rem',
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    textDecoration: 'none',
    borderRadius: '4px 4px 0 0',
    transition: 'color 0.2s, border-color 0.2s',
  },
  sym: {
    fontSize: '0.9rem',
    lineHeight: 1,
  },
  label: {
    lineHeight: 1,
  },
};
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
