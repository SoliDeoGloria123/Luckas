import React from "react";

const TablaReservas = ({ reservas, onEditar, onEliminar }) => (
  <div className="tabla-contenedor-admin">
    <table className="tabla-usuarios-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Usuario</th>
          <th>Cabaña</th>
          <th>Fecha Inicio</th>
          <th>Fecha Fin</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Observaciones</th>
          <th>Solicitud</th>
          <th>Activo</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {reservas.length === 0 ? (
          <tr>
            <td colSpan={12}>No hay reservas para mostrar</td>
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
              <td>{reserva.precio ? `$${Number(reserva.precio).toLocaleString('es-CO')}` : 'N/A'}</td>
              <td>
                <span className={`badge-estado estado-${(reserva.estado || "pendiente").toLowerCase()}`}>
                  {reserva.estado || "Pendiente"}
                </span>
              </td>

              <td>{reserva.observaciones}</td>
              <td>
                {typeof reserva.solicitud === "object"
                  ? reserva.solicitud?._id || "N/A"
                  : reserva.solicitud || "N/A"}
              </td>
              <td>
                {reserva.activo === undefined ? 'N/A' : reserva.activo ? 'Sí' : 'No'}
              </td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-action editar" onClick={() => onEditar(reserva)}>
                 <i class="fas fa-edit"></i>
                  </button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(reserva._id)}>
                     <i class="fas fa-trash"></i>
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

export default TablaReservas;