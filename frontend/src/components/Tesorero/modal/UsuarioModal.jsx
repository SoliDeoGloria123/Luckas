import React, { useState } from 'react';
import PropTypes from 'prop-types';



function toInputDateFormat(fecha) {
  if (!fecha) return '';
  
  // Si es un objeto Date, convertirlo a string ISO
  if (fecha instanceof Date) {
    return fecha.toISOString().split('T')[0];
  }
  
  // Si es un string de fecha ISO, extraer solo la parte de fecha
  if (typeof fecha === 'string' && fecha.includes('T')) {
    return fecha.split('T')[0];
  }
  
  // Si ya está en formato YYYY-MM-DD, retorna igual
  if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) return fecha;
  
  // Si viene en formato DD/MM/YYYY, lo convierte
  if (typeof fecha === 'string' && fecha.includes('/')) {
    const partes = fecha.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
    }
  }
  
  return '';
}

const UsuarioModal = ({ mode = 'create', initialData = {}, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '',
    fechaNacimiento: '',
    role: '',
    estado: 'Activo',
    password: ''
  });

  // useEffect para actualizar formData cuando cambien los initialData
  React.useEffect(() => {
    setFormData({
      nombre: initialData.nombre || '',
      apellido: initialData.apellido || '',
      correo: initialData.correo || '',
      telefono: initialData.telefono || '',
      tipoDocumento: initialData.tipoDocumento || 'Cédula de ciudadanía',
      numeroDocumento: initialData.numeroDocumento || '',
      fechaNacimiento: toInputDateFormat(initialData.fechaNacimiento) || '',
      role: initialData.role || '',
      estado: initialData.estado || 'Activo',
      password: initialData.password || ''
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Normalizar los valores antes de enviar
    const dataToSend = {
      ...formData,
      correo: formData.correo.trim().toLowerCase(),
      password: formData.password.trim(),
      estado: formData.estado.toLowerCase(),
      role: formData.role.toLowerCase(),
    };
    console.log("Datos a enviar:", dataToSend); // Para depuración
    onSubmit(dataToSend);
    onClose();
  };


  return (
    <div className="modal-overlay-tesorero">
      <div className="tesorero-modal">
        <div className="modal-header-tesorero">
          <h2>{mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label htmlFor="nombre">Nombre</label>
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
                <label htmlFor="apellido">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  required
                />
              </div>


              <div className="form-group-tesorero">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
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
                  <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                  <option value="Cédula de extranjería">Cédula extranjería</option>
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
                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={e => setFormData(prev => ({ ...prev, correo: e.target.value.trim().toLowerCase() }))}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={formData.fechaNacimiento}
                  onChange={handleChange}
                  required
                />
              </div>
              {mode === 'create' && (
                <div className="form-group-tesorero">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={e => setFormData(prev => ({ ...prev, password: e.target.value.trim() }))}
                    placeholder="Contraseña"
                    required
                  />
                </div>
              )}


              <div className="form-group-tesorero">
                <label htmlFor="role">Rol</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="tesorero">Tesorero</option>
                  <option value="seminarista">Seminarista</option>
                  <option value="externo">Externo</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="estado">Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
UsuarioModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default UsuarioModal;