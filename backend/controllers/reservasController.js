const mongoose = require('mongoose');
const Reserva = require('../models/Reservas');
const Solicitud = require('../models/Solicitud');
const Usuario = require('../models/User');
const Cabana = require('../models/Cabana');

// Crear reserva
exports.crearReserva = async (req, res) => {
  try {
    console.log('=== DEBUG RESERVA ===');
    console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));
    console.log('Usuario autenticado:', req.userId);
    console.log('Rol del usuario:', req.userRole);

    const { usuario, cabana } = req.body;

    // Validar campos requeridos según el modelo
    const camposRequeridos = [
      'usuario', 'cabana', 'fechaInicio', 'fechaFin', 'nombre', 'apellido', 
      'tipoDocumento', 'numeroDocumento', 'correoElectronico', 'telefono', 'numeroPersonas'
    ];
    
    const camposFaltantes = [];
    for (const campo of camposRequeridos) {
      if (!req.body[campo]) {
        camposFaltantes.push(campo);
      }
    }
    
    if (camposFaltantes.length > 0) {
      console.log('❌ CAMPOS FALTANTES:', camposFaltantes);
      return res.status(400).json({ 
        success: false, 
        message: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` 
      });
    }

    // Validar IDs
    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      console.log('Error: ID de usuario inválido:', usuario);
      return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(cabana)) {
      console.log('Error: ID de cabaña inválido:', cabana);
      return res.status(400).json({ success: false, message: 'ID de cabaña inválido' });
    }

    // Validar existencia
    const usuarioExiste = await Usuario.findById(usuario);
    if (!usuarioExiste) {
      console.log('Error: Usuario no encontrado:', usuario);
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    console.log('Usuario encontrado:', usuarioExiste.nombre, usuarioExiste.apellido);

    const cabanaExiste = await Cabana.findById(cabana);
    if (!cabanaExiste) {
      console.log('Error: Cabaña no encontrada:', cabana);
      return res.status(404).json({ success: false, message: 'Cabaña no encontrada' });
    }
    console.log('Cabaña encontrada:', cabanaExiste.nombre);

    // Validar enum de tipoDocumento
    const tiposValidos = ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Tarjeta de identidad'];
    if (!tiposValidos.includes(req.body.tipoDocumento)) {
      console.log('❌ TIPO DE DOCUMENTO INVÁLIDO:', req.body.tipoDocumento);
      return res.status(400).json({ 
        success: false, 
        message: `Tipo de documento inválido. Debe ser: ${tiposValidos.join(', ')}` 
      });
    }

    // Validar estado si se proporciona
    const estadosValidos = ['Pendiente', 'Confirmada', 'Cancelada', 'finalizada'];
    if (req.body.estado && !estadosValidos.includes(req.body.estado)) {
      console.log('❌ ESTADO INVÁLIDO:', req.body.estado);
      return res.status(400).json({ 
        success: false, 
        message: `Estado inválido. Debe ser: ${estadosValidos.join(', ')}` 
      });
    }

    console.log('✅ Validaciones pasadas, creando reserva...');

    // Forzar el campo activo a booleano
    let activo = req.body.activo;
    if (typeof activo === 'string') {
      activo = activo === 'true';
    } else if (typeof activo !== 'boolean') {
      activo = true; // valor por defecto
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
    
    try {
      await reserva.save();
      console.log('✅ Reserva creada exitosamente:', reserva._id);
    } catch (saveError) {
      console.log('❌ ERROR AL GUARDAR RESERVA:', saveError.message);
      console.log('❌ DETALLES DEL ERROR:', saveError);
      return res.status(400).json({ 
        success: false, 
        message: `Error al guardar reserva: ${saveError.message}` 
      });
    }

    // Crear solicitud asociada (opcional)
    const solicitud = new Solicitud({
      solicitante: usuarioExiste._id,
      responsable: usuarioExiste._id,
      titulo: cabanaExiste.nombre || 'Reserva de cabaña',
      correo: usuarioExiste.correo,
      telefono: usuarioExiste.telefono,
      tipoSolicitud: 'Hospedaje',
      categoria: cabanaExiste.categoria,
      descripcion: `Reserva de cabaña ${cabanaExiste.nombre}`,
      estado: 'Nueva',
      origin: 'reserva',
      prioridad: 'Media',
      modeloReferencia: 'Reserva',
      referencia: reserva._id
    });
    await solicitud.save();
    console.log('Solicitud creada:', solicitud._id);

    // Enlazar la solicitud a la reserva
    reserva.solicitud = solicitud._id;
    await reserva.save();

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
    // Forzar el campo activo a booleano
    let activo = req.body.activo;
    if (typeof activo === 'string') {
      activo = activo === 'true';
    } else if (typeof activo !== 'boolean') {
      activo = true;
    }
    req.body.activo = activo;
    const reserva = await Reserva.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!reserva) return res.status(404).json({ success: false, message: 'Reserva no encontrada' });
    res.json({ success: true, data: reserva });
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