const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: [true, 'El usuario es obligatorio']
    },
    cabana: { // <-- Cambia de categoria a cabana
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cabana',
        required: true
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    precio: {
        type: Number,
        default: 14000,
        required: true
    },
    estado: {
        type: String,
        enum: ['Pendiente', 'Confirmada', 'Cancelada', 'finalizada'],
        default: 'Pendiente'
    },
    activo: {
        type: Boolean,
        default: true
    },
    observaciones: {
        type: String,
        trim: true
    },
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud'
    }
}, { 
    timestamps: true
});

module.exports = mongoose.model('Reserva', reservaSchema);