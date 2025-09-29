import React, { useState } from "react";
import { userService } from "../../../services/ObteneruserService";

const defaultForm = {
  usuario: "",
  nombre: "",
  apellido: "",
  tipoDocumento: "",
  numeroDocumento: "",
  correo: "",
  telefono: "",
  edad: "",
  evento: "",
  categoria: "",
  estado: "pendiente",
  observaciones: ""
};

const InscripcionModalCrear = ({ mostrar, onClose, onSubmit, eventos, categorias }) => {
  const [form, setForm] = useState(defaultForm);
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  // Buscar usuario por cédula
  const buscarUsuarioPorCedula = async (cedula) => {
    if (!cedula || cedula.length < 6) return;
    setCargandoUsuario(true);
    try {
      const usuario = await userService.getByDocumento(cedula);
      setUsuarioEncontrado(usuario);
      setForm(prev => ({
        ...prev,
        usuario: String(usuario._id || ""),
        nombre: String(usuario.nombre || ""),
        apellido: String(usuario.apellido || ""),
        correo: String(usuario.correo || ""),
        telefono: String(usuario.telefono || ""),
        tipoDocumento: String(usuario.tipoDocumento || ""),
        numeroDocumento: String(usuario.numeroDocumento || cedula)
      }));
    } catch (error) {
      setUsuarioEncontrado(null);
      setForm(prev => ({
        ...prev,
        usuario: "",
        nombre: "",
        apellido: "",
        correo: "",
        telefono: "",
        tipoDocumento: "",
        numeroDocumento: String(cedula)
      }));
    } finally {
      setCargandoUsuario(false);
    }
  };

  const handlePasteCedula = (e) => {
    setTimeout(() => {
      const valorPegado = e.target.value;
      setCedulaBusqueda(valorPegado);
      buscarUsuarioPorCedula(valorPegado);
    }, 10);
  };

  const handleChangeCedula = (e) => {
    const valor = e.target.value;
    setCedulaBusqueda(valor);
    if (valor.length >= 6) {
      buscarUsuarioPorCedula(valor);
    } else {
      setUsuarioEncontrado(null);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: String(value) });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Asegurar que todos los valores sean string
    const payload = {};
    Object.keys(form).forEach(key => {
      payload[key] = String(form[key] || "");
    });
    onSubmit(payload);
    setForm(defaultForm);
    setCedulaBusqueda("");
    setUsuarioEncontrado(null);
  };

  if (!mostrar) return null;
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin">
          <h3>Nueva Inscripción</h3>
          <button className="modal-cerrar" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Cédula del Usuario:</label>
              <input
                type="text"
                value={cedulaBusqueda}
                onChange={handleChangeCedula}
                onPaste={handlePasteCedula}
                placeholder="Ingrese o pegue la cédula"
                style={{ paddingRight: cargandoUsuario ? '40px' : '10px' }}
              />
              {cargandoUsuario && (
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#666' }}>🔄</div>
              )}
              {usuarioEncontrado && (
                <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', fontSize: '14px', color: '#155724' }}>
                  ✅ Usuario encontrado: {usuarioEncontrado.nombre} {usuarioEncontrado.apellido} - {usuarioEncontrado.correo}
                </div>
              )}
              {cedulaBusqueda && !usuarioEncontrado && !cargandoUsuario && (
                <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', fontSize: '14px', color: '#721c24' }}>
                  ❌ Usuario no encontrado con esta cédula
                </div>
              )}
            </div>
            <div className="form-grupo-admin">
              <label>Nombre:</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" />
            </div>
            <div className="form-grupo-admin">
              <label>Apellido:</label>
              <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" />
            </div>
            <div className="form-grupo-admin">
              <label>Tipo de Documento:</label>
              <input name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} placeholder="Tipo de Documento" />
            </div>
            <div className="form-grupo-admin">
              <label>Número de Documento:</label>
              <input name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} placeholder="Número de Documento" />
            </div>
            <div className="form-grupo-admin">
              <label>Correo:</label>
              <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" />
            </div>
            <div className="form-grupo-admin">
              <label>Teléfono:</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
            </div>
            <div className="form-grupo-admin">
              <label>Edad:</label>
              <input name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" />
            </div>
            <div className="form-grupo-admin">
              <label>Evento:</label>
              <select name="evento" value={form.evento} onChange={handleChange}>
                <option value="">Seleccione evento</option>
                {eventos.map(ev => <option key={ev._id} value={ev._id}>{ev.nombre}</option>)}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Categoría:</label>
              <select name="categoria" value={form.categoria} onChange={handleChange}>
                <option value="">Seleccione categoría</option>
                {categorias.map(cat => <option key={cat._id} value={cat._id}>{cat.nombre}</option>)}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Estado:</label>
              <input name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" />
            </div>
            <div className="form-grupo-admin">
              <label>Observaciones:</label>
              <input name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" />
            </div>
          </div>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" type="button" onClick={onClose}>
              <i className="fas fa-times"></i>
              Cancelar
            </button>
            <button type="submit" className="btn-admin btn-primary">Crear Inscripción</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscripcionModalCrear;
