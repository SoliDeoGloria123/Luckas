const mongoose = require('mongoose');
const Cabana = require('../models/Cabana');
const Categorizacion = require('../models/categorizacion');
const fs = require('fs');
const path = require('path');

// CRUD básico
exports.crearCabana = async (req, res) => {
  try {
    const { categoria } = req.body;

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
  const cabana = new Cabana({ ...req.body, imagen, creadoPor: req.userId });
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

exports.actualizarCabana = async (req, res) => {
  try {
    let cabana = await Cabana.findById(req.params.id);
    if (!cabana) {
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }
    const cloudinary = require('../config/cloudinary');
    // Si hay nuevas imágenes subidas
    if (req.cloudinaryUrls && req.cloudinaryUrls.length > 0) {
      // Elimina las imágenes anteriores de Cloudinary si son URLs de Cloudinary
      if (Array.isArray(cabana.imagen)) {
        for (const url of cabana.imagen) {
          // Extraer public_id de la URL de Cloudinary
          const matches = url.match(/\/Luckas\/cabanas\/([^\.]+)\./);
          if (matches && matches[1]) {
            const publicId = `Luckas/cabanas/${matches[1]}`;
            try {
              await cloudinary.uploader.destroy(publicId);
            } catch (err) {
              console.error('Error eliminando imagen de Cloudinary:', publicId, err);
            }
          }
        }
      }
      // Guarda las nuevas URLs
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
    // Elimina las imágenes de Cloudinary si existen
    if (Array.isArray(cabana.imagen)) {
      for (const url of cabana.imagen) {
        const matches = url.match(/\/Luckas\/cabanas\/([^\.]+)\./);
        if (matches && matches[1]) {
          const publicId = `Luckas/cabanas/${matches[1]}`;
          try {
            await cloudinary.uploader.destroy(publicId);
          } catch (err) {
            console.error('Error eliminando imagen de Cloudinary:', publicId, err);
          }
        }
      }
    } else if (typeof cabana.imagen === 'string') {
      const matches = cabana.imagen.match(/\/Luckas\/cabanas\/([^\.]+)\./);
      if (matches && matches[1]) {
        const publicId = `Luckas/cabanas/${matches[1]}`;
        try {
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Error eliminando imagen de Cloudinary:', publicId, err);
        }
      }
    }
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