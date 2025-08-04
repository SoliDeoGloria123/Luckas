import React from 'react';

const TecnicoTabla = ({ programas, abrirModal, eliminarPrograma }) => {
  return (
    <div className="tabla-container">
      <table className="programas-tabla">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Área</th>
            <th>Nivel</th>
            <th>Modalidad</th>
            <th>Coordinador</th>
            <th>Duración</th>
            <th>Cupos</th>
            <th>Fecha Inicio</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {programas && programas.length > 0 ? (
            programas.map(programa => (
              <tr key={programa._id}>
                <td>{programa.nombre}</td>
                <td>{programa.area}</td>
                <td>{programa.nivel.replace('_', ' ')}</td>
                <td>{programa.modalidad}</td>
                <td>{programa.coordinador}</td>
                <td>{programa.duracion.meses} meses</td>
                <td>{programa.cuposOcupados}/{programa.cuposDisponibles}</td>
                <td>{new Date(programa.fechaInicio).toLocaleDateString()}</td>
                <td>
                  <span className={`estado ${programa.estado}`}>
                    {programa.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="acciones">
                  <button 
                    className="btn-editar" 
                    onClick={() => abrirModal(programa)}
                  >
                    Editar
                  </button>
                  <button 
                    className="btn-eliminar" 
                    onClick={() => eliminarPrograma(programa._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: 'center' }}>No hay programas técnicos para mostrar.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TecnicoTabla;
