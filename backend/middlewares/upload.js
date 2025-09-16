const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento
const guardar = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder= 'otros';

    if(req.tipoImagen === 'cabanas') {
      folder = 'cabanas';
    }else if (req.tipoImagen === 'eventos') {
      folder = 'eventos';
    }else if (req.tipoImagen === 'perfiles') {
      folder = 'perfiles';
    }
    cb(null, path.join(__dirname, `../public/uploads/${folder}`)); // Guarda en /backend/uploads
  },
  filename: (req, file, cb) => {
    if (file) {
      const ext = file.originalname.split('.').pop();
      cb(null, Date.now() + '.' + ext); // Nombre único basado en la fecha
    }
  }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
  if (file && (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' 
    || file.mimetype === 'image/png')) {
    cb(null, true);
  }else {
    cb(null, false);
    req.fileValidationError = 'Solo se permiten imágenes JPEG o PNG';
  }  
};

const upload = multer({ storage: guardar, fileFilter });

module.exports ={
  uploadSingle: upload.single('imagen'),      // Para una sola imagen
  uploadMultiple: upload.array('imagen', 10), // Para varias imágenes con el mismo campo `imagen`
  uploadProfile: upload.single('fotoPerfil'), // Para foto de perfil
  upload  
};
