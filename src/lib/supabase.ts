import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/**
 * `supabase` is null when env vars are not configured.
 * All sync/auth code must guard with `if (!supabase) return`.
 * The app runs fully offline in that case.
 */
export const supabase = url && key ? createClient(url, key) : null
export const hasSupabase = supabase !== null
