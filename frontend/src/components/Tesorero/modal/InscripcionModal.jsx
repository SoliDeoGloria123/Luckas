import React, { useState } from 'react';
import { userService } from '../../../services/userService';
import { jwtDecode } from "jwt-decode";
import PropTypes from 'prop-types';

// Funciones movidas fuera del componente para evitar recrearlas en cada render
function normalizeCategoria(categoria) {
  if (!categoria) return '';
  if (typeof categoria === 'object' && categoria._id) return String(categoria._id);
  return String(categoria);
}

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

// Función auxiliar para calcular edad
function calcularEdad(fechaNacimiento) {
  try {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    if (Number.isNaN(fechaNac.getTime())) return 25;
    
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  } catch (error) {
    console.log('❌ Error calculando edad:', error);
    return 25;
  }
}

// Función auxiliar para obtener estado por defecto según tipo de referencia
function getEstadoDefecto(tipoReferencia) {
  if (tipoReferencia === 'Eventos') return 'no inscrito';
  if (tipoReferencia === 'ProgramaAcademico') return 'preinscrito';
  return '';
}

// Función auxiliar para obtener categoría de evento
function getCategoriaEvento(eventos, eventoId) {
  const evento = eventos.find(ev => String(ev._id) === String(eventoId));
  return evento?.categoria ? String(evento.categoria._id || evento.categoria) : '';
}

// Función auxiliar para obtener categoría de programa
function getCategoriaPrograma(programas, programaId) {
  const programa = programas.find(pr => String(pr._id) === String(programaId));
  return programa?.categoria ? String(programa.categoria._id || programa.categoria) : '';
}

