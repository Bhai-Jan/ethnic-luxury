/**
 * Ethnic Luxury Backend (Node.js + Express)
 *
 * Quick Start (MongoDB Atlas):
 * 1) Create a free MongoDB Atlas account and a cluster
 * 2) Whitelist your IP and create a database user
 * 3) Get the connection string (e.g., mongodb+srv://USER:PASSWORD@cluster0.xxxxx.mongodb.net/DBNAME)
 * 4) Copy .env.example to .env and set:
 *      MONGODB_URI=<your-atlas-connection-string>
 *      ADMIN_PASSWORD=<choose-a-strong-password>
 *      ADMIN_TOKEN=<any-random-secret-for-admin-requests>
 *      PORT=3000
 * 5) npm install
 * 6) npm start
 *
 * Notes:
 * - If MONGODB_URI is missing, the server uses an in-memory product store (not persisted).
 * - Admin routes (POST/PUT/DELETE) require a token in the 'x-admin-token' header that matches ADMIN_TOKEN.
 * - For image uploads, send "image" as multipart/form-data. The server will return a public image_url.
 */

const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'changeme';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-token';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Static files (serve the existing frontend and uploaded images)
app.use('/uploads', express.static(uploadsDir));
app.use(express.static(__dirname));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9_\-]/gi, '_');
    cb(null, `${Date.now()}_${base}${ext}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  }
});

// Simple auth: login issues a static token from env, protected routes check header
app.post('/api/login', (req, res) => {
  const { password } = req.body || {};
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ token: ADMIN_TOKEN });
});

function adminAuth(req, res, next) {
  const token = req.headers['x-admin-token'];
  if (!token || token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Mongo models + in-memory fallback
let ProductModel = null;
let FaqModel = null;
let TestimonialModel = null;
let MemberModel = null;
let useMongo = false;
const memoryStore = {
  products: [
    // Seed examples for in-memory mode (edit/delete freely in admin)
    { id: '1', name: 'Embroidered Silk Saree', description: 'Handwoven silk saree with intricate gold embroidery.', price: 599, image_url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', type: 'Sari', region: 'Pakistan' },
    { id: '2', name: 'Vibrant Dashiki Shirt', description: 'Traditional African print shirt in bold colors.', price: 450, image_url: 'https://images.unsplash.com/photo-1594575111057-47b35c5f98f7?auto=format&fit=crop&w=800&q=80', type: 'Dashiki', region: 'Africa' },
    { id: '3', name: 'Velvet Kurta Set', description: 'Luxurious velvet kurta paired with trousers.', price: 650, image_url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=800&q=80', type: 'Kurta', region: 'Pakistan' }
  ],
  faqs: [
    { id: 'f1', question: 'How long is shipping?', answer: 'Typically 7-14 days.' },
    { id: 'f2', question: 'What is your return policy?', answer: '30 days for unworn items in original packaging.' }
  ],
  testimonials: [
    { id: 't1', quote: 'Finally, I can find beautiful sarees in Stockholm!', cite: 'Aisha, Stockholm' },
    { id: 't2', quote: 'The quality of the kurta I bought was amazing.', cite: 'Fatima, Malmö' }
  ],
  members: []
};
let memIdCounter = 4;

async function initMongo() {
  if (!MONGODB_URI) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, { dbName: process.env.MONGODB_DB || undefined });
    const productSchema = new mongoose.Schema(
      {
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        image_url: { type: String, required: true },
        type: { type: String, required: true, enum: ['Sari','Kaftan','Dashiki','Abaya','Kurta','Dress','Accessory','Other'] },
        region: { type: String, required: true, trim: true }
      },
      { timestamps: true }
    );
    productSchema.set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      }
    });
    ProductModel = mongoose.model('Product', productSchema);

    const faqSchema = new mongoose.Schema(
      {
        question: { type: String, required: true, trim: true },
        answer: { type: String, required: true, trim: true }
      },
      { timestamps: true }
    );
    faqSchema.set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      }
    });
    FaqModel = mongoose.model('Faq', faqSchema);

    const testimonialSchema = new mongoose.Schema(
      {
        quote: { type: String, required: true, trim: true },
        cite: { type: String, required: true, trim: true }
      },
      { timestamps: true }
    );
    testimonialSchema.set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      }
    });
    TestimonialModel = mongoose.model('Testimonial', testimonialSchema);

    const memberSchema = new mongoose.Schema(
      {
        email: { type: String, required: true, trim: true, lowercase: true, unique: true },
        signup_date: { type: Date, default: Date.now }
      },
      { timestamps: true }
    );
    memberSchema.set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
      }
    });
    MemberModel = mongoose.model('Member', memberSchema);
    useMongo = true;
  } catch (err) {
    console.warn('[MongoDB] Connection failed, using in-memory store instead:', err.message);
  }
}

// Helpers for filtering
function buildFilter(query) {
  const filter = {};
  if (query.type && query.type.toLowerCase() !== 'all') {
    filter.type = query.type;
  }
  if (query.region && query.region.toLowerCase() !== 'all') {
    filter.region = query.region;
  }
  if (query.q) {
    const re = new RegExp(query.q, 'i');
    filter.$or = [{ name: re }, { description: re }, { type: re }, { region: re }];
  }
  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }
  return filter;
}

// Routes
app.get('/api/health', (req, res) => res.json({ ok: true }));

// ----- FAQs -----
app.get('/api/faqs', async (req, res) => {
  try {
    if (useMongo) {
      const items = await FaqModel.find().sort({ createdAt: -1 }).lean();
      return res.json(items.map(it => ({ ...it, id: String(it._id) })));
    }
    return res.json(memoryStore.faqs.slice().reverse());
  } catch {
    res.status(500).json({ error: 'Failed to fetch FAQs' });
  }
});

app.post('/api/faqs', adminAuth, async (req, res) => {
  try {
    const { question, answer } = req.body || {};
    if (!question || !answer) return res.status(400).json({ error: 'Missing fields' });
    if (useMongo) {
      const created = await FaqModel.create({ question, answer });
      return res.status(201).json(created.toJSON());
    }
    const item = { id: 'f' + memIdCounter++, question, answer };
    memoryStore.faqs.push(item);
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Failed to create FAQ' });
  }
});

app.put('/api/faqs/:id', adminAuth, async (req, res) => {
  try {
    const { question, answer } = req.body || {};
    if (useMongo) {
      const updated = await FaqModel.findByIdAndUpdate(req.params.id, { question, answer }, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.json({ ...updated, id: String(updated._id) });
    }
    const idx = memoryStore.faqs.findIndex(f => f.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    memoryStore.faqs[idx] = { ...memoryStore.faqs[idx], ...(question ? { question } : {}), ...(answer ? { answer } : {}) };
    res.json(memoryStore.faqs[idx]);
  } catch {
    res.status(500).json({ error: 'Failed to update FAQ' });
  }
});

app.delete('/api/faqs/:id', adminAuth, async (req, res) => {
  try {
    if (useMongo) {
      const deleted = await FaqModel.findByIdAndDelete(req.params.id).lean();
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      return res.json({ ok: true });
    }
    const len = memoryStore.faqs.length;
    memoryStore.faqs = memoryStore.faqs.filter(f => f.id !== req.params.id);
    if (memoryStore.faqs.length === len) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete FAQ' });
  }
});

// ----- Testimonials -----
app.get('/api/testimonials', async (req, res) => {
  try {
    if (useMongo) {
      const items = await TestimonialModel.find().sort({ createdAt: -1 }).lean();
      return res.json(items.map(it => ({ ...it, id: String(it._id) })));
    }
    return res.json(memoryStore.testimonials.slice().reverse());
  } catch {
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

app.post('/api/testimonials', adminAuth, async (req, res) => {
  try {
    const { quote, cite } = req.body || {};
    if (!quote || !cite) return res.status(400).json({ error: 'Missing fields' });
    if (useMongo) {
      const created = await TestimonialModel.create({ quote, cite });
      return res.status(201).json(created.toJSON());
    }
    const item = { id: 't' + memIdCounter++, quote, cite };
    memoryStore.testimonials.push(item);
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

app.put('/api/testimonials/:id', adminAuth, async (req, res) => {
  try {
    const { quote, cite } = req.body || {};
    if (useMongo) {
      const updated = await TestimonialModel.findByIdAndUpdate(req.params.id, { quote, cite }, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.json({ ...updated, id: String(updated._id) });
    }
    const idx = memoryStore.testimonials.findIndex(t => t.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    memoryStore.testimonials[idx] = { ...memoryStore.testimonials[idx], ...(quote ? { quote } : {}), ...(cite ? { cite } : {}) };
    res.json(memoryStore.testimonials[idx]);
  } catch {
    res.status(500).json({ error: 'Failed to update testimonial' });
  }
});

app.delete('/api/testimonials/:id', adminAuth, async (req, res) => {
  try {
    if (useMongo) {
      const deleted = await TestimonialModel.findByIdAndDelete(req.params.id).lean();
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      return res.json({ ok: true });
    }
    const len = memoryStore.testimonials.length;
    memoryStore.testimonials = memoryStore.testimonials.filter(t => t.id !== req.params.id);
    if (memoryStore.testimonials.length === len) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete testimonial' });
  }
});

// ----- Members (Club) -----
function validEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(email || '').toLowerCase());
}

app.post('/api/members', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!validEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    const normalized = String(email).toLowerCase().trim();
    if (useMongo) {
      try {
        const created = await MemberModel.create({ email: normalized, signup_date: new Date() });
        return res.status(201).json(created.toJSON());
      } catch (e) {
        return res.status(409).json({ error: 'Email already subscribed' });
      }
    }
    if (memoryStore.members.find(m => m.email === normalized)) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    const item = { id: 'm' + memIdCounter++, email: normalized, signup_date: new Date().toISOString() };
    memoryStore.members.push(item);
    res.status(201).json(item);
  } catch {
    res.status(500).json({ error: 'Failed to subscribe' });
  }
});

app.get('/api/members', adminAuth, async (req, res) => {
  try {
    if (useMongo) {
      const items = await MemberModel.find().sort({ createdAt: -1 }).lean();
      return res.json(items.map(it => ({ ...it, id: String(it._id) })));
    }
    return res.json(memoryStore.members.slice().reverse());
  } catch {
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

app.put('/api/members/:id', adminAuth, async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!validEmail(email)) return res.status(400).json({ error: 'Invalid email' });
    const normalized = String(email).toLowerCase().trim();
    if (useMongo) {
      try {
        const updated = await MemberModel.findByIdAndUpdate(req.params.id, { email: normalized }, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json({ error: 'Not found' });
        return res.json({ ...updated, id: String(updated._id) });
      } catch {
        return res.status(409).json({ error: 'Email already subscribed' });
      }
    }
    const idx = memoryStore.members.findIndex(m => m.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    if (memoryStore.members.some((m, i) => i !== idx && m.email === normalized)) {
      return res.status(409).json({ error: 'Email already subscribed' });
    }
    memoryStore.members[idx].email = normalized;
    res.json(memoryStore.members[idx]);
  } catch {
    res.status(500).json({ error: 'Failed to update member' });
  }
});

app.delete('/api/members/:id', adminAuth, async (req, res) => {
  try {
    if (useMongo) {
      const deleted = await MemberModel.findByIdAndDelete(req.params.id).lean();
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      return res.json({ ok: true });
    }
    const len = memoryStore.members.length;
    memoryStore.members = memoryStore.members.filter(m => m.id !== req.params.id);
    if (memoryStore.members.length === len) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Failed to delete member' });
  }
});

app.get('/api/members/export', adminAuth, async (req, res) => {
  try {
    let rows = [];
    if (useMongo) {
      const items = await MemberModel.find().sort({ createdAt: -1 }).lean();
      rows = items.map(m => [m.email, (m.signup_date || m.createdAt || new Date()).toISOString()]);
    } else {
      rows = memoryStore.members.map(m => [m.email, m.signup_date]);
    }
    const csv = ['email,signup_date', ...rows.map(r => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="members.csv"');
    res.send(csv);
  } catch {
    res.status(500).json({ error: 'Failed to export members' });
  }
});

app.get('/api/products', async (req, res) => {
  const filter = buildFilter(req.query);
  try {
    if (useMongo) {
      const items = await ProductModel.find(filter).sort({ createdAt: -1 }).lean();
      return res.json(items.map(it => ({ ...it, id: it._id ? String(it._id) : it.id })));
    }
    let items = memoryStore.products.slice();
    if (filter.type) items = items.filter(p => p.type === filter.type);
    if (filter.region) items = items.filter(p => p.region === filter.region);
    if (filter.$or) {
      const re = new RegExp(req.query.q, 'i');
      items = items.filter(p => re.test(p.name) || re.test(p.description) || re.test(p.type) || re.test(p.region));
    }
    if (filter.price) {
      if (filter.price.$gte != null) items = items.filter(p => p.price >= filter.price.$gte);
      if (filter.price.$lte != null) items = items.filter(p => p.price <= filter.price.$lte);
    }
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    if (useMongo) {
      const item = await ProductModel.findById(req.params.id).lean();
      if (!item) return res.status(404).json({ error: 'Not found' });
      return res.json({ ...item, id: String(item._id) });
    }
    const p = memoryStore.products.find(p => p.id === req.params.id);
    if (!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  } catch (e) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

app.post('/api/products', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, type, region, image_url } = req.body;
    const numericPrice = Number(price);
    if (!name || !description || !type || !region || Number.isNaN(numericPrice)) {
      return res.status(400).json({ error: 'Missing or invalid fields' });
    }
    let finalImageUrl = image_url && image_url.trim() ? image_url.trim() : null;
    if (!finalImageUrl && req.file) {
      finalImageUrl = `/uploads/${req.file.filename}`;
    }
    if (!finalImageUrl) {
      return res.status(400).json({ error: 'image or image_url is required' });
    }
    if (useMongo) {
      const created = await ProductModel.create({ name, description, price: numericPrice, image_url: finalImageUrl, type, region });
      return res.status(201).json(created.toJSON());
    }
    const newItem = { id: String(memIdCounter++), name, description, price: numericPrice, image_url: finalImageUrl, type, region };
    memoryStore.products.unshift(newItem);
    res.status(201).json(newItem);
  } catch (e) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.put('/api/products/:id', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, type, region, image_url } = req.body;
    const update = {};
    if (name) update.name = name;
    if (description) update.description = description;
    if (price != null) {
      const np = Number(price);
      if (Number.isNaN(np) || np < 0) return res.status(400).json({ error: 'Invalid price' });
      update.price = np;
    }
    if (type) update.type = type;
    if (region) update.region = region;
    if (req.file) update.image_url = `/uploads/${req.file.filename}`;
    else if (image_url && image_url.trim()) update.image_url = image_url.trim();

    if (useMongo) {
      const updated = await ProductModel.findByIdAndUpdate(req.params.id, update, { new: true }).lean();
      if (!updated) return res.status(404).json({ error: 'Not found' });
      return res.json({ ...updated, id: String(updated._id) });
    }
    const idx = memoryStore.products.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    memoryStore.products[idx] = { ...memoryStore.products[idx], ...update };
    res.json(memoryStore.products[idx]);
  } catch (e) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

app.delete('/api/products/:id', adminAuth, async (req, res) => {
  try {
    if (useMongo) {
      const deleted = await ProductModel.findByIdAndDelete(req.params.id).lean();
      if (!deleted) return res.status(404).json({ error: 'Not found' });
      return res.json({ ok: true });
    }
    const lenBefore = memoryStore.products.length;
    memoryStore.products = memoryStore.products.filter(p => p.id !== req.params.id);
    if (memoryStore.products.length === lenBefore) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Fallback: serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

initMongo().finally(() => {
  app.listen(PORT, () => {
    console.log(`Ethnic Luxury server running on http://localhost:${PORT}`);
    if (!MONGODB_URI) {
      console.log('No MONGODB_URI provided. Using in-memory store (data resets on restart).');
    }
  });
});

