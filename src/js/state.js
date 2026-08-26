/**
 * Ev Ekonomisi - Durum Yöneticisi (State Store)
 */

import { DB } from './db.js';
import { getCurrentYearMonth } from './utils/formatters.js';

class StateStore {
  constructor() {
    this.listeners = [];
    this.state = DB.getDefaultData();
    this.selectedMonth = getCurrentYearMonth(); // YYYY-MM
    this.activeTab = 'dashboard'; // 'dashboard' | 'transactions' | 'settlement' | 'analytics'
    this.activeProfileId = 'all'; // 'all' | 'user_1' | 'user_2'
    this.isLocked = false;
    this.editingTransaction = null;
  }

  async init() {
    this.state = await DB.loadState();
    if (this.state.settings && this.state.settings.isPinEnabled && this.state.settings.pinCode) {
      this.isLocked = true;
    }
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state, this));
  }

  async save() {
    await DB.saveState(this.state);
    this.notify();
  }

  // Profil İşlemleri
  setActiveProfile(profileId) {
    this.activeProfileId = profileId;
    this.notify();
  }

  getActiveProfile() {
    if (this.activeProfileId === 'all') return { id: 'all', name: 'Ortak Ev Bütçesi', avatar: '🏡', color: '#10b981' };
    return this.state.profiles.find(p => p.id === this.activeProfileId) || this.state.profiles[0];
  }

  async addProfile(profile) {
    if (!profile.id) profile.id = 'user_' + Date.now();
    this.state.profiles.push(profile);
    await this.save();
  }

  async updateProfile(updatedProfile) {
    const idx = this.state.profiles.findIndex(p => p.id === updatedProfile.id);
    if (idx !== -1) {
      this.state.profiles[idx] = updatedProfile;
      await this.save();
    }
  }

  async deleteProfile(profileId) {
    if (this.state.profiles.length <= 1) return;
    this.state.profiles = this.state.profiles.filter(p => p.id !== profileId);
    if (this.activeProfileId === profileId) {
      this.activeProfileId = 'all';
    }
    await this.save();
  }

  // Ay Değiştirme
  setSelectedMonth(yearMonthStr) {
    this.selectedMonth = yearMonthStr;
    this.notify();
  }

  // Sekme Değiştirme
  setActiveTab(tabName) {
    this.activeTab = tabName;
    this.notify();
  }

  // PIN Kodu İle Kilit Açma/Kapama
  unlockApp(enteredPin) {
    if (this.state.settings.pinCode === enteredPin) {
      this.isLocked = false;
      this.notify();
      return true;
    }
    return false;
  }

  lockApp() {
    if (this.state.settings.isPinEnabled) {
      this.isLocked = true;
      this.notify();
    }
  }

  setPinSettings(isEnabled, pinCode) {
    this.state.settings.isPinEnabled = isEnabled;
    this.state.settings.pinCode = pinCode;
    if (!isEnabled) this.isLocked = false;
    this.save();
  }

  // İşlem CRUD
  async addTransaction(tx) {
    if (!tx.id) tx.id = 'tx_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    this.state.transactions.unshift(tx);
    await this.save();
  }

  async updateTransaction(updatedTx) {
    const idx = this.state.transactions.findIndex(t => t.id === updatedTx.id);
    if (idx !== -1) {
      this.state.transactions[idx] = updatedTx;
      await this.save();
    }
  }

  async deleteTransaction(txId) {
    this.state.transactions = this.state.transactions.filter(t => t.id !== txId);
    await this.save();
  }

  // Kategori CRUD
  async addCategory(category) {
    if (!category.id) category.id = 'cat_' + Date.now();
    this.state.categories.push(category);
    await this.save();
  }

  async deleteCategory(catId) {
    this.state.categories = this.state.categories.filter(c => c.id !== catId);
    await this.save();
  }

  // Filtrelenmiş İşlemler
  getFilteredTransactions() {
    return this.state.transactions.filter(tx => {
      // Ay filtresi
      if (this.selectedMonth && !tx.date.startsWith(this.selectedMonth)) {
        return false;
      }
      // Profil filtresi
      if (this.activeProfileId !== 'all' && tx.profileId !== this.activeProfileId) {
        return false;
      }
      return true;
    });
  }

  // Finansal Özet Hesaplama
  getFinancialSummary() {
    const txs = this.getFilteredTransactions();
    let totalIncome = 0;
    let totalOutcome = 0;

    txs.forEach(tx => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'income') {
        totalIncome += amt;
      } else {
        totalOutcome += amt;
      }
    });

    const netBalance = totalIncome - totalOutcome;
    const savingsRate = totalIncome > 0 ? Math.max(0, Math.round((netBalance / totalIncome) * 100)) : 0;

    return {
      totalIncome,
      totalOutcome,
      netBalance,
      savingsRate,
      transactionCount: txs.length
    };
  }
}

export const store = new StateStore();
