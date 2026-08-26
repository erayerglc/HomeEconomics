/**
 * Ev Ekonomisi - Gelir/Gider Ekleme & Düzenleme Modalı
 */

import { store } from '../state.js';

export function renderTransactionModal(container) {
  let modalState = {
    isOpen: false,
    mode: 'add', // 'add' | 'edit'
    id: null,
    type: 'outcome', // 'income' | 'outcome'
    amount: '',
    categoryId: '',
    profileId: store.activeProfileId !== 'all' ? store.activeProfileId : store.state.profiles[0]?.id || 'user_1',
    paymentMethod: 'Kredi Kartı',
    date: new Date().toISOString().split('T')[0],
    isShared: true,
    note: ''
  };

  container.innerHTML = `
    <div id="txModalOverlay" class="modal-overlay">
      <div class="modal-sheet animate-fade">
        <div class="modal-header">
          <h3 id="txModalTitle" class="title-md">➕ Yeni İşlem Ekle</h3>
          <button class="modal-close" id="btnCloseTxModal">✕</button>
        </div>

        <form id="txForm">
          <!-- Gelir / Gider Değiştirici -->
          <div class="pill-toggle-group">
            <button type="button" id="btnTypeOutcome" class="pill-toggle-btn active-outcome">
              🔴 Gider (Harcama)
            </button>
            <button type="button" id="btnTypeIncome" class="pill-toggle-btn">
              🟢 Gelir (Kazanç)
            </button>
          </div>

          <!-- Tutar -->
          <div class="form-group">
            <label class="form-label">İşlem Tutarı (₺)</label>
            <input type="number" step="0.01" id="txAmount" class="form-control" placeholder="0.00" style="font-size: 1.5rem; font-weight: 800; color: var(--accent-outcome);" required />
          </div>

          <!-- Kategori Seçici Grid -->
          <div class="form-group">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <label class="form-label">Kategori Seçin</label>
              <button type="button" id="btnAddNewCatFromModal" style="background: none; border: none; color: var(--accent-blue); font-size: 0.8rem; font-weight: 700; cursor: pointer;">
                + Yeni Kategori
              </button>
            </div>
            <div id="modalCategoriesGrid" class="categories-grid" style="max-height: 160px; overflow-y: auto; padding: 4px;">
              <!-- Kategoriler JS ile doldurulacak -->
            </div>
          </div>

          <!-- İşlemi Yapan / Ödeyen Profil -->
          <div class="form-group">
            <label class="form-label">İşlemi Yapan (Kime Ait?)</label>
            <select id="txProfileId" class="form-control">
              ${store.state.profiles.map(p => `
                <option value="${p.id}">${p.avatar} ${p.name} (${p.role})</option>
              `).join('')}
            </select>
          </div>

          <!-- Ödeme Yöntemi & Tarih Grid -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="form-group">
              <label class="form-label">Ödeme Tipi</label>
              <select id="txPaymentMethod" class="form-control">
                <option value="Kredi Kartı">💳 Kredi Kartı</option>
                <option value="Kredi / Taksit">🏦 Kredi / Taksit</option>
                <option value="Nakit">💸 Nakit</option>
                <option value="Banka Transferi">🏛️ Banka Transferi</option>
                <option value="Diğer">🌀 Diğer</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Tarih</label>
              <input type="date" id="txDate" class="form-control" required />
            </div>
          </div>

          <!-- Ortak Harcama Switch -->
          <div class="glass-card" style="padding: 12px 14px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <div style="font-weight: 700; font-size: 0.9rem;">🤝 Ortak Ev Gideri/Geliri</div>
              <div class="subtext">Eşler arası bütçe hesaplaşmasına dahil et</div>
            </div>
            <input type="checkbox" id="txIsShared" style="width: 20px; height: 20px; accent-color: var(--accent-blue); cursor: pointer;" checked />
          </div>

          <!-- Açıklama / Not -->
          <div class="form-group">
            <label class="form-label">Açıklama / Not (Opsiyonel)</label>
            <input type="text" id="txNote" class="form-control" placeholder="Örn: Market alışverişi, Bonus ekstre" />
          </div>

          <!-- Modal Aksiyon Butonları -->
          <div style="display: flex; gap: 10px; margin-top: 20px;">
            <button type="button" id="btnDeleteTx" class="btn btn-danger" style="display: none;">
              🗑️ Sil
            </button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">
              💾 Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const overlay = container.querySelector('#txModalOverlay');
  const modalTitle = container.querySelector('#txModalTitle');
  const btnClose = container.querySelector('#btnCloseTxModal');
  const btnTypeOutcome = container.querySelector('#btnTypeOutcome');
  const btnTypeIncome = container.querySelector('#btnTypeIncome');
  const inputAmount = container.querySelector('#txAmount');
  const selectProfile = container.querySelector('#txProfileId');
  const selectPayment = container.querySelector('#txPaymentMethod');
  const inputDate = container.querySelector('#txDate');
  const checkIsShared = container.querySelector('#txIsShared');
  const inputNote = container.querySelector('#txNote');
  const catGrid = container.querySelector('#modalCategoriesGrid');
  const btnDelete = container.querySelector('#btnDeleteTx');
  const btnAddNewCat = container.querySelector('#btnAddNewCatFromModal');
  const form = container.querySelector('#txForm');

  function renderCategoriesGrid() {
    const availableCats = store.state.categories.filter(c => c.type === modalState.type);
    if (availableCats.length > 0 && (!modalState.categoryId || !availableCats.find(c => c.id === modalState.categoryId))) {
      modalState.categoryId = availableCats[0].id;
    }

    catGrid.innerHTML = availableCats.map(c => `
      <div class="cat-item-card ${modalState.categoryId === c.id ? 'selected' : ''}" data-cat-id="${c.id}" style="padding: 8px;">
        <span style="font-size: 1.4rem;">${c.icon}</span>
        <span style="font-size: 0.75rem; font-weight: 600; text-align: center; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">${c.name}</span>
      </div>
    `).join('');

    catGrid.querySelectorAll('[data-cat-id]').forEach(el => {
      el.addEventListener('click', () => {
        modalState.categoryId = el.getAttribute('data-cat-id');
        renderCategoriesGrid();
      });
    });
  }

  function updateModalUI() {
    if (modalState.mode === 'edit') {
      modalTitle.textContent = '✏️ İşlemi Düzenle';
      btnDelete.style.display = 'inline-flex';
    } else {
      modalTitle.textContent = '➕ Yeni İşlem Ekle';
      btnDelete.style.display = 'none';
    }

    if (modalState.type === 'outcome') {
      btnTypeOutcome.className = 'pill-toggle-btn active-outcome';
      btnTypeIncome.className = 'pill-toggle-btn';
      inputAmount.style.color = 'var(--accent-outcome)';
    } else {
      btnTypeIncome.className = 'pill-toggle-btn active-income';
      btnTypeOutcome.className = 'pill-toggle-btn';
      inputAmount.style.color = 'var(--accent-income)';
    }

    inputAmount.value = modalState.amount;
    selectProfile.value = modalState.profileId;
    selectPayment.value = modalState.paymentMethod;
    inputDate.value = modalState.date;
    checkIsShared.checked = modalState.isShared;
    inputNote.value = modalState.note;

    renderCategoriesGrid();
  }

  // Modalı Aç / Kapat Etkinlik Dinleyici
  window.addEventListener('open-tx-modal', (e) => {
    const detail = e.detail || {};
    if (detail.mode === 'edit' && detail.transaction) {
      const tx = detail.transaction;
      modalState = {
        isOpen: true,
        mode: 'edit',
        id: tx.id,
        type: tx.type,
        amount: tx.amount,
        categoryId: tx.categoryId,
        profileId: tx.profileId,
        paymentMethod: tx.paymentMethod || 'Kredi Kartı',
        date: tx.date,
        isShared: tx.isShared !== false,
        note: tx.note || ''
      };
    } else {
      modalState = {
        isOpen: true,
        mode: 'add',
        id: null,
        type: 'outcome',
        amount: '',
        categoryId: '',
        profileId: store.activeProfileId !== 'all' ? store.activeProfileId : store.state.profiles[0]?.id || 'user_1',
        paymentMethod: 'Kredi Kartı',
        date: new Date().toISOString().split('T')[0],
        isShared: true,
        note: ''
      };
    }

    updateModalUI();
    overlay.classList.add('active');
  });

  btnClose?.addEventListener('click', () => overlay.classList.remove('active'));
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  btnTypeOutcome?.addEventListener('click', () => {
    modalState.type = 'outcome';
    updateModalUI();
  });

  btnTypeIncome?.addEventListener('click', () => {
    modalState.type = 'income';
    updateModalUI();
  });

  btnAddNewCat?.addEventListener('click', () => {
    overlay.classList.remove('active');
    window.dispatchEvent(new Event('open-categories-modal'));
  });

  btnDelete?.addEventListener('click', async () => {
    if (modalState.id && confirm('Bu işlemi silmek istediğinize emin misiniz?')) {
      await store.deleteTransaction(modalState.id);
      overlay.classList.remove('active');
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const amountVal = parseFloat(inputAmount.value);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Lütfen geçerli bir tutar girin.');
      return;
    }

    const txObj = {
      id: modalState.id,
      type: modalState.type,
      amount: amountVal,
      categoryId: modalState.categoryId,
      profileId: selectProfile.value,
      paymentMethod: selectPayment.value,
      date: inputDate.value,
      isShared: checkIsShared.checked,
      note: inputNote.value.trim()
    };

    if (modalState.mode === 'edit') {
      await store.updateTransaction(txObj);
    } else {
      await store.addTransaction(txObj);
    }

    overlay.classList.remove('active');
  });
}
