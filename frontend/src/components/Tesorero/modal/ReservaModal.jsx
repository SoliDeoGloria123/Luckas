import React, { useState } from 'react';


const ReservaModal = ({ mode = 'create', initialData = {}, onClose, onSubmit, usuarios, cabanas }) => {
  const [formData, setFormData] = useState({
    usuario: initialData.usuario || '',
    cabana: initialData.cabana || '',
    fechaInicio: initialData.fechaInicio || '',
    fechaFin: initialData.fechaFin || '',
    precio: initialData.precio || '',
    estado: initialData.estado || '',
    observaciones: initialData.observaciones || '',
    activo: initialData.activo || 'Activo'
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
          <h2>{mode === 'create' ? 'Crear Nuevo Reserva' : 'Editar Reserva'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label>Usuarios</label>
                <select
                  name="usuario"
                  value={formData.usuario}
                  onChange={handleChange}
             
                >
                  <option value="">Seleccione...</option>
                  {usuarios && usuarios.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.nombre || user.username || user.correo} ({user.role})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Cabañas</label>
                <select
                  name="cabaña"
                  value={formData.cabana}
                  onChange={handleChange}
           
                >
                  <option value="">Seleccione...</option>
                  {cabanas && cabanas.map(cab => (
                    <option key={cab._id} value={cab._id}>
                      {cab.nombre} {cab.precio ? `- $${cab.precio}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precion de la reserva"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Fecha Inicio:</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                
                />
              </div>

              <div className="form-group-tesorero">
                <label>Fecha Fin:</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
          
                />
              </div>

              <div className="form-group-tesorero">
                <label>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmada">Confirmada</option>
                  <option value="Cancelada">Cancelada</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Activo</label>
                <select
                  name="activo"
                  value={formData.activo}
                  onChange={handleChange}
                  required
                >
                  <option>Seleccione...</option>
                  <option value="true">Sí</option>
                  <option value="false">No</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Observaciones</label>
                <input
                 type='text'
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Reserva' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div >
    </div >
  );
};

export default ReservaModal;