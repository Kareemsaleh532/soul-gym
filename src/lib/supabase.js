import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'خطأ حرج: متغيرات بيئة Supabase مفقودة! يرجى التأكد من وجود ملف .env في جذر المشروع ويحتوي على VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY بشكل صحيح.\n' +
    'Critical Error: Supabase environment variables are missing! Please make sure that .env file exists at the root of the project and contains VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
