/**
 * Ev Ekonomisi - Kullanıcı & Profil Yönetimi Bileşeni
 */

import { store } from '../state.js';

export function renderProfilesManager(container) {
  let isEditing = false;
  let editingId = null;

  const avatarList = ['👨‍💼', '👩‍💼', '👨', '👩', '🧑', '👧', '👦', '👵', '👴', '👑', '💼', '🏡'];
  const colorList = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#d97706'];

  let selectedAvatar = avatarList[0];
  let selectedColor = colorList[0];

  function renderUI() {
    const profiles = store.state.profiles;

    container.innerHTML = `
      <div class="animate-fade" style="padding: 16px;">
        <div style="margin-bottom: 16px;">
          <h2 class="title-lg">👥 Kullanıcı Profilleri</h2>
          <div class="subtext">Ev halkını ekleyin, isimlerini, rollerini ve renklerini özelleştirin</div>
        </div>

        <!-- Profil Ekle / Düzenle Kartı -->
        <div class="glass-card" style="padding: 16px; margin-bottom: 18px;">
          <div style="font-weight: 700; font-size: 1rem; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
            <span id="formTitle">${isEditing ? '✏️ Profili Düzenle' : '➕ Yeni Kullanıcı Ekle'}</span>
            ${isEditing ? `
              <button id="btnCancelEdit" class="btn btn-secondary" style="padding: 4px 8px; font-size: 0.75rem;">
                İptal
              </button>
            ` : ''}
          </div>

          <form id="profileForm">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div class="form-group">
                <label class="form-label">Kullanıcı Adı</label>
                <input type="text" id="inputProfName" class="form-control" placeholder="Örn: Ahmet, Ayşe, Mehmet" required />
              </div>

              <div class="form-group">
                <label class="form-label">Rol / Rol Tanımı</label>
                <input type="text" id="inputProfRole" class="form-control" placeholder="Örn: Koca, Hanım, Çocuk" required />
              </div>
            </div>

            <!-- Avatar Seçici -->
            <div class="form-group">
              <label class="form-label">Avatar (Simge)</label>
              <div id="profAvatarPicker" style="display: flex; gap: 8px; overflow-x: auto; padding: 6px 2px;">
                ${avatarList.map(a => `
                  <button type="button" class="btn-icon" data-avatar="${a}" style="flex-shrink: 0; width: 36px; height: 36px; font-size: 1.1rem; ${selectedAvatar === a ? 'border-color: var(--accent-blue);' : ''}">
                    ${a}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- Renk Seçici -->
            <div class="form-group">
              <label class="form-label">Renk</label>
              <div id="profColorPicker" style="display: flex; gap: 8px; overflow-x: auto; padding: 6px 2px;">
                ${colorList.map(c => `
                  <button type="button" data-color="${c}" style="width: 30px; height: 30px; border-radius: 50%; background: ${c}; border: 2px solid ${selectedColor === c ? 'white' : 'transparent'}; cursor: pointer; flex-shrink: 0;"></button>
                `).join('')}
              </div>
            </div>

            <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">
              ${isEditing ? '💾 Değişiklikleri Kaydet' : '✨ Kullanıcıyı Ekle'}
            </button>
          </form>
        </div>

        <!-- Mevcut Kullanıcı Listesi -->
        <h3 class="title-md" style="margin-bottom: 10px;">Mevcut Kullanıcılar (${profiles.length})</h3>
        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${profiles.map(p => `
            <div class="glass-card" style="padding: 14px; display: flex; align-items: center; justify-content: space-between; border-left: 5px solid ${p.color};">
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
                  ${p.avatar}
                </div>
                <div>
                  <div style="font-weight: 800; font-size: 1.05rem;">${p.name}</div>
                  <div class="subtext">${p.role}</div>
                </div>
              </div>

              <div style="display: flex; gap: 6px;">
                <button class="btn-icon" data-edit-prof-id="${p.id}" style="width: 34px; height: 34px; font-size: 0.9rem;" title="Düzenle">
                  ✏️
                </button>
                ${profiles.length > 1 ? `
                  <button class="btn-icon" data-delete-prof-id="${p.id}" style="width: 34px; height: 34px; font-size: 0.9rem; color: #f87171;" title="Sil">
                    🗑️
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div style="height: 80px;"></div>
      </div>
    `;

    // Etkinlik Bağlantıları
    const form = container.querySelector('#profileForm');
    const inputName = container.querySelector('#inputProfName');
    const inputRole = container.querySelector('#inputProfRole');
    const avatarPicker = container.querySelector('#profAvatarPicker');
    const colorPicker = container.querySelector('#profColorPicker');
    const btnCancelEdit = container.querySelector('#btnCancelEdit');

    btnCancelEdit?.addEventListener('click', () => {
      isEditing = false;
      editingId = null;
      renderUI();
    });

    avatarPicker?.querySelectorAll('[data-avatar]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedAvatar = btn.getAttribute('data-avatar');
        avatarPicker.querySelectorAll('[data-avatar]').forEach(b => b.style.borderColor = 'var(--glass-border)');
        btn.style.borderColor = 'var(--accent-blue)';
      });
    });

    colorPicker?.querySelectorAll('[data-color]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectedColor = btn.getAttribute('data-color');
        colorPicker.querySelectorAll('[data-color]').forEach(b => b.style.borderColor = 'transparent');
        btn.style.borderColor = 'white';
      });
    });

    // Düzenleme Butonları
    container.querySelectorAll('[data-edit-prof-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-edit-prof-id');
        const prof = store.state.profiles.find(p => p.id === pid);
        if (prof) {
          isEditing = true;
          editingId = pid;
          inputName.value = prof.name;
          inputRole.value = prof.role;
          selectedAvatar = prof.avatar;
          selectedColor = prof.color;
          renderUI();
          container.querySelector('#inputProfName').focus();
        }
      });
    });

    // Silme Butonları
    container.querySelectorAll('[data-delete-prof-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const pid = btn.getAttribute('data-delete-prof-id');
        if (confirm('Bu kullanıcı profilini silmek istediğinize emin misiniz?')) {
          await store.deleteProfile(pid);
          renderUI();
        }
      });
    });

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameVal = inputName.value.trim();
      const roleVal = inputRole.value.trim();

      if (!nameVal || !roleVal) return;

      if (isEditing && editingId) {
        await store.updateProfile({
          id: editingId,
          name: nameVal,
          role: roleVal,
          avatar: selectedAvatar,
          color: selectedColor
        });
      } else {
        await store.addProfile({
          id: 'user_' + Date.now(),
          name: nameVal,
          role: roleVal,
          avatar: selectedAvatar,
          color: selectedColor
        });
      }

      isEditing = false;
      editingId = null;
      renderUI();
    });
  }

  renderUI();
}
