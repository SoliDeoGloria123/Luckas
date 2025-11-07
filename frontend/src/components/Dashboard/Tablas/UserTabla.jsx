import React from "react";
import PropTypes from "prop-types";

const TablaUsuarios = ({ usuarios, onEditar, onEliminar, onToggleEstado }) => (

  <div className="tabla-contenedor-admin">
    <table className="tabla-usuarios-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Número de Documento</th>
          <th>Fecha de Nacimiento</th>
          <th>Rol</th>
          <th>Estado</th>
          <th>Fecha Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {usuarios.length === 0 ? (
          <tr>
            <td colSpan={9}>No hay usuarios para mostrar</td>
          </tr>
        ) : (
          usuarios.map((user) => (
            <tr key={user._id} className={user.estado === 'inactivo' ? 'usuario-inactivo-blur' : ''}>
              <td>{user._id}</td>
              <td>
                <div className="user-info-admin">
                  <div className="user-avatar">{user.nombre?.substring(0, 2).toUpperCase()}</div>
                  <div className="user-name-admin">{user.nombre}</div>
                </div>
              </td>
              <td>{user.apellido}</td>
              <td>{user.correo}</td>
              <td>{user.telefono}</td>

              <td>
                <div className="document-info">
                  <span className="doc-type"> {user.tipoDocumento}</span>
                  <span className="doc-number">{user.numeroDocumento}</span>
                </div>
              </td>
              <td>{user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : "N/A"}</td>
              <td>
                <span className={`badge-rol rol-${user.role}`}>{user.role}</span>
              </td>
              <td>
                <span className={`badge-estado estado-${user.estado || "activo"}`}>
                  {user.estado || "activo"}
                </span>
              </td>
              <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-action editar" onClick={() => onEditar(user)}><i className="fas fa-edit"></i></button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(user._id)}><i className="fas fa-trash"></i></button>
                  )}
                  <button
                    className={`btn-action ${user.estado === "activo" ? "desactivar" : "activar"}`}
                    onClick={() => onToggleEstado(user)}
                  >
                    {user.estado === "activo" ? (
                      <i className="fas fa-ban"></i> // ícono para desactivar
                    ) : (
                      <i className="fas fa-check"></i> // ícono para activar
                    )}
                  </button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);
TablaUsuarios.propTypes = {
  usuarios: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func,
  onToggleEstado: PropTypes.func,
};

export default TablaUsuarios;