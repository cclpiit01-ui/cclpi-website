import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_EMPLOYEES_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_EMPLOYEES_KEY

export const supabaseEmployees = createClient(supabaseUrl, supabaseKey)