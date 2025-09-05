
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { nanoid } from 'nanoid';

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));

// static uploads
app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')));

const DATA_FILE = join(process.cwd(), 'data', 'db.json');

function loadDB() {
  if (!existsSync(DATA_FILE)) {
    const initial = { users: [], coupons: [] };
    writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
}
function saveDB(db) {
  writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
}

app.post('/auth/mock', (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email required' });
  const db = loadDB();
  let user = db.users.find(u => u.email === email);
  if (!user) {
    user = { id: nanoid(), email, createdAt: new Date().toISOString() };
    db.users.push(user);
    saveDB(db);
  }
  const token = 'mock-' + user.id;
  res.json({ token, user });
});

// multer for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(process.cwd(), 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const ext = (file.originalname || '').split('.').pop();
    cb(null, Date.now() + '-' + Math.random().toString(36).slice(2,9) + '.' + ext);
  }
});
const upload = multer({ storage });

app.get('/coupons', (req, res) => {
  const db = loadDB();
  res.json(db.coupons.sort((a,b) => new Date(a.expiresAt) - new Date(b.expiresAt)));
});

app.post('/coupons', upload.single('image'), (req, res) => {
  const db = loadDB();
  const { title, storeName, category, expiresAt, code, terms, ownerId } = req.body || {};
  if (!title || !storeName || !expiresAt) return res.status(400).json({ error: 'title, storeName, expiresAt required' });
  // dedupe by code+store+expiresAt if code present
  if (code) {
    const dup = db.coupons.find(c => c.code === code && c.storeName === storeName && c.expiresAt === expiresAt);
    if (dup) return res.status(409).json({ error: 'Duplicate coupon detected' });
  }
  const imageUrl = req.file ? ('/uploads/' + req.file.filename) : null;
  const coupon = {
    id: nanoid(),
    ownerId: ownerId || null,
    createdAt: new Date().toISOString(),
    claimedBy: null,
    imageUrl,
    code: code || null,
    storeName,
    title,
    category: category || 'Autre',
    expiresAt,
    terms: terms || ''
  };
  db.coupons.push(coupon);
  saveDB(db);
  res.status(201).json(coupon);
});

app.get('/coupons/:id', (req, res) => {
  const db = loadDB();
  const c = db.coupons.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  res.json(c);
});

app.post('/coupons/:id/claim', (req, res) => {
  const db = loadDB();
  const { userId } = req.body || {};
  const c = db.coupons.find(x => x.id === req.params.id);
  if (!c) return res.status(404).json({ error: 'Not found' });
  if (c.claimedBy) return res.status(409).json({ error: 'Already claimed' });
  if (new Date(c.expiresAt) < new Date()) return res.status(410).json({ error: 'Expired' });
  c.claimedBy = userId || 'anonymous';
  saveDB(db);
  res.json(c);
});

app.delete('/coupons/:id', (req, res) => {
  const db = loadDB();
  const idx = db.coupons.findIndex(x => x.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  db.coupons.splice(idx,1);
  saveDB(db);
  res.json({ ok: true });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('BonPartage backend (web) running on', PORT));
