import React from "react";
import PropTypes from "prop-types";

const TablaTareas = ({ tareas = [], onEditar, onEliminar, onCambiarEstado }) => (
  <div className="tabla-contenedor-admin">
    <table className="tabla-usuarios-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Título</th>
          <th>Descripción</th>
          <th>Estado</th>
          <th>Prioridad</th>
          <th>Asignado A</th>
          <th>Asignado a Rol</th>
          <th>Asignado Por</th>
          <th>Asignado por Rol </th>
          <th>Fecha Límite</th>
          <th>Fecha Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {tareas.length === 0 ? (
          <tr>
            <td colSpan={10}>No hay tareas para mostrar</td>
          </tr>
        ) : (
          tareas.map((tarea) => (
            <tr key={tarea._id}>
              <td>{tarea._id}</td>
              <td>{tarea.titulo}</td>
              <td>{tarea.descripcion?.substring(0, 100)}...</td>
              <td>
                <span className={`badge-estado estado-${(tarea.estado || "pendiente").toLowerCase()}`}>
                  {tarea.estado || "Pendiente"}
                </span>
              </td>
              <td>
                <span className={`prioridad-${tarea.prioridad}`}>
                  {tarea.prioridad?.charAt(0).toUpperCase() + tarea.prioridad?.slice(1)}
                </span>
              </td>
              <td>{tarea.asignadoA?.nombre || "N/A"}</td>
              <td>{tarea.asignadoA?.role || "N/A"}</td>
              <td>{tarea.asignadoPor?.nombre || "N/A"}</td>
              <td>{tarea.asignadoPor?.role || "N/A"}</td>
              <td>
                {tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "N/A"}
              </td>
              <td>
                {tarea.createdAt ? new Date(tarea.createdAt).toLocaleDateString() : "N/A"}
              </td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-action editar" onClick={() => onEditar(tarea)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(tarea._id)}>
                      <i className="fas fa-trash"></i>
                    </button>
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

TablaTareas.propTypes = {
  tareas: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func,
  onCambiarEstado: PropTypes.func,
};

export default TablaTareas;