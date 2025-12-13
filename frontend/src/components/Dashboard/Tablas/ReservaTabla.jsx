import React from "react";
import PropTypes from "prop-types";
import { mostrarAlerta } from "../../utils/alertas";

// ============ HELPERS CENTRALIZADOS ============

// Helper genérico para renderizar campos
const renderField = (value) => value || "N/A";

const renderDate = (date) => date ? new Date(date).toLocaleDateString() : "N/A";

const renderEstadoActivo = (activo) => {
  if (activo === undefined) return 'N/A';
  return activo ? 'Activo' : 'Desactivado';
};

// Helper para obtener nombre completo o fallback
const getNombreUsuario = (usuario) => {
  if (typeof usuario === "object" && usuario) {
    const nombreCompleto = `${usuario.nombre || ""} ${usuario.apellido || ""}`.trim();
    return nombreCompleto || usuario.username || usuario.correo || usuario._id || "N/A";
  }
  return usuario || "N/A";
};

const renderUsuario = (usuario) => getNombreUsuario(usuario);

const renderCabana = (cabana) => {
  if (typeof cabana === "object" && cabana) {
    return cabana.nombre || cabana._id || "N/A";
  }
  return cabana || "N/A";
};

const renderEstado = (estado) => (
  <span className={`badge-estado estado-${(estado || "pendiente").toLowerCase()}`}>
    {estado || "Pendiente"}
  </span>
);

// Helper para copiar al portapapeles con manejo de errores
const copiarAlPortapapeles = async (texto) => {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto);
      return true;
    }
  } catch (err) {
    console.warn('No se pudo copiar al portapapeles', err);
  }
  return false;
};

// Helper para construir mensaje de solicitud string
const construirMensajeSolicitudString = (solicitudId) => {
  return `ID: ${solicitudId}`;
};

// Helper para construir mensaje de solicitud objeto
const construirMensajeSolicitudObjeto = (solicitud) => {
  const partes = [
    solicitud.titulo || solicitud.nombre || solicitud.tipo || '',
    solicitud.usuario?.nombre || solicitud.usuario || '',
    solicitud.estado ? `Estado: ${solicitud.estado}` : '',
    solicitud.fecha ? `Fecha: ${new Date(solicitud.fecha).toLocaleDateString()}` : ''
  ].filter(Boolean);
  
  const mensajeResumen = partes.join(' • ') || 'Solicitud registrada';
  const id = solicitud._id ? `ID: ${solicitud._id}` : '';
  
  return id ? `${mensajeResumen} • ${id}` : mensajeResumen;
};

const TablaReservas = ({ reservas, onEditar, onEliminar }) => {
  const handleMostrarSolicitud = async (solicitud) => {
    if (!solicitud) {
      mostrarAlerta('INFO', 'No hay solicitud asociada a esta reserva', 'info');
      return;
    }

    try {
      const mensaje = typeof solicitud === 'string'
        ? construirMensajeSolicitudString(solicitud)
        : construirMensajeSolicitudObjeto(solicitud);

      // Intentar copiar al portapapeles si es string
      if (typeof solicitud === 'string') {
        const copiado = await copiarAlPortapapeles(solicitud);
        const mensajeFinal = copiado
          ? `${mensaje} (ID copiada al portapapeles)`
          : mensaje;
        mostrarAlerta('Solicitud', mensajeFinal, 'info');
      } else {
        mostrarAlerta('Solicitud', mensaje, 'info');
      }
    } catch (err) {
      console.error('Error mostrando solicitud', err);
      mostrarAlerta("ERROR", 'No se pudo mostrar la solicitud', 'error');
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
                <td>{renderUsuario(reserva.usuario)}</td>
                <td>{renderCabana(reserva.cabana)}</td>
                <td>{renderDate(reserva.fechaInicio)}</td>
                <td>{renderDate(reserva.fechaFin)}</td>
                <td>{renderField(reserva.numeroPersonas)}</td>
                <td>{renderField(reserva.tipoDocumento)}</td>
                <td>{renderField(reserva.numeroDocumento)}</td>
                <td>{renderField(reserva.correoElectronico)}</td>
                <td>{renderField(reserva.telefono)}</td>
                <td>{renderField(reserva.propositoEstadia)}</td>
                <td>{renderEstado(reserva.estado)}</td>
                <td>{renderField(reserva.observaciones)}</td>
                <td>
                  {reserva.solicitud ? (
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => handleMostrarSolicitud(reserva.solicitud)}
                      title="Ver solicitud"
                    >
                      Ver solicitud
                    </button>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td>{renderEstadoActivo(reserva.activo)}</td>
                <td>{renderDate(reserva.createdAt)}</td>
                <td>{renderDate(reserva.updatedAt)}</td>
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