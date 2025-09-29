const Tarea = require('../models/Tarea');
const Usuario = require('../models/User');
const mongoose = require('mongoose');

// Crear tarea
exports.crearTarea = async (req, res) => {
   try {
        const { asignadoA, asignadoPor, comentarios } = req.body;
        const userRole = req.userRole;
        const userId = req.userId;

        // Si es seminarista, solo puede asignar tareas a sí mismo
        if (userRole === 'seminarista' && asignadoA !== userId) {
            return res.status(403).json({ 
                success: false, 
                message: 'Como seminarista, solo puedes crear tareas asignadas a ti mismo' 
            });
        }

        // Para seminaristas, asignadoPor debe ser ellos mismos
        if (userRole === 'seminarista') {
            req.body.asignadoPor = userId;
        }

        // Validar que los IDs sean ObjectId válidos
        if (!mongoose.Types.ObjectId.isValid(asignadoA)) {
            return res.status(400).json({ success: false, message: 'ID de usuario asignado inválido' });
        }
        if (!mongoose.Types.ObjectId.isValid(asignadoPor)) {
            return res.status(400).json({ success: false, message: 'ID de usuario que asigna inválido' });
        }

        // Verificar que los usuarios existan
        const usuarioAsignado = await Usuario.findById(asignadoA);
        if (!usuarioAsignado) {
            return res.status(404).json({ success: false, message: 'El usuario asignado no existe' });
        }
        const usuarioAsignador = await Usuario.findById(asignadoPor);
        if (!usuarioAsignador) {
            return res.status(404).json({ success: false, message: 'El usuario que asigna no existe' });
        }

        // Validar autores de comentarios si existen
        if (comentarios && Array.isArray(comentarios)) {
            for (const comentario of comentarios) {
                if (comentario.autor && !mongoose.Types.ObjectId.isValid(comentario.autor)) {
                    return res.status(400).json({ success: false, message: 'ID de autor de comentario inválido' });
                }
                if (comentario.autor) {
                    const autorExiste = await Usuario.findById(comentario.autor);
                    if (!autorExiste) {
                        return res.status(404).json({ success: false, message: 'El autor del comentario no existe' });
                    }
                }
            }
        }

        const nuevaTarea = new Tarea(req.body);
        await nuevaTarea.save();

        // Populamos los campos de usuario para la respuesta
        const tareaPoblada = await Tarea.findById(nuevaTarea._id)
            .populate('asignadoA', ' nombre role')
            .populate('asignadoPor',' nombre role');

        res.status(201).json({
            success: true,
            message: 'Tarea creada exitosamente',
            data: tareaPoblada
        });
    } catch (error) {
        console.error('Error al crear tarea:', error);
        res.status(400).json({ 
            success: false,
            message: error.message 
        });
    }
};

// Obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
    try {
         const tareas = await Tarea.find()
            .populate('asignadoA', 'username email nombre role')
            .populate('asignadoPor', 'username email nombre role');
        res.json({ success: true, data: tareas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Obtener tareas por usuario
exports.obtenerTareasPorUsuario = async (req, res) => {
    try {
        const usuarioId = req.params.usuarioId;
        
        if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
            return res.status(400).json({
                success: false,
                message: 'ID de usuario inválido'
            });
        }

        const tareas = await Tarea.find({ asignadoA: usuarioId })
            .populate('asignadoA', 'username email nombre role')
            .populate('asignadoPor', 'username email nombre role')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: tareas
        });
    } catch (error) {
        console.error('Error al obtener tareas del usuario:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las tareas del usuario',
            error: error.message
        });
    }
};

// Obtener tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id)
            .populate('asignadoA', 'username email nombre role')
            .populate('asignadoPor', 'username email nombre role');
            
        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: tarea
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la tarea',
            error: error.message
        });
    }
};

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('asignadoA', 'username email nombre role')
         .populate('asignadoPor', 'username email nombre role');

        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Tarea actualizada exitosamente',
            data: tarea
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al actualizar la tarea',
            error: error.message
        });
    }
};

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findByIdAndDelete(req.params.id);
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json({ message: 'Tarea eliminada' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cambiar estado de tarea
exports.cambiarEstado = async (req, res) => {
    try {
        const { estado } = req.body;
        const { id } = req.params;

        // Validar estado
        const estadosValidos = ['pendiente', 'en_progreso', 'completada', 'cancelada'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                message: 'Estado inválido. Valores válidos: ' + estadosValidos.join(', ')
            });
        }

        const tarea = await Tarea.findByIdAndUpdate(
            id,
            { estado },
            { new: true, runValidators: true }
        ).populate('asignadoA', 'nombre apellido correo')
         .populate('asignadoPor', 'nombre apellido correo');

        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Estado actualizado correctamente',
            data: tarea
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al cambiar estado',
            error: error.message
        });
    }
};

// Agregar comentario a tarea
exports.agregarComentario = async (req, res) => {
    try {
        const { texto } = req.body;
        const { id } = req.params;
        const autorId = req.userId; // Usuario autenticado

        if (!texto || texto.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'El comentario no puede estar vacío'
            });
        }

        const tarea = await Tarea.findById(id);
        if (!tarea) {
            return res.status(404).json({
                success: false,
                message: 'Tarea no encontrada'
            });
        }

        // Agregar comentario
        tarea.comentarios.push({
            texto: texto.trim(),
            autor: autorId,
            fecha: new Date()
        });

        await tarea.save();

        // Obtener la tarea con populate para devolver datos completos
        const tareaActualizada = await Tarea.findById(id)
            .populate('asignadoA', 'nombre apellido correo')
            .populate('asignadoPor', 'nombre apellido correo')
            .populate('comentarios.autor', 'nombre apellido');

        res.json({
            success: true,
            message: 'Comentario agregado correctamente',
            data: tareaActualizada
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error al agregar comentario',
            error: error.message
        });
    }
};