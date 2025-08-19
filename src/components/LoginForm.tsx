"use client";
import { useState } from "react";
import supabaseDefault, { supabase as supabaseMaybe, isSupabaseConfigured } from "@/lib/supabase/client";
const supabase = supabaseMaybe ?? supabaseDefault;

export default function LoginForm() {
  const [resetMode, setResetMode] = useState(false);
  const [registerMode, setRegisterMode] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase ist nicht konfiguriert.");
      return;
    }
    setLoading(true);
    setError("");
    if (registerMode) {
      // Registrierung: Test-User anlegen und direkt einloggen (falls E-Mail-Bestätigung deaktiviert ist)
      const signUp = await supabase.auth.signUp({ email, password: pw });
      if (signUp.error) {
        setError(signUp.error.message);
        setLoading(false);
        return;
      }
      // Wenn E-Mail-Bestätigung aktiv ist, ist session null
      if (!signUp.data.session) {
        setError("Registrierung abgeschlossen. Bitte E-Mail bestätigen und erneut einloggen.");
        setLoading(false);
        return;
      }
      // Erfolgreich registriert & eingeloggt
      setLoading(false);
      return;
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      if (error) setError(error.message);
      setLoading(false);
    }
  }

  async function handleReset(e) {
    e.preventDefault();
    if (!supabase) {
      setError("Supabase ist nicht konfiguriert.");
      return;
    }
    setLoading(true);
    setError("");
    setResetMsg("");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/admin"
    });
    if (error) setError(error.message);
    else setResetMsg("E-Mail zum Zurücksetzen wurde gesendet.");
    setLoading(false);
  }

  return (
    <form onSubmit={resetMode ? handleReset : handleLogin} className="max-w-sm mx-auto p-4">
      <button
        type="button"
        className="w-full bg-red-600 text-white p-2 mb-2 flex items-center justify-center gap-2 rounded"
        onClick={async () => {
          if (!supabase) {
            setError("Supabase ist nicht konfiguriert.");
            return;
          }
          setLoading(true);
          setError("");
          const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
              redirectTo: window.location.origin + "/admin"
            }
          });
          if (error) setError(error.message);
          setLoading(false);
        }}
        disabled={loading}
      >
        <svg width="20" height="20" viewBox="0 0 48 48"><g><path fill="#fff" d="M44.5 20H24v8.5h11.7C34.1 33.1 29.6 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c2.7 0 5.2.9 7.2 2.5l6.4-6.4C34.3 5.1 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 19.5-7.6 21-18h-21v-8.5h21z"/></g></svg>
        Mit Google anmelden
      </button>
      <input
        type="email"
        placeholder="E-Mail"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="mb-2 w-full border p-2"
        required
      />
      {!resetMode && (
        <input
          type="password"
          placeholder={registerMode ? "Passwort (neu vergeben)" : "Passwort"}
          value={pw}
          onChange={e => setPw(e.target.value)}
          className="mb-2 w-full border p-2"
          required
        />
      )}
      <button type="submit" className="w-full bg-blue-600 text-white p-2" disabled={loading}>
        {loading
          ? (resetMode ? 'Sende...' : (registerMode ? 'Registriere...' : 'Login...'))
          : (resetMode ? 'Passwort zurücksetzen' : (registerMode ? 'Registrieren' : 'Login'))
        }
      </button>
      <div className="flex justify-between mt-2">
        {!resetMode && (
          <button type="button" className="text-blue-600 underline text-sm" onClick={() => { setResetMode(true); setRegisterMode(false); setError(""); setResetMsg(""); }}>
            Passwort vergessen?
          </button>
        )}
        {resetMode && (
          <button type="button" className="text-gray-600 underline text-sm" onClick={() => { setResetMode(false); setError(""); setResetMsg(""); }}>
            Zurück zum Login
          </button>
        )}
        {!resetMode && (
          <button type="button" className="text-blue-600 underline text-sm" onClick={() => { setRegisterMode(!registerMode); setError(""); setResetMsg(""); }}>
            {registerMode ? 'Ich habe bereits ein Konto' : 'Account erstellen'}
          </button>
        )}
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      {resetMsg && <div className="text-green-600 mt-2">{resetMsg}</div>}
    </form>
  );
}
