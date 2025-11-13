import React, { useEffect } from "react";
import PropTypes from "prop-types";
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
  // Funciones auxiliares para reducir complejidad cognitiva
  const getReservaData = () => ({
    reservaActual: modoEdicion ? reservaSeleccionada : nuevaReserva,
    setReserva: modoEdicion ? setReservaSeleccionada : setNuevaReserva
  });

  const actualizarPrecioCabana = (reservaActual, setReserva) => {
    if (!reservaActual.cabana || !cabanas || cabanas.length === 0) return;

    const cabanaSeleccionada = cabanas.find(c => c._id === reservaActual.cabana);
    const debeCambiarPrecio = cabanaSeleccionada &&
      cabanaSeleccionada.precio &&
      reservaActual.precio !== cabanaSeleccionada.precio;

    if (debeCambiarPrecio) {
      setReserva({ ...reservaActual, precio: cabanaSeleccionada.precio });
    }
  };

  // Actualizar el precio automáticamente al seleccionar una cabaña
  useEffect(() => {
    const { reservaActual, setReserva } = getReservaData();
    actualizarPrecioCabana(reservaActual, setReserva);
    // eslint-disable-next-line
  }, [modoEdicion, reservaSeleccionada?.cabana, nuevaReserva.cabana, cabanas]);

  if (!mostrar) return null;

  const { reservaActual, setReserva } = getReservaData();

  const actualizarDatosUsuario = (userId) => {
    const usuarioSeleccionado = usuarios.find(u => u._id === userId);
    return {
      usuario: userId,
      nombre: usuarioSeleccionado?.nombre || '',
      apellido: usuarioSeleccionado?.apellido || '',
      correoElectronico: usuarioSeleccionado?.correo || '',
      telefono: usuarioSeleccionado?.telefono || '',
      tipoDocumento: usuarioSeleccionado?.tipoDocumento || '',
      numeroDocumento: usuarioSeleccionado?.numeroDocumento || ''
    };
  };

  const handleUsuarioChange = (userId) => {
    const datosUsuario = actualizarDatosUsuario(userId);
    if (modoEdicion) {
      setReservaSeleccionada({ ...reservaSeleccionada, ...datosUsuario });
    } else {
      setNuevaReserva({ ...nuevaReserva, ...datosUsuario });
    }
  };

  const handleCabanaChange = (cabanaId) => {
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
  };

  const getFieldValue = (fieldName) => {
    return modoEdicion ? reservaSeleccionada?.[fieldName] : nuevaReserva[fieldName];
  };

  const handleFieldChange = (fieldName, value) => {
    if (modoEdicion) {
      setReservaSeleccionada({ ...reservaSeleccionada, [fieldName]: value });
    } else {
      setNuevaReserva({ ...nuevaReserva, [fieldName]: value });
    }
  };

  const getActivoValue = () => {
    if (modoEdicion) {
      return reservaSeleccionada?.activo ? 'true' : 'false';
    }
    return (nuevaReserva.activo === undefined || nuevaReserva.activo) ? 'true' : 'false';
  };

  const handleActivoChange = (value) => {
    const esActivo = value === 'true';
    if (modoEdicion) {
      setReservaSeleccionada({ ...reservaSeleccionada, activo: esActivo });
    } else {
      setNuevaReserva({ ...nuevaReserva, activo: esActivo });
    }
  };

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
            <label htmlFor="usuario">Usuario:</label>
            <select
              id="usuario"
              name="usuario"
              value={modoEdicion ? reservaSeleccionada?.usuario : nuevaReserva.usuario}
              onChange={e => handleUsuarioChange(e.target.value)}
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
              <label htmlFor="cabana">Cabaña:</label>
              <select
                id="cabana"
                name="cabana"
                value={modoEdicion ? reservaSeleccionada?.cabana : nuevaReserva.cabana}
                onChange={e => handleCabanaChange(e.target.value)}
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
              <label htmlFor="precio">Precio:</label>
              <input
                id="precio"
                name="precio"
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
              <label htmlFor="fechaInicio">Fecha Inicio:</label>
              <input
                id="fechaInicio"
                name="fechaInicio"
                type="date"
                value={
                  modoEdicion
                    ? reservaSeleccionada?.fechaInicio?.substring(0, 10)
                    : nuevaReserva.fechaInicio
                }
                onChange={e => handleFieldChange('fechaInicio', e.target.value)}
                required
              />
            </div>

            {/* Fecha Fin */}
            <div className="form-grupo-admin">
              <label htmlFor="fechaFin">Fecha Fin:</label>
              <input
                id="fechaFin"
                name="fechaFin"
                type="date"
                value={
                  modoEdicion
                    ? reservaSeleccionada?.fechaFin?.substring(0, 10)
                    : nuevaReserva.fechaFin
                }
                onChange={e => handleFieldChange('fechaFin', e.target.value)}
                required
              />
            </div>
          </div>
          <div className="from-grid-admin">
            {/* Estado */}
            <div className="form-grupo-admin">
              <label htmlFor="estado">Estado:</label>
              <select
                id="estado"
                name="estado"
                value={getFieldValue('estado') || "Pendiente"}
                onChange={e => handleFieldChange('estado', e.target.value)}
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
              <label htmlFor="activo">Activo:</label>
              <select
                id="activo"
                name="activo"
                value={getActivoValue()}
                onChange={e => handleActivoChange(e.target.value)}
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
                <label htmlFor="nombre">Nombre:</label>
                <input
                  id="nombre"
                  type="text"
                  name="nombre"
                  value={getFieldValue('nombre')}
                  onChange={handleChange}
                  placeholder="Nombre del huésped"
                  required
                />
              </div>

              <div className="form-grupo-admin">
                <label htmlFor="apellido">Apellido:</label>
                <input
                  id="apellido"
                  type="text"
                  name="apellido"
                  value={getFieldValue('apellido')}
                  onChange={handleChange}
                  placeholder="Apellido del huésped"
                  required
                />
              </div>
            </div>

            <div className="from-grid-admin">
              <div className="form-grupo-admin">
                <label htmlFor="tipoDocumento">Tipo de Documento:</label>
                <select
                  id="tipoDocumento"
                  name="tipoDocumento"
                  value={getFieldValue('tipoDocumento')}
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
                <label htmlFor="numeroDocumento">Número de Documento:</label>
                <input
                  id="numeroDocumento"
                  type="text"
                  name="numeroDocumento"
                  value={getFieldValue('numeroDocumento')}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
            </div>

            <div className="from-grid-admin">
              <div className="form-grupo-admin">
                <label htmlFor="correoElectronico">Correo Electrónico:</label>
                <input
                  id="correoElectronico"
                  type="email"
                  name="correoElectronico"
                  value={getFieldValue('correoElectronico')}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-grupo-admin">
                <label htmlFor="telefono">Teléfono:</label>
                <input
                  id="telefono"
                  type="tel"
                  name="telefono"
                  value={getFieldValue('telefono')}
                  onChange={handleChange}
                  placeholder="Número de teléfono"
                  required
                />
              </div>
            </div>

            <div className="form-grupo-admin">
              <label htmlFor="numeroPersonas">Número de Personas:</label>
              <input
                id="numeroPersonas"
                type="number"
                name="numeroPersonas"
                value={getFieldValue('numeroPersonas')}
                onChange={handleChange}
                min="1"
                max="20"
                required
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="form-grupo-admin">
            <label htmlFor="observaciones">Observaciones:</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={getFieldValue('observaciones')}
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

ReservasModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  reservaSeleccionada: PropTypes.shape({
    usuario: PropTypes.string,
    cabana: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
    estado: PropTypes.string,
    activo: PropTypes.bool,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    tipoDocumento: PropTypes.string,
    numeroDocumento: PropTypes.string,
    correoElectronico: PropTypes.string,
    telefono: PropTypes.string,
    numeroPersonas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    observaciones: PropTypes.string
  }),
  setReservaSeleccionada: PropTypes.func,
  nuevaReserva: PropTypes.shape({
    usuario: PropTypes.string,
    cabana: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
    estado: PropTypes.string,
    activo: PropTypes.bool,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    tipoDocumento: PropTypes.string,
    numeroDocumento: PropTypes.string,
    correoElectronico: PropTypes.string,
    telefono: PropTypes.string,
    numeroPersonas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    observaciones: PropTypes.string
  }).isRequired,
  setNuevaReserva: PropTypes.func.isRequired,
  usuarios: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string,
    username: PropTypes.string,
    correo: PropTypes.string,
    role: PropTypes.string,
    apellido: PropTypes.string,
    telefono: PropTypes.string,
    tipoDocumento: PropTypes.string,
    numeroDocumento: PropTypes.string
  })).isRequired,
  cabanas: PropTypes.arrayOf(PropTypes.shape({
    _id: PropTypes.string,
    nombre: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
  })).isRequired,
  solicitudes: PropTypes.array,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ReservasModal;