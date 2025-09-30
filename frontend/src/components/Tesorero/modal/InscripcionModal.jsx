import React, { useState } from 'react';
import { userService } from '../../../services/userService';
import { jwtDecode } from "jwt-decode";


const InscripcionModal = ({ mode = 'create', eventos, categorias, initialData = {}, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    usuario: initialData.usuario?._id?.toString() || initialData.usuario?.toString() || initialData.usuario || "",
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    tipoDocumento: initialData.tipoDocumento || '',
    numeroDocumento: initialData.numeroDocumento || '',
    correo: initialData.correo || '',
    telefono: initialData.telefono || '',
    edad: initialData.edad || '',
    evento: normalizeEvento(initialData.evento) || '',
    categoria: normalizeCategoria(initialData.categoria) || '',
    estado: initialData.estado || '',
    observaciones: initialData.observaciones || '',
  });
  const getUsuarioSesion = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
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
  function normalizeCategoria(categoria) {
    if (!categoria) return '';
    if (typeof categoria === 'object' && categoria._id) return String(categoria._id);
    return String(categoria);
  }
  function normalizeEvento(evento) {
    if (!evento) return '';
    if (typeof evento === 'object' && evento._id) return String(evento._id);
    return String(evento);
  }
  const [usuarioNoEncontrado, setUsuarioNoEncontrado] = useState(false);
  // Normaliza el tipo de documento a los valores válidos del select/backend
  function normalizaTipoDocumento(tipo) {
    if (!tipo) return '';
    const map = {
      'Cédula de ciudadanía': 'Cédula de ciudadanía',
      'Cédula de Ciudadanía': 'Cédula de ciudadanía',
      'Cédula de extranjería': 'Cédula de extranjería',
      'Cédula de Extranjería': 'Cédula de extranjería',
      'Pasaporte': 'Pasaporte',
      'Tarjeta de identidad': 'Tarjeta de identidad',
      'Tarjeta de Identidad': 'Tarjeta de identidad',
    };
    return map[tipo] || tipo;
  }
  const buscarUsuarioPorDocumento = async (numeroDocumento) => {
    if (!numeroDocumento) return;
    try {
      const usuario = await userService.getByDocumento(numeroDocumento);
      if (usuario) {
        setFormData(prev => ({
          ...prev,
          nombre: usuario.nombre || "",
          apellido: usuario.apellido || "",
          correo: usuario.correo || "",
          telefono: usuario.telefono || "",
          tipoDocumento: normalizaTipoDocumento(usuario.tipoDocumento) || "",
          numeroDocumento: usuario.numeroDocumento || numeroDocumento,
        }));
        setUsuarioNoEncontrado(false);
      } else {
        setUsuarioNoEncontrado(true);
      }
    } catch (error) {
      setUsuarioNoEncontrado(true);
      console.warn("No se encontró usuario con ese documento");
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
    const usuarioId = getResponsableId();
    // Para inscripciones a eventos
    const payload = {
      ...formData,
      usuario: usuarioId,
      tipoReferencia: 'Eventos',
      referencia: formData.evento,
    };
    onSubmit(payload);
    onClose();
  };

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
                {usuarioNoEncontrado && (
                  <span style={{ color: 'red', fontSize: '0.95em' }}>No se encontró usuario con esa cédula.</span>
                )}
              </div>

              <div className="form-group-tesorero">
                <label>Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Nombre del usuario"
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
                <select
                  type="text"
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
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  placeholder="Correo Usuario"
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
                  placeholder='Número de teléfono'
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
                  placeholder='Edad usuario'
                  required
                />

              </div>

              <div className="form-group-tesorero">
                <label>Evento</label>
                <select
                  name="evento"
                  value={formData.evento}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {eventos && eventos.map(ev => (
                    <option key={ev._id} value={ev._id}>
                      {ev.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group-tesorero">
                <label>Categoría</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione...</option>
                  {categorias && categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre}
                    </option>
                  ))}
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
                  <option value="pendiente">Pendiente</option>
                  <option value="aprobada">Aprobada</option>
                  <option value="rechazada">Rechazada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>

            </div>
            <div className="form-group-tesorero">
              <label>Observaciones</label>
              <input
                type="text"
                name="observaciones"
                value={formData.observaciones}
                onChange={handleChange}
                placeholder="Desceipcion de la inscripcion"

              />
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