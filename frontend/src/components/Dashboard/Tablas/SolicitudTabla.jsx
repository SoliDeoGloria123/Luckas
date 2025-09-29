import React from "react";

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
      <div style={{
        overflowX: 'auto',
        overflowY: 'visible',
        width: '100%',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px'
      }}>
        <table className="tabla-usuarios-admin" style={{
          minWidth: '1400px', // Ancho mínimo para asegurar que todas las columnas sean visibles
          width: '100%',
          borderCollapse: 'collapse'
        }}>
      <thead>
        <tr>
          <th style={{minWidth: '80px', padding: '8px', whiteSpace: 'nowrap'}}>ID</th>
          <th style={{minWidth: '150px', padding: '8px', whiteSpace: 'nowrap'}}>Nombre Solicitante</th>
          <th style={{minWidth: '100px', padding: '8px', whiteSpace: 'nowrap'}}>Cédula</th>
          <th style={{minWidth: '200px', padding: '8px', whiteSpace: 'nowrap'}}>Correo</th>
          <th style={{minWidth: '120px', padding: '8px', whiteSpace: 'nowrap'}}>Teléfono</th>
          <th style={{minWidth: '80px', padding: '8px', whiteSpace: 'nowrap'}}>Rol</th>
          <th style={{minWidth: '120px', padding: '8px', whiteSpace: 'nowrap'}}>Tipo Solicitud</th>
          <th style={{minWidth: '120px', padding: '8px', whiteSpace: 'nowrap'}}>Categoría</th>
          <th style={{minWidth: '80px', padding: '8px', whiteSpace: 'nowrap'}}>Origen</th>
          <th style={{minWidth: '100px', padding: '8px', whiteSpace: 'nowrap'}}>Estado</th>
          <th style={{minWidth: '90px', padding: '8px', whiteSpace: 'nowrap'}}>Prioridad</th>
          <th style={{minWidth: '150px', padding: '8px', whiteSpace: 'nowrap'}}>Fecha de Solicitud</th>
          <th style={{minWidth: '130px', padding: '8px', whiteSpace: 'nowrap'}}>Responsable</th>
          <th style={{minWidth: '120px', padding: '8px', whiteSpace: 'nowrap', position: 'sticky', right: 0, backgroundColor: 'white', zIndex: 1}}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {/* Solicitudes */}
        {(datosUnificados.solicitudes || []).map((sol) => (
          <tr key={`solicitud-${sol._id}`} style={{borderBottom: '1px solid #eee'}}>
            <td style={{padding: '8px', whiteSpace: 'nowrap', fontSize: '12px'}}>{sol._id.substring(0, 8)}...</td>

            {/* Nombre del solicitante */}
            <td style={{padding: '8px', whiteSpace: 'nowrap'}}>
              {typeof sol.solicitante === "object"
                ? sol.solicitante?.username || sol.solicitante?.nombre || sol.solicitante?.correo || sol.solicitante?._id || "N/A"
                : sol.solicitante || "N/A"}
            </td>
            
            {/* Cédula del solicitante */}
            <td style={{padding: '8px', whiteSpace: 'nowrap'}}>
              {typeof sol.solicitante === "object"
                ? sol.solicitante?.numeroDocumento || "N/A"
                : "N/A"}
            </td>
            <td style={{padding: '8px', whiteSpace: 'nowrap'}}>
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

            <td>{sol.fechaSolicitud || "N/A"}</td>
            <td>
              {typeof sol.responsable === "object"
                ? sol.responsable?.nombre || sol.responsable?.username || sol.responsable?.email || sol.responsable?._id || "N/A"
                : sol.responsable || "N/A"}
            </td>
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
    </div>
  );
}
export default TablaUnificadaSolicitudes;