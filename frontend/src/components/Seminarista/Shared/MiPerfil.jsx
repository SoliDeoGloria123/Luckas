import React, { useState, useEffect } from 'react';
import { FaHome, FaCalendarAlt, FaHouseUser, FaFileAlt, FaBook, FaClipboardList, FaPlus, FaBell, FaUser, FaChevronDown, FaEdit, FaPhoneAlt, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';
import './MiPerfil.css';
import Header from './Header';
import Footer from '../../footer/Footer';
import { userService } from '../../../services/userService';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [formData, setFormData] = useState({});

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

  const handleCancelClick = () => {
    setFormData({ ...profileData });
    setIsEditing(false);
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("userId en localStorage:", userId);
    if (userId) {
      userService.getUserById(userId)
        .then(data => {
          console.log("Datos recibidos del backend:", data);
          const user = data.user || {};
          const mappedData = {
            nombre: user.nombre,
            currentLevel: user.nivelAcademico || "",
            correo: user.correo,
            phone: user.telefono,
            address: user.direccion,
            admissionDate: user.fechaIngreso,
            documentId: user.numeroDocumento,
            dob: user.fechaNacimiento,
            pob: user.lugarNacimiento,
            spiritualDirector: user.directorEspiritual,
            languages: user.idiomas,
            eventsCount: user.eventosCount || 0,
            reservationsCount: user.reservasCount || 0,
            requestsCount: user.solicitudesCount || 0,
            subscriptionsCount: user.inscripcionesCount || 0,
          };
          setProfileData(mappedData);
          setFormData(mappedData);
        })
        .catch(err => {
          console.error("Error al obtener datos del usuario:", err);
        });
    } else {
      console.warn("No hay userId en localStorage, usuario no logueado");
    }
  }, []);

  // Formatea la fecha para mostrarla en formato legible
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };


  return (
    <>
      <Header />
      <main className="main-content-miperfil">
        <div className="profile-header-miperfil">
          <div>
            <h1>Mi Perfil</h1>
            <p>Gestiona tu información personal y académica</p>
          </div>
          {!isEditing && (
            <button id="editProfileBtn" className="btn-miperfil btn-primary-miperfil" onClick={handleEditClick}>
              <FaEdit /> Editar Perfil
            </button>
          )}
        </div>

        <div className="profile-container-miperfil">
          <div className="profile-card-miperfil">
              <div className="profile-picture-wrapper-miperfil">
                <img src="/profile-picture.png" alt="Profile Picture" className="profile-picture-miperfil" />
              </div>
              <h2 className="profile-name-miperfil">{formData.nombre}</h2>
              <p className="profile-academic-info-miperfil"></p>
              <p className="profile-contact-info-miperfil"></p>
              <p className="profile-contact-info-miperfil"><FaPhoneAlt /> {formData.phone}</p>
              <p className="profile-contact-info-miperfil"><FaMapMarkerAlt /> {formData.address}</p>
              <p className="profile-contact-info-miperfil"><FaCalendarAlt /> Ingreso: {formatDate(formData.admissionDate)}</p>

              <h3 className="section-title-miperfil">Estadísticas</h3>
              <div className="stats-grid-miperfil">
                <div className="stat-card-miperfil stat-events">
                  <span className="stat-value-miperfil" >{formData.eventsCount}</span>
                  <span className="stat-label-miperfil">Eventos</span>
                </div>
                <div className="stat-card-miperfil stat-reservations">
                  <span className="stat-value-miperfil">{formData.reservationsCount}</span>
                  <span className="stat-label-miperfil">Reservas</span>
                </div>
                <div className="stat-card-miperfil stat-requests">
                  <span className="stat-value-miperfil">{formData.requestsCount}</span>
                  <span className="stat-label-miperfil">Solicitudes</span>
                </div>
                <div className="stat-card-miperfil stat-subscriptions">
                  <span className="stat-value-miperfil">{formData.subscriptionsCount}</span>
                  <span className="stat-label-miperfil">Inscripciones</span>
                </div>
              </div>
            </div>

          <div className="profile-details">
            <div className="info-section-miperfil">
              <h3 className="section-title-miperfil"><FaUser /> Información Personal</h3>
              {!isEditing ? (
                <div className="info-grid-miperfil view-mode">
                  <div className="info-item-miperfil">
                    <span className="info-label">Nombre Completo</span>
                    <span className="info-value" >{formData.nombre}</span>
                  </div>
                  <div className="info-item-miperfil">
                    <span className="info-label">Documento de Identidad</span>
                    <span className="info-value" >{formData.documentId}</span>
                  </div>
                  <div className="info-item-miperfil">
                    <span className="info-label">Fecha de Nacimiento</span>
                    <span className="info-value" >{formData.dob}</span>
                  </div>
                  <div className="info-item-miperfil">
                    <span className="info-label">Lugar de Nacimiento</span>
                    <span className="info-value" >{formData.pob}</span>
                  </div>
                  <div className="info-item-miperfil full-width">
                    <span className="info-label">Dirección</span>
                    <span className="info-value" >{formData.address}</span>
                  </div>
                </div>
              ) : (
                <div className="info-grid-miperfil edit-mode">
                  <div className="form-group-miperfil">
                    <label htmlFor="editNombre">Nombre Completo</label>
                    <input
                      type="text"
                      id="editNombre"
                      data-field="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-miperfil">
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
                  <div className="form-group-miperfil">
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
                  <div className="form-group-miperfil">
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
                  <div className="form-group-miperfil full-width-miperfil">
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
                  <div className="form-group-miperfil">
                    <label htmlFor="editCorreo">Correo</label>
                    <input
                      type="email"
                      id="editCorreo"
                      data-field="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-miperfil">
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

            <div className="info-section-miperfil">
              <h3 className="section-title-miperfil"><FaGraduationCap /> Información Académica</h3>
              {!isEditing ? (
                <div className="info-grid-miperfil view-mode">
                  <div className="info-item-miperfil">
                    <span className="info-label-miperfil">Nivel Actual</span>
                    <span className="info-value-miperfil" >{profileData.currentLevel}</span>
                  </div>
                  <div className="info-item-miperfil">
                    <span className="info-label-miperfil">Fecha de Ingreso</span>
                    <span className="info-value-miperfil" data-field="admissionDate">{formatDate(profileData.admissionDate)}</span>
                  </div>
                  <div className="info-item-miperfil">
                    <span className="info-label-miperfil">Director Espiritual</span>
                    <span className="info-value-miperfil" data-field="spiritualDirector">{profileData.spiritualDirector}</span>
                  </div>
                  <div className="info-item-miperfil">
                    <span className="info-label-miperfil">Idiomas</span>
                    <span className="info-value-miperfil" data-field="languages">{profileData.languages}</span>
                  </div>
                </div>
              ) : (
                <div className="info-grid-miperfil edit-mode">
                  <div className="form-group-miperfil">
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
                  <div className="form-group-miperfil">
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
                  <div className="form-group-miperfil">
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
                  <div className="form-group-miperfil">
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
              <div className="edit-actions-miperfil">
                <button id="saveChangesBtn" className="btn-miperfil btn-primary-miperfil" >
                  Guardar Cambios
                </button>
                <button id="cancelEditBtn" className="btn-miperfil btn-secondary-miperfil" onClick={handleCancelClick}>
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProfilePage;