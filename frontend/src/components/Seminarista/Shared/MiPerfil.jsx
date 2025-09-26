import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, BookOpen, GraduationCap, Award, Clock, Eye, EyeOff } from "lucide-react"
import './MiPerfil.css';
import Header from './Header';
import Footer from '../../footer/Footer';
import { userService } from '../../../services/userService';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Obtener usuario logueado desde localStorage
  const usuarioLogueado = (() => {
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
      console.log('Usuario logueado:', usuario);
      return usuario;
    } catch (error) {
      console.error('Error al obtener usuario de localStorage:', error);
      return null;
    }
  })();

  // Estado para los datos editables
  const [datosEditados, setDatosEditados] = useState({
    nombre: usuarioLogueado?.nombre || "",
    apellido: usuarioLogueado?.apellido || "",
    correo: usuarioLogueado?.correo || "",
    telefono: usuarioLogueado?.telefono || "",
    tipoDocumento: usuarioLogueado?.tipoDocumento || "",
    numeroDocumento: usuarioLogueado?.numeroDocumento || "",
    fechaNacimiento: usuarioLogueado?.fechaNacimiento ? usuarioLogueado.fechaNacimiento.split('T')[0] : "",
    direccion: usuarioLogueado?.direccion || "",
    // Campos específicos del seminarista
    nivelAcademico: usuarioLogueado?.nivelAcademico || "",
    fechaIngreso: usuarioLogueado?.fechaIngreso ? usuarioLogueado.fechaIngreso.split('T')[0] : "",
    directorEspiritual: usuarioLogueado?.directorEspiritual || "",
    idiomas: usuarioLogueado?.idiomas || "",
    especialidad: usuarioLogueado?.especialidad || ""
  });

  console.log('Estado isEditing:', isEditing);
  console.log('Datos editados:', datosEditados);

  // Estado para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Datos estáticos del perfil (solo lectura)
  const [profileData, setProfileData] = useState({
    nombre: usuarioLogueado?.nombre || "Luis",
    apellido: usuarioLogueado?.apellido || "Muguel", 
    tipoDocumento: usuarioLogueado?.tipoDocumento || "Cédula de Ciudadanía",
    numeroDocumento: usuarioLogueado?.numeroDocumento || "435412543534534",
    telefono: usuarioLogueado?.telefono || "120524521546",
    correo: usuarioLogueado?.correo || "luis@gmail.com",
    fechaNacimiento: usuarioLogueado?.fechaNacimiento || "2005-05-05",
    direccion: usuarioLogueado?.direccion || "Carrera 15 #32-45, Medellín",
    nivelActual: usuarioLogueado?.nivelAcademico || "Filosofía II",
    fechaIngreso: usuarioLogueado?.fechaIngreso || "2023-02-01",
    directorEspiritual: usuarioLogueado?.directorEspiritual || "Padre Miguel",
    idiomas: usuarioLogueado?.idiomas || "Español, Inglés",
    especialidad: usuarioLogueado?.especialidad || "Teología Pastoral"
  });

  const [formData, setFormData] = useState({});
  
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Función para guardar cambios del perfil
  const actualizarPerfil = async () => {
    try {
      const response = await userService.updateOwnProfile(datosEditados);
      console.log('Perfil actualizado:', response);
      
      // Actualizar localStorage con los nuevos datos
      const usuarioActualizado = { ...usuarioLogueado, ...datosEditados };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // Actualizar los datos mostrados
      setProfileData(prev => ({ ...prev, ...datosEditados }));
      
      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      await actualizarPerfil();
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      alert('Error al guardar los cambios');
    }
  };

  const handleInputChange = (field, value) => {
    console.log('handleInputChange llamado:', field, value);
    setDatosEditados((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    // Resetear los datos editados a los valores originales
    setDatosEditados({
      nombre: usuarioLogueado?.nombre || "",
      apellido: usuarioLogueado?.apellido || "",
      correo: usuarioLogueado?.correo || "",
      telefono: usuarioLogueado?.telefono || "",
      tipoDocumento: usuarioLogueado?.tipoDocumento || "",
      numeroDocumento: usuarioLogueado?.numeroDocumento || "",
      fechaNacimiento: usuarioLogueado?.fechaNacimiento ? usuarioLogueado.fechaNacimiento.split('T')[0] : "",
      direccion: usuarioLogueado?.direccion || "",
      nivelAcademico: usuarioLogueado?.nivelAcademico || "",
      fechaIngreso: usuarioLogueado?.fechaIngreso ? usuarioLogueado.fechaIngreso.split('T')[0] : "",
      directorEspiritual: usuarioLogueado?.directorEspiritual || "",
      idiomas: usuarioLogueado?.idiomas || "",
      especialidad: usuarioLogueado?.especialidad || ""
    });
    // Resetear campos de contraseña
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsEditing(false);
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const cambiarContrasena = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword) {
        alert('Por favor, completa todos los campos de contraseña');
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert('Las contraseñas nuevas no coinciden');
        return;
      }

      if (passwordData.newPassword.length < 6) {
        alert('La nueva contraseña debe tener al menos 6 caracteres');
        return;
      }

      const response = await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      alert('Contraseña cambiada correctamente');
      
      // Resetear campos de contraseña
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      alert('Error al cambiar la contraseña: ' + (error.response?.data?.message || error.message));
    }
  };

  // Configuraciones de seguridad
  const [securityData, setSecurityData] = useState({
    emailNotifications: true,
    academicReminders: true,
    theme: "Claro",
    language: "Español",
  });

  // Estadísticas del seminarista
  const seminaristaStats = [
    { label: "Eventos Participados", value: "24", color: "bg-blue-500" },
    { label: "Reservas Activas", value: "3", color: "bg-green-500" },
    { label: "Solicitudes", value: "8", color: "bg-purple-500" },
    { label: "Inscripciones", value: "12", color: "bg-orange-500" },
  ];

  // useEffect para cargar datos del usuario al iniciar
  useEffect(() => {
    // Si hay datos en localStorage, actualizar los estados
    if (usuarioLogueado) {
      console.log("Datos del usuario logueado:", usuarioLogueado);
      
      // Actualizar datos editables
      setDatosEditados({
        nombre: usuarioLogueado.nombre || "",
        apellido: usuarioLogueado.apellido || "",
        correo: usuarioLogueado.correo || "",
        telefono: usuarioLogueado.telefono || "",
        tipoDocumento: usuarioLogueado.tipoDocumento || "",
        numeroDocumento: usuarioLogueado.numeroDocumento || "",
        fechaNacimiento: usuarioLogueado.fechaNacimiento || "",
        direccion: usuarioLogueado.direccion || "",
        nivelAcademico: usuarioLogueado.nivelAcademico || "",
        fechaIngreso: usuarioLogueado.fechaIngreso || "",
        directorEspiritual: usuarioLogueado.directorEspiritual || "",
        idiomas: usuarioLogueado.idiomas || "",
        especialidad: usuarioLogueado.especialidad || ""
      });

      // Actualizar datos de visualización
      setProfileData({
        nombre: usuarioLogueado.nombre || "Luis",
        apellido: usuarioLogueado.apellido || "Muguel", 
        tipoDocumento: usuarioLogueado.tipoDocumento || "Cédula de Ciudadanía",
        numeroDocumento: usuarioLogueado.numeroDocumento || "435412543534534",
        telefono: usuarioLogueado.telefono || "120524521546",
        correo: usuarioLogueado.correo || "luis@gmail.com",
        fechaNacimiento: usuarioLogueado.fechaNacimiento || "2005-05-05",
        direccion: usuarioLogueado.direccion || "Carrera 15 #32-45, Medellín",
        nivelActual: usuarioLogueado.nivelAcademico || "Filosofía II",
        fechaIngreso: usuarioLogueado.fechaIngreso || "2023-02-01",
        directorEspiritual: usuarioLogueado.directorEspiritual || "Padre Miguel",
        idiomas: usuarioLogueado.idiomas || "Español, Inglés",
        especialidad: usuarioLogueado.especialidad || "Teología Pastoral"
      });
    }
  }, [usuarioLogueado]);

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
              onClick={() => {
                console.log('Botón editar clickeado, isEditing actual:', isEditing);
                setIsEditing(!isEditing);
              }}
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
                      value={datosEditados.nombre}
                      onChange={(e) => {
                        console.log('Cambiando nombre a:', e.target.value);
                        handleInputChange('nombre', e.target.value);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Escribe tu nombre aquí"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.nombre}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Apellido</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={datosEditados.apellido}
                      onChange={(e) => handleInputChange('apellido', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.apellido}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Documento</label>
                  {isEditing ? (
                    <select
                      value={datosEditados.tipoDocumento}
                      onChange={(e) => handleInputChange('tipoDocumento', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
                      <option value="Cédula de Extranjería">Cédula de Extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                      <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                    </select>
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.tipoDocumento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Documento</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={datosEditados.numeroDocumento}
                      onChange={(e) => handleInputChange('numeroDocumento', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.numeroDocumento}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={datosEditados.telefono}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.telefono}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Correo Electrónico</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={datosEditados.correo}
                      onChange={(e) => handleInputChange('correo', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.correo}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={datosEditados.fechaNacimiento}
                      onChange={(e) => handleInputChange('fechaNacimiento', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.fechaNacimiento ? new Date(datosEditados.fechaNacimiento).toLocaleDateString() : ''}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={datosEditados.direccion}
                      onChange={(e) => handleInputChange('direccion', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.direccion}</p>
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
                      value={datosEditados.nivelAcademico}
                      onChange={(e) => handleInputChange('nivelAcademico', e.target.value)}
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
                    <p className="text-gray-900 py-3">{datosEditados.nivelAcademico}</p>
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
                      value={datosEditados.directorEspiritual}
                      onChange={(e) => handleInputChange('directorEspiritual', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.directorEspiritual}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Idiomas</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={datosEditados.idiomas}
                      onChange={(e) => handleInputChange('idiomas', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.idiomas}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Especialidad</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={datosEditados.especialidad}
                      onChange={(e) => handleInputChange('especialidad', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="text-gray-900 py-3">{datosEditados.especialidad}</p>
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
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
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
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
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
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
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
                  <button
                    onClick={cambiarContrasena}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <Award className="w-5 h-5" />
                    <span>Cambiar Contraseña</span>
                  </button>
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
                  onClick={handleCancelEdit}
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