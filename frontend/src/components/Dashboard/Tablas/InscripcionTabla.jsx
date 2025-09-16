import React from "react";

const TablaInscripciones = ({ inscripciones, onEditar, onEliminar }) => (
  <div className="tabla-contenedor-admin">
    <table className="tabla-usuarios-admin">
      <thead>
        <tr>
          <th>ID Inscripción</th>
          <th>Nombre completo</th>
          <th>Tipo de Docuemnto</th>
          <th>numero de Docuemnto </th>
          <th>Telefono</th>
          <th>Edad</th>
          <th>Categoria</th>
          <th>evento</th>
          <th>Observaciones</th>
          <th>Fecha de inscripcion</th>
          <th>Estado de la inscripción</th>
          <th>Solicitud</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {inscripciones.length === 0 ? (
          <tr>
            <td colSpan={10}>No hay inscripciones para mostrar</td>
          </tr>
        ) : (
          inscripciones.map((ins) => (
            <tr key={ins._id}>
              <td>{ins._id}</td>
              <td>{(ins.nombre && ins.apellido) ? `${ins.nombre} ${ins.apellido}` : ins.nombre || ins.apellido || "N/A"}</td>
              <td>{ins.tipoDocumento || "N/A"}</td>
              <td>{ins.numeroDocumento || "N/A"}</td>
              <td>{ins.telefono || "N/A"}</td>
              <td>{ins.edad || "N/A"}</td>
              <td>{ins.categoria?.nombre || "N/A"}</td>
              <td>{ins.evento?.nombre || "N/A"}</td>
              <td>{ins.observaciones || "N/A"}</td>
              <td>{ins.fechaInscripcion || "N/A"}</td>
              <td>
                <span className={`badge-estado estado-${(ins.estado || "pendiente").toLowerCase()}`}>
                  {ins.estado || "Pendiente"}
                </span>
              </td>
              <td>{ins.solicitud?._id || ins.solicitud || ""}</td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-action editar" onClick={() => onEditar(ins)}><i className="fas fa-edit"></i></button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(ins._id)}><i className="fas fa-trash"></i></button>
                  )}
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TablaInscripciones;