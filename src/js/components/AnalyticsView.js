/**
 * Ev Ekonomisi - İstatistikler & Analiz Bileşeni
 */

import { store } from '../state.js';
import { formatCurrency, formatMonthYear } from '../utils/formatters.js';

export function renderAnalyticsView(container) {
  const txs = store.getFilteredTransactions();
  const categories = store.state.categories;

  // Gider Kategorileri Dağılımı
  const outcomeTxs = txs.filter(t => t.type === 'outcome');
  const totalOutcome = outcomeTxs.reduce((acc, t) => acc + Number(t.amount), 0);

  // Kategori Bazlı Gruplama
  const categoryStats = {};
  outcomeTxs.forEach(t => {
    if (!categoryStats[t.categoryId]) {
      categoryStats[t.categoryId] = 0;
    }
    categoryStats[t.categoryId] += Number(t.amount);
  });

  const sortedCategories = Object.keys(categoryStats).map(catId => {
    const cat = categories.find(c => c.id === catId) || { name: 'Diğer', icon: '❓', color: '#94a3b8' };
    const amount = categoryStats[catId];
    const percentage = totalOutcome > 0 ? Math.round((amount / totalOutcome) * 100) : 0;
    return { cat, amount, percentage };
  }).sort((a, b) => b.amount - a.amount);

  // Ödeme Tipi Gruplaması
  const paymentStats = {};
  outcomeTxs.forEach(t => {
    const pMethod = t.paymentMethod || 'Diğer';
    if (!paymentStats[pMethod]) paymentStats[pMethod] = 0;
    paymentStats[pMethod] += Number(t.amount);
  });

  container.innerHTML = `
    <div class="animate-fade" style="padding: 16px;">
      <div style="margin-bottom: 16px;">
        <h2 class="title-lg">📈 İstatistikler & Analiz</h2>
        <div class="subtext">${formatMonthYear(store.selectedMonth)} Harcama Dağılımı</div>
      </div>

      <!-- Category Breakdown Section -->
      <div class="glass-card" style="margin-bottom: 18px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
          <h3 class="title-md">📊 Gider Kategorileri Dağılımı</h3>
          <span class="badge badge-outcome">${formatCurrency(totalOutcome)}</span>
        </div>

        ${sortedCategories.length === 0 ? `
          <div style="text-align: center; padding: 20px; color: var(--text-muted);">
            Harçlık/Gider verisi bulunmuyor.
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 14px;">
            ${sortedCategories.map(item => `
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem; margin-bottom: 4px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 1.2rem;">${item.cat.icon}</span>
                    <span style="font-weight: 700;">${item.cat.name}</span>
                  </div>
                  <div>
                    <span style="font-weight: 800;">${formatCurrency(item.amount)}</span>
                    <span class="subtext" style="margin-left: 4px;">(%${item.percentage})</span>
                  </div>
                </div>
                <!-- Progress Bar -->
                <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: var(--radius-full); overflow: hidden;">
                  <div style="width: ${item.percentage}%; height: 100%; background: ${item.cat.color}; transition: width 0.4s ease;"></div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Payment Method Distribution -->
      <div class="glass-card">
        <h3 class="title-md" style="margin-bottom: 12px;">💳 Ödeme Yöntemi Dağılımı</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 10px;">
          ${Object.keys(paymentStats).map(pMethod => {
            const amt = paymentStats[pMethod];
            const pct = totalOutcome > 0 ? Math.round((amt / totalOutcome) * 100) : 0;
            return `
              <div style="background: rgba(15,23,42,0.5); padding: 12px; border-radius: var(--radius-md); border: 1px solid var(--glass-border);">
                <div class="subtext">${pMethod}</div>
                <div style="font-weight: 800; font-size: 1.1rem; margin: 4px 0;">${formatCurrency(amt)}</div>
                <div class="badge badge-neutral" style="font-size: 0.7rem;">%${pct} oran</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}
