import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// FIX: cookies() e assíncrono no Next.js 15 -- deve ser await-ado.
export async function createClient() {
  const cookieStore = await cookies()

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
            // Em Server Components, set() lanca erro -- ignorado se middleware esta correto
          }
        },
      },
    }
  )
}