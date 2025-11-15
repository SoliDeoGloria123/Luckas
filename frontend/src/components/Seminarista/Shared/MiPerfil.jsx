import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, BookOpen, GraduationCap, Award, Clock } from "lucide-react"
import './MiPerfil.css';
import Header from './Header';
import Footer from '../../footer/Footer';
import { userService } from '../../../services/userService';
import PropTypes from 'prop-types';
import Field from './Field';
import ToggleSwitch from './ToggleSwitch';
import PasswordField from './PasswordField';
import { datosEditadosShape, profileDataShape, passwordDataShape, securityDataShape } from './miPerfilPropTypes';

// Función auxiliar para obtener usuario desde localStorage
const obtenerUsuarioLogueado = () => {
  try {
    const usuarioStorage = localStorage.getItem('usuario');
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
    console.log('Usuario logueado:', usuario);
    return usuario;
  } catch (error) {
    console.error('Error al obtener usuario de localStorage:', error);
    return null;
  }
};

// Función auxiliar para crear estado inicial de datos editables
const crearEstadoInicialDatos = (usuario) => ({
  nombre: usuario?.nombre || "",
  apellido: usuario?.apellido || "",
  correo: usuario?.correo || "",
  telefono: usuario?.telefono || "",
  tipoDocumento: usuario?.tipoDocumento || "",
  numeroDocumento: usuario?.numeroDocumento || "",
  fechaNacimiento: usuario?.fechaNacimiento ? usuario.fechaNacimiento.split('T')[0] : "",
  direccion: usuario?.direccion || "",
  nivelAcademico: usuario?.nivelAcademico || "",
  fechaIngreso: usuario?.fechaIngreso ? usuario.fechaIngreso.split('T')[0] : "",
  directorEspiritual: usuario?.directorEspiritual || "",
  idiomas: usuario?.idiomas || "",
  especialidad: usuario?.especialidad || ""
});

// Función auxiliar para crear datos de perfil por defecto
const crearPerfilPorDefecto = (usuario) => ({
  nombre: usuario?.nombre || "Luis",
  apellido: usuario?.apellido || "Muguel", 
  tipoDocumento: usuario?.tipoDocumento || "Cédula de Ciudadanía",
  numeroDocumento: usuario?.numeroDocumento || "435412543534534",
  telefono: usuario?.telefono || "120524521546",
  correo: usuario?.correo || "luis@gmail.com",
  fechaNacimiento: usuario?.fechaNacimiento || "2005-05-05",
  direccion: usuario?.direccion || "Carrera 15 #32-45, Medellín",
  nivelActual: usuario?.nivelAcademico || "Filosofía II",
  fechaIngreso: usuario?.fechaIngreso || "2023-02-01",
  directorEspiritual: usuario?.directorEspiritual || "Padre Miguel",
  idiomas: usuario?.idiomas || "Español, Inglés",
  especialidad: usuario?.especialidad || "Teología Pastoral"
});

// Función auxiliar para validar datos de contraseña
const validarCambioContrasena = (passwordData) => {
  const { currentPassword, newPassword, confirmPassword } = passwordData;

  if (!currentPassword || !newPassword) {
    return { esValido: false, mensaje: "Todos los campos son obligatorios." };
  }

  if (newPassword !== confirmPassword) {
    return { esValido: false, mensaje: "Las contraseñas no coinciden." };
  }

  if (newPassword.length < 6) {
    return { esValido: false, mensaje: "La nueva contraseña debe tener al menos 6 caracteres." };
  }

  return { esValido: true };
};

