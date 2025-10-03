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

        <form className="modal-body-admin" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          {/* Usuario */}
          <div className="form-grupo-admin">
            <label>Usuario:</label>
            <select
              value={modoEdicion ? reservaSeleccionada?.usuario : nuevaReserva.usuario}
              onChange={e => {
                const userId = e.target.value;
                const usuarioSeleccionado = usuarios.find(u => u._id === userId);
                
                if (modoEdicion) {
                  setReservaSeleccionada({ 
                    ...reservaSeleccionada, 
                    usuario: userId,
                    nombre: usuarioSeleccionado?.nombre || '',
                    apellido: usuarioSeleccionado?.apellido || '',
                    correoElectronico: usuarioSeleccionado?.correo || '',
                    telefono: usuarioSeleccionado?.telefono || '',
                    tipoDocumento: usuarioSeleccionado?.tipoDocumento || '',
                    numeroDocumento: usuarioSeleccionado?.numeroDocumento || ''
                  });
                } else {
                  setNuevaReserva({ 
                    ...nuevaReserva, 
                    usuario: userId,
                    nombre: usuarioSeleccionado?.nombre || '',
                    apellido: usuarioSeleccionado?.apellido || '',
                    correoElectronico: usuarioSeleccionado?.correo || '',
                    telefono: usuarioSeleccionado?.telefono || '',
                    tipoDocumento: usuarioSeleccionado?.tipoDocumento || '',
                    numeroDocumento: usuarioSeleccionado?.numeroDocumento || ''
                  });
                }
              }}
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

          {/* Datos Personales */}
          <div className="form-section-admin">
            <h3 style={{ color: 'var(--primary-blue)', marginBottom: '1rem' }}>Datos del Huésped</h3>
            
            <div className="from-grid-admin">
              <div className="form-grupo-admin">
                <label>Nombre:</label>
                <input
                  type="text"
                  name="nombre"
                  value={modoEdicion ? reservaSeleccionada?.nombre : nuevaReserva.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del huésped"
                  required
                />
              </div>
              
              <div className="form-grupo-admin">
                <label>Apellido:</label>
                <input
                  type="text"
                  name="apellido"
                  value={modoEdicion ? reservaSeleccionada?.apellido : nuevaReserva.apellido}
                  onChange={handleChange}
                  placeholder="Apellido del huésped"
                  required
                />
              </div>
            </div>
            
            <div className="from-grid-admin">
              <div className="form-grupo-admin">
                <label>Tipo de Documento:</label>
                <select
                  name="tipoDocumento"
                  value={modoEdicion ? reservaSeleccionada?.tipoDocumento : nuevaReserva.tipoDocumento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                  <option value="Cédula de extranjería">Cédula de extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                </select>
              </div>
              
              <div className="form-grupo-admin">
                <label>Número de Documento:</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={modoEdicion ? reservaSeleccionada?.numeroDocumento : nuevaReserva.numeroDocumento}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
            </div>
            
            <div className="from-grid-admin">
              <div className="form-grupo-admin">
                <label>Correo Electrónico:</label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={modoEdicion ? reservaSeleccionada?.correoElectronico : nuevaReserva.correoElectronico}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              
              <div className="form-grupo-admin">
                <label>Teléfono:</label>
                <input
                  type="tel"
                  name="telefono"
                  value={modoEdicion ? reservaSeleccionada?.telefono : nuevaReserva.telefono}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                  required
                />
              </div>
            </div>
            
            <div className="form-grupo-admin">
              <label>Número de Personas:</label>
              <input
                type="number"
                name="numeroPersonas"
                value={modoEdicion ? reservaSeleccionada?.numeroPersonas : nuevaReserva.numeroPersonas}
                onChange={handleChange}
                min="1"
                max="20"
                required
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="form-grupo-admin">
            <label>Observaciones:</label>
            <textarea
              name="observaciones"
              value={modoEdicion ? reservaSeleccionada?.observaciones : nuevaReserva.observaciones}
              onChange={handleChange}
              placeholder="Observaciones adicionales"
              rows="3"
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