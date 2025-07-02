import React from "react";


const EventoModal = ({
  mostrar,
  modoEdicion,
  eventoSeleccionado,
  setEventoSeleccionado,
  nuevoEvento,
  setNuevoEvento,
  categorias,
  onClose,
  onSubmit
}) => {
  if (!mostrar) return null;
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Evento" : "Nueva Evento"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-body">
          <div className="form-grupo">
            <label>Nombre Evento:</label>
            <input
              type="text"
              value={modoEdicion ? eventoSeleccionado?.nombre : nuevoEvento.nombre}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, nombre: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, nombre: e.target.value })
              }
              placeholder="Nombre del Evento"
            />
          </div>

          {!modoEdicion && (
            <div className="form-grupo">
              <label>Descripcion Evento:</label>
              <input
                type="text"
                value={nuevoEvento.descripcion}
                onChange={e => setNuevoEvento({ ...nuevoEvento, descripcion: e.target.value })
                }
                placeholder="Nombre del Evento"
              />
            </div>
          )}
          <div className="form-grupo">
            <label>Precio Evento:</label>
            <input
              type="number"
              value={modoEdicion ? eventoSeleccionado?.precio : nuevoEvento.precio}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, precio: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, precio: e.target.value })
              }
              placeholder="Nombre del Evento"
            />
          </div>
          <div className="form-grupo">
            <label>Categoría:</label>
            <select
              value={modoEdicion ? eventoSeleccionado?.categoria : nuevoEvento.categoria}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, categoria: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, categoria: e.target.value })
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
          {!modoEdicion && (
            <div className="form-grupo">
              <label>Etiquetas Evento:</label>
              <input
                type="text"
                value={nuevoEvento.etiquetas}
                onChange={e =>
                  setNuevoEvento({ ...nuevoEvento, etiquetas: e.target.value })
                }
                placeholder="Nombre del Evento"
              />
            </div>
          )}
          <div className="form-grupo">
            <label>Fecha del Evento:</label>
            <input
              type="date"
              value={modoEdicion ? eventoSeleccionado?.fechaEvento : nuevoEvento.fechaEvento}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, fechaEvento: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, fechaEvento: e.target.value })
              }
            />
          </div>
          <div className="form-grupo">
            <label>Hora de Inicio:</label>
            <input
              type="time"
              value={modoEdicion ? eventoSeleccionado?.horaInicio : nuevoEvento.horaInicio}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, horaInicio: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, horaInicio: e.target.value })
              }
            />
          </div>

          <div className="form-grupo">
            <label>Hora de Fin:</label>
            <input
              type="time"
              value={modoEdicion ? eventoSeleccionado?.horaFin : nuevoEvento.horaFin}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, horaFin: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, horaFin: e.target.value })
              }
            />
          </div>

          <div className="form-grupo">
            <label>Lugar:</label>
            <input
              type="text"
              value={modoEdicion ? eventoSeleccionado?.lugar : nuevoEvento.lugar}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, lugar: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, lugar: e.target.value })
              }
              placeholder="Ej: Auditorio Principal"
            />
          </div>
          {!modoEdicion && (
            <div className="form-grupo">
              <label>Dirección:</label>
              <input
                type="text"
                value={nuevoEvento.direccion}
                onChange={e =>
                  setNuevoEvento({ ...nuevoEvento, direccion: e.target.value })
                }
                placeholder="Ej: Carrera 45 #50-12, Bogotá"
              />
            </div>
          )}
          <div className="form-grupo">
            <label>Cupos Totales:</label>
            <input
              type="number"
              value={modoEdicion ? eventoSeleccionado?.cuposTotales : nuevoEvento.cuposTotales}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, cuposTotales: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, cuposTotales: e.target.value })
              }
            />
          </div>

          <div className="form-grupo">
            <label>Cupos Disponibles:</label>
            <input
              type="number"
              value={modoEdicion ? eventoSeleccionado?.cuposDisponibles : nuevoEvento.cuposDisponibles}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, cuposDisponibles: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, cuposDisponibles: e.target.value })
              }
            />
          </div>

          <div className="form-grupo">
            <label>Prioridad:</label>
            <select
              value={modoEdicion ? eventoSeleccionado?.prioridad : nuevoEvento.prioridad}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, prioridad: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, prioridad: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              <option value="Alta">Alta</option>
              <option value="Normal">Normal</option>
              <option value="Baja">Baja</option>
            </select>
          </div>
          {!modoEdicion && (
            <div className="form-grupo">
              <label>Observaciones:</label>
              <input
                type="text"
                value={nuevoEvento.observaciones}
                onChange={e =>
                setNuevoEvento({ ...nuevoEvento, observaciones: e.target.value })
                }
                placeholder="Observaciones del evento"
              />
            </div>
          )}
          <div className="form-grupo">
            <label>Estado:</label>
            <select
              value={modoEdicion ? eventoSeleccionado?.active : nuevoEvento.active}
              onChange={e =>
                modoEdicion
                  ? setEventoSeleccionado({ ...eventoSeleccionado, active: e.target.value })
                  : setNuevoEvento({ ...nuevoEvento, active: e.target.value })
              }
            >
              <option value="">Seleccione...</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
          </div>
        </div>



        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Evento"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EventoModal;