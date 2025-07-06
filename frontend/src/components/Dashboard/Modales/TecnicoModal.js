import React from 'react';

const TecnicoModal = ({
  mostrarModal,
  modoEdicion,
  cerrarModal,
  mensajeError,
  mensajeExito,
  manejarEnvio,
  nuevoPrograma,
  manejarCambio
}) => {
  if (!mostrarModal) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-contenido">
        <div className="modal-header">
          <h3>{modoEdicion ? 'Editar Programa Técnico' : 'Crear Nuevo Programa Técnico'}</h3>
          <button className="btn-cerrar" onClick={cerrarModal}>×</button>
        </div>
        {mensajeError && <div className="mensaje-error">{mensajeError}</div>}
        {mensajeExito && <div className="mensaje-exito">{mensajeExito}</div>}
        <form onSubmit={manejarEnvio} className="curso-form">
          <div className="form-row">
            <div className="form-group-Tecnico">
              <label>Nombre del Programa</label>
              <input type="text" value={nuevoPrograma.nombre} onChange={e => manejarCambio('nombre', e.target.value)} required />
            </div>
            <div className="form-group-Tecnico">
              <label>Coordinador</label>
              <input type="text" value={nuevoPrograma.coordinador} onChange={e => manejarCambio('coordinador', e.target.value)} required />
            </div>
          </div>
          <div className="form-group-Tecnico">
            <label>Descripción</label>
            <textarea value={nuevoPrograma.descripcion} onChange={e => manejarCambio('descripcion', e.target.value)} rows={3} required />
          </div>
          <div className="form-row">
            <div className="form-group-Tecnico">
              <label>Área</label>
              <select value={nuevoPrograma.area} onChange={e => manejarCambio('area', e.target.value)} required>
                <option value="tecnologia">Tecnología</option>
                <option value="administracion">Administración</option>
                <option value="oficios">Oficios</option>
                <option value="arte_diseno">Arte y Diseño</option>
                <option value="salud">Salud</option>
                <option value="otros">Otros</option>
              </select>
            </div>
            <div className="form-group-Tecnico">
              <label>Nivel</label>
              <select value={nuevoPrograma.nivel} onChange={e => manejarCambio('nivel', e.target.value)} required>
                <option value="tecnico_laboral">Técnico Laboral</option>
                <option value="tecnico_profesional">Técnico Profesional</option>
                <option value="especializacion_tecnica">Especialización Técnica</option>
              </select>
            </div>
            <div className="form-group-Tecnico">
              <label>Modalidad</label>
              <select value={nuevoPrograma.modalidad} onChange={e => manejarCambio('modalidad', e.target.value)} required>
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="semipresencial">Semipresencial</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-Tecnico">
              <label>Duración (Meses)</label>
              <input type="number" value={nuevoPrograma.duracion.meses} onChange={e => manejarCambio('duracion.meses', e.target.value)} required />
            </div>
            <div className="form-group-Tecnico">
              <label>Duración (Horas)</label>
              <input type="number" value={nuevoPrograma.duracion.horas} onChange={e => manejarCambio('duracion.horas', e.target.value)} required />
            </div>
            <div className="form-group-Tecnico">
              <label>Cupos Disponibles</label>
              <input type="number" value={nuevoPrograma.cuposDisponibles} onChange={e => manejarCambio('cuposDisponibles', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-Tecnico">
              <label>Fecha de Inicio</label>
              <input type="date" value={nuevoPrograma.fechaInicio} onChange={e => manejarCambio('fechaInicio', e.target.value)} required />
            </div>
            <div className="form-group-Tecnico">
              <label>Fecha de Fin</label>
              <input type="date" value={nuevoPrograma.fechaFin} onChange={e => manejarCambio('fechaFin', e.target.value)} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group-Tecnico">
              <label>Costo Matrícula</label>
              <input type="number" value={nuevoPrograma.costo.matricula} onChange={e => manejarCambio('costo.matricula', e.target.value)} required />
            </div>
            <div className="form-group-Tecnico">
              <label>Costo Mensualidad</label>
              <input type="number" value={nuevoPrograma.costo.mensualidad} onChange={e => manejarCambio('costo.mensualidad', e.target.value)} required />
            </div>
            <div className="form-group-Tecnico">
              <label>Costo Certificación</label>
              <input type="number" value={nuevoPrograma.costo.certificacion} onChange={e => manejarCambio('costo.certificacion', e.target.value)} />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-cancelar-curso" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" className="btn-guardar-curso">
              {modoEdicion ? 'Actualizar' : 'Crear'} Programa Técnico
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TecnicoModal;
