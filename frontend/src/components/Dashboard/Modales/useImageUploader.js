import { useState, useEffect } from 'react';

// Hook para encapsular la lógica de subida/gestión de imágenes
export default function useImageUploader({ selectedImages, setSelectedImages, mostrar, modoEdicion }) {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Resetear estado cuando se abre el modal en modo crear
  useEffect(() => {
    if (mostrar && !modoEdicion && setSelectedImages) {
      setSelectedImages([]);
      setProgress(0);
      setIsUploading(false);
    }
  }, [mostrar, modoEdicion, setSelectedImages]);

  const finishUpload = () => {
    setTimeout(() => setIsUploading(false), 500);
  };

  const addImageToState = (imageData) => {
    if (setSelectedImages && typeof setSelectedImages === 'function') {
      setSelectedImages(prev => Array.isArray(prev) ? [...prev, imageData] : [imageData]);
    }
  };

  // Manejo de archivos seleccionados
  const handleFileSelection = (files) => {
    const validFiles = [];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/gif']);

    for (const file of Array.from(files)) {
      if (!allowedTypes.has(file.type)) {
        console.warn(`Tipo de archivo no permitido: ${file.type}`);
        continue;
      }
      if (file.size > maxSize) {
        console.warn(`Archivo muy grande: ${file.name} (${file.size} bytes)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      uploadImages(validFiles);
    } else {
      alert('No se seleccionaron archivos válidos. Asegúrate de seleccionar imágenes JPG, PNG o GIF menores a 5MB.');
    }
  };

  // Simulación de carga de imágenes
  const uploadImages = (files) => {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(0);

    let uploadedCount = 0;
    const totalFiles = files.length;

    const handleUploadComplete = () => {
      uploadedCount++;
      // actualizar progreso (simple aproximación)
      setProgress((uploadedCount / totalFiles) * 100);
      if (uploadedCount === totalFiles) {
        finishUpload();
      }
    };

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const imageData = {
            id: Date.now() + index,
            file,
            url: e.target.result,
            name: file.name
          };
          addImageToState(imageData);
          handleUploadComplete();
        } catch (error) {
          console.error('Error procesando imagen:', error);
          handleUploadComplete();
        }
      };

      reader.onerror = () => {
        console.error('Error leyendo archivo');
        handleUploadComplete();
      };

      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id) => {
    if (setSelectedImages && typeof setSelectedImages === 'function') {
      setSelectedImages(prev => Array.isArray(prev) ? prev.filter(img => img.id !== id) : []);
    }
  };

  return {
    progress,
    isUploading,
    handleFileSelection,
    removeImage
  };
}
