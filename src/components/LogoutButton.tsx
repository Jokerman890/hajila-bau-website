"use client";
import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
  const handleLogout = () => {
    if (!supabase) return
    supabase.auth.signOut()
  }
  return (
    <button onClick={handleLogout} className="bg-gray-200 px-4 py-2 rounded">
      Logout
    </button>
  )
}
