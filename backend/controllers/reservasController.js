const mongoose = require('mongoose');
const Reserva = require('../models/Reservas');
const Solicitud = require('../models/Solicitud');
const Usuario = require('../models/User');
const Cabana = require('../models/Cabana');
const { notificarNuevaReserva } = require('../utils/notificationUtils');

// Función auxiliar para validar campos requeridos
const validarCamposRequeridos = (body) => {
  const camposRequeridos = [
    'usuario', 'cabana', 'fechaInicio', 'fechaFin', 'nombre', 'apellido', 
    'tipoDocumento', 'numeroDocumento', 'correoElectronico', 'telefono', 'numeroPersonas'
  ];
  
  const camposFaltantes = [];
  for (const campo of camposRequeridos) {
    if (!body[campo]) {
      camposFaltantes.push(campo);
    }
  }
  
  return camposFaltantes;
};

// Función auxiliar para validar IDs
const validarIds = (usuario, cabana) => {
  if (!mongoose.Types.ObjectId.isValid(usuario)) {
    return { error: 'ID de usuario inválido' };
  }
  if (!mongoose.Types.ObjectId.isValid(cabana)) {
    return { error: 'ID de cabaña inválido' };
  }
  return { error: null };
};

// Función auxiliar para validar existencia de usuario y cabaña
const validarExistencia = async (usuario, cabana) => {
  const usuarioExiste = await Usuario.findById(usuario);
  if (!usuarioExiste) {
    return { error: 'Usuario no encontrado' };
  }

  const cabanaExiste = await Cabana.findById(cabana);
  if (!cabanaExiste) {
    return { error: 'Cabaña no encontrada' };
  }

  console.log('Usuario encontrado:', usuarioExiste.nombre, usuarioExiste.apellido);
  console.log('Cabaña encontrada:', cabanaExiste.nombre);
  
  return { usuarioExiste, cabanaExiste, error: null };
};

// Función auxiliar para validar enums
const validarEnums = (body) => {
  const tiposValidos = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Tarjeta de identidad'];
  if (!tiposValidos.includes(body.tipoDocumento)) {
    return { error: `Tipo de documento inválido. Debe ser: ${tiposValidos.join(', ')}` };
  }

  const estadosValidos = ['Pendiente', 'Confirmada', 'Cancelada', 'finalizada'];
  if (body.estado && !estadosValidos.includes(body.estado)) {
    return { error: `Estado inválido. Debe ser: ${estadosValidos.join(', ')}` };
  }

  return { error: null };
};

// Función auxiliar para crear la solicitud asociada
const crearSolicitudAsociada = async (reserva, usuarioExiste, cabanaExiste, creadoPor) => {
  const solicitudPayload = {
    solicitante: usuarioExiste._id,
    responsable: usuarioExiste._id,
    titulo: cabanaExiste.nombre || 'Reserva de cabaña',
    correo: usuarioExiste.correo,
    telefono: usuarioExiste.telefono,
    tipoSolicitud: 'Hospedaje',
    modeloReferencia: 'Reserva',
    referencia: reserva._id,
    categoria: cabanaExiste.categoria,
    descripcion: `Reserva de cabaña ${cabanaExiste.nombre}`,
    estado: 'Nueva',
    prioridad: 'Media',
    origen: 'reserva',
    creadoPor: creadoPor || usuarioExiste._id
  };

  const solicitud = new Solicitud(solicitudPayload);
  console.log('Payload solicitud a guardar:', JSON.stringify(solicitudPayload, null, 2));
  await solicitud.save();
  console.log('Solicitud creada:', solicitud._id);

  // Enlazar la solicitud a la reserva
  reserva.solicitud = solicitud._id;
  await reserva.save();
};

