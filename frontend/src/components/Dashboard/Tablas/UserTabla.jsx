import React from "react";

const TablaUsuarios = ({ usuarios, onEditar, onEliminar }) => (
  
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
                <div className="user-info-admin">
                  <div className="user-avatar">{user.nombre?.substring(0, 2).toUpperCase()}</div>
                  <div className="user-name-admin">{user.nombre}</div>
                </div>
              </td>
              <td>{user.apellido}</td>
              <td>{user.correo}</td>
              <td>{user.telefono}</td>
      
              <td>
                 <div class="document-info">
                  <span class="doc-type"> {user.tipoDocumento}</span>
                  <span class="doc-number">{user.numeroDocumento}</span>
                 
                  
                  </div></td>
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
                  <button className="btn-action editar" onClick={() => onEditar(user)}><i class="fas fa-edit"></i></button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(user._id)}><i class="fas fa-trash"></i></button>
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