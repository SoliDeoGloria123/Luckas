import React from 'react';

const ProgramasModal = ({
  modalEditar,
  cerrarModales,
  handleSubmit,
  formData,
  setFormData,
  actualizarRequisito,
  removerRequisito,
  agregarRequisito,
  actualizarModuloPensum,
  removerModuloPensum,
  agregarModuloPensum
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header-Academicos">
          <h2>{modalEditar ? 'Editar Programa Académico' : 'Crear Programa Académico'}</h2>
          <button className="modal-close" onClick={cerrarModales}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="modal-body-Academicos">
          <form onSubmit={handleSubmit}>
            {/* Información básica */}
            <div className="form-section">
              <h3>Información Básica</h3>
              <div className="form-grid-Academicos">
                <div className="form-group-Academicos">
                  <label>Título del Programa *</label>
                  <input type="text" value={formData.titulo} onChange={e => setFormData({ ...formData, titulo: e.target.value })} required />
                </div>
                <div className="form-group-Academicos">
                  <label>Tipo *</label>
                  <select value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} required>
                    <option value="curso">Curso</option>
                    <option value="tecnico">Técnico</option>
                    <option value="especializacion">Especialización</option>
                    <option value="diplomado">Diplomado</option>
                  </select>
                </div>
                <div className="form-group-Academicos">
                  <label>Modalidad *</label>
                  <select value={formData.modalidad} onChange={e => setFormData({ ...formData, modalidad: e.target.value })} required>
                    <option value="presencial">Presencial</option>
                    <option value="virtual">Virtual</option>
                    <option value="mixta">Mixta</option>
                  </select>
                </div>
                <div className="form-group-Academicos">
                  <label>Duración *</label>
                  <input type="text" placeholder="ej: 6 meses, 1 año" value={formData.duracion} onChange={e => setFormData({ ...formData, duracion: e.target.value })} required />
                </div>
                <div className="form-group-Academicos">
                  <label>Precio (COP) *</label>
                  <input type="number" min="0" value={formData.precio} onChange={e => setFormData({ ...formData, precio: e.target.value })} required />
                </div>
                <div className="form-group-Academicos">
                  <label>Cupos Disponibles *</label>
                  <input type="number" min="1" value={formData.cupos} onChange={e => setFormData({ ...formData, cupos: e.target.value })} required />
                </div>
                <div className="form-group-Academicos">
                  <label>Fecha de Inicio *</label>
                  <input type="date" value={formData.fechaInicio} onChange={e => setFormData({ ...formData, fechaInicio: e.target.value })} required />
                </div>
                <div className="form-group-Academicos">
                  <label>Fecha de Fin</label>
                  <input type="date" value={formData.fechaFin} onChange={e => setFormData({ ...formData, fechaFin: e.target.value })} />
                </div>
              </div>
              <div className="form-group-Academicos">
                <label>Descripción *</label>
                <textarea rows="3" value={formData.descripcion} onChange={e => setFormData({ ...formData, descripcion: e.target.value })} required />
              </div>
              <div className="form-group-Academicos">
                <label>
                  <input type="checkbox" checked={formData.destacado} onChange={e => setFormData({ ...formData, destacado: e.target.checked })} />
                  Programa Destacado
                </label>
              </div>
            </div>
            {/* Información del profesor */}
            <div className="form-section">
              <h3>Profesor</h3>
              <div className="form-group-Academicos">
                <label>Nombre del Profesor *</label>
                <input type="text" value={formData.profesor} onChange={e => setFormData({ ...formData, profesor: e.target.value })} required />
              </div>
              <div className="form-group-Academicos">
                <label>Biografía del Profesor</label>
                <textarea rows="3" value={formData.profesorBio} onChange={e => setFormData({ ...formData, profesorBio: e.target.value })} />
              </div>
            </div>
            {/* Requisitos */}
            <div className="form-section">
              <h3>Requisitos</h3>
              {formData.requisitos.map((requisito, index) => (
                <div key={index} className="dynamic-field">
                  <input type="text" placeholder={`Requisito ${index + 1}`} value={requisito} onChange={e => actualizarRequisito(index, e.target.value)} />
                  <button type="button" className="btn-remove" onClick={() => removerRequisito(index)} disabled={formData.requisitos.length === 1}>
                    <i className="fas fa-minus"></i>
                  </button>
                </div>
              ))}
              <button type="button" className="btn-add" onClick={agregarRequisito}>
                <i className="fas fa-plus"></i>
                Agregar Requisito
              </button>
            </div>
            {/* Plan de estudios */}
            <div className="form-section">
              <h3>Plan de Estudios</h3>
              {formData.pensum.map((modulo, index) => (
                <div key={index} className="pensum-item">
                  <div className="form-grid-Academicos">
                    <div className="form-group-Academicos">
                      <input type="text" placeholder="Nombre del módulo" value={modulo.modulo} onChange={e => actualizarModuloPensum(index, 'modulo', e.target.value)} />
                    </div>
                    <div className="form-group-Academicos">
                      <input type="number" placeholder="Horas" value={modulo.horas} onChange={e => actualizarModuloPensum(index, 'horas', e.target.value)} />
                    </div>
                  </div>
                  <textarea placeholder="Descripción del módulo" value={modulo.descripcion} onChange={e => actualizarModuloPensum(index, 'descripcion', e.target.value)} rows="2" />
                  <button type="button" className="btn-remove" onClick={() => removerModuloPensum(index)} disabled={formData.pensum.length === 1}>
                    <i className="fas fa-minus"></i>
                    Remover módulo
                  </button>
                </div>
              ))}
              <button type="button" className="btn-add" onClick={agregarModuloPensum}>
                <i className="fas fa-plus"></i>
                Agregar Módulo
              </button>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={cerrarModales}>
                Cancelar
              </button>
              <button type="submit" className="btn-primary">
                <i className="fas fa-save"></i>
                {modalEditar ? 'Actualizar' : 'Crear'} Programa
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProgramasModal;
