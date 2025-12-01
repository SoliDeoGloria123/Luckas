const mongoose = require('mongoose');
const Cabana = require('../models/Cabana');
const Categorizacion = require('../models/categorizacion');
// CRUD básico
exports.crearCabana = async (req, res) => {
  try {
    
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
  
  
  const cabana = new Cabana(datosCompletos);
  
  await cabana.save();
  
  res.status(201).json({ success: true, data: cabana });
  } catch (error) {
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
      }
    }
  }
}

// Helper: parsear existingImages que envía el cliente
function parseExistingImages(req) {
  if (!req.body || !req.body.existingImages) return [];
  try {
    const parsed = JSON.parse(req.body.existingImages);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

// Helper: eliminar las URLs que ya no están presentes en keptImages
async function deleteRemovedImages(prevImages, keptImages, cloudinary) {
  if (!Array.isArray(prevImages) || !Array.isArray(keptImages)) return;
  const toDelete = prevImages.filter(url => !keptImages.includes(url));
  if (toDelete.length === 0) return;
  await eliminarImagenesCloudinary(toDelete, cloudinary);
}

// Helper: merge existing images (client) and newly uploaded Cloudinary URLs
async function handleImageMerge(req, cabana, cloudinary) {
  const nuevasUrls = Array.isArray(req.cloudinaryUrls) ? req.cloudinaryUrls : [];
  const existingFromBody = parseExistingImages(req);

  if (existingFromBody.length > 0) {
    // Mantener las existentes que el cliente indicó y agregar las nuevas
    await deleteRemovedImages(Array.isArray(cabana.imagen) ? cabana.imagen : [], existingFromBody, cloudinary);
    req.body.imagen = [...existingFromBody, ...nuevasUrls];
    return;
  }

  if (nuevasUrls.length > 0) {
    // No se enviaron existingImages — el cliente quiere reemplazar todas las imágenes
    await eliminarImagenesCloudinary(cabana.imagen, cloudinary);
    req.body.imagen = nuevasUrls;
  }
}

// Helper: sanitize categoria field to avoid invalid ObjectId casts
function sanitizeCategoriaField(req) {
  // Usar operador 'in' para detectar presencia de la propiedad (evita hasOwnProperty call)
  if (!req.body || !('categoria' in req.body)) return;

  let cat = req.body.categoria;
  // Si viene como objeto poblado, extraer su _id
  if (typeof cat === 'object' && cat !== null) {
    if (cat._id) {
      cat = String(cat._id);
      req.body.categoria = cat;
    } else {
      // objeto sin _id: eliminar para evitar casteos inválidos
      delete req.body.categoria;
      return;
    }
  }

  if (typeof cat === 'string') {
    if (cat.trim() === '' || !mongoose.Types.ObjectId.isValid(cat)) {
      delete req.body.categoria;
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
    // Delegar la lógica de imágenes a la función helper
    await handleImageMerge(req, cabana, cloudinary);
    // Sanitizar campo categoria antes de actualizar
    sanitizeCategoriaField(req);
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

exports.obtenerEstadisticasCabanas = async (req, res) => {
  try {
    const totalCabanas = await Cabana.countDocuments();
    const disponibles = await Cabana.countDocuments({ estado: 'disponible' });
    const ocupadas = await Cabana.countDocuments({ estado: 'ocupada' });
    const mantenimiento = await Cabana.countDocuments({ estado: 'mantenimiento' });

    const capacidadTotal = await Cabana.aggregate([
      {
        $group: {
          _id: null,
          totalCapacidad: { $sum: '$capacidad' }
        }
      }
    ]);

    const precioPromedio = await Cabana.aggregate([
      {
        $group: {
          _id: null,
          promedioPrecio: { $avg: '$precio' }
        }
      }
    ]);

    res.status(200).json({
      totalCabanas,
      disponibles,
      ocupadas,
      mantenimiento,
      capacidadTotal: capacidadTotal[0]?.totalCapacidad || 0,
      precioPromedio: precioPromedio[0]?.promedioPrecio || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener estadísticas de cabañas' });
  }
};