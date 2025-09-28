import React from "react";
const TablaCategorias = ({ categorias, onEditar, onEliminar }) => (
  <div className="tabla-contenedor-admin">
    <table className="tabla-usuarios-admin">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Tipo de categoria</th>
          <th>Codigo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {categorias.length === 0 ? (
          <tr>
            <td colSpan={5}>No hay categorías para mostrar</td>
          </tr>
        ) : (
          categorias.map((cat) => (
            <tr key={cat._id}>
              <td>{cat._id}</td>
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
                  <button className="btn-action editar" onClick={() => onEditar(cat)}><i class="fas fa-edit"></i></button>
                  {onEliminar && (
                    <button className="btn-action eliminar" onClick={() => onEliminar(cat._id)}><i class="fas fa-trash"></i></button>
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

export default TablaCategorias;