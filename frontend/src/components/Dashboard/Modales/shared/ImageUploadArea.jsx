import React from 'react';
import PropTypes from 'prop-types';

const ImageUploadArea = ({ isUploading, progress, selectedImages, handleFileSelection, removeImage }) => {
  return (
    <div className="form-group-tesorero full-width">
      <label htmlFor="imageInput">Imagen</label>
      <div className="image-upload-container">
        <button
          type="button"
          className="upload-area"
          onClick={() => !isUploading && document.getElementById('imageInput')?.click()}
          onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isUploading) return;
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) handleFileSelection(files);
          }}
          disabled={isUploading}
        >
          <div className="upload-content">
            <i className="fas fa-cloud-upload-alt upload-icon"></i>
            <h3>Arrastra y suelta tus imágenes aquí</h3>
            <p>o <span className="browse-text">haz clic para seleccionar</span></p>
            <small>Formatos soportados: JPG, PNG, GIF (máx. 5MB cada una)</small>
          </div>
          <input
            type="file"
            id="imageInput"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif"
            hidden
            onChange={(e) => {
              const files = e.target?.files;
              if (files && files.length > 0) handleFileSelection(files);
              e.target.value = '';
            }}
          />
        </button>

        {isUploading && (
          <div style={{ margin: '10px 0', padding: '10px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #e9ecef' }}>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#e9ecef', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#007bff', transition: 'width 0.3s ease' }}></div>
            </div>
            <p style={{ margin: '8px 0 0 0', fontSize: '14px', color: '#6c757d', textAlign: 'center' }}>Procesando imágenes... {Math.round(progress)}%</p>
          </div>
        )}

        <div className="image-preview-grid" id="imagePreviewGrid">
          {Array.isArray(selectedImages) && selectedImages.map(img => (
            <div key={img.id} className="image-preview">
              <img src={img.url} alt={img.name || 'Imagen'} />
              <div className="image-overlay">
                <button type="button" className="remove-btn" onClick={() => removeImage(img.id)}>
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 8px', fontSize: '11px', textAlign: 'center' }}>
                {img.name && img.name.length > 15 ? img.name.substring(0, 15) + '...' : (img.name || 'Sin nombre')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ImageUploadArea.propTypes = {
  isUploading: PropTypes.bool.isRequired,
  progress: PropTypes.number.isRequired,
  selectedImages: PropTypes.array.isRequired,
  handleFileSelection: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
};

export default ImageUploadArea;
