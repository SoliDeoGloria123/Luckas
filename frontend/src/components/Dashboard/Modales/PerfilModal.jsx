import React, { useState } from "react";
import { mostrarAlerta } from "../utils/alertas";

const PerfilModal = ({ mostrar, usuario, onClose, onActualizar, onCambiarPassword }) => {
  React.useEffect(() => {
    if (mostrar) {
      console.log('PerfilModal: ¡Se está montando el modal de perfil!');
    }
  }, [mostrar]);
  const [form, setForm] = useState({
    nombre: usuario?.nombre || "",
    apellido: usuario?.apellido || "",
    correo: usuario?.correo || "",
    telefono: usuario?.telefono || "",
    tipoDocumento: usuario?.tipoDocumento || "",
    numeroDocumento: usuario?.numeroDocumento || "",
    direccion: usuario?.direccion || "",
    fotoPerfil: usuario?.fotoPerfil || "",
  });
  const [file, setFile] = useState(null);
  const [passwords, setPasswords] = useState({ actual: "", nueva: "" });
  const [cambiandoPass, setCambiandoPass] = useState(false);

  if (!mostrar) return null;

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    onActualizar(form, file);
  };

  const handlePasswordChange = e => {
    e.preventDefault();
    if (!passwords.actual || !passwords.nueva) {
      mostrarAlerta("Error", "Debes completar ambos campos de contraseña", "error");
      return;
    }
    onCambiarPassword(passwords.actual, passwords.nueva);
  };

  return (
    <div className="modal-overlay-admin glass-blur" style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(60,60,120,0.18)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeInModal 0.4s"}}>
      <div className="modal-admin glass-modal premium-modal" style={{background: "rgba(255,255,255,0.97)", borderRadius: "22px", boxShadow: "0 8px 32px 0 rgba(60,60,120,0.18)", minWidth: "420px", maxWidth: "98vw", padding: "32px 28px", position: "relative", animation: "slideUpModal 0.5s"}}>
        <div className="modal-header-admin" style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px"}}>
          <h2 style={{fontWeight: 700, fontSize: "1.35rem", color: "#7c3aed"}}>
            <i className="fas fa-user-circle" style={{marginRight: "10px"}}></i>
            Editar Perfil
          </h2>
          <button className="modal-cerrar" style={{background: "none", border: "none", fontSize: "1.5rem", color: "#64748b", cursor: "pointer"}} onClick={onClose}>✕</button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "18px"}}>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label>Nombre</label>
              <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label>Apellido</label>
              <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required />
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label>Correo</label>
              <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label>Teléfono</label>
              <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required />
            </div>
          </div>
          <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px"}}>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label>Tipo de Documento</label>
              <input type="text" name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} required />
            </div>
            <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
              <label>Número de Documento</label>
              <input type="text" name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} required />
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <label>Dirección</label>
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange} />
          </div>
          <div style={{display: "flex", flexDirection: "column", gap: "8px"}}>
            <label>Foto de Perfil</label>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            {form.fotoPerfil && <img src={form.fotoPerfil} alt="Foto de perfil" style={{width: "60px", height: "60px", borderRadius: "50%", marginTop: "8px"}} />}
          </div>
          <div style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "18px"}}>
            <button type="button" style={{background: "#f3f4f6", color: "#64748b", borderRadius: "10px", padding: "8px 18px", fontWeight: 500, border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.08)", cursor: "pointer"}} onClick={onClose}>Cancelar</button>
            <button type="submit" style={{background: "linear-gradient(90deg, #7c3aed 60%, #06b6d4 100%)", color: "#fff", borderRadius: "10px", padding: "8px 18px", fontWeight: 600, border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.10)", cursor: "pointer", transition: "background 0.2s"}}>Guardar Cambios</button>
          </div>
        </form>
        <div style={{marginTop: "24px", borderTop: "1px solid #e5e7eb", paddingTop: "18px"}}>
          <button onClick={() => setCambiandoPass(!cambiandoPass)} style={{background: "#f3f4f6", color: "#7c3aed", borderRadius: "10px", padding: "8px 18px", fontWeight: 500, border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.08)", cursor: "pointer"}}>
            {cambiandoPass ? "Cancelar cambio de contraseña" : "Cambiar contraseña"}
          </button>
          {cambiandoPass && (
            <form onSubmit={handlePasswordChange} style={{marginTop: "12px", display: "flex", flexDirection: "column", gap: "10px"}}>
              <input type="password" placeholder="Contraseña actual" value={passwords.actual} onChange={e => setPasswords(prev => ({ ...prev, actual: e.target.value }))} required />
              <input type="password" placeholder="Nueva contraseña" value={passwords.nueva} onChange={e => setPasswords(prev => ({ ...prev, nueva: e.target.value }))} required />
              <button type="submit" style={{background: "linear-gradient(90deg, #7c3aed 60%, #06b6d4 100%)", color: "#fff", borderRadius: "10px", padding: "8px 18px", fontWeight: 600, border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.10)", cursor: "pointer", transition: "background 0.2s"}}>Actualizar contraseña</button>
            </form>
          )}
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

export default PerfilModal;
