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
  categorias
}) => {
  const [cedulaBusqueda, setCedulaBusqueda] = useState("");
  const [cargandoUsuario, setCargandoUsuario] = useState(false);
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  // Función para buscar usuario por cédula SOLO en modo creación
  const buscarUsuarioPorCedula = async (cedula) => {
    if (!cedula || cedula.length < 6 || modoEdicion) return;

    setCargandoUsuario(true);
    try {
      const usuario = await userService.getByDocumento(cedula);
      setUsuarioEncontrado(usuario);
      setNuevaSolicitud(prev => ({
        ...prev,
        solicitante: usuario._id,
        correo: usuario.correo || "",
        telefono: usuario.telefono || ""
      }));
    } catch (error) {
      setUsuarioEncontrado(null);
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
        <form className="modal-body-admin" onSubmit={e => { e.preventDefault(); onSubmit(); }}>
          <div className="from-grid-admin">
            {!modoEdicion ? (
              <>
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
                <div className="form-grupo-admin">
                  <label htmlFor="solicitanteNuevo">Solicitante (ID):</label>
                  <input
                    id="solicitanteNuevo"
                    type="text"
                    value={nuevaSolicitud.solicitante}
                    onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, solicitante: e.target.value })}
                    placeholder="ID del solicitante (se llena automáticamente)"
                    readOnly={usuarioEncontrado ? true : false}
                    style={{ backgroundColor: usuarioEncontrado ? '#f8f9fa' : 'white', cursor: usuarioEncontrado ? 'not-allowed' : 'text' }}
                  />
                </div>
                <div className="form-grupo-admin">
                  <label htmlFor="tituloNuevo">Título de la Solicitud:</label>
                  <input
                    id="tituloNuevo"
                    type="text"
                    value={nuevaSolicitud.titulo}
                    onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, titulo: e.target.value })}
                    placeholder="Título descriptivo de la solicitud"
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-grupo-admin">
                  <label htmlFor="solicitanteEdit">Solicitante (ID):</label>
                  <input
                    id="solicitanteEdit"
                    type="text"
                    value={solicitudSeleccionada?.solicitante || ''}
                    onChange={e => setSolicitudSeleccionada({ ...solicitudSeleccionada, solicitante: e.target.value })}
                    placeholder="ID del solicitante"
                  />
                </div>
                <div className="form-grupo-admin">
                  <label htmlFor="tituloEdit">Título de la Solicitud:</label>
                  <input
                    id="tituloEdit"
                    type="text"
                    value={solicitudSeleccionada?.titulo || ''}
                    onChange={e => setSolicitudSeleccionada({ ...solicitudSeleccionada, titulo: e.target.value })}
                    placeholder="Título descriptivo de la solicitud"
                    required
                  />
                </div>
              </>
            )}
          </div>
          <div className="from-grid-admin">
            {!modoEdicion ? (
              <>
                <div className="form-grupo-admin">
                  <label htmlFor="correoNuevo">Correo:</label>
                  <input
                    id="correoNuevo"
                    type="email"
                    value={nuevaSolicitud.correo}
                    onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, correo: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    readOnly={usuarioEncontrado ? true : false}
                    style={{ backgroundColor: usuarioEncontrado ? '#f8f9fa' : 'white', cursor: usuarioEncontrado ? 'not-allowed' : 'text' }}
                    required
                  />
                </div>
                <div className="form-grupo-admin">
                  <label htmlFor="telefonoNuevo">Teléfono:</label>
                  <input
                    id="telefonoNuevo"
                    type="text"
                    value={nuevaSolicitud.telefono}
                    onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, telefono: e.target.value })}
                    placeholder="Teléfono"
                    readOnly={usuarioEncontrado ? true : false}
                    style={{ backgroundColor: usuarioEncontrado ? '#f8f9fa' : 'white', cursor: usuarioEncontrado ? 'not-allowed' : 'text' }}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div className="form-grupo-admin">
                  <label htmlFor="correoEdit">Correo:</label>
                  <input
                    id="correoEdit"
                    type="email"
                    value={solicitudSeleccionada?.correo || ''}
                    onChange={e => setSolicitudSeleccionada({ ...solicitudSeleccionada, correo: e.target.value })}
                    placeholder="correo@ejemplo.com"
                    required
                  />
                </div>
                <div className="form-grupo-admin">
                  <label htmlFor="telefonoEdit">Teléfono:</label>
                  <input
                    id="telefonoEdit"
                    type="text"
                    value={solicitudSeleccionada?.telefono || ''}
                    onChange={e => setSolicitudSeleccionada({ ...solicitudSeleccionada, telefono: e.target.value })}
                    placeholder="Teléfono"
                    required
                  />
                </div>
              </>
            )}
          </div>
          <div className="from-grid-admin">
            {!modoEdicion ? (
              <>
                <div className="form-grupo-admin">
                  <label htmlFor="tipoSolicitudNuevo">Tipo de Solicitud:</label>
                  <select
                    id="tipoSolicitudNuevo"
                    value={nuevaSolicitud.tipoSolicitud}
                    onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, tipoSolicitud: e.target.value, modeloReferencia: '' })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Inscripción">Inscripción</option>
                    <option value="Hospedaje">Hospedaje</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                {nuevaSolicitud.tipoSolicitud && (
                  <div className="form-grupo-admin">
                    <label htmlFor="modeloReferenciaNuevo">Modelo Referencia:</label>
                    <select
                      id="modeloReferenciaNuevo"
                      value={nuevaSolicitud.modeloReferencia || ''}
                      onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, modeloReferencia: e.target.value })}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {nuevaSolicitud.tipoSolicitud === 'Inscripción' && <option value="Eventos">Eventos</option>}

                      {nuevaSolicitud.tipoSolicitud === 'Inscripción' && <option value="ProgramaTecnico">Programa Tecnico </option>}
                      {nuevaSolicitud.tipoSolicitud === 'Hospedaje' && <option value="Cabana">Cabaña</option>}
                      {nuevaSolicitud.tipoSolicitud === 'Hospedaje' && <option value="Reserva">Reservas</option>}
                      {nuevaSolicitud.tipoSolicitud === 'Alimentación' && <option value="Comedor">Comedor</option>}
                    </select>
                  </div>
                )}
                <div className="form-grupo-admin">
                  <label htmlFor="categoriaNuevo">Categoría:</label>
                  <select
                    id="categoriaNuevo"
                    value={nuevaSolicitud.categoria}
                    onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, categoria: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {categorias && categorias.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="form-grupo-admin">
                  <label htmlFor="tipoSolicitudEdit">Tipo de Solicitud:</label>
                  <select
                    id="tipoSolicitudEdit"
                    value={solicitudSeleccionada?.tipoSolicitud || ''}
                    onChange={e => setSolicitudSeleccionada({ ...solicitudSeleccionada, tipoSolicitud: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    <option value="Inscripción">Inscripción</option>
                    <option value="Hospedaje">Hospedaje</option>
                    <option value="Alimentación">Alimentación</option>
                    <option value="Otra">Otra</option>
                  </select>
                </div>
                <div className="form-grupo-admin">
                  <label htmlFor="categoriaEdit">Categoría:</label>
                  <select
                    id="categoriaEdit"
                    value={solicitudSeleccionada?.categoria || ''}
                    onChange={e => setSolicitudSeleccionada({ ...solicitudSeleccionada, categoria: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {categorias && categorias.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="from-grid-admin">
            {!modoEdicion ? (
              <div className="form-grupo-admin">
                <label htmlFor="descripcionNuevo">Descripción:</label>
                <input
                  id="descripcionNuevo"
                  type="text"
                  value={nuevaSolicitud.descripcion}
                  onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, descripcion: e.target.value })}
                  placeholder="Descripción"
                  required
                />
              </div>
            ) : (
              <div className="form-grupo-admin">
                <label htmlFor="descripcionEdit">Descripción:</label>
                <input
                  id="descripcionEdit"
                  type="text"
                  value={solicitudSeleccionada?.descripcion || ''}
                  onChange={e => setSolicitudSeleccionada({ ...solicitudSeleccionada, descripcion: e.target.value })}
                  placeholder="Descripción"
                  required
                />
              </div>
            )}
            <div className="form-grupo-admin">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                value={modoEdicion ? solicitudSeleccionada?.estado : nuevaSolicitud.estado}
                onChange={e => modoEdicion ? setSolicitudSeleccionada({ ...solicitudSeleccionada, estado: e.target.value }) : setNuevaSolicitud({ ...nuevaSolicitud, estado: e.target.value })}
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
              <label htmlFor="prioridad">Prioridad:</label>
              <select
                id="prioridad"
                value={modoEdicion ? solicitudSeleccionada?.prioridad : nuevaSolicitud.prioridad}
                onChange={e => modoEdicion ? setSolicitudSeleccionada({ ...solicitudSeleccionada, prioridad: e.target.value }) : setNuevaSolicitud({ ...nuevaSolicitud, prioridad: e.target.value })}
              >
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>
            </div>
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
          <div className="form-grupo-admin">
            <label htmlFor="observaciones">Observaciones:</label>
            <input
              id="observaciones"
              type="text"
              value={modoEdicion ? solicitudSeleccionada?.observaciones : nuevaSolicitud.observaciones}
              onChange={e => modoEdicion ? setSolicitudSeleccionada({ ...solicitudSeleccionada, observaciones: e.target.value }) : setNuevaSolicitud({ ...nuevaSolicitud, observaciones: e.target.value })}
              placeholder="Observaciones"
            />
          </div>
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
  })).isRequired
};

export default SolicitudModal;