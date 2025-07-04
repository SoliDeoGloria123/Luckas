// controllers/programasAcademicosController.js
const ProgramaAcademico = require('../models/ProgramaAcademico');
const User = require('../models/User');

// Obtener todos los programas académicos (con filtros)
exports.obtenerProgramas = async (req, res) => {
  try {
    const { tipo, modalidad, duracion, busqueda, activo = true } = req.query;
    
    const filtros = {
      tipo,
      modalidad,
      duracion,
      busqueda,
      activo: activo === 'true'
    };
    
    // Remover filtros vacíos
    Object.keys(filtros).forEach(key => {
      if (!filtros[key] || filtros[key] === 'undefined') {
        delete filtros[key];
      }
    });
    
    const programas = await ProgramaAcademico.buscarProgramas(filtros);
    
    res.status(200).json({
      success: true,
      data: programas,
      total: programas.length
    });
  } catch (error) {
    console.error('Error obteniendo programas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un programa por ID
exports.obtenerProgramaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const programa = await ProgramaAcademico.findById(id)
      .populate('creadoPor', 'nombre apellido correo')
      .populate('categorias', 'nombre codigo')
      .populate('inscripciones.usuario', 'nombre apellido correo');
    
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa académico no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: programa
    });
  } catch (error) {
    console.error('Error obteniendo programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear nuevo programa académico (solo admin)
exports.crearPrograma = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden crear programas académicos'
      });
    }
    
    const programaData = {
      ...req.body,
      creadoPor: req.user.id
    };
    
    // Validar fechas
    if (programaData.fechaFin && new Date(programaData.fechaFin) <= new Date(programaData.fechaInicio)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }
    
    const programa = new ProgramaAcademico(programaData);
    await programa.save();
    
    await programa.populate('creadoPor', 'nombre apellido');
    
    res.status(201).json({
      success: true,
      message: 'Programa académico creado exitosamente',
      data: programa
    });
  } catch (error) {
    console.error('Error creando programa:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de validación incorrectos',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar programa académico (solo admin)
exports.actualizarPrograma = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden actualizar programas académicos'
      });
    }
    
    const { id } = req.params;
    const actualizaciones = req.body;
    
    // Validar fechas si se están actualizando
    if (actualizaciones.fechaFin && actualizaciones.fechaInicio) {
      if (new Date(actualizaciones.fechaFin) <= new Date(actualizaciones.fechaInicio)) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }
    }
    
    const programa = await ProgramaAcademico.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).populate('creadoPor', 'nombre apellido');
    
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa académico no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Programa académico actualizado exitosamente',
      data: programa
    });
  } catch (error) {
    console.error('Error actualizando programa:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Datos de validación incorrectos',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar programa académico (solo admin)
exports.eliminarPrograma = async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden eliminar programas académicos'
      });
    }
    
    const { id } = req.params;
    
    const programa = await ProgramaAcademico.findById(id);
    
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa académico no encontrado'
      });
    }
    
    // En lugar de eliminar, marcar como inactivo si hay inscripciones
    if (programa.inscripciones && programa.inscripciones.length > 0) {
      programa.activo = false;
      await programa.save();
      
      return res.status(200).json({
        success: true,
        message: 'Programa académico desactivado (tiene inscripciones asociadas)',
        data: programa
      });
    }
    
    // Si no hay inscripciones, eliminar completamente
    await ProgramaAcademico.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Programa académico eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Inscribir usuario a programa
