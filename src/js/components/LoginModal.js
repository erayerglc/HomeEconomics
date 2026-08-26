/**
 * Ev Ekonomisi - Giriş Ekranı & Kalıcı Oturum Modalı (Master Password Auth)
 */

import { store } from '../state.js';

const SESSION_KEY = 'ev_ekonomisi_auth_token_v1';

export function renderLoginModal(container) {
  // Sayfa yüklendiğinde hafızadaki oturum anahtarını kontrol et
  const savedToken = localStorage.getItem(SESSION_KEY);
  let isAuthenticated = !!savedToken;

  container.innerHTML = `
    <!-- Tam Ekran Giriş Sayfası -->
    <div id="loginScreenOverlay" class="modal-overlay ${!isAuthenticated ? 'active' : ''}" style="z-index: 1000; background: var(--bg-primary);">
      <div class="glass-card animate-fade" style="width: 100%; max-width: 380px; padding: 28px; margin: auto 16px; text-align: center;">
        <div style="font-size: 3.2rem; margin-bottom: 12px;">🔐</div>
        <h2 class="title-lg" style="margin-bottom: 6px;">Ev Ekonomisi</h2>
        <div class="subtext" style="margin-bottom: 24px;">Aile Bütçenize Erişmek İçin Giriş Yapın</div>

        <form id="loginForm">
          <div class="form-group" style="text-align: left;">
            <label class="form-label">Uygulama Giriş Şifresi</label>
            <input type="password" id="inputMasterPassword" class="form-control" placeholder="Şifrenizi girin..." required autofocus style="font-size: 1.1rem; padding: 14px; text-align: center; letter-spacing: 2px;" />
            <div id="loginErrorMsg" style="color: #f87171; font-size: 0.82rem; margin-top: 6px; display: none;"></div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; font-size: 0.85rem;">
            <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="checkbox" id="checkRememberMe" checked style="width: 18px; height: 18px; accent-color: var(--accent-blue);" />
              <span>Beni Hatırla (Tekrar Sorma)</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; padding: 14px; font-size: 1rem;">
            🚀 Giriş Yap
          </button>
        </form>
      </div>
    </div>

    <!-- Şifre Değiştirme Modalı -->
    <div id="changePassModalOverlay" class="modal-overlay">
      <div class="modal-sheet animate-fade">
        <div class="modal-header">
          <h3 class="title-md">🔑 Giriş Şifresini Değiştir</h3>
          <button class="modal-close" id="btnCloseChangePassModal">✕</button>
        </div>

        <form id="changePassForm">
          <div class="form-group">
            <label class="form-label">Mevcut Şifre</label>
            <input type="password" id="inputCurrPass" class="form-control" placeholder="Mevcut şifre..." required />
          </div>

          <div class="form-group">
            <label class="form-label">Yeni Şifre</label>
            <input type="password" id="inputNewPass" class="form-control" placeholder="Yeni şifreniz..." required />
          </div>

          <div class="form-group">
            <label class="form-label">Yeni Şifre (Tekrar)</label>
            <input type="password" id="inputNewPassConfirm" class="form-control" placeholder="Yeni şifre tekrar..." required />
          </div>

          <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
            💾 Yeni Şifreyi Kaydet
          </button>
        </form>
      </div>
    </div>
  `;

  const loginOverlay = container.querySelector('#loginScreenOverlay');
  const loginForm = container.querySelector('#loginForm');
  const inputPass = container.querySelector('#inputMasterPassword');
  const checkRemember = container.querySelector('#checkRememberMe');
  const errorMsg = container.querySelector('#loginErrorMsg');

  const changePassOverlay = container.querySelector('#changePassModalOverlay');
  const btnCloseChangePass = container.querySelector('#btnCloseChangePassModal');
  const changePassForm = container.querySelector('#changePassForm');
  const inputCurr = container.querySelector('#inputCurrPass');
  const inputNew = container.querySelector('#inputNewPass');
  const inputNewConfirm = container.querySelector('#inputNewPassConfirm');

  // Giriş Yap Form Submit
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const pass = inputPass.value;
    errorMsg.style.display = 'none';

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass })
      });

      const json = await res.json();
      if (json.success && json.token) {
        if (checkRemember.checked) {
          localStorage.setItem(SESSION_KEY, json.token);
        } else {
          sessionStorage.setItem(SESSION_KEY, json.token);
        }
        isAuthenticated = true;
        loginOverlay.classList.remove('active');
      } else {
        errorMsg.textContent = json.message || 'Hatalı şifre!';
        errorMsg.style.display = 'block';
      }
    } catch (err) {
      // Offline fallback: check locally
      const masterPass = store.state.settings?.masterPassword || '1234';
      if (pass === masterPass) {
        localStorage.setItem(SESSION_KEY, 'offline_token');
        isAuthenticated = true;
        loginOverlay.classList.remove('active');
      } else {
        errorMsg.textContent = 'Hatalı şifre! (Offline)';
        errorMsg.style.display = 'block';
      }
    }
  });

  // Şifre Değiştirme Modalı Açma Dinleyicisi
  window.addEventListener('open-change-password-modal', () => {
    changePassOverlay.classList.add('active');
  });

  btnCloseChangePass?.addEventListener('click', () => changePassOverlay.classList.remove('active'));
  changePassOverlay?.addEventListener('click', (e) => {
    if (e.target === changePassOverlay) changePassOverlay.classList.remove('active');
  });

  changePassForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const curr = inputCurr.value;
    const newP = inputNew.value;
    const confirmP = inputNewConfirm.value;

    if (newP !== confirmP) {
      alert('Yeni şifre ve şifre tekrarı uyuşmuyor!');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: curr, newPassword: newP })
      });

      const json = await res.json();
      if (json.success) {
        alert('Giriş şifreniz başarıyla değiştirildi!');
        changePassOverlay.classList.remove('active');
        inputCurr.value = '';
        inputNew.value = '';
        inputNewConfirm.value = '';
      } else {
        alert(json.message || 'Şifre değiştirilemedi.');
      }
    } catch (err) {
      alert('Şifre değiştirme hatası: ' + err.message);
    }
  });

  // Çıkış Yap Fonksiyonu
  window.logoutApp = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    isAuthenticated = false;
    loginOverlay.classList.add('active');
  };
}
