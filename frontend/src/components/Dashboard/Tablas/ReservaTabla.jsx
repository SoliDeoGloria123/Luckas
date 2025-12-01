import React from "react";
import PropTypes from "prop-types";
import { mostrarAlerta } from "../../utils/alertas";

const renderEstadoActivo = (activo) => {
  if (activo === undefined) return 'N/A';
  return activo ? 'Activo' : 'Desactivado';
};

const TablaReservas = ({ reservas, onEditar, onEliminar }) => {
  const handleMostrarSolicitud = async (solicitud) => {
    if (!solicitud) {
      mostrarAlerta('INFO', 'No hay solicitud asociada a esta reserva', 'info');
      return;
    }

    try {
      if (typeof solicitud === 'string') {
        const fullId = String(solicitud);
        try {
          if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(fullId);
            mostrarAlerta('Solicitud', `ID: ${fullId} (ID copiada al portapapeles)`, 'info');
          } else {
            mostrarAlerta('Solicitud', `ID: ${fullId}`, 'info');
          }
        } catch (err) {
          console.warn('No se pudo copiar ID al portapapeles', err);
          mostrarAlerta('Solicitud', `ID: ${fullId}`, 'info');
        }
        return;
      }

      // solicitud es objeto
      const candidatoTitulo = solicitud.titulo || solicitud.nombre || solicitud.tipo || '';
      const usuario = solicitud.usuario?.nombre || solicitud.usuario || '';
      const estado = solicitud.estado ? `Estado: ${solicitud.estado}` : '';
      const fecha = solicitud.fecha ? `Fecha: ${new Date(solicitud.fecha).toLocaleDateString()}` : '';
      const id = solicitud._id ? `ID: ${solicitud._id}` : '';
      const partes = [candidatoTitulo, usuario, estado, fecha].filter(Boolean);
      const mensajeResumen = partes.join(' • ') || 'Solicitud registrada';
      const mensaje = id ? `${mensajeResumen} • ${id}` : mensajeResumen;
      mostrarAlerta('Solicitud', mensaje, 'info');
    } catch (err) {
      console.error('Error mostrando solicitud', err);
      mostrarAlerta('ERROR', 'No se pudo mostrar la solicitud', 'error');
    }
  };

  return (
    <div className="tabla-responsive">
      <div className="tabla-contenedor-admin">
        <table className="tabla-usuarios-admin">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Cabaña</th>
              <th>Fecha Inicio</th>
              <th>Fecha Fin</th>
              <th>Número de Personas</th>
              <th>Tipo de Documento</th>
              <th>Número de Documento</th>
              <th>Correo Electrónico</th>
              <th>Teléfono</th>
              <th>Propósito de Estadía</th>
              <th>Estado</th>
              <th>Observaciones</th>
              <th>Solicitud</th>
              <th>Activo</th>
              <th>Fecha de creación</th>
              <th>Fecha de actualización</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>

            {reservas.map((reserva) => (
              <tr key={reserva._id}>
                <td>
                  {typeof reserva.usuario === "object"
                    ? `${reserva.usuario?.nombre || ""} ${reserva.usuario?.apellido || ""}`.trim() ||
                    reserva.usuario?.username ||
                    reserva.usuario?.correo ||
                    reserva.usuario?._id ||
                    "N/A"
                    : reserva.usuario || "N/A"}
                </td>
                <td>
                  {typeof reserva.cabana === "object"
                    ? reserva.cabana?.nombre || reserva.cabana?._id || "N/A"
                    : reserva.cabana || "N/A"}
                </td>
                <td>{reserva.fechaInicio ? new Date(reserva.fechaInicio).toLocaleDateString() : ""}</td>
                <td>{reserva.fechaFin ? new Date(reserva.fechaFin).toLocaleDateString() : ""}</td>

                <td>{reserva.numeroPersonas || "N/A"}</td>
                <td>{reserva.tipoDocumento || "N/A"}</td>
                <td>{reserva.numeroDocumento || "N/A"}</td>
                <td>{reserva.correoElectronico || "N/A"}</td>
                <td>{reserva.telefono || "N/A"}</td>
                <td>{reserva.propositoEstadia || "N/A"}</td>
                <td>
                  <span className={`badge-estado estado-${(reserva.estado || "pendiente").toLowerCase()}`}>
                    {reserva.estado || "Pendiente"}
                  </span>
                </td>
                <td>{reserva.observaciones || "N/A"}</td>
                <td>{reserva.solicitud ? (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleMostrarSolicitud(reserva.solicitud)}
                    title="Ver solicitud"
                  >
                    Ver solicitud
                  </button>
                ) : (
                  "N/A"

                )}</td>

                <td>{renderEstadoActivo(reserva.activo)}</td>
                <td>{reserva.createdAt ? new Date(reserva.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>{reserva.updatedAt ? new Date(reserva.updatedAt).toLocaleDateString() : "N/A"}</td>
                <td>
                  <div className="acciones-botones">
                    <button className="btn-action editar" onClick={() => onEditar(reserva)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    {onEliminar && (
                      <button className="btn-action eliminar" onClick={() => onEliminar(reserva._id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    )}


                  </div>
                </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

TablaReservas.propTypes = {
  reservas: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func,
};
export default TablaReservas;