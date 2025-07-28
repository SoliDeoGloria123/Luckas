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
    const imagen = req.files?.map(file => file.filename) || [];
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
    if (req.files && req.files.length > 0) {
      // Elimina todas las imágenes anteriores
      if (Array.isArray(cabana.imagen)) {
        cabana.imagen.forEach(nombreImagen => {
          const rutaImagen = path.join(__dirname, '../public/uploads/cabanas', nombreImagen);
          if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
          }
        });
      }

      // Guarda los nombres de las nuevas imágenes
      req.body.imagen = req.files.map(file => file.filename);
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
    // Elimina la imagen del sistema de archivos si existe
    if (Array.isArray(cabana.imagen)) {
      cabana.imagen.forEach((nombreImagen) => {
        const rutaImagen = path.join(__dirname, '../public/uploads/cabanas', nombreImagen);
        if (fs.existsSync(rutaImagen)) {
          fs.unlinkSync(rutaImagen);
        }
      });
    } else if (typeof cabana.imagen === 'string') {

      const rutaImagen = path.join(__dirname, '../public/uploads/cabanas', cabana.imagen);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }
    res.json({ success: true, message: 'Cabaña eliminada' });
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