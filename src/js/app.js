/**
 * Ev Ekonomisi & Aile Bütçesi - Ana Uygulama Başlatıcı (Main Entry Point)
 */

import { store } from './state.js';
import { renderHeader } from './components/Header.js';
import { renderDashboard } from './components/Dashboard.js';
import { renderTransactionsList } from './components/TransactionsList.js';
import { renderProfilesManager } from './components/ProfilesManager.js';
import { renderAnalyticsView } from './components/AnalyticsView.js';
import { renderTransactionModal } from './components/TransactionModal.js';
import { renderCategoriesManager } from './components/CategoriesManager.js';
import { renderPINLockModal } from './components/PINLockModal.js';
import { renderIOSInstallGuide } from './components/IOSInstallGuide.js';
import { renderLoginModal } from './components/LoginModal.js';

class App {
  constructor() {
    this.appEl = document.getElementById('app');
  }

  async init() {
    // 1. Durumu sunucu veya yerel hafızadan yükle
    await store.init();

    // 2. Service Worker Kaydı (PWA Çevrimdışı Desteği)
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.warn('Service worker kayıt hatası:', err);
      });
    }

    // 3. Ekranı Render Et
    this.render();

    // 4. Durum Değişikliklerini Dinle
    store.subscribe(() => {
      this.renderMainContent();
    });
  }

  render() {
    this.appEl.innerHTML = `
      <div id="headerContainer"></div>
      <main id="mainContentContainer" style="flex: 1;"></main>

      <!-- iOS Bottom Navigation Bar -->
      <nav class="bottom-nav">
        <button class="nav-item ${store.activeTab === 'dashboard' ? 'active' : ''}" data-tab="dashboard">
          <span class="nav-icon">🏠</span>
          <span>Ana Sayfa</span>
        </button>

        <button class="nav-item ${store.activeTab === 'transactions' ? 'active' : ''}" data-tab="transactions">
          <span class="nav-icon">📊</span>
          <span>İşlemler</span>
        </button>

        <!-- Ortadaki Harika Ekleme Butonu (FAB) -->
        <div style="position: relative; width: 60px; display: flex; justify-content: center;">
          <button id="btnFabAdd" class="fab-add" title="Yeni İşlem Ekle">+</button>
        </div>

        <button class="nav-item ${store.activeTab === 'analytics' ? 'active' : ''}" data-tab="analytics">
          <span class="nav-icon">📈</span>
          <span>Analiz</span>
        </button>

        <button class="nav-item ${store.activeTab === 'profiles' ? 'active' : ''}" data-tab="profiles">
          <span class="nav-icon">👥</span>
          <span>Kullanıcılar</span>
        </button>
      </nav>

      <!-- Global Modallar -->
      <div id="modalContainer"></div>
      <div id="categoriesModalContainer"></div>
      <div id="pinLockModalContainer"></div>
      <div id="iosGuideModalContainer"></div>
      <div id="loginModalContainer"></div>
    `;

    // Static Component Containers
    this.headerContainer = document.getElementById('headerContainer');
    this.mainContentContainer = document.getElementById('mainContentContainer');
    this.modalContainer = document.getElementById('modalContainer');
    this.categoriesModalContainer = document.getElementById('categoriesModalContainer');
    this.pinLockModalContainer = document.getElementById('pinLockModalContainer');
    this.iosGuideModalContainer = document.getElementById('iosGuideModalContainer');
    this.loginModalContainer = document.getElementById('loginModalContainer');

    // Render Modals Once
    renderTransactionModal(this.modalContainer);
    renderCategoriesManager(this.categoriesModalContainer);
    renderPINLockModal(this.pinLockModalContainer);
    renderIOSInstallGuide(this.iosGuideModalContainer);
    renderLoginModal(this.loginModalContainer);

    // Setup Navigation Listeners
    this.setupNav();

    // Initial Sub-render
    this.renderMainContent();
  }

  setupNav() {
    this.appEl.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        store.setActiveTab(tab);
      });
    });

    const fab = document.getElementById('btnFabAdd');
    fab?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-tx-modal', { detail: { mode: 'add' } }));
    });
  }

  renderMainContent() {
    // Header render
    renderHeader(this.headerContainer);

    // Update Bottom Nav Active state
    this.appEl.querySelectorAll('[data-tab]').forEach(btn => {
      const tab = btn.getAttribute('data-tab');
      if (tab === store.activeTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Active View render
    switch (store.activeTab) {
      case 'dashboard':
        renderDashboard(this.mainContentContainer);
        break;
      case 'transactions':
        renderTransactionsList(this.mainContentContainer);
        break;
      case 'analytics':
        renderAnalyticsView(this.mainContentContainer);
        break;
      case 'profiles':
        renderProfilesManager(this.mainContentContainer);
        break;
      default:
        renderDashboard(this.mainContentContainer);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
