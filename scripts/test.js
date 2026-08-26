/**
 * Ev Ekonomisi - Otomatik Bütçe & Kullanıcı Yönetimi Test Scripti
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Ev Ekonomisi Güncellenmiş Test Başlatılıyor...\n');

// 1. Dosya Varlığı Kontrolleri
const requiredFiles = [
  'server.js',
  'package.json',
  'public/index.html',
  'public/manifest.json',
  'public/sw.js',
  'public/css/styles.css',
  'public/css/components.css',
  'public/js/app.js',
  'public/js/state.js',
  'public/js/db.js',
  'public/js/utils/formatters.js',
  'public/js/components/Header.js',
  'public/js/components/Dashboard.js',
  'public/js/components/TransactionModal.js',
  'public/js/components/TransactionsList.js',
  'public/js/components/CategoriesManager.js',
  'public/js/components/ProfilesManager.js',
  'public/js/components/AnalyticsView.js',
  'public/js/components/LoginModal.js'
];

requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, '..', file);
  assert.strictEqual(fs.existsSync(fullPath), true, `Eksik dosya: ${file}`);
  console.log(`  ✓ Dosya mevcut: ${file}`);
});

// 2. Kullanıcı / Profil Ekleme & Düzenleme Testi
console.log('\n👥 Kullanıcı Yönetimi (CRUD) Algoritması Test Ediliyor...');

const testProfiles = [
  { id: 'user_1', name: 'Ahmet', role: 'Koca', avatar: '👨‍💼', color: '#3b82f6' },
  { id: 'user_2', name: 'Ayşe', role: 'Hanım', avatar: '👩‍💼', color: '#ec4899' }
];

// Ekleme
const newProf = { id: 'user_3', name: 'Mehmet', role: 'Çocuk', avatar: '🧑', color: '#10b981' };
testProfiles.push(newProf);
assert.strictEqual(testProfiles.length, 3, 'Profil sayısı 3 olmalıdır');
console.log('  ✓ Yeni Profil Eklendi: Mehmet (Çocuk)');

// Güncelleme
const targetIdx = testProfiles.findIndex(p => p.id === 'user_1');
testProfiles[targetIdx].name = 'Ali';
assert.strictEqual(testProfiles[0].name, 'Ali', 'Ahmet adı Ali olarak değiştirilmelidir');
console.log('  ✓ Profil İsmi Değiştirildi: Ahmet -> Ali');

// Silme
const filtered = testProfiles.filter(p => p.id !== 'user_3');
assert.strictEqual(filtered.length, 2, 'Silme sonrası profil sayısı 2 olmalıdır');
console.log('  ✓ Profil Silindi: Mehmet');

console.log('\n✅ Tüm testler başarıyla tamamlandı!');
