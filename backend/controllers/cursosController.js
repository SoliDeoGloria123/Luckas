const Curso = require('../models/Curso');
const usuarios = require('../models/User');

// Obtener todos los cursos
exports.obtenerCursos = async (req, res) => {
  try {
    const { categoria, estado, modalidad, nivel, page = 1, limit = 10 } = req.query;
    
    // Construir filtro
    const filtro = {};
    if (categoria) filtro.categoria = categoria;
    if (estado) filtro.estado = estado;
    if (modalidad) filtro.modalidad = modalidad;
    if (nivel) filtro.nivel = nivel;

    const skip = (page - 1) * limit;
    
    const cursos = await Curso.find(filtro)
      .populate('inscripciones.usuario', 'nombre apellido correo')
      .sort({ fechaInicio: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Curso.countDocuments(filtro);

    res.status(200).json({
      success: true,
      data: cursos,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalCursos: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener un curso por ID
exports.obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const curso = await Curso.findById(id)
      .populate('inscripciones.usuario', 'nombre apellido correo telefono');

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: curso
    });
  } catch (error) {
    console.error('Error al obtener curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear un nuevo curso
exports.crearCurso = async (req, res) => {
  try {
    const cursoDatos = req.body;

    // Validar fechas
    if (new Date(cursoDatos.fechaFin) <= new Date(cursoDatos.fechaInicio)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    const nuevoCurso = new Curso(cursoDatos);
    await nuevoCurso.save();

    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: nuevoCurso
    });
  } catch (error) {
    console.error('Error al crear curso:', error);
    
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

// Actualizar un curso
exports.actualizarCurso = async (req, res) => {
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

    const curso = await Curso.findByIdAndUpdate(
      id,
      actualizaciones,
      { new: true, runValidators: true }
    ).populate('inscripciones.usuario', 'nombre apellido correo');

    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Curso actualizado exitosamente',
      data: curso
    });
  } catch (error) {
    console.error('Error al actualizar curso:', error);
    
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

// Eliminar un curso
exports.eliminarCurso = async (req, res) => {
  try {
    const { id } = req.params;

    const curso = await Curso.findById(id);
    
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    // Verificar si hay inscripciones activas
    const inscripcionesActivas = curso.inscripciones.filter(
      ins => ins.estado === 'inscrito' || ins.estado === 'aprobado'
    );

    if (inscripcionesActivas.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar un curso con inscripciones activas',
        inscripcionesActivas: inscripcionesActivas.length
      });
    }

    await Curso.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar curso:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Inscribir usuario en un curso
exports.inscribirUsuario = async (req, res) => {
  try {
    const { id } = req.params; // ID del curso
    const { usuarioId } = req.body;

    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }

    const usuario = await usuarios.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    await curso.inscribirUsuario(usuarioId);

    res.status(200).json({
      success: true,
      message: 'Usuario inscrito exitosamente en el curso',
      data: {
        curso: curso.nombre,
        usuario: `${usuario.nombre} ${usuario.apellido}`,
        cuposRestantes: curso.cuposDisponibles - curso.cuposOcupados
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

// Obtener estadísticas de cursos
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const totalCursos = await Curso.countDocuments();
    const cursosActivos = await Curso.countDocuments({ estado: 'activo' });
    const cursosFinalizados = await Curso.countDocuments({ estado: 'finalizado' });
    
    const inscripcionesTotales = await Curso.aggregate([
      { $unwind: '$inscripciones' },
      { $count: 'total' }
    ]);

    const cursosPorCategoria = await Curso.aggregate([
      { $group: { _id: '$categoria', count: { $sum: 1 } } }
    ]);

    const cursosPorModalidad = await Curso.aggregate([
      { $group: { _id: '$modalidad', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totales: {
          cursos: totalCursos,
          cursosActivos,
          cursosFinalizados,
          inscripciones: inscripcionesTotales[0]?.total || 0
        },
        distribucion: {
          porCategoria: cursosPorCategoria,
          porModalidad: cursosPorModalidad
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

// Obtener cursos y programas técnicos combinados para seminaristas
exports.obtenerCursosYProgramas = async (req, res) => {
  try {
    const ProgramaTecnico = require('../models/ProgramaTecnico');
    
    const { categoria, estado = 'activo', modalidad, nivel, search } = req.query;
    
    // Filtros base
    const filtroBase = { estado: estado };
    
    if (modalidad) filtroBase.modalidad = modalidad;
    if (nivel) filtroBase.nivel = nivel;
    
    // Filtros específicos para cursos
    const filtroCursos = { ...filtroBase };
    if (categoria && categoria !== 'todos') {
      filtroCursos.categoria = categoria;
    }
    
    // Filtros específicos para programas técnicos
    const filtroProgramas = { ...filtroBase };
    if (categoria && categoria !== 'todos') {
      filtroProgramas.area = categoria;
    }
    
    // Búsqueda por texto
    if (search) {
      const searchRegex = { $regex: search, $options: 'i' };
      filtroCursos.$or = [
        { nombre: searchRegex },
        { descripcion: searchRegex },
        { instructor: searchRegex }
      ];
      filtroProgramas.$or = [
        { nombre: searchRegex },
        { descripcion: searchRegex },
        { coordinador: searchRegex }
      ];
    }
    
    // Obtener cursos
    const cursos = await Curso.find(filtroCursos)
      .select('nombre descripcion categoria nivel duracion modalidad instructor fechaInicio fechaFin cupos estado precio')
      .sort({ fechaInicio: 1 });
    
    // Obtener programas técnicos
    const programasTecnicos = await ProgramaTecnico.find(filtroProgramas)
      .select('nombre descripcion area nivel duracion modalidad coordinador fechaInicio fechaFin cupos estado precio')
      .sort({ fechaInicio: 1 });
    
    // Normalizar datos para que tengan la misma estructura
    const cursosNormalizados = cursos.map(curso => ({
      id: curso._id,
      nombre: curso.nombre,
      descripcion: curso.descripcion,
      categoria: curso.categoria,
      nivel: curso.nivel,
      duracion: curso.duracion,
      modalidad: curso.modalidad,
      instructor: curso.instructor,
      fechaInicio: curso.fechaInicio,
      fechaFin: curso.fechaFin,
      cupos: curso.cupos || { disponibles: 20, ocupados: 0, total: 20 },
      estado: curso.estado,
      precio: curso.precio || 0,
      tipo: 'curso'
    }));
    
    const programasNormalizados = programasTecnicos.map(programa => ({
      id: programa._id,
      nombre: programa.nombre,
      descripcion: programa.descripcion,
      categoria: programa.area,
      nivel: programa.nivel,
      duracion: programa.duracion,
      modalidad: programa.modalidad,
      instructor: programa.coordinador,
      fechaInicio: programa.fechaInicio,
      fechaFin: programa.fechaFin,
      cupos: programa.cupos || { disponibles: 15, ocupados: 0, total: 15 },
      estado: programa.estado,
      precio: programa.precio || 0,
      tipo: 'programa_tecnico'
    }));
    
    // Combinar y ordenar por fecha de inicio
    const todosCursos = [...cursosNormalizados, ...programasNormalizados]
      .sort((a, b) => new Date(a.fechaInicio) - new Date(b.fechaInicio));
    
    res.status(200).json({
      success: true,
      data: todosCursos,
      total: todosCursos.length,
      categorias: {
        cursos: cursosNormalizados.length,
        programasTecnicos: programasNormalizados.length
      }
    });
    
  } catch (error) {
    console.error('Error al obtener cursos y programas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
