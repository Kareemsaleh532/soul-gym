import express from 'express';
import cors from 'cors';
import { setupDb } from './db.js';
import { addMonths, addYears, addDays } from 'date-fns';

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

let db;

setupDb().then((database) => {
  db = database;
  console.log('Connected to SQLite database');
  
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});

// Get all members
app.get('/api/members', async (req, res) => {
  try {
    const members = await db.all('SELECT * FROM members ORDER BY subscription_end ASC');
    res.json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notifications (expired members)
app.get('/api/notifications', async (req, res) => {
  try {
    const now = new Date().toISOString();
    const expiredMembers = await db.all(
      'SELECT * FROM members WHERE subscription_end < ? ORDER BY subscription_end DESC',
      [now]
    );
    res.json(expiredMembers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add a new member
app.post('/api/members', async (req, res) => {
  console.log('POST /api/members received:', req.body);
  const { name, phone, plan_type, duration_months, duration_days } = req.body;
  
  // Validation
  if (phone) {
    const phoneRegex = /^(056|059)\d{7}$/;
    if (!phoneRegex.test(phone)) {
      console.log('Validation failed for phone:', phone);
      return res.status(400).json({ error: 'Phone number must be 10 digits and start with 056 or 059' });
    }
  }

  try {

    const startDate = new Date();
    let endDate;
    
    if (duration_days) {
      endDate = addDays(startDate, parseInt(duration_days));
    } else if (duration_months === 12) {
      endDate = addYears(startDate, 1);
    } else {
      endDate = addMonths(startDate, parseInt(duration_months));
    }

    const avatar = `https://i.pravatar.cc/150?u=${phone || encodeURIComponent(name)}`;
    
    const result = await db.run(
      'INSERT INTO members (name, phone, avatar, plan_type, subscription_start, subscription_end, last_check_in) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, phone, avatar, plan_type, startDate.toISOString(), endDate.toISOString(), 'Never']
    );

    const newMember = await db.get('SELECT * FROM members WHERE id = ?', result.lastID);
    res.status(201).json(newMember);
  } catch (error) {
    console.error('Error adding member:', error);
    res.status(500).json({ error: error.message });
  }
});


// Check-in member (demo purpose)
app.post('/api/members/:id/checkin', async (req, res) => {
  try {
    await db.run(
      'UPDATE members SET last_check_in = ? WHERE id = ?',
      [new Date().toLocaleTimeString(), req.params.id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a member
app.put('/api/members/:id', async (req, res) => {
  const { name, phone, plan_type, subscription_end } = req.body;
  
  if (phone) {
    const phoneRegex = /^(056|059)\d{7}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ error: 'Phone number must be 10 digits and start with 056 or 059' });
    }
  }

  try {
    await db.run(
      'UPDATE members SET name = ?, phone = ?, plan_type = ?, subscription_end = ? WHERE id = ?',
      [name, phone, plan_type, subscription_end, req.params.id]
    );
    const updatedMember = await db.get('SELECT * FROM members WHERE id = ?', req.params.id);
    res.json(updatedMember);
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete a member
app.delete('/api/members/:id', async (req, res) => {
  try {
    await db.run('DELETE FROM members WHERE id = ?', req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
