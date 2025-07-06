import React from "react";

const ReservasModal = ({
  mostrar,
  modoEdicion,
  reservaSeleccionada,
  setReservaSeleccionada,
  nuevaReserva,
  setNuevaReserva,
  usuarios,
  cabanas,
  solicitudes,
  onClose,
  onSubmit
}) => {
  if (!mostrar) return null;

  const reservaActual = modoEdicion ? reservaSeleccionada : nuevaReserva;
  const setReserva = modoEdicion ? setReservaSeleccionada : setNuevaReserva;

  const handleChange = (e) => {
    const {name,value} = e.target;
    setReserva({...reservaActual, [name]: value});

  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Reserva" : "Crear Nueva Reserva"}</h3>
          <button className="modal-cerrar" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Usuario */}
          <div className="form-grupo">
            <label>Usuario:</label>
            <select
              value={modoEdicion ? reservaSeleccionada?.usuario : nuevaReserva.usuario}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, usuario: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, usuario: e.target.value })
              }
              required
            >
              <option value="">Seleccione...</option>
              {usuarios && usuarios.map(user => (
                <option key={user._id} value={user._id}>
                  {user.nombre || user.username || user.correo} ({user.role})
                </option>
              ))}
            </select>
          </div>

          {/* Cabaña */}
          <div className="form-grupo">
            <label>Cabaña:</label>
            <select
              value={modoEdicion ? reservaSeleccionada?.cabana : nuevaReserva.cabana}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, cabana: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, cabana: e.target.value })
              }
              required
            >
              <option value="">Seleccione...</option>
              {cabanas && cabanas.map(cab => (
                <option key={cab._id} value={cab._id}>
                  {cab.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha Inicio */}
          <div className="form-grupo">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              value={
                modoEdicion
                  ? reservaSeleccionada?.fechaInicio?.substring(0, 10)
                  : nuevaReserva.fechaInicio
              }
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, fechaInicio: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, fechaInicio: e.target.value })
              }
              required
            />
          </div>

          {/* Fecha Fin */}
          <div className="form-grupo">
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={
                modoEdicion
                  ? reservaSeleccionada?.fechaFin?.substring(0, 10)
                  : nuevaReserva.fechaFin
              }
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, fechaFin: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, fechaFin: e.target.value })
              }
              required
            />
          </div>

          {/* Estado */}
          <div className="form-grupo">
            <label>Estado:</label>
            <select
              value={modoEdicion ? reservaSeleccionada?.estado : nuevaReserva.estado || "Pendiente"}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, estado: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, estado: e.target.value })
              }
              required
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Confirmada">Confirmada</option>
              <option value="Cancelada">Cancelada</option>
              <option value="finalizada">Finalizada</option>
            </select>
          </div>

          {/* Observaciones */}
          <div className="form-grupo">
            <label>Observaciones:</label>
            <input
              type="text"
              value={modoEdicion ? reservaSeleccionada?.observaciones : nuevaReserva.observaciones}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, observaciones: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, observaciones: e.target.value })
              }
              placeholder="Observaciones"
            />
          </div>

      
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservasModal;