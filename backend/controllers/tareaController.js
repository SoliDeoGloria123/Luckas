const Tarea = require('../models/Tarea');
const Usuario = require('../models/User');
const mongoose = require('mongoose');

// Crear tarea
exports.crearTarea = async (req, res) => {
   try {
        const { asignadoA, asignadoPor, comentarios } = req.body;

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
        res.json(tareas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
    try {
        const tarea = await Tarea.findById(req.params.id).populate('asignadoA');
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar tarea
exports.actualizarTarea = async (req, res) => {
    try {
        const tarea = await Tarea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!tarea) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json(tarea);
    } catch (error) {
        res.status(400).json({ message: error.message });
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