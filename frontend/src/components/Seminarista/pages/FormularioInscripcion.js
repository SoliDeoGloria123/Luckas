import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { inscripcionService } from '../../../services/inscripcionService';

const FormularioInscripcion = ({ evento, onClose, onSuccess, inscripcion = null, modoEdicion = false }) => {
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [formData, setFormData] = useState({
    usuario: '',
    evento: evento?._id || '',
    nombre: '',
    apellido: '',
    tipoDocumento: 'Cédula de ciudadanía',
    numeroDocumento: '',
    correo: '',
    telefono: '',
    edad: '',
    categoria: '',
    observaciones: ''
  });
  // Estado para mostrar mensaje de éxito o error
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    if (modoEdicion && inscripcion) {
      setFormData({
        usuario: inscripcion.usuario?._id || inscripcion.usuario || '',
        evento: inscripcion.evento?._id || inscripcion.evento || '',
        nombre: inscripcion.nombre || '',
        apellido: inscripcion.apellido || '',
        tipoDocumento: inscripcion.tipoDocumento || 'Cédula de ciudadanía',
        numeroDocumento: inscripcion.numeroDocumento || '',
        correo: inscripcion.correo || '',
        telefono: inscripcion.telefono || '',
        edad: inscripcion.edad || '',
        categoria: inscripcion.categoria?._id || inscripcion.categoria || '',
        observaciones: inscripcion.observaciones || ''
      });
    } else {
      // Cargar datos del usuario autenticado
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      setFormData(prev => ({
        ...prev,
        usuario: usuario._id || '',
        evento: evento?._id || '',
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || ''
      }));
    }
    cargarCategorias();
  }, [evento, inscripcion, modoEdicion]);

  const cargarCategorias = async () => {
    try {
      console.log('📂 Cargando categorías...');
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/categorizacion', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Respuesta categorías:', response.data);
      if (response.data.success) {
        console.log('✅ Categorías cargadas:', response.data.data.length);
        setCategorias(response.data.data);
      }
    } catch (error) {
      console.error('❌ Error al cargar categorías:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');
    try {
      console.log('📝 Datos del formulario antes de enviar:', formData);
      console.log('🎯 Evento ID:', formData.evento);
      console.log('👤 Usuario ID:', formData.usuario);
      console.log('📂 Categoría ID:', formData.categoria);
      
      // Validaciones adicionales
      if (!formData.evento) {
        alert('Error: No se ha seleccionado un evento');
        setLoading(false);
        return;
      }
      
      if (!formData.usuario) {
        alert('Error: No se ha identificado el usuario');
        setLoading(false);
        return;
      }
      
      if (!formData.categoria) {
        alert('Error: Debe seleccionar una categoría');
        setLoading(false);
        return;
      }
      
      if (!formData.nombre || !formData.telefono || !formData.numeroDocumento || !formData.edad) {
        alert('Error: Todos los campos marcados con * son obligatorios');
        setLoading(false);
        return;
      }
      
      if (modoEdicion && inscripcion) {
        // PUT para editar
        const response = await inscripcionService.update(inscripcion._id, formData);
        if (response.success) {
          setMensaje('✅ Inscripción actualizada exitosamente.');
          if (onSuccess) onSuccess('Inscripción actualizada exitosamente');
        } else {
          setMensaje('Error: ' + (response.message || 'Error desconocido'));
        }
      } else {
        // POST para nueva
        const token = localStorage.getItem('token');
        const response = await axios.post('http://localhost:3000/api/inscripciones', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data.success) {
          setMensaje('✅ Inscripción realizada exitosamente.');
          setFormData({
            usuario: '', evento: evento?._id || '', nombre: '', apellido: '', tipoDocumento: 'Cédula de ciudadanía', numeroDocumento: '', correo: '', telefono: '', edad: '', categoria: '', observaciones: ''
          });
          if (onSuccess) onSuccess('Inscripción realizada exitosamente');
        } else {
          setMensaje('Error: ' + (response.data.message || 'Error desconocido'));
        }
      }
    } catch (error) {
      setMensaje('Error al procesar la inscripción: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-inscripcion" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📝 Inscripción a Evento</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>
        {/* Mensaje de éxito o error */}
        {mensaje && (
          <div style={{ margin: '10px 0', color: mensaje.startsWith('✅') ? 'green' : 'red', fontWeight: 'bold' }}>
            {mensaje}
          </div>
        )}

        <div className="evento-info-inscripcion">
          <h3>{evento?.nombre}</h3>
          <p><strong>📅 Fecha:</strong> {formatearFecha(evento?.fechaEvento)}</p>
          <p><strong>📍 Lugar:</strong> {evento?.lugar || 'Por definir'}</p>
        </div>

        <form onSubmit={handleSubmit} className="form-inscripcion">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="apellido">Apellido *</label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tipoDocumento">Tipo de Documento *</label>
              <select
                id="tipoDocumento"
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                required
              >
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="Tarjeta de identidad">Tarjeta de identidad</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="numeroDocumento">Número de Documento *</label>
              <input
                type="text"
                id="numeroDocumento"
                name="numeroDocumento"
                value={formData.numeroDocumento}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="correo">Correo Electrónico *</label>
              <input
                type="email"
                id="correo"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="telefono">Teléfono *</label>
              <input
                type="tel"
                id="telefono"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edad">Edad *</label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="categoria">Categoría *</label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar categoría</option>
                {categorias.length === 0 ? (
                  <option value="" disabled>Cargando categorías...</option>
                ) : (
                  categorias.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {String(cat.nombre)}{cat.codigo ? ` - ${String(cat.codigo)}` : ''}
                    </option>
                  ))
                )
              }</select>
              {categorias.length === 0 && (
                <small style={{ color: '#dc3545', fontSize: '0.8rem' }}>
                  ⚠️ No se han cargado las categorías. Verifique su conexión.
                </small>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="observaciones">Observaciones</label>
            <textarea
              id="observaciones"
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows="3"
              placeholder="Información adicional (opcional)"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancelar" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-inscribir" disabled={loading}>
              {loading ? 'Procesando...' : '📝 Confirmar Inscripción'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioInscripcion;
