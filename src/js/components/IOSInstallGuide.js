/**
 * Ev Ekonomisi - iOS Safari Ana Ekrana Ekleme Rehberi Modalı
 */

export function renderIOSInstallGuide(container) {
  container.innerHTML = `
    <div id="iosGuideOverlay" class="modal-overlay">
      <div class="modal-sheet animate-fade">
        <div class="modal-header">
          <h3 class="title-md">📱 iPhone & iOS Ana Ekrana Ekleme</h3>
          <button class="modal-close" id="btnCloseIOSGuide">✕</button>
        </div>

        <div style="line-height: 1.6; font-size: 0.92rem;">
          <p style="margin-bottom: 14px;">
            Ev Ekonomisi uygulamasını iPhone veya iPad cihazınızda tıpkı <strong>App Store'dan yüklenmiş yerel bir uygulama gibi</strong> kullanabilirsiniz.
          </p>

          <div class="glass-card" style="background: rgba(15,23,42,0.6); padding: 16px; margin-bottom: 12px;">
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 8px; color: var(--accent-blue);">
              Adım 1: Safari Paylaş Butonuna Basın
            </div>
            <div class="subtext">
              iPhone'unuzda Safari tarayıcısının alt ortasında yer alan <strong>Paylaş (Share ⎋)</strong> simgesine dokunun.
            </div>
          </div>

          <div class="glass-card" style="background: rgba(15,23,42,0.6); padding: 16px; margin-bottom: 12px;">
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 8px; color: var(--accent-income);">
              Adım 2: "Ana Ekrana Ekle" Seçin
            </div>
            <div class="subtext">
              Açılan menüyü biraz aşağı kaydırıp <strong>"Ana Ekrana Ekle" (Add to Home Screen ➕)</strong> seçeneğine tıklayın.
            </div>
          </div>

          <div class="glass-card" style="background: rgba(15,23,42,0.6); padding: 16px; margin-bottom: 16px;">
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 8px; color: var(--accent-purple);">
              Adım 3: Tam Ekran Uygulama Keyfi!
            </div>
            <div class="subtext">
              "Ekle" butonuna bastığınızda telefonunuzun ana ekranında özel simgesiyle yer alacak, Safari adres çubuğu olmadan tam ekran çalışacaktır.
            </div>
          </div>

          <button id="btnGotItIOS" class="btn btn-primary" style="width: 100%;">
            👍 Anladım
          </button>
        </div>
      </div>
    </div>
  `;

  const overlay = container.querySelector('#iosGuideOverlay');
  const btnClose = container.querySelector('#btnCloseIOSGuide');
  const btnGotIt = container.querySelector('#btnGotItIOS');

  window.addEventListener('open-ios-guide', () => {
    overlay.classList.add('active');
  });

  btnClose?.addEventListener('click', () => overlay.classList.remove('active'));
  btnGotIt?.addEventListener('click', () => overlay.classList.remove('active'));
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('active'); });
}