exports.inscribirUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { metodoPago, nivelEducativo, experiencia } = req.body;
    
    // Validar datos requeridos
    if (!nivelEducativo) {
      return res.status(400).json({
        success: false,
        message: 'El nivel educativo es requerido'
      });
    }
    
    const programa = await ProgramaAcademico.findById(id);
    
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa académico no encontrado'
      });
    }
    
    if (!programa.activo) {
      return res.status(400).json({
        success: false,
        message: 'Este programa académico no está disponible'
      });
    }
    
    // Verificar cupos disponibles
    if (programa.estaLleno) {
      return res.status(400).json({
        success: false,
        message: 'No hay cupos disponibles para este programa'
      });
    }
    
    // Verificar si el usuario ya está inscrito
    const yaInscrito = programa.inscripciones.some(
      inscripcion => inscripcion.usuario.toString() === userId.toString() && 
                     inscripcion.estado !== 'cancelada'
    );
    
    if (yaInscrito) {
      return res.status(400).json({
        success: false,
        message: 'Ya estás inscrito en este programa'
      });
    }
    
    // Crear inscripción
    const datosInscripcion = {
      metodoPago: metodoPago || 'total',
      nivelEducativo,
      experiencia,
      estado: 'pendiente' // Se confirmará después del pago
    };
    
    await programa.inscribirUsuario(userId, datosInscripcion);
    
    // Obtener el programa actualizado con las inscripciones
    const programaActualizado = await ProgramaAcademico.findById(id)
      .populate('inscripciones.usuario', 'nombre apellido correo');
    
    res.status(200).json({
      success: true,
      message: 'Inscripción realizada exitosamente',
      data: {
        programa: programaActualizado,
        inscripcion: programaActualizado.inscripciones.find(
          ins => ins.usuario._id.toString() === userId.toString()
        )
      }
    });
  } catch (error) {
    console.error('Error en inscripción:', error);
    
    if (error.message.includes('cupos disponibles') || error.message.includes('ya está inscrito')) {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Cancelar inscripción
exports.cancelarInscripcion = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    const programa = await ProgramaAcademico.findById(id);
    
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa académico no encontrado'
      });
    }
    
    await programa.cancelarInscripcion(userId);
    
    res.status(200).json({
      success: true,
      message: 'Inscripción cancelada exitosamente'
    });
  } catch (error) {
    console.error('Error cancelando inscripción:', error);
    
    if (error.message.includes('no encontrada')) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener inscripciones del usuario actual
exports.obtenerMisInscripciones = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const programas = await ProgramaAcademico.find({
      'inscripciones.usuario': userId,
      'inscripciones.estado': { $ne: 'cancelada' }
    }).populate('creadoPor', 'nombre apellido');
    
    // Filtrar solo las inscripciones del usuario actual
    const misInscripciones = programas.map(programa => {
      const inscripcion = programa.inscripciones.find(
        ins => ins.usuario.toString() === userId.toString() && ins.estado !== 'cancelada'
      );
      
      return {
        programa: {
          _id: programa._id,
          titulo: programa.titulo,
          descripcion: programa.descripcion,
          tipo: programa.tipo,
          modalidad: programa.modalidad,
          duracion: programa.duracion,
          precio: programa.precio,
          fechaInicio: programa.fechaInicio,
          profesor: programa.profesor,
          creadoPor: programa.creadoPor
        },
        inscripcion
      };
    });
    
    res.status(200).json({
      success: true,
      data: misInscripciones,
      total: misInscripciones.length
    });
  } catch (error) {
    console.error('Error obteniendo inscripciones del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estadísticas de programas (para admin)
exports.obtenerEstadisticas = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden ver las estadísticas'
      });
    }
    
    const totalProgramas = await ProgramaAcademico.countDocuments({ activo: true });
    const totalInscripciones = await ProgramaAcademico.aggregate([
      { $match: { activo: true } },
      { $unwind: '$inscripciones' },
      { $match: { 'inscripciones.estado': 'confirmada' } },
      { $count: 'total' }
    ]);
    
    const programasPorTipo = await ProgramaAcademico.aggregate([
      { $match: { activo: true } },
      { $group: { _id: '$tipo', count: { $sum: 1 } } }
    ]);
    
    const programasPorModalidad = await ProgramaAcademico.aggregate([
      { $match: { activo: true } },
      { $group: { _id: '$modalidad', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalProgramas,
        totalInscripciones: totalInscripciones[0]?.total || 0,
        programasPorTipo,
        programasPorModalidad
      }
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
