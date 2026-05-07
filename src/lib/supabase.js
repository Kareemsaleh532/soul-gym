import { createClient } from '@supabase/supabase-js';

// TODO: Add your own Supabase credentials here
const supabaseUrl = ''; 
const supabaseAnonKey = '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
