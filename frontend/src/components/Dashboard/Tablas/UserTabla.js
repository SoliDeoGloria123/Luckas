import React from "react";

const TablaUsuarios = ({ usuarios, onEditar, onEliminar }) => (
  
  <div className="tabla-contenedor">
    
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Tipo de Documento</th>
          <th>Número de Documento</th>
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
            <tr key={user._id}>
              <td>{user._id}</td>
              <td>
                <div className="usuario-celda">
                  <div className="usuario-avatar-mini">{user.nombre?.substring(0, 2).toUpperCase()}</div>
                  <span>{user.nombre}</span>
                </div>
              </td>
              <td>{user.apellido}</td>
              <td>{user.correo}</td>
              <td>{user.telefono}</td>
              <td>{user.tipoDocumento}</td>
              <td>{user.numeroDocumento}</td>
              <td>
                <span className={`badge-rol rol-${user.role}`}>{user.role}</span>
              </td>
              <td>
                <span className={`badge-estado estado-${user.status || "active"}`}>
                  {user.status || "activo"}
                </span>
              </td>
              <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-editar" onClick={() => onEditar(user)}>✏️</button>
                  {onEliminar && (
                    <button className="btn-eliminar" onClick={() => onEliminar(user._id)}>🗑️</button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TablaUsuarios;