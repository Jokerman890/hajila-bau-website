"use client";
import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
  return (
    <button
      onClick={() => supabase.auth.signOut()}
      className="bg-gray-200 px-4 py-2 rounded"
    >
      Logout
    </button>
  );
}
