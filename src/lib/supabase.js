import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tydgwrfzmlscaoglzvir.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_PUBLIC_KEY // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