const InscripcionModal = ({ mode = 'create', eventos, programas, categorias, initialData = {}, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    usuario: initialData.usuario?._id?.toString() || initialData.usuario?.toString() || initialData.usuario || "",
    nombre: initialData.nombre || '',
    apellido: initialData.apellido || '',
    tipoDocumento: initialData.tipoDocumento || '',
    numeroDocumento: initialData.numeroDocumento || '',
    correo: initialData.correo || '',
    telefono: initialData.telefono || '',
    edad: initialData.edad || '',
    tipoReferencia: initialData.tipoReferencia || 'Eventos',
    referencia: initialData.referencia?._id || initialData.referencia || '',
    categoria: normalizeCategoria(initialData.categoria) || '',
    estado: initialData.estado || 'no inscrito',
    observaciones: initialData.observaciones || '',
  });
  const getUsuarioSesion = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return jwtDecode(token);
    } catch (e) {
      console.error('❌ Error decodificando token:', e);

      return null;
    }
  };
  const usuarioSesion = getUsuarioSesion();
  console.log("usuarioSesion", usuarioSesion); // <-- Ver en consola qué campos trae el token

  const getResponsableId = () => {
    if (!usuarioSesion) return "";
    // El backend puede guardar el id como _id o id en el token
    return usuarioSesion._id || usuarioSesion.id || "";
  };
  // Obtener opciones de estado según el tipo de referencia
  const getOpcionesEstado = (tipoReferencia = formData.tipoReferencia) => {
    if (tipoReferencia === 'Eventos') {
      return [
        { value: 'no inscrito', label: 'No inscrito' },
        { value: 'inscrito', label: 'Inscrito' },
        { value: 'finalizado', label: 'Finalizado' }
      ];
    } else if (tipoReferencia === 'ProgramaAcademico') {
      return [
        { value: 'preinscrito', label: 'Preinscrito' },
        { value: 'matriculado', label: 'Matriculado' },
        { value: 'en_curso', label: 'En Curso' },
        { value: 'finalizado', label: 'Finalizado' },
        { value: 'certificado', label: 'Certificado' },
        { value: 'rechazada', label: 'Rechazada' },
        { value: 'cancelada', label: 'Cancelada Académico' }
      ];
    } else {
      return [];
    }
  };
  const [usuarioNoEncontrado, setUsuarioNoEncontrado] = useState(false);
  
  const buscarUsuarioPorDocumento = async (numeroDocumento) => {
    if (!numeroDocumento) return;
    
    try {
      const usuario = await userService.getByDocumento(numeroDocumento);
      if (!usuario) {
        setUsuarioNoEncontrado(true);
        return;
      }

      const edadCalculada = usuario.fechaNacimiento ? calcularEdad(usuario.fechaNacimiento) : 25;
      
      setFormData(prev => ({
        ...prev,
        usuario: String(usuario._id || ""),
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || "",
        tipoDocumento: normalizaTipoDocumento(usuario.tipoDocumento) || "",
        numeroDocumento: usuario.numeroDocumento || numeroDocumento,
        edad: String(edadCalculada)
      }));
      setUsuarioNoEncontrado(false);
    } catch (error) {
      setUsuarioNoEncontrado(true);
      console.error('❌ Error buscando usuario por documento:', error);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;

    // Buscar usuario si es número de documento
    if (name === "numeroDocumento" && value.length > 5) {
      await buscarUsuarioPorDocumento(value);
    }

    // Manejar cambio de tipo de referencia
    if (name === "tipoReferencia") {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        estado: getEstadoDefecto(value),
        referencia: "",
        categoria: ""
      }));
      return;
    }

    // Manejar cambio de referencia (evento o programa)
    if (name === "referencia") {
      const categoria = formData.tipoReferencia === "Eventos" 
        ? getCategoriaEvento(eventos, value)
        : getCategoriaPrograma(programas, value);
      
      if (categoria) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          categoria
        }));
        return;
      }
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const usuarioId = getResponsableId();
    const payload = {
      usuario: formData.usuario || usuarioId,
      nombre: formData.nombre,
      apellido: formData.apellido,
      tipoDocumento: formData.tipoDocumento,
      numeroDocumento: formData.numeroDocumento,
      correo: formData.correo,
      telefono: formData.telefono,
      edad: Number.parseInt(formData.edad) || 0,
      tipoReferencia: formData.tipoReferencia,
      referencia: formData.referencia,
      categoria: formData.categoria,
      estado: formData.estado || 'no inscrito',
      observaciones: formData.observaciones || ''
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
                <label htmlFor='numeroDocumento'>Cedula Usuario</label>
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
                <label htmlFor='nombre'>Nombre</label>
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
                <label htmlFor='apellido'>Apellido</label>
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
                <label htmlFor='tipoDocumento'>Tipo de Documento</label>
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
                <label htmlFor='correo'>Correo</label>
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
                <label htmlFor='telefono'>Teléfono</label>
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
                <label htmlFor='edad'>Edad</label>
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
                <label htmlFor='tipoReferencia'>Tipo de inscripción</label>
                <select
                  name="tipoReferencia"
                  value={formData.tipoReferencia}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione tipo</option>
                  <option value="Eventos">Evento</option>
                  <option value="ProgramaAcademico">Programa académico</option>
                </select>
              </div>

              {formData.tipoReferencia === "Eventos" && (
                <div className="form-group-tesorero">
                  <label htmlFor='referencia'>Evento</label>
                  <select
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione evento</option>
                    {eventos && eventos.map(ev => (
                      <option key={ev._id} value={ev._id}>
                        {ev.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.tipoReferencia === "ProgramaAcademico" && (
                <div className="form-group-tesorero">
                  <label htmlFor='referencia'>Programa académico</label>
                  <select
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione programa</option>
                    {programas && programas.map(pr => (
                      <option key={pr._id} value={pr._id}>
                        {pr.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="form-group-tesorero">
                <label htmlFor='categoria'>Categoría</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  required
                  disabled={true}
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
                <label htmlFor='estado'>Estado</label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione estado</option>
                  {getOpcionesEstado(formData.tipoReferencia).map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </option>
                  ))}
                </select>
              </div>

            </div>
            <div className="form-group-tesorero">
              <label htmlFor='observaciones'>Observaciones</label>
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
InscripcionModal.propTypes = {
  mode: PropTypes.oneOf(['create', 'edit']),
  eventos: PropTypes.array.isRequired,
  programas: PropTypes.array.isRequired,
  categorias: PropTypes.array.isRequired,
  initialData: PropTypes.object,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};


export default InscripcionModal;