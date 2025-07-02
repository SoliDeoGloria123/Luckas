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
  categorias,
  onClose,
  onSubmit
}) => {
  if (!mostrar) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h3>{modoEdicion ? "Editar Reserva" : "Crear Nueva Reserva"}</h3>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
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
                  {user.username} ({user.email})
                </option>
              ))}
            </select>
          </div>
          {/* Cabaña */}
          <div className="form-grupo">
            <label>Cabaña:</label>
            <select
              value={modoEdicion ? reservaSeleccionada?.recurso : nuevaReserva.recurso}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, recurso: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, recurso: e.target.value })
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
          {/* Fechas */}
          <div className="form-grupo">
            <label>Fecha Inicio:</label>
            <input
              type="date"
              value={modoEdicion ? reservaSeleccionada?.fechaInicio?.substring(0,10) : nuevaReserva.fechaInicio}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, fechaInicio: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, fechaInicio: e.target.value })
              }
              required
            />
          </div>
          <div className="form-grupo">
            <label>Fecha Fin:</label>
            <input
              type="date"
              value={modoEdicion ? reservaSeleccionada?.fechaFin?.substring(0,10) : nuevaReserva.fechaFin}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, fechaFin: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, fechaFin: e.target.value })
              }
              required
            />
          </div>
          {/* Categoría */}
          <div className="form-grupo">
            <label>Categoría:</label>
            <select
              value={modoEdicion ? reservaSeleccionada?.categoria : nuevaReserva.categoria}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, categoria: e.target.value })
                  : setNuevaReserva({ ...nuevaReserva, categoria: e.target.value })
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
          <button className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={onSubmit}>
            {modoEdicion ? "Guardar Cambios" : "Crear Reserva"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservasModal;