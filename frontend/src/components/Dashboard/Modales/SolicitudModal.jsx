import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { userService } from "../../../services/ObteneruserService";

const SolicitudModal = ({
  mostrar,
  modoEdicion,
  solicitudSeleccionada,
  setSolicitudSeleccionada,
  nuevaSolicitud,
  setNuevaSolicitud,
  onClose,
  onSubmit,
  categorias,
  eventos = [],
  cabanas = [],
  reservas = [],
  programasAcademicos = [],
  obtenerReferencias
}) => {
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  // Funciones auxiliares para reducir complejidad cognitiva
  const actualizarSolicitudConUsuario = (usuario) => {
    setNuevaSolicitud(prev => ({
      ...prev,
      solicitante: usuario._id,
      correo: usuario.correo || "",
      telefono: usuario.telefono || ""
    }));
  };

  const limpiarDatosUsuario = () => {
    setUsuarioEncontrado(null);
    setNuevaSolicitud(prev => ({
      ...prev,
      solicitante: "",
      correo: "",
      telefono: ""
    }));
  };

  const validarBusqueda = (cedula) => {
    return cedula && cedula.length >= 6 && !modoEdicion;
  };

  // Función para buscar usuario por cédula SOLO en modo creación
  const buscarUsuarioPorCedula = async (cedula) => {
    if (!validarBusqueda(cedula)) return;

    setCargandoUsuario(true);
    try {
      const usuario = await userService.getByDocumento(cedula);
      setUsuarioEncontrado(usuario);
      actualizarSolicitudConUsuario(usuario);
    } catch (error) {
      console.error('Error buscando usuario por cédula:', error);
      limpiarDatosUsuario();
    } finally {
      setCargandoUsuario(false);
    }
  };

  // Funciones auxiliares para obtener datos según el modo
  const getSolicitudData = () => ({
    data: modoEdicion ? solicitudSeleccionada : nuevaSolicitud,
    setData: modoEdicion ? setSolicitudSeleccionada : setNuevaSolicitud
  });

  const getFieldValue = (fieldName) => {
    const { data } = getSolicitudData();
    const raw = data?.[fieldName];
    // Normalizar categoría: si viene como objeto poblado devolver su id
    if (fieldName === 'categoria') {
      if (!raw && raw !== 0) return '';
      if (typeof raw === 'object') return raw._id || raw.id || '';
      return raw;
    }
    return raw || '';
  };

  const handleFieldChange = (fieldName, value) => {
    const { setData } = getSolicitudData();
    
    if (fieldName === 'modeloReferencia' && !modoEdicion) {
      // Limpiar referencia y categoría al cambiar modelo
      setData(prevData => ({ 
        ...prevData, 
        [fieldName]: value,
        referencia: '',
        categoria: ''
      }));
      // Obtener referencias según el modelo seleccionado
      if (obtenerReferencias) {
        obtenerReferencias(value);
      }
    } else if (fieldName === 'referencia' && !modoEdicion) {
      // Asignar categoría automáticamente según la referencia
      const modelo = getFieldValue('modeloReferencia');
      let referenciaSeleccionada = null;
      let categoriaAsignada = '';
      
      
      
      switch (modelo) {
        case 'Eventos':
          referenciaSeleccionada = eventos.find(item => item._id === value);
         
          categoriaAsignada = referenciaSeleccionada?.categoria?._id || referenciaSeleccionada?.categoria || '';
          break;
        case 'Cabana':
          referenciaSeleccionada = cabanas.find(item => item._id === value);
         
          categoriaAsignada = referenciaSeleccionada?.categoria?._id || referenciaSeleccionada?.categoria || '';
          break;
        case 'Reserva':
          referenciaSeleccionada = reservas.find(item => item._id === value);
          // Las reservas pueden no tener categoría directa
          categoriaAsignada = referenciaSeleccionada?.categoria?._id || referenciaSeleccionada?.categoria || '';
          break;
        case 'ProgramaAcademico':
          referenciaSeleccionada = programasAcademicos.find(item => item._id === value);
          categoriaAsignada = referenciaSeleccionada?.categoria?._id || referenciaSeleccionada?.categoria || '';
          break;
        default:
          break;
      }
      
      setData(prevData => ({ 
        ...prevData, 
        [fieldName]: value,
        categoria: categoriaAsignada
      }));
    } else {
      setData(prevData => ({ ...prevData, [fieldName]: value }));
    }
  };

  // Detectar pegado en el campo de cédula SOLO en modo creación
  const handlePasteCedula = (e) => {
    if (modoEdicion) return;
    setTimeout(() => {
      const valorPegado = e.target.value;
      setCedulaBusqueda(valorPegado);
      buscarUsuarioPorCedula(valorPegado);
    }, 10);
  };

  // Detectar cambios en el campo de cédula SOLO en modo creación
  const handleChangeCedula = (e) => {
    if (modoEdicion) return;
    const valor = e.target.value;
    setCedulaBusqueda(valor);
    if (valor.length >= 6) {
      buscarUsuarioPorCedula(valor);
    } else {
      setUsuarioEncontrado(null);
    }
  };

  // Función auxiliar para validar y cargar datos del solicitante
  const validarSolicitante = (solicitante) => {
    return solicitante && !modoEdicion && solicitante.length === 24;
  };

  const cargarDatosSolicitante = async () => {
    if (!validarSolicitante(nuevaSolicitud.solicitante)) return;

    try {
      const user = await userService.getById(nuevaSolicitud.solicitante);
      setNuevaSolicitud((prev) => ({
        ...prev,
        correo: user.correo || "",
        telefono: user.telefono || ""
      }));
    } catch (error) {
      console.error('Error cargando datos del solicitante:', error);
      setNuevaSolicitud((prev) => ({
        ...prev,
        correo: "",
        telefono: ""
      }));
    }
  };

  useEffect(() => {
    cargarDatosSolicitante();
    // eslint-disable-next-line
  }, [nuevaSolicitud.solicitante, modoEdicion]);

  // Limpiar campos cuando se cierre el modal
  useEffect(() => {
    if (!mostrar) {
      setCedulaBusqueda("");
      setUsuarioEncontrado(null);
      setCargandoUsuario(false);
    }
  }, [mostrar]);

  // Funciones auxiliares para renderizar campos
  const renderInputField = (fieldName, label, type = "text", required = false, placeholder = "", rows = 3) => {
    const idSuffix = modoEdicion ? "Edit" : "Nuevo";
    const fieldId = `${fieldName}${idSuffix}`;
    const isReadOnly = !modoEdicion && !!usuarioEncontrado && ['correo', 'telefono', 'solicitante'].includes(fieldName);

    if (type === 'textarea') {
      return (
        <div className="form-grupo-admin">
          <label htmlFor={fieldId}>{label}:</label>
          <textarea
            id={fieldId}
            value={getFieldValue(fieldName)}
            onChange={e => handleFieldChange(fieldName, e.target.value)}
            placeholder={placeholder}
            required={required}
            rows={rows}
            readOnly={isReadOnly}
          />
        </div>
      );
    }

    return (
      <div className="form-grupo-admin">
        <label htmlFor={fieldId}>{label}:</label>
        <input
          id={fieldId}
          type={type}
          value={getFieldValue(fieldName)}
          onChange={e => handleFieldChange(fieldName, e.target.value)}
          placeholder={placeholder}
          required={required}
          readOnly={isReadOnly}
          style={isReadOnly ? { backgroundColor: '#f8f9fa', cursor: 'not-allowed' } : {}}
        />
      </div>
    );
  };

  const renderSelectField = (fieldName, label, options, required = false) => {
    const idSuffix = modoEdicion ? "Edit" : "Nuevo";
    const fieldId = `${fieldName}${idSuffix}`;
    
    return (
      <div className="form-grupo-admin">
        <label htmlFor={fieldId}>{label}:</label>
        <select
          id={fieldId}
          value={getFieldValue(fieldName)}
          onChange={e => handleFieldChange(fieldName, e.target.value)}
          required={required}
        >
          <option value="">Seleccione...</option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    );
  };

  const getModeloReferenciaOptions = (tipoSolicitud) => {
    const options = [];
    if (tipoSolicitud === 'Inscripción') {
      options.push(
        { value: 'Eventos', label: 'Eventos' },
        { value: 'ProgramaAcademico', label: 'Programa Académico' }
      );
    } else if (tipoSolicitud === 'Hospedaje') {
      options.push(
        { value: 'Cabana', label: 'Cabaña' },
        { value: 'Reserva', label: 'Reservas' }
      );
    } else if (tipoSolicitud === 'Alimentación') {
      options.push({ value: 'Comedor', label: 'Comedor' });
    }
    return options;
  };

  // Función para obtener opciones de referencia según el modelo
  const getReferenciaOptions = (modelo) => {
    
    switch (modelo) {
      case 'Eventos':
      
        return (eventos || []).map(evento => ({ 
          value: evento._id, 
          label: evento.nombre || evento.titulo || `Evento ${evento._id}`
        }));
      case 'Cabana':
       
        return (cabanas || []).map(cabana => ({ 
          value: cabana._id, 
          label: cabana.nombre || `Cabaña ${cabana._id}`
        }));
      case 'Reserva':
        
        return (reservas || []).map(reserva => ({ 
          value: reserva._id, 
          label: reserva.nombre || `Reserva ${reserva._id}` // O el campo que identifique la reserva
        }));
      case 'ProgramaAcademico':
       
        return (programasAcademicos || []).map(programa => ({ 
          value: programa._id, 
          label: programa.nombre || programa.titulo || `Programa ${programa._id}`
        }));
      default:
       
        return [];
    }
  };

  const tipoSolicitudOptions = [
    { value: 'Inscripción', label: 'Inscripción' },
    { value: 'Hospedaje', label: 'Hospedaje' },
    { value: 'Otra', label: 'Otra' }
  ];



  const categoriaOptions = categorias ? categorias
    .filter(cat => String(cat.estado || '').toLowerCase() === 'activo')
    .map(cat => ({ value: cat._id, label: cat.nombre })) : [];

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
          <h2>{modoEdicion ? "Editar Solicitud" : "Crear Nueva Solicitud"}</h2>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
          <div className="from-grid-admin">
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label htmlFor="cedulaBusqueda">Cédula del Solicitante:</label>
                <input
                  id="cedulaBusqueda"
                  type="text"
                  value={cedulaBusqueda}
                  onChange={handleChangeCedula}
                  onPaste={handlePasteCedula}
                  placeholder="Ingrese o pegue la cédula del solicitante"
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
            )}
            {/* Solicitante: en modo edición mostrar nombre/ID en readonly; en creación permitir búsqueda por cédula arriba */}
            {modoEdicion ? (
              <div className="form-grupo-admin">
                <label htmlFor="solicitante">Solicitante:</label>
                <div style={{ padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '6px', border: '1px solid #e6e6e6' }}>
                  {(() => {
                    const val = getFieldValue('solicitante');
                    if (!val) return '—';
                    // Si el solicitante viene como objeto poblado, mostrar nombre y cedula/email si existen
                    if (typeof val === 'object') {
                      return `${val.nombre || val.nombreCompleto || ''}${val.apellido ? ' ' + val.apellido : ''}${val._id ? ' (' + val._id + ')' : ''}`.trim();
                    }
                    // Si es string (id), mostrar id pero intentar mantener legible
                    return String(val);
                  })()}
                </div>
              </div>
            ) : (
              renderInputField('solicitante', 'Solicitante (ID)', 'text', false, 'ID del solicitante')
            )}
          </div>
          {renderInputField('titulo', 'Título de la Solicitud', 'text', true, 'Título descriptivo de la solicitud')}
          <div className="from-grid-admin">
            {renderInputField('correo', 'Correo', 'email', true, 'correo@ejemplo.com')}
            {renderInputField('telefono', 'Teléfono', 'text', true, 'Teléfono')}
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label htmlFor={`tipoSolicitud${modoEdicion ? 'Edit' : 'Nuevo'}`}>Tipo de Solicitud:</label>
              <select
                id={`tipoSolicitud${modoEdicion ? 'Edit' : 'Nuevo'}`}
                value={getFieldValue('tipoSolicitud')}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFieldChange('tipoSolicitud', value);
                  if (!modoEdicion) {
                    handleFieldChange('modeloReferencia', '');
                  }
                }}
                required
              >
                <option value="">Seleccione...</option>
                {tipoSolicitudOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            {!modoEdicion && getFieldValue('tipoSolicitud') && (
              <div className="form-grupo-admin">
                <label htmlFor="modeloReferenciaNuevo">Modelo Referencia:</label>
                <select
                  id="modeloReferenciaNuevo"
                  value={getFieldValue('modeloReferencia')}
                  onChange={e => handleFieldChange('modeloReferencia', e.target.value)}
                  required
                >
                  <option value="">Seleccione...</option>
                  {getModeloReferenciaOptions(getFieldValue('tipoSolicitud')).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Campo de referencia dinámico */}
            {!modoEdicion && getFieldValue('modeloReferencia') && (
              <div className="form-grupo-admin">
                <label htmlFor="referenciaNuevo">Referencia:</label>
                <select
                  id="referenciaNuevo"
                  value={getFieldValue('referencia')}
                  onChange={e => handleFieldChange('referencia', e.target.value)}
                  required
                >
                  <option value="">Seleccione...</option>
                  {getReferenciaOptions(getFieldValue('modeloReferencia')).map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            )}
            
            {renderSelectField('categoria', 'Categoría', categoriaOptions, true)}

           
                     </div>
          <div className="from-grid-admin">
            {renderInputField('descripcion', 'Descripción', 'text', true, 'Descripción')}
            {renderSelectField('estado', 'Estado', [
              { value: 'Nueva', label: 'Nueva' },
              { value: 'En Revisión', label: 'Revisión' },
              { value: 'Aprobada', label: 'Aprobada' },
              { value: 'Rechazada', label: 'Rechazada' },
              { value: 'Completada', label: 'Completada' },
              { value: 'Pendiente Info', label: 'Pendiente' }
            ])}
          </div>
          <div className="from-grid-admin">
            {renderSelectField('prioridad', 'Prioridad', [
              { value: 'Alta', label: 'Alta' },
              { value: 'Media', label: 'Media' },
              { value: 'Baja', label: 'Baja' }
            ])}
            <div className="form-grupo-admin">
              <label htmlFor="responsable">Responsable:</label>
              <input
                id="responsable"
                type="text"
                value={modoEdicion ? "Se asignará automáticamente al guardar cambios" : "Se asignará automáticamente"}
                readOnly
                disabled
                placeholder="Se asigna automáticamente"
                style={{ backgroundColor: '#f5f5f5', color: '#666' }}
              />
              <small style={{ color: '#666', fontSize: '12px' }}>
                El responsable se asigna automáticamente al usuario que modifica la solicitud
              </small>
            </div>
          </div>
          {renderInputField('observaciones', 'Observaciones', 'textarea', false, 'Observaciones')}
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" type="button" onClick={onClose}>
              <i className="fas fa-times"></i> {' '}
              Cancelar
            </button>
            <button className="btn-admin btn-primary" type="submit">
              <i className="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

SolicitudModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  solicitudSeleccionada: PropTypes.shape({
    solicitante: PropTypes.string,
    titulo: PropTypes.string,
    correo: PropTypes.string,
    telefono: PropTypes.string,
    tipoSolicitud: PropTypes.string,
    categoria: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.string,
    prioridad: PropTypes.string,
    observaciones: PropTypes.string
  }),
  setSolicitudSeleccionada: PropTypes.func,
  nuevaSolicitud: PropTypes.shape({
    solicitante: PropTypes.string,
    titulo: PropTypes.string,
    correo: PropTypes.string,
    telefono: PropTypes.string,
    tipoSolicitud: PropTypes.string,
    modeloReferencia: PropTypes.string,
    categoria: PropTypes.string,
    descripcion: PropTypes.string,
    estado: PropTypes.string,
    prioridad: PropTypes.string,
    observaciones: PropTypes.string
  }).isRequired,
  setNuevaSolicitud: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  categorias: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string
  })).isRequired,
  eventos: PropTypes.arrayOf(PropTypes.object),
  cabanas: PropTypes.arrayOf(PropTypes.object),
  reservas: PropTypes.arrayOf(PropTypes.object),
  programasAcademicos: PropTypes.arrayOf(PropTypes.object),
  obtenerReferencias: PropTypes.func
};

export default SolicitudModal;