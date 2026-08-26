/**
 * Ev Ekonomisi - Kategori Yönetimi Modalı
 */

import { store } from '../state.js';

export function renderCategoriesManager(container) {
  let selectedType = 'outcome';
  let emojiList = ['💳', '🏦', '💸', '🏠', '⚡', '🛒', '☕', '🚗', '💊', '🎬', '🛍️', '💵', '💼', '📈', '🎁', '🎓', '✈️', '🐶', '🍕', '🎮', '🏋️', '📱'];
  let colorList = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#dc2626', '#d97706', '#059669', '#0284c7', '#6366f1', '#a855f7'];

  container.innerHTML = `
    <div id="categoriesModalOverlay" class="modal-overlay">
      <div class="modal-sheet animate-fade" style="max-height: 85vh;">
        <div class="modal-header">
          <h3 class="title-md">🏷️ Kategori Yönetimi</h3>
          <button class="modal-close" id="btnCloseCatModal">✕</button>
        </div>

        <!-- Gelir / Gider Sekmesi -->
        <div class="pill-toggle-group" style="margin-bottom: 16px;">
          <button type="button" id="btnCatOutcomeTab" class="pill-toggle-btn active-outcome">
            🔴 Gider Kategorileri
          </button>
          <button type="button" id="btnCatIncomeTab" class="pill-toggle-btn">
            🟢 Gelir Kategorileri
          </button>
        </div>

        <!-- Kategori Ekleme Formu Accordion / Card -->
        <div class="glass-card" style="padding: 14px; margin-bottom: 16px;">
          <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 10px;">➕ Yeni Kategori Oluştur</div>
          <form id="addCategoryForm">
            <div class="form-group">
              <label class="form-label">Kategori Adı</label>
              <input type="text" id="newCatName" class="form-control" placeholder="Örn: Garanti Kredi Kartı, Okul Taksidi" required />
            </div>

            <!-- Emoji Seçici -->
            <div class="form-group">
              <label class="form-label">Simge (Emoji) Seçin</label>
              <div id="emojiPicker" style="display: flex; gap: 8px; overflow-x: auto; padding: 6px 2px;">
                ${emojiList.map((e, idx) => `
                  <button type="button" class="btn-icon ${idx === 0 ? 'selected' : ''}" data-emoji="${e}" style="flex-shrink: 0; width: 38px; height: 38px; font-size: 1.2rem;">
                    ${e}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Renk Seçici -->
            <div class="form-group">
              <label class="form-label">Renk Seçin</label>
              <div id="colorPicker" style="display: flex; gap: 8px; overflow-x: auto; padding: 6px 2px;">
                ${colorList.map((c, idx) => `
                  <button type="button" data-color="${c}" style="width: 32px; height: 32px; border-radius: 50%; background: ${c}; border: 2px solid ${idx === 0 ? 'white' : 'transparent'}; cursor: pointer; flex-shrink: 0;"></button>
                `).join('')}
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
              ✨ Kategori Ekle
            </button>
          </form>
        </div>

        <!-- Mevcut Kategoriler Listesi -->
        <div style="font-weight: 700; font-size: 0.9rem; margin-bottom: 10px;">Mevcut Kategoriler</div>
        <div id="existingCategoriesList" style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto;">
          <!-- JS ile doldurulacak -->
        </div>

      </div>
    </div>
  `;

  const overlay = container.querySelector('#categoriesModalOverlay');
  const btnClose = container.querySelector('#btnCloseCatModal');
  const btnOutcomeTab = container.querySelector('#btnCatOutcomeTab');
  const btnIncomeTab = container.querySelector('#btnCatIncomeTab');
  const addForm = container.querySelector('#addCategoryForm');
  const inputName = container.querySelector('#newCatName');
  const emojiPicker = container.querySelector('#emojiPicker');
  const colorPicker = container.querySelector('#colorPicker');
  const existingList = container.querySelector('#existingCategoriesList');

  let selectedEmoji = emojiList[0];
  let selectedColor = colorList[0];

  function renderExistingList() {
    const cats = store.state.categories.filter(c => c.type === selectedType);
    existingList.innerHTML = cats.map(c => `
      <div class="glass-card" style="padding: 10px 14px; display: flex; align-items: center; justify-content: space-between; border-left: 4px solid ${c.color};">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.4rem;">${c.icon}</span>
          <span style="font-weight: 700; font-size: 0.9rem;">${c.name}</span>
          ${c.isDefault ? `<span class="badge badge-neutral" style="font-size: 0.65rem;">Varsayılan</span>` : ''}
        </div>
        ${!c.isDefault ? `
          <button class="btn-icon" data-delete-cat-id="${c.id}" style="width: 30px; height: 30px; font-size: 0.8rem; color: #f87171;" title="Kategoriyi Sil">
            🗑️
          </button>
        ` : ''}
      </div>
    `).join('');

    existingList.querySelectorAll('[data-delete-cat-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const catId = btn.getAttribute('data-delete-cat-id');
        if (confirm('Bu kategoriyi silmek istediğinize emin misiniz?')) {
          await store.deleteCategory(catId);
          renderExistingList();
        }
      });
    });
  }

  function updateTabs() {
    if (selectedType === 'outcome') {
      btnOutcomeTab.className = 'pill-toggle-btn active-outcome';
      btnIncomeTab.className = 'pill-toggle-btn';
    } else {
      btnIncomeTab.className = 'pill-toggle-btn active-income';
      btnOutcomeTab.className = 'pill-toggle-btn';
    }
    renderExistingList();
  }

  window.addEventListener('open-categories-modal', () => {
    updateTabs();
    overlay.classList.add('active');
  });

  btnClose?.addEventListener('click', () => overlay.classList.remove('active'));
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });

  btnOutcomeTab?.addEventListener('click', () => { selectedType = 'outcome'; updateTabs(); });
  btnIncomeTab?.addEventListener('click', () => { selectedType = 'income'; updateTabs(); });

  // Emoji seçici tıklaması
  emojiPicker?.querySelectorAll('[data-emoji]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedEmoji = btn.getAttribute('data-emoji');
      emojiPicker.querySelectorAll('[data-emoji]').forEach(b => b.style.borderColor = 'var(--glass-border)');
      btn.style.borderColor = 'var(--accent-blue)';
    });
  });

  // Renk seçici tıklaması
  colorPicker?.querySelectorAll('[data-color]').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedColor = btn.getAttribute('data-color');
      colorPicker.querySelectorAll('[data-color]').forEach(b => b.style.borderColor = 'transparent');
      btn.style.borderColor = 'white';
    });
  });

  addForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameVal = inputName.value.trim();
    if (!nameVal) return;

    await store.addCategory({
      type: selectedType,
      name: nameVal,
      icon: selectedEmoji,
      color: selectedColor,
      isDefault: false
    });

    inputName.value = '';
    renderExistingList();
  });
}
