const mongoose = require('mongoose');

const inscripcionSchema = new mongoose.Schema({

    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios', // Debe coincidir con User.js
        required: true,
    },
    nombre: {
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
        required: true,
        validate: {
            validator: function(valor) {
                // Validar estados según el tipo de referencia
                if (this.tipoReferencia === 'Eventos') {
                    return ['inscrito', 'finalizado'].includes(valor);
                } else if (this.tipoReferencia === 'ProgramaAcademico') {
                    return ['preinscrito', 'matriculado', 'en_curso', 'finalizado', 'certificado', 'rechazada', 'cancelada academico'].includes(valor);
                }
                return false;
            },
            message: function(props) {
                if (this.tipoReferencia === 'Eventos') {
                    return `Para eventos, el estado debe ser: inscrito o finalizado. Recibido: ${props.value}`;
                } else if (this.tipoReferencia === 'ProgramaAcademico') {
                    return `Para programas académicos, el estado debe ser: preinscrito, matriculado, en_curso, finalizado, certificado, rechazada o cancelada academico. Recibido: ${props.value}`;
                }
                return `Tipo de referencia no válido: ${this.tipoReferencia}`;
            }
        }
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

// Middleware pre-save para establecer estado por defecto según tipo de referencia
inscripcionSchema.pre('save', function(next) {
    // Solo establecer estado por defecto si no se ha establecido uno
    if (!this.estado || this.estado === '') {
        if (this.tipoReferencia === 'Eventos') {
            this.estado = 'inscrito';
        } else if (this.tipoReferencia === 'ProgramaAcademico') {
            this.estado = 'preinscrito';
        }
    }
    
    console.log(`📋 PRE-SAVE INSCRIPCIÓN: Tipo=${this.tipoReferencia}, Estado=${this.estado}`);
    next();
});

module.exports = mongoose.model('Inscripcion', inscripcionSchema);