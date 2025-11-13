import React from "react";
import PropTypes from "prop-types";

const TablaUnificadaSolicitudes = ({
  datosUnificados = { solicitudes: [], inscripciones: [], reservas: [] },
  abrirModalEditarSolicitud,
  eliminarSolicitud,
}) => {

  console.log('=== DEBUG TABLA SOLICITUDES ===');
  console.log('abrirModalEditarSolicitud function:', typeof abrirModalEditarSolicitud);
  console.log('eliminarSolicitud function:', typeof eliminarSolicitud);
  console.log('Número de solicitudes:', datosUnificados.solicitudes?.length || 0);

  return (
    <div className="tabla-contenedor-admin">
      <table className="tabla-usuarios-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Solicitante</th>
            <th>Cédula</th>
            <th>Correo</th>
            <th>Teléfono</th>
            <th>Rol</th>
            <th>Tipo Solicitud</th>
            <th>Categoría</th>
            <th>Origen</th>
            <th>Estado</th>
            <th>Prioridad</th>
            <th>Fecha de Solicitud</th>
            <th>Responsable</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Solicitudes */}
          {(datosUnificados.solicitudes || []).map((sol) => (
            <tr key={`solicitud-${sol._id}`}>
              <td style={{ padding: '8px', whiteSpace: 'nowrap', fontSize: '12px' }}>{sol._id.substring(0, 8)}...</td>

              {/* Nombre del solicitante */}
              <td >
                {sol.solicitante?.nombre && sol.solicitante?.apellido
                  ? `${sol.solicitante.nombre} ${sol.solicitante.apellido}`
                  : sol.solicitante?.username || sol.solicitante?.nombre || sol.solicitante?.correo || "N/A"}
              </td>

              {/* Cédula del solicitante */}
              <td >
                {typeof sol.solicitante === "object"
                  ? sol.solicitante?.numeroDocumento || "N/A"
                  : "N/A"}
              </td>
              <td >
                {typeof sol.solicitante === "object"
                  ? sol.solicitante?.correo || sol.correo || "N/A"
                  : sol.correo || "N/A"}
              </td>
              <td>
                {typeof sol.solicitante === "object"
                  ? sol.solicitante?.telefono || sol.telefono || "N/A"
                  : sol.telefono || "N/A"}
              </td>
              <td>
                {typeof sol.solicitante === "object"
                  ? sol.solicitante?.role || "N/A"
                  : "N/A"}
              </td>
              <td>{sol.tipoSolicitud || "N/A"}</td>
              <td>
                {typeof sol.categoria === "object"
                  ? sol.categoria?.nombre || sol.categoria?._id || "N/A"
                  : sol.categoria || "N/A"}
              </td>
              {/* Origen: mostrar nombre legible según modeloReferencia */}
              <td>
                {(() => {
                  const origen = sol.modeloReferencia;
                  if (!origen) return "N/A";
                  switch (origen) {
                    case "Cabana": return "Reserva";
                    case "Eventos": return "Evento";
                    case "Comedor": return "Alimentación";
                    case "Bus": return "Transporte";
                    case "Certificado": return "Certificado";
                    case "Administrativo": return "Administrativa";
                    case "Otro": return "Otra";
                    default: return origen;
                  }
                })()}
              </td>
              <td>
                <span className={`estado-${(sol.estado || "activo").toLowerCase()}`}>
                  {sol.estado || "Activo"}
                </span>
              </td>
              <td>
                <span className={`prioridad-${(sol.prioridad || "media").toLowerCase()}`}>
                  {sol.prioridad || "Media"}
                </span>
              </td>

              <td>{sol.fechaSolicitud ? new Date(sol.fechaSolicitud).toLocaleDateString() : "N/A"}</td>
              <div className="flex flex-col">
                <span className="font-medium">
                  {sol.responsable?.nombre && sol.responsable?.apellido
                    ? `${sol.responsable.nombre} ${sol.responsable.apellido}`
                    : sol.responsable?.username || sol.responsable?.nombre || "N/A"}
                </span>
                {sol.responsable?.role && (
                  <span className={`text-xs role-badge-tesorero role-tesorero-${sol.responsable.role} mt-1`}>
                    {sol.responsable.role}
                  </span>
                )}
              </div>
              <td>
                <div className="acciones-botones">
                  {abrirModalEditarSolicitud && (
                    <button className="btn-action editar" onClick={() => abrirModalEditarSolicitud(sol)}>
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                  {eliminarSolicitud && (
                    <button className="btn-action eliminar" onClick={() => eliminarSolicitud(sol._id)}>
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
TablaUnificadaSolicitudes.propTypes = {
  datosUnificados: PropTypes.shape({
    solicitudes: PropTypes.array,
    inscripciones: PropTypes.array,

  }),
  abrirModalEditarSolicitud: PropTypes.func,
  eliminarSolicitud: PropTypes.func,
};
export default TablaUnificadaSolicitudes;