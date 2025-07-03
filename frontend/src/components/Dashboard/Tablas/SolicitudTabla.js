import React from "react";

const TablaUnificadaSolicitudes = ({
  datosUnificados = { solicitudes: [], inscripciones: [], reservas: [] },
  abrirModalEditarSolicitud,
  eliminarSolicitud,

}) => (
  <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre Solicitante</th>
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
            <td>{sol._id}</td>

            {/* Nombre del solicitante */}
            <td>
              {typeof sol.solicitante === "object"
                ? sol.solicitante?.username || sol.solicitante?.nombre || sol.solicitante?.correo || sol.solicitante?._id || "N/A"
                : sol.solicitante || "N/A"}
            </td>
            <td>
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
            <td>
              <span className={` estado-${(sol.estado || "activo").toLowerCase()}`}>
                {sol.estado || "Activo"}
              </span>
            </td>
            <td>
              <span className={`prioridad-${(sol.prioridad || "media").toLowerCase()}`}>
                {sol.prioridad || "Media"}
              </span>
            </td>

            <td>{sol.fechaSolicitud || "N/A"}</td>
            <td>
              {typeof sol.responsable === "object"
                ? sol.responsable?.nombre || sol.responsable?.username || sol.responsable?.email || sol.responsable?._id || "N/A"
                : sol.responsable || "N/A"}
            </td>

            <td>
              <button className="btn-editar" onClick={() => abrirModalEditarSolicitud(sol)}>✏️</button>
              {eliminarSolicitud && (
                <button className="btn-eliminar" onClick={() => eliminarSolicitud(sol._id)}>🗑️</button>
              )}
            </td>
          </tr>
        ))}

      </tbody>
    </table>
  </div>
);
export default TablaUnificadaSolicitudes;