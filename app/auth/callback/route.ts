import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
<<<<<<< HEAD
  const next = searchParams.get('redirect') ?? '/'

  // Sanitiza: aceita apenas redirects relativos (evita open redirect)
  const safeNext = next.startsWith('/') ? next : '/'

  if (!code) {
    console.error('[auth/callback] Sem code param — provavel erro no OAuth')
    return NextResponse.redirect(`${origin}/login?error=missing_code`)
  }

  // IMPORTANTE: cria o response de redirect ANTES de instanciar o supabase
  // pois o setAll() precisa gravar cookies NESTE response especifico
  const redirectResponse = NextResponse.redirect(`${origin}${safeNext}`)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Grava os cookies de sessao no response que sera retornado
          cookiesToSet.forEach(({ name, value, options }) => {
            redirectResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession erro:', error.message)
    return NextResponse.redirect(`${origin}/login?error=auth_failed`)
  }

  // Sessao criada com sucesso — cookies ja gravados no redirectResponse
  return redirectResponse
}
=======
  const redirect = searchParams.get('redirect') || '/'

  if (code) {
    const supabaseResponse = NextResponse.redirect(`${origin}${redirect}`)

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return supabaseResponse
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`)
}
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
