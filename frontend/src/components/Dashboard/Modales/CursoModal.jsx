import React from 'react';

const CursoModal = ({
  mostrarModal,
  modoEdicion,
  cerrarModal,
  mensajeError,
  mensajeExito,
  manejarEnvio,
  nuevoCurso,
  manejarCambio,
  manejarCambioDias
}) => {
  if (!mostrarModal) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h3>{modoEdicion ? 'Editar Curso' : 'Crear Nuevo Curso'}</h3>
          <button className="btn-cerrar" onClick={cerrarModal}>×</button>
        </div>
        {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
        {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
        <form onSubmit={manejarEnvio} className="curso-form">
          <div className="form-row">
            <div className="form-group-curso">
              <label>Nombre del Curso</label>
              <input type="text" value={nuevoCurso.nombre} onChange={e => manejarCambio('nombre', e.target.value)} required />
            </div>
            <div className="form-group-curso">
              <label>Instructor</label>
              <input type="text" value={nuevoCurso.instructor} onChange={e => manejarCambio('instructor', e.target.value)} required />
            </div>
          </div>
          <div className="form-group-curso">
            <label>Descripción</label>
            <textarea value={nuevoCurso.descripcion} onChange={e => manejarCambio('descripcion', e.target.value)} rows={3} required />
          </div>
          <div className="form-row">
            <div className="form-group-curso">
              <label>Categoría</label>
              <select value={nuevoCurso.categoria} onChange={e => manejarCambio('categoria', e.target.value)} required>
                <option value="biblico">Bíblico</option>
                <option value="ministerial">Ministerial</option>
                <option value="liderazgo">Liderazgo</option>
                <option value="evangelismo">Evangelismo</option>
                <option value="pastoral">Pastoral</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div className="form-group-curso">
              <label>Nivel</label>
              <select value={nuevoCurso.nivel} onChange={e => manejarCambio('nivel', e.target.value)} required>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>
            <div className="form-group-curso">
              <label>Modalidad</label>
              <select value={nuevoCurso.modalidad} onChange={e => manejarCambio('modalidad', e.target.value)} required>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="semipresencial">Semipresencial</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-curso">
              <label>Horas de Duración</label>
              <input type="number" value={nuevoCurso.duracion.horas} onChange={e => manejarCambio('duracion.horas', e.target.value)} required />
            </div>
            <div className="form-group-curso">
              <label>Semanas</label>
              <input type="number" value={nuevoCurso.duracion.semanas} onChange={e => manejarCambio('duracion.semanas', e.target.value)} required />
            </div>
            <div className="form-group-curso">
              <label>Cupos Disponibles</label>
              <input type="number" value={nuevoCurso.cuposDisponibles} onChange={e => manejarCambio('cuposDisponibles', e.target.value)} required />
            </div>
            <div className="form-group-curso">
              <label>Costo</label>
              <input type="number" value={nuevoCurso.costo} onChange={e => manejarCambio('costo', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-curso">
              <label>Fecha de Inicio</label>
              <input type="date" value={nuevoCurso.fechaInicio} onChange={e => manejarCambio('fechaInicio', e.target.value)} required />
            </div>
            <div className="form-group-curso">
              <label>Fecha de Fin</label>
              <input type="date" value={nuevoCurso.fechaFin} onChange={e => manejarCambio('fechaFin', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-curso">
              <label>Hora de Inicio</label>
              <input type="time" value={nuevoCurso.horario.horaInicio} onChange={e => manejarCambio('horario.horaInicio', e.target.value)} required />
            </div>
            <div className="form-group-curso">
              <label>Hora de Fin</label>
              <input type="time" value={nuevoCurso.horario.horaFin} onChange={e => manejarCambio('horario.horaFin', e.target.value)} required />
            </div>
          </div>
          <div className="form-group-curso">
            <label>Días de la Semana</label>
            <div className="dias-checkbox">
              {['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'].map(dia => (
                <label key={dia} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={nuevoCurso.horario.dias.includes(dia)}
                    onChange={() => manejarCambioDias(dia)}
                  />
                  {dia.charAt(0).toUpperCase() + dia.slice(1)}
                </label>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancelar-curso" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar-curso">
              {modoEdicion ? 'Actualizar' : 'Crear'} Curso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CursoModal;
