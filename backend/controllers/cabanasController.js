const mongoose = require('mongoose');
const Cabana = require('../models/Cabana');
const Categorizacion = require('../models/categorizacion');

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

    const cabana = new Cabana({ ...req.body, creadoPor: req.userId });
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
    const cabana = await Cabana.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('categoria', 'nombre')
      .populate('creadoPor', 'nombre email');
    if (!cabana) return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    res.json({ success: true, data: cabana });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.eliminarCabana = async (req, res) => {
  try {
    const cabana = await Cabana.findByIdAndDelete(req.params.id);
    if (!cabana) return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
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