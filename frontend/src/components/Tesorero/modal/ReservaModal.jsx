import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { userService } from '../../../services/userService';

// Función movida fuera del componente para evitar recrearla en cada render
function normalizeFecha(fecha) {
  if (!fecha) return '';
  // Si ya está en formato YYYY-MM-DD, devolver tal cual
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  // Si es un objeto Date o string con T, formatear
  try {
    const d = new Date(fecha);
    if (!Number.isNaN(d.getTime())) {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  } catch (error) {
    console.error('Error normalizando fecha:', error);
  }
  return '';
}

const ReservaModal = ({ mode = 'create', initialData = {}, onClose, onSubmit, usuarios, cabanas }) => {
  const [formData, setFormData] = useState({
    usuario: initialData.usuario || '',
    cabana: initialData.cabana || '',
    fechaInicio: normalizeFecha(initialData.fechaInicio),
    fechaFin: normalizeFecha(initialData.fechaFin),
    precio: initialData.precio || '',
    estado: initialData.estado || '',
    observaciones: initialData.observaciones || '',
    activo: initialData.activo || 'Activo',
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    tipoDocumento: initialData.tipoDocumento || '',
    numeroDocumento: initialData.numeroDocumento || '',
    correoElectronico: initialData.correoElectronico || '',
    telefono: initialData.telefono || '',
    numeroPersonas: initialData.numeroPersonas || 1,
    propositoEstadia: initialData.propositoEstadia || '',
    solicitudesEspeciales: initialData.solicitudesEspeciales || ''
  });


  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Si el campo es numeroDocumento y tiene al menos 6 caracteres, buscar usuario
    if (name === 'numeroDocumento' && value.length >= 6) {
      try {
        const usuario = await userService.getByDocumento(value);
        if (usuario) {
          setFormData(prev => ({
            ...prev,
            usuario: usuario._id || '',
            nombre: usuario.nombre || '',
            apellido: usuario.apellido || '',
            tipoDocumento: usuario.tipoDocumento || '',
            correoElectronico: usuario.correo || '',
            telefono: usuario.telefono || '',
          }));
        }
      } catch (err) {
        console.error('Error al buscar usuario por documento:', err);
      }
    }
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
                <label htmlFor="usuario">Usuarios</label>
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
                <label htmlFor="cabana">Cabañas</label>
                <select
                  name="cabana"
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
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del responsable"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido del responsable"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="tipoDocumento">Tipo de Documento</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                  <option value="Cédula de extranjería">Cédula de extranjería</option>
                  <option value="Pasaporte">Pasaporte</option>
                  <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                </select>
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="numeroDocumento">Número de Documento</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="correoElectronico">Correo Electrónico</label>
                <input
                  type="email"
                  name="correoElectronico"
                  value={formData.correoElectronico}
                  onChange={handleChange}
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono de contacto"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="numeroPersonas">Número de Personas</label>
                <input
                  type="number"
                  name="numeroPersonas"
                  value={formData.numeroPersonas}
                  onChange={handleChange}
                  min={1}
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="propositoEstadia">Propósito de la Estadia</label>
                <input
                  type="text"
                  name="propositoEstadia"
                  value={formData.propositoEstadia}
                  onChange={handleChange}
                  placeholder="Motivo de la estadía"
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="solicitudesEspeciales">Solicitudes Especiales</label>
                <input
                  type="text"
                  name="solicitudesEspeciales"
                  value={formData.solicitudesEspeciales}
                  onChange={handleChange}
                  placeholder="Solicitudes especiales (opcional)"
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="precio">Precio</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  placeholder="Precio de la reserva"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="fechaInicio">Fecha Inicio:</label>
                <input
                  type="date"
                  name="fechaInicio"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="fechaFin">Fecha Fin:</label>
                <input
                  type="date"
                  name="fechaFin"
                  value={formData.fechaFin}
                  onChange={handleChange}
          
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="estado">Estado</label>
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
                <label htmlFor="activo">Activo</label>
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
                <label htmlFor="observaciones">Observaciones</label>
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
ReservaModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  usuarios: PropTypes.array.isRequired,
  cabanas: PropTypes.array.isRequired
};

export default ReservaModal;