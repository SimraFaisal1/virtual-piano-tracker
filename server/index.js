const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Simple request logger for debugging
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
const DB_FILE = path.join(DATA_DIR, 'songs.json');

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) return [];
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (e) {
    console.error('Failed to read DB', e);
    return [];
  }
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Seed initial songs if file missing or empty
let songs = readDb();
if (!songs || songs.length === 0) {
  songs = [
    { id: 1, title: 'Fur Elise', difficulty: 'medium', bpm: 90, key: 'A minor', description: 'Classical piece by Beethoven' },
    { id: 2, title: 'Twinkle Twinkle', difficulty: 'easy', bpm: 60, key: 'C major', description: 'Beginner melody' },
    { id: 3, title: 'Chopin Nocturne', difficulty: 'hard', bpm: 70, key: "E-flat major", description: 'Romantic era piece' }
  ];
  writeDb(songs);
  console.log('Seeded initial songs (JSON)');
}

function nextId(items) {
  return items.reduce((max, s) => Math.max(max, s.id || 0), 0) + 1;
}

// List songs
app.get('/api/songs', (req, res) => {
  const list = readDb().map(({ id, title, difficulty, bpm, key, description }) => ({ id, title, difficulty, bpm, key, description }));
  res.json(list);
});

// Get single song
app.get('/api/songs/:id', (req, res) => {
  const id = Number(req.params.id);
  const item = readDb().find((s) => s.id === id);
  if (!item) return res.status(404).json({ error: 'Song not found' });
  res.json(item);
});

// Create song
app.post('/api/songs', (req, res) => {
  const { title, difficulty, bpm, key: songKey, description } = req.body;
  if (!title || !difficulty) return res.status(400).json({ error: 'title and difficulty are required' });
  const db = readDb();
  const id = nextId(db);
  const created = { id, title, difficulty, bpm: bpm || null, key: songKey || null, description: description || null };
  db.push(created);
  writeDb(db);
  res.status(201).json(created);
});

// Update song
app.put('/api/songs/:id', (req, res) => {
  const id = Number(req.params.id);
  const { title, difficulty, bpm, key: songKey, description } = req.body;
  const db = readDb();
  const idx = db.findIndex((s) => s.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Song not found' });
  const updated = { ...db[idx], title: title ?? db[idx].title, difficulty: difficulty ?? db[idx].difficulty, bpm: bpm ?? db[idx].bpm, key: songKey ?? db[idx].key, description: description ?? db[idx].description };
  db[idx] = updated;
  writeDb(db);
  res.json(updated);
});

// Delete song
app.delete('/api/songs/:id', (req, res) => {
  const id = Number(req.params.id);
  let db = readDb();
  const initialLen = db.length;
  db = db.filter((s) => s.id !== id);
  if (db.length === initialLen) return res.status(404).json({ error: 'Song not found' });
  writeDb(db);
  res.status(204).end();
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
