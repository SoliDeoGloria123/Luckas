      import React from "react";
import PropTypes from "prop-types";

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
  if (!mostrar) return null;

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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
        <form className="modal-body-admin" onSubmit={e => onSubmit(e)}>
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
            </div>
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label htmlFor="password"><i className="fas fa-lock"></i> Contraseña</label>

                <input
                  id="password"
                  type={mostrarPassword ? "text" : "password"}
                  value={nuevoUsuario.password}
                  onChange={e =>
                    setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                  }
                  placeholder="Contraseña"
                  required={!modoEdicion}
                />
                <button
                  type="button"
                  className="password-toggle-admin"
                  onClick={() => setMostrarPassword((prev) => !prev)}
                  aria-label={mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  tabIndex={0}
                >
                  <i className={mostrarPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                </button>
                <span className="error-message" id="passwordError"></span>
                <div className="password-strength" id="passwordStrength"></div>
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
                <option value="admin">Admin</option>
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
            <button className="btn-admin secondary-admin" onClick={onClose}>
              <i className="fas fa-times"></i> {' '}
              Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary">
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