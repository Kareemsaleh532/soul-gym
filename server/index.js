import express from 'express';
import cors from 'cors';
import { getDb } from './db.js'; // SQLite helper
import { addMonths, addYears, addDays } from 'date-fns';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({ origin: true }));
app.use(express.json());

/* ---------- Helper ---------- */
const buildMember = (row) => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  avatar: row.avatar,
  plan_type: row.plan_type,
  subscription_start: row.subscription_start,
  subscription_end: row.subscription_end,
  last_check_in: row.last_check_in,
});

/* ---------- Get all members ---------- */
app.get('/api/members', async (req, res) => {
  try {
    const db = await getDb();
    const rows = await db.all('SELECT * FROM members ORDER BY subscription_end ASC');
    res.json(rows.map(buildMember));
  } catch (err) {
    console.error('Get members error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------- Get notifications (expired) ---------- */
app.get('/api/notifications', async (req, res) => {
  try {
    const now = new Date().toISOString();
    const db = await getDb();
    const rows = await db.all(
      'SELECT * FROM members WHERE subscription_end < ? ORDER BY subscription_end DESC',
      now
    );
    res.json(rows.map(buildMember));
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------- Add a new member ---------- */
app.post('/api/members', async (req, res) => {
  const { name, phone, plan_type, duration_months, duration_days } = req.body;
  if (phone) {
    const phoneRegex = /^(056|059)\d{7}$/;
    if (!phoneRegex.test(phone))
      return res.status(400).json({ error: 'Phone number must be 10 digits and start with 056 or 059' });
  }
  const startDate = new Date();
  let endDate;
  if (duration_days) {
    endDate = addDays(startDate, parseInt(duration_days));
  } else if (duration_months == 12) {
    endDate = addYears(startDate, 1);
  } else {
    endDate = addMonths(startDate, parseInt(duration_months));
  }
  const avatar = `https://i.pravatar.cc/150?u=${phone || encodeURIComponent(name)}`;
  try {
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO members (name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      name,
      phone,
      avatar,
      plan_type,
      startDate.toISOString(),
      endDate.toISOString(),
      'Never'
    );
    const newRow = await db.get('SELECT * FROM members WHERE id = ?', result.lastID);
    res.status(201).json(buildMember(newRow));
  } catch (err) {
    console.error('Error adding member:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------- Check‑in member (demo) ---------- */
app.post('/api/members/:id/checkin', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.run(
      'UPDATE members SET last_check_in = ? WHERE id = ?',
      new Date().toLocaleTimeString(),
      id
    );
    res.json({ success: true });
  } catch (err) {
    console.error('Check‑in error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------- Update a member ---------- */
app.put('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, plan_type, subscription_end } = req.body;
  if (phone) {
    const phoneRegex = /^(056|059)\d{7}$/;
    if (!phoneRegex.test(phone))
      return res.status(400).json({ error: 'Phone number must be 10 digits and start with 056 or 059' });
  }
  try {
    const db = await getDb();
    await db.run(
      `UPDATE members SET name = ?, phone = ?, plan_type = ?, subscription_end = ? WHERE id = ?`,
      name,
      phone,
      plan_type,
      subscription_end,
      id
    );
    const updated = await db.get('SELECT * FROM members WHERE id = ?', id);
    res.json(buildMember(updated));
  } catch (err) {
    console.error('Update member error:', err);
    res.status(500).json({ error: err.message });
  }
});

/* ---------- Delete a member ---------- */
app.delete('/api/members/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();
    await db.run('DELETE FROM members WHERE id = ?', id);
    res.json({ success: true });
  } catch (err) {
    console.error('Delete member error:', err);
    res.status(500).json({ error: err.message });
  }
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}
