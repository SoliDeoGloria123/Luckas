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
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grupo">
            <label>Nombre:</label>
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
          <div className="form-grupo">
            <label>Apellido:</label>
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
          <div className="form-grupo">
            <label>Correo:</label>
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
          <div className="form-grupo">
            <label>Teléfono:</label>
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
          <div className="form-grupo">
            <label>Tipo de Documento:</label>
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
          <div className="form-grupo">
            <label>Número de Documento:</label>
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
          <div className="form-grupo">
            <label>Contraseña:</label>
            <input
              type="password"
              value={modoEdicion ? usuarioSeleccionado?.password : nuevoUsuario.password}
              onChange={e =>
                modoEdicion
                  ? setUsuarioSeleccionado({ ...usuarioSeleccionado, password: e.target.value })
                  : setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
              }
              placeholder="Contraseña"
              required={!modoEdicion}
            />
          </div>
          <div className="form-grupo">
            <label>Rol:</label>
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
          <div className="form-grupo">
            <label>Estado:</label>
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
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Usuario"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioModal;