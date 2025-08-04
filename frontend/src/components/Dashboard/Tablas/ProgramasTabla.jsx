import React from 'react';

const ProgramasTabla = ({
  programas = [],
  abrirModalEditar,
  eliminarPrograma,
  formatearPrecio,
  formatearFecha
}) => {
  return (
    <div className="table-container-Academicos">
      <table className="programas-table-Academicos">
        <thead>
          <tr>
            <th>Programa</th>
            <th>Profesor</th>
            <th>Tipo</th>
            <th>Modalidad</th>
            <th>Precio</th>
            <th>Fecha Inicio</th>
            <th>Cupos</th>
            <th>Estado</th>

          </tr>
        </thead>
        <tbody>
          {programas.map(programa => (
            <tr key={programa._id}>
              <td>
                <div className="programa-info">
                  <h4>{programa.titulo}</h4>
                 
                  {programa.destacado && (
                    <span className="badge-destacado">Destacado</span>
                  )}
                </div>
              </td>
              <td> <p>{programa.profesor}</p></td>
              <td>
                <span className={`badge badge-${programa.tipo}`}>
                  {programa.tipo.charAt(0).toUpperCase() + programa.tipo.slice(1)}
                </span>
              </td>
              <td>{programa.modalidad}</td>
              <td>{formatearPrecio(programa.precio)}</td>
              <td>{formatearFecha(programa.fechaInicio)}</td>
              <td>
                <span className="cupos-info">
                  {programa.cuposOcupados || 0}/{programa.cupos}
                </span>
              </td>
              <td>
                <span className={`badge ${programa.activo ? 'badge-success' : 'badge-secondary'}`}>
                  {programa.activo ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td>
               
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {programas.length === 0 && (
        <div className="no-data">
          <i className="fas fa-graduation-cap"></i>
          <h3>No hay programas académicos</h3>
          <p>Crea el primer programa académico para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default ProgramasTabla;
