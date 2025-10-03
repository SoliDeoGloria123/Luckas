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
  edad: "25",
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

  // Obtener opciones de estado según el tipo de referencia
  const getOpcionesEstado = (tipoReferencia = form.tipoReferencia) => {
    if (tipoReferencia === 'Eventos') {
      return [
        { value: 'no inscrito', label: 'No inscrito' },
        { value: 'inscrito', label: 'Inscrito' },
        { value: 'finalizado', label: 'Finalizado' }
      ];
    } else if (tipoReferencia === 'ProgramaAcademico') {
      return [
        { value: 'preinscrito', label: 'Preinscrito' },
        { value: 'matriculado', label: 'Matriculado' },
        { value: 'en_curso', label: 'En Curso' },
        { value: 'finalizado', label: 'Finalizado' },
        { value: 'certificado', label: 'Certificado' },
        { value: 'rechazada', label: 'Rechazada' },
        { value: 'cancelada', label: 'Cancelada Académico' }
      ];
    } else {
      return [];
    }
  };

  // Buscar usuario por cédula
  const buscarUsuarioPorCedula = async (cedula) => {
    if (!cedula || cedula.length < 6) return;
    setCargandoUsuario(true);
    try {
      const usuario = await userService.getByDocumento(cedula);
      console.log('🔍 Usuario obtenido del API:', {
        _id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        numeroDocumento: usuario.numeroDocumento
      });
      setUsuarioEncontrado(usuario);
      
      // Calcular edad a partir de la fecha de nacimiento
      let edadCalculada = 25; // Edad por defecto
      if (usuario.fechaNacimiento) {
        try {
          const hoy = new Date();
          const fechaNac = new Date(usuario.fechaNacimiento);
          if (!isNaN(fechaNac.getTime())) {
            edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
              edadCalculada--;
            }
            console.log('✅ Edad calculada desde fecha nacimiento:', edadCalculada);
          }
        } catch (error) {
          console.log('❌ Error calculando edad:', error);
        }
      } else {
        console.log('⚠️ Usuario sin fecha de nacimiento, usando edad por defecto');
      }
      
      setForm(prev => ({
        ...prev,
        usuario: String(usuario._id || ""),
        nombre: String(usuario.nombre || ""),
        apellido: String(usuario.apellido || ""),
        correo: String(usuario.correo || ""),
        telefono: String(usuario.telefono || ""),
        tipoDocumento: String(usuario.tipoDocumento || ""),
        numeroDocumento: String(usuario.numeroDocumento || cedula),
        edad: String(edadCalculada)
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
      "usuario", "nombre", "apellido", "tipoDocumento", "numeroDocumento", "correo", "telefono", "categoria"
    ].includes(name)) {
      return;
    }
    
    // Si es el campo numeroDocumento, actualizar también la búsqueda de cédula
    if (name === "numeroDocumento") {
      setCedulaBusqueda(value);
      // Buscar automáticamente si tiene 6 o más caracteres
      if (value.length >= 6) {
        buscarUsuarioPorCedula(value);
      } else {
        setUsuarioEncontrado(null);
      }
    }
    if (name === "tipoReferencia") {
      // Cuando cambia el tipo de referencia, establecer un estado por defecto
      const opcionesEstado = getOpcionesEstado(value);
      // Para eventos, el estado por defecto será 'no inscrito', para programas 'preinscrito'
      let estadoDefecto = '';
      if (value === 'Eventos') {
        estadoDefecto = 'no inscrito';
      } else if (value === 'ProgramaAcademico') {
        estadoDefecto = 'preinscrito';
      } else if (opcionesEstado.length > 0) {
        estadoDefecto = opcionesEstado[0].value;
      }
      setForm({
        ...form,
        [name]: String(value),
        estado: estadoDefecto,
        referencia: "",
        categoria: ""
      });
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
                disabled={modo === "editar"}
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
                <>
                  <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', fontSize: '14px', color: '#721c24' }}>
                    ❌ Usuario no encontrado con esta cédula
                  </div>
                  <div style={{ marginTop: '5px', padding: '8px', backgroundColor: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', fontSize: '14px', color: '#856404' }}>
                    💡 Puede llenar los campos manualmente para crear una nueva inscripción
                  </div>
                </>
              )}
            </div>
            <div className="form-grupo-admin">
              <label>
                Nombre:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" disabled={modo === "editar"} />
            </div>
            <div className="form-grupo-admin">
              <label>
                Apellido:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" disabled={modo === "editar"} />
            </div>
            <div className="form-grupo-admin">
              <label>
                Tipo de Documento:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <select name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} disabled={modo === "editar"} required>
                <option value="">Seleccione tipo de documento</option>
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Número de Documento:</label>
              <input name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} placeholder="Número de Documento" disabled={modo === "editar"} required />
            </div>
            <div className="form-grupo-admin">
              <label>
                Correo:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="Correo" disabled={modo === "editar"} />
            </div>
            <div className="form-grupo-admin">
              <label>
                Teléfono:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="Teléfono" disabled={modo === "editar"} required />
            </div>
            <div className="form-grupo-admin">
              <label>Edad:</label>
              <input 
                name="edad" 
                value={form.edad} 
                onChange={handleChange} 
                placeholder="Edad" 
                type="number" 
                min="1"
                max="120"
                style={{
                  borderColor: !form.edad || parseInt(form.edad) < 1 ? '#dc3545' : '#28a745',
                  backgroundColor: !form.edad || parseInt(form.edad) < 1 ? '#f8d7da' : '#d4edda'
                }}
                title="La edad es calculada automáticamente desde la fecha de nacimiento, pero puede editarse si es necesario"
              />
              {form.edad && parseInt(form.edad) > 0 && (
                <small style={{ marginTop: '5px', fontSize: '12px', color: '#28a745', display: 'block' }}>
                  ✅ Edad válida
                </small>
              )}
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
                {getOpcionesEstado(form.tipoReferencia).map(opcion => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
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