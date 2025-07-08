import React, { useEffect } from "react";
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
  if (!mostrar) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Solicitud" : "Crear Nueva Solicitud"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          {!modoEdicion && (
            <div className="form-grupo">
              <label>Solicitante (ID):</label>
              <input
                type="text"
                value={nuevaSolicitud.solicitante}
                onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, solicitante: e.target.value })}
                placeholder="ID del solicitante"
                required
              />
            </div>
          )}
          {!modoEdicion && (
            <div className="form-grupo">
              <label>Correo:</label>
              <input
                type="correo"
                value={nuevaSolicitud.correo}
                onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, correo: e.target.value })}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>
          )}
          {!modoEdicion && (
          <div className="form-grupo">
            <label>Teléfono:</label>
            <input
              type="text"
              value={nuevaSolicitud.telefono}
              onChange={e => setNuevaSolicitud({ ...nuevaSolicitud, telefono: e.target.value })}
              readOnly
              placeholder="Teléfono"
              required
            />
          </div>
          )}
          {!modoEdicion && (
          <div className="form-grupo">
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
            <div className="form-grupo">
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
          <div className="form-grupo">
            <label>Categoría:</label>
            <select
              value={ nuevaSolicitud.categoria}
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
          {!modoEdicion && (
          <div className="form-grupo">
            <label>Descripción:</label>
            <input
              type="text"
              value={ nuevaSolicitud.descripcion}
              onChange={e =>

                  setNuevaSolicitud({...nuevaSolicitud, descripcion: e.target.value })
              }
              placeholder="Descripción"
              required
            />
          </div>
          )}
          <div className="form-grupo">
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
          <div className="form-grupo">
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
          <div className="form-grupo">
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
          <div className="form-grupo">
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
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Solicitud"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolicitudModal;