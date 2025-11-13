const mongoose = require('mongoose');
const Cabana = require('../models/Cabana');
const Categorizacion = require('../models/categorizacion');
// CRUD básico
exports.crearCabana = async (req, res) => {
  try {
    console.log('[CABANAS] crearCabana - Iniciando creación');
    console.log('[CABANAS] req.body:', req.body);
    console.log('[CABANAS] req.files:', req.files ? req.files.length : 'No files');
    console.log('[CABANAS] req.cloudinaryUrls:', req.cloudinaryUrls);
    
    const { categoria, capacidad, precio } = req.body;
    
    // Validar datos básicos
    if (!req.body.nombre || !req.body.nombre.trim()) {
      return res.status(400).json({ success: false, message: 'Nombre es obligatorio' });
    }
    
    if (!req.body.descripcion || !req.body.descripcion.trim()) {
      return res.status(400).json({ success: false, message: 'Descripción es obligatoria' });
    }
    
    if (!capacidad || Number(capacidad) < 1) {
      return res.status(400).json({ success: false, message: 'Capacidad debe ser mayor a 0' });
    }
    
    if (!precio || Number(precio) < 0) {
      return res.status(400).json({ success: false, message: 'Precio debe ser mayor o igual a 0' });
    }

    // Validar que el ID de categoría sea válido
    if (!mongoose.Types.ObjectId.isValid(categoria)) {
      return res.status(400).json({ success: false, message: 'ID de categoría inválido' });
    }

    // Validar que la categoría exista
    const categoriaExiste = await Categorizacion.findById(categoria);
    if (!categoriaExiste) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
  // Usar las URLs de Cloudinary si existen, si no, array vacío
  const imagen = req.cloudinaryUrls || [];
  console.log('[CABANAS] Imágenes a guardar:', imagen);
  
  const datosCompletos = {
    nombre: req.body.nombre.trim(),
    descripcion: req.body.descripcion.trim(),
    capacidad: Number(req.body.capacidad),
    categoria: req.body.categoria,
    precio: Number(req.body.precio),
    ubicacion: req.body.ubicacion ? req.body.ubicacion.trim() : '',
    estado: req.body.estado || 'disponible',
    imagen,
    creadoPor: req.userId
  };
  
  console.log('[CABANAS] Datos completos para crear cabaña:', datosCompletos);
  
  const cabana = new Cabana(datosCompletos);
  console.log('[CABANAS] Cabaña creada en memoria, guardando...');
  
  await cabana.save();
  console.log('[CABANAS] Cabaña guardada exitosamente:', cabana._id);
  
  res.status(201).json({ success: true, data: cabana });
  } catch (error) {
    console.error('[CABANAS] Error al crear cabaña:', error);
    console.error('[CABANAS] Stack trace:', error.stack);
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.obtenerCabanas = async (req, res) => {
  try {
    const cabanas = await Cabana.find()
      .populate('categoria', 'nombre')
      .populate('creadoPor', 'nombre email');
    res.json({ success: true, data: cabanas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerCabanaPorId = async (req, res) => {
  try {
    const cabana = await Cabana.findById(req.params.id)
      .populate('categoria', 'nombre')
      .populate('creadoPor', 'nombre email');
    if (!cabana) {
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }
    res.json({ success: true, data: cabana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
async function eliminarImagenesCloudinary(imagenes, cloudinary) {
  if (!imagenes) return;
  const urls = Array.isArray(imagenes) ? imagenes : [imagenes];
  for (const url of urls) {
    const matches = url.match(/\/Luckas\/cabanas\/([^.]+)\./);
    if (matches?.[1]) {
      const publicId = `Luckas/cabanas/${matches[1]}`;
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.error('Error eliminando imagen de Cloudinary:', publicId, err);
      }
    }
  }
}

exports.actualizarCabana = async (req, res) => {
  try {
    let cabana = await Cabana.findById(req.params.id);
    if (!cabana) {
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }
    const cloudinary = require('../config/cloudinary');
    if (req.cloudinaryUrls?.length > 0) {
      await eliminarImagenesCloudinary(cabana.imagen, cloudinary);
      req.body.imagen = req.cloudinaryUrls;
    }
    cabana = await Cabana.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('categoria', 'nombre')
      .populate('creadoPor', 'nombre email');
    res.json({ success: true, data: cabana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.eliminarCabana = async (req, res) => {
  try {
    const cabana = await Cabana.findByIdAndDelete(req.params.id);
    if (!cabana) {
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }
    // Eliminar reservas asociadas a esta cabaña
    const Reserva = require('../models/Reservas');
    const result = await Reserva.deleteMany({ cabana: cabana._id });
    console.log(`[CABAÑAS] Se eliminaron ${result.deletedCount} reservas asociadas a la cabaña.`);

    const cloudinary = require('../config/cloudinary');
    await eliminarImagenesCloudinary(cabana.imagen, cloudinary);

    res.json({ success: true, message: `Cabaña eliminada. Se eliminaron ${result.deletedCount} reservas asociadas.` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Categorizar cabaña
exports.categorizarCabana = async (req, res) => {
  try {
    const { categoria } = req.body;
    const cabana = await Cabana.findByIdAndUpdate(
      req.params.id,
      { categoria },
      { new: true }
    )
      .populate('categoria', 'nombre')
      .populate('creadoPor', 'nombre email');
    if (!cabana) {
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }
    res.json({ success: true, data: cabana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};