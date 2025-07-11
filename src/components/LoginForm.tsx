/**
 * src/components/LoginForm.tsx
 * Client-seitiges Login / Pass­wort-Reset für das Admin-Dashboard.
 */
"use client"

import { useState, type FormEvent } from "react"
import { supabase } from "@/lib/supabase/client"

export default function LoginForm() {
  /* ------------------------------------------------------------------ */
  /* State */
  const [resetMode, setResetMode] = useState(false)
  const [resetMsg, setResetMsg] = useState("")
  const [email, setEmail] = useState("")
  const [pw, setPw] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  /* ------------------------------------------------------------------ */
  /* Handlers */
  async function handleLogin(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!supabase) {
      setError("Supabase nicht konfiguriert")
      setLoading(false)
      return
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: pw,
    })

    if (authError) setError(authError.message)
    setLoading(false)
  }

  async function handleReset(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setResetMsg("")

    if (!supabase) {
      setError("Supabase nicht konfiguriert")
      setLoading(false)
      return
    }

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/admin` },
    )

    if (resetError) setError(resetError.message)
    else setResetMsg("E-Mail zum Zurücksetzen wurde gesendet.")
    setLoading(false)
  }

  async function handleOAuth() {
    setLoading(true)
    setError("")

    if (!supabase) {
      setError("Supabase nicht konfiguriert")
      setLoading(false)
      return
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin` },
    })

    if (oauthError) setError(oauthError.message)
    setLoading(false)
  }

  /* ------------------------------------------------------------------ */
  /* UI */
  return (
    <form
      onSubmit={resetMode ? handleReset : handleLogin}
      className="max-w-sm mx-auto p-4"
    >
      {/* Google-Login */}
      <button
        type="button"
        className="w-full bg-red-600 text-white p-2 mb-2 flex items-center justify-center gap-2 rounded"
        onClick={handleOAuth}
        disabled={loading}
      >
        {/* Google-Icon – Inline SVG, damit kein externes Asset nötig */}
        <svg width="20" height="20" viewBox="0 0 48 48">
          <path
            fill="#fff"
            d="M44.5 20H24v8.5h11.7C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.3 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-18h-21V20h21Z"
          />
        </svg>
        Mit Google anmelden
      </button>

      {/* E-Mail / Passwort */}
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 w-full border p-2"
        required
      />
      {!resetMode && (
        <input
          type="password"
          placeholder="Passwort"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          className="mb-2 w-full border p-2"
          required
        />
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2"
        disabled={loading}
      >
        {loading
          ? resetMode
            ? "Sende…"
            : "Login…"
          : resetMode
          ? "Passwort zurücksetzen"
          : "Login"}
      </button>

      {/* Links */}
      <div className="flex justify-between mt-2">
        {!resetMode ? (
          <button
            type="button"
            className="text-blue-600 underline text-sm"
            onClick={() => {
              setResetMode(true)
              setError("")
              setResetMsg("")
            }}
          >
            Passwort vergessen?
          </button>
        ) : (
          <button
            type="button"
            className="text-gray-600 underline text-sm"
            onClick={() => {
              setResetMode(false)
              setError("")
              setResetMsg("")
            }}
          >
            Zurück zum Login
          </button>
        )}
      </div>

      {/* Meldungen */}
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {resetMsg && <div className="text-green-600 mt-2">{resetMsg}</div>}
    </form>
  )
}
