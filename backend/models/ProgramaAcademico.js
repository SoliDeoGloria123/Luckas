const mongoose = require('mongoose');

const programaAcademicoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    tipo: {
        type: String,
        required: true,
        enum: ['curso', 'programa-tecnico'],
        default: 'curso'
    },
    descripcion: {
        type: String,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorizacion',
        required: true
    },
    modalidad: {
        type: String,
        required: true,
        enum: ['presencial', 'virtual', 'hibrido']
    },
    duracion: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    fechaInicio: {
        type: Date,
        required: true
    },
    fechaFin: {
        type: Date,
        required: true
    },
    cuposDisponibles: {
        type: Number,
        required: true,
        min: 1
    },
    cuposOcupados: {
        type: Number,
        default: 0
    },
    profesor: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        default: 'basico'
    },
    requisitos: [{
        type: String
    }],
    objetivos: [{
        type: String
    }],
    metodologia: {
        type: String,
        default: ''
    },
    evaluacion: {
        type: String,
        default: ''
    },
    certificacion: {
        type: Boolean,
        default: false
    },
    destacado: {
        type: Boolean,
        default: false
    },
    estado: {
        type: String,
        default: 'activo',
        enum: ['activo', 'inactivo', 'finalizado', 'cancelado']
    },
    inscripciones: [{
        usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        fechaInscripcion: { type: Date, default: Date.now },
        estado: { type: String, enum: ['inscrito', 'matriculado', 'en_curso', 'graduado', 'retirado', 'suspendido'], default: 'inscrito' }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('ProgramaAcademico', programaAcademicoSchema);
