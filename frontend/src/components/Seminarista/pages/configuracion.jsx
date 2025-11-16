import React, { useState, useEffect } from 'react';
import Header from '../Shared/Header';
import Footer from '../../footer/Footer';
import './Configuracion.css';
import ConfigurationManager from './ConfigurationManager';
import useModalHandler from '../hooks/useModalHandler';
import ConfigSection from '../Shared/ConfigSection';

const ConfiguracionPage = () => {
  const [configManager] = useState(new ConfigurationManager());
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [toast, setToast] = useState(null);

  const getToastBackgroundColor = (type) => {
    if (type === 'success') return '#10b981';
    if (type === 'error') return '#ef4444';
    return '#6366f1';
  };

  useModalHandler(showDeleteModal, 'deleteModal', () => setShowDeleteModal(false));
  useModalHandler(showSuccessModal, 'successModal', () => setShowSuccessModal(false));

  useEffect(() => {
    // Inicializar hooks React en el manager para que pueda mostrar modales/toasts
    if (configManager && typeof configManager.setReactHooks === 'function') {
      configManager.setReactHooks({
        showDeleteModal: setShowDeleteModal,
        showSuccessModal: setShowSuccessModal,
        showToast: setToast,
      });
    }
  }, [configManager]);

  const sections = [
    {
      iconClass: 'notifications-icon',
      title: 'Notificaciones',
      settings: [
        {
          name: 'Notificaciones por Correo',
          description: 'Recibe notificaciones importantes en tu correo',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
        {
          name: 'Notificaciones Push',
          description: 'Recibe notificaciones en tiempo real',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
        {
          name: 'Eventos',
          description: '',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
        {
          name: 'Reservas',
          description: '',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
        {
          name: 'Solicitudes',
          description: '',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
        {
          name: 'Seguridad',
          description: '',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
      ],
    },
    {
      iconClass: 'privacy-icon',
      title: 'Privacidad',
      settings: [
        {
          name: 'Perfil Público',
          description: 'Permite que otros seminaristas vean tu perfil',
          defaultChecked: false,
          onChange: (e) => configManager.handleCheckboxChange(e.target),
        },
        {
          name: 'Mostrar Email',
          description: '',
          defaultChecked: false,
          onChange: (e) => configManager.handleCheckboxChange(e.target),
        },
        {
          name: 'Mostrar Teléfono',
          description: '',
          defaultChecked: false,
          onChange: (e) => configManager.handleCheckboxChange(e.target),
        },
        {
          name: 'Permitir Contacto',
          description: '',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
      ],
    },
    {
      iconClass: 'appearance-icon',
      title: 'Apariencia',
      settings: [
        {
          name: 'Tema',
          description: '',
          options: [
            { value: 'light', label: 'Claro' },
            { value: 'auto', label: 'Automático' },
            { value: 'dark', label: 'Oscuro' },
          ],
          onChange: (value) => configManager.handleThemeChange(value),
        },
        {
          name: 'Idioma',
          description: 'Selecciona el idioma de la aplicación',
          options: [
            { value: 'es', label: 'Español' },
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'Français' },
          ],
          onChange: (value) => (configManager.settings.appearance.language = value),
        },
        {
          name: 'Cambiar de País',
          description: 'Selecciona el país de residencia',
          options: [
            { value: 'co', label: 'Colombia' },
            { value: 'mx', label: 'México' },
            { value: 'ar', label: 'Argentina' },
          ],
          onChange: (value) => (configManager.settings.appearance.country = value),
        },
      ],
    },
    {
      iconClass: 'security-icon',
      title: 'Seguridad',
      settings: [
        {
          name: 'Autenticación de Dos Factores',
          description: 'Añade una capa extra de seguridad a tu cuenta',
          defaultChecked: false,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
        {
          name: 'Cambiar Contraseña',
          description: '',
          onChange: () => configManager.handlePasswordChange(),
        },
      ],
    },
    {
      iconClass: 'communications-icon',
      title: 'Comunicaciones',
      settings: [
        {
          name: 'Newsletter del Seminario',
          description: 'Recibe noticias y actualizaciones del seminario',
          defaultChecked: true,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
        {
          name: 'Comunicaciones de Marketing',
          description: 'Recibe información sobre eventos especiales y promociones',
          defaultChecked: false,
          onChange: (e) => configManager.handleToggleChange(e.target),
        },
      ],
    },
  ];

  return (
    <>
      <Header />
      <div className="main-content">
        <div className="container">
          <div className="page-header">
            <div className="page-title-section">
              <h1 className="page-title">Configuración</h1>
              <p className="page-subtitle">Gestiona tus preferencias y configuraciones</p>
            </div>
            <button
              className="save-btn"
              id="saveBtn"
              onClick={() => configManager.saveSettings()}
            >
              Guardar Cambios
            </button>
          </div>
          <div className="config-sections">
            {sections.map((section) => (
              <ConfigSection
                key={section.title}
                iconClass={section.iconClass}
                title={section.title}
                settings={section.settings}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDeleteModal && (
        <dialog
          id="deleteModal"
          className="modal"
          open={showDeleteModal}
        >
          <div 
            className="modal-content"
            aria-labelledby="delete-modal-title"
          >
            <h3 id="delete-modal-title">¿Estás seguro?</h3>
            <p>Esta acción no se puede deshacer. Se eliminarán permanentemente todos tus datos.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Cancelar</button>
              <button 
                className="confirm-delete-btn"
                onClick={() => {
                  configManager.deleteAccount();
                  setShowDeleteModal(false);
                }}
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
          <button 
            className="modal-backdrop"
            onClick={() => setShowDeleteModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowDeleteModal(false);
              }
            }}
            aria-label="Cerrar modal"
            tabIndex={0}
            type="button"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
            }}
          />
        </dialog>
      )}

      {showSuccessModal && (
        <dialog
          id="successModal"
          className="modal"
          open={showSuccessModal}
        >
          <div 
            className="modal-content"
            aria-labelledby="success-modal-title"
          >
            <div className="success-icon">
              
            </div>
            <h3 id="success-modal-title">¡Configuración Guardada!</h3>
            <p>Tus cambios han sido guardados exitosamente.</p>
            <button className="ok-btn" onClick={() => setShowSuccessModal(false)}>Entendido</button>
          </div>
          <button 
            className="modal-backdrop"
            onClick={() => setShowSuccessModal(false)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setShowSuccessModal(false);
              }
            }}
            aria-label="Cerrar modal"
            tabIndex={0}
            type="button"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'transparent',
              border: 'none',
            }}
          />
        </dialog>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast-${toast.type}`} style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: getToastBackgroundColor(toast.type),
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

    <Footer />
    </>
  );
};

export default ConfiguracionPage;