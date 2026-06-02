import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env vars from .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env file");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  const dbPath = process.argv[2] || path.join(__dirname, '../server/soulgym.db');
  console.log(`Reading from SQLite database: ${dbPath}`);

  try {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    const members = await db.all('SELECT name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in FROM members');
    console.log(`Found ${members.length} members in local database. Uploading to Supabase...`);

    const formattedMembers = members.map(m => ({
      ...m,
      phone: m.phone || "0000000000" // provide a default phone to satisfy not-null constraint
    }));

    // Optionally handle chunking if there are too many records, but Supabase can handle a few thousand easily in one go.
    const { data, error } = await supabase
      .from('members')
      .insert(formattedMembers)
      .select();

    if (error) {
      console.error('Error inserting data into Supabase:', error);
    } else {
      console.log(`Successfully migrated ${data.length} members to Supabase!`);
    }

    await db.close();
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateData();
