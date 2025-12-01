import React from "react";
import PropTypes from "prop-types";
import { mostrarAlerta } from "../../utils/alertas";

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
          {inscripciones.map((ins) => {
            // Extraer ternarias anidadas a variables
            let nombreCompleto = "N/A";
            if (ins.nombre && ins.apellido) {
              nombreCompleto = `${ins.nombre} ${ins.apellido}`;
            } else if (ins.nombre) {
              nombreCompleto = ins.nombre;
            } else if (ins.apellido) {
              nombreCompleto = ins.apellido;
            }

            let tipoInscripcion = "N/A";
            if (ins.tipoReferencia === "Eventos") {
              tipoInscripcion = "Evento";
            } else if (ins.tipoReferencia === "ProgramaAcademico") {
              tipoInscripcion = "Programa académico";
            }

            let eventoPrograma = "N/A";
            if (ins.tipoReferencia === "Eventos") {
              eventoPrograma = ins.referencia?.nombre || ins.evento?.nombre || "N/A";
            } else if (ins.tipoReferencia === "ProgramaAcademico") {
              eventoPrograma = ins.referencia?.nombre || "N/A";
            }

            // Sanitizar estado para clases CSS (reemplazar espacios por guiones)
            const estadoClass = (ins.estado || "pendiente").toLowerCase().trim().split(/\s+/).join('-');

            return (
              <tr key={ins._id}>
                <td >{nombreCompleto}</td>
                <td>{ins.tipoDocumento || "N/A"}</td>
                <td>{ins.numeroDocumento || "N/A"}</td>
                <td>{ins.correo || "N/A"}</td>
                <td>{ins.telefono || "N/A"}</td>
                <td>{ins.edad || "N/A"}</td>
                <td >{tipoInscripcion}</td>
                <td>{eventoPrograma}</td>
                <td>{ins.categoria?.nombre || "N/A"}</td>
                <td>
                  <span className={`badge-estado estado-${estadoClass}`}>
                    {ins.estado || "Pendiente"}
                  </span>
                </td>
                <td>{ins.observaciones || "N/A"}</td>
                <td>
                  {ins.fechaInscripcion
                    ? new Date(ins.fechaInscripcion).toLocaleString()
                    : "N/A"}
                </td>
                <td>{ins.solicitud ? (
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => handleMostrarSolicitud(ins.solicitud)}
                    title="Ver solicitud"
                  >
                    Ver solicitud
                  </button>
                ) : (
                  "N/A"
                )}</td>
                <td>
                  <div className="acciones-botones">
                    <button className="btn-action editar" onClick={() => onEditar(ins)}><i className="fas fa-edit"></i></button>
                    {onEliminar && (
                      <button className="btn-action eliminar" onClick={() => onEliminar(ins._id)}><i className="fas fa-trash"></i></button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
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