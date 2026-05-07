import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function setupDb() {
  const db = await open({
    filename: path.join(__dirname, 'soulgym.db'),
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      avatar TEXT,
      plan_type TEXT NOT NULL,
      subscription_start DATETIME DEFAULT CURRENT_TIMESTAMP,
      subscription_end DATETIME NOT NULL,
      last_check_in TEXT
    )
  `);

  // Check if seeding is needed
  const count = await db.get('SELECT COUNT(*) as count FROM members');
  if (count.count === 0) {
    const { addMonths, addDays, subDays } = await import('date-fns');
    const now = new Date();
    
    await db.run(`
      INSERT INTO members (name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in)
      VALUES 
      ('Alex Johnson', '0569123456', 'https://i.pravatar.cc/150?u=1', 'Pro Membership', ?, ?, '2 hours ago'),
      ('Sarah Miller', '0598765432', 'https://i.pravatar.cc/150?u=2', 'Basic Plan', ?, ?, 'Yesterday'),
      ('Mike Ross', '0561112223', 'https://i.pravatar.cc/150?u=3', 'Elite Training', ?, ?, '1 week ago')
    `, [
      now.toISOString(), addDays(now, 20).toISOString(),
      now.toISOString(), addDays(now, 3).toISOString(),
      now.toISOString(), subDays(now, 2).toISOString()
    ]);
  }

  return db;
}
