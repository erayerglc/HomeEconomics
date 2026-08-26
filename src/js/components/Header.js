/**
 * Ev Ekonomisi - Header & Ay Seçici Bileşeni
 */

import { store } from '../state.js';
import { formatMonthYear } from '../utils/formatters.js';

export function renderHeader(container) {
  const activeProfile = store.getActiveProfile();
  const profiles = store.state.profiles;
  const currentMonth = store.selectedMonth;

  // Ay İsimlerini Seçenek Olarak Oluştur
  const monthOptions = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const val = `${yyyy}-${mm}`;
    const label = new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(d);
    monthOptions.push({ val, label });
  }

  container.innerHTML = `
    <header class="app-header">
      <div class="header-brand">
        <span class="logo-icon">🏡</span>
        <div>
          <h1 class="brand-title">Ev Ekonomisi</h1>
        </div>
      </div>

      <div class="header-actions">
        <!-- Profil Değiştirici Button -->
        <button id="btnProfileSelector" class="profile-pill" style="border-left: 3px solid ${activeProfile.color || '#10b981'};">
          <span class="profile-avatar-sm">${activeProfile.avatar}</span>
          <span>${activeProfile.name}</span>
          <span style="font-size: 0.7rem;">▼</span>
        </button>

        <!-- Şifre Değiştirme Butonu -->
        <button id="btnChangePassword" class="btn-icon" title="Giriş Şifresini Değiştir" style="font-size: 0.95rem;">
          🔑
        </button>

        <!-- Çıkış Yap Butonu -->
        <button id="btnLogout" class="btn-icon" title="Çıkış Yap" style="font-size: 0.95rem; color: #f87171;">
          🚪
        </button>
      </div>
    </header>

    <!-- Ay Seçim Çubuğu -->
    <div class="month-selector-bar">
      <button id="btnPrevMonth" class="btn-icon" style="width: 32px; height: 32px;">‹</button>
      <div class="month-title">
        📅 <select id="monthSelect" style="background: transparent; border: none; color: var(--text-main); font-weight: 700; font-size: 1rem; cursor: pointer; outline: none;">
          ${monthOptions.map(m => `<option value="${m.val}" ${m.val === currentMonth ? 'selected' : ''} style="background: var(--bg-secondary); color: white;">${m.label}</option>`).join('')}
        </select>
      </div>
      <button id="btnNextMonth" class="btn-icon" style="width: 32px; height: 32px;">›</button>
    </div>

    <!-- Profil Değiştirme Modalı / Popover -->
    <div id="profileDropdownModal" class="modal-overlay">
      <div class="modal-sheet animate-fade" style="max-height: 400px;">
        <div class="modal-header">
          <h3 class="title-md">👤 Kullanıcı Profili Seçin</h3>
          <button class="modal-close" id="btnCloseProfileModal">✕</button>
        </div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
          <!-- Ortak Bütçe -->
          <div class="cat-item-card ${store.activeProfileId === 'all' ? 'selected' : ''}" data-profile-id="all" style="flex-direction: row; justify-content: flex-start; padding: 14px; gap: 14px;">
            <span style="font-size: 1.8rem;">🏡</span>
            <div style="text-align: left;">
              <div style="font-weight: 700; font-size: 1rem;">Ortak Ev Bütçesi</div>
              <div class="subtext">Tüm aile bireylerinin gelir & giderleri</div>
            </div>
          </div>

          <!-- Bireysel Profiller -->
          ${profiles.map(p => `
            <div class="cat-item-card ${store.activeProfileId === p.id ? 'selected' : ''}" data-profile-id="${p.id}" style="flex-direction: row; justify-content: flex-start; padding: 14px; gap: 14px; border-left: 4px solid ${p.color};">
              <span style="font-size: 1.8rem;">${p.avatar}</span>
              <div style="text-align: left;">
                <div style="font-weight: 700; font-size: 1rem;">${p.name} (${p.role})</div>
                <div class="subtext">Sadece ${p.name} kişisine ait işlemler</div>
              </div>
            </div>
          `).join('')}

          <button id="btnManageProfilesFromHeader" class="btn btn-secondary" style="margin-top: 10px; width: 100%;">
            ⚙️ Profilleri Düzenle / Yeni Kullanıcı Ekle
          </button>
        </div>
      </div>
    </div>
  `;

  // Etkinlik Bağlantıları
  const btnProfileSelector = container.querySelector('#btnProfileSelector');
  const profileDropdownModal = container.querySelector('#profileDropdownModal');
  const btnCloseProfileModal = container.querySelector('#btnCloseProfileModal');
  const monthSelect = container.querySelector('#monthSelect');
  const btnPrevMonth = container.querySelector('#btnPrevMonth');
  const btnNextMonth = container.querySelector('#btnNextMonth');
  const btnLockApp = container.querySelector('#btnLockApp');

  btnProfileSelector?.addEventListener('click', () => {
    profileDropdownModal.classList.add('active');
  });

  btnCloseProfileModal?.addEventListener('click', () => {
    profileDropdownModal.classList.remove('active');
  });

  profileDropdownModal?.addEventListener('click', (e) => {
    if (e.target === profileDropdownModal) profileDropdownModal.classList.remove('active');
  });

  profileDropdownModal?.querySelectorAll('[data-profile-id]').forEach(el => {
    el.addEventListener('click', () => {
      const pid = el.getAttribute('data-profile-id');
      store.setActiveProfile(pid);
      profileDropdownModal.classList.remove('active');
    });
  });

  container.querySelector('#btnManageProfilesFromHeader')?.addEventListener('click', () => {
    profileDropdownModal.classList.remove('active');
    store.setActiveTab('profiles');
  });

  monthSelect?.addEventListener('change', (e) => {
    store.setSelectedMonth(e.target.value);
  });

  btnPrevMonth?.addEventListener('click', () => {
    const idx = monthOptions.findIndex(m => m.val === currentMonth);
    if (idx < monthOptions.length - 1) {
      store.setSelectedMonth(monthOptions[idx + 1].val);
    }
  });

  btnNextMonth?.addEventListener('click', () => {
    const idx = monthOptions.findIndex(m => m.val === currentMonth);
    if (idx > 0) {
      store.setSelectedMonth(monthOptions[idx - 1].val);
    }
  });

  container.querySelector('#btnChangePassword')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('open-change-password-modal'));
  });

  container.querySelector('#btnLogout')?.addEventListener('click', () => {
    if (confirm('Uygulamadan çıkış yapmak istediğinize emin misiniz?')) {
      if (window.logoutApp) window.logoutApp();
    }
  });
}
