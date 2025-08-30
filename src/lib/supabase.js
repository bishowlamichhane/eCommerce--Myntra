import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tydgwrfzmlscaoglzvir.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_PUBLIC_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
