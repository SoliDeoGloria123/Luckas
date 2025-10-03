const mongoose = require('mongoose');
const Inscripcion = require('../models/Inscripciones');
const Solicitud = require('../models/Solicitud');
const Evento = require('../models/Eventos');
const Usuario = require('../models/User');
const Categorizacion = require('../models/categorizacion');
// Crear inscripción
exports.crearInscripcion = async (req, res) => {
  try {
    console.log('=== DEBUG INSCRIPCION ===');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    console.log('Usuario autenticado:', req.userId);
    console.log('Rol del usuario:', req.userRole);

  const { usuario, referencia, tipoReferencia, categoria } = req.body;

    // 1. Validar que los IDs sean ObjectId válidos
    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      console.log('Error: ID de usuario inválido:', usuario);
      return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(referencia)) {
      console.log('Error: ID de referencia inválido:', referencia);
      return res.status(400).json({ success: false, message: 'ID de referencia inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(categoria)) {
      console.log('Error: ID de categoría inválido:', categoria);
      return res.status(400).json({ success: false, message: 'ID de categoría inválido' });
    }

    // 2. Validar que existan en la base de datos
  const usuarioExiste = await Usuario.findById(usuario);
    if (!usuarioExiste) {
      console.log('Error: Usuario no encontrado:', usuario);
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    console.log('Usuario encontrado:', usuarioExiste.nombre, usuarioExiste.apellido);

    // Validar referencia según tipoInscripcion
    let referenciaExiste = null;
    if (tipoReferencia === 'Eventos') {
      console.log('🎪 VALIDANDO EVENTO - ID:', referencia);
      referenciaExiste = await Evento.findById(referencia);
      console.log('🎪 EVENTO ENCONTRADO:', referenciaExiste ? {
        _id: referenciaExiste._id,
        nombre: referenciaExiste.nombre,
        categoria: referenciaExiste.categoria
      } : null);
      
      if (!referenciaExiste) {
        console.log('❌ Error: Evento no encontrado:', referencia);
        return res.status(404).json({ success: false, message: 'Evento no encontrado' });
      }
  
      // Verificar si el usuario ya está inscrito en este evento
      console.log('🔍 VERIFICANDO SI YA ESTÁ INSCRITO - Usuario:', usuario, 'Referencia:', referencia);
      const yaInscrito = await Inscripcion.findOne({ usuario, referencia, tipoReferencia: 'Eventos' });
      console.log('🔍 YA INSCRITO RESULTADO:', yaInscrito ? 'SÍ' : 'NO');
      
      if (yaInscrito) {
        console.log('⚠️ USUARIO YA INSCRITO EN EVENTO');
        return res.status(400).json({ success: false, message: 'Ya estás inscrito en este evento.' });
      }
      console.log('✅ USUARIO NO INSCRITO PREVIAMENTE EN EVENTO');
    } else if (tipoReferencia === 'ProgramaAcademico') {
      const ProgramaAcademico = require('../models/ProgramaAcademico');
      referenciaExiste = await ProgramaAcademico.findById(referencia);
      if (!referenciaExiste) {
        console.log('Error: Programa/Curso no encontrado:', referencia);
        return res.status(404).json({ success: false, message: 'Programa académico no encontrado' });
      }
      
      // Verificar si el usuario ya está inscrito en este programa/curso
      const yaInscrito = await Inscripcion.findOne({ usuario, referencia, tipoReferencia });
      if (yaInscrito) {
        return res.status(400).json({ success: false, message: 'Ya estás inscrito en este programa/curso.' });
      }
      
      // Verificar cupos disponibles
      if (referenciaExiste.cuposDisponibles <= 0) {
        return res.status(400).json({ success: false, message: 'No hay cupos disponibles en este programa/curso.' });
      }
    } else {
      console.log('Error: Tipo de referencia no válido:', tipoReferencia);
      return res.status(400).json({ success: false, message: 'Tipo de referencia no válido' });
    }
    try {
      const categoriaExiste = await Categorizacion.findById(categoria);
     
      if (!categoriaExiste) {
        console.log('Error: Categoría no encontrada:', categoria);
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }
      
    } catch (categoriaError) {
    
      return res.status(400).json({ success: false, message: 'Error al validar categoría: ' + categoriaError.message });
    }

    // Validar campos requeridos del modelo
    const camposRequeridos = ['nombre', 'tipoDocumento', 'numeroDocumento', 'telefono', 'edad'];
    const camposFaltantes = [];
    
    console.log('Validando campos requeridos...');
    camposRequeridos.forEach(campo => {
      const valor = req.body[campo];
      console.log(`Campo ${campo}:`, valor, typeof valor);
      
      // Para edad, validar que sea un número >= 0, para otros campos validar que no estén vacíos
      if (campo === 'edad') {
        const edad = parseInt(valor);
        console.log(`Edad parseada: ${edad}, es válida: ${!isNaN(edad) && edad >= 0}`);
        if (isNaN(edad) || edad < 0) {
          camposFaltantes.push(`${campo} (recibido: ${valor}, parseado: ${edad})`);
        }
      } else {
        if (!valor) {
          camposFaltantes.push(`${campo} (recibido: "${valor}")`);
        }
      }
    });

    if (camposFaltantes.length > 0) {
      console.log('Error: Campos requeridos faltantes:', camposFaltantes);
      return res.status(400).json({ 
        success: false, 
        message: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` 
      });
    }

    console.log('✅ Todos los campos requeridos están presentes');

    // Validar estado según tipo de referencia
    console.log('🔍 VALIDANDO ESTADO SEGÚN TIPO DE REFERENCIA');
    console.log(`Tipo de referencia: ${tipoReferencia}, Estado recibido: ${req.body.estado}`);
    
    const validarEstado = (tipoRef, estado) => {
      if (tipoRef === 'Eventos') {
        const estadosValidos = ['no inscrito', 'inscrito', 'finalizado'];
        if (!estadosValidos.includes(estado)) {
          return `Para eventos, el estado debe ser: ${estadosValidos.join(', ')}. Recibido: ${estado}`;
        }
      } else if (tipoRef === 'ProgramaAcademico') {
        const estadosValidos = ['preinscrito', 'matriculado', 'en_curso', 'finalizado', 'certificado', 'rechazada', 'cancelada academico'];
        if (!estadosValidos.includes(estado)) {
          return `Para programas académicos, el estado debe ser: ${estadosValidos.join(', ')}. Recibido: ${estado}`;
        }
      } else {
        return `Tipo de referencia no válido: ${tipoRef}`;
      }
      return null;
    };

    // Establecer estado por defecto si no se proporciona
    let estadoFinal = req.body.estado;
    if (!estadoFinal) {
      estadoFinal = tipoReferencia === 'Eventos' ? 'no inscrito' : 'preinscrito';
      console.log(`📋 Estado no proporcionado, usando por defecto: ${estadoFinal}`);
    }

    // Validar el estado
    const errorEstado = validarEstado(tipoReferencia, estadoFinal);
    if (errorEstado) {
      console.log('❌ Error de validación de estado:', errorEstado);
      return res.status(400).json({ 
        success: false, 
        message: errorEstado 
      });
    }
    console.log(`✅ Estado válido para ${tipoReferencia}: ${estadoFinal}`);

    // 1. Crear la inscripción
    console.log('🔄 Iniciando creación de inscripción...');
    // Limpiar datos - remover campos que no están en el modelo
    const datosInscripcion = {
      usuario: req.body.usuario,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      tipoDocumento: req.body.tipoDocumento,
      numeroDocumento: req.body.numeroDocumento,
      correo: req.body.correo,
      telefono: req.body.telefono,
      edad: parseInt(req.body.edad),
      tipoReferencia: req.body.tipoReferencia,
      referencia: req.body.referencia,
      categoria: req.body.categoria,
      estado: estadoFinal,
      observaciones: req.body.observaciones
    };

    console.log('Datos limpios para inscripción:', datosInscripcion);

    let inscripcion;
    try {
      inscripcion = new Inscripcion(datosInscripcion);
      await inscripcion.save();
      console.log('Inscripción creada exitosamente:', inscripcion._id);
    } catch (inscripcionError) {
      console.error('Error al crear inscripción:', inscripcionError);
      return res.status(400).json({ 
        success: false, 
        message: 'Error al crear inscripción: ' + inscripcionError.message 
      });
    }

    // Buscar datos del usuario para la solicitud
  const user = await Usuario.findById(req.body.usuario);

    // 2. Crear la solicitud asociada
    let descripcionSolicitud = '';
    if (tipoReferencia === 'Eventos' && referenciaExiste) {
      descripcionSolicitud = `Inscripción al evento ${referenciaExiste.nombre}`;
      console.log('📝 CREANDO SOLICITUD PARA EVENTO:', descripcionSolicitud);
    } else if (tipoReferencia === 'ProgramaAcademico' && referenciaExiste) {
      descripcionSolicitud = `Inscripción al programa académico ${referenciaExiste.nombre}`;
      console.log('📝 CREANDO SOLICITUD PARA PROGRAMA:', descripcionSolicitud);
    }

    const solicitud = new Solicitud({
      solicitante: user._id,
      responsable: user._id,
      titulo: referenciaExiste?.nombre || 'Inscripción',
      correo: user.correo,
      telefono: user.telefono,
      tipoSolicitud: 'Inscripción',
      categoria: req.body.categoria,
      descripcion: descripcionSolicitud,
      estado: 'Nueva',
      prioridad: 'Media',
      origen: 'inscripcion',
      modeloReferencia: 'Inscripcion',
      referencia: inscripcion._id
    });
    await solicitud.save();
    console.log('Solicitud creada:', solicitud._id);

    // 3. Enlazar la solicitud a la inscripción
    inscripcion.solicitud = solicitud._id;
    await inscripcion.save();
    
    if (tipoReferencia === 'ProgramaAcademico') {
      try {
        const ProgramaAcademico = require('../models/ProgramaAcademico');
        const programa = await ProgramaAcademico.findById(referencia);
        if (programa && programa.cuposDisponibles > 0) {
          programa.cuposDisponibles -= 1;
          await programa.save();
        }
      } catch (err) {
        console.error('Error al actualizar cuposDisponibles:', err.message);
      }
    }

    console.log('=== FIN DEBUG INSCRIPCION ===');
    res.status(201).json({ success: true, data: inscripcion });
  } catch (error) {
    console.error('=== ERROR GENERAL EN CREAR INSCRIPCIÓN ===');
    console.error('Error completo:', error);
    console.error('Mensaje:', error.message);
    console.error('Stack:', error.stack);
    console.error('Nombre del error:', error.name);
    console.error('Código de error:', error.code);
    res.status(400).json({ success: false, message: 'Error interno: ' + error.message });
  }
};

// Obtener todas las inscripciones
exports.obtenerInscripciones = async (req, res) => {
  try {
    console.log('=== OBTENER INSCRIPCIONES DEBUG ===');
    console.log('[INSCRIPCIONES] Usuario:', req.userId, 'Rol:', req.userRole);
    console.log('[INSCRIPCIONES] Headers:', JSON.stringify(req.headers, null, 2));
    
    let filtro = {};
    if (req.userRole === 'seminarista' || req.userRole === 'externo') {
      filtro.usuario = req.userId;
      console.log('[INSCRIPCIONES] Filtrando por usuario:', req.userId);
    }
    
    console.log('[INSCRIPCIONES] Filtro aplicado:', JSON.stringify(filtro, null, 2));
    
    const inscripciones = await Inscripcion.find(filtro)
      .populate('usuario', 'nombre apellido correo telefono numeroDocumento tipoDocumento')
      .populate('referencia')
      .populate('categoria', 'nombre descripcion codigo')
      .sort({ createdAt: -1 });
      
    console.log('[INSCRIPCIONES] Encontradas:', inscripciones.length);
    console.log('[INSCRIPCIONES] Primera inscripción:', inscripciones[0] ? {
      nombre: inscripciones[0].nombre,
      apellido: inscripciones[0].apellido,
      usuario: inscripciones[0].usuario?.nombre,
      tipoReferencia: inscripciones[0].tipoReferencia
    } : 'N/A');
    
    res.json({ success: true, data: inscripciones });
  } catch (error) {
    console.error('[INSCRIPCIONES] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener las inscripciones del usuario actual
exports.obtenerMisInscripciones = async (req, res) => {
  try {
    console.log('[MIS INSCRIPCIONES] Usuario:', req.userId);
    const inscripciones = await Inscripcion.find({ usuario: req.userId })
      .populate('usuario', 'nombre apellido correo telefono numeroDocumento tipoDocumento')
      .populate({
        path: 'evento',
        select: 'nombre fechaEvento lugar descripcion imagen imagenUrl precio etiquetas horaInicio horaFin cuposDisponibles cuposTotales direccion programa observaciones',
      })
      .populate('categoria', 'nombre descripcion codigo')
      .sort({ createdAt: -1 }); // Ordenar por fecha de creación, más recientes primero
    console.log('[MIS INSCRIPCIONES] Encontradas:', inscripciones.length);
    res.json({ success: true, data: inscripciones });
  } catch (error) {
    console.error('[MIS INSCRIPCIONES] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint temporal para obtener datos para crear inscripciones
exports.obtenerDatosParaInscripcion = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, 'nombre apellido correo _id').limit(10);
    const eventos = await Evento.find({ activo: true }, 'nombre fecha _id').limit(10);
    const categorias = await Categorizacion.find({}, 'nombre codigo _id').limit(10);
    
    res.json({
      success: true,
      data: {
        usuarios,
        eventos, 
        categorias,
        ejemplo: {
          usuario: usuarios[0]?._id || 'ID_DEL_USUARIO',
          evento: eventos[0]?._id || 'ID_DEL_EVENTO',
          categoria: categorias[0]?._id || 'ID_DE_LA_CATEGORIA',
          nombre: 'Juan Pérez',
          apellido: 'González',
          tipoDocumento: 'Cédula de ciudadanía',
          numeroDocumento: '12345678',
          correo: 'juan@example.com',
          telefono: '3001234567',
          edad: 25,
          observaciones: 'Ninguna'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener inscripción por ID
exports.obtenerInscripcionPorId = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findById(req.params.id)
      .populate('usuario', 'nombre apellido correo')
      .populate('evento', 'nombre fecha')
      .populate('categoria', 'nombre descripcion codigo'); // <--- Agrega esto
    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
    res.json({ success: true, data: inscripcion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar inscripción
exports.actualizarInscripcion = async (req, res) => {
  try {
    // Validar IDs
    const { usuario, referencia, tipoReferencia, categoria } = req.body;
    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(referencia)) {
      return res.status(400).json({ success: false, message: 'ID de referencia inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(categoria)) {
      return res.status(400).json({ success: false, message: 'ID de categoría inválido' });
    }

    // Validar existencia en BD
    const usuarioExiste = await Usuario.findById(usuario);
    if (!usuarioExiste) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    let referenciaExiste = null;
    if (tipoReferencia === 'Eventos') {
      referenciaExiste = await Evento.findById(referencia);
      if (!referenciaExiste) {
        return res.status(404).json({ success: false, message: 'Evento no encontrado' });
      }
    }
    const categoriaExiste = await Categorizacion.findById(categoria);
    if (!categoriaExiste) {
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }

    // Validar campos requeridos
    const camposRequeridos = ['nombre', 'tipoDocumento', 'numeroDocumento', 'telefono', 'edad'];
    const camposFaltantes = [];
    camposRequeridos.forEach(campo => {
      if (!req.body[campo]) {
        camposFaltantes.push(campo);
      }
    });
    if (camposFaltantes.length > 0) {
      return res.status(400).json({ success: false, message: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` });
    }

    // La validación de estado se realiza más abajo con el documento actual

    // Obtener la inscripción actual para validaciones
    const inscripcionActual = await Inscripcion.findById(req.params.id);
    if (!inscripcionActual) {
      return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
    }

    // Determinar el tipoReferencia final (actual o nuevo)
    const tipoReferenciaFinal = req.body.tipoReferencia || inscripcionActual.tipoReferencia;

    // Validación adicional de estado si se está cambiando
    if (req.body.estado) {
      const validarEstadoFinal = (tipoRef, estado) => {
        if (tipoRef === 'Eventos') {
          const estadosValidos = ['no inscrito', 'inscrito', 'finalizado'];
          if (!estadosValidos.includes(estado)) {
            return `Para eventos, el estado debe ser: ${estadosValidos.join(', ')}. Recibido: ${estado}`;
          }
        } else if (tipoRef === 'ProgramaAcademico') {
          const estadosValidos = ['preinscrito', 'matriculado', 'en_curso', 'finalizado', 'certificado', 'rechazada', 'cancelada academico'];
          if (!estadosValidos.includes(estado)) {
            return `Para programas académicos, el estado debe ser: ${estadosValidos.join(', ')}. Recibido: ${estado}`;
          }
        }
        return null;
      };

      const errorEstadoFinal = validarEstadoFinal(tipoReferenciaFinal, req.body.estado);
      if (errorEstadoFinal) {
        console.log('❌ Error de validación final de estado:', errorEstadoFinal);
        return res.status(400).json({ 
          success: false, 
          message: errorEstadoFinal 
        });
      }
    }

    // Actualizar inscripción
    console.log('🔄 DATOS PARA ACTUALIZACIÓN:', JSON.stringify(req.body, null, 2));
    console.log('🔄 ID A ACTUALIZAR:', req.params.id);
    console.log('🔄 TIPO REFERENCIA FINAL:', tipoReferenciaFinal);
    
    let inscripcion;
    try {
      // Usar runValidators: false para evitar problemas con el contexto del validador
      inscripcion = await Inscripcion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
    } catch (updateError) {
      console.log('❌ ERROR EN ACTUALIZACIÓN DE INSCRIPCIÓN:', updateError.message);
      console.log('❌ ERROR COMPLETO:', updateError);
      return res.status(400).json({ success: false, message: `Error al actualizar: ${updateError.message}` });
    }
    
    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });

    // Actualizar solicitud asociada si existe
    if (inscripcion.solicitud) {
      let descripcionSolicitud = '';
      if (tipoReferencia === 'Eventos' && referenciaExiste) {
        descripcionSolicitud = `Inscripción al evento ${referenciaExiste.nombre}`;
      }
      // Si tienes cursos o programas, puedes personalizar la descripción
      await Solicitud.findByIdAndUpdate(inscripcion.solicitud, {
        solicitante: usuarioExiste._id,
        responsable: usuarioExiste._id,
        titulo: referenciaExiste?.nombre || 'Inscripción',
        correo: usuarioExiste.correo,
        telefono: usuarioExiste.telefono,
        categoria: categoria,
        descripcion: descripcionSolicitud,
        referencia: inscripcion._id
      });
    }

    res.json({ success: true, data: inscripcion });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar inscripción
exports.eliminarInscripcion = async (req, res) => {
  try {
    const inscripcion = await Inscripcion.findByIdAndDelete(req.params.id);
    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
    res.json({ success: true, message: 'Inscripción eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerInscripcionesPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ success: false, message: 'Falta el parámetro userId' });
    }
    // Buscar todas las inscripciones del usuario y popular referencia dinámicamente
    // Usar populate dinámico con el nombre correcto del modelo
    const inscripciones = await Inscripcion.find({ usuario: userId })
      .populate('usuario', 'nombre apellido correo telefono numeroDocumento tipoDocumento')
      .populate('referencia')
      .populate('categoria', 'nombre descripcion codigo')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: inscripciones });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};