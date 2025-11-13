const mongoose = require('mongoose');
const Inscripcion = require('../models/Inscripciones');
const Solicitud = require('../models/Solicitud');
const Evento = require('../models/Eventos');
const Usuario = require('../models/User');
const Categorizacion = require('../models/categorizacion');
const { notificarNuevaInscripcion } = require('../utils/notificationUtils');
// Crear inscripción
// Función auxiliar para validar ObjectId
function validarObjectId(id, nombreCampo) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return `ID de ${nombreCampo} inválido`;
  }
  return null;
}

// Función auxiliar para validar existencia en BD
async function validarExistencia(modelo, id, nombreCampo) {
  const existe = await modelo.findById(id);
  if (!existe) {
    return `${nombreCampo} no encontrado`;
  }
  return existe;
}

// Función auxiliar para validar campos requeridos
function obtenerCamposFaltantes(body, campos) {
  const faltantes = [];
  for (const campo of campos) {
    const valor = body[campo];
    if (campo === 'edad') {
      const edad = Number.parseInt(valor);
      if (Number.isNaN(edad) || edad < 0) {
        faltantes.push(`${campo} (recibido: ${valor}, parseado: ${edad})`);
      }
    } else if (!valor) {
      faltantes.push(`${campo} (recibido: "${valor}")`);
    }
  }
  return faltantes;
}

// Función auxiliar para validar estado
function validarEstado(tipoRef, estado) {
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
}


async function validarEventos(usuario, referencia) {
  const referenciaExiste = await validarExistencia(Evento, referencia, 'Evento');
  if (typeof referenciaExiste === 'string') {
    return { error: referenciaExiste };
  }
  const yaInscrito = await Inscripcion.findOne({ usuario, referencia, tipoReferencia: 'Eventos' });
  if (yaInscrito) {
    return { error: 'Ya estás inscrito en este evento.' };
  }
  return { referenciaExiste };
}

async function validarProgramaAcademico(usuario, referencia, tipoReferencia) {
  const ProgramaAcademico = require('../models/ProgramaAcademico');
  const referenciaExiste = await validarExistencia(ProgramaAcademico, referencia, 'Programa académico');
  if (typeof referenciaExiste === 'string') {
    return { error: referenciaExiste };
  }
  const yaInscrito = await Inscripcion.findOne({ usuario, referencia, tipoReferencia });
  if (yaInscrito) {
    return { error: 'Ya estás inscrito en este programa/curso.' };
  }
  if (referenciaExiste.cuposDisponibles <= 0) {
    return { error: 'No hay cupos disponibles en este programa/curso.' };
  }
  return { referenciaExiste };
}

async function validarTipoReferencia(usuario, referencia, tipoReferencia) {
  if (tipoReferencia === 'Eventos') {
    return await validarEventos(usuario, referencia);
  }
  if (tipoReferencia === 'ProgramaAcademico') {
    return await validarProgramaAcademico(usuario, referencia, tipoReferencia);
  }
  return { error: 'Tipo de referencia no válido' };
}

