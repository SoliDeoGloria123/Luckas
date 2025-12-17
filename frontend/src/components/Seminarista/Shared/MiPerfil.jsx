import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, Calendar,  GraduationCap, Award, Clock } from "lucide-react"
import './MiPerfil.css';
import Header from './Header';
import Footer from '../../footer/Footer';
import { userService } from '../../../services/userService';
import PropTypes from 'prop-types';
import Field from './Field';
import ToggleSwitch from './ToggleSwitch';
import PasswordField from './PasswordField';
import { datosEditadosShape,  passwordDataShape, securityDataShape } from './miPerfilPropTypes';
import { mostrarAlerta } from '../../utils/alertas';

// Función auxiliar para obtener usuario desde localStorage
const obtenerUsuarioLogueado = () => {
  try {
    const usuarioStorage = localStorage.getItem('usuario');
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
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
const InformacionPersonal = ({ isEditing, datosEditados, handleInputChange, errors }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex items-center space-x-2 mb-6">
      <User className="w-5 h-5 text-blue-600" />
      <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Field id="nombre" label="Nombre" isEditing={isEditing} value={datosEditados.nombre} onChange={(v) => handleInputChange('nombre', v)} placeholder="Escribe tu nombre aquí" error={errors?.nombre} />

      <Field id="apellido" label="Apellido" isEditing={isEditing} value={datosEditados.apellido} onChange={(v) => handleInputChange('apellido', v)} error={errors?.apellido} />

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
      {/** pasar error inline al Field */}
      <Field id="tipoDocumento" label="Tipo de Documento" isEditing={isEditing} value={datosEditados.tipoDocumento} onChange={(v) => handleInputChange('tipoDocumento', v)} options={[
          'Cédula de Ciudadanía',
          'Cédula de Extranjería',
          'Pasaporte',
          'Tarjeta de identidad',
        ]} error={errors?.tipoDocumento} />

      <Field id="numeroDocumento" label="Número de Documento" isEditing={isEditing} value={datosEditados.numeroDocumento} onChange={(v) => handleInputChange('numeroDocumento', v)} error={errors?.numeroDocumento} />

      <Field id="telefono" label="Teléfono" isEditing={isEditing} value={datosEditados.telefono} onChange={(v) => handleInputChange('telefono', v)} type="tel" error={errors?.telefono} />

      <Field id="correo" label="Correo Electrónico" isEditing={isEditing} value={datosEditados.correo} onChange={(v) => handleInputChange('correo', v)} type="email" error={errors?.correo} />

      <Field id="fechaNacimiento" label="Fecha de Nacimiento" isEditing={isEditing} value={datosEditados.fechaNacimiento} onChange={(v) => handleInputChange('fechaNacimiento', v)} type="date" error={errors?.fechaNacimiento} />
      

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
  passwordErrors,
  isPasswordValid,
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
          error={passwordErrors.currentPassword}
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
          error={passwordErrors.newPassword}
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
          error={passwordErrors.confirmPassword}
        />
      </div>
    </div>

    <div className="mt-6 pt-6 border-t border-gray-200">
      <button
        onClick={manejarCambioContrasena}
        disabled={!isPasswordValid}
        className={`bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2 ${isPasswordValid ? '' : 'opacity-60 cursor-not-allowed'}`}
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
  // Por defecto abrir en modo vista (no en edición)
  const [isEditing, setIsEditing] = useState(false);
  const usuarioLogueado = obtenerUsuarioLogueado();
  const getInitials = (user) => {
    if (!user) return '';
    const full = `${user.nombre || ''} ${user.apellido || ''}`.trim();
    if (!full) return '';
    const parts = full.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  const initials = getInitials(usuarioLogueado);
  const [datosEditados, setDatosEditados] = useState(() => crearEstadoInicialDatos(usuarioLogueado));
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  // perfil mostrado / auxiliar (se usa más abajo para actualizar valores tras guardar)
  const profileRef = useRef(crearPerfilPorDefecto(usuarioLogueado));
  const setProfileData = (updater) => {
    if (typeof updater === 'function') {
      profileRef.current = updater(profileRef.current);
    } else {
      profileRef.current = updater;
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (usuarioLogueado && !isEditing) {
      setDatosEditados(crearEstadoInicialDatos(usuarioLogueado));
      setProfileData(crearPerfilPorDefecto(usuarioLogueado));
    }
  }, [usuarioLogueado, isEditing]);

  // Estado para validaciones en tiempo real
  const [errors, setErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  // helpers para validación
  const isEmpty = (v) => !v || String(v).trim() === '';
  const validateEmail = (v) => {
    // Regex seguro contra ReDoS: limita longitud para evitar backtracking catastrófico
    const re = /^[^\s@]{1,64}@[^\s@]{1,255}$/i;
    return re.test(String(v).toLowerCase());
  };
  const validateDate = (v) => {
    if (!v) return false;
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return false;
    const today = new Date();
    if (d > today) return false;
    return true;
  };
  const validatePhone = (v) => {
    return !v || /^\+?[0-9\s-]{6,20}$/.test(String(v));
  };
  // Estado para validación de contraseña en tiempo real
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateField = (field, value) => {
    const requiredFields = ['nombre', 'apellido', 'tipoDocumento', 'numeroDocumento'];
    if (requiredFields.includes(field)) {
      return isEmpty(value) ? 'Este campo es obligatorio.' : '';
    }

    const fieldValidators = {
      direccion: (v) => {
        if (isEmpty(v)) return 'La dirección es obligatoria.';
        if (String(v).trim().length < 5) return 'La dirección es demasiado corta.';
        return '';
      },
      correo: (v) => {
        if (isEmpty(v)) return 'El correo es obligatorio.';
        if (!validateEmail(v)) return 'Formato de correo inválido.';
        return '';
      },
      fechaNacimiento: (v) => {
        if (!v) return 'La fecha de nacimiento es obligatoria.';
        if (!validateDate(v)) return 'Fecha inválida o futura.';
        return '';
      },
      telefono: (v) => {
        if (!validatePhone(v)) return 'Teléfono inválido.';
        return '';
      },
    };

    if (field in fieldValidators) return fieldValidators[field](value);
    return '';
  };

  // Validaciones para contraseña en tiempo real
  const validatePasswordField = (field, value, { currentPassword, newPassword, confirmPassword }) => {
    if (field === 'currentPassword') {
      if ((newPassword || confirmPassword) && (!value || String(value).trim() === '')) return 'Contraseña actual requerida.';
    }
    if (field === 'newPassword') {
      if (!value || String(value).trim() === '') return 'La nueva contraseña es obligatoria.';
      if (String(value).length < 6) return 'La nueva contraseña debe tener al menos 6 caracteres.';
    }
    if (field === 'confirmPassword') {
      if (!value || String(value).trim() === '') return 'Confirma la nueva contraseña.';
      if (newPassword && value !== newPassword) return 'Las contraseñas no coinciden.';
    }
    return '';
  };

  // Comprobar y validar el formulario cuando cambian los datos editados
  useEffect(() => {
    const required = ['nombre', 'apellido', 'tipoDocumento', 'numeroDocumento', 'correo', 'direccion', 'fechaNacimiento'];
    const newErrors = {};
    for (const f of required) {
      const msg = validateField(f, datosEditados[f]);
      if (msg) newErrors[f] = msg;
    }
    if (datosEditados.telefono) {
      const telMsg = validateField('telefono', datosEditados.telefono);
      if (telMsg) newErrors.telefono = telMsg;
    }
    setErrors(newErrors);
    setIsFormValid(Object.keys(newErrors).length === 0);
  }, [datosEditados]);

  // Efecto para validar contraseña en tiempo real cuando cambian los inputs
  useEffect(() => {
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    const newPwdErrors = {};
    const fields = ['currentPassword', 'newPassword', 'confirmPassword'];
    for (const f of fields) {
      const val = passwordData[f];
      const msg = validatePasswordField(f, val, { currentPassword, newPassword, confirmPassword });
      if (msg) newPwdErrors[f] = msg;
    }
    setPasswordErrors(newPwdErrors);
    // password valid only if all three present and no errors
    const allPresent = currentPassword && newPassword && confirmPassword;
    setIsPasswordValid(allPresent && Object.keys(newPwdErrors).length === 0);
  }, [passwordData]);

  // Función para guardar cambios del perfil
  const actualizarPerfil = async () => {
    try {
      await userService.updateOwnProfile(datosEditados);
      // Actualizar localStorage con los nuevos datos
      const usuarioActualizado = { ...usuarioLogueado, ...datosEditados };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      // Actualizar los datos mostrados
      setProfileData(prev => ({ ...prev, ...datosEditados }));
  
      mostrarAlerta('Exito', 'Perfil actualizado correctamente');
    } catch (error) {
      console.error('Error al actualizar el perfil:', error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!isFormValid) {
      mostrarAlerta('Error', 'Corrige los errores del formulario antes de guardar.', 'error');
      return;
    }
    try {
      await actualizarPerfil();
      setIsEditing(false);
    
    } catch (error) {
      console.error('Error al guardar el perfil:', error);
      mostrarAlerta('Error', 'Error al guardar los cambios', 'error');
    }
  };

  const handleInputChange = (field, value) => {
    setDatosEditados((prev) => ({ ...prev, [field]: value }));
    const msg = validateField(field, value);
    setErrors(prev => {
      const next = { ...prev };
      if (msg) next[field] = msg; else delete next[field];
      return next;
    });
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
      mostrarAlerta('Error', validacion.mensaje, 'error');
      return;
    }

    try {
      await userService.changePassword(passwordData);
      mostrarAlerta('Exito', 'Contraseña cambiada correctamente');
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch  {
      mostrarAlerta('Error', 'Error al cambiar la contraseña: ','error');
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
  

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-3xl font-bold">
                  {initials || (usuarioLogueado && ((usuarioLogueado.nombre || '').charAt(0) + (usuarioLogueado.apellido || '').charAt(0)).toUpperCase()) || 'LM'}
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
              errors={errors}
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
                passwordErrors={passwordErrors}
                isPasswordValid={isPasswordValid}
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
                  disabled={!isFormValid}
                  className={`px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors ${isFormValid ? '' : 'opacity-60 cursor-not-allowed'}`}
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
  errors: PropTypes.object,
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
  passwordErrors: PropTypes.object,
  isPasswordValid: PropTypes.bool,
};

export default ProfilePage;