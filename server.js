const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 3000;
const isVercel = process.env.VERCEL === '1' || process.env.VERCEL;
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/src', express.static(path.join(__dirname, 'public')));

// Varsayılan Veritabanı Yapısı
const defaultData = {
  profiles: [
    { id: 'user_1', name: 'Ahmet', role: 'Koca', avatar: '👨‍💼', color: '#3b82f6' },
    { id: 'user_2', name: 'Ayşe', role: 'Hanım', avatar: '👩‍💼', color: '#ec4899' }
  ],
  categories: [
    // Gelir Kategorileri
    { id: 'cat_inc_1', type: 'income', name: 'Maaş', icon: '💵', color: '#10b981', isDefault: true },
    { id: 'cat_inc_2', type: 'income', name: 'Ek Gelir / Prim', icon: '💼', color: '#059669', isDefault: true },
    { id: 'cat_inc_3', type: 'income', name: 'Yatırım / Getiri', icon: '📈', color: '#047857', isDefault: true },
    { id: 'cat_inc_4', type: 'income', name: 'Diğer Gelirler', icon: '🎁', color: '#34d399', isDefault: true },

    // Gider Kategorileri
    { id: 'cat_exp_1', type: 'outcome', name: 'Kredi Kartı', icon: '💳', color: '#ef4444', isDefault: true },
    { id: 'cat_exp_2', type: 'outcome', name: 'Kredi / Taksit', icon: '🏦', color: '#dc2626', isDefault: true },
    { id: 'cat_exp_3', type: 'outcome', name: 'Nakit Harcama', icon: '💸', color: '#f59e0b', isDefault: true },
    { id: 'cat_exp_4', type: 'outcome', name: 'Kira & Ev', icon: '🏠', color: '#8b5cf6', isDefault: true },
    { id: 'cat_exp_5', type: 'outcome', name: 'Faturalar', icon: '⚡', color: '#6366f1', isDefault: true },
    { id: 'cat_exp_6', type: 'outcome', name: 'Market & Mutfak', icon: '🛒', color: '#10b981', isDefault: true },
    { id: 'cat_exp_7', type: 'outcome', name: 'Dışarıda Yeme & Kahve', icon: '☕', color: '#d97706', isDefault: true },
    { id: 'cat_exp_8', type: 'outcome', name: 'Ulaşım & Yakıt', icon: '🚗', color: '#0284c7', isDefault: true },
    { id: 'cat_exp_9', type: 'outcome', name: 'Sağlık & Bakım', icon: '💊', color: '#ec4899', isDefault: true },
    { id: 'cat_exp_10', type: 'outcome', name: 'Eğlence & Abonelikler', icon: '🎬', color: '#a855f7', isDefault: true },
    { id: 'cat_exp_11', type: 'outcome', name: 'Giyim & Alışveriş', icon: '🛍️', color: '#f43f5e', isDefault: true }
  ],
  transactions: [
    {
      id: 'tx_demo_1',
      type: 'income',
      amount: 45000,
      categoryId: 'cat_inc_1',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      profileId: 'user_1',
      paymentMethod: 'Banka Transferi',
      note: 'Ağustos Maaşı',
      isShared: true
    },
    {
      id: 'tx_demo_2',
      type: 'income',
      amount: 42000,
      categoryId: 'cat_inc_1',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
      profileId: 'user_2',
      paymentMethod: 'Banka Transferi',
      note: 'Ağustos Maaşı',
      isShared: true
    },
    {
      id: 'tx_demo_3',
      type: 'outcome',
      amount: 14500,
      categoryId: 'cat_exp_4',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 5).toISOString().split('T')[0],
      profileId: 'user_1',
      paymentMethod: 'Banka Transferi',
      note: 'Ev Kirası',
      isShared: true
    },
    {
      id: 'tx_demo_4',
      type: 'outcome',
      amount: 18200,
      categoryId: 'cat_exp_1',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 12).toISOString().split('T')[0],
      profileId: 'user_1',
      paymentMethod: 'Kredi Kartı',
      note: 'Bonus Kart Dönem İçi Harcama',
      isShared: true
    },
    {
      id: 'tx_demo_5',
      type: 'outcome',
      amount: 12400,
      categoryId: 'cat_exp_1',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 14).toISOString().split('T')[0],
      profileId: 'user_2',
      paymentMethod: 'Kredi Kartı',
      note: 'World Kart Ekstre Ödemesi',
      isShared: true
    },
    {
      id: 'tx_demo_6',
      type: 'outcome',
      amount: 3500,
      categoryId: 'cat_exp_3',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 18).toISOString().split('T')[0],
      profileId: 'user_2',
      paymentMethod: 'Nakit',
      note: 'Haftalık Pazar & Şarküteri',
      isShared: true
    },
    {
      id: 'tx_demo_7',
      type: 'outcome',
      amount: 4800,
      categoryId: 'cat_exp_2',
      date: new Date(new Date().getFullYear(), new Date().getMonth(), 20).toISOString().split('T')[0],
      profileId: 'user_1',
      paymentMethod: 'Banka Transferi',
      note: 'İhtiyaç Kredisi 4. Taksit',
      isShared: true
    }
  ],
  settings: {
    currency: '₺',
    currencyPosition: 'after',
    pinCode: '',
    isPinEnabled: false,
    masterPassword: '1234', // Default Master Password (Kullanıcı değiştirebilir)
    activeProfileId: 'all'
  }
};

// Simple In-Memory Session Token Storage
const validSessions = new Set(['demo_persistent_session_token']);

// ============================================================
// Supabase Bulut Veritabanı Fonksiyonları (Birincil Kaynak)
// Yerel dosya yalnızca çevrimdışı yedek olarak kullanılır.
// ============================================================

let globalDbCache = null;

async function readDb() {
  // 1) Supabase'den oku (birincil kaynak)
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('app_state')
        .select('data')
        .eq('id', 'household')
        .single();

      if (!error && data && data.data && Object.keys(data.data).length > 0) {
        globalDbCache = data.data;
        return data.data;
      }
    } catch (e) {
      console.warn('Supabase okuma hatası:', e.message);
    }
  }

  // 2) Yerel dosya yedek
  try {
    initDb();
    if (fs.existsSync(DB_FILE)) {
      const fileData = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(fileData);
      globalDbCache = parsed;
      return parsed;
    }
  } catch (err) {
    console.error('Yerel veritabanı okuma hatası:', err);
  }

  // 3) Bellek yedek
  if (globalDbCache) return globalDbCache;

  // 4) Varsayılan veri
  globalDbCache = defaultData;
  return defaultData;
}

async function writeDb(data) {
  globalDbCache = data;

  // 1) Supabase'e yaz (birincil kaynak)
  if (supabase) {
    try {
      const { error } = await supabase
        .from('app_state')
        .upsert({
          id: 'household',
          data: data,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' });

      if (error) {
        console.error('Supabase yazma hatası:', error.message);
        console.error('Supabase hatası:', error);
      }
    } catch (e) {
      console.error('Supabase bağlantı hatası:', e.message);
    }
  }

  // 2) Yerel dosyaya da yaz (yedek)
  try {
    initDb();
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error('Yerel dosya yazma hatası:', err);
  }

  return true;
}

// Veri klasörünü ve dosyasını oluştur
function initDb() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

// Auth Endpoints

// Giriş Yap (Login)
app.post('/api/auth/login', async (req, res) => {
  const db = await readDb();
  const { password } = req.body;
  const currentMasterPassword = (db.settings && db.settings.masterPassword) ? db.settings.masterPassword : '1234';

  if (password === currentMasterPassword) {
    const sessionToken = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 8);
    validSessions.add(sessionToken);
    res.json({ success: true, token: sessionToken, message: 'Giriş başarılı' });
  } else {
    res.status(401).json({ success: false, message: 'Hatalı şifre! Lütfen tekrar deneyin.' });
  }
});

// Oturum Doğrulama (Verify Token)
app.post('/api/auth/verify', (req, res) => {
  const { token } = req.body;
  if (token && (validSessions.has(token) || token === 'demo_persistent_session_token')) {
    res.json({ success: true, valid: true });
  } else {
    res.json({ success: false, valid: false });
  }
});

// Şifre Değiştirme
app.post('/api/auth/change-password', async (req, res) => {
  const db = await readDb();
  const { currentPassword, newPassword } = req.body;
  const master = (db.settings && db.settings.masterPassword) ? db.settings.masterPassword : '1234';

  if (currentPassword === master) {
    db.settings.masterPassword = newPassword;
    await writeDb(db);
    res.json({ success: true, message: 'Şifre başarıyla değiştirildi!' });
  } else {
    res.status(400).json({ success: false, message: 'Mevcut şifre hatalı.' });
  }
});

// API Endpointleri

// Tum Durumu Getir
app.get('/api/state', async (req, res) => {
  const db = await readDb();
  res.json({ success: true, data: db });
});

// Tum Durumu Guncelle (Sync / Import)
app.post('/api/state', async (req, res) => {
  const newState = req.body;
  if (!newState || typeof newState !== 'object') {
    return res.status(400).json({ success: false, message: 'Geçersiz veri' });
  }
  await writeDb(newState);
  res.json({ success: true, data: newState });
});

// Islem Ekle
app.post('/api/transactions', async (req, res) => {
  const db = await readDb();
  const tx = req.body;
  if (!tx.id) tx.id = 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
  db.transactions.unshift(tx);
  await writeDb(db);
  res.json({ success: true, data: tx });
});

// Islem Duzenle
app.put('/api/transactions/:id', async (req, res) => {
  const db = await readDb();
  const index = db.transactions.findIndex(t => t.id === req.params.id);
  if (index !== -1) {
    db.transactions[index] = { ...db.transactions[index], ...req.body };
    await writeDb(db);
    res.json({ success: true, data: db.transactions[index] });
  } else {
    res.status(404).json({ success: false, message: 'İşlem bulunamadı' });
  }
});

// Islem Sil
app.delete('/api/transactions/:id', async (req, res) => {
  const db = await readDb();
  db.transactions = db.transactions.filter(t => t.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'İşlem silindi' });
});