// Componente para mostrar información personal (extraído para reducir complejidad)
const InformacionPersonal = ({ isEditing, datosEditados, handleInputChange }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex items-center space-x-2 mb-6">
      <User className="w-5 h-5 text-blue-600" />
      <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field id="nombre" label="Nombre" isEditing={isEditing} value={datosEditados.nombre} onChange={(v) => handleInputChange('nombre', v)} placeholder="Escribe tu nombre aquí" />

      <Field id="apellido" label="Apellido" isEditing={isEditing} value={datosEditados.apellido} onChange={(v) => handleInputChange('apellido', v)} />

      <Field
        id="tipoDocumento"
        label="Tipo de Documento"
        isEditing={isEditing}
        value={datosEditados.tipoDocumento}
        onChange={(v) => handleInputChange('tipoDocumento', v)}
        options={[
          'Cédula de Ciudadanía',
          'Cédula de Extranjería',
          'Pasaporte',
          'Tarjeta de identidad',
        ]}
      />

      <Field id="numeroDocumento" label="Número de Documento" isEditing={isEditing} value={datosEditados.numeroDocumento} onChange={(v) => handleInputChange('numeroDocumento', v)} />

      <Field id="telefono" label="Teléfono" isEditing={isEditing} value={datosEditados.telefono} onChange={(v) => handleInputChange('telefono', v)} type="tel" />

      <Field id="correo" label="Correo Electrónico" isEditing={isEditing} value={datosEditados.correo} onChange={(v) => handleInputChange('correo', v)} type="email" />

      <Field id="fechaNacimiento" label="Fecha de Nacimiento" isEditing={isEditing} value={datosEditados.fechaNacimiento} onChange={(v) => handleInputChange('fechaNacimiento', v)} type="date" />

      <Field id="direccion" label="Dirección" isEditing={isEditing} value={datosEditados.direccion} onChange={(v) => handleInputChange('direccion', v)} />
    </div>
  </div>
);

// Componente para mostrar información académica (extraído para reducir complejidad)
const InformacionAcademica = ({ isEditing, datosEditados, profileData, handleInputChange }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex items-center space-x-2 mb-6">
      <BookOpen className="w-5 h-5 text-green-600" />
      <h2 className="text-xl font-semibold text-gray-900">Información Académica</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field
        id="nivelActual"
        label="Nivel Actual"
        isEditing={isEditing}
        value={datosEditados.nivelAcademico}
        onChange={(v) => handleInputChange('nivelAcademico', v)}
        options={['Filosofía I','Filosofía II','Teología I','Teología II','Teología III','Teología IV']}
      />

      <div>
        <label htmlFor="fechaIngreso" className="block text-sm font-medium text-gray-700 mb-2">Fecha de Ingreso</label>
        <p className="text-gray-900 py-3">{new Date(profileData.fechaIngreso).toLocaleDateString()}</p>
      </div>

      <Field id="directorEspiritual" label="Director Espiritual" isEditing={isEditing} value={datosEditados.directorEspiritual} onChange={(v) => handleInputChange('directorEspiritual', v)} />

      <Field id="idiomas" label="Idiomas" isEditing={isEditing} value={datosEditados.idiomas} onChange={(v) => handleInputChange('idiomas', v)} />

      <div className="md:col-span-2">
        <Field id="especialidad" label="Especialidad" isEditing={isEditing} value={datosEditados.especialidad} onChange={(v) => handleInputChange('especialidad', v)} />
      </div>
    </div>
  </div>
);

// Componente para configuración de cuenta y seguridad
const ConfiguracionCuenta = ({
  passwordData,
  setPasswordData,
  showPassword,
  setShowPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  manejarCambioContrasena,
  securityData,
  setSecurityData,
}) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex items-center space-x-2 mb-6">
      <Award className="w-5 h-5 text-purple-600" />
      <h2 className="text-xl font-semibold text-gray-900">Configuración de Cuenta</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <PasswordField
          id="currentPassword"
          label="Contraseña Actual"
          value={passwordData.currentPassword}
          onChange={(v) => setPasswordData({ ...passwordData, currentPassword: v })}
          show={showPassword}
          toggleShow={setShowPassword}
        />
      </div>

      <div>
        <PasswordField
          id="newPassword"
          label="Nueva Contraseña"
          value={passwordData.newPassword}
          onChange={(v) => setPasswordData({ ...passwordData, newPassword: v })}
          show={showNewPassword}
          toggleShow={setShowNewPassword}
        />
      </div>

      <div className="md:col-span-2">
        <PasswordField
          id="confirmPassword"
          label="Confirmar Nueva Contraseña"
          value={passwordData.confirmPassword}
          onChange={(v) => setPasswordData({ ...passwordData, confirmPassword: v })}
          show={showConfirmPassword}
          toggleShow={setShowConfirmPassword}
        />
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-gray-200">
      <button
        onClick={manejarCambioContrasena}
        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
      >
        <Award className="w-5 h-5" />
        <span>Cambiar Contraseña</span>
      </button>
    </div>

    <div className="mt-6 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Preferencias</h3>
      <div className="space-y-4">
        <ToggleSwitch
          checked={securityData.emailNotifications}
          onToggle={(val) => setSecurityData({ ...securityData, emailNotifications: val })}
          label="Notificaciones por Email"
          Icon={Mail}
        />

        <ToggleSwitch
          checked={securityData.academicReminders}
          onToggle={(val) => setSecurityData({ ...securityData, academicReminders: val })}
          label="Recordatorios Académicos"
          Icon={Clock}
        />
      </div>
    </div>
  </div>
);

const ProfilePage = () => {
  // Estados principales
  const [isEditing, setIsEditing] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const usuarioLogueado = obtenerUsuarioLogueado();
  const [datosEditados, setDatosEditados] = useState(() => crearEstadoInicialDatos(usuarioLogueado));
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileData, setProfileData] = useState(() => crearPerfilPorDefecto(usuarioLogueado));
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (usuarioLogueado && !isEditing) {
      setDatosEditados(crearEstadoInicialDatos(usuarioLogueado));
      setProfileData(crearPerfilPorDefecto(usuarioLogueado));
    }
  }, [usuarioLogueado, isEditing]);

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
    // ...existing code...
    setDatosEditados((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancelEdit = () => {
    // Resetear los datos editados a los valores originales
    setDatosEditados(crearEstadoInicialDatos(usuarioLogueado));
    // Resetear campos de contraseña
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
    setIsEditing(false);
  };

  const manejarCambioContrasena = async () => {
    const validacion = validarCambioContrasena(passwordData);

    if (!validacion.esValido) {
      alert(validacion.mensaje);
      return;
    }

    try {
      await userService.changePassword(passwordData);
      alert('Contraseña cambiada correctamente');
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
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

  // Formatea la fecha para mostrarla en formato legible
  // Eliminado: función comentada y no usada


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
                {seminaristaStats.map((stat) => (
                  <div key={stat.label} className="flex items-center space-x-3">
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
            <InformacionPersonal
              isEditing={isEditing}
              datosEditados={datosEditados}
              handleInputChange={handleInputChange}
            />

            {/* Academic Information */}
            <InformacionAcademica
              isEditing={isEditing}
              datosEditados={datosEditados}
              profileData={profileData}
              handleInputChange={handleInputChange}
            />

            {/* Security Settings */}
            {isEditing && (
              <ConfiguracionCuenta
                passwordData={passwordData}
                setPasswordData={setPasswordData}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                showNewPassword={showNewPassword}
                setShowNewPassword={setShowNewPassword}
                showConfirmPassword={showConfirmPassword}
                setShowConfirmPassword={setShowConfirmPassword}
                manejarCambioContrasena={manejarCambioContrasena}
                securityData={securityData}
                setSecurityData={setSecurityData}
              />
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

InformacionPersonal.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  datosEditados: datosEditadosShape.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

InformacionAcademica.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  datosEditados: datosEditadosShape.isRequired,
  profileData: profileDataShape.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

ConfiguracionCuenta.propTypes = {
  passwordData: passwordDataShape.isRequired,
  setPasswordData: PropTypes.func.isRequired,
  showPassword: PropTypes.bool.isRequired,
  setShowPassword: PropTypes.func.isRequired,
  showNewPassword: PropTypes.bool.isRequired,
  setShowNewPassword: PropTypes.func.isRequired,
  showConfirmPassword: PropTypes.bool.isRequired,
  setShowConfirmPassword: PropTypes.func.isRequired,
  manejarCambioContrasena: PropTypes.func.isRequired,
  securityData: securityDataShape.isRequired,
  setSecurityData: PropTypes.func.isRequired,
};

export default ProfilePage;