import React, { useState, useEffect } from 'react';
import Header from '../Shared/Header';
import Footer from '../../footer/Footer';
import './Configuracion.css';

const ConfiguracionPage = () => {
  const [configManager] = useState(new ConfigurationManager());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    // Inicialización del manager
    configManager.setReactHooks({
      showDeleteModal: setShowDeleteModal,
      showSuccessModal: setShowSuccessModal,
      showToast: setToast
    });
  }, [configManager]);

  const closeModal = () => {
    setShowDeleteModal(false);
    setShowSuccessModal(false);
  };

  return (
    <>
     <Header/>
    <div className="main-content">
       
      <div className="container">
        <div className="page-header">
          <div className="page-title-section">
            <h1 className="page-title">Configuración</h1>
            <p className="page-subtitle">Gestiona tus preferencias y configuraciones</p>
          </div>
          <button className="save-btn" id="saveBtn" onClick={() => configManager.saveSettings()}>
      
            Guardar Cambios
          </button>
        </div>

        <div className="config-sections">
          {/* Notificaciones */}
          <section className="config-section">
            <div className="section-header">
              <div className="section-icon notifications-icon">
         
              </div>
              <h2 className="section-title">Notificaciones</h2>
            </div>
            <div className="section-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Notificaciones por Correo</h3>
                  <p>Recibe notificaciones importantes en tu correo</p>
                </div>
                <label htmlFor="emailNotifications" className="toggle-switch">
                  <span className="sr-only">Activar notificaciones por correo</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    onChange={(e) => configManager.handleToggleChange(e.target)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Notificaciones Push</h3>
                  <p>Recibe notificaciones en tiempo real</p>
                </div>
                <label htmlFor="pushNotifications" className="toggle-switch">
                  <span className="sr-only">Activar notificaciones push</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    onChange={(e) => configManager.handleToggleChange(e.target)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-row">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Eventos</h3>
                  </div>
                  <label htmlFor="eventNotifications" className="toggle-switch">
                    <span className="sr-only">Activar notificaciones de eventos</span>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      onChange={(e) => configManager.handleToggleChange(e.target)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Reservas</h3>
                  </div>
                  <label htmlFor="reservationNotifications" className="toggle-switch">
                    <span className="sr-only">Activar notificaciones de reservas</span>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      onChange={(e) => configManager.handleToggleChange(e.target)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Solicitudes</h3>
                  </div>
                  <label htmlFor="requestNotifications" className="toggle-switch">
                    <span className="sr-only">Activar notificaciones de solicitudes</span>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      onChange={(e) => configManager.handleToggleChange(e.target)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>Seguridad</h3>
                  </div>
                  <label htmlFor="securityNotifications" className="toggle-switch">
                    <span className="sr-only">Activar notificaciones de seguridad</span>
                    <input 
                      type="checkbox" 
                      defaultChecked 
                      onChange={(e) => configManager.handleToggleChange(e.target)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Privacidad */}
          <section className="config-section">
            <div className="section-header">
              <div className="section-icon privacy-icon">
                
              </div>
              <h2 className="section-title">Privacidad</h2>
            </div>
            <div className="section-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Perfil Público</h3>
                  <p>Permite que otros seminaristas vean tu perfil</p>
                </div>
              </div>
              <div className="setting-row">
                <div className="setting-item">
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      onChange={(e) => configManager.handleCheckboxChange(e.target)}
                    />
                    <span className="checkmark"></span>
                    <span>Mostrar Email</span>
                  </label>
                </div>
                <div className="setting-item">
                  <label className="checkbox-item">
                    <input 
                      type="checkbox" 
                      onChange={(e) => configManager.handleCheckboxChange(e.target)}
                    />
                    <span className="checkmark"></span>
                    <span>Mostrar Teléfono</span>
                  </label>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Permitir Contacto</h3>
                </div>
                  <label className="toggle-switch">
                    <span className="sr-only">Permitir contacto</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    onChange={(e) => configManager.handleToggleChange(e.target)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </section>

          {/* Apariencia */}
          <section className="config-section">
            <div className="section-header">
              <div className="section-icon appearance-icon">
                
              </div>
              <h2 className="section-title">Apariencia</h2>
            </div>
            <div className="section-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Tema</h3>
                </div>
              </div>
              <div className="theme-selector">
                <button 
                  className="theme-option" 
                  data-theme="light"
                  onClick={() => configManager.handleThemeChange('light')}
                >
                 
                </button>
                <button 
                  className="theme-option active" 
                  data-theme="auto"
                  onClick={() => configManager.handleThemeChange('auto')}
                >
                  
                </button>
                <button 
                  className="theme-option" 
                  data-theme="dark"
                  onClick={() => configManager.handleThemeChange('dark')}
                >
                 
                </button>
              </div>
              <div className="setting-row">
                <div className="setting-item">
                  <label htmlFor="idioma">Idioma</label>
                  <select 
                    id="idioma" 
                    className="select-input"
                    onChange={(e) => configManager.settings.appearance.language = e.target.value}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label htmlFor="pais">Cambiar de País</label>
                  <select 
                    id="pais" 
                    className="select-input"
                    onChange={(e) => configManager.settings.appearance.country = e.target.value}
                  >
                    <option value="co">Colombia</option>
                    <option value="mx">México</option>
                    <option value="ar">Argentina</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Seguridad */}
          <section className="config-section">
            <div className="section-header">
              <div className="section-icon security-icon">
                
              </div>
              <h2 className="section-title">Seguridad</h2>
            </div>
            <div className="section-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Autenticación de Dos Factores</h3>
                  <p>Añade una capa extra de seguridad a tu cuenta</p>
                </div>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Cambiar Contraseña</h3>
                </div>
              </div>
              <div className="password-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="currentPassword">Contraseña Actual</label>
                    <input type="password" id="currentPassword" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <input type="password" id="newPassword" className="form-input" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                  <input type="password" id="confirmPassword" className="form-input" />
                </div>
                <button 
                  className="change-password-btn"
                  onClick={() => configManager.handlePasswordChange()}
                >
                  Cambiar Contraseña
                </button>
              </div>
            </div>
          </section>

          {/* Comunicaciones */}
          <section className="config-section">
            <div className="section-header">
              <div className="section-icon communications-icon">
                
              </div>
              <h2 className="section-title">Comunicaciones</h2>
            </div>
            <div className="section-content">
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Newsletter del Seminario</h3>
                  <p>Recibe noticias y actualizaciones del seminario</p>
                </div>
                <label className="toggle-switch">
                  <span className="sr-only">Suscribirse al newsletter</span>
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    onChange={(e) => configManager.handleToggleChange(e.target)}
                  />
                  <span className="slider"></span>
                </label>
              </div>
              <div className="setting-item">
                <div className="setting-info">
                  <h3>Comunicaciones de Marketing</h3>
                  <p>Recibe información sobre eventos especiales y promociones</p>
                </div>
              </div>
            </div>
          </section>

          {/* Zona de Peligro */}
          <section className="config-section danger-zone">
            <div className="section-header">
              <div className="section-icon danger-icon">
                
              </div>
              <h2 className="section-title">Zona de Peligro</h2>
            </div>
            <div className="section-content">
              <div className="danger-item">
                <div className="danger-info">
                  <h3>Eliminar Cuenta</h3>
                  <p>Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.</p>
                </div>
                <button 
                  className="danger-btn" 
                  id="deleteAccountBtn"
                  onClick={() => configManager.showDeleteModal()}
                >
                  Eliminar Cuenta
                </button>
              </div>
              <div className="danger-item">
                <div className="danger-info">
                  <h3>Exportar Datos</h3>
                  <p>Descarga una copia de todos tus datos personales y actividad de la cuenta.</p>
                </div>
                <button 
                  className="export-btn" 
                  id="exportDataBtn"
                  onClick={() => configManager.exportData()}
                >
                  Exportar Datos
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <div
          id="deleteModal"
          className="modal"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={(e) => e.target.id === 'deleteModal' && closeModal()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeModal();
          }}
        >
          <div className="modal-content">
            <h3>¿Estás seguro?</h3>
            <p>Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={closeModal}>Cancelar</button>
              <button 
                className="confirm-delete-btn"
                onClick={() => {
                  configManager.deleteAccount();
                  closeModal();
                }}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div
          id="successModal"
          className="modal"
          role="dialog"
          aria-modal="true"
          tabIndex={-1}
          onClick={(e) => e.target.id === 'successModal' && closeModal()}
          onKeyDown={(e) => {
            if (e.key === 'Escape') closeModal();
          }}
        >
          <div className="modal-content">
            <div className="success-icon">
              
            </div>
            <h3>¡Configuración Guardada!</h3>
            <p>Tus cambios han sido guardados exitosamente.</p>
            <button className="ok-btn" onClick={closeModal}>Entendido</button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#6366f1',
          color: 'white',
          padding: '1rem 1.5rem',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          zIndex: '1001',
          animation: 'slideInRight 0.3s ease'
        }}>
    
          <span>{toast.message}</span>
        </div>
      )}
    
    </div>
      <Footer/>
    </>
  );
};

// ConfigurationManager class (same logic as original but adapted for React)
class ConfigurationManager {
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

export default ConfiguracionPage;