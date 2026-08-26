/**
 * Ev Ekonomisi - Eşler Arası Ortak Bütçe & Hesaplaşma Bileşeni
 */

import { store } from '../state.js';
import { formatCurrency, formatMonthYear } from '../utils/formatters.js';

export function renderHouseholdSettlement(container) {
  const profiles = store.state.profiles;
  const user1 = profiles[0] || { id: 'user_1', name: 'Ahmet', avatar: '👨‍💼' };
  const user2 = profiles[1] || { id: 'user_2', name: 'Ayşe', avatar: '👩‍💼' };
  const currentMonthTxs = store.state.transactions.filter(t => t.date.startsWith(store.selectedMonth));

  // Shared Transactions Only
  const sharedTxs = currentMonthTxs.filter(t => t.isShared !== false);

  // User 1 Stats
  const u1Income = currentMonthTxs.filter(t => t.profileId === user1.id && t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const u1TotalExpense = currentMonthTxs.filter(t => t.profileId === user1.id && t.type === 'outcome').reduce((acc, t) => acc + Number(t.amount), 0);
  const u1SharedExpense = sharedTxs.filter(t => t.profileId === user1.id && t.type === 'outcome').reduce((acc, t) => acc + Number(t.amount), 0);

  // User 2 Stats
  const u2Income = currentMonthTxs.filter(t => t.profileId === user2.id && t.type === 'income').reduce((acc, t) => acc + Number(t.amount), 0);
  const u2TotalExpense = currentMonthTxs.filter(t => t.profileId === user2.id && t.type === 'outcome').reduce((acc, t) => acc + Number(t.amount), 0);
  const u2SharedExpense = sharedTxs.filter(t => t.profileId === user2.id && t.type === 'outcome').reduce((acc, t) => acc + Number(t.amount), 0);

  // Shared Total Expense
  const totalSharedExpense = u1SharedExpense + u2SharedExpense;
  const fairSharePerPerson = totalSharedExpense / 2;

  // Net Difference:
  // positive means user paid more than fair share (is owed money)
  // negative means user paid less than fair share (owes money)
  const u1Diff = u1SharedExpense - fairSharePerPerson;
  const u2Diff = u2SharedExpense - fairSharePerPerson;

  container.innerHTML = `
    <div class="animate-fade" style="padding: 16px;">
      <div style="margin-bottom: 16px;">
        <h2 class="title-lg">⚖️ Eşler Arası Hesaplaşma</h2>
        <div class="subtext">${formatMonthYear(store.selectedMonth)} Dönemi Ortak Harcama Özet Tablosu</div>
      </div>

      <!-- Main Settlement Banner Card -->
      <div class="settlement-card">
        <div style="text-align: center; margin-bottom: 16px;">
          <span class="subtext" style="font-weight: 600;">Ortak Ev Harcamaları Toplamı</span>
          <div style="font-size: 2.2rem; font-weight: 800; color: var(--accent-blue); margin-top: 4px;">
            ${formatCurrency(totalSharedExpense)}
          </div>
          <div class="subtext" style="margin-top: 2px;">
            Kişi Başına Düşen Pay (50/50): <strong>${formatCurrency(fairSharePerPerson)}</strong>
          </div>
        </div>

        <!-- Result Box -->
        <div class="glass-card" style="background: rgba(15,23,42,0.6); padding: 16px; text-align: center; border-radius: var(--radius-md);">
          ${Math.abs(u1Diff) < 1 ? `
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-income);">
              🎉 Harcamalar Tam Dengede! (Hesaplaşma Gerekmiyor)
            </div>
          ` : u1Diff > 0 ? `
            <div style="font-size: 1rem; font-weight: 700; color: var(--accent-pink);">
              🤝 <strong>${user2.name}</strong>, <strong>${user1.name}</strong> kişisine <strong>${formatCurrency(u1Diff)}</strong> ödemeli.
            </div>
            <div class="subtext" style="margin-top: 4px;">
              ${user1.name} ortak harcamalarda ${formatCurrency(u1SharedExpense)} ödeyerek ${formatCurrency(u1Diff)} fazla katkı yaptı.
            </div>
          ` : `
            <div style="font-size: 1rem; font-weight: 700; color: var(--accent-blue);">
              🤝 <strong>${user1.name}</strong>, <strong>${user2.name}</strong> kişisine <strong>${formatCurrency(Math.abs(u1Diff))}</strong> ödemeli.
            </div>
            <div class="subtext" style="margin-top: 4px;">
              ${user2.name} ortak harcamalarda ${formatCurrency(u2SharedExpense)} ödeyerek ${formatCurrency(Math.abs(u1Diff))} fazla katkı yaptı.
            </div>
          `}
        </div>
      </div>

      <!-- Member Cards Breakdown -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
        <!-- User 1 Card -->
        <div class="glass-card" style="border-top: 4px solid ${user1.color};">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="font-size: 1.6rem;">${user1.avatar}</span>
            <div>
              <div style="font-weight: 800; font-size: 1rem;">${user1.name}</div>
              <div class="subtext">${user1.role}</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;">
              <span class="subtext">Toplam Gelir:</span>
              <span style="color: var(--accent-income); font-weight: 700;">+${formatCurrency(u1Income)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="subtext">Toplam Gider:</span>
              <span style="color: var(--accent-outcome); font-weight: 700;">-${formatCurrency(u1TotalExpense)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--glass-border); padding-top: 4px; margin-top: 2px;">
              <span class="subtext">Ortak Ödeme:</span>
              <span style="font-weight: 700;">${formatCurrency(u1SharedExpense)}</span>
            </div>
          </div>
        </div>

        <!-- User 2 Card -->
        <div class="glass-card" style="border-top: 4px solid ${user2.color};">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
            <span style="font-size: 1.6rem;">${user2.avatar}</span>
            <div>
              <div style="font-weight: 800; font-size: 1rem;">${user2.name}</div>
              <div class="subtext">${user2.role}</div>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.85rem;">
            <div style="display: flex; justify-content: space-between;">
              <span class="subtext">Toplam Gelir:</span>
              <span style="color: var(--accent-income); font-weight: 700;">+${formatCurrency(u2Income)}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span class="subtext">Toplam Gider:</span>
              <span style="color: var(--accent-outcome); font-weight: 700;">-${formatCurrency(u2TotalExpense)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1px dashed var(--glass-border); padding-top: 4px; margin-top: 2px;">
              <span class="subtext">Ortak Ödeme:</span>
              <span style="font-weight: 700;">${formatCurrency(u2SharedExpense)}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Action / Settlement Note -->
      <div class="glass-card" style="padding: 16px;">
        <div style="font-weight: 700; font-size: 0.95rem; margin-bottom: 6px;">💡 Nasıl Çalışır?</div>
        <div class="subtext" style="line-height: 1.5;">
          Ev Ekonomisi uygulaması, eşlerin ortak ev harcaması ("Ortak Ev Gideri" olarak işaretlenmiş) olarak yaptığı tüm harcamaları otomatik toplar ve tam 50/50 bölüştürür. Hangi eş kredi kartından veya nakit olarak daha fazla ödeme yaptıysa, aradaki fark otomatik hesaplanır.
        </div>
      </div>
    </div>
  `;
}
