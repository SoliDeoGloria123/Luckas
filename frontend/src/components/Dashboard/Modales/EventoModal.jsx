import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import useImageUploader from './useImageUploader';
import FormField from './shared/FormField';
import ImageUploadArea from './shared/ImageUploadArea';
import ModalFooter from './shared/ModalFooter';


// Función auxiliar para obtener fecha de hoy
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Función auxiliar para obtener texto del botón
const getButtonText = (isSubmitting, selectedImages, modoEdicion) => {
  if (isSubmitting) {
    return selectedImages.length > 0 ? 'Subiendo imágenes...' : 'Creando evento...';
  }
  return modoEdicion ? "Guardar Cambios" : "Crear Evento";
};

const EventoModal = ({
  mostrar,
  modoEdicion,
  eventoSeleccionado,
  setEventoSeleccionado,
  nuevoEvento,
  setNuevoEvento,
  categorias,
  onClose,
  onSubmit,
  selectedImages,
  setSelectedImages
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const originalFechaRef = useRef(null);

  // Reutilizar hook centralizado para subir imágenes (maneja progreso, selección, eliminación)
  const { progress: uploaderProgress, isUploading: uploaderUploading, handleFileSelection, removeImage } = useImageUploader({ selectedImages, setSelectedImages, mostrar, modoEdicion });

  // Helpers para reducir duplicación en handlers y lectura de valores
  const handleFieldChange = (fieldName, value) => {
    if (modoEdicion) {
      setEventoSeleccionado({ ...eventoSeleccionado, [fieldName]: value });
    } else {
      setNuevoEvento({ ...nuevoEvento, [fieldName]: value });
    }
  };

  const getFieldValue = (fieldName) => {
    const raw = modoEdicion ? eventoSeleccionado?.[fieldName] : nuevoEvento[fieldName];
    if (fieldName === 'fechaEvento') {
      return formatToInputDate(raw);
    }
    if (fieldName === 'etiquetas') {
      // Si en el modelo vienen como array, convertir a string separado por comas
      if (Array.isArray(raw)) return raw.join(', ');
      return raw || '';
    }
    if (fieldName === 'categoria') {
      // Si la categoría viene como objeto, devolver el id para el select
      if (raw && typeof raw === 'object') return raw._id || raw.id || '';
      return raw || '';
    }
    return raw;
  };

  // (Los estados de upload/progress los proporciona `useImageUploader`)

  // Resetear estado cuando se abre el modal en modo crear
  useEffect(() => {
    if (mostrar && !modoEdicion && setSelectedImages) {
      // el hook `useImageUploader` ya reinicia progress/isUploading internamente
      setSelectedImages([]);
      setIsSubmitting(false);
    }
    if (mostrar && modoEdicion) {
      originalFechaRef.current = formatToInputDate(eventoSeleccionado?.fechaEvento);
    }
  }, [mostrar, modoEdicion, setSelectedImages]);


  // NOTE: la lógica de subida/selección/eliminación de imágenes
  // se delega ahora al hook `useImageUploader` (importado arriba).

  // Función auxiliar para validar fecha
  const validarFecha = (fecha) => {
    if (!fecha) return true;
    try {
      const d = new Date(String(fecha));
      const time = d.getTime();
      if (Number.isNaN(time)) return true;
      const hoy = new Date();
      d.setHours(0,0,0,0);
      hoy.setHours(0,0,0,0);
      if (d < hoy) {
        alert('La fecha del evento no puede ser anterior a hoy');
        return false;
      }
      return true;
    } catch (err) {
      console.error('validarFecha error:', err);
      return true;
    }
  };

  // Normalizar varios formatos de fecha a yyyy-mm-dd para el input type=date
  const formatToInputDate = (value) => {
    if (!value && value !== 0) return '';
    try {
      const str = String(value).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
      if (str.includes('T')) {
        const d = new Date(str);
        if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0,10);
      }
      const d = new Date(str);
      if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0,10);
      // intentar dd/mm/yyyy o dd-mm-yyyy
      const parts = str.includes('/') ? str.split('/') : str.split('-');
      if (parts.length === 3 && parts[2].length === 4) {
        const [dd, mm, yyyy] = parts.map(p => p.trim());
        return `${yyyy}-${String(mm).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;
      }
    } catch (err) {
      console.error('formatToInputDate error:', err);
    }
    return '';
  };

  // Función auxiliar para preparar FormData con imágenes
  const prepararFormDataConImagenes = () => {
    const formData = new FormData();

    // Agregar campos básicos
    formData.append('nombre', nuevoEvento.nombre);
    formData.append('descripcion', nuevoEvento.descripcion);
    formData.append('precio', Number(nuevoEvento.precio));
    formData.append('categoria', String(nuevoEvento.categoria));

    // Procesar etiquetas
    const etiquetas = typeof nuevoEvento.etiquetas === 'string'
      ? nuevoEvento.etiquetas.split(',').map(e => e.trim()).filter(Boolean)
      : [];
    formData.append('etiquetas', JSON.stringify(etiquetas));

    // Agregar campos restantes
    formData.append('fechaEvento', nuevoEvento.fechaEvento);
    formData.append('horaInicio', nuevoEvento.horaInicio);
    formData.append('horaFin', nuevoEvento.horaFin);
    formData.append('lugar', nuevoEvento.lugar);
    formData.append('direccion', nuevoEvento.direccion);
    formData.append('duracionDias', nuevoEvento.duracionDias ? Number(nuevoEvento.duracionDias) : 1);
    formData.append('cuposTotales', Number(nuevoEvento.cuposTotales));
    formData.append('cuposDisponibles', Number(nuevoEvento.cuposDisponibles));
    formData.append('prioridad', nuevoEvento.prioridad);
    formData.append('observaciones', nuevoEvento.observaciones);
    formData.append('active', nuevoEvento.active);

    return formData;
  };

  // Función auxiliar para agregar imágenes al FormData
  const agregarImagenesAFormData = (formData) => {
    for (const imageData of selectedImages) {
      if (imageData.file) {
        formData.append('imagen', imageData.file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const fechaRaw = modoEdicion ? eventoSeleccionado?.fechaEvento : nuevoEvento.fechaEvento;
      const fecha = formatToInputDate(fechaRaw);

      // Validar fecha: en edición solo si el usuario la cambió; en creación siempre
      const original = originalFechaRef.current || '';
      const fechaCambio = modoEdicion ? (fecha && fecha !== original) : true;
      if (fechaCambio && !validarFecha(fecha)) {
        setIsSubmitting(false);
        return;
      }

      const tieneImagenes = !modoEdicion && selectedImages.length > 0;

      if (tieneImagenes) {
        const formData = prepararFormDataConImagenes();
        agregarImagenesAFormData(formData);
        console.log('Enviando evento CON imágenes:', selectedImages.length, 'archivos');
        onSubmit(formData, true);
      } else {
        onSubmit();
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Efecto para manejar el scroll del body cuando el modal está abierto
    React.useEffect(() => {
      if (mostrar) {
        // Desactivar scroll del body
        document.body.style.overflow = 'hidden';
        return () => {
          // Reactivar scroll del body al cerrar el modal
          document.body.style.overflow = 'auto';
        };
      }
    }, [mostrar]);
  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{zIndex: 1100}}>
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div
          className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
          style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}
        >
          <h2>{modoEdicion ? "Editar Evento" : "Nueva Evento"}</h2>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <FormField id="nombre-evento" label="Nombre Evento:" value={getFieldValue('nombre')} onChange={e => handleFieldChange('nombre', e.target.value)} placeholder="Nombre del Evento" />
            <FormField id="descripcion-evento" label="Descripcion Evento:" value={getFieldValue('descripcion')} onChange={e => handleFieldChange('descripcion', e.target.value)} placeholder="Descripción del Evento" />
          </div>
          <div className="from-grid-admin">
            <FormField id="precio-evento" label="Precio Evento:" type="number" value={getFieldValue('precio')} onChange={e => handleFieldChange('precio', e.target.value)} placeholder="Precio" />
            <FormField id="categoria-evento" label="Categoría:" type="select" value={getFieldValue('categoria')} onChange={e => handleFieldChange('categoria', e.target.value)}>
              <option value="">Seleccione...</option>
              {categorias && categorias
                .filter(cat => String(cat.estado || '').toLowerCase() === 'activo')
                .map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                ))}
            </FormField>
          </div>
          <div className="from-grid-admin">
            <FormField id="etiquetas-evento" label="Etiquetas Evento:" value={getFieldValue('etiquetas')} onChange={e => handleFieldChange('etiquetas', e.target.value)} placeholder="Etiquetas (separadas por coma)" />
            <FormField id="fecha-evento" label="Fecha del Evento:" type="date" value={getFieldValue('fechaEvento')} onChange={e => handleFieldChange('fechaEvento', e.target.value)} placeholder="Fecha" inputProps={{ min: getTodayString() }} />
          </div>
          <div className="from-grid-admin">
            <FormField id="hora-inicio" label="Hora de Inicio:" type="time" value={getFieldValue('horaInicio')} onChange={e => handleFieldChange('horaInicio', e.target.value)} />
            <FormField id="hora-fin" label="Hora de Fin:" type="time" value={getFieldValue('horaFin')} onChange={e => handleFieldChange('horaFin', e.target.value)} />
          </div>
          <div className="from-grid-admin">
            <FormField id="lugar-evento" label="Lugar:" value={getFieldValue('lugar')} onChange={e => handleFieldChange('lugar', e.target.value)} placeholder="Ej: Auditorio Principal" />
            <FormField id="direccion-evento" label="Dirección:" value={getFieldValue('direccion')} onChange={e => handleFieldChange('direccion', e.target.value)} placeholder="Ej: Carrera 45 #50-12, Bogotá" />
          </div>
          <div className="from-grid-admin">
            <FormField id="cupos-totales" label="Cupos Totales:" type="number" value={getFieldValue('cuposTotales')} onChange={e => handleFieldChange('cuposTotales', e.target.value)} />
            <FormField id="cupos-disponibles" label="Cupos Disponibles:" type="number" value={getFieldValue('cuposDisponibles')} onChange={e => handleFieldChange('cuposDisponibles', e.target.value)} />
          </div>
          <div className="from-grid-admin">
            <FormField id="prioridad-evento" label="Prioridad:" type="select" value={getFieldValue('prioridad')} onChange={e => handleFieldChange('prioridad', e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="Alta">Alta</option>
              <option value="Media">Media</option>
              <option value="Baja">Baja</option>
            </FormField>
            <FormField id="estado-evento" label="Estado:" type="select" value={getFieldValue('active')} onChange={e => handleFieldChange('active', e.target.value)}>
              <option value="">Seleccione...</option>
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </FormField>
          </div>



          {!modoEdicion && (
            <FormField id="observaciones-evento" label="Observaciones:" value={getFieldValue('observaciones')} onChange={e => handleFieldChange('observaciones', e.target.value)} placeholder="Observaciones del evento" />
          )}
          <ImageUploadArea isUploading={uploaderUploading} progress={uploaderProgress} selectedImages={selectedImages} handleFileSelection={handleFileSelection} removeImage={removeImage} />


          <ModalFooter isSubmitting={isSubmitting} onClose={onClose} getButtonText={() => getButtonText(isSubmitting, selectedImages, modoEdicion)} />
        </form>
      </div>
    </div>
  );
};

EventoModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  eventoSeleccionado: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    fechaEvento: PropTypes.string,
    horaInicio: PropTypes.string,
    horaFin: PropTypes.string,
    lugar: PropTypes.string,
    cuposTotales: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cuposDisponibles: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prioridad: PropTypes.string,
    active: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    observaciones: PropTypes.string
  }),
  setEventoSeleccionado: PropTypes.func,
  nuevoEvento: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    fechaEvento: PropTypes.string,
    horaInicio: PropTypes.string,
    horaFin: PropTypes.string,
    lugar: PropTypes.string,
    direccion: PropTypes.string,
    duracionDias: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cuposTotales: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    cuposDisponibles: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    prioridad: PropTypes.string,
    active: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    etiquetas: PropTypes.string,
    observaciones: PropTypes.string
  }),
  setNuevoEvento: PropTypes.func,
  categorias: PropTypes.array,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  selectedImages: PropTypes.array,
  setSelectedImages: PropTypes.func
};

export default EventoModal;