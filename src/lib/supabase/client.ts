import { createClient } from '@supabase/supabase-js'

// Supabase Client Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Public client requires only the URL and anon key
export const isSupabaseClientConfigured = !!(supabaseUrl && supabaseAnonKey)
// Admin client additionally requires the service role key
export const isSupabaseConfigured = isSupabaseClientConfigured && !!supabaseServiceKey

// Public client for frontend operations (only if configured)
export const supabase = isSupabaseClientConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Admin client for backend operations (with service role key, only if configured)
export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null

// Storage bucket configuration
export const STORAGE_BUCKET = 'user-photos'
export const MAX_FILE_SIZE = 6 * 1024 * 1024 // 6MB
export const SIGNED_URL_EXPIRES_IN = 3600 // 60 minutes

// Allowed file types for photo uploads
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
]

export default supabase

