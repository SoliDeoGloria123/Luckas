const ProgramaAcademico = require('../models/ProgramaAcademico');

// Crear un nuevo programa académico
exports.crearProgramaAcademico = async (req, res) => {
  try {
    const datos = req.body;
    // Validar fechas
    if (new Date(datos.fechaFin) <= new Date(datos.fechaInicio)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }
    const nuevoPrograma = new ProgramaAcademico({
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      categoria: datos.categoria,
      modalidad: datos.modalidad,
      duracion: datos.duracion,
      precio: datos.precio,
      fechaInicio: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      cuposDisponibles: datos.cuposDisponibles,
      profesor: datos.profesor,
      nivel: datos.nivel,
      requisitos: datos.requisitos || [],
      objetivos: datos.objetivos || [],
      metodologia: datos.metodologia || '',
      evaluacion: datos.evaluacion || '',
      certificacion: datos.certificacion || false,
      destacado: datos.destacado || false,
      estado: datos.estado || 'activo'
    });
    await nuevoPrograma.save();
    res.status(201).json({ success: true, message: 'Programa académico creado exitosamente', data: nuevoPrograma });
  } catch (error) {
    console.error('Error al crear programa académico:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Obtener todos los programas académicos
exports.obtenerProgramasAcademicos = async (req, res) => {
  try {
    const programas = await ProgramaAcademico.find()
      .populate('categoria')
      .sort({ fechaInicio: -1 });
    res.status(200).json({ success: true, data: programas });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Obtener programa académico por ID
exports.obtenerProgramaAcademicoPorId = async (req, res) => {
  try {
    const programa = await ProgramaAcademico.findById(req.params.id);
    if (!programa) {
      return res.status(404).json({ success: false, message: 'Programa académico no encontrado' });
    }
    res.status(200).json({ success: true, data: programa });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Actualizar programa académico
exports.actualizarProgramaAcademico = async (req, res) => {
  try {
    const { id } = req.params;
    const datos = req.body;
    if (datos.fechaInicio && datos.fechaFin) {
      if (new Date(datos.fechaFin) <= new Date(datos.fechaInicio)) {
        return res.status(400).json({ success: false, message: 'La fecha de fin debe ser posterior a la fecha de inicio' });
      }
    }
    const programa = await ProgramaAcademico.findByIdAndUpdate(id, datos, { new: true, runValidators: true });
    if (!programa) {
      return res.status(404).json({ success: false, message: 'Programa académico no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Programa académico actualizado', data: programa });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};

// Eliminar programa académico
exports.eliminarProgramaAcademico = async (req, res) => {
  try {
    const { id } = req.params;
    const programa = await ProgramaAcademico.findByIdAndDelete(id);
    if (!programa) {
      return res.status(404).json({ success: false, message: 'Programa académico no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Programa académico eliminado' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error interno del servidor', error: error.message });
  }
};
