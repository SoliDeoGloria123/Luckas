const User= require('./User');
const Solicitud=require('./Solicitud');
const Reserva =require('./Reservas');
const Reporte =require('./Reportes');
const Evento =require('./Eventos');
const Categorizacion = require('./categorizacion');
const Tarea = require('./Tarea');
const Cabanas = require('./Cabana');
const Inscripcion = require('./Inscripciones');
const ProgramaAcademico = require('./ProgramaAcademico');


// Exportar todos los modelos para que puedan ser utilizados en otras partes de la aplicación
module.exports= {
    User,
    Solicitud,
    Reserva,
    Reporte,
    Inscripcion,
    Evento,
    Categorizacion,
    Tarea,
    Cabanas,
    ProgramaAcademico
};