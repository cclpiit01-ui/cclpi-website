import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// 1. I-export ang Supabase client (2 arguments lang dapat)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. I-export ang Mapbox token bilang isang constant variable
export const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN