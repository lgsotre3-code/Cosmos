'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import StarField from '@/components/StarField'

export default function LoginPage() {
  const supabase = createClientComponentClient()

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'https://cosmos-zeta-nine.vercel.app/auth/callback'
      }
    })
  }

  return (
    <>
      <StarField />
      <div style={styles.wrap}>
        <header style={styles.header}>
          <h1 style={styles.h1}>✦ Cosmos ✦</h1>
          <p style={styles.tagline}>Mapa Astral Natal</p>
        </header>
        <main style={styles.main}>
          <p style={styles.subtitle}>Entre para gerar e salvar seu mapa astral</p>
          <button onClick={handleLogin} style={styles.button}>
            <svg width="20" height="20" viewBox="0 0 48 48" style={{ marginRight: '10px' }}>
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Entrar com Google
          </button>
        </main>
      </div>
    </>
  )
}

const styles = {
  wrap: {
    position: 'relative' as const,
    zIndex: 1,
    maxWidth: '1140px',
    margin: '0 auto',
    padding: '72px 1.5rem 1.5rem',
  },
  header: { textAlign: 'center' as const, padding: '3rem 0 2rem' },
  h1: {
    fontFamily: "var(--font-cinzel-decorative, 'Cinzel Decorative', serif)",
    fontSize: 'clamp(2.2rem, 5vw, 3.6rem)',
    color: '#c9a84c',
    textShadow: '0 0 60px rgba(201,168,76,0.4)',
    letterSpacing: '0.08em',
    marginBottom: '0.5rem',
  },
  tagline: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.8rem',
    color: 'rgba(237,224,200,0.35)',
    letterSpacing: '0.38em',
    textTransform: 'uppercase' as const,
  },
  main: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2rem',
    padding: '4rem 0',
  },
  subtitle: {
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.85rem',
    color: 'rgba(237,224,200,0.5)',
    letterSpacing: '0.15em',
    textAlign: 'center' as const,
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.85rem 2rem',
    borderRadius: '8px',
    background: 'rgba(201,168,76,0.08)',
    border: '1px solid rgba(201,168,76,0.3)',
    color: '#ede8c8',
    fontFamily: "var(--font-cinzel, 'Cinzel', serif)",
    fontSize: '0.9rem',
    letterSpacing: '0.1em',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
}