async function validarDatosInscripcion(body) {
  const { usuario, referencia, tipoReferencia, categoria } = body;
  
  // Validar IDs
  const erroresId = [
    validarObjectId(usuario, 'usuario'),
    validarObjectId(referencia, 'referencia'),
    validarObjectId(categoria, 'categoría')
  ].filter(Boolean);
  if (erroresId.length > 0) {
    return { error: erroresId.join(', ') };
  }
  
  // Validar existencia del usuario
  const usuarioExiste = await validarExistencia(Usuario, usuario, 'Usuario');
  if (typeof usuarioExiste === 'string') {
    return { error: usuarioExiste };
  }
  
  // Validar tipo de referencia y existencia
  const resultadoReferencia = await validarTipoReferencia(usuario, referencia, tipoReferencia);
  if (resultadoReferencia.error) {
    return { error: resultadoReferencia.error };
  }
  
  // Validar categoría
  const categoriaExiste = await validarExistencia(Categorizacion, categoria, 'Categoría');
  if (typeof categoriaExiste === 'string') {
    return { error: categoriaExiste };
  }
  
  // Validar campos requeridos
  const camposRequeridos = ['nombre', 'tipoDocumento', 'numeroDocumento', 'telefono', 'edad'];
  const camposFaltantes = obtenerCamposFaltantes(body, camposRequeridos);
  if (camposFaltantes.length > 0) {
    return { error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` };
  }
  
  // Establecer estado por defecto
  const estadoFinal = body.estado || (body.tipoReferencia === 'Eventos' ? 'no inscrito' : 'preinscrito');
  
  // Validar el estado
  const errorEstado = validarEstado(body.tipoReferencia, estadoFinal);
  if (errorEstado) {
    return { error: errorEstado };
  }
  
  return {
    usuarioExiste,
    referenciaExiste: resultadoReferencia.referenciaExiste,
    categoriaExiste,
    estadoFinal
  };
}

async function crearSolicitudYEnlazar(inscripcion, referenciaExiste, tipoReferencia, categoria, usuarioId) {
  const user = await Usuario.findById(usuarioId);
  let descripcionSolicitud = '';
  if (tipoReferencia === 'Eventos' && referenciaExiste) {
    descripcionSolicitud = `Inscripción al evento ${referenciaExiste.nombre}`;
  } else if (tipoReferencia === 'ProgramaAcademico' && referenciaExiste) {
    descripcionSolicitud = `Inscripción al programa académico ${referenciaExiste.nombre}`;
  }
  const solicitud = new Solicitud({
    solicitante: user._id,
    responsable: user._id,
    titulo: referenciaExiste?.nombre || 'Inscripción',
    correo: user.correo,
    telefono: user.telefono,
    tipoSolicitud: 'Inscripción',
    categoria,
    descripcion: descripcionSolicitud,
    estado: 'Nueva',
    prioridad: 'Media',
    origen: 'inscripcion',
    modeloReferencia: 'Inscripcion',
    referencia: inscripcion._id
  });
  await solicitud.save();
  inscripcion.solicitud = solicitud._id;
  await inscripcion.save();
}

async function actualizarCuposProgramaAcademico(tipoReferencia, referencia) {
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
}

exports.crearInscripcion = async (req, res) => {
  try {
    const validacion = await validarDatosInscripcion(req.body);
    if (validacion.error) {
      return res.status(400).json({ success: false, message: validacion.error });
    }
    const {referenciaExiste, estadoFinal } = validacion;
    const datosInscripcion = {
      usuario: req.body.usuario,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      tipoDocumento: req.body.tipoDocumento,
      numeroDocumento: req.body.numeroDocumento,
      correo: req.body.correo,
      telefono: req.body.telefono,
      edad: Number.parseInt(req.body.edad),
      tipoReferencia: req.body.tipoReferencia,
      referencia: req.body.referencia,
      categoria: req.body.categoria,
      estado: estadoFinal,
      observaciones: req.body.observaciones
    };
    let inscripcion;
    try {
      inscripcion = new Inscripcion(datosInscripcion);
      await inscripcion.save();
    } catch (inscripcionError) {
      console.error('Error al crear inscripción:', inscripcionError);
      return res.status(400).json({ success: false, message: 'Error al crear inscripción: ' + inscripcionError.message });
    }
    
    await crearSolicitudYEnlazar(inscripcion, referenciaExiste, req.body.tipoReferencia, req.body.categoria, req.body.usuario);
    await actualizarCuposProgramaAcademico(req.body.tipoReferencia, req.body.referencia);
    
    // Enviar notificación a administradores y tesoreros
    try {
      const usuarioData = validacion.usuarioExiste; // Ya tenemos los datos del usuario de la validación
      await notificarNuevaInscripcion(inscripcion, usuarioData, referenciaExiste);
      console.log('✅ Notificación de inscripción enviada correctamente');
    } catch (notificationError) {
      console.error('❌ Error al enviar notificación de inscripción:', notificationError);
      // No fallar el proceso si hay error en notificación
    }
    
    res.status(201).json({ success: true, data: inscripcion });
  } catch (error) {
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
// Función auxiliar para actualizar inscripción
async function validarActualizacionInscripcion(req) {
  const { usuario, referencia, tipoReferencia, categoria } = req.body;
  // Validar IDs
  const erroresId = [
    validarObjectId(usuario, 'usuario'),
    validarObjectId(referencia, 'referencia'),
    validarObjectId(categoria, 'categoría')
  ].filter(Boolean);
  if (erroresId.length > 0) {
    return { error: erroresId.join(', ') };
  }
  // Validar existencia en BD
  const usuarioExiste = await validarExistencia(Usuario, usuario, 'Usuario');
  if (typeof usuarioExiste === 'string') {
    return { error: usuarioExiste };
  }
  let referenciaExiste = null;
  if (tipoReferencia === 'Eventos') {
    referenciaExiste = await validarExistencia(Evento, referencia, 'Evento');
    if (typeof referenciaExiste === 'string') {
      return { error: referenciaExiste };
    }
  }
  const categoriaExiste = await validarExistencia(Categorizacion, categoria, 'Categoría');
  if (typeof categoriaExiste === 'string') {
    return { error: categoriaExiste };
  }
  // Validar campos requeridos
  const camposRequeridos = ['nombre', 'tipoDocumento', 'numeroDocumento', 'telefono', 'edad'];
  const camposFaltantes = obtenerCamposFaltantes(req.body, camposRequeridos);
  if (camposFaltantes.length > 0) {
    return { error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` };
  }
  return { usuarioExiste, referenciaExiste, categoriaExiste };
}

exports.actualizarInscripcion = async (req, res) => {
  try {
    // Validaciones y obtención de datos
    const validacion = await validarActualizacionInscripcion(req);
    if (validacion.error) {
      return res.status(400).json({ success: false, message: validacion.error });
    }
    const { usuarioExiste, referenciaExiste } = validacion;

    // Obtener la inscripción actual para validaciones
    const inscripcionActual = await Inscripcion.findById(req.params.id);
    if (!inscripcionActual) {
      return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
    }

    // Determinar el tipoReferencia final (actual o nuevo)
    const tipoReferenciaFinal = req.body.tipoReferencia || inscripcionActual.tipoReferencia;

    // Validación adicional de estado si se está cambiando
    if (req.body.estado) {
      const errorEstadoFinal = validarEstado(tipoReferenciaFinal, req.body.estado);
      if (errorEstadoFinal) {
        return res.status(400).json({ success: false, message: errorEstadoFinal });
      }
    }

    let inscripcion;
    try {
      inscripcion = await Inscripcion.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: false });
    } catch (updateError) {
      return res.status(400).json({ success: false, message: `Error al actualizar: ${updateError.message}` });
    }

    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });

    // Actualizar solicitud asociada si existe
    if (inscripcion.solicitud) {
      let descripcionSolicitud = '';
      if (tipoReferenciaFinal === 'Eventos' && referenciaExiste) {
        descripcionSolicitud = `Inscripción al evento ${referenciaExiste.nombre}`;
      }
      await Solicitud.findByIdAndUpdate(inscripcion.solicitud, {
        solicitante: usuarioExiste._id,
        responsable: usuarioExiste._id,
        titulo: referenciaExiste?.nombre || 'Inscripción',
        correo: usuarioExiste.correo,
        telefono: usuarioExiste.telefono,
        categoria: req.body.categoria,
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