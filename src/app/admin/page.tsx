'use client'

import React from 'react'
import LoginForm from '@/components/LoginForm'
import LogoutButton from '@/components/LogoutButton'
import { useAuth } from '@/components/AuthProvider'

export default function HajilaBauAdminPage() {
  const auth = useAuth()
  const user = auth?.user ?? null
  const authLoading = auth?.loading ?? true

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Authentifizierung wird geladen…</div>
      </div>
    )
  }

  if (!user) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <LogoutButton />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Hajila Bau GmbH – Admin Dashboard (Debug Mode)
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Admin-Bereich geladen. Weitere Debugging-Schritte erforderlich.
          </p>
        </div>
      </div>
    </div>
  )
}
