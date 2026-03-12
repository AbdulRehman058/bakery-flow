import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://awvikepfgzhyiiyuyspw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_MeqRxKFDw5nN4e9uoOGWew__DqxBrvd';

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
