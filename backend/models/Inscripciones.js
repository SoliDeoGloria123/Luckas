const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({
 
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios', // Debe coincidir con User.js
        required: true,
    },
    nombre:{
        type: String,
        required: true,
        trim: true,
    },
    apellido: {
        type: String, 
    },
    tipoDocumento: {
        type: String,
        enum: ['Cédula de ciudadanía', 'Cédula de extranjería', 'Pasaporte', 'Tarjeta de identidad'],
        required: true,
    },
    numeroDocumento: {
        type: String,
        required: true,
        trim: true,
    },
    correo: {
        type: String,  
    },
    telefono: {
        type: String,
        required: true,
        trim: true,
    },
    edad: {
        type: Number,
        required: true,
        min: 0,
    },
       // Indica si la inscripción es a un evento, curso o programa técnico
    tipoReferencia: {
        type: String,
        enum: ['Eventos', 'ProgramaAcademico'],
        required: true,
    },
    // Referencia dinámica según tipoReferencia: Evento, Curso o ProgramaTecnico
    referencia: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'tipoReferencia',
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categorizacion',
        required: true,
    },
    fechaInscripcion: {
        type: Date,
        default: Date.now,
    },
    estado: {
        type: String,
      enum: ['preinscrito', 'matriculado', 'en_curso', 'finalizado', 'certificado', 'rechazada', 'cancelada academico'],
        default: 'preinscrito',
    },
    observaciones: {
        type: String,
        trim: true,
    },
    solicitud: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Solicitud'
    }
}, {
    timestamps: true,
});

module.exports = mongoose.model('Inscripcion', inscripcionSchema);