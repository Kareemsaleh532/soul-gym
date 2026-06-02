import fs from 'fs/promises';
import { createClient } from '@supabase/supabase-js';

async function main() {
  try {
    const envFile = await fs.readFile(new URL('../.env', import.meta.url));
    const envText = envFile.toString();
    const lines = envText.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      if (!line || line.trim().startsWith('#')) continue;
      const idx = line.indexOf('=');
      if (idx === -1) continue;
      const k = line.slice(0, idx).trim();
      const v = line.slice(idx + 1).trim();
      env[k] = v;
    }

    const url = env.VITE_SUPABASE_URL;
    const key = env.VITE_SUPABASE_ANON_KEY;
    if (!url || !key) {
      console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env');
      process.exit(2);
    }

    console.log('Using Supabase URL:', url);
    const supabase = createClient(url, key);

    console.log('Querying members (limit 2)...');
    const { data, error } = await supabase.from('members').select('*').limit(2);
    if (error) {
      console.error('Supabase error:', error.message || error);
      process.exit(3);
    }
    console.log('Success. Rows:', data?.length ?? 0);
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Script error:', err.message || err);
    process.exit(1);
  }
}

main();
