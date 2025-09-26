import React, { useEffect, useState } from "react";
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
  categorias
}) => {
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  // Función para buscar usuario por cédula
  const buscarUsuarioPorCedula = async (cedula) => {
    if (!cedula || cedula.length < 6) return;

    setCargandoUsuario(true);
    try {
      const usuario = await userService.getByDocumento(cedula);
      setUsuarioEncontrado(usuario);

      // Llenar automáticamente los campos del formulario
      setNuevaSolicitud(prev => ({
        ...prev,
        solicitante: usuario._id,
        correo: usuario.correo || "",
        telefono: usuario.telefono || ""
      }));
    } catch (error) {
      console.error("Usuario no encontrado:", error);
      setUsuarioEncontrado(null);
      // Limpiar los campos si no se encuentra el usuario
      setNuevaSolicitud(prev => ({
        ...prev,
        solicitante: "",
        correo: "",
        telefono: ""
      }));
    } finally {
      setCargandoUsuario(false);
    }
  };

  // Detectar pegado en el campo de cédula
  const handlePasteCedula = (e) => {
    setTimeout(() => {
      const valorPegado = e.target.value;
      setCedulaBusqueda(valorPegado);
      buscarUsuarioPorCedula(valorPegado);
    }, 10);
  };

  // Detectar cambios en el campo de cédula
  const handleChangeCedula = (e) => {
    const valor = e.target.value;
    setCedulaBusqueda(valor);

    // Buscar automáticamente cuando se escriban más de 6 caracteres
    if (valor.length >= 6) {
      buscarUsuarioPorCedula(valor);
    } else {
      setUsuarioEncontrado(null);
    }
  };

  // PRIMERO EL useEffect
  useEffect(() => {
    const cargarDatosSolicitante = async () => {
      if (
        nuevaSolicitud.solicitante &&
        !modoEdicion &&
        nuevaSolicitud.solicitante.length === 24
      ) {
        try {
          const user = await userService.getById(nuevaSolicitud.solicitante);
          setNuevaSolicitud((prev) => ({
            ...prev,
            correo: user.correo || "",
            telefono: user.telefono || ""
          }));
        } catch (error) {
          setNuevaSolicitud((prev) => ({
            ...prev,
            correo: "",
            telefono: ""
          }));
        }
      }
    };
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
        <form className="modal-body-admin">
          <div className="from-grid-admin">
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Cédula del Solicitante:</label>
                  <input
                    type="text"
                    value={cedulaBusqueda}
                    onChange={handleChangeCedula}
                    onPaste={handlePasteCedula}
                    placeholder="Ingrese o pegue la cédula del solicitante"
                    style={{
                      paddingRight: cargandoUsuario ? '40px' : '10px'
                    }}
                  />
                  {cargandoUsuario && (
                    <div style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      🔄
                    </div>
                  )}
              
                {usuarioEncontrado && (
                  <div style={{
                    marginTop: '5px',
                    padding: '8px',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#155724'
                  }}>
                    ✅ Usuario encontrado: {usuarioEncontrado.nombre} {usuarioEncontrado.apellido} - {usuarioEncontrado.correo}
                  </div>
                )}
                {cedulaBusqueda && !usuarioEncontrado && !cargandoUsuario && (
                  <div style={{
                    marginTop: '5px',
                    padding: '8px',
                    backgroundColor: '#f8d7da',
                    border: '1px solid #f5c6cb',
                    borderRadius: '4px',
                    fontSize: '14px',
                    color: '#721c24'
                  }}>
                    ❌ Usuario no encontrado con esta cédula
                  </div>
                )}
              </div>
            )}
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Solicitante (ID):</label>
                <input
                  type="text"
                  value={nuevaSolicitud.solicitante}
                  onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, solicitante: e.target.value })}
                  placeholder="ID del solicitante (se llena automáticamente)"
                  readOnly={usuarioEncontrado ? true : false}
                  style={{
                    backgroundColor: usuarioEncontrado ? '#f8f9fa' : 'white',
                    cursor: usuarioEncontrado ? 'not-allowed' : 'text'
                  }}
                />
              </div>
            )}
        
          </div>
          <div className="from-grid-admin">
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Correo:</label>
                <input
                  type="email"
                  value={nuevaSolicitud.correo}
                  onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, correo: e.target.value })}
                  placeholder="correo@ejemplo.com"
                  readOnly={usuarioEncontrado ? true : false}
                  style={{
                    backgroundColor: usuarioEncontrado ? '#f8f9fa' : 'white',
                    cursor: usuarioEncontrado ? 'not-allowed' : 'text'
                  }}
                  required
                />
              </div>
            )}
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Teléfono:</label>
                <input
                  type="text"
                  value={nuevaSolicitud.telefono}
                  onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, telefono: e.target.value })}
                  placeholder="Teléfono"
                  readOnly={usuarioEncontrado ? true : false}
                  style={{
                    backgroundColor: usuarioEncontrado ? '#f8f9fa' : 'white',
                    cursor: usuarioEncontrado ? 'not-allowed' : 'text'
                  }}
                  required
                />
              </div>
            )}
           
          </div>
          <div className="from-grid-admin">
             {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Tipo de Solicitud:</label>
                <select
                  value={nuevaSolicitud.tipoSolicitud}
                  onChange={e =>
                    setNuevaSolicitud({ ...nuevaSolicitud, tipoSolicitud: e.target.value, modeloReferencia: '' })
                  }
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Inscripción">Inscripción</option>
                  <option value="Hospedaje">Hospedaje</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>
            )}
            {/* Select de modeloReferencia dinámico */}
            {!modoEdicion && nuevaSolicitud.tipoSolicitud && (
              <div className="form-grupo-admin">
                <label>Modelo Referencia:</label>
                <select
                  value={nuevaSolicitud.modeloReferencia || ''}
                  onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, modeloReferencia: e.target.value })}
                  required
                >
                  <option value="">Seleccione...</option>
                  {nuevaSolicitud.tipoSolicitud === 'Inscripción' && (
                    <option value="Eventos">Eventos</option>
                  )}
                  {nuevaSolicitud.tipoSolicitud === 'Inscripción' && (
                    <option value="Curso">Curso</option>
                  )}
                  {nuevaSolicitud.tipoSolicitud === 'Inscripción' && (
                    <option value="ProgramaTecnico">Programa Tecnico </option>
                  )}
                  {nuevaSolicitud.tipoSolicitud === 'Hospedaje' && (
                    <option value="Cabana">Cabaña</option>
                  )}
                  {nuevaSolicitud.tipoSolicitud === 'Hospedaje' && (
                    <option value="Reserva">Rervas</option>
                  )}
                  {nuevaSolicitud.tipoSolicitud === 'Alimentación' && (
                    <option value="Comedor">Comedor</option>
                  )}

                </select>
              </div>
            )}
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Categoría:</label>
                <select
                  value={nuevaSolicitud.categoria}
                  onChange={e =>
                    setNuevaSolicitud({ ...nuevaSolicitud, categoria: e.target.value })
                  }
                  required
                >
                  <option value="">Seleccione...</option>
                  {categorias && categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <div className="from-grid-admin">
            {!modoEdicion && (
              <div className="form-grupo-admin">
                <label>Categoría:</label>
                <input
                  type="text"
                  value={nuevaSolicitud.descripcion}
                  onChange={e =>

                    setNuevaSolicitud({ ...nuevaSolicitud, descripcion: e.target.value })
                  }
                  placeholder="Descripción"
                  required
                />
              </div>
            )}
            <div className="form-grupo-admin">
              <label>Estado:</label>
              <select
                value={modoEdicion ? solicitudSeleccionada?.estado : nuevaSolicitud.estado}
                onChange={e =>
                  modoEdicion
                    ? setSolicitudSeleccionada({ ...solicitudSeleccionada, estado: e.target.value })
                    : setNuevaSolicitud({ ...nuevaSolicitud, estado: e.target.value })
                }
              >
                <option value="Nueva">Nueva</option>
                <option value="En Revisión">Revisión</option>
                <option value="Aprobada">Aprobada</option>
                <option value="Rechazada">Rechazada</option>
                <option value="Completada">Completada</option>
                <option value="Pendiente Info">Pendiente</option>
              </select>
            </div>
          </div>
          <div className="from-grid-admin">
            <div className="form-grupo-admin">
              <label>Prioridad:</label>
              <select
                value={modoEdicion ? solicitudSeleccionada?.prioridad : nuevaSolicitud.prioridad}
                onChange={e =>
                  modoEdicion
                    ? setSolicitudSeleccionada({ ...solicitudSeleccionada, prioridad: e.target.value })
                    : setNuevaSolicitud({ ...nuevaSolicitud, prioridad: e.target.value })
                }
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Responsable:</label>
              <input
                type="text"
                value={modoEdicion
                  ? (typeof solicitudSeleccionada?.responsable === 'object'
                    ? (solicitudSeleccionada.responsable?.nombre || solicitudSeleccionada.responsable?.username || solicitudSeleccionada.responsable?.correo || solicitudSeleccionada.responsable?._id || '')
                    : (solicitudSeleccionada?.responsable || ''))
                  : nuevaSolicitud.responsable}
                onChange={e =>
                  modoEdicion
                    ? setSolicitudSeleccionada({ ...solicitudSeleccionada, responsable: e.target.value })
                    : setNuevaSolicitud({ ...nuevaSolicitud, responsable: e.target.value })
                }
                placeholder="Responsable"
              />
            </div>
          </div>
          <div className="form-grupo-admin">
            <label>Observaciones:</label>
            <input
              type="text"
              value={modoEdicion ? solicitudSeleccionada?.observaciones : nuevaSolicitud.observaciones}
              onChange={e =>
                modoEdicion
                  ? setSolicitudSeleccionada({ ...solicitudSeleccionada, observaciones: e.target.value })
                  : setNuevaSolicitud({ ...nuevaSolicitud, observaciones: e.target.value })
              }
              placeholder="Observaciones"
            />
          </div>
          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>
              <i class="fas fa-times"></i>
              Cancelar
            </button>
            <button className="btn-admin btn-primary" onClick={onSubmit}>
              <i class="fas fa-save"></i>
              {modoEdicion ? "Guardar Cambios" : "Crear Solicitud"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolicitudModal;