import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = 'https://ohvthupxtafeaxhmnlsj.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9odnRodXB4dGFmZWF4aG1ubHNqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTAyMjYwMiwiZXhwIjoyMDk2NTk4NjAyfQ.kYx6gAwm3j8rsft6h5ymZ-8C2MGFkfywstii-jhdkZM';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

async function main() {
  console.log('🔌 Connecting to local SQLite database...');
  const db = await open({
    filename: path.join(__dirname, '..', 'server', 'soulgym.db'),
    driver: sqlite3.Database,
  });

  const rows = await db.all('SELECT * FROM members ORDER BY id ASC');
  console.log(`📊 Found ${rows.length} members in local SQLite.`);

  if (rows.length === 0) {
    console.log('⚠️ No members found to import.');
    return;
  }

  // Clear existing Supabase members first
  console.log('🧹 Clearing existing members in Supabase...');
  const { error: delError } = await supabase.from('members').delete().neq('id', 0);
  if (delError) {
    console.error('⚠️ Delete notice:', delError.message);
  }

  // Insert in batches of 100
  const BATCH_SIZE = 100;
  let imported = 0;

  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE).map(row => ({
      name: row.name,
      phone: row.phone || null,
      avatar: row.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(row.name)}`,
      plan_type: row.plan_type || 'Pro Membership',
      subscription_start: row.subscription_start || new Date().toISOString(),
      subscription_end: row.subscription_end,
      last_check_in: row.last_check_in || 'Never',
    }));

    const { data, error } = await supabase.from('members').insert(batch).select();

    if (error) {
      console.error(`❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, error.message);
    } else {
      imported += data ? data.length : batch.length;
      console.log(`✅ Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(rows.length / BATCH_SIZE)}: imported ${data ? data.length : batch.length} members (total: ${imported})`);
    }
  }

  console.log(`\n🎉 Success! Imported ${imported}/${rows.length} members into Supabase.`);
  await db.close();
}

main().catch(err => {
  console.error('💥 Fatal error:', err.message);
  process.exit(1);
});
