/**
 * Ev Ekonomisi - Veritabanı ve Senkronizasyon İstemcisi
 * Express Backend API + LocalStorage Hibrit Yapısı
 */

const LOCAL_STORAGE_KEY = 'ev_ekonomisi_db_v1';

export class DB {
  // Varsayılan İlkleme Verisi (Çevrimdışı/İlk çalıştırma için)
  static getDefaultData() {
    return {
      profiles: [
        { id: 'user_1', name: 'Ahmet', role: 'Koca', avatar: '👨‍💼', color: '#3b82f6' },
        { id: 'user_2', name: 'Ayşe', role: 'Hanım', avatar: '👩‍💼', color: '#ec4899' }
      ],
      categories: [
        // Gelirler
        { id: 'cat_inc_1', type: 'income', name: 'Maaş', icon: '💵', color: '#10b981', isDefault: true },
        { id: 'cat_inc_2', type: 'income', name: 'Ek Gelir / Prim', icon: '💼', color: '#059669', isDefault: true },
        { id: 'cat_inc_3', type: 'income', name: 'Yatırım / Getiri', icon: '📈', color: '#047857', isDefault: true },
        { id: 'cat_inc_4', type: 'income', name: 'Diğer Gelirler', icon: '🎁', color: '#34d399', isDefault: true },

        // Giderler (Kredi Kartı, Kredi, Nakit vb.)
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
          note: 'Bonus Kart Ekstre Ödemesi',
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
          note: 'Konut Kredisi Taksidi',
          isShared: true
        }
      ],
      settings: {
        currency: '₺',
        currencyPosition: 'after',
        pinCode: '',
        isPinEnabled: false,
        activeProfileId: 'all'
      }
    };
  }

  // Tum veriyi yükle (API -> LocalStorage Fallback)
  static async loadState() {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
          console.info('Veriler sunucudan başarıyla yüklendi');
          return json.data;
        }
      }
    } catch (e) {
      console.warn('Sunucuya ulaşılamadı, yerel hafızadan yükleniyor:', e);
    }

    // LocalStorage fallback
    const local = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Local data hatası:', e);
      }
    }

    const defaultState = DB.getDefaultData();
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultState));
    return defaultState;
  }

  // Veriyi kaydet (API + LocalStorage)
  static async saveState(state) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
    try {
      await fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(state)
      });
    } catch (e) {
      console.warn('Sunucu senkronizasyon hatası (offline kayıt yapıldı):', e);
    }
  }
}
