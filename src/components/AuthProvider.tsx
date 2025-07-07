"use client";
import '../lib/polyfills';
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

const AuthContext = createContext<{ user: any; loading: boolean } | null>(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (supabase) {
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      });
      supabase.auth.getUser().then(({ data }) => {
        setUser(data?.user ?? null);
        setLoading(false);
      });
      return () => listener?.subscription.unsubscribe();
    } else {
      console.error("Supabase client is null");
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
