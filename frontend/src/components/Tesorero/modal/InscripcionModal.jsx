import React, { useState,useEffect } from 'react';
import { userService } from '../../../services/userService';


const InscripcionModal = ({ mode = 'create', initialData = {}, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    usuario: initialData.usuario || '',
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    tipoDocumento: initialData.tipoDocumento || '',
    numeroDocumento: initialData.numeroDocumento || '',
    correo: initialData.correo || '',
    telefono: initialData.telefono || '',
    edad: initialData.edad || '',
    categoria: initialData.categoria || '',
    estado: initialData.estado || '',
    observaciones: initialData.observaciones || '',
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
  
  // 🔹 Buscar datos cuando cambia la cédula
  useEffect(() => {
    const cargarDatosUsuario = async () => {
      if (formData.numeroDocumento && formData.numeroDocumento.length > 5) {
        try {
          // aquí cambias por tu método real: getByDocumento o getById
          const user = await userService.getByDocumento(formData.numeroDocumento);

          if (user) {
            setFormData((prev) => ({
              ...prev,
              nombre: user.nombre || "",
              apellido: user.apellido || "",
              correo: user.correo || "",
              telefono: user.telefono || "",
              tipoDocumento: user.tipoDocumento || "",
              role: user.role || "",
              estado: user.estado || ""
            }));
          }
        } catch (error) {
          console.error("No se encontró usuario:", error);
          // 🔹 Limpia si no existe
          setFormData((prev) => ({
            ...prev,
            nombre: "",
            apellido: "",
            correo: "",
            telefono: "",
            tipoDocumento: "",
            role: "",
            estado: ""
          }));
        }
      }
    };

    cargarDatosUsuario();
  }, [formData.numeroDocumento]); // 👈 depende del número de documento

  return (
    <div className="modal-overlay-tesorero">
      <div className="tesorero-modal">
        <div className="modal-header-tesorero">
          <h2>{mode === 'create' ? 'Crear Nuevo Inscripcion' : 'Editar Inscripcion'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body-tesorero">
          <form onSubmit={handleSubmit}>
            <div className="form-grid-tesorero">
              <div className="form-group-tesorero">
                <label>Cedula Usuario</label>
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
                <label>Nombre</label>
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
                <label>Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              
              <div className="form-group-tesorero">
                <label>Tipo de Documento</label>
                <input
                  type="text"
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={handleChange}
                  placeholder="Teléfono"
                  required
                />
              </div>
              
              <div className="form-group-tesorero">
                <label>Número de Documento</label>
                <input
                type='text'
                  name="numeroDocumento"
                  value={formData.numeroDocumento}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group-tesorero">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Número de documento"
                  required
                />
              </div>
              
              <div className="form-group-tesorero">
                <label>Teléfono</label>
                <input
                type='text'
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
      
              </div>
              
              <div className="form-group-tesorero">
                <label>Edad</label>
                <input
                type='number'
                  name="edad"
                  value={formData.edad}
                  onChange={handleChange}
                  required
                />
     
              </div>
              
              <div className="form-group-tesorero">
                <label>Categoría</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Pendiente">Pendiente</option>
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
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                  <option value="Pendiente">Pendiente</option>
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
            </div>
            
            <div className="modal-footer-tesorero">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancelar
              </button>
              <button type="submit" className="submit-btn">
                {mode === 'create' ? 'Crear Inscripcion' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InscripcionModal;