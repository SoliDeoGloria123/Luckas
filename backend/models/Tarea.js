const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
    titulo: { 
        type: String, 
        required: [true, 'El título es obligatorio'] 
    },
    descripcion: { 
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    estado: { 
        type: String, 
        enum: ['pendiente', 'en progreso', 'completada', 'cancelada'], 
        default: 'pendiente' 
    },
    prioridad: {
        type: String,
        enum: ['alta', 'media', 'baja'],
        default: 'media'
    },
    asignadoA: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: [true, 'Debe asignar la tarea a un usuario']
    },
    asignadoPor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Debe especificar quién asigna la tarea']
    },
    fechaLimite: { 
        type: Date,
        required: [true, 'La fecha límite es obligatoria']
    },
    comentarios: [{
        texto: String,
        autor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        fecha: {
            type: Date,
            default: Date.now
        }
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Tarea', tareaSchema);