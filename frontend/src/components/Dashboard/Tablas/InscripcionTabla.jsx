import React from "react";
import PropTypes from "prop-types";
import { mostrarAlerta } from "../../utils/alertas";

// Helpers para renderizado
const renderField = (value) => value || "N/A";

const renderDateTime = (date) => date ? new Date(date).toLocaleString() : "N/A";

const renderNombreCompleto = (nombre, apellido) => {
  if (nombre && apellido) return `${nombre} ${apellido}`;
  if (nombre) return nombre;
  if (apellido) return apellido;
  return "N/A";
};

const renderTipoInscripcion = (tipoReferencia) => {
  if (tipoReferencia === "Eventos") return "Evento";
  if (tipoReferencia === "ProgramaAcademico") return "Programa académico";
  return "N/A";
};

const renderEventoPrograma = (tipoReferencia, referencia, evento) => {
  if (tipoReferencia === "Eventos") {
    return referencia?.nombre || evento?.nombre || "N/A";
  }
  if (tipoReferencia === "ProgramaAcademico") {
    return referencia?.nombre || "N/A";
  }
  return "N/A";
};

const renderEstadoClass = (estado) => {
  return (estado || "pendiente").toLowerCase().trim().split(/\s+/).join('-');
};

const renderEstado = (estado) => (
  <span className={`badge-estado estado-${renderEstadoClass(estado)}`}>
    {estado || "Pendiente"}
  </span>
);

const TablaInscripciones = ({ inscripciones, onEditar, onEliminar }) => {

  const handleMostrarSolicitud = async (solicitud) => {
    if (!solicitud) {
      mostrarAlerta('INFO', 'No hay solicitud asociada a esta inscripción', 'info');
      return;
    }

    try {
      if (typeof solicitud === 'string') {
        const fullId = String(solicitud);
        try {
          if (navigator?.clipboard?.writeText) {
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
    <div className="tabla-contenedor-admin">
      <table className="tabla-usuarios-admin">
        <thead>
          <tr>
            <th>Nombre completo</th>
            <th>Tipo Doc.</th>
            <th>Número Doc.</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Edad</th>
            <th>Tipo Inscripción</th>
            <th>Evento/Programa</th>
            <th>Categoría</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Fecha inscripción</th>
            <th>Solicitudes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inscripciones.map((ins) => (
            <tr key={ins._id}>
              <td>{renderNombreCompleto(ins.nombre, ins.apellido)}</td>
              <td>{renderField(ins.tipoDocumento)}</td>
              <td>{renderField(ins.numeroDocumento)}</td>
              <td>{renderField(ins.correo)}</td>
              <td>{renderField(ins.telefono)}</td>
              <td>{renderField(ins.edad)}</td>
              <td>{renderTipoInscripcion(ins.tipoReferencia)}</td>
              <td>{renderEventoPrograma(ins.tipoReferencia, ins.referencia, ins.evento)}</td>
              <td>{renderField(ins.categoria?.nombre)}</td>
              <td>{renderEstado(ins.estado)}</td>
              <td>{renderField(ins.observaciones)}</td>
              <td>{renderDateTime(ins.fechaInscripcion)}</td>
              <td>
                {ins.solicitud ? (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleMostrarSolicitud(ins.solicitud)}
                    title="Ver solicitud"
                  >
                    Ver solicitud
                  </button>
                ) : (
                  "N/A"
                )}
              </td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-action editar" onClick={() => onEditar(ins)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(ins._id)}>
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
  );
};
TablaInscripciones.propTypes = {
  inscripciones: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func,
};

export default TablaInscripciones;