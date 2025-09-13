import React from "react";

const ConfirmDeleteModal = ({ mostrar, usuario, onClose, onConfirm }) => {
  if (!mostrar) return null;
  return (
    <div className="modal-overlay-admin glass-blur" style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(220,38,38,0.18)", backdropFilter: "blur(6px)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeInModal 0.4s"}}>
      <div className="modal-admin glass-modal premium-modal" style={{background: "rgba(255,255,255,0.97)", borderRadius: "22px", boxShadow: "0 8px 32px 0 rgba(220,38,38,0.18)", minWidth: "340px", maxWidth: "98vw", padding: "32px 28px", position: "relative", animation: "slideUpModal 0.5s"}}>
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "12px"}}>
          <div style={{fontSize: "2.2rem", color: "#ef4444", marginBottom: "8px"}}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h3 style={{fontWeight: 700, fontSize: "1.15rem", color: "#ef4444", textAlign: "center"}}>¿Seguro que deseas eliminar este usuario?</h3>
          <p style={{color: "#334155", fontSize: "1rem", textAlign: "center"}}>
            Esta acción <b>no se puede deshacer</b>.<br />
            Usuario: <span style={{fontWeight: 600, color: "#7c3aed"}}>{usuario?.nombre} {usuario?.apellido}</span>
          </p>
        </div>
        <div style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px"}}>
          <button type="button" style={{background: "#f3f4f6", color: "#64748b", borderRadius: "10px", padding: "8px 18px", fontWeight: 500, border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.08)", cursor: "pointer"}} onClick={onClose}>Cancelar</button>
          <button type="button" style={{background: "linear-gradient(90deg, #ef4444 60%, #f87171 100%)", color: "#fff", borderRadius: "10px", padding: "8px 18px", fontWeight: 600, border: "none", boxShadow: "0 1px 4px 0 rgba(220,38,38,0.10)", cursor: "pointer", transition: "background 0.2s"}} onClick={onConfirm}>Eliminar</button>
        </div>
        <style>{`
          @keyframes fadeInModal {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUpModal {
            from { transform: translateY(40px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
