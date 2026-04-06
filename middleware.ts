import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

<<<<<<< HEAD
const PROTECTED_ROUTES = ['/horoscopo', '/tarot']
=======
// Rotas que exigem autenticação
const PROTECTED_ROUTES = ['/horoscopo', '/tarot']
// Rotas de autenticação (nunca bloqueadas, e redireciona se já logado)
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
const AUTH_ROUTES = ['/login']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

<<<<<<< HEAD
  // 1. Otimizacao: ignora assets e rotas de sistema de imediato
  if (pathname.startsWith('/_next') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // 2. Bypass para callbacks de auth e APIs que nao requerem sessao no middleware
  if (pathname.startsWith('/auth') || pathname.startsWith('/api')) {
=======
  // Rotas de callback do auth passam sem qualquer interferência
  if (pathname.startsWith('/auth')) {
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
    return NextResponse.next()
  }

  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
<<<<<<< HEAD
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
=======
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Propaga cookies novos tanto no request quanto no response
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
        },
      },
    }
  )

<<<<<<< HEAD
  const { data: { user } } = await supabase.auth.getUser()
=======
  // CORREÇÃO: usa getUser() em vez de getSession()
  // getSession() apenas lê o cookie sem validar o JWT no servidor —
  // isso causa o loop de login porque sessões expiradas parecem válidas.
  // getUser() faz uma chamada autenticada ao Supabase e é a forma correta.
  const {
    data: { user },
  } = await supabase.auth.getUser()
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.includes(pathname)

<<<<<<< HEAD
  if (!user && isProtected) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

=======
  // Rota protegida sem sessão → redireciona para login
  if (!user && isProtected) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', pathname)

    const redirectResponse = NextResponse.redirect(redirectUrl)

    // Propaga cookies do supabaseResponse para não perder tokens
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value)
    })

    return redirectResponse
  }

  // Já autenticado tentando acessar login → vai para home
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
  if (user && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
<<<<<<< HEAD
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
=======
  matcher: [
    /*
     * Processa todas as rotas exceto:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagem)
     * - favicon.ico
     * - arquivos com extensão (imagens, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$).*)',
  ],
}
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