// Kategori Ekle
app.post('/api/categories', async (req, res) => {
  const db = await readDb();
  const cat = req.body;
  if (!cat.id) cat.id = 'cat_custom_' + Date.now();
  db.categories.push(cat);
  await writeDb(db);
  res.json({ success: true, data: cat });
});

// Kategori Sil
app.delete('/api/categories/:id', async (req, res) => {
  const db = await readDb();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  await writeDb(db);
  res.json({ success: true, message: 'Kategori silindi' });
});

// Profilleri Guncelle
app.post('/api/profiles', async (req, res) => {
  const db = await readDb();
  db.profiles = req.body.profiles;
  await writeDb(db);
  res.json({ success: true, data: db.profiles });
});

// Ayarlari Guncelle
app.post('/api/settings', async (req, res) => {
  const db = await readDb();
  db.settings = { ...db.settings, ...req.body };
  await writeDb(db);
  res.json({ success: true, data: db.settings });
});

// Fallback index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

if (require.main === module || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🏡 Ev Ekonomisi & Aile Bütçesi Sunucusu Hazır!`);
    console.log(`🌐 Erişim Adresi: http://localhost:${PORT}`);
    console.log(`📦 Supabase: ${supabase ? '✅ Bağlı' : '❌ Bağlı Değil (SUPABASE_URL/KEY eksik)'}`);
    console.log(`==================================================`);
  });
}

module.exports = app;

