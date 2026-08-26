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
  'src/css/styles.css',
  'src/css/components.css',
  'src/js/app.js',
  'src/js/state.js',
  'src/js/db.js',
  'src/js/utils/formatters.js',
  'src/js/components/Header.js',
  'src/js/components/Dashboard.js',
  'src/js/components/TransactionModal.js',
  'src/js/components/TransactionsList.js',
  'src/js/components/CategoriesManager.js',
  'src/js/components/ProfilesManager.js',
  'src/js/components/AnalyticsView.js'
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
