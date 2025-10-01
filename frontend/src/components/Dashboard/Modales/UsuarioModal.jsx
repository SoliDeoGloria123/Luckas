import React from "react";

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
  if (!mostrar) return null;

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
              <label><i class="fas fa-user"></i>Nombre</label>
              <input
                type="text"
                value={modoEdicion ? usuarioSeleccionado?.nombre : nuevoUsuario.nombre}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })
                }
                placeholder="Nombre"
                required
              />
            </div>
            <div className="form-grupo-admin">
              <label><i class="fas fa-user"></i> Apellido</label>
              <input
                type="text"
                value={modoEdicion ? usuarioSeleccionado?.apellido : nuevoUsuario.apellido}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, apellido: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })
                }
                placeholder="Apellido"
                required
              />

            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>  <i class="fas fa-envelope"></i> Correo</label>
              <input
                type="email"
                value={modoEdicion ? usuarioSeleccionado?.correo : nuevoUsuario.correo}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, correo: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, correo: e.target.value })
                }
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
            <div className="form-grupo-admin">
              <label><i class="fas fa-phone"></i> Teléfono</label>
              <input
                type="text"
                value={modoEdicion ? usuarioSeleccionado?.telefono : nuevoUsuario.telefono}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, telefono: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, telefono: e.target.value })
                }
                placeholder="Teléfono"
                required
              />
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label><i class="fas fa-id-card"></i> Tipo de Documento</label>
              <select
                value={modoEdicion ? usuarioSeleccionado?.tipoDocumento : nuevoUsuario.tipoDocumento}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, tipoDocumento: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, tipoDocumento: e.target.value })
                }
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
              <label><i class="fas fa-hashtag"></i> Número de Documento</label>
              <input
                type="text"
                value={modoEdicion ? usuarioSeleccionado?.numeroDocumento : nuevoUsuario.numeroDocumento}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, numeroDocumento: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, numeroDocumento: e.target.value })
                }
                placeholder="Número de documento"
                required
              />
            </div>
          </div>
          <div className="from-grid-admin">
             <div className="form-grupo-admin">
              <label><i class="fas fa-hashtag"></i> Fecha de Nacimiento</label>
              <input
                type="date"
                value={
                  modoEdicion
                    ? (usuarioSeleccionado?.fechaNacimiento
                        ? new Date(usuarioSeleccionado.fechaNacimiento).toISOString().split('T')[0]
                        : '')
                    : nuevoUsuario.fechaNacimiento
                }
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, fechaNacimiento: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, fechaNacimiento: e.target.value })
                }
                required
              />
            </div>
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label><i class="fas fa-lock"></i> Contraseña</label>

                <input
                  type="password"
                  value={nuevoUsuario.password}
                  onChange={e =>
                    setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                  }
                  placeholder="Contraseña"
                  required={!modoEdicion}
                />
                <button type="button" class="password-toggle-admin" >
                  <i class="fas fa-eye"></i>
                </button>
                <span class="error-message" id="passwordError"></span>
                <div class="password-strength" id="passwordStrength"></div>
              </div>
            )}
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>
                <i class="fas fa-user-tag"></i>
                Rol
              </label>
              <select
                value={modoEdicion ? usuarioSeleccionado?.role : nuevoUsuario.role}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, role: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, role: e.target.value })
                }
                required
              >
                <option value="admin">Admin</option>
                <option value="tesorero">Tesorero</option>
                <option value="seminarista">Seminarista</option>
                <option value="externo">Externo</option>
              </select>
            </div>
            <div className="form-grupo-admin">
              <label><i class="fas fa-toggle-on"></i> Estado</label>
              <select
                value={modoEdicion ? usuarioSeleccionado?.estado : nuevoUsuario.estado}
                onChange={e =>
                  modoEdicion
                    ? setUsuarioSeleccionado({ ...usuarioSeleccionado, estado: e.target.value })
                    : setNuevoUsuario({ ...nuevoUsuario, estado: e.target.value })
                }
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary">
              <i class="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioModal;