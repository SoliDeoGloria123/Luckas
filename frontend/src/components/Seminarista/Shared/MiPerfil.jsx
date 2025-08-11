import React, { useState, useEffect } from 'react';
import { FaHome, FaCalendarAlt, FaHouseUser, FaFileAlt, FaBook, FaClipboardList, FaPlus, FaBell, FaUser, FaChevronDown, FaEdit, FaPhoneAlt, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import './MiPerfil.css';
import Header from './Header';
import Footer from '../../footer/Footer';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Juan Carlos Mendoza",
    currentLevel: "4to Año - Teología",
    email: "juan.mendoza@seminario.edu.co",
    phone: "+57 300 123 4567",
    address: "Calle 123 #45-67, Bogotá",
    admissionDate: "2021-01-31",
    documentId: "1234567890",
    dob: "1995-03-14",
    pob: "Bogotá, Colombia",
    spiritualDirector: "Padre Miguel Rodríguez",
    languages: "Español (nativo), Inglés",
    eventsCount: 12,
    reservationsCount: 5,
    requestsCount: 8,
    subscriptionsCount: 3,
  });
  const [formData, setFormData] = useState({...profileData});

  useEffect(() => {
    setFormData({...profileData});
  }, [profileData]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id.replace('edit', '').toLowerCase()]: value
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    let isValid = true;
    const requiredFields = ['fullName', 'documentId', 'dob', 'pob', 'address', 'email', 'phone', 'currentLevel', 'admissionDate', 'spiritualDirector', 'languages'];
    
    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === '') {
        isValid = false;
        break;
      }
    }

    if (isValid) {
      setProfileData({...formData});
      setIsEditing(false);
      alert("¡Cambios guardados exitosamente!");
    } else {
      alert("Por favor, completa todos los campos requeridos.");
    }
  };

  const handleCancelClick = () => {
    setFormData({...profileData});
    setIsEditing(false);
  };

  return (
    <div className="html" lang="es">
      <Header />
      <main className="main-content">
        <div className="profile-header">
          <div>
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal y académica</p>
          </div>
          {!isEditing && (
            <button id="editProfileBtn" className="btn btn-primary" onClick={handleEditClick}>
              <FaEdit /> Editar Perfil
            </button>
          )}
        </div>

        <div className="profile-container">
          <div className="profile-card">
            <div className="profile-picture-wrapper">
              <img src="/profile-picture.png" alt="Profile Picture" className="profile-picture" />
            </div>
            <h2 className="profile-name" data-field="fullName">{profileData.fullName}</h2>
            <p className="profile-academic-info" data-field="currentLevel">{profileData.currentLevel}</p>
            <p className="profile-contact-info" data-field="email">{profileData.email}</p>
            <p className="profile-contact-info"><FaPhoneAlt /> <span data-field="phone">{profileData.phone}</span></p>
            <p className="profile-contact-info"><FaMapMarkerAlt /> <span data-field="address">{profileData.address}</span></p>
            <p className="profile-contact-info"><FaCalendarAlt /> Ingreso: <span data-field="admissionDate">{formatDate(profileData.admissionDate)}</span></p>

            <h3 className="section-title">Estadísticas</h3>
            <div className="stats-grid">
              <div className="stat-card stat-events">
                <span className="stat-value" data-field="eventsCount">{profileData.eventsCount}</span>
                <span className="stat-label">Eventos</span>
              </div>
              <div className="stat-card stat-reservations">
                <span className="stat-value" data-field="reservationsCount">{profileData.reservationsCount}</span>
                <span className="stat-label">Reservas</span>
              </div>
              <div className="stat-card stat-requests">
                <span className="stat-value" data-field="requestsCount">{profileData.requestsCount}</span>
                <span className="stat-label">Solicitudes</span>
              </div>
              <div className="stat-card stat-subscriptions">
                <span className="stat-value" data-field="subscriptionsCount">{profileData.subscriptionsCount}</span>
                <span className="stat-label">Inscripciones</span>
              </div>
            </div>
          </div>

          <div className="profile-details">
            <div className="info-section">
              <h3 className="section-title"><FaUser /> Información Personal</h3>
              {!isEditing ? (
                <div className="info-grid view-mode">
                  <div className="info-item">
                    <span className="info-label">Nombre Completo</span>
                    <span className="info-value" data-field="fullName">{profileData.fullName}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Documento de Identidad</span>
                    <span className="info-value" data-field="documentId">{profileData.documentId}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de Nacimiento</span>
                    <span className="info-value" data-field="dob">{formatDate(profileData.dob)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Lugar de Nacimiento</span>
                    <span className="info-value" data-field="pob">{profileData.pob}</span>
                  </div>
                  <div className="info-item full-width">
                    <span className="info-label">Dirección</span>
                    <span className="info-value" data-field="address">{profileData.address}</span>
                  </div>
                </div>
              ) : (
                <div className="info-grid edit-mode">
                  <div className="form-group">
                    <label htmlFor="editFullName">Nombre Completo</label>
                    <input 
                      type="text" 
                      id="editFullName" 
                      data-field="fullName" 
                      value={formData.fullName} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editDocumentId">Documento de Identidad</label>
                    <input 
                      type="text" 
                      id="editDocumentId" 
                      data-field="documentId" 
                      value={formData.documentId} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editDob">Fecha de Nacimiento</label>
                    <input 
                      type="date" 
                      id="editDob" 
                      data-field="dob" 
                      value={formData.dob} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editPob">Lugar de Nacimiento</label>
                    <input 
                      type="text" 
                      id="editPob" 
                      data-field="pob" 
                      value={formData.pob} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group full-width">
                    <label htmlFor="editAddress">Dirección</label>
                    <input 
                      type="text" 
                      id="editAddress" 
                      data-field="address" 
                      value={formData.address} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editEmail">Email</label>
                    <input 
                      type="email" 
                      id="editEmail" 
                      data-field="email" 
                      value={formData.email} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editPhone">Teléfono</label>
                    <input 
                      type="tel" 
                      id="editPhone" 
                      data-field="phone" 
                      value={formData.phone} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="info-section">
              <h3 className="section-title"><FaGraduationCap /> Información Académica</h3>
              {!isEditing ? (
                <div className="info-grid view-mode">
                  <div className="info-item">
                    <span className="info-label">Nivel Actual</span>
                    <span className="info-value" data-field="currentLevel">{profileData.currentLevel}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Fecha de Ingreso</span>
                    <span className="info-value" data-field="admissionDate">{formatDate(profileData.admissionDate)}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Director Espiritual</span>
                    <span className="info-value" data-field="spiritualDirector">{profileData.spiritualDirector}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">Idiomas</span>
                    <span className="info-value" data-field="languages">{profileData.languages}</span>
                  </div>
                </div>
              ) : (
                <div className="info-grid edit-mode">
                  <div className="form-group">
                    <label htmlFor="editCurrentLevel">Nivel Actual</label>
                    <input 
                      type="text" 
                      id="editCurrentLevel" 
                      data-field="currentLevel" 
                      value={formData.currentLevel} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editAdmissionDate">Fecha de Ingreso</label>
                    <input 
                      type="date" 
                      id="editAdmissionDate" 
                      data-field="admissionDate" 
                      value={formData.admissionDate} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editSpiritualDirector">Director Espiritual</label>
                    <input 
                      type="text" 
                      id="editSpiritualDirector" 
                      data-field="spiritualDirector" 
                      value={formData.spiritualDirector} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="editLanguages">Idiomas</label>
                    <input 
                      type="text" 
                      id="editLanguages" 
                      data-field="languages" 
                      value={formData.languages} 
                      onChange={handleInputChange}
                      required 
                    />
                  </div>
                </div>
              )}
            </div>

            {isEditing && (
              <div className="edit-actions">
                <button id="saveChangesBtn" className="btn btn-primary" onClick={handleSaveClick}>
                  Guardar Cambios
                </button>
                <button id="cancelEditBtn" className="btn btn-secondary" onClick={handleCancelClick}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
        <Footer />
    </div>
  );
};

export default ProfilePage;