
import React, { useState } from "react";
import ConfirmDeleteModal from "../Modales/ConfirmDeleteModal";

const roleColors = {
  admin: "#7c3aed",
  tesorero: "#06b6d4",
  seminarista: "#22c55e",
  externo: "#64748b"
};

const statusColors = {
  activo: "#22c55e",
  inactivo: "#f87171",
  suspendido: "#fbbf24"
};

const TablaUsuarios = ({ usuarios, onEditar, onEliminar }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  const handleEliminarClick = (user) => {
    setUsuarioAEliminar(user);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setUsuarioAEliminar(null);
  };

  const handleConfirmDelete = () => {
    if (onEliminar && usuarioAEliminar) {
      onEliminar(usuarioAEliminar._id);
    }
    setShowDeleteModal(false);
    setUsuarioAEliminar(null);
  };

  return (
    <>
      <div className="tabla-contenedor-admin glass-table premium-table-admin" style={{padding: "32px 0", borderRadius: "18px", boxShadow: "0 8px 32px 0 rgba(60,60,120,0.12)", background: "rgba(255,255,255,0.7)", margin: "0 auto", maxWidth: "98%"}}>
        <table className="tabla-usuarios-admin premium-table" style={{width: "100%", borderCollapse: "separate", borderSpacing: "0 12px"}}>
          <thead>
            <tr style={{background: "rgba(245,245,255,0.7)", borderRadius: "12px"}}>
              <th style={{padding: "12px 8px", textAlign: "center"}}>ID</th>
              <th style={{padding: "12px 8px", textAlign: "left"}}>Nombre</th>
              <th style={{padding: "12px 8px", textAlign: "left"}}>Apellido</th>
              <th style={{padding: "12px 8px", textAlign: "left"}}>Correo</th>
              <th style={{padding: "12px 8px", textAlign: "center"}}>Teléfono</th>
              <th style={{padding: "12px 8px", textAlign: "center"}}>Documento</th>
              <th style={{padding: "12px 8px", textAlign: "center"}}>Rol</th>
              <th style={{padding: "12px 8px", textAlign: "center"}}>Estado</th>
              <th style={{padding: "12px 8px", textAlign: "center"}}>Registro</th>
              <th style={{padding: "12px 8px", textAlign: "center"}}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={10} className="no-usuarios-premium" style={{padding: "24px", textAlign: "center"}}>No hay usuarios para mostrar</td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user._id} className="fila-usuario-admin premium-row" style={{background: "rgba(255,255,255,0.95)", borderRadius: "12px", boxShadow: "0 2px 8px 0 rgba(60,60,120,0.08)", marginBottom: "8px"}}>
                  <td className="id-premium" style={{padding: "12px 8px", textAlign: "center", fontWeight: "bold", color: "#7c3aed"}}>{user._id.slice(-6)}</td>
                  <td style={{padding: "12px 8px", minWidth: "120px"}}>
                    <div className="user-info-admin premium-user-info" style={{display: "flex", alignItems: "center", gap: "12px"}}>
                      <div className="user-avatar glass-avatar premium-avatar" style={{background: "linear-gradient(135deg, #7c3aed 60%, #06b6d4 100%)", color: "white", width: "38px", height: "38px", fontSize: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", fontWeight: "bold"}}>
                        {user.nombre?.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="user-name-admin premium-user-name" style={{fontWeight: "500", fontSize: "1rem"}}>{user.nombre}</div>
                    </div>
                  </td>
                  <td className="apellido-premium" style={{padding: "12px 8px", minWidth: "120px"}}>{user.apellido}</td>
                  <td className="correo-premium" style={{padding: "12px 8px", minWidth: "180px", fontSize: "0.98rem"}}>{user.correo}</td>
                  <td className="telefono-premium" style={{padding: "12px 8px", textAlign: "center", minWidth: "120px"}}>{user.telefono}</td>
                  <td style={{padding: "12px 8px", textAlign: "center", minWidth: "160px"}}>
                    <span className="doc-type-premium" style={{fontWeight: "bold", color: "#64748b"}}>{user.tipoDocumento}</span>
                    <span className="doc-number-premium" style={{marginLeft: "6px", color: "#334155"}}>{user.numeroDocumento}</span>
                  </td>
                  <td style={{padding: "12px 8px", textAlign: "center"}}>
                    <span className="badge-rol premium-badge-rol" style={{background: roleColors[user.role] || "#64748b", color: "#fff", borderRadius: "12px", padding: "4px 12px", fontWeight: "bold", fontSize: "0.95rem"}}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td style={{padding: "12px 8px", textAlign: "center"}}>
                    <span className="badge-estado premium-badge-estado" style={{background: statusColors[user.status] || "#22c55e", color: "#fff", borderRadius: "12px", padding: "4px 12px", fontWeight: "bold", fontSize: "0.95rem"}}>
                      {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : "Activo"}
                    </span>
                  </td>
                  <td className="fecha-premium" style={{padding: "12px 8px", textAlign: "center", minWidth: "110px"}}>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td style={{padding: "12px 8px", textAlign: "center"}}>
                    <div className="acciones-botones premium-actions" style={{display: "flex", gap: "8px", justifyContent: "center"}}>
                      <button className="btn-action editar premium-edit" title="Editar" style={{background: "#f3f4f6", borderRadius: "8px", padding: "6px 10px", border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.08)", cursor: "pointer"}} onClick={() => onEditar(user)}>
                        <i className="fas fa-edit" style={{color: "#7c3aed", fontSize: "1.1rem"}}></i>
                      </button>
                      {onEliminar && (
                        <button className="btn-action eliminar premium-delete" title="Eliminar" style={{background: "#f3f4f6", borderRadius: "8px", padding: "6px 10px", border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.08)", cursor: "pointer"}} onClick={() => handleEliminarClick(user)}>
                          <i className="fas fa-trash" style={{color: "#f87171", fontSize: "1.1rem"}}></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <ConfirmDeleteModal
        mostrar={showDeleteModal}
        usuario={usuarioAEliminar}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default TablaUsuarios;