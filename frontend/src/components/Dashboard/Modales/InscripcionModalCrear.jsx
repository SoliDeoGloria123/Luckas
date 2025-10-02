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
  edad: "0",
  tipoReferencia: "",
  referencia: "",
  categoria: "",
  estado: "preinscrito",
  observaciones: ""
};

const InscripcionModalCrear = ({ mostrar, onClose, onSubmit, eventos, programas, categorias }) => {
  console.log('🚀 COMPONENTE InscripcionModalCrear CARGADO - VERSION CON LOGS DE EDAD');
  
  const [form, setForm] = useState(defaultForm);
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  // Obtener opciones de estado según el tipo de referencia
  const getOpcionesEstado = () => {
    if (form.tipoReferencia === 'Eventos') {
      return [
        { value: 'inscrito', label: 'Inscrito' },
        { value: 'finalizado', label: 'Finalizado' }
      ];
    } else if (form.tipoReferencia === 'ProgramaAcademico') {
      return [
        { value: 'preinscrito', label: 'Preinscrito' },
        { value: 'matriculado', label: 'Matriculado' },
        { value: 'en_curso', label: 'En Curso' },
        { value: 'finalizado', label: 'Finalizado' },
        { value: 'certificado', label: 'Certificado' },
        { value: 'rechazada', label: 'Rechazada' },
        { value: 'cancelada academico', label: 'Cancelada Académico' }
      ];
    } else {
      return [];
    }
  };

  // Buscar usuario por cédula
  const buscarUsuarioPorCedula = async (cedula) => {
    console.log('🔍 INICIANDO buscarUsuarioPorCedula con:', cedula);
    if (!cedula || cedula.length < 6) {
      console.log('❌ Cédula muy corta o vacía');
      return;
    }
    setCargandoUsuario(true);
    try {
      console.log('🌐 Llamando al servicio...');
      const usuario = await userService.getByDocumento(cedula);
      console.log('✅ Usuario recibido del servicio:', usuario);
      console.log('📋 Tipo de usuario:', typeof usuario);
      console.log('🔑 Propiedades del usuario:', usuario ? Object.keys(usuario) : 'NULL');
      
      if (usuario) {
        setUsuarioEncontrado(usuario);
      } else {
        console.log('❌ Usuario es null o undefined');
        setUsuarioEncontrado(null);
      }
      
      // Calcular edad a partir de la fecha de nacimiento
      let edadCalculada = 25; // Edad por defecto si no se puede calcular
      
      console.log('Datos del usuario completo:', usuario);
      
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
            console.log('✅ Fecha nacimiento encontrada:', usuario.fechaNacimiento);
            console.log('✅ Edad calculada correctamente:', edadCalculada);
          } else {
            console.log('❌ Fecha de nacimiento inválida:', usuario.fechaNacimiento);
            edadCalculada = 25; // Fallback
          }
        } catch (error) {
          console.log('❌ Error calculando edad:', error);
          edadCalculada = 25; // Fallback
        }
      } else {
        console.log('⚠️ Usuario sin fecha de nacimiento, usando edad por defecto:', edadCalculada);
        // Verificar otras posibles propiedades de fecha
        console.log('Propiedades del usuario:', Object.keys(usuario));
      }
      
      console.log('🎯 Edad final a establecer:', edadCalculada);
      
      setForm(prev => {
        const nuevoForm = {
          ...prev,
          usuario: String(usuario._id || ""),
          nombre: String(usuario.nombre || ""),
          apellido: String(usuario.apellido || ""),
          correo: String(usuario.correo || ""),
          telefono: String(usuario.telefono || ""),
          tipoDocumento: String(usuario.tipoDocumento || ""),
          numeroDocumento: String(usuario.numeroDocumento || cedula),
          edad: String(edadCalculada)
        };
        
        console.log('Actualizando formulario con:', nuevoForm);
        return nuevoForm;
      });
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
        numeroDocumento: String(cedula),
        edad: "0"
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
    console.log('📝 handleChangeCedula - Valor ingresado:', valor);
    setCedulaBusqueda(valor);
    if (valor.length >= 6) {
      console.log('✅ Valor >= 6, llamando buscarUsuarioPorCedula');
      buscarUsuarioPorCedula(valor);
    } else {
      console.log('❌ Valor < 6, limpiando usuario');
      setUsuarioEncontrado(null);
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    
    // Si cambia el tipo de referencia, establecer el estado por defecto apropiado
    if (name === "tipoReferencia") {
      let estadoPorDefecto = "";
      if (value === "Eventos") {
        estadoPorDefecto = "inscrito"; // Estado por defecto para eventos
      } else if (value === "ProgramaAcademico") {
        estadoPorDefecto = "preinscrito"; // Estado por defecto para programas académicos
      }
      
      setForm({
        ...form,
        [name]: String(value),
        estado: estadoPorDefecto,
        referencia: "", // Limpiar referencia al cambiar tipo
        categoria: "" // Limpiar categoría al cambiar tipo
      });
      return;
    }
    
    // Si cambia el evento, y el tipoReferencia es Eventos, busca la categoría del evento seleccionado
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
    // Limpiar datos antes de enviar
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

    // Remover campos vacíos o undefined
    Object.keys(payload).forEach(key => {
      if (payload[key] === '' || payload[key] === undefined || payload[key] === null) {
        if (key !== 'observaciones') { // observaciones puede estar vacío
          delete payload[key];
        }
      }
    });

    console.log('Enviando payload limpio:', payload);
    onSubmit(payload);
    setForm(defaultForm);
    setCedulaBusqueda("");
    setUsuarioEncontrado(null);
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
          <h2>Nueva Inscripción</h2>
          <button className="modal-cerrar" onClick={onClose}>✕</button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Cédula del Usuario:</label>
              <input
                type="text"
                value={cedulaBusqueda}
                onChange={(e) => {
                  console.log('📝 Input cédula cambió:', e.target.value);
                  handleChangeCedula(e);
                }}
                onPaste={handlePasteCedula}
                placeholder="Ingrese o pegue la cédula"
                style={{ paddingRight: cargandoUsuario ? '40px' : '10px' }}
                onFocus={() => console.log('🎯 Campo cédula tiene foco')}
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
              <input 
                type="number" 
                name="edad" 
                value={form.edad || "25"} 
                onChange={handleChange} 
                placeholder="Ingrese edad" 
                min="0" 
                max="120"
                style={{ 
                  backgroundColor: usuarioEncontrado ? '#e8f5e8' : 'white',
                  border: '2px solid #ccc',
                  padding: '8px',
                  fontSize: '14px'
                }}
              />
              {usuarioEncontrado && form.edad && (
                <small style={{ color: '#28a745', fontSize: '12px', fontWeight: 'bold' }}>
                  ✓ Edad calculada automáticamente: {form.edad} años
                </small>
              )}
              {!usuarioEncontrado && (
                <small style={{ color: '#666', fontSize: '12px' }}>
                  Ingrese la edad manualmente
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
                {getOpcionesEstado().map(opcion => (
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
            <button type="submit" className="btn-admin btn-primary">Crear Inscripción</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InscripcionModalCrear;
