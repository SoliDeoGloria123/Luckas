import React, { useState } from 'react';


const TareaModal = ({ mode = 'create', initialData = {}, onClose, onSubmit, usuarios }) => {
 
  function normalizeFecha(fecha) {
    if (!fecha) return '';
    // Si ya está en formato YYYY-MM-DD, devolver tal cual
    if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
    // Si es un objeto Date o string con T, formatear
    try {
      const d = new Date(fecha);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    } catch (e) {}
    return '';
  }
  const [formData, setFormData] = useState({
    titulo: initialData.titulo || '',
    descripcion: initialData.descripcion || '',
    estado: initialData.estado || '',
    prioridad: initialData.prioridad || '',
    asignadoA: initialData.asignadoA ? String(initialData.asignadoA) :'',
    asignadoPor: initialData.asignadoPor || '',
    fechaLimite: normalizeFecha (initialData.fechaLimite ),
    comentarios: initialData.comentarios || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="modal-overlay-tesorero">
      <div className="tesorero-modal">
        <div className="modal-header-tesorero">
          <h2>{mode === 'create' ? 'Crear Nuevo Tarea' : 'Editar Tarea'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label>Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Descripción</label>
                <input
                  type="text"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Fecha Límite</label>
                <input
                  type="date"
                  name="fechaLimite"
                  value={formData.fechaLimite}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Asignado a</label>
                <select
                  name="asignadoA"
                  value={formData.asignadoA ? String(formData.asignadoA): ''}
                  onChange={handleChange}
                >
                  <option value="">Seleccione...</option>
                  {usuarios && usuarios.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.nombre} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Asignado por</label>
                <select
                  name="asignadoPor"
                  value={formData.asignadoPor}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {usuarios && usuarios.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.nombre} ({user.role})
                    </option>
                  ))}
                </select>
              </div>


              <div className="form-group-tesorero">
                <label>Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  required
                >
                  <option>Seleccione...</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                  <option value="baja">Baja</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option>Seleccione...</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Tarea' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TareaModal;