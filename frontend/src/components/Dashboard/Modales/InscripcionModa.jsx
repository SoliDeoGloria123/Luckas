import React, { useState, useEffect } from "react";
import { userService } from "../../../services/ObteneruserService";
import PropTypes from 'prop-types';

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
      let edadCalculada = ""; // Edad vacía por defecto
      if (usuario.fechaNacimiento) {
        try {
          const hoy = new Date();
          const fechaNac = new Date(usuario.fechaNacimiento);
          if (!Number.isNaN(fechaNac.getTime())) {
            edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
            const mes = hoy.getMonth() - fechaNac.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
              edadCalculada--;
            }
            console.log('✅ Edad calculada desde fecha nacimiento:', edadCalculada);
          }
        } catch (error) {
          console.log('❌ Error calculando edad:', error);
          edadCalculada = ""; // Mantener vacío si hay error
        }
      } else {
        console.log('⚠️ Usuario sin fecha de nacimiento, edad vacía');
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
      console.error('Error al buscar usuario por cédula:', error);
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

  // Funciones auxiliares para reducir complejidad cognitiva
  const handleNumeroDocumentoChange = (value) => {
    setCedulaBusqueda(value);
    if (value.length >= 6) {
      buscarUsuarioPorCedula(value);
    } else {
      setUsuarioEncontrado(null);
    }
  };

  const getEstadoDefecto = (tipoReferencia) => {
    if (tipoReferencia === 'Eventos') return 'no inscrito';
    if (tipoReferencia === 'ProgramaAcademico') return 'preinscrito';
    const opcionesEstado = getOpcionesEstado(tipoReferencia);
    return opcionesEstado.length > 0 ? opcionesEstado[0].value : '';
  };

  const handleTipoReferenciaChange = (value) => {
    const estadoDefecto = getEstadoDefecto(value);
    setForm({
      ...form,
      tipoReferencia: String(value),
      estado: estadoDefecto,
      referencia: "",
      categoria: ""
    });
  };

  const handleReferenciaChange = (name, value) => {
    if (form.tipoReferencia === "Eventos") {
      const evento = eventos.find(ev => String(ev._id) === String(value) && ev.categoria);
      if (evento) {
        setForm({
          ...form,
          [name]: String(value),
          categoria: String(evento.categoria._id || evento.categoria)
        });
        return true;
      }
    } else if (form.tipoReferencia === "ProgramaAcademico") {
      const programa = programas.find(pr => String(pr._id) === String(value) && pr.categoria);
      if (programa) {
        setForm({
          ...form,
          [name]: String(value),
          categoria: String(programa.categoria._id || programa.categoria)
        });
        return true;
      }
    }
    return false;
  };

  const handleChange = e => {
    const { name, value } = e.target;

    // En modo editar, no permitir modificar campos personales
    if (modo === "editar" && [
      "usuario", "nombre", "apellido", "tipoDocumento", "numeroDocumento", "correo", "telefono", "categoria"
    ].includes(name)) {
      return;
    }

    // Manejar casos especiales
    if (name === "numeroDocumento") {
      handleNumeroDocumentoChange(value);
    } else if (name === "tipoReferencia") {
      handleTipoReferenciaChange(value);
      return;
    } else if (name === "referencia") {
      if (handleReferenciaChange(name, value)) {
        return;
      }
    }

    // Actualización general del formulario
    setForm({ ...form, [name]: String(value) });
  };

  // Funci\u00f3n para validar si la edad coincide con la fecha de nacimiento
  const validarEdad = () => {
    // Si no hay usuario encontrado o no hay fecha de nacimiento, no validar
    if (!usuarioEncontrado || !usuarioEncontrado.fechaNacimiento) {
      return { esValida: true, esVacia: !form.edad };
    }
    
    // Si el campo est\u00e1 vac\u00edo, no es error
    if (!form.edad) {
      return { esValida: true, esVacia: true };
    }
    
    try {
      const hoy = new Date();
      const fechaNac = new Date(usuarioEncontrado.fechaNacimiento);
      
      if (Number.isNaN(fechaNac.getTime())) {
        return { esValida: true, esVacia: false };
      }
      
      let edadCalculada = hoy.getFullYear() - fechaNac.getFullYear();
      const mes = hoy.getMonth() - fechaNac.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edadCalculada--;
      }
      
      const edadIngresada = Number.parseInt(form.edad);
      const diferencia = Math.abs(edadCalculada - edadIngresada);
      
      // Permitir una diferencia de +/- 1 a\u00f1o
      return { 
        esValida: diferencia <= 1, 
        esVacia: false,
        edadCalculada,
        edadIngresada
      };
    } catch (error) {
      console.error('Error validando edad:', error);
      return { esValida: true, esVacia: false };
    }
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
      edad: Number.parseInt(form.edad) || 0,
      tipoReferencia: form.tipoReferencia,
      referencia: form.referencia,
      categoria: form.categoria,
      estado: form.estado || 'pendiente',
      observaciones: form.observaciones || ''
    };
    for (const key of Object.keys(payload)) {
      if (payload[key] === '' || payload[key] === undefined || payload[key] === null) {
        if (key !== 'observaciones') {
          delete payload[key];
        }
      }
    }
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
              <label htmlFor="cedula-usuario">Cédula del Usuario:</label>
              <input
                id="cedula-usuario"
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
              <label htmlFor="nombre-usuario">
                Nombre:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input id="nombre-usuario" name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" disabled={modo === "editar"} />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="apellido-usuario">
                Apellido:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input id="apellido-usuario" name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" disabled={modo === "editar"} />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="tipo-documento">
                Tipo de Documento:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <select id="tipo-documento" name="tipoDocumento" value={form.tipoDocumento} onChange={handleChange} disabled={modo === "editar"} required>
                <option value="">Seleccione tipo de documento</option>
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="numero-documento">Número de Documento:</label>
              <input id="numero-documento" name="numeroDocumento" value={form.numeroDocumento} onChange={handleChange} placeholder="Número de Documento" disabled={modo === "editar"} required />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="correo-usuario">
                Correo:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input id="correo-usuario" name="correo" type="email" value={form.correo} onChange={handleChange} placeholder="Correo" disabled={modo === "editar"} />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="telefono-usuario">
                Teléfono:
                {modo === "crear" && !usuarioEncontrado && cedulaBusqueda && (
                  <span style={{ color: '#28a745', fontSize: '11px', marginLeft: '5px' }}>✏️ Manual</span>
                )}
              </label>
              <input id="telefono-usuario" name="telefono" type="tel" value={form.telefono} onChange={handleChange} placeholder="Teléfono" disabled={modo === "editar"} required />
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="edad-usuario">Edad:</label>
              <input
                id="edad-usuario"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                placeholder="Edad"
                type="number"
                min="1"
                max="120"
                style={{
                  borderColor: validarEdad().esValida ? '#ced4da' : '#dc3545',
                  backgroundColor: validarEdad().esValida ? '#ffffff' : '#f8d7da'
                }}
                title="La edad es calculada automáticamente desde la fecha de nacimiento, pero puede editarse si es necesario"
              />
              {(() => {
                const validacion = validarEdad();
                if (validacion.esVacia) {
                  return null;
                }
                if (validacion.esValida) {
                  return (
                    <small style={{ marginTop: '5px', fontSize: '12px', color: '#28a745', display: 'block' }}>
                      ✅ Edad válida
                    </small>
                  );
                } else {
                  return (
                    <small style={{ marginTop: '5px', fontSize: '12px', color: '#dc3545', display: 'block' }}>
                      ⚠️ La edad no coincide con la fecha de nacimiento (edad calculada: {validacion.edadCalculada})
                    </small>
                  );
                }
              })()}
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="tipo-referencia">Tipo de inscripción:</label>
              <select
                id="tipo-referencia"
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
                <label htmlFor="evento-referencia">Evento:</label>
                <select
                  id="evento-referencia"
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
                <label htmlFor="programa-referencia">Programa académico:</label>
                <select
                  id="programa-referencia"
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
              <label htmlFor="categoria-referencia">Categoría:</label>
              <select
                id="categoria-referencia"
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
              <label htmlFor="estado-referencia">Estado:</label>
              <select id="estado-referencia" name="estado" value={form.estado} onChange={handleChange} placeholder="Estado" >
                <option value="">Seleccione estado</option>
                {getOpcionesEstado(form.tipoReferencia).map(opcion => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label htmlFor="observaciones-referencia">Observaciones:</label>
              <input id="observaciones-referencia" name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="Observaciones" />
            </div>
          </div>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" type="button" onClick={onClose}>
              <i className="fas fa-times"></i>{" "}
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
InscripcionModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  eventos: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string,
    categoria: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ _id: PropTypes.string })
    ])
  })).isRequired,
  programas: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string,
    categoria: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ _id: PropTypes.string })
    ])
  })).isRequired,
  categorias: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string
  })).isRequired,
  modo: PropTypes.string,
  inscripcion: PropTypes.shape({
    usuario: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        nombre: PropTypes.string,
        apellido: PropTypes.string,
        correo: PropTypes.string,
        tipoDocumento: PropTypes.string,
        numeroDocumento: PropTypes.string,
        telefono: PropTypes.string,
        fechaNacimiento: PropTypes.string
      })
    ]),
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    tipoDocumento: PropTypes.string,
    numeroDocumento: PropTypes.string,
    correo: PropTypes.string,
    telefono: PropTypes.string,
    edad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tipoReferencia: PropTypes.string,
    referencia: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ _id: PropTypes.string })
    ]),
    categoria: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({ _id: PropTypes.string })
    ]),
    estado: PropTypes.string,
    observaciones: PropTypes.string
  })
};


export default InscripcionModal;