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

    const { usuario, evento, categoria } = req.body;

    // 1. Validar que los IDs sean ObjectId válidos
    if (!mongoose.Types.ObjectId.isValid(usuario)) {
      console.log('Error: ID de usuario inválido:', usuario);
      return res.status(400).json({ success: false, message: 'ID de usuario inválido' });
    }
    if (!mongoose.Types.ObjectId.isValid(evento)) {
      console.log('Error: ID de evento inválido:', evento);
      return res.status(400).json({ success: false, message: 'ID de evento inválido' });
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

    const eventoExiste = await Evento.findById(evento);
    if (!eventoExiste) {
      console.log('Error: Evento no encontrado:', evento);
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    console.log('Evento encontrado:', eventoExiste.nombre);

    const categoriaExiste = await Categorizacion.findById(categoria);
    if (!categoriaExiste) {
      console.log('Error: Categoría no encontrada:', categoria);
      return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
    }
    console.log('Categoría encontrada:', categoriaExiste.nombre);

    // Validar campos requeridos del modelo
    const camposRequeridos = ['nombre', 'tipoDocumento', 'numeroDocumento', 'telefono', 'edad'];
    const camposFaltantes = [];
    
    camposRequeridos.forEach(campo => {
      if (!req.body[campo]) {
        camposFaltantes.push(campo);
      }
    });

    if (camposFaltantes.length > 0) {
      console.log('Error: Campos requeridos faltantes:', camposFaltantes);
      return res.status(400).json({ 
        success: false, 
        message: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` 
      });
    }

    console.log('Validaciones pasadas, creando inscripción...');

    // 1. Crear la inscripción
    const inscripcion = new Inscripcion(req.body);
    await inscripcion.save();
    console.log('Inscripción creada:', inscripcion._id);

    // Buscar datos del usuario para la solicitud
    const user = await Usuario.findById(req.body.usuario);

    // 2. Crear la solicitud asociada
    const solicitud = new Solicitud({
      solicitante: user._id,
      responsable: user._id,
      correo: user.correo,
      telefono: user.telefono,
      tipoSolicitud: 'Inscripción',
      categoria: req.body.categoria,
      descripcion: `Inscripción al evento ${eventoExiste.nombre}`,
      estado: 'Nueva',
      prioridad: 'Media',
      modeloReferencia: 'Inscripcion',
      referencia: inscripcion._id
    });
    await solicitud.save();
    console.log('Solicitud creada:', solicitud._id);

    // 3. Enlazar la solicitud a la inscripción
    inscripcion.solicitud = solicitud._id;
    await inscripcion.save();

    console.log('=== FIN DEBUG INSCRIPCION ===');
    res.status(201).json({ success: true, data: inscripcion });
  } catch (error) {
    console.log('Error en crearInscripcion:', error.message);
    console.log('Stack:', error.stack);
    res.status(400).json({ success: false, message: error.message });
  }
};

// Obtener todas las inscripciones
exports.obtenerInscripciones = async (req, res) => {
  try {
    const inscripciones = await Inscripcion.find()
      .populate('usuario', 'nombre apellido correo')
      .populate('evento', 'nombre fecha')
      .populate('categoria', 'nombre descripcion codigo');
    res.json({ success: true, data: inscripciones });
  } catch (error) {
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
    const inscripcion = await Inscripcion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!inscripcion) return res.status(404).json({ success: false, message: 'Inscripción no encontrada' });
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