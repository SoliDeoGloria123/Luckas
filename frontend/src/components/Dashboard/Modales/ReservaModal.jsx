import React, { useEffect } from "react";
// Actualizar el precio automáticamente al seleccionar una cabaña

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
  // Actualizar el precio automáticamente al seleccionar una cabaña
  useEffect(() => {
    const reservaActual = modoEdicion ? reservaSeleccionada : nuevaReserva;
    const setReserva = modoEdicion ? setReservaSeleccionada : setNuevaReserva;
    if (reservaActual.cabana && cabanas && cabanas.length > 0) {
      const cabanaSeleccionada = cabanas.find(c => c._id === reservaActual.cabana);
      if (cabanaSeleccionada && cabanaSeleccionada.precio && reservaActual.precio !== cabanaSeleccionada.precio) {
        setReserva({ ...reservaActual, precio: cabanaSeleccionada.precio });
      }
    }
    // eslint-disable-next-line
  }, [modoEdicion, reservaSeleccionada?.cabana, nuevaReserva.cabana, cabanas]);

  if (!mostrar) return null;

  const reservaActual = modoEdicion ? reservaSeleccionada : nuevaReserva;
  const setReserva = modoEdicion ? setReservaSeleccionada : setNuevaReserva;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReserva({ ...reservaActual, [name]: value });

  };

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
          <h2>{modoEdicion ? "Editar Reserva" : "Crear Nueva Reserva"}</h2>
          <button className="modal-cerrar" onClick={onClose}>✕</button>
        </div>

        <form className="modal-body-admin">
          {/* Usuario */}
          <div className="form-grupo-admin">
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
          
          <div className="form-grid-admin">
            <div className="form-grupo-admin">
              <label>Cabaña:</label>
              <select
                value={modoEdicion ? reservaSeleccionada?.cabana : nuevaReserva.cabana}
                onChange={e => {
                  const cabanaId = e.target.value;
                  const cabanaSeleccionada = cabanas.find(c => c._id === cabanaId);
                  const nuevoPrecio = cabanaSeleccionada ? cabanaSeleccionada.precio : "";

                  if (modoEdicion) {
                    setReservaSeleccionada({
                      ...reservaSeleccionada,
                      cabana: cabanaId,
                      precio: nuevoPrecio
                    });
                  } else {
                    setNuevaReserva({
                      ...nuevaReserva,
                      cabana: cabanaId,
                      precio: nuevoPrecio
                    });
                  }
                }}
                required
              >
                <option value="">Seleccione...</option>
                {cabanas && cabanas.map(cab => (
                  <option key={cab._id} value={cab._id}>
                    {cab.nombre} {cab.precio ? `- $${cab.precio}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-grupo-admin">
              <label>Precio:</label>
              <input
                type="number"
                value={modoEdicion ? reservaSeleccionada?.precio : nuevaReserva.precio}
                readOnly
                required
              />
            </div>
          </div>
          <div className="from-grid-admin">
          {/* Fecha Inicio */}
          <div className="form-grupo-admin">
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
          <div className="form-grupo-admin">
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
              </div>
              <div className="from-grid-admin">
          {/* Estado */}
          <div className="form-grupo-admin">
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
          {/* Activo */}
          <div className="form-grupo-admin">
            <label>Activo:</label>
            <select
              value={modoEdicion ? (reservaSeleccionada?.activo ? 'true' : 'false') : (nuevaReserva.activo !== undefined ? (nuevaReserva.activo ? 'true' : 'false') : 'true')}
              onChange={e =>
                modoEdicion
                  ? setReservaSeleccionada({ ...reservaSeleccionada, activo: e.target.value === 'true' })
                  : setNuevaReserva({ ...nuevaReserva, activo: e.target.value === 'true' })
              }
              required
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          </div>

          {/* Observaciones */}
          <div className="form-grupo-admin">
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

          <div className="modal-action-admin">
            <button className="btn-admin secondary-admin" onClick={onClose}>Cancelar</button>
            <button className="btn-admin btn-primary" onClick={onSubmit}>
              {modoEdicion ? "Guardar Cambios" : "Crear Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservasModal;