/**
 * Ev Ekonomisi - Biçimlendirici Yardımcı Fonksiyonlar
 */

// Para Birimi Biçimlendirici (Örn: 45.000 ₺)
export function formatCurrency(amount, symbol = '₺') {
  if (amount === undefined || amount === null || isNaN(amount)) return `0 ${symbol}`;
  const formatted = new Intl.NumberFormat('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount);

  return `${formatted} ${symbol}`;
}

// Tarih Biçimlendirici (Örn: 26 Ağustos 2026 veya 26 Ağu)
export function formatDate(dateString, short = false) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = short 
    ? { day: 'numeric', month: 'short' }
    : { day: 'numeric', month: 'long', year: 'numeric' };

  return new Intl.DateTimeFormat('tr-TR', options).format(date);
}

// Ay ve Yıl Yazısı (Örn: Ağustos 2026)
export function formatMonthYear(yearMonthStr) {
  // yearMonthStr: '2026-08'
  if (!yearMonthStr) return '';
  const [year, month] = yearMonthStr.split('-');
  const date = new Date(parseInt(year), parseInt(month) - 1, 1);
  return new Intl.DateTimeFormat('tr-TR', { month: 'long', year: 'numeric' }).format(date);
}

// Su anki Yıl-Ay (YYYY-MM)
export function getCurrentYearMonth() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}