// Crear reserva
exports.crearReserva = async (req, res) => {
  try {
    console.log('=== DEBUG RESERVA ===');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    console.log('Usuario autenticado:', req.userId);
    console.log('Rol del usuario:', req.userRole);

    const { usuario, cabana } = req.body;

    // Validar campos requeridos
    const camposFaltantes = validarCamposRequeridos(req.body);
    if (camposFaltantes.length > 0) {
      console.log('❌ CAMPOS FALTANTES:', camposFaltantes);
      return res.status(400).json({ 
        success: false, 
        message: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` 
      });
    }

    // Validar IDs
    const validacionIds = validarIds(usuario, cabana);
    if (validacionIds.error) {
      console.log('Error:', validacionIds.error);
      return res.status(400).json({ success: false, message: validacionIds.error });
    }

    // Validar existencia
    const validacionExistencia = await validarExistencia(usuario, cabana);
    if (validacionExistencia.error) {
      console.log('Error:', validacionExistencia.error);
      return res.status(404).json({ success: false, message: validacionExistencia.error });
    }

    const { usuarioExiste, cabanaExiste } = validacionExistencia;

    // Validar enums
    const validacionEnums = validarEnums(req.body);
    if (validacionEnums.error) {
      console.log('❌ ERROR ENUM:', validacionEnums.error);
      return res.status(400).json({ success: false, message: validacionEnums.error });
    }

    console.log('✅ Validaciones pasadas, creando reserva...');

    // Procesar campo activo
    let activo = req.body.activo;
    if (typeof activo === 'string') {
      activo = activo === 'true';
    } else if (typeof activo !== 'boolean') {
      activo = true;
    }

    // Crear reserva
    const reserva = new Reserva({
      usuario: req.body.usuario,
      cabana: req.body.cabana,
      fechaInicio: req.body.fechaInicio,
      fechaFin: req.body.fechaFin,
      nombre: req.body.nombre,
      apellido: req.body.apellido,
      tipoDocumento: req.body.tipoDocumento,
      numeroDocumento: req.body.numeroDocumento,
      correoElectronico: req.body.correoElectronico,
      telefono: req.body.telefono,
      numeroPersonas: req.body.numeroPersonas,
      propositoEstadia: req.body.propositoEstadia,
      solicitudesEspeciales: req.body.solicitudesEspeciales,
      estado: req.body.estado || 'Pendiente',
      observaciones: req.body.observaciones,
      activo
    });
    
    console.log('🔄 GUARDANDO RESERVA:', JSON.stringify(reserva.toObject(), null, 2));
    
    await reserva.save();
    console.log('✅ Reserva creada exitosamente:', reserva._id);

    // Crear solicitud asociada (pasamos el usuario que creó la reserva)
    await crearSolicitudAsociada(reserva, usuarioExiste, cabanaExiste, req.userId);

    // Enviar notificación a administradores y tesoreros
    try {
      await notificarNuevaReserva(reserva, usuarioExiste, cabanaExiste);
      console.log('✅ Notificación de reserva enviada correctamente');
    } catch (notificationError) {
      console.error('❌ Error al enviar notificación de reserva:', notificationError);
    }

    console.log('=== FIN DEBUG RESERVA ===');
    res.status(201).json({ success: true, data: reserva });
  } catch (error) {
    console.log('Error en crearReserva:', error.message);
    console.log('Stack:', error.stack);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener todas las reservas
exports.obtenerReservas = async (req, res) => {
  try {
    const reservas = await Reserva.find()
      .populate('usuario', 'nombre apellido correo numeroDocumento tipoDocumento')
      .populate('cabana', 'nombre descripcion capacidad categoria estado');
    res.json({ success: true, data: reservas });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Endpoint temporal para obtener datos para crear reservas
exports.obtenerDatosParaReserva = async (req, res) => {
  try {
    const usuarios = await Usuario.find({}, 'nombre apellido correo _id').limit(10);
    const cabanas = await Cabana.find({}, 'nombre descripcion capacidad categoria estado _id').limit(10);

    res.json({
      success: true,
      data: {
        usuarios,
        cabanas,
        ejemplo: {
          usuario: usuarios[0]?._id || 'ID_DEL_USUARIO',
          cabana: cabanas[0]?._id || 'ID_DE_LA_CABANA',
          nombre: 'Nombre ',
          apellido: 'Apellido',
          tipoDocumento: 'Cédula de ciudadanía',
          numeroDocumento: '123456789',
          correoElectronico: 'correo@ejemplo.com',
          telefono: '3001234567',
          numeroPersonas: 4,
          propositoEstadia: 'Vacaciones familiares',
          solicitudesEspeciales: 'Ninguna',
          fechaInicio: '2025-08-01',
          fechaFin: '2025-08-05',
          estado: 'Pendiente',
          observaciones: 'Reserva para evento especial'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener reserva por ID
exports.obtenerReservaPorId = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id)
      .populate('usuario', 'nombre apellido correo')
      .populate('cabana', 'nombre descripcion capacidad categoria estado');
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, data: reserva });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar reserva
exports.actualizarReserva = async (req, res) => {
  try {
    // Forzar el campo activo a booleano si viene en el body
  if (Object.hasOwn(req.body, 'activo')) {
      let activo = req.body.activo;
      if (typeof activo === 'string') {
        activo = activo === 'true';
      } else if (typeof activo !== 'boolean') {
        activo = true;
      }
      req.body.activo = activo;
    }
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, data: reserva });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};


// Alternar activación/desactivación de una reserva
exports.toggleReservaActivation = async (req, res) => {
  try {
    const reserva = await Reserva.findById(req.params.id);
    if (!reserva) {
      return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    }
    reserva.activo = !reserva.activo;
    await reserva.save();
    res.json({
      success: true,
      message: reserva.activo ? 'Reserva activada' : 'Reserva desactivada',
      data: reserva
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Eliminar reserva
exports.eliminarReserva = async (req, res) => {
  try {
    const reserva = await Reserva.findByIdAndDelete(req.params.id);
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, message: 'Reserva eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.obtenerReservasPorUsuario = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: 'Falta el parámetro userId' });
    }
    const reservas = await require('../models/Reservas').find({ usuario: userId }).populate('cabana');
    res.json(reservas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas por usuario', details: error.message });
  }
};

// Obtener estadísticas de reservas para el dashboard
exports.obtenerEstadisticasReservas = async (req, res) => {
  try {
    const totalReservas = await Reserva.countDocuments();
    const activas = await Reserva.countDocuments({ activo: true });
    const pendientes = await Reserva.countDocuments({ estado: 'Pendiente' });
    const confirmadas = await Reserva.countDocuments({ estado: 'Confirmada' });
    const canceladas = await Reserva.countDocuments({ estado: 'Cancelada' });
    const finalizadas = await Reserva.countDocuments({ estado: 'finalizada' });

    // Nuevas este mes
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1);
    const inicioMesSiguiente = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const nuevasEsteMes = await Reserva.countDocuments({ createdAt: { $gte: inicioMes, $lt: inicioMesSiguiente } });

    // Top 5 cabañas con más reservas
    const reservasPorCabana = await Reserva.aggregate([
      { $group: { _id: '$cabana', total: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'cabanas',
          localField: '_id',
          foreignField: '_id',
          as: 'cabana'
        }
      },
      { $unwind: { path: '$cabana', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, cabanaId: '$_id', nombre: '$cabana.nombre', total: 1 } }
    ]);

    // Reservas por mes (últimos 6 meses)
    const reservasPorMes = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      const count = await Reserva.countDocuments({ createdAt: { $gte: start, $lt: end } });
      reservasPorMes.push({ month: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`, total: count });
    }

    res.status(200).json({
      totalReservas,
      activas,
      pendientes,
      confirmadas,
      canceladas,
      finalizadas,
      nuevasEsteMes,
      reservasPorCabana,
      reservasPorMes
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de reservas:', error);
    res.status(500).json({ success: false, message: 'Error al obtener estadísticas de reservas' });
  }
};