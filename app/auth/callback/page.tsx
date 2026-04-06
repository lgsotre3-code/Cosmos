'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AuthCallbackPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const code = searchParams.get('code')
      const redirect = searchParams.get('redirect') || '/'

      if (!code) {
        setError('Código de autenticação não encontrado')
        return
      }

      try {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

        if (exchangeError) {
          setError('Falha na autenticação: ' + exchangeError.message)
          return
        }

        // Verifica se a sessão foi criada
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setError('Sessão não foi criada')
          return
        }

        // Redireciona para a página original ou home
        router.push(redirect)
        router.refresh()
      } catch (err) {
        setError('Erro inesperado na autenticação')
      }
    }

    handleAuthCallback()
  }, [searchParams, router])

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh',
        padding: '2rem'
      }}>
        <h1 style={{ color: '#e07070', marginBottom: '1rem' }}>Erro na Autenticação</h1>
        <p style={{ color: 'rgba(237,224,200,0.7)', marginBottom: '2rem' }}>{error}</p>
        <button 
          onClick={() => router.push('/login')}
          style={{
            padding: '0.85rem 2rem',
            borderRadius: '8px',
            background: 'rgba(201,168,76,0.08)',
            border: '1px solid rgba(201,168,76,0.3)',
            color: '#ede8c8',
            cursor: 'pointer'
          }}
        >
          Voltar para Login
        </button>
      </div>
    )
  }

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh' 
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(201,168,76,0.3)',
        borderTop: '3px solid #c9a84c',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <p style={{ 
        marginTop: '1rem', 
        color: 'rgba(237,224,200,0.7)',
        fontFamily: "var(--font-cinzel, 'Cinzel', serif)"
      }}>
        Autenticando...
      </p>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
