
import React, { useState } from "react";

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "externo", label: "Externo" },
  { value: "seminarista", label: "Seminarista" },
  { value: "tesorero", label: "Tesorero" }
];

const tiposDocumento = [
  { value: "Cédula de ciudadanía", label: "Cédula de ciudadanía" },
  { value: "Cédula de extranjería", label: "Cédula de extranjería" },
  { value: "Pasaporte", label: "Pasaporte" },
  { value: "Tarjeta de identidad", label: "Tarjeta de identidad" }
];

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
	const [errores, setErrores] = useState({});
	if (!mostrar) return null;

	const validar = () => {
		let err = {};
		if (!(modoEdicion ? usuarioSeleccionado?.nombre : nuevoUsuario.nombre)) err.nombre = "El nombre es obligatorio";
		if (!(modoEdicion ? usuarioSeleccionado?.apellido : nuevoUsuario.apellido)) err.apellido = "El apellido es obligatorio";
		if (!(modoEdicion ? usuarioSeleccionado?.correo : nuevoUsuario.correo)) err.correo = "El correo es obligatorio";
		if (!(modoEdicion ? usuarioSeleccionado?.telefono : nuevoUsuario.telefono)) err.telefono = "El teléfono es obligatorio";
		if (!(modoEdicion ? usuarioSeleccionado?.tipoDocumento : nuevoUsuario.tipoDocumento)) err.tipoDocumento = "El tipo de documento es obligatorio";
		if (!(modoEdicion ? usuarioSeleccionado?.numeroDocumento : nuevoUsuario.numeroDocumento)) err.numeroDocumento = "El número de documento es obligatorio";
		if (!modoEdicion && !nuevoUsuario.password) err.password = "La contraseña es obligatoria";
		if (!(modoEdicion ? usuarioSeleccionado?.role : nuevoUsuario.role)) err.role = "El rol es obligatorio";
		setErrores(err);
		return Object.keys(err).length === 0;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validar()) onSubmit(e);
	};

			return (
				<div className="modal-overlay-admin glass-blur" style={{position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(60,60,120,0.18)", backdropFilter: "blur(6px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeInModal 0.4s"}}>
					<div className="modal-admin glass-modal premium-modal" style={{background: "rgba(255,255,255,0.92)", borderRadius: "22px", boxShadow: "0 8px 32px 0 rgba(60,60,120,0.18)", minWidth: "420px", maxWidth: "98vw", padding: "32px 28px", position: "relative", animation: "slideUpModal 0.5s"}}>
						<div className="modal-header-admin" style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px"}}>
							<h2 style={{fontWeight: 700, fontSize: "1.35rem", color: "#7c3aed"}}>
								<i className={modoEdicion ? "fas fa-user-edit" : "fas fa-user-plus"} style={{marginRight: "10px"}}></i>
								{modoEdicion ? "Editar Usuario" : "Crear Nuevo Usuario"}
							</h2>
							<button className="modal-cerrar" style={{background: "none", border: "none", fontSize: "1.5rem", color: "#64748b", cursor: "pointer"}} onClick={onClose}>✕</button>
						</div>
						<form className="modal-body-admin" onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", gap: "18px"}}>
							<div className="from-grid-admin" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px"}}>
								{/* Nombre y Apellido */}
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-user" style={{marginRight: "7px", color: "#7c3aed"}}></i> Nombre</label>
									<input type="text" value={modoEdicion ? usuarioSeleccionado?.nombre : nuevoUsuario.nombre} onChange={e => { const value = e.target.value; if (modoEdicion) setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre: value }); else setNuevoUsuario({ ...nuevoUsuario, nombre: value }); setErrores(prev => ({ ...prev, nombre: value ? undefined : "El nombre es obligatorio" })); }} placeholder="Nombre" required style={{padding: "10px 14px", borderRadius: "10px", border: errores.nombre ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.nombre ? "input-error" : ""} />
									{errores.nombre && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.nombre}</span>}
								</div>
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-user" style={{marginRight: "7px", color: "#7c3aed"}}></i> Apellido</label>
									<input type="text" value={modoEdicion ? usuarioSeleccionado?.apellido : nuevoUsuario.apellido} onChange={e => { const value = e.target.value; if (modoEdicion) setUsuarioSeleccionado({ ...usuarioSeleccionado, apellido: value }); else setNuevoUsuario({ ...nuevoUsuario, apellido: value }); setErrores(prev => ({ ...prev, apellido: value ? undefined : "El apellido es obligatorio" })); }} placeholder="Apellido" required style={{padding: "10px 14px", borderRadius: "10px", border: errores.apellido ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.apellido ? "input-error" : ""} />
									{errores.apellido && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.apellido}</span>}
								</div>
							</div>
							<div className="from-grid-admin" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px"}}>
								{/* Correo y Teléfono */}
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-envelope" style={{marginRight: "7px", color: "#06b6d4"}}></i> Correo</label>
									<input type="email" value={modoEdicion ? usuarioSeleccionado?.correo : nuevoUsuario.correo} onChange={e => { const value = e.target.value; if (modoEdicion) setUsuarioSeleccionado({ ...usuarioSeleccionado, correo: value }); else setNuevoUsuario({ ...nuevoUsuario, correo: value }); setErrores(prev => ({ ...prev, correo: value ? undefined : "El correo es obligatorio" })); }} placeholder="correo@ejemplo.com" required style={{padding: "10px 14px", borderRadius: "10px", border: errores.correo ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.correo ? "input-error" : ""} />
									{errores.correo && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.correo}</span>}
								</div>
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-phone" style={{marginRight: "7px", color: "#06b6d4"}}></i> Teléfono</label>
									<input type="text" value={modoEdicion ? usuarioSeleccionado?.telefono : nuevoUsuario.telefono} onChange={e => { const value = e.target.value; if (modoEdicion) setUsuarioSeleccionado({ ...usuarioSeleccionado, telefono: value }); else setNuevoUsuario({ ...nuevoUsuario, telefono: value }); setErrores(prev => ({ ...prev, telefono: value ? undefined : "El teléfono es obligatorio" })); }} placeholder="Teléfono" required style={{padding: "10px 14px", borderRadius: "10px", border: errores.telefono ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.telefono ? "input-error" : ""} />
									{errores.telefono && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.telefono}</span>}
								</div>
							</div>
							<div className="from-grid-admin" style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px"}}>
								{/* Tipo de documento y Número de documento */}
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-id-card" style={{marginRight: "7px", color: "#06b6d4"}}></i> Tipo de Documento</label>
									<select value={modoEdicion ? usuarioSeleccionado?.tipoDocumento || "" : nuevoUsuario.tipoDocumento || ""} onChange={e => { const value = e.target.value; if (modoEdicion) setUsuarioSeleccionado({ ...usuarioSeleccionado, tipoDocumento: value }); else setNuevoUsuario({ ...nuevoUsuario, tipoDocumento: value }); setErrores(prev => ({ ...prev, tipoDocumento: value ? undefined : "El tipo de documento es obligatorio" })); }} required style={{padding: "10px 14px", borderRadius: "10px", border: errores.tipoDocumento ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.tipoDocumento ? "input-error" : ""}>
										<option value="" disabled>Selecciona tipo de documento...</option>
										{tiposDocumento.map(td => (
											<option key={td.value} value={td.value}>{td.label}</option>
										))}
									</select>
									{errores.tipoDocumento && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.tipoDocumento}</span>}
								</div>
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-id-card-alt" style={{marginRight: "7px", color: "#06b6d4"}}></i> Número de Documento</label>
									<input type="text" value={modoEdicion ? usuarioSeleccionado?.numeroDocumento : nuevoUsuario.numeroDocumento} onChange={e => { const value = e.target.value; if (modoEdicion) setUsuarioSeleccionado({ ...usuarioSeleccionado, numeroDocumento: value }); else setNuevoUsuario({ ...nuevoUsuario, numeroDocumento: value }); setErrores(prev => ({ ...prev, numeroDocumento: value ? undefined : "El número de documento es obligatorio" })); }} placeholder="Número de documento" required style={{padding: "10px 14px", borderRadius: "10px", border: errores.numeroDocumento ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.numeroDocumento ? "input-error" : ""} />
									{errores.numeroDocumento && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.numeroDocumento}</span>}
								</div>
							</div>
							{/* Contraseña solo en creación */}
							{!modoEdicion && (
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-lock" style={{marginRight: "7px", color: "#7c3aed"}}></i> Contraseña</label>
									<input type="password" value={nuevoUsuario.password} onChange={e => { const value = e.target.value; setNuevoUsuario({ ...nuevoUsuario, password: value }); setErrores(prev => ({ ...prev, password: value ? undefined : "La contraseña es obligatoria" })); }} placeholder="Contraseña" required style={{padding: "10px 14px", borderRadius: "10px", border: errores.password ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.password ? "input-error" : ""} />
									{errores.password && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.password}</span>}
								</div>
							)}
							<div className="from-grid-admin" style={{display: "grid", gridTemplateColumns: "1fr", gap: "18px"}}>
								{/* Rol */}
								<div className="form-grupo-admin" style={{display: "flex", flexDirection: "column", gap: "8px"}}>
									<label style={{fontWeight: 500, color: "#334155"}}><i className="fas fa-user-shield" style={{marginRight: "7px", color: "#7c3aed"}}></i> Rol</label>
									<select value={modoEdicion ? usuarioSeleccionado?.role || "" : nuevoUsuario.role || ""} onChange={e => { const value = e.target.value; if (modoEdicion) setUsuarioSeleccionado({ ...usuarioSeleccionado, role: value }); else setNuevoUsuario({ ...nuevoUsuario, role: value }); setErrores(prev => ({ ...prev, role: value ? undefined : "El rol es obligatorio" })); }} required style={{padding: "10px 14px", borderRadius: "10px", border: errores.role ? "2px solid #f87171" : "1.5px solid #d1d5db", fontSize: "1rem", outline: "none", background: "rgba(245,245,255,0.7)", transition: "border 0.2s"}} className={errores.role ? "input-error" : ""}>
										<option value="" disabled>Selecciona un rol...</option>
										{roles.map(r => (
											<option key={r.value} value={r.value}>{r.label}</option>
										))}
									</select>
									{errores.role && <span className="error-text" style={{color: "#f87171", fontSize: "0.95rem"}}>{errores.role}</span>}
								</div>
							</div>
							<div className="modal-footer-admin" style={{display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "18px"}}>
								<button type="button" className="btn-cancelar-admin" style={{background: "#f3f4f6", color: "#64748b", borderRadius: "10px", padding: "8px 18px", fontWeight: 500, border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.08)", cursor: "pointer"}} onClick={onClose}>Cancelar</button>
								<button type="submit" className="btn-crear-admin" style={{background: "linear-gradient(90deg, #7c3aed 60%, #06b6d4 100%)", color: "#fff", borderRadius: "10px", padding: "8px 18px", fontWeight: 600, border: "none", boxShadow: "0 1px 4px 0 rgba(60,60,120,0.10)", cursor: "pointer", transition: "background 0.2s"}}>{modoEdicion ? "Guardar Cambios" : "Crear Usuario"}</button>
							</div>
						</form>
						{/* Animaciones CSS para modal premium */}
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

export default UsuarioModal;
