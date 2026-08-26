/**
 * Ev Ekonomisi - Ana Sayfa (Dashboard) Bileşeni
 */

import { store } from '../state.js';
import { formatCurrency, formatDate, formatMonthYear } from '../utils/formatters.js';

export function renderDashboard(container) {
  const summary = store.getFinancialSummary();
  const activeProfile = store.getActiveProfile();
  const recentTxs = store.getFilteredTransactions().slice(0, 5); // İlk 5 işlem
  const categories = store.state.categories;
  const profiles = store.state.profiles;

  // Gelir ve Gider Yüzdeleri
  const totalVal = summary.totalIncome + summary.totalOutcome;
  const incomePct = totalVal > 0 ? Math.round((summary.totalIncome / totalVal) * 100) : 50;
  const outcomePct = totalVal > 0 ? Math.round((summary.totalOutcome / totalVal) * 100) : 50;

  container.innerHTML = `
    <div class="animate-fade" style="padding: 16px;">

      <!-- Hero Summary Card -->
      <div class="glass-card summary-hero-card">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <span class="subtext" style="font-weight: 600;">Net Bütçe Durumu</span>
          <span class="badge ${summary.netBalance >= 0 ? 'badge-income' : 'badge-outcome'}">
            ${summary.netBalance >= 0 ? '🟢 Tasarruf Modu' : '🔴 Açık Var'}
          </span>
        </div>

        <div class="hero-net-balance">
          <div class="hero-amount ${summary.netBalance >= 0 ? 'positive' : 'negative'}">
            ${formatCurrency(summary.netBalance)}
          </div>
          <div class="subtext" style="margin-top: 4px;">
            ${activeProfile.name} • ${formatMonthYear(store.selectedMonth)}
          </div>
        </div>

        <!-- Income & Outcome Boxes -->
        <div class="summary-grid">
          <div class="summary-box">
            <div class="summary-box-icon income-box-icon">📈</div>
            <div>
              <div class="subtext">Toplam Gelir</div>
              <div class="summary-box-val" style="color: var(--accent-income);">
                ${formatCurrency(summary.totalIncome)}
              </div>
            </div>
          </div>

          <div class="summary-box">
            <div class="summary-box-icon outcome-box-icon">📉</div>
            <div>
              <div class="subtext">Toplam Gider</div>
              <div class="summary-box-val" style="color: var(--accent-outcome);">
                ${formatCurrency(summary.totalOutcome)}
              </div>
            </div>
          </div>
        </div>

        <!-- Balance Visual Bar -->
        <div class="balance-progress-bar">
          <div class="progress-income" style="width: ${incomePct}%;" title="Gelir %${incomePct}"></div>
          <div class="progress-outcome" style="width: ${outcomePct}%;" title="Gider %${outcomePct}"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); margin-top: 6px;">
          <span>Gelir (%${incomePct})</span>
          <span>Gider (%${outcomePct})</span>
        </div>
      </div>

      <!-- Quick Action Buttons -->
      <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 18px 0;">
        <button id="btnQuickAdd" class="cat-item-card" style="padding: 12px 6px;">
          <span style="font-size: 1.5rem;">➕</span>
          <span style="font-size: 0.75rem; font-weight: 700;">İşlem Ekle</span>
        </button>

        <button id="btnQuickProfiles" class="cat-item-card" style="padding: 12px 6px;">
          <span style="font-size: 1.5rem;">👥</span>
          <span style="font-size: 0.75rem; font-weight: 700;">Kullanıcılar</span>
        </button>

        <button id="btnQuickCategories" class="cat-item-card" style="padding: 12px 6px;">
          <span style="font-size: 1.5rem;">🏷️</span>
          <span style="font-size: 0.75rem; font-weight: 700;">Kategoriler</span>
        </button>

        <button id="btnQuickIOSGuide" class="cat-item-card" style="padding: 12px 6px;">
          <span style="font-size: 1.5rem;">📱</span>
          <span style="font-size: 0.75rem; font-weight: 700;">iOS Yükle</span>
        </button>
      </div>

      <!-- Recent Transactions Section -->
      <div style="margin-top: 22px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h3 class="title-md">📋 Son İşlemler</h3>
          <button id="btnViewAllTxs" style="background: none; border: none; color: var(--accent-blue); font-size: 0.85rem; font-weight: 700; cursor: pointer;">
            Tümünü Gör →
          </button>
        </div>

        ${recentTxs.length === 0 ? `
          <div class="glass-card" style="text-align: center; padding: 30px; color: var(--text-muted);">
            <div style="font-size: 2rem; margin-bottom: 8px;">📭</div>
            <div>Bu ay için henüz işlem girilmedi.</div>
            <button id="btnEmptyAdd" class="btn btn-primary" style="margin-top: 14px;">
              + İlk İşlemi Ekle
            </button>
          </div>
        ` : `
          <div class="tx-list-wrapper">
            ${recentTxs.map(tx => {
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

    </div>
  `;

  // Etkinlik Dinleyicileri
  container.querySelector('#btnQuickAdd')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-tx-modal', { detail: { mode: 'add' } }));
  });

  container.querySelector('#btnEmptyAdd')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('open-tx-modal', { detail: { mode: 'add' } }));
  });

  container.querySelector('#btnQuickProfiles')?.addEventListener('click', () => {
    store.setActiveTab('profiles');
  });

  container.querySelector('#btnQuickCategories')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('open-categories-modal'));
  });

  container.querySelector('#btnQuickIOSGuide')?.addEventListener('click', () => {
    window.dispatchEvent(new Event('open-ios-guide'));
  });

  container.querySelector('#btnViewAllTxs')?.addEventListener('click', () => {
    store.setActiveTab('transactions');
  });

  // İşlem detay/düzenleme tıklaması
  container.querySelectorAll('[data-tx-id]').forEach(el => {
    el.addEventListener('click', () => {
      const txId = el.getAttribute('data-tx-id');
      const tx = store.state.transactions.find(t => t.id === txId);
      if (tx) {
        window.dispatchEvent(new CustomEvent('open-tx-modal', { detail: { mode: 'edit', transaction: tx } }));
      }
    });
  });
}
