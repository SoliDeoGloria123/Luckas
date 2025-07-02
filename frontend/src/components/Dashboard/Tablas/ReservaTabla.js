import React from "react";

const TablaReservas = ({ reservas, onEditar, onEliminar }) => (
  <div className="tabla-contenedor">
    <table className="tabla-usuarios">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Cabaña</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Estado</th>
          <th>Observaciones</th>
          <th>Solicitud</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reservas.length === 0 ? (
          <tr>
            <td colSpan={8}>No hay reservas para mostrar</td>
          </tr>
        ) : (
          reservas.map((reserva) => (
            <tr key={reserva._id}>
              <td>{reserva._id}</td>
              <td>
                {typeof reserva.usuario === "object"
                  ? reserva.usuario?.username || reserva.usuario?.nombre || reserva.usuario?.correo || reserva.usuario?._id || "N/A"
                  : reserva.usuario || "N/A"}
              </td>
             <td>
                {typeof reserva.cabana === "object"
                  ? reserva.cabana?.nombre || reserva.cabana?._id || "N/A"
                  : reserva.cabana || "N/A"}
              </td>
              <td>{reserva.fechaInicio ? new Date(reserva.fechaInicio).toLocaleDateString() : ""}</td>
              <td>{reserva.fechaFin ? new Date(reserva.fechaFin).toLocaleDateString() : ""}</td>
             <td>
                {typeof reserva.categoria === "object"
                  ? reserva.categoria?.nombre || reserva.categoria?._id || "N/A"
                  : reserva.categoria || "N/A"}
              </td>
              <td>{reserva.observaciones}</td>
              <td>
                {typeof reserva.solicitud === "object"
                  ? reserva.solicitud?._id || "N/A"
                  : reserva.solicitud || "N/A"}
              </td>
              <td>
                <button className="btn-editar" onClick={() => onEditar(reserva)}>
                  ✏️
                </button>
                {onEliminar && (
                  <button className="btn-eliminar" onClick={() => onEliminar(reserva._id)}>
                    🗑️
                  </button>
                )}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default TablaReservas;