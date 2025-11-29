import React from "react";
import PropTypes from "prop-types";


const TablaCategorias = ({ categorias, onEditar, onEliminar, onToggleEstado }) => (
  <div className="tabla-contenedor-admin">
    <table className="tabla-usuarios-admin">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Tipo de categoria</th>
          <th>Codigo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        
          {categorias.map((cat) => (
            <tr key={cat._id}>
          
              <td>{cat.nombre}</td>
              <td>{cat.tipo}</td>
              <td>{cat.codigo}</td>
              <td>
                <span className={`badge-estado estado-${cat.estado || "activo"}`}>
                  {cat.estado || "activo"}
                </span>
              </td>
              <td>
                <div className="acciones-botones">
                  <button className="btn-action editar" onClick={() => onEditar(cat)}><i className="fas fa-edit"></i></button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(cat._id)}><i className="fas fa-trash"></i></button>
                  )}

                  <button
                    className={`btn-action ${cat.estado === "activo" ? "desactivar" : "activar"}`}
                    onClick={() => onToggleEstado(cat)}
                  >
                    {cat.estado === "activo" ? (
                      <i className="fas fa-ban"></i>
                    ) : (
                      <i className="fas fa-check"></i>
                    )}
                  </button>
                </div>
              </td>
            </tr>
         
        ))}
      </tbody>
    </table>
  </div>
);

TablaCategorias.propTypes = {
  categorias: PropTypes.array.isRequired,
  onEditar: PropTypes.func.isRequired,
  onEliminar: PropTypes.func,
  onToggleEstado: PropTypes.func.isRequired
};

export default TablaCategorias;