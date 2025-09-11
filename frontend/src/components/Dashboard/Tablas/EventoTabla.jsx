import React from "react";
import { FaEye } from "react-icons/fa";

const TablaEventos = ({ eventos, onEditar, onEliminar, onDeshabilitar, onVerImagen }) => {
  return (

    <div className="tabla-contenedor-admin">
      <table className="tabla-usuarios-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Categoría</th>
            <th>Fecha Evento</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Lugar</th>
            <th>Cupos Totales</th>
            <th>Cupos Disponibles</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th>Fecha Creación</th>
            <th>Imagen</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {eventos.length === 0 ? (
            <tr>
              <td colSpan={11}>No hay eventos para mostrar</td>
            </tr>
          ) : (
            eventos.map((evento) => (
              <tr key={evento._id}>
                <td>{evento._id}</td>
                <td>{evento.nombre}</td>
                <td>${evento.precio?.toLocaleString()}</td>
                <td>{evento.categoria?.nombre || "Sin categoría"}</td>
                <td>{evento.fechaEvento ? new Date(evento.fechaEvento).toLocaleDateString() : "N/A"}</td>
                <td>{evento.horaInicio}</td>
                <td>{evento.horaFin}</td>
                <td>{evento.lugar}</td>
                <td>{evento.cuposTotales}</td>
                <td>{evento.cuposDisponibles}</td>
                <td><span className={`prioridad-${(evento.prioridad || "media").toLowerCase()}`}>
                  {evento.prioridad || "Media"}
                </span>
                </td>
                <td>
                  <span className={`badge-estado estado-${evento.active ? "activo" : "inactivo"}`}>
                    {evento.active ? "Activo" : "Inactivo"}
                  </span>
                </td>

                <td>{evento.createdAt ? new Date(evento.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>
                  {Array.isArray(evento.imagen) && evento.imagen.length > 0 ? (
                    <button onClick={() => onVerImagen(evento.imagen)}  className="btn-ver-imagen">
                      <FaEye />
                    </button>
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td>
                  <div className="acciones-botones">
                    <button className="btn-action editar" onClick={() => onEditar(evento)}><i className="fas fa-edit"></i></button>
                    {onEliminar && (
                      <button className="btn-action eliminar" onClick={() => onEliminar(evento._id)}><i className="fas fa-trash"></i></button>
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
};

export default TablaEventos;