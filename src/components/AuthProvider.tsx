/**
 * src/components/AuthProvider.tsx
 * Kümmert sich um Supabase-Auth-State im Client.
 */
"use client"

import "@/lib/polyfills"                // Buffer-Polyfill u. a.
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react"

import { type User } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"

/* ------------------------------------------------------------------ */
/* Context */
type AuthCtx = { user: User | null; loading: boolean }
const AuthContext = createContext<AuthCtx | null>(null)

/* ------------------------------------------------------------------ */
/* Provider */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!supabase) {
      console.error("Supabase client is null")
      setLoading(false)
      return
    }

    /* Realtime-Listener */
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      },
    )

    /* Initial State */
    void supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null)
      setLoading(false)
    })

    /* Cleanup */
    return () => listener?.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

/* ------------------------------------------------------------------ */
/* Hook */
export function useAuth() {
  return useContext(AuthContext)
}
