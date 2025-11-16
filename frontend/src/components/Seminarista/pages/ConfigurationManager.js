// ConfigurationManager moved out from configuracion.jsx to reduce duplication
export default class ConfigurationManager {
  constructor() {
    this.settings = {
      notifications: {
        email: true,
        push: true,
        events: true,
        reservas: true,
        solicitudes: true,
        security: true
      },
      privacy: {
        showEmail: false,
        showPhone: false,
        allowContact: true
      },
      appearance: {
        theme: 'auto',
        language: 'es',
        country: 'co'
      },
      communications: {
        newsletter: true,
        marketing: false
      }
    };

    this.reactHooks = {};
    this.loadSettings();
  }

  setReactHooks(hooks) {
    this.reactHooks = hooks;
  }

  loadSettings() {
    const saved = localStorage.getItem('seminario-config');
    if (saved) {
      this.settings = { ...this.settings, ...JSON.parse(saved) };
    }
  }

  saveSettings() {
    localStorage.setItem('seminario-config', JSON.stringify(this.settings));
    this.showSuccessModal();
  }

  handleToggleChange(toggle) {
    const section = toggle.closest('.config-section');
    const sectionTitle = section.querySelector('.section-title').textContent.toLowerCase();
    const settingItem = toggle.closest('.setting-item');
    const settingName = settingItem.querySelector('h3').textContent;

    const toggleMappings = {
      'notificaciones': {
        'Notificaciones por Correo': 'email',
        'Notificaciones Push': 'push',
        'Eventos': 'events',
        'Reservas': 'reservas',
        'Solicitudes': 'solicitudes',
        'Seguridad': 'security'
      },
      'privacidad': {
        'Permitir Contacto': 'allowContact'
      },
      'comunicaciones': {
        'Newsletter del Seminario': 'newsletter',
        'Comunicaciones de Marketing': 'marketing'
      }
    };

    if (sectionTitle === 'notificaciones' && toggleMappings.notificaciones[settingName]) {
      this.settings.notifications[toggleMappings.notificaciones[settingName]] = toggle.checked;
    } else if (sectionTitle === 'privacidad' && toggleMappings.privacidad[settingName]) {
      this.settings.privacy[toggleMappings.privacidad[settingName]] = toggle.checked;
    } else if (sectionTitle === 'comunicaciones' && toggleMappings.comunicaciones[settingName]) {
      this.settings.communications[toggleMappings.comunicaciones[settingName]] = toggle.checked;
    }

    this.showUnsavedChanges();
  }

  handleCheckboxChange(checkbox) {
    const checkboxText = checkbox.nextElementSibling.nextElementSibling.textContent;

    if (checkboxText === 'Mostrar Email') {
      this.settings.privacy.showEmail = checkbox.checked;
    } else if (checkboxText === 'Mostrar Teléfono') {
      this.settings.privacy.showPhone = checkbox.checked;
    }

    this.showUnsavedChanges();
  }

  handleThemeChange(theme) {
    const themeOptions = document.querySelectorAll('.theme-option');
    for (const option of themeOptions) {
      option.classList.remove('active');
    }
    document.querySelector(`[data-theme="${theme}"]`).classList.add('active');

    this.settings.appearance.theme = theme;
    this.applyTheme(theme);
    this.showUnsavedChanges();
  }

  applyTheme(theme) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'light') {
      body.classList.add('light-theme');
    } else {
      const prefersDark = globalThis.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        body.classList.add('dark-theme');
      }
    }
  }

  handlePasswordChange() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!currentPassword || !newPassword || !confirmPassword) {
      this.showToast('Por favor, completa todos los campos', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      this.showToast('Las contraseñas no coinciden', 'error');
      return;
    }

    if (newPassword.length < 8) {
      this.showToast('La contraseña debe tener al menos 8 caracteres', 'error');
      return;
    }

    setTimeout(() => {
      this.showToast('Contraseña cambiada exitosamente', 'success');
      document.getElementById('currentPassword').value = '';
      document.getElementById('newPassword').value = '';
      document.getElementById('confirmPassword').value = '';
    }, 1000);
  }

  showDeleteModal() {
    this.reactHooks.showDeleteModal(true);
  }

  deleteAccount() {
    this.showToast('Cuenta eliminada. Redirigiendo...', 'success');
    setTimeout(() => {
      globalThis.location.href = '/login.html';
    }, 2000);
  }

  exportData() {
    const exportData = {
      profile: {
        name: 'Juan Carlos Mendoza',
        email: 'juan.mendoza@seminario.edu.co',
        phone: '+57 300 123 4567'
      },
      settings: this.settings,
      exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'mis-datos-seminario.json';
    link.click();

    this.showToast('Datos exportados exitosamente', 'success');
  }

  showUnsavedChanges() {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.style.background = '#f59e0b';
      saveBtn.innerHTML = '<i class="fas fa-exclamation-circle"></i> Cambios sin Guardar';
    }
  }

  showSuccessModal() {
    this.reactHooks.showSuccessModal(true);
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
      saveBtn.style.background = '#6366f1';
      saveBtn.innerHTML = '<i class="fas fa-save"></i> Guardar Cambios';
    }
  }

  showToast(message, type = 'info') {
    this.reactHooks.showToast({ message, type });
    setTimeout(() => this.reactHooks.showToast(null), 3000);
  }
}
