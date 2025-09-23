import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, BookOpen, GraduationCap, Award, Clock, Eye, EyeOff } from "lucide-react"
import './MiPerfil.css';
import Header from './Header';
import Footer from '../../footer/Footer';
import { userService } from '../../../services/userService';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
        nombre: "Luis",
    apellido: "Muguel",
    tipoDocumento: "Cédula de Ciudadanía",
    numeroDocumento: "435412543534534",
    telefono: "120524521546",
    correo: "luis@gmail.com",
    fechaNacimiento: "2005-05-05",
    direccion: "Carrera 15 #32-45, Medellín",
    nivelActual: "Filosofía II",
    fechaIngreso: "2023-02-01",
    directorEspiritual: "Padre Miguel",
    idiomas: "Español, Inglés",
    especialidad: "Teología Pastoral",
  });
  const [formData, setFormData] = useState({});
  
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)



  const usuarioLogueado = (() => {
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      return usuarioStorage ? JSON.parse(usuarioStorage) : null;
    } catch {
      return null;
    }
  })();

  const handleSaveChanges = async () => {
  try {
    const userId = localStorage.getItem("userId");
    await userService.updateUser(userId, formData);
    alert("Perfil actualizado correctamente");
    setProfileData(formData);
    setIsEditing(false);
  } catch (error) {
    alert("Error al actualizar el perfil: " + error.message);
  }
};


  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    academicReminders: true,
    theme: "Claro",
    language: "Español",
  })

  const handleSave = () => {
    setShowSuccess(true)
    setIsEditing(false)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const seminaristaStats = [
    { label: "Eventos Participados", value: "24", color: "bg-blue-500" },
    { label: "Reservas Activas", value: "3", color: "bg-green-500" },
    { label: "Solicitudes", value: "8", color: "bg-purple-500" },
    { label: "Inscripciones", value: "12", color: "bg-orange-500" },
  ]

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
       <div className="min-h-screen bg-gray-50">
      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in">
          ✓ Perfil actualizado exitosamente
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                  LM
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {usuarioLogueado.nombre} {usuarioLogueado.apellido}
                </h1>
                <p className="text-green-100 text-lg">Seminarista del Sistema</p>
                <div className="flex items-center space-x-4 mt-2 text-green-100">
                  <span className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{usuarioLogueado.telefono}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Desde {new Date(usuarioLogueado.fechaIngreso).toLocaleDateString()}</span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <User className="w-5 h-5" />
              <span>{isEditing ? "Cancelar" : "Editar Perfil"}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with Stats */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                {seminaristaStats.map((stat, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acceso Rápido</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Mis Eventos
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Reservas de Cabañas
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Mis Inscripciones
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                  Solicitudes
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.nombre}
                      onChange={(e) => setProfileData({ ...profileData, nombre: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{usuarioLogueado.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.apellido}
                      onChange={(e) => setProfileData({ ...profileData, apellido: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{usuarioLogueado.apellido}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  {isEditing ? (
                    <select
                      value={profileData.tipoDocumento}
                      onChange={(e) => setProfileData({ ...profileData, tipoDocumento: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Cédula de Ciudadanía</option>
                      <option>Cédula de Extranjería</option>
                      <option>Pasaporte</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-3">{usuarioLogueado.tipoDocumento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.numeroDocumento}
                      onChange={(e) => setProfileData({ ...profileData, numeroDocumento: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{usuarioLogueado.numeroDocumento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.telefono}
                      onChange={(e) => setProfileData({ ...profileData, telefono: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{usuarioLogueado.telefono}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.correo}
                      onChange={(e) => setProfileData({ ...profileData, correo: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{usuarioLogueado.correo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={profileData.fechaNacimiento}
                      onChange={(e) => setProfileData({ ...profileData, fechaNacimiento: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{new Date(usuarioLogueado.fechaNacimiento).toLocaleDateString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.direccion}
                      onChange={(e) => setProfileData({ ...profileData, direccion: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{profileData.direccion}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Academic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-2 mb-6">
                <BookOpen className="w-5 h-5 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Información Académica</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel Actual</label>
                  {isEditing ? (
                    <select
                      value={profileData.nivelActual}
                      onChange={(e) => setProfileData({ ...profileData, nivelActual: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option>Filosofía I</option>
                      <option>Filosofía II</option>
                      <option>Teología I</option>
                      <option>Teología II</option>
                      <option>Teología III</option>
                      <option>Teología IV</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-3">{profileData.nivelActual}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso</label>
                  <p className="text-gray-900 py-3">{new Date(profileData.fechaIngreso).toLocaleDateString()}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Director Espiritual</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.directorEspiritual}
                      onChange={(e) => setProfileData({ ...profileData, directorEspiritual: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{profileData.directorEspiritual}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idiomas</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.idiomas}
                      onChange={(e) => setProfileData({ ...profileData, idiomas: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{profileData.idiomas}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.especialidad}
                      onChange={(e) => setProfileData({ ...profileData, especialidad: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{profileData.especialidad}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Security Settings */}
            {isEditing && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Award className="w-5 h-5 text-purple-600" />
                  <h2 className="text-xl font-semibold text-gray-900">Configuración de Cuenta</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña Actual</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nueva Contraseña</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={securityData.confirmPassword}
                        onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">Notificaciones por Email</span>
                      </div>
                      <button
                        onClick={() =>
                          setSecurityData({ ...securityData, emailNotifications: !securityData.emailNotifications })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securityData.emailNotifications ? "bg-green-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            securityData.emailNotifications ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-700">Recordatorios Académicos</span>
                      </div>
                      <button
                        onClick={() =>
                          setSecurityData({ ...securityData, academicReminders: !securityData.academicReminders })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          securityData.academicReminders ? "bg-green-600" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            securityData.academicReminders ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
      <Footer />
    </>
  );
};

export default ProfilePage;