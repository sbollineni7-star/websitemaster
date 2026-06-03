import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

type SupabaseAuthFallback = {
  auth: {
    signUp: () => Promise<{ data: null; error: { message: string } }>
    signInWithPassword: () => Promise<{ data: null; error: { message: string } }>
    signOut: () => Promise<{ error: null }>
    onAuthStateChange: () => { data: { subscription: { unsubscribe: () => void } } }
  }
  rpc: (...args: readonly unknown[]) => Promise<{ data: null; error: { message: string } }>
}

const supabase: SupabaseClient | SupabaseAuthFallback = !supabaseUrl || !supabaseAnonKey
  ? {
      auth: {
        signUp: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signInWithPassword: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: async () => ({ error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      },
      rpc: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
    }
  : createClient(supabaseUrl, supabaseAnonKey)

export { supabase }
