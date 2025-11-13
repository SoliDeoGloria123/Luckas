import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ImageUploader = ({ 
  onImagesChange, 
  multiple = true, 
  maxSize = 5 * 1024 * 1024, // 5MB
  allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
}) => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const allowedTypesSet = new Set(allowedTypes);

  // Manejo de archivos seleccionados
  const handleFileSelection = (files) => {
    const validFiles = [];

    for (const file of Array.from(files)) {
      if (!allowedTypesSet.has(file.type)) continue;
      if (file.size > maxSize) continue;
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      uploadImages(validFiles);
    }
  };

  // Simulación de carga de imágenes
  const uploadImages = (files) => {
    if (isUploading) return;
    setIsUploading(true);
    setProgress(0);

    let uploadedCount = 0;
    const totalFiles = files.length;

    let index = 0;
    for (const file of files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = {
          id: Date.now() + index,
          file,
          url: e.target.result,
          name: file.name
        };

        setSelectedImages(prev => {
          const newImages = [...prev, imageData];
          onImagesChange?.(newImages);
          return newImages;
        });

        uploadedCount++;
        const progressValue = (uploadedCount / totalFiles) * 100;
        setProgress(progressValue);

        if (uploadedCount === totalFiles) {
          setTimeout(() => {
            setIsUploading(false);
          }, 500);
        }
      };
      reader.readAsDataURL(file);
      index++;
    }
  };

  const removeImage = (id) => {
    setSelectedImages(prev => {
      const newImages = prev.filter(img => img.id !== id);
      onImagesChange?.(newImages);
      return newImages;
    });
  };

  return (
    <div className="image-upload-container">
      <div className="upload-area-container">
        <button 
          type="button"
          className="upload-area" 
          onClick={() => !isUploading && document.getElementById('imageInput').click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelection(e.dataTransfer.files);
          }}
          disabled={isUploading}
        >
          <div className="upload-content">
            <i className="fas fa-cloud-upload-alt upload-icon"></i>
            <h3>Arrastra y suelta tus imágenes aquí</h3>
            <p>o <span className="browse-text">haz clic para seleccionar</span></p>
            <small>Formatos: {allowedTypes.join(', ')} (máx. {Math.round(maxSize / 1024 / 1024)}MB cada una)</small>
          </div>
        </button>
        <input 
          type="file" 
          id='imageInput' 
          multiple={multiple} 
          accept={allowedTypes.join(',')} 
          hidden 
          onChange={(e) => handleFileSelection(e.target.files)} 
        />
      </div>

      {isUploading && (
        <div className="upload-progress">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      <div className="image-preview-grid">
        {selectedImages.map(img => (
          <div key={img.id} className="image-preview">
            <img src={img.url} alt={img.name} />
            <div className="image-overlay">
              <button type="button" className="remove-btn" onClick={() => removeImage(img.id)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ImageUploader.propTypes = {
  onImagesChange: PropTypes.func,
  multiple: PropTypes.bool,
  maxSize: PropTypes.number,
  allowedTypes: PropTypes.arrayOf(PropTypes.string)
};

export default ImageUploader;