/**
 * Ev Ekonomisi - PIN Güvenlik Ekranı & Ayarları Modalı
 */

import { store } from '../state.js';

export function renderPINLockModal(container) {
  let enteredPin = '';

  container.innerHTML = `
    <!-- PIN Kilit Ekranı Overlayer (Lock State) -->
    <div id="pinLockScreen" class="modal-overlay ${store.isLocked ? 'active' : ''}" style="z-index: 999; background: var(--bg-primary);">
      <div style="text-align: center; width: 100%; max-width: 360px; padding: 24px;">
        <div style="font-size: 3rem; margin-bottom: 10px;">🔒</div>
        <h2 class="title-lg">Ev Ekonomisi</h2>
        <div class="subtext" style="margin-top: 4px;">Güvenlik için PIN Kodunuzu Girin</div>

        <!-- PIN Noktaları -->
        <div class="pin-dots" id="pinDots">
          <div class="pin-dot"></div>
          <div class="pin-dot"></div>
          <div class="pin-dot"></div>
          <div class="pin-dot"></div>
        </div>

        <!-- PIN Klavyeleri (Pad) -->
        <div class="pin-pad-grid">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => `
            <button class="pin-btn" data-num="${num}">${num}</button>
          `).join('')}
          <button class="pin-btn" id="btnPinClear" style="font-size: 1rem; color: #f87171;">Sil</button>
          <button class="pin-btn" data-num="0">0</button>
          <button class="pin-btn" id="btnPinBack" style="font-size: 1rem;">⌫</button>
        </div>
      </div>
    </div>
  `;

  const lockScreen = container.querySelector('#pinLockScreen');
  const dotsContainer = container.querySelector('#pinDots');

  function updateDots() {
    const dots = dotsContainer.querySelectorAll('.pin-dot');
    dots.forEach((dot, idx) => {
      if (idx < enteredPin.length) {
        dot.classList.add('filled');
      } else {
        dot.classList.remove('filled');
      }
    });
  }

  container.querySelectorAll('[data-num]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (enteredPin.length < 4) {
        enteredPin += btn.getAttribute('data-num');
        updateDots();

        if (enteredPin.length === 4) {
          setTimeout(() => {
            const success = store.unlockApp(enteredPin);
            if (success) {
              enteredPin = '';
              updateDots();
              lockScreen.classList.remove('active');
            } else {
              alert('Hatalı PIN Kodu! Lütfen tekrar deneyin.');
              enteredPin = '';
              updateDots();
            }
          }, 150);
        }
      }
    });
  });

  container.querySelector('#btnPinClear')?.addEventListener('click', () => {
    enteredPin = '';
    updateDots();
  });

  container.querySelector('#btnPinBack')?.addEventListener('click', () => {
    enteredPin = enteredPin.slice(0, -1);
    updateDots();
  });

  store.subscribe((state) => {
    if (store.isLocked) {
      lockScreen.classList.add('active');
    } else {
      lockScreen.classList.remove('active');
    }
  });
}
