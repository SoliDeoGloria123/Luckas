import React, { useState } from 'react';
import { userService } from '../../../services/userService';


const SolicitudModal = ({ mode = 'create', initialData = {}, onClose, onSubmit }) => {
 const [formData, setFormData] = useState({
    correo: initialData.correo || '',
    telefono: initialData.telefono || '',
    tipoDocumento: initialData.tipoDocumento || 'Cédula de ciudadanía',
    numeroDocumento: initialData.numeroDocumento || '',
    rol: initialData.rol || 'Tesorero',
    estado: initialData.estado || 'Activo'
  });
// Nueva función para buscar usuario
  const buscarUsuarioPorDocumento = async (numeroDocumento) => {
    if (!numeroDocumento) return;
    try {
      const usuario = await userService.getByDocumento(numeroDocumento);
      if (usuario) {
        setFormData(prev => ({
          ...prev,
          correo: usuario.correo || "",
          telefono: usuario.telefono || "",
          tipoDocumento: usuario.tipoDocumento || "",
          numeroDocumento: usuario.numeroDocumento ||"",

        }));
      }
    } catch (error) {
      // Si no encuentra usuario, no hace nada
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Si el campo es numeroDocumento, busca el usuario
    if (name === "numeroDocumento" && value.length > 5) {
      await buscarUsuarioPorDocumento(value);
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
          <h2>{mode === 'create' ? 'Crear Nuevo Solcitud' : 'Editar Solcitud'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label>Doceumento Solicitante</label>
                <input
                  type="text"
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  placeholder="Doceumento Solicitante"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>

              <div className="form-group-tesorero">
                <label>Teléfono </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Telefono Solicitante"
                  required
                />
              </div>



              <div className="form-group-tesorero">
                <label>Tipo de Solicitud:</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Inscripción">Inscripción</option>
                  <option value="Hospedaje">Hospedaje</option>
                  <option value="Alimentación">Alimentación</option>
                  <option value="Otra">Otra</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Número de Documento</label>
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
                <label>Modelo Referencia:</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Eventos">Eventos</option>
                  <option value="Curso">Curso</option>
                  <option value="ProgramaTecnico">Programa Tecnico </option>
                  <option value="Cabana">Cabaña</option>
                  <option value="Reserva">Rervas</option>
                  <option value="Comedor">Comedor</option>

                </select>
              </div>
              <div className="form-group-tesorero">
                <label>Categoría:</label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="Tesorero">Tesorero</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Usuario">Usuario</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label>Estado:</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="Nueva">Nueva</option>
              <option value="En Revisión">Revisión</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
              <option value="Completada">Completada</option>
              <option value="Pendiente Info">Pendiente</option>
                </select>
              </div>
              <div className="form-group-tesorero">
                <label>Prioridad:</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                 <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
                </select>
              </div>
              <div className="form-group-tesorero">
                <label>Responsable</label>
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
                <label>Observaciones</label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  required
                />
              </div>
            </div>

            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Solcitud' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SolicitudModal;