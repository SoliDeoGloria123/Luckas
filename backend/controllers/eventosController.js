// Obtener eventos públicos (solo activos, sin autenticación)
exports.getPublicEvents = async (req, res) => {
  try {
    const eventos = await Evento.find({ active: true });
    res.status(200).json({ success: true, data: eventos });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener eventos públicos', error: error.message });
  }
};
const mongoose = require('mongoose');
const Evento = require('../models/Eventos');
const Categorizacion = require('../models/categorizacion');
const Usuario = require('../models/User');
const fs = require('fs');
const path = require('path');

// Obtener todos los eventos
exports.getAllEvents = async (req, res) => {
  try {
    console.log('[EVENTOS] Consultando eventos para usuario:', req.userRole, 'ID:', req.userId);

    // Primero verificar cuántos eventos hay en total
    const totalEvents = await Evento.countDocuments();
    console.log('[EVENTOS] Total de eventos en BD:', totalEvents);

    // Verificar cuántos eventos activos hay
    const activeEvents = await Evento.countDocuments({ active: true });
    console.log('[EVENTOS] Eventos activos:', activeEvents);
    // Si no hay eventos activos, mostrar algunos eventos sin filtro para debug
    if (activeEvents === 0 && totalEvents > 0) {
      const allEvents = await Evento.find().limit(5);
      console.log('[EVENTOS] Muestra de eventos (cualquier estado):', allEvents.map(e => ({
        id: e._id,
        nombre: e.nombre,
        active: e.active
      })));
    }

    // TEMPORAL: Mostrar todos los eventos independientemente del estado active
    // Cambiar de: { active: true } a: {} para mostrar todos
    const events = await Evento.find({}).populate('categoria');
    console.log('[EVENTOS] Eventos encontrados después del populate:', events.length);

    res.status(200).json({ success: true, data: events });
  } catch (error) {
    console.error('[EVENTOS] Error al obtener eventos:', error);
    res.status(500).json({ success: false, message: 'Error al obtener eventos', error: error.message });
  }
};

// Obtener evento por ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Evento.findById(req.params.id).populate('categoria');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al obtener evento', error: error.message });
  }
};

// Crear nuevo evento
exports.createEvent = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      precio,
      categoria,
      etiquetas,
      fechaEvento,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      duracionDias,
      cuposTotales,
      cuposDisponibles,
      programa,
      prioridad,
      observaciones,
      categorizadoPor,
      fechaCategorizacion,
      active } = req.body;

    // Validar que categoria sea un ObjectId válido
    if (!mongoose.Types.ObjectId.isValid(categoria)) {
      return res.status(400).json({ success: false, message: 'ID de categoría inválido.' });
    }
    // Validar que categorizadoPor sea un ObjectId válido si viene en el body
    if (categorizadoPor && !mongoose.Types.ObjectId.isValid(categorizadoPor)) {
      return res.status(400).json({ success: false, message: 'ID de usuario categorizador inválido.' });
    }

    // Verificar que la categoría exista
    const categoriaExiste = await Categorizacion.findById(categoria);
    if (!categoriaExiste) {
      return res.status(404).json({ success: false, message: 'La categoría no existe.' });
    }

    // Verificar que el usuario categorizadoPor exista (si viene en el body)
    if (categorizadoPor) {
      const usuarioExiste = await Usuario.findById(categorizadoPor);
      if (!usuarioExiste) {
        return res.status(404).json({ success: false, message: 'El usuario categorizador no existe.' });
      }
    }
    const imagen = req.files?.map(file => file.filename) || [];
    // Crear el evento
    const event = new Evento({
      nombre,
      descripcion,
      imagen,
      precio,
      categoria,
      etiquetas,
      fechaEvento,
      horaInicio,
      horaFin,
      lugar,
      direccion,
      duracionDias,
      cuposTotales,
      cuposDisponibles,
      programa,
      prioridad,
      observaciones,
      categorizadoPor,
      fechaCategorizacion,
      active
    });
    const savedEvent = await event.save();
    res.status(201).json({ success: true, data: savedEvent });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al crear evento', error: error.message });
  }
};

// Actualizar evento
exports.updateEvent = async (req, res) => {
  try {
    const currentEvent = await Evento.findById(req.params.id);
    if (!currentEvent) {
      console.log('[EVENTOS] updateEvent - Evento no encontrado');
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    // Manejo de imagen nueva
    if (req.files && req.files.length > 0) {
      // Eliminar imágenes antiguas
      if (Array.isArray(currentEvent.imagen)) {
        currentEvent.imagen.forEach((nombreImagen) => {
          const rutaImagen = path.join(__dirname, '../public/uploads/eventos', nombreImagen);
          if (fs.existsSync(rutaImagen)) {
            fs.unlinkSync(rutaImagen);
          }
        });
      }

      // Asignar nuevas imágenes
      updateData.imagen = req.files.map(file => file.filename);
    }
    // Validar si el nombre cambió
    const updateData = { ...req.body };
    if (updateData.nombre === currentEvent.nombre) {
      delete updateData.nombre;
      console.log('[EVENTOS] updateEvent - Nombre no cambió, excluyendo de actualización');
    } else {
      console.log('[EVENTOS] updateEvent - Nombre cambió, manteniendo en actualización');
      const existingEvent = await Evento.findOne({
        nombre: updateData.nombre,
        _id: { $ne: req.params.id }
      });
      if (existingEvent) {
        console.log('[EVENTOS] updateEvent - Ya existe otro evento con ese nombre');
        return res.status(400).json({
          success: false,
          message: 'Ya existe un evento con ese nombre',
          field: 'nombre'
        });
      }
    }
    const updatedEvent = await Evento.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    console.log('[EVENTOS] updateEvent - Evento actualizado exitosamente');
    return res.status(200).json({ success: true, data: updatedEvent });

  } catch (error) {
    console.error('[EVENTOS] updateEvent - Error:', error.message);
    console.error('[EVENTOS] updateEvent - Stack:', error.stack);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar evento
exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Evento.findByIdAndDelete(req.params.id);
    if (!deletedEvent){
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    if (Array.isArray(deletedEvent.imagen)) {
      deletedEvent.imagen.forEach((nombreImagen) => {
        const rutaImagen = path.join(__dirname, '../public/uploads/eventos', nombreImagen);
        if (fs.existsSync(rutaImagen)) {
          fs.unlinkSync(rutaImagen);
        }
      });
    } else if (typeof deletedEvent.imagen === 'string') {

      const rutaImagen = path.join(__dirname, '../public/uploads/eventos', deletedEvent.imagen);
      if (fs.existsSync(rutaImagen)) {
        fs.unlinkSync(rutaImagen);
      }
    }
    res.status(200).json({ success: true, message: 'Evento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al eliminar evento', error: error.message });
  }
};

// Deshabilitar evento (solo admin)
exports.disableEvent = async (req, res) => {
  try {
    const event = await Evento.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ success: false, message: 'Evento no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Evento deshabilitado', data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al deshabilitar evento', error: error.message });
  }
};

// Categorizar evento
exports.categorizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoria, etiquetas } = req.body;

    // Validación de datos
    if (!categoria) {
      return res.status(400).json({
        success: false,
        message: 'La categoría es requerida'
      });
    }

    // Actualizar evento con la categorización
    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      {
        categoria,
        etiquetas,
        categorizadoPor: req.userId,
        fechaCategorizacion: new Date()
      },
      { new: true }
    );

    if (!eventoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Evento no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Evento categorizado exitosamente',
      data: eventoActualizado
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al categorizar el evento',
      error: error.message
    });
  }
};

// Obtener eventos por categoría
exports.getEventosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.query;

    const filtro = categoria ? { categoria } : {};

    const eventos = await Evento.find(filtro)
      .populate('categorizadoPor', 'username email')
      .sort({ fechaCategorizacion: -1 });

    res.status(200).json({
      success: true,
      data: eventos
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener eventos por categoría',
      error: error.message
    });
  }
};

// Función temporal para activar todos los eventos
exports.activarTodosLosEventos = async (req, res) => {
  try {
    console.log('[EVENTOS] Activando todos los eventos...');

    const result = await Evento.updateMany(
      { active: false },
      { $set: { active: true } }
    );

    console.log('[EVENTOS] Eventos activados:', result.modifiedCount);

    res.status(200).json({
      success: true,
      message: `Se activaron ${result.modifiedCount} eventos`,
      data: result
    });
  } catch (error) {
    console.error('[EVENTOS] Error al activar eventos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al activar eventos',
      error: error.message
    });
  }
};

exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.json({ success: true, data: eventos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};