import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace these with your actual Supabase URL and Anon Key!
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xxxx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbG...';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
