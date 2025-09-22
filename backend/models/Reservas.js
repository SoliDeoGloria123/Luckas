const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: [true, 'El usuario es obligatorio']
    },
    cabana: {
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
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    tipoDocumento: {
        type: String,
        enum: ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Tarjeta de identidad'],
        required: true
    },
    numeroDocumento: {
        type: String,
        required: true
    },
    correoElectronico: {
        type: String,
        required: true
    },
    telefono: {
        type: String,
        required: true
    },
    numeroPersonas: {
        type: Number,
        required: true
    },
    propositoEstadia: {
        type: String
    },
    solicitudesEspeciales: {
        type: String
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