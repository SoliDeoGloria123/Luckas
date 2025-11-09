import React from "react";
import PropTypes from "prop-types";

const renderEstadoActivo = (activo) => {
  if (activo === undefined) return 'N/A';
  return activo ? 'Activo' : 'Desactivado';
};

const TablaReservas = ({ reservas, onEditar, onEliminar }) => (
  <div className="tabla-responsive">
    <div className="tabla-contenedor-admin">
      <table className="tabla-usuarios-admin">
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Cabaña</th>
            <th>Fecha Inicio</th>
            <th>Fecha Fin</th>PropTypes
            <th>Número de Personas</th>
            <th>Tipo de Documento</th>
            <th>Número de Documento</th>
            <th>Correo Electrónico</th>
            <th>Teléfono</th>
            <th>Propósito de Estadía</th>
            <th>Estado</th>
            <th>Observaciones</th>
            <th>Solicitud</th>
            <th>Activo</th>
            <th>Fecha de creación</th>
            <th>Fecha de actualización</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reservas.length === 0 ? (
            <tr>
              <td colSpan={19}>No hay reservas para mostrar</td>
            </tr>
          ) : (
            reservas.map((reserva) => (
              <tr key={reserva._id}>
                <td>{reserva._id}</td>
                <td>
                  {typeof reserva.usuario === "object"
                    ? `${reserva.usuario?.nombre || ""} ${reserva.usuario?.apellido || ""}`.trim() ||
                      reserva.usuario?.username ||
                      reserva.usuario?.correo ||
                      reserva.usuario?._id ||
                      "N/A"
                    : reserva.usuario || "N/A"}
                </td>
                <td>
                  {typeof reserva.cabana === "object"
                    ? reserva.cabana?.nombre || reserva.cabana?._id || "N/A"
                    : reserva.cabana || "N/A"}
                </td>
                <td>{reserva.fechaInicio ? new Date(reserva.fechaInicio).toLocaleDateString() : ""}</td>
                <td>{reserva.fechaFin ? new Date(reserva.fechaFin).toLocaleDateString() : ""}</td>
                <td>{reserva.numeroPersonas || "N/A"}</td>
                <td>{reserva.tipoDocumento || "N/A"}</td>
                <td>{reserva.numeroDocumento || "N/A"}</td>
                <td>{reserva.correoElectronico || "N/A"}</td>
                <td>{reserva.telefono || "N/A"}</td>
                <td>{reserva.propositoEstadia || "N/A"}</td>
                <td>
                  <span className={`badge-estado estado-${(reserva.estado || "pendiente").toLowerCase()}`}>
                    {reserva.estado || "Pendiente"}
                  </span>
                </td>
                <td>{reserva.observaciones || "N/A"}</td>
                <td>
                  {typeof reserva.solicitud === "object"
                    ? reserva.solicitud?._id || "N/A"
                    : reserva.solicitud || "N/A"}
                </td>
                <td>{renderEstadoActivo(reserva.activo)}</td>
                <td>{reserva.createdAt ? new Date(reserva.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>{reserva.updatedAt ? new Date(reserva.updatedAt).toLocaleDateString() : "N/A"}</td>
                <td>
                  <div className="acciones-botones">
                    <button className="btn-action editar" onClick={() => onEditar(reserva)}>
                      <i className="fas fa-edit"></i>
                    </button>
                    {onEliminar && (
                      <button className="btn-action eliminar" onClick={() => onEliminar(reserva._id)}>
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
  </div>
);

TablaReservas.propTypes = {
  reservas: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func,
};
export default TablaReservas;