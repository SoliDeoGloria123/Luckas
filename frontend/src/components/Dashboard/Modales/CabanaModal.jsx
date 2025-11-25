
import React, {useState, useEffect} from "react";
import PropTypes from 'prop-types';
import cabanaShape from './common/cabanaPropTypes';
import useImageUploader from './useImageUploader';
import FormField from './shared/FormField';
import ImageUploadArea from './shared/ImageUploadArea';
import ModalFooter from './shared/ModalFooter';
const CabanaModal = ({
  mostrar,
  modoEdicion,
  cabanaSeleccionada,
  setCabanaSeleccionada,
  nuevaCabana,
  setNuevaCabana,
  onClose,
  onSubmit,
  categorias,
  selectedImages,
  setSelectedImages
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // extraer la lógica de imágenes al hook
  const { progress, isUploading, handleFileSelection, removeImage } = useImageUploader({ selectedImages, setSelectedImages, mostrar, modoEdicion });

  // Resetear isSubmitting cuando se abre el modal en modo crear
  useEffect(() => {
    if (mostrar && !modoEdicion) {
      setIsSubmitting(false);
    }
  }, [mostrar, modoEdicion]);

  

  // Función auxiliar para obtener texto del botón
  const getButtonText = () => {
    if (isSubmitting) {
      return selectedImages.length > 0 ? 'Subiendo imágenes...' : 'Creando cabaña...';
    }
    return modoEdicion ? "Guardar Cambios" : "Crear Cabaña";
  };

  // Función utilitaria para manejar cambios de valores
  const handleFieldChange = (fieldName, value) => {
    if (modoEdicion) {
      setCabanaSeleccionada({ ...cabanaSeleccionada, [fieldName]: value });
    } else {
      setNuevaCabana({ ...nuevaCabana, [fieldName]: value });
    }
  };

  // Función utilitaria para obtener valores de campos
  const getFieldValue = (fieldName) => {
    // En modo edición algunos campos pueden venir como objetos (ej. categoria)
    if (modoEdicion) {
      const val = cabanaSeleccionada?.[fieldName];
      if (fieldName === 'categoria') {
        if (!val) return '';
        return typeof val === 'object' ? val._id : val;
      }
      return val;
    }
    return nuevaCabana[fieldName];
  };

  // Función auxiliar para preparar FormData con imágenes
  const prepararFormDataConImagenes = () => {
    const formData = new FormData();
    
    const cabanaData = modoEdicion ? cabanaSeleccionada : nuevaCabana;
    
    // Agregar campos básicos
    formData.append('nombre', cabanaData.nombre);
    formData.append('descripcion', cabanaData.descripcion);
    formData.append('capacidad', Number(cabanaData.capacidad));
    // Normalizar categoría: puede venir como id (string) o como objeto poblado
    const categoriaId = cabanaData?.categoria && typeof cabanaData.categoria === 'object'
      ? cabanaData.categoria._id
      : cabanaData?.categoria;
    formData.append('categoria', String(categoriaId || ''));
    formData.append('precio', Number(cabanaData.precio));
    formData.append('estado', cabanaData.estado);

    // Incluir ubicación si existe (permitir editarla también)
    if (cabanaData.ubicacion) {
      formData.append('ubicacion', cabanaData.ubicacion);
    }
    
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

  // Función mejorada para el submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const tieneImagenes = !modoEdicion && selectedImages.length > 0;
      
      if (tieneImagenes) {
        const formData = prepararFormDataConImagenes();
        agregarImagenesAFormData(formData);
        console.log('Enviando cabaña CON imágenes:', selectedImages.length, 'archivos');
        await onSubmit(formData, true);
      } else {
        await onSubmit();
      }
    } catch (error) {
      console.error('Error en handleSubmit:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        <div
          className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
          style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}
        >
          <h2>{modoEdicion ? "Editar Cabaña" : "Crear Nueva Cabaña"}</h2>
          <button className="modal-cerrar" onClick={onClose}>
            ✕
          </button>
        </div>
        <form className="modal-body-admin" onSubmit={handleSubmit}>
          <div className="from-grid-admin">
            <FormField id="nombre-cabana" label="Nombre:" value={getFieldValue('nombre')} onChange={e => handleFieldChange('nombre', e.target.value)} required placeholder="Nombre de la cabaña" />
            <FormField id="descripcion-cabana" label="Descripción:" value={getFieldValue('descripcion')} onChange={e => handleFieldChange('descripcion', e.target.value)} placeholder="Descripción" />
          </div>
          <div className="from-grid-admin">
            <FormField id="capacidad-cabana" label="Capacidad:" type="number" value={getFieldValue('capacidad')} onChange={e => handleFieldChange('capacidad', e.target.value)} required placeholder="Capacidad" />
            <FormField id="categoria-cabana" label="Categoría:" type="select" value={getFieldValue('categoria')} onChange={e => handleFieldChange('categoria', e.target.value)}>
              <option value="">Seleccione...</option>
              {categorias && categorias
                .filter(cat => String(cat.estado || '').toLowerCase() === 'activo')
                .map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nombre}</option>
                ))}
            </FormField>
          </div>
          <div className="from-grid-admin">
            <FormField id="precio-cabana" label="Precio:" type="number" value={getFieldValue('precio')} onChange={e => handleFieldChange('precio', e.target.value)} required placeholder="Precio por noche" />
            {/* Mostrar ubicación tanto en creación como en edición */}
            <FormField id="ubicacion-cabana" label="Ubicacion:" value={getFieldValue('ubicacion')} onChange={e => handleFieldChange('ubicacion', e.target.value)} placeholder="Ubicación" />
          </div>
      
            <div className="form-grupo-admin">
              <label htmlFor="estado-cabana">Estado:</label>
              <select
                id="estado-cabana"
                value={getFieldValue('estado')}
                onChange={e => handleFieldChange('estado', e.target.value)}
                required
              >
                <option value="disponible">Disponible</option>
                <option value="ocupada">Ocupada</option>
                <option value="mantenimiento">Mantenimiento</option>
              </select>
            </div>
        
            <ImageUploadArea isUploading={isUploading} progress={progress} selectedImages={selectedImages} handleFileSelection={handleFileSelection} removeImage={removeImage} />
      
          <small style={{ color: "#555", marginTop: "5px" }}>
            Puedes seleccionar varias imágenes manteniendo presionada la tecla Ctrl o Shift
          </small>
          <ModalFooter isSubmitting={isSubmitting} onClose={onClose} getButtonText={getButtonText} />
        </form>

      </div>
    </div>
  );
};
CabanaModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  cabanaSeleccionada: cabanaShape,
  setCabanaSeleccionada: PropTypes.func,
  nuevaCabana: cabanaShape,
  setNuevaCabana: PropTypes.func,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  categorias: PropTypes.array,
  selectedImages: PropTypes.array,
  setSelectedImages: PropTypes.func
};

export default CabanaModal;

