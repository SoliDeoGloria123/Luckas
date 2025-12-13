import React from "react";
import PropTypes from "prop-types";

// Constantes para mensajes de validación
const VALIDATION_MESSAGES = {
  CREDENTIAL_MIN_LENGTH: 'Debe tener al menos 8 caracteres.',
  CREDENTIAL_UPPERCASE: 'Debe contener al menos una mayúscula.',
  CREDENTIAL_LOWERCASE: 'Debe contener al menos una minúscula.',
  CREDENTIAL_NUMBER: 'Debe contener al menos un número.',
};

const UsuarioModal = ({
  mostrar,
  modoEdicion,
  usuarioSeleccionado,
  setUsuarioSeleccionado,
  nuevoUsuario,
  setNuevoUsuario,
  onClose,
  onSubmit
}) => {
  const [mostrarPassword, setMostrarPassword] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  // Funciones auxiliares para reducir complejidad
  const getFieldValue = (field) => {
    return modoEdicion ? usuarioSeleccionado?.[field] || '' : nuevoUsuario[field] || '';
  };

  const handleFieldChange = (field, value) => {
    if (modoEdicion) {
      setUsuarioSeleccionado({ ...usuarioSeleccionado, [field]: value });
    } else {
      setNuevoUsuario({ ...nuevoUsuario, [field]: value });
    }
  };

  const getFechaNacimientoValue = () => {
    if (modoEdicion && usuarioSeleccionado?.fechaNacimiento) {
      return new Date(usuarioSeleccionado.fechaNacimiento).toISOString().split('T')[0];
    }
    return nuevoUsuario.fechaNacimiento || '';
  };

  // Datos actuales (dependen si estamos editando o creando)
  const currentData = modoEdicion ? (usuarioSeleccionado || {}) : (nuevoUsuario || {});
  // Función para calcular fuerza de credencial
  const getPasswordStrength = (password) => {
    if (!password) return { score: 0, text: '', color: 'transparent' };
    // Limitar longitud para evitar ReDoS
    if (password.length > 128) return { score: 5, text: 'Muy fuerte', color: '#44cc44' };

    let score = 0;
    const checks = {
      length: password.length >= 8,
      uppercase: password.split('').some(c => c >= 'A' && c <= 'Z'),
      lowercase: password.split('').some(c => c >= 'a' && c <= 'z'),
      number: password.split('').some(c => c >= '0' && c <= '9'),
      special: password.split('').some(c => '!@#$%^&*(),.?":{}|<>'.includes(c))
    };

    for (const check of Object.values(checks)) {
      if (check) score++;
    }

    if (score <= 1) return { score, text: 'Muy débil', color: '#ff4444' };
    if (score === 2) return { score, text: 'Débil', color: '#ff8800' };
    if (score === 3) return { score, text: 'Regular', color: '#ffaa00' };
    if (score === 4) return { score, text: 'Fuerte', color: '#88cc00' };
    return { score, text: 'Muy fuerte', color: '#44cc44' };
  };

  // Valor de la credencial actual (para mostrar fuerza)
  const passwordFieldValue = modoEdicion ? (usuarioSeleccionado?.password || '') : (nuevoUsuario.password || '');
  const strength = getPasswordStrength(passwordFieldValue);

  // Validación en tiempo real
  const validateAll = (data) => {
    const newErrors = {};
    if (!data.nombre || String(data.nombre).trim() === '') newErrors.nombre = 'Nombre es obligatorio.';
    if (!data.apellido || String(data.apellido).trim() === '') newErrors.apellido = 'Apellido es obligatorio.';
    const correo = String(data.correo || '').trim();
    // Regex segura contra ReDoS - limita longitud y evita backtracking
    const emailRe = /^[a-zA-Z0-9._-]{1,64}@[a-zA-Z0-9.-]{1,255}\.[a-zA-Z]{2,}$/;
    if (correo.length > 320 || !emailRe.test(correo)) newErrors.correo = 'Ingrese un correo válido.';
    const tel = String(data.telefono || '').replaceAll(/\D/g, '');
    if (!tel || tel.length < 7) newErrors.telefono = 'Ingrese un teléfono válido (al menos 7 dígitos).';
    if (!data.tipoDocumento || String(data.tipoDocumento).trim() === '') newErrors.tipoDocumento = 'Seleccione un tipo de documento.';
    if (!data.numeroDocumento || String(data.numeroDocumento).trim() === '') newErrors.numeroDocumento = 'Número de documento es obligatorio.';
    if (!data.fechaNacimiento || String(data.fechaNacimiento).trim() === '') newErrors.fechaNacimiento = 'Seleccione una fecha de nacimiento.';
    if (!modoEdicion) {
      // creación: validar credencial con requisitos más estrictos
      const passwordField = String(data.password || '');
      if (passwordField.length < 8) {
        newErrors.password = VALIDATION_MESSAGES.CREDENTIAL_MIN_LENGTH;
      } else if (!passwordField.split('').some(c => c >= 'A' && c <= 'Z')) {
        newErrors.password = VALIDATION_MESSAGES.CREDENTIAL_UPPERCASE;
      } else if (!passwordField.split('').some(c => c >= 'a' && c <= 'z')) {
        newErrors.password = VALIDATION_MESSAGES.CREDENTIAL_LOWERCASE;
      } else if (!passwordField.split('').some(c => c >= '0' && c <= '9')) {
        newErrors.password = VALIDATION_MESSAGES.CREDENTIAL_NUMBER;
      }
    }
    setErrors(newErrors);
    return newErrors;
  };

  React.useEffect(() => {
    validateAll(currentData);
  }, [currentData, modoEdicion]);

  // Efecto para manejar el scroll del body cuando el modal está abierto
  React.useEffect(() => {
    if (mostrar) {
      // Desactivar scroll del body
      document.body.style.overflow = 'hidden';
      return () => {
        // Reactivar scroll del body al cerrar el modal
        document.body.style.overflow = 'auto';
      };
    }
  }, [mostrar]);

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{zIndex: 1100}}>
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div
          className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
          style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}
        >
          <h2>{modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}</h2>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin" onSubmit={e => {
          e.preventDefault();
          const errs = validateAll(currentData);
          if (Object.keys(errs).length) return;
          onSubmit(e);
        }}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="nombre"><i className="fas fa-user"></i>Nombre</label>
              <input
                id="nombre"
                type="text"
                value={getFieldValue('nombre')}
                onChange={e => handleFieldChange('nombre', e.target.value)}
                placeholder="Nombre"
                required
              />
              {errors.nombre && <p className="text-sm text-red-600 mt-1">{errors.nombre}</p>}
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="apellido"><i className="fas fa-user"></i> Apellido</label>
              <input
                id="apellido"
                type="text"
                value={getFieldValue('apellido')}
                onChange={e => handleFieldChange('apellido', e.target.value)}
                placeholder="Apellido"
                required
              />
              {errors.apellido && <p className="text-sm text-red-600 mt-1">{errors.apellido}</p>}

            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="correo">  <i className="fas fa-envelope"></i> Correo</label>
              <input
                id="correo"
                type="email"
                value={getFieldValue('correo')}
                onChange={e => handleFieldChange('correo', e.target.value)}
                placeholder="correo@ejemplo.com"
                required
              />
              {errors.correo && <p className="text-sm text-red-600 mt-1">{errors.correo}</p>}
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="telefono"><i className="fas fa-phone"></i> Teléfono</label>
              <input
                id="telefono"
                type="number"
                value={getFieldValue('telefono')}
                onChange={e => handleFieldChange('telefono', e.target.value)}
                placeholder="Teléfono"
                required
              />
              {errors.telefono && <p className="text-sm text-red-600 mt-1">{errors.telefono}</p>}
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="tipoDocumento"><i className="fas fa-id-card"></i> Tipo de Documento</label>
              <select
                id="tipoDocumento"
                value={getFieldValue('tipoDocumento')}
                onChange={e => handleFieldChange('tipoDocumento', e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
              {errors.tipoDocumento && <p className="text-sm text-red-600 mt-1">{errors.tipoDocumento}</p>}
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="numeroDocumento"><i className="fas fa-hashtag"></i> Número de Documento</label>
              <input
                id="numeroDocumento"
                type="text"
                value={getFieldValue('numeroDocumento')}
                onChange={e => handleFieldChange('numeroDocumento', e.target.value)}
                placeholder="Número de documento"
                required
              />
              {errors.numeroDocumento && <p className="text-sm text-red-600 mt-1">{errors.numeroDocumento}</p>}
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="fechaNacimiento"><i className="fas fa-hashtag"></i> Fecha de Nacimiento</label>
              <input
                id="fechaNacimiento"
                type="date"
                className="input-fecha-moderno"
                value={getFechaNacimientoValue()}
                onChange={e => handleFieldChange('fechaNacimiento', e.target.value)}
                required
              />
              {errors.fechaNacimiento && <p className="text-sm text-red-600 mt-1">{errors.fechaNacimiento}</p>}
            </div>
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label htmlFor="password"><i className="fas fa-lock"></i> Contraseña</label>
                <div className="password-wrapper">
                  <input
                    id="password"
                    type={mostrarPassword ? "text" : "password"}
                    className="password-input"
                    value={nuevoUsuario.password}
                    onChange={e =>
                      setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                    }
                    placeholder="Credencial de acceso"
                    required={!modoEdicion}
                  />
                  <button
                    type="button"
                    className="password-toggle-admin"
                    onClick={() => setMostrarPassword((prev) => !prev)}
                    aria-label={mostrarPassword ? "Ocultar credencial" : "Mostrar credencial"}
                    tabIndex={0}
                  >
                    <i className={mostrarPassword ? "fas fa-eye-slash" : "fas fa-eye"} aria-hidden="true"></i>
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                {/* Barra de fuerza de credencial */}
                {!modoEdicion && (
                  <>
                    {(() => {
                      let strengthClass = 'strong';
                      if (strength.score <= 1) strengthClass = 'weak';
                      else if (strength.score === 2) strengthClass = 'fair';
                      else if (strength.score === 3) strengthClass = 'good';
                      return <div className={`password-strength ${strengthClass}`}></div>;
                    })()}
                    {strength.text && <p className="text-sm text-gray-600 mt-1">{strength.text}</p>}
                  </>
                )}
                <span className="error-message" id="passwordError"></span>
              </div>
            )}
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor="role">
                <i className="fas fa-user-tag"></i> {' '}
                Rol
              </label>
              <select
                id="role"
                value={getFieldValue('role')}
                onChange={e => handleFieldChange('role', e.target.value)}
                required
              >
                <option value="">Seleccione.....</option>
                <option value="tesorero">Tesorero</option>
                <option value="seminarista">Seminarista</option>
                <option value="externo">Externo</option>
              </select>
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="estado"><i className="fas fa-toggle-on"></i> Estado</label>
              <select
                id="estado"
                value={getFieldValue('estado')}
                onChange={e => handleFieldChange('estado', e.target.value)}
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose} type="button">
              <i className="fas fa-times"></i> {' '}
              Cancelar
            </button>
            <button type="submit" className={`btn-admin btn-primary ${Object.keys(errors).length ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={Object.keys(errors).length > 0}>
              <i className="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

UsuarioModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  usuarioSeleccionado: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    correo: PropTypes.string,
    telefono: PropTypes.string,
    tipoDocumento: PropTypes.string,
    numeroDocumento: PropTypes.string,
    fechaNacimiento: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    password: PropTypes.string,
    role: PropTypes.string,
    estado: PropTypes.string
  }),
  setUsuarioSeleccionado: PropTypes.func,
  nuevoUsuario: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    correo: PropTypes.string,
    telefono: PropTypes.string,
    tipoDocumento: PropTypes.string,
    numeroDocumento: PropTypes.string,
    fechaNacimiento: PropTypes.string,
    password: PropTypes.string,
    role: PropTypes.string,
    estado: PropTypes.string
  }).isRequired,
  setNuevoUsuario: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default UsuarioModal;