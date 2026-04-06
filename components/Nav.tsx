'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/',           label: 'Mapa Astral', sym: '✦' },
  { href: '/tarot',      label: 'Tarot',       sym: '☽' },
  { href: '/horoscopo',  label: 'Horóscopo',   sym: '☀' },
];

export default function Nav() {
  const path = usePathname();

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
                  ? '1px solid rgba(201,168,76,0.5)'
                  : '1px solid transparent',
              }}
              aria-current={active ? 'page' : undefined}
            >
              <span style={s.sym}>{sym}</span>
              <span style={s.label}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
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
