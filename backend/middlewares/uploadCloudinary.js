// backend/middlewares/uploadCloudinary.js
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const storage = multer.memoryStorage();
// Límite de 5 MB por archivo
const upload = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB por archivo
}).single('imagen'); // Para un solo archivo

const uploadMultiple = multer({ 
  storage, 
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB por archivo
}).array('imagen', 10); // Hasta 10 archivos

const uploadToCloudinary = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          { folder: 'Luckas' }, // Puedes cambiar el folder
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };
    const result = await streamUpload(req);
    req.file.cloudinaryUrl = result.secure_url;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error al subir imagen a Cloudinary', details: error });
  }
};

// Middleware para subir varias imágenes a Cloudinary
const uploadMultipleToCloudinary = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }
  try {
    const urls = [];
    // Carpeta dinámica según tipoImagen (ej: 'eventos', 'cabanas', 'usuarios')
    const tipo = req.tipoImagen || 'otros';
    for (const file of req.files) {
      const streamUpload = (file) => {
        return new Promise((resolve, reject) => {
          let stream = cloudinary.uploader.upload_stream(
            { folder: `Luckas/${tipo}` },
            (error, result) => {
              if (result) {
                resolve(result);
              } else {
                reject(error);
              }
            }
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(file);
      urls.push(result.secure_url);
    }
    req.cloudinaryUrls = urls;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error al subir imágenes a Cloudinary', details: error.message });
  }
};

module.exports = { upload, uploadToCloudinary, uploadMultiple, uploadMultipleToCloudinary };