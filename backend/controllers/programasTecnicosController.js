const ProgramaTecnico = require('../models/ProgramaTecnico');
const User = require('../models/User');

// Obtener todos los programas técnicos
exports.obtenerProgramasTecnicos = async (req, res) => {
  try {
    const { area, estado, modalidad, nivel, page = 1, limit = 10 } = req.query;
    
    // Construir filtro
    const filtro = {};
    if (area) filtro.area = area;
    if (estado) filtro.estado = estado;
    if (modalidad) filtro.modalidad = modalidad;
    if (nivel) filtro.nivel = nivel;

    const skip = (page - 1) * limit;
    
    const programas = await ProgramaTecnico.find(filtro)
      .populate('inscripciones.usuario', 'nombre apellido correo')
      .sort({ fechaInicio: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ProgramaTecnico.countDocuments(filtro);

    res.status(200).json({
      success: true,
      data: programas,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProgramas: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener programas técnicos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un programa técnico por ID
exports.obtenerProgramaTecnicoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const programa = await ProgramaTecnico.findById(id)
      .populate('inscripciones.usuario', 'nombre apellido correo telefono');

    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa técnico no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: programa
    });
  } catch (error) {
    console.error('Error al obtener programa técnico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear un nuevo programa técnico
exports.crearProgramaTecnico = async (req, res) => {
  try {
    const programaDatos = req.body;

    // Validar fechas
    if (new Date(programaDatos.fechaFin) <= new Date(programaDatos.fechaInicio)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    const nuevoPrograma = new ProgramaTecnico(programaDatos);
    await nuevoPrograma.save();

    res.status(201).json({
      success: true,
      message: 'Programa técnico creado exitosamente',
      data: nuevoPrograma
    });
  } catch (error) {
    console.error('Error al crear programa técnico:', error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errores
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar un programa técnico
exports.actualizarProgramaTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    // Validar fechas si se están actualizando
    if (actualizaciones.fechaInicio && actualizaciones.fechaFin) {
      if (new Date(actualizaciones.fechaFin) <= new Date(actualizaciones.fechaInicio)) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }
    }

    const programa = await ProgramaTecnico.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).populate('inscripciones.usuario', 'nombre apellido correo');

    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa técnico no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Programa técnico actualizado exitosamente',
      data: programa
    });
  } catch (error) {
    console.error('Error al actualizar programa técnico:', error);
    
    if (error.name === 'ValidationError') {
      const errores = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errores
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un programa técnico
exports.eliminarProgramaTecnico = async (req, res) => {
  try {
    const { id } = req.params;

    const programa = await ProgramaTecnico.findById(id);
    
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa técnico no encontrado'
      });
    }

    // Verificar si hay inscripciones activas
    const inscripcionesActivas = programa.inscripciones.filter(
      ins => ['inscrito', 'matriculado', 'en_curso'].includes(ins.estado)
    );

    if (inscripcionesActivas.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un programa técnico con inscripciones activas',
        inscripcionesActivas: inscripcionesActivas.length
      });
    }

    await ProgramaTecnico.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Programa técnico eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar programa técnico:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Inscribir usuario en un programa técnico
exports.inscribirUsuario = async (req, res) => {
  try {
    const { id } = req.params; // ID del programa
    const { usuarioId } = req.body;

    const programa = await ProgramaTecnico.findById(id);
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa técnico no encontrado'
      });
    }

    const usuario = await User.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await programa.inscribirUsuario(usuarioId);

    res.status(200).json({
      success: true,
      message: 'Usuario inscrito exitosamente en el programa técnico',
      data: {
        programa: programa.nombre,
        usuario: `${usuario.nombre} ${usuario.apellido}`,
        cuposRestantes: programa.cuposDisponibles - programa.cuposOcupados
      }
    });
  } catch (error) {
    console.error('Error al inscribir usuario:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

// Obtener progreso de un estudiante
exports.obtenerProgresoEstudiante = async (req, res) => {
  try {
    const { id, usuarioId } = req.params;

    const programa = await ProgramaTecnico.findById(id);
    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa técnico no encontrado'
      });
    }

    const inscripcion = programa.inscripciones.find(
      ins => ins.usuario.toString() === usuarioId
    );

    if (!inscripcion) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no inscrito en este programa'
      });
    }

    const porcentajeProgreso = programa.calcularProgreso(usuarioId);

    res.status(200).json({
      success: true,
      data: {
        programa: programa.nombre,
        progreso: inscripcion.progreso,
        porcentajeCalculado: porcentajeProgreso,
        calificaciones: inscripcion.calificaciones,
        estado: inscripcion.estado
      }
    });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener estadísticas de programas técnicos
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const totalProgramas = await ProgramaTecnico.countDocuments();
    const programasActivos = await ProgramaTecnico.countDocuments({ estado: 'activo' });
    const programasEnProceso = await ProgramaTecnico.countDocuments({ estado: 'en_proceso' });
    const programasFinalizados = await ProgramaTecnico.countDocuments({ estado: 'finalizado' });
    
    const inscripcionesTotales = await ProgramaTecnico.aggregate([
      { $unwind: '$inscripciones' },
      { $count: 'total' }
    ]);

    const programasPorArea = await ProgramaTecnico.aggregate([
      { $group: { _id: '$area', count: { $sum: 1 } } }
    ]);

    const programasPorNivel = await ProgramaTecnico.aggregate([
      { $group: { _id: '$nivel', count: { $sum: 1 } } }
    ]);

    const programasPorModalidad = await ProgramaTecnico.aggregate([
      { $group: { _id: '$modalidad', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totales: {
          programas: totalProgramas,
          programasActivos,
          programasEnProceso,
          programasFinalizados,
          inscripciones: inscripcionesTotales[0]?.total || 0
        },
        distribucion: {
          porArea: programasPorArea,
          porNivel: programasPorNivel,
          porModalidad: programasPorModalidad
        }
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
