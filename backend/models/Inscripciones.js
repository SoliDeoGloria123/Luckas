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
        required: true,
        validate: {
            validator: function(valor) {
                // Durante findByIdAndUpdate, this.tipoReferencia puede ser undefined
                // Necesitamos acceder al tipoReferencia del documento actual o del update
                const tipoRef = this.tipoReferencia || this.getUpdate?.$set?.tipoReferencia || this._update?.tipoReferencia;
                
                // Si no podemos determinar el tipo, permitir la validación (se validará en el controller)
                if (!tipoRef) {
                    return true;
                }
                
                // Validar estados según el tipo de referencia
                if (tipoRef === 'Eventos') {
                    // Ahora permitimos 'no inscrito' como estado válido para eventos
                    return ['no inscrito', 'inscrito', 'finalizado'].includes(valor);
                } else if (tipoRef === 'ProgramaAcademico') {
                    return ['preinscrito', 'matriculado', 'en_curso', 'finalizado', 'certificado', 'rechazada', 'cancelada academico'].includes(valor);
                }
                return false;
            },
            message: function(props) {
                const tipoRef = this.tipoReferencia || this.getUpdate?.$set?.tipoReferencia || this._update?.tipoReferencia;
                
                if (tipoRef === 'Eventos') {
                    return `Para eventos, el estado debe ser: no inscrito, inscrito o finalizado. Recibido: ${props.value}`;
                } else if (tipoRef === 'ProgramaAcademico') {
                    return `Para programas académicos, el estado debe ser: preinscrito, matriculado, en_curso, finalizado, certificado, rechazada o cancelada academico. Recibido: ${props.value}`;
                }
                return `Tipo de referencia no determinado durante validación: ${tipoRef}`;
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

// Método para establecer estado por defecto (extraído para facilitar testing)
inscripcionSchema.methods.setDefaultState = function() {
    // Solo establecer estado por defecto si no se ha establecido uno
    if (!this.estado || this.estado === '') {
        if (this.tipoReferencia === 'Eventos') {
            this.estado = 'no inscrito';
        } else if (this.tipoReferencia === 'ProgramaAcademico') {
            this.estado = 'preinscrito';
        }
    }
};

// Middleware pre-save para establecer estado por defecto según tipo de referencia
inscripcionSchema.pre('save', function(next) {
    this.setDefaultState();
    next();
});

module.exports = mongoose.model('Inscripcion', inscripcionSchema);