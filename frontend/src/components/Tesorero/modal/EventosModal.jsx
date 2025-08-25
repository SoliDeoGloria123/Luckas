import React, { useState } from 'react';


const EventosModal = ({ mode = 'create', initialData = {}, onClose, onSubmit, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: initialData.nombre || '',
    descripcion: initialData.descripcion || '',
    precio: initialData.precio || '',
    categoria: initialData.categoria || '',
    telefono: initialData.telefono || '',
    etiquetas: initialData.etiquetas || '',
    fechaEvento: initialData.fechaEvento || '',
    horaInicio: initialData.horaInicio || '',
    horaInicio: initialData.horaFin || '',
    lugar: initialData.lugar || '',
    direccion: initialData.direccion || '',
    duracionDias: initialData.duracionDias || '',
    cuposTotales: initialData.cuposTotales || '',
    cuposDisponibles: initialData.cuposDisponibles || '',
    prioridad: initialData.prioridad || '',
    observaciones: initialData.observaciones,
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
          <h2>{mode === 'create' ? 'Crear Nuevo Evento' : 'Editar Evento'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label>Nombre Evento</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>DEscripcion Evento</label>
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
                <label>Precio Evento</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Categoria</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  {categorias && categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Etiquetas Evento</label>
                <input
                  type="text"
                  name="etiquetas"
                  value={formData.etiquetas}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Fecha Evento</label>
                <input
                  type="text"
                  name="fechaEvento"
                  value={formData.fechaEvento}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label>Hora Inicia Evento</label>
                <input
                  type="text"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label>Hora fin Evento</label>
                <input
                  type="text"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label>Lugar</label>
                <input
                  type="text"
                  name="lugar"
                  value={formData.lugar}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Direccion</label>
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label>Cupos Totales</label>
                <input
                  type="text"
                  name="cuposTotales"
                  value={formData.cuposTotales}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Cupos Disponibles</label>
                <input
                  type="text"
                  name="cuposDisponibles"
                  value={formData.cuposDisponibles}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Prioridad</label>
                <select
                  name="prioridad"
                  value={formData.prioridad}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="form-group-tesorero">
                <label>Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label>Imagen</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>

            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Evento' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventosModal;