'use client'
import { createBrowserClient } from '@supabase/ssr'
import { useSearchParams } from 'next/navigation'
import StarField from '@/components/StarField'
import { Suspense } from 'react'

function LoginContent() {
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
<<<<<<< HEAD
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#02030e', overflow: 'hidden' }}>
      <StarField />
      
      {/* Decorative Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)', borderRadius: '50%' }} />
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(100,120,220,0.06) 0%, transparent 70%)', borderRadius: '50%' }} />

      <main className="glass-card animate-fade-up" style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px', padding: '4rem 3rem', textAlign: 'center', border: '1px solid rgba(201,168,76,0.2)', boxShadow: '0 24px 64px rgba(0,0,0,0.8)' }}>
        <header style={{ marginBottom: '3rem' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.4em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.5rem', fontFamily: 'var(--font-cinzel)' }}>Portal de Acesso</div>
          <h1 className="glow-gold" style={{ fontFamily: "var(--font-cinzel-decorative)", fontSize: '3rem', color: 'var(--gold)', marginBottom: '0.5rem' }}>COSMOS</h1>
          <p style={{ fontFamily: "var(--font-cinzel)", fontSize: '0.75rem', color: 'var(--text-faint)', letterSpacing: '0.3em', textTransform: 'uppercase' }}>Astrologia Mística</p>
        </header>

        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontFamily: "var(--font-garamond)", fontSize: '1.1rem', color: 'var(--text-dim)', fontStyle: 'italic', lineHeight: 1.6 }}>
            "Os astros não forçam, eles inclinam. Descubra o caminho escrito para você nas estrelas."
          </p>
        </div>

        <button onClick={handleLogin} className="btn-primary" style={{ width: '100%', padding: '1.25rem', background: 'var(--gold)', color: '#04050f', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', letterSpacing: '0.15em', fontFamily: 'var(--font-cinzel)', boxShadow: '0 8px 32px rgba(201,168,76,0.2)' }}>
          ENTRAR COM GOOGLE
        </button>

        <footer style={{ marginTop: '3rem', fontSize: '0.6rem', color: 'var(--text-faint)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          ✦ Conexão Segura Supabase ✦
        </footer>
      </main>
    </div>
=======
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
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
  )
}

export default function LoginPage() {
  return (
<<<<<<< HEAD
    <Suspense fallback={<div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#02030e', color: 'var(--gold)', fontFamily: 'var(--font-cinzel)' }}>Carregando Portal...</div>}>
      <LoginContent />
    </Suspense>
  )
}
=======
    <Suspense fallback={<div style={styles.loading}>Carregando...</div>}>
      <LoginContent />
    </Suspense>
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
  loading: { position: 'absolute' as const, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'rgba(237,224,200,0.5)', fontFamily: "var(--font-cinzel, 'Cinzel', serif)" },
}
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
