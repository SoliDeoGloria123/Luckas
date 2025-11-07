
import React, { useState, useEffect } from 'react';
import { categorizacionService } from '../../../services/categorizacionService';
import { userService } from '../../../services/userService';
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';

const SolicitudModal = ({ mode = 'create', initialData = {}, onClose, onSubmit }) => {
  const getUsuarioSesion = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error("Error al decodificar el token:", e);
      return null;
    }
  };
  const usuarioSesion = getUsuarioSesion();
  console.log("usuarioSesion", usuarioSesion); // <-- Ver en consola qué campos trae el token

  const getNombreUsuarioSesion = () => {
    if (!usuarioSesion) return "";
    // Ajusta aquí según el campo real que trae tu token
    return usuarioSesion.nombre || usuarioSesion.name || usuarioSesion.username || "";
  };
  const getResponsableId = () => {
    if (!usuarioSesion) return "";
    // El backend puede guardar el id como _id o id en el token
    return usuarioSesion._id || usuarioSesion.id || "";
  };
  const [formData, setFormData] = useState({
    solicitante: initialData.solicitante?._id?.toString() || initialData.solicitante?.toString() || initialData.solicitante || "",
    nombre: initialData.solicitante?.nombre || initialData.nombre || "",
    correo: initialData.correo || "",
    telefono: initialData.telefono || "",
    tipoDocumento: initialData.tipoDocumento ? String(initialData.tipoDocumento) : "Cédula de ciudadanía",
    numeroDocumento: initialData.numeroDocumento || "",
    categoria: initialData.categoria?._id?.toString() || initialData.categoria?._id || initialData.categoria?.toString() || initialData.categoria || "",
    categoriaNombre: initialData.categoria?.nombre || "",
    descripcion: initialData.descripcion || "",
  estado: initialData.estado ? String(initialData.estado) : "Nueva",
    prioridad: initialData.prioridad ? String(initialData.prioridad) : "Media",
    responsable: mode === 'create' && usuarioSesion ? getResponsableId() : (initialData.responsable?._id?.toString() || initialData.responsable?._id || initialData.responsable?.toString() || initialData.responsable || ""),
    responsableNombre: mode === 'create' && usuarioSesion ? getNombreUsuarioSesion() : (initialData.responsable?.nombre || ""),
    observaciones: initialData.observaciones || "",
    role: initialData.solicitante?.role || initialData.role || "",
    tipoSolicitud: initialData.tipoSolicitud ? String(initialData.tipoSolicitud) : "",
    modeloReferencia: initialData.modeloReferencia ? String(initialData.modeloReferencia) : ""
  });

  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    // Cargar categorías siempre que se abra el modal
    categorizacionService.getAll()
      .then(res => setCategorias(res.data || []))
      .catch(() => setCategorias([]));
  }, [mode]);

  const buscarUsuarioPorDocumento = async (numeroDocumento) => {
    if (!numeroDocumento) return;
    try {
      const usuario = await userService.getByDocumento(numeroDocumento);
      if (usuario) {
        setFormData(prev => ({
          ...prev,
          solicitante: usuario._id || "",
          nombre: usuario.nombre || "",
          correo: usuario.correo || "",
          telefono: usuario.telefono || "",
          numeroDocumento: usuario.numeroDocumento || numeroDocumento,
          role: usuario.role || ""
        }));
      }
    } catch (error) {
      console.error("Error al buscar usuario por documento:", error);
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
              {mode === 'create' && (
                <div className="form-group-tesorero">
                  <label htmlFor="numeroDocumento">Documento Solicitante</label>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    placeholder="Doceumento Solicitante"
                    required
                  />
                </div>
              )}


              <div className="form-group-tesorero">
                <label htmlFor="nombre">Nombre Solicitante</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  readOnly
                  placeholder="Nombre se autocompleta"
                  required
                />
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="correo">Correo</label>
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
                <label htmlFor="telefono">Teléfono</label>
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
                <label htmlFor="role">Rol</label>
                <select
                  name="role"
                  value={formData.role ? String(formData.role) : ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  <option value="admin">Administrador</option>
                  <option value="tesorero">Tesorero</option>
                  <option value="seminarista">Seminarista</option>
                  <option value="externo">Externo</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="tipoSolicitud">Tipo de Solicitud:</label>
                <select
                  name="tipoSolicitud"
                  value={formData.tipoSolicitud ? String(formData.tipoSolicitud) : ''}
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
                <label htmlFor="modeloReferencia">Modelo Referencia:</label>
                <select
                  name="modeloReferencia"
                  value={formData.modeloReferencia ? String(formData.modeloReferencia) : ''}
                  onChange={handleChange}
                  required
                  disabled={!formData.tipoSolicitud}
                >
                  <option value="">Seleccione...</option>
                  {formData.tipoSolicitud === 'Inscripción' && <option value="Eventos">Eventos</option>}

                  {formData.tipoSolicitud === 'Inscripción' && <option value="ProgramaAcademico">Programa Académico</option>}
                  {formData.tipoSolicitud === 'Hospedaje' && <option value="Cabana">Cabaña</option>}
                  {formData.tipoSolicitud === 'Hospedaje' && <option value="Reserva">Reserva</option>}
                  {formData.tipoSolicitud === 'Alimentación' && <option value="Comedor">Comedor</option>}
                </select>
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="categoria">Categoría:</label>
                <select
                  name="categoria"
                  value={formData.categoria ? String(formData.categoria) : ''}
                  onChange={handleChange}
                  required
                  disabled={mode === 'edit'}
                >
                  <option value="">Seleccione...</option>
                  {categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="estado">Estado:</label>
                <select
                  name="estado"
                  value={formData.estado ? String(formData.estado) : ''}
                  onChange={handleChange}
                  required
                >
                  <option value="Nueva">Nueva</option>
                  <option value="En Revisión">En Revisión</option>
                  <option value="Aprobada">Aprobada</option>
                  <option value="Rechazada">Rechazada</option>
                  <option value="Completada">Completada</option>
                  <option value="Pendiente Info">Pendiente Info</option>
                </select>
              </div>
              <div className="form-group-tesorero">
                <label htmlFor="prioridad">Prioridad:</label>
                <select
                  name="prioridad"
                  value={formData.prioridad ? String(formData.prioridad) : ''}
                  onChange={handleChange}
                  required
                >
                  <option value="Alta">Alta</option>
                  <option value="Media">Media</option>
                  <option value="Baja">Baja</option>
                </select>
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="observaciones">Observaciones</label>
                <input
                  type="text"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleChange}
                  placeholder="Observaciones"
                />
              </div>

              <div className="form-group-tesorero">
                <label htmlFor="descripcion">Descripción</label>
                <texta 
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Descripción de la solicitud"
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
SolicitudModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default SolicitudModal;