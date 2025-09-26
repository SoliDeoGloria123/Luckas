const Curso = require('../models/Curso');
const ProgramaTecnico = require('../models/ProgramaTecnico');

// Crear un nuevo programa (curso o técnico)
exports.crearPrograma = async (req, res) => {
  try {
    const programaDatos = req.body;
    console.log('Datos recibidos:', programaDatos);

    // Validar fechas
    if (new Date(programaDatos.fechaFin) <= new Date(programaDatos.fechaInicio)) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    }

    let nuevoPrograma;
    
    // Determinar si es curso o programa técnico
    if (programaDatos.tipo === 'curso') {
      // Mapear campos específicos para cursos
      const cursoDatos = {
        nombre: programaDatos.titulo,
        descripcion: programaDatos.descripcion,
        categoria: programaDatos.categoria || 'general',
        modalidad: programaDatos.modalidad,
        duracion: programaDatos.duracion,
        costo: parseFloat(programaDatos.precio),
        fechaInicio: programaDatos.fechaInicio,
        fechaFin: programaDatos.fechaFin,
        cuposDisponibles: parseInt(programaDatos.cupos),
        instructor: programaDatos.profesor,
        nivel: programaDatos.nivel || 'basico',
        requisitos: programaDatos.requisitos || [],
        objetivos: programaDatos.objetivos || [],
        metodologia: programaDatos.metodologia || '',
        evaluacion: programaDatos.evaluacion || '',
        certificacion: programaDatos.certificacion || false,
        destacado: programaDatos.destacado || false,
        estado: 'activo'
      };

      nuevoPrograma = new Curso(cursoDatos);
      
    } else if (programaDatos.tipo === 'tecnico') {
      // Mapear campos específicos para programas técnicos
      const programaTecnicoDatos = {
        nombre: programaDatos.titulo,
        descripcion: programaDatos.descripcion,
        area: programaDatos.area || 'otros',
        modalidad: programaDatos.modalidad,
        duracion: {
          meses: Math.ceil(parseInt(programaDatos.duracion) / 4) || 1, // Convertir semanas a meses aproximadamente
          horas: parseInt(programaDatos.duracion) * 40 || 40 // Estimación de horas por duración
        },
        costo: {
          matricula: parseFloat(programaDatos.precio) || 0,
          mensualidad: parseFloat(programaDatos.precio) * 0.1 || 0, // 10% como mensualidad
          certificacion: 0
        },
        fechaInicio: programaDatos.fechaInicio,
        fechaFin: programaDatos.fechaFin,
        cuposDisponibles: parseInt(programaDatos.cupos),
        coordinador: programaDatos.profesor,
        instructor: programaDatos.profesor, // Para compatibilidad
        nivel: programaDatos.nivel || 'tecnico_laboral',
        requisitos: {
          academicos: programaDatos.requisitos || [],
          documentos: [],
          otros: []
        },
        competencias: programaDatos.objetivos ? programaDatos.objetivos.map(obj => ({ 
          nombre: obj, 
          descripcion: obj 
        })) : [],
        modulos: programaDatos.pensum ? programaDatos.pensum.map((item, index) => ({
          nombre: item.modulo || `Módulo ${index + 1}`,
          descripcion: item.descripcion || '',
          duracionHoras: parseInt(item.horas) || 40,
          orden: index + 1
        })) : [],
        metodologia: programaDatos.metodologia || '',
        evaluacion: programaDatos.evaluacion || '',
        certificacion: {
          disponible: programaDatos.certificacion !== undefined ? programaDatos.certificacion : true
        },
        destacado: programaDatos.destacado || false,
        estado: 'activo'
      };

      nuevoPrograma = new ProgramaTecnico(programaTecnicoDatos);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Tipo de programa no válido. Debe ser "curso" o "tecnico"'
      });
    }

    await nuevoPrograma.save();

    res.status(201).json({
      success: true,
      message: `${programaDatos.tipo === 'curso' ? 'Curso' : 'Programa técnico'} creado exitosamente`,
      data: nuevoPrograma
    });

  } catch (error) {
    console.error('Error al crear programa:', error);
    
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

// Actualizar un programa (curso o técnico)
exports.actualizarPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    const programaDatos = req.body;

    // Validar fechas si se están actualizando
    if (programaDatos.fechaInicio && programaDatos.fechaFin) {
      if (new Date(programaDatos.fechaFin) <= new Date(programaDatos.fechaInicio)) {
        return res.status(400).json({
          success: false,
          message: 'La fecha de fin debe ser posterior a la fecha de inicio'
        });
      }
    }

    let programa;
    
    // Intentar encontrar en cursos primero
    programa = await Curso.findById(id);
    if (programa) {
      // Es un curso, mapear campos
      const actualizaciones = {
        nombre: programaDatos.titulo,
        descripcion: programaDatos.descripcion,
        modalidad: programaDatos.modalidad,
        duracion: programaDatos.duracion,
        costo: programaDatos.precio ? parseFloat(programaDatos.precio) : programa.costo,
        fechaInicio: programaDatos.fechaInicio,
        fechaFin: programaDatos.fechaFin,
        cuposDisponibles: programaDatos.cupos ? parseInt(programaDatos.cupos) : programa.cuposDisponibles,
        instructor: programaDatos.profesor,
        requisitos: programaDatos.requisitos || programa.requisitos,
        objetivos: programaDatos.objetivos || programa.objetivos,
        metodologia: programaDatos.metodologia || programa.metodologia,
        evaluacion: programaDatos.evaluacion || programa.evaluacion,
        certificacion: programaDatos.certificacion !== undefined ? programaDatos.certificacion : programa.certificacion,
        destacado: programaDatos.destacado !== undefined ? programaDatos.destacado : programa.destacado
      };

      programa = await Curso.findByIdAndUpdate(
        id,
        actualizaciones,
        { new: true, runValidators: true }
      );
    } else {
      // Intentar en programas técnicos
      programa = await ProgramaTecnico.findById(id);
      if (programa) {
        // Es un programa técnico, mapear campos
        const actualizaciones = {
          nombre: programaDatos.titulo,
          descripcion: programaDatos.descripcion,
          modalidad: programaDatos.modalidad,
          duracion: programaDatos.duracion ? {
            meses: Math.ceil(parseInt(programaDatos.duracion) / 4) || programa.duracion.meses,
            horas: parseInt(programaDatos.duracion) * 40 || programa.duracion.horas
          } : programa.duracion,
          costo: programaDatos.precio ? {
            matricula: parseFloat(programaDatos.precio),
            mensualidad: parseFloat(programaDatos.precio) * 0.1,
            certificacion: programa.costo.certificacion || 0
          } : programa.costo,
          fechaInicio: programaDatos.fechaInicio,
          fechaFin: programaDatos.fechaFin,
          cuposDisponibles: programaDatos.cupos ? parseInt(programaDatos.cupos) : programa.cuposDisponibles,
          coordinador: programaDatos.profesor,
          requisitos: programaDatos.requisitos ? {
            academicos: programaDatos.requisitos,
            documentos: programa.requisitos.documentos || [],
            otros: programa.requisitos.otros || []
          } : programa.requisitos,
          competencias: programaDatos.objetivos ? programaDatos.objetivos.map(obj => ({ 
            nombre: obj, 
            descripcion: obj 
          })) : programa.competencias,
          modulos: programaDatos.pensum ? programaDatos.pensum.map((item, index) => ({
            nombre: item.modulo || `Módulo ${index + 1}`,
            descripcion: item.descripcion || '',
            duracionHoras: parseInt(item.horas) || 40,
            orden: index + 1
          })) : programa.modulos,
          certificacion: programaDatos.certificacion !== undefined ? {
            disponible: programaDatos.certificacion
          } : programa.certificacion
        };

        programa = await ProgramaTecnico.findByIdAndUpdate(
          id,
          actualizaciones,
          { new: true, runValidators: true }
        );
      }
    }

    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Programa actualizado exitosamente',
      data: programa
    });

  } catch (error) {
    console.error('Error al actualizar programa:', error);
    
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

// Eliminar un programa (curso o técnico)
exports.eliminarPrograma = async (req, res) => {
  try {
    const { id } = req.params;
    
    let programa;
    
    // Intentar eliminar de cursos primero
    programa = await Curso.findByIdAndDelete(id);
    
    if (!programa) {
      // Si no se encontró en cursos, intentar en programas técnicos
      programa = await ProgramaTecnico.findByIdAndDelete(id);
    }

    if (!programa) {
      return res.status(404).json({
        success: false,
        message: 'Programa no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Programa eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar programa:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener todos los programas (cursos y técnicos combinados)
exports.obtenerProgramas = async (req, res) => {
  try {
    const { tipo, modalidad, estado, page = 1, limit = 10 } = req.query;
    
    let programas = [];
    
    // Obtener cursos si no se especifica tipo o si es 'curso'
    if (!tipo || tipo === 'curso') {
      const filtrosCursos = {};
      if (modalidad) filtrosCursos.modalidad = modalidad;
      if (estado) filtrosCursos.estado = estado;
      
      const cursos = await Curso.find(filtrosCursos)
        .populate('inscripciones.usuario', 'nombre apellido correo')
        .sort({ fechaInicio: -1 });
      
      // Normalizar cursos
      const cursosNormalizados = cursos.map(curso => ({
        ...curso.toObject(),
        tipo: 'curso',
        titulo: curso.nombre,
        profesor: curso.instructor,
        precio: curso.costo,
        cupos: curso.cuposDisponibles
      }));
      
      programas.push(...cursosNormalizados);
    }
    
    // Obtener programas técnicos si no se especifica tipo o si es 'tecnico'
    if (!tipo || tipo === 'tecnico') {
      const filtrosTecnicos = {};
      if (modalidad) filtrosTecnicos.modalidad = modalidad;
      if (estado) filtrosTecnicos.estado = estado;
      
      const tecnicos = await ProgramaTecnico.find(filtrosTecnicos)
        .populate('inscripciones.usuario', 'nombre apellido correo')
        .sort({ fechaInicio: -1 });
      
      // Normalizar programas técnicos
      const tecnicosNormalizados = tecnicos.map(prog => ({
        ...prog.toObject(),
        tipo: 'tecnico',
        titulo: prog.nombre,
        profesor: prog.coordinador || prog.instructor,
        precio: prog.costo ? (prog.costo.matricula || prog.costo) : 0,
        cupos: prog.cuposDisponibles
      }));
      
      programas.push(...tecnicosNormalizados);
    }
    
    // Aplicar paginación
    const skip = (page - 1) * limit;
    const programasPaginados = programas.slice(skip, skip + parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: programasPaginados,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(programas.length / limit),
        totalProgramas: programas.length,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error al obtener programas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};
