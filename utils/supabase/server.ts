import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

<<<<<<< HEAD
// FIX: cookies() e assíncrono no Next.js 15 -- deve ser await-ado.
export async function createClient() {
  const cookieStore = await cookies()
=======
export async function createClient() {
  const cookieStore = cookies() // No Next.js 14, cookies() é síncrono
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
<<<<<<< HEAD
            // Em Server Components, set() lanca erro -- ignorado se middleware esta correto
=======
            // Em Server Components, set() lança erro — ignorado se o middleware tratar a sessão.
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
          }
        },
      },
    }
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> 0a56de5 (feat: Houses, Synastry, and deploy fixes)
