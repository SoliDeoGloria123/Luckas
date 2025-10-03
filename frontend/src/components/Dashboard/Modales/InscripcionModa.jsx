import React, { useState, useEffect } from "react";
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
  tipoReferencia: "",
  referencia: "",
  categoria: "",
  estado: "preinscrito",
  observaciones: ""
};

const InscripcionModal = ({
  mostrar,
  onClose,
  onSubmit,
  eventos,
  programas,
  categorias,
  modo = "crear", // "crear" o "editar"
  inscripcion // objeto de inscripción para editar
}) => {
  const [form, setForm] = useState(defaultForm);
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  // Inicializar formulario en modo editar
  useEffect(() => {
    if (modo === "editar" && inscripcion) {
      setForm({
        usuario: inscripcion.usuario?._id || inscripcion.usuario || "",
        nombre: inscripcion.nombre || "",
        apellido: inscripcion.apellido || "",
        tipoDocumento: inscripcion.tipoDocumento || "",
        numeroDocumento: inscripcion.numeroDocumento || "",
        correo: inscripcion.correo || "",
        telefono: inscripcion.telefono || "",
        edad: inscripcion.edad ? String(inscripcion.edad) : "",
        tipoReferencia: inscripcion.tipoReferencia || "",
        referencia: inscripcion.referencia?._id || inscripcion.referencia || "",
        categoria: inscripcion.categoria?._id || inscripcion.categoria || "",
        estado: inscripcion.estado || "preinscrito",
        observaciones: inscripcion.observaciones || ""
      });
      setCedulaBusqueda(inscripcion.numeroDocumento || "");
      setUsuarioEncontrado({}); // Para evitar mostrar alerta de usuario no encontrado
    } else if (modo === "crear") {
      setForm(defaultForm);
      setCedulaBusqueda("");
      setUsuarioEncontrado(null);
    }
  }, [modo, inscripcion]);

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
    if (modo === "editar") return;
    setTimeout(() => {
      const valorPegado = e.target.value;
      setCedulaBusqueda(valorPegado);
      buscarUsuarioPorCedula(valorPegado);
    }, 10);
  };

  const handleChangeCedula = (e) => {
    if (modo === "editar") return;
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
    // En modo editar, no permitir modificar campos personales
    if (modo === "editar" && [
      "usuario", "nombre", "apellido", "tipoDocumento", "numeroDocumento", "correo", "telefono", "edad", "categoria"
    ].includes(name)) {
      return;
    }
    if (name === "referencia") {
      if (form.tipoReferencia === "Eventos") {
        const eventoSel = eventos.find(ev => String(ev._id) === String(value));
        if (eventoSel && eventoSel.categoria) {
          setForm({
            ...form,
            [name]: String(value),
            categoria: String(eventoSel.categoria._id || eventoSel.categoria)
          });
          return;
        }
      } else if (form.tipoReferencia === "ProgramaAcademico") {
        const progSel = programas.find(pr => String(pr._id) === String(value));
        if (progSel && progSel.categoria) {
          setForm({
            ...form,
            [name]: String(value),
            categoria: String(progSel.categoria._id || progSel.categoria)
          });
          return;
        }
      }
    }
    setForm({ ...form, [name]: String(value) });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const payload = {
      usuario: form.usuario,
      nombre: form.nombre,
      apellido: form.apellido,
      tipoDocumento: form.tipoDocumento,
      numeroDocumento: form.numeroDocumento,
      correo: form.correo,
      telefono: form.telefono,
      edad: parseInt(form.edad) || 0,
      tipoReferencia: form.tipoReferencia,
      referencia: form.referencia,
      categoria: form.categoria,
      estado: form.estado || 'pendiente',
      observaciones: form.observaciones || ''
    };
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === undefined || payload[key] === null) {
        if (key !== 'observaciones') {
          delete payload[key];
        }
      }
    });
    onSubmit(payload);
    if (modo === "crear") {
      setForm(defaultForm);
      setCedulaBusqueda("");
      setUsuarioEncontrado(null);
    }
  };

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
          <h2>{modo === "crear" ? "Nueva Inscripción" : "Editar Inscripción"}</h2>
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
                disabled={true}
              />
              {modo === "crear" && cargandoUsuario && (
                <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontSize: '14px', color: '#666' }}>🔄</div>
              )}
              {modo === "crear" && usuarioEncontrado && (
                <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#d4edda', border: '1px solid #c3e6cb', borderRadius: '4px', fontSize: '14px', color: '#155724' }}>
                  ✅ Usuario encontrado: {usuarioEncontrado.nombre} {usuarioEncontrado.apellido} - {usuarioEncontrado.correo}
                </div>
              )}
              {modo === "crear" && cedulaBusqueda && !usuarioEncontrado && !cargandoUsuario && (
                <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', fontSize: '14px', color: '#721c24' }}>
                  ❌ Usuario no encontrado con esta cédula
                </div>
              )}
            </div>
            <div className="form-grupo-admin">
              <label>Nombre:</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" disabled={true} />
            </div>
            <div className="form-grupo-admin">
              <label>Apellido:</label>
              <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" disabled={true} />
            </div>
            <div className="form-grupo-admin">
              <label>Tipo de Documento:</label>
              <input name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} placeholder="Tipo de Documento" disabled={true} />
            </div>
            <div className="form-grupo-admin">
              <label>Número de Documento:</label>
              <input name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} placeholder="Número de Documento" disabled={true} />
            </div>
            <div className="form-grupo-admin">
              <label>Correo:</label>
              <input name="correo" value={form.correo} onChange={handleChange} placeholder="Correo" disabled={true} />
            </div>
            <div className="form-grupo-admin">
              <label>Teléfono:</label>
              <input name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" disabled={true} />
            </div>
            <div className="form-grupo-admin">
              <label>Edad:</label>
              <input name="edad" value={form.edad} onChange={handleChange} placeholder="Edad" disabled={true} />
            </div>
            <div className="form-grupo-admin">
              <label>Tipo de inscripción:</label>
              <select
                name="tipoReferencia"
                value={form.tipoReferencia}
                onChange={handleChange}
                required
                disabled={false}
              >
                <option value="">Seleccione tipo</option>
                <option value="Eventos">Evento</option>
                <option value="ProgramaAcademico">Programa académico</option>
              </select>
            </div>
            {form.tipoReferencia === "Eventos" && (
              <div className="form-grupo-admin">
                <label>Evento:</label>
                <select
                  name="referencia"
                  value={form.referencia}
                  onChange={handleChange}
                  required
                  disabled={false}
                >
                  <option value="">Seleccione evento</option>
                  {eventos.map(ev => (
                    <option key={ev._id} value={ev._id}>{ev.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            {form.tipoReferencia === "ProgramaAcademico" && (
              <div className="form-grupo-admin">
                <label>Programa académico:</label>
                <select
                  name="referencia"
                  value={form.referencia}
                  onChange={handleChange}
                  required
                  disabled={false}
                >
                  <option value="">Seleccione programa</option>
                  {programas.map(pr => (
                    <option key={pr._id} value={pr._id}>{pr.nombre}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="form-grupo-admin">
              <label>Categoría:</label>
              <select
                name="categoria"
                value={form.categoria}
                onChange={handleChange}
                required
                disabled={true}
              >
                <option value="">Seleccione categoría</option>
                {categorias.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                ))}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Estado:</label>
              <select name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" >
                <option value="">Seleccione estado</option>
                <option value="preinscrito">Preinscrito</option>
                <option value="matriculado">Matriculado</option>
                <option value="en_curso">En Curso</option>
                <option value="finalizado">Finalizado</option>
                <option value="certificado">Certificado</option>
                <option value="rechazada">Rechazada</option>
                <option value="cancelada">Cancelada Académico</option>
              </select>
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
            <button type="submit" className="btn-admin btn-primary">
              {modo === "crear" ? "Crear Inscripción" : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscripcionModal;