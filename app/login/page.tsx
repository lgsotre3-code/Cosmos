'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from 'next/navigation'
import StarField from '@/components/StarField'

export default function LoginPage() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`
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
            Entrar com Google
          </button>
        </main>
      </div>
    </>
  )
}

const styles = {
  wrap: { position: 'relative' as const, zIndex: 1, maxWidth: '1140px', margin: '0 auto', padding: '72px 1.5rem 1.5rem' },
  header: { textAlign: 'center' as const, padding: '3rem 0 2rem' },
  h1: { fontFamily: "var(--font-cinzel-decorative, 'Cinzel Decorative', serif)", fontSize: 'clamp(2.2rem, 5vw, 3.6rem)', color: '#c9a84c', textShadow: '0 0 60px rgba(201,168,76,0.4)', letterSpacing: '0.08em', marginBottom: '0.5rem' },
  tagline: { fontFamily: "var(--font-cinzel, 'Cinzel', serif)", fontSize: '0.8rem', color: 'rgba(237,224,200,0.35)', letterSpacing: '0.38em', textTransform: 'uppercase' as const },
  main: { display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '2rem', padding: '4rem 0' },
  subtitle: { fontFamily: "var(--font-cinzel, 'Cinzel', serif)", fontSize: '0.85rem', color: 'rgba(237,224,200,0.5)', letterSpacing: '0.15em' },
  button: { padding: '0.85rem 2rem', borderRadius: '8px', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', color: '#ede8c8', fontFamily: "var(--font-cinzel, 'Cinzel', serif)", fontSize: '0.9rem', letterSpacing: '0.1em', cursor: 'pointer' },
}
