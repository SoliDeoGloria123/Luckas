import React from "react";
import { FaEye } from "react-icons/fa";


const CabanaTabla = ({ cabanas, onEditar, onEliminar, onVerImagen }) => (
  <div className="tabla-contenedor-admin">
    <table className="tabla-usuarios-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Descripción</th>
          <th>Capacidad</th>
          <th>Categoría</th>
          <th>Precio</th>
          <th>Estado</th>
          <th>Creado por</th>
          <th>imagen</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {cabanas.length === 0 ? (
          <tr>
            <td colSpan={7}>No hay cabañas para mostrar</td>
          </tr>
        ) : (
          cabanas.map((cabana) => (
            <tr key={cabana._id}>
              <td>{cabana._id}</td>
              <td>{cabana.nombre}</td>
              <td>{cabana.descripcion}</td>
              <td>{cabana.capacidad}</td>
              <td>{cabana.categoria?.nombre || cabana.categoria || "N/A"}</td>
              <td>{cabana.precio}</td>
              <td>
                <span className={`badge-estado estado-${(cabana.estado || "pendiente").toLowerCase()}`}>
                  {cabana.estado || "Pendiente"}
                </span>
              </td>
              <td>{cabana.creadoPor?.nombre || cabana.creadoPor || "N/A"}</td>
              <td>
                {Array.isArray(cabana.imagen) && cabana.imagen.length > 0 ? (
                  <button onClick={() => onVerImagen(cabana.imagen)} className="btn-ver-imagen">
                    <FaEye />
                  </button>
                ) : (
                  "Sin imagen"
                )}
              </td>

              <td>
                <div className="acciones-botones">
                  <button className="btn-action editar" onClick={() => onEditar(cabana)}>
                    <i className="fas fa-edit"></i>
                  </button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(cabana._id)}>
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
export default CabanaTabla;