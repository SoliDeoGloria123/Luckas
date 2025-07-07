const Reporte = require('../models/Reportes');

// Guardar un reporte generado en la base de datos
exports.guardarReporte = async (req, res) => {
  try {
    const { nombre, descripcion, tipo, filtros, datos } = req.body;
    const creadoPor = req.user?._id || null; // Si usas autenticación

    if (!nombre || !descripcion || !tipo || !datos) {
      return res.status(400).json({ success: false, message: 'Faltan campos obligatorios' });
    }

    const nuevoReporte = new Reporte({
      nombre,
      descripcion,
      tipo,
      filtros: filtros || {},
      datos,
      creadoPor
    });

    await nuevoReporte.save();
    res.status(201).json({ success: true, message: 'Reporte guardado correctamente', data: nuevoReporte });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
