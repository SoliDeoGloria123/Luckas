import React from 'react';

const CursoTabla = ({ cursos = [], abrirModal, eliminarCurso }) => {
  return (
    <div className="tabla-container">
      <table className="cursos-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Nivel</th>
            <th>Modalidad</th>
            <th>Instructor</th>
            <th>Cupos</th>
            <th>Fecha Inicio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {cursos.map(curso => (
            <tr key={curso._id}>
              <td>{curso.nombre}</td>
              <td>{curso.categoria}</td>
              <td>{curso.nivel}</td>
              <td>{curso.modalidad}</td>
              <td>{curso.instructor}</td>
              <td>{curso.cuposOcupados}/{curso.cuposDisponibles}</td>
              <td>{new Date(curso.fechaInicio).toLocaleDateString()}</td>
              <td>
                <span className={`estado ${curso.estado}`}>
                  {curso.estado}
                </span>
              </td>
              <td className="acciones">
                <button 
                  className="btn-editar" 
                  onClick={() => abrirModal(curso)}
                >
                  Editar
                </button>
                <button 
                  className="btn-eliminar" 
                  onClick={() => eliminarCurso(curso._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CursoTabla;
