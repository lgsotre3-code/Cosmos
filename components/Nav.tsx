'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'Mapa', sym: '✦' },
  { href: '/tarot', label: 'Tarot', sym: '☽' },
  { href: '/horoscopo', label: 'Horóscopo', sym: '☀' },
];

export default function Nav() {
  const path = usePathname();
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
            </Link>
          );
        })}
      </div>
    </nav>
  );
}