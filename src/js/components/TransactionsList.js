/**
 * Ev Ekonomisi - İşlem Geçmişi & Liste Bileşeni
 */

import { store } from '../state.js';
import { formatCurrency, formatDate } from '../utils/formatters.js';

export function renderTransactionsList(container) {
  let filterType = 'all'; // 'all' | 'income' | 'outcome'
  let searchQuery = '';
  let selectedCatFilter = 'all';
  let selectedPayerFilter = 'all';

  function getRenderedTxs() {
    let txs = store.getFilteredTransactions();

    if (filterType !== 'all') {
      txs = txs.filter(t => t.type === filterType);
    }

    if (selectedCatFilter !== 'all') {
      txs = txs.filter(t => t.categoryId === selectedCatFilter);
    }

    if (selectedPayerFilter !== 'all') {
      txs = txs.filter(t => t.profileId === selectedPayerFilter);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      txs = txs.filter(t => {
        const cat = store.state.categories.find(c => c.id === t.categoryId);
        const catName = cat ? cat.name.toLowerCase() : '';
        const note = (t.note || '').toLowerCase();
        const pay = (t.paymentMethod || '').toLowerCase();
        return note.includes(q) || catName.includes(q) || pay.includes(q);
      });
    }

    return txs;
  }

  function renderUI() {
    const txs = getRenderedTxs();
    const categories = store.state.categories;
    const profiles = store.state.profiles;

    // Filtrelenmiş Toplamlar
    let totalIncome = 0;
    let totalOutcome = 0;
    txs.forEach(t => {
      if (t.type === 'income') totalIncome += Number(t.amount);
      else totalOutcome += Number(t.amount);
    });

    container.innerHTML = `
      <div class="animate-fade" style="padding: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h2 class="title-lg">📊 İşlem Geçmişi</h2>
          <div style="display: flex; gap: 6px;">
            <button id="btnExportJSON" class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.8rem;" title="Verileri Dışa Aktar (Yedekle)">
              💾 Yedekle
            </button>
            <button id="btnImportJSON" class="btn btn-secondary" style="padding: 6px 10px; font-size: 0.8rem;" title="Verileri İçe Aktar">
              📂 İçe Aktar
            </button>
            <input type="file" id="fileImportInput" accept=".json" style="display: none;" />
          </div>
        </div>

        <!-- Arama ve Filtre Kartı -->
        <div class="glass-card" style="padding: 14px; margin-bottom: 16px;">
          <div style="margin-bottom: 10px;">
            <input type="text" id="inputTxSearch" class="form-control" placeholder="🔍 İşlem veya kategori ara..." value="${searchQuery}" />
          </div>

          <!-- Type Filter Tabs -->
          <div style="display: flex; gap: 8px; margin-bottom: 10px;">
            <button class="btn ${filterType === 'all' ? 'btn-primary' : 'btn-secondary'}" id="tabAll" style="flex: 1; padding: 8px; font-size: 0.85rem;">
              Tümü (${store.getFilteredTransactions().length})
            </button>
            <button class="btn ${filterType === 'income' ? 'btn-primary' : 'btn-secondary'}" id="tabIncome" style="flex: 1; padding: 8px; font-size: 0.85rem;">
              🟢 Gelirler
            </button>
            <button class="btn ${filterType === 'outcome' ? 'btn-primary' : 'btn-secondary'}" id="tabOutcome" style="flex: 1; padding: 8px; font-size: 0.85rem;">
              🔴 Giderler
            </button>
          </div>

          <!-- Kategori & Profil Filtresi -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <select id="selectCatFilter" class="form-control" style="padding: 8px; font-size: 0.8rem;">
              <option value="all">Tüm Kategoriler</option>
              ${categories.map(c => `<option value="${c.id}" ${selectedCatFilter === c.id ? 'selected' : ''}>${c.icon} ${c.name}</option>`).join('')}
            </select>

            <select id="selectPayerFilter" class="form-control" style="padding: 8px; font-size: 0.8rem;">
              <option value="all">Tüm Kişiler</option>
              ${profiles.map(p => `<option value="${p.id}" ${selectedPayerFilter === p.id ? 'selected' : ''}>${p.avatar} ${p.name}</option>`).join('')}
            </select>
          </div>
        </div>

        <!-- Filtre Sonucu Özet Barı -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: rgba(15,23,42,0.4); border-radius: var(--radius-md); font-size: 0.85rem; margin-bottom: 14px;">
          <span style="color: var(--text-muted);">${txs.length} işlem bulundu</span>
          <div>
            ${totalIncome > 0 ? `<span style="color: var(--accent-income); font-weight: 700; margin-right: 8px;">+${formatCurrency(totalIncome)}</span>` : ''}
            ${totalOutcome > 0 ? `<span style="color: var(--accent-outcome); font-weight: 700;">-${formatCurrency(totalOutcome)}</span>` : ''}
          </div>
        </div>

        <!-- İşlem Listesi -->
        ${txs.length === 0 ? `
          <div class="glass-card" style="text-align: center; padding: 40px; color: var(--text-muted);">
            <div style="font-size: 2.2rem; margin-bottom: 8px;">🔍</div>
            <div>Arama kriterlerine uygun işlem bulunamadı.</div>
          </div>
        ` : `
          <div>
            ${txs.map(tx => {
              const cat = categories.find(c => c.id === tx.categoryId) || { name: 'Kategori Yok', icon: '❓', color: '#94a3b8' };
              const payer = profiles.find(p => p.id === tx.profileId) || { name: 'Genel', avatar: '👤' };

              return `
                <div class="tx-item" data-tx-id="${tx.id}">
                  <div class="tx-left">
                    <div class="tx-icon-wrapper" style="background: ${cat.color}20; color: ${cat.color};">
                      ${cat.icon}
                    </div>
                    <div class="tx-details">
                      <span class="tx-title">${tx.note || cat.name}</span>
                      <div class="tx-subinfo">
                        <span>${cat.name}</span> • <span>${formatDate(tx.date, true)}</span>
                        ${tx.paymentMethod ? `• <span>${tx.paymentMethod}</span>` : ''}
                      </div>
                    </div>
                  </div>

                  <div class="tx-right">
                    <span class="tx-amount ${tx.type === 'income' ? 'income' : 'outcome'}">
                      ${tx.type === 'income' ? '+' : '-'}${formatCurrency(tx.amount)}
                    </span>
                    <span class="tx-payer-tag">
                      ${payer.avatar} ${payer.name}
                    </span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    // Etkinlik Dinleyicileri
    const inputSearch = container.querySelector('#inputTxSearch');
    const tabAll = container.querySelector('#tabAll');
    const tabIncome = container.querySelector('#tabIncome');
    const tabOutcome = container.querySelector('#tabOutcome');
    const selectCat = container.querySelector('#selectCatFilter');
    const selectPayer = container.querySelector('#selectPayerFilter');
    const btnExportJSON = container.querySelector('#btnExportJSON');
    const btnImportJSON = container.querySelector('#btnImportJSON');
    const fileImportInput = container.querySelector('#fileImportInput');

    inputSearch?.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderUI();
    });

    tabAll?.addEventListener('click', () => { filterType = 'all'; renderUI(); });
    tabIncome?.addEventListener('click', () => { filterType = 'income'; renderUI(); });
    tabOutcome?.addEventListener('click', () => { filterType = 'outcome'; renderUI(); });

    selectCat?.addEventListener('change', (e) => { selectedCatFilter = e.target.value; renderUI(); });
    selectPayer?.addEventListener('change', (e) => { selectedPayerFilter = e.target.value; renderUI(); });

    container.querySelectorAll('[data-tx-id]').forEach(el => {
      el.addEventListener('click', () => {
        const txId = el.getAttribute('data-tx-id');
        const tx = store.state.transactions.find(t => t.id === txId);
        if (tx) {
          window.dispatchEvent(new CustomEvent('open-tx-modal', { detail: { mode: 'edit', transaction: tx } }));
        }
      });
    });

    // Yedekleme (Export JSON)
    btnExportJSON?.addEventListener('click', () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store.state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ev_ekonomisi_yedek_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });

    // Geri Yükleme (Import JSON)
    btnImportJSON?.addEventListener('click', () => {
      fileImportInput.click();
    });

    fileImportInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed && parsed.transactions && parsed.categories) {
            store.state = parsed;
            await store.save();
            alert('Veriler başarıyla içe aktarıldı ve güncellendi!');
            renderUI();
          } else {
            alert('Geçersiz yedek dosyası biçimi.');
          }
        } catch (err) {
          alert('Dosya okuma hatası: ' + err.message);
        }
      };
      reader.readAsText(file);
    });
  }

  renderUI();
}
