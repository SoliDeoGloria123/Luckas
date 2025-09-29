require('dotenv').config();
const mongoose = require('mongoose');

// Modelos
const User = require('./models/User');
const Eventos = require('./models/Eventos');
const Cabana = require('./models/Cabana');
const Categorization = require('./models/categorizacion');
const Inscripciones = require('./models/Inscripciones');
const ProgramaAcademico = require('./models/ProgramaAcademico');
const Reportes = require('./models/Reportes');
const Reservas = require('./models/Reservas');
const Solicitud = require('./models/Solicitud');
const Tarea = require('./models/Tarea');

async function connectToDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error);
        process.exit(1);
    }
}

async function clearDatabase() {
    try {
        await User.deleteMany({});
        await Eventos.deleteMany({});
        await Cabana.deleteMany({});
        await Categorization.deleteMany({});
        await Inscripciones.deleteMany({});
        await ProgramaAcademico.deleteMany({});
        await Reportes.deleteMany({});
        await Reservas.deleteMany({});
        await Solicitud.deleteMany({});
        await Tarea.deleteMany({});
        console.log('🧹 Base de datos limpiada');
    } catch (error) {
        console.error('❌ Error limpiando base de datos:', error);
    }
}

async function createUsers() {
    try {
        const bcrypt = require('bcryptjs');
        
        const usuarios = [
            {
                nombre: 'Administrador',
                apellido: 'Sistema',
                correo: 'admin@luckas.com',
                password: await bcrypt.hash('admin123', 12),
                role: 'admin',
                telefono: '1234567890',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '12345678',
                fechaNacimiento: new Date('1990-01-01'),
                direccion: 'Calle 123 #45-67',
                estado: 'activo'
            },
            {
                nombre: 'Carlos',
                apellido: 'Tesorero',
                correo: 'tesorero@luckas.com',
                password: await bcrypt.hash('tesorero123', 12),
                role: 'tesorero',
                telefono: '1234567891',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '12345679',
                fechaNacimiento: new Date('1985-05-15'),
                direccion: 'Carrera 45 #12-34',
                estado: 'activo'
            },
            {
                nombre: 'Juan',
                apellido: 'Seminarista',
                correo: 'seminarista@luckas.com',
                password: await bcrypt.hash('seminarista123', 12),
                role: 'seminarista',
                telefono: '1234567892',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '12345680',
                fechaNacimiento: new Date('1992-08-20'),
                direccion: 'Avenida 98 #76-54',
                estado: 'activo'
            },
            {
                nombre: 'María',
                apellido: 'Externa',
                correo: 'externa@luckas.com',
                password: await bcrypt.hash('externa123', 12),
                role: 'externo',
                telefono: '1234567893',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '12345681',
                fechaNacimiento: new Date('1988-12-10'),
                direccion: 'Transversal 22 #33-44',
                estado: 'activo'
            }
        ];

        const usuariosCreados = await User.insertMany(usuarios);
        console.log('👥 Usuarios creados');
        return usuariosCreados;
    } catch (error) {
        console.error('❌ Error creando usuarios:', error);
        return [];
    }
}

async function createCategorizaciones() {
    try {
        const categorizaciones = [
            {
                nombre: 'Tecnología',
                tipo: 'programa',
                codigo: 'TECH',
                activo: true
            },
            {
                nombre: 'Idiomas',
                tipo: 'curso',
                codigo: 'LANG',
                activo: true
            },
            {
                nombre: 'Negocios',
                tipo: 'programa',
                codigo: 'BIZ',
                activo: true
            },
            {
                nombre: 'Arte',
                tipo: 'curso',
                codigo: 'ART',
                activo: true
            },
            {
                nombre: 'Salud',
                tipo: 'programa',
                codigo: 'HEALTH',
                activo: true
            },
            {
                nombre: 'Conferencias',
                tipo: 'evento',
                codigo: 'CONF',
                activo: true
            },
            {
                nombre: 'Talleres',
                tipo: 'evento',
                codigo: 'WORK',
                activo: true
            },
            {
                nombre: 'Familiares',
                tipo: 'cabaña',
                codigo: 'FAM',
                activo: true
            },
            {
                nombre: 'Ejecutivas',
                tipo: 'cabaña',
                codigo: 'EXEC',
                activo: true
            }
        ];

        const categoriasCreadas = await Categorization.insertMany(categorizaciones);
        console.log('📂 Categorizaciones creadas');
        return categoriasCreadas;
    } catch (error) {
        console.error('❌ Error creando categorizaciones:', error);
        return [];
    }
}

async function createProgramasAcademicos(categorias) {
    try {
        const programas = [
            {
                nombre: 'Curso de JavaScript Avanzado',
                descripcion: 'Aprende JavaScript desde conceptos básicos hasta avanzados',
                categoria: categorias[0]._id, // Tecnología
                modalidad: 'virtual',
                duracion: '8 semanas',
                precio: 150000,
                fechaInicio: new Date('2025-10-01'),
                fechaFin: new Date('2025-11-26'),
                cuposDisponibles: 25,
                profesor: 'Ing. Carlos Martínez',
                nivel: 'intermedio',
                requisitos: ['Conocimientos básicos de HTML', 'Conocimientos básicos de CSS'],
                objetivos: ['Dominar JavaScript ES6+', 'Crear aplicaciones web interactivas', 'Entender programación asíncrona'],
                metodologia: 'Clases virtuales en vivo con ejercicios prácticos',
                evaluacion: 'Proyecto final y quizzes semanales',
                certificacion: true,
                destacado: true,
                estado: 'activo'
            },
            {
                nombre: 'Inglés Conversacional',
                descripcion: 'Mejora tu inglés conversacional con clases dinámicas',
                categoria: categorias[1]._id, // Idiomas
                modalidad: 'presencial',
                duracion: '12 semanas',
                precio: 200000,
                fechaInicio: new Date('2025-10-15'),
                fechaFin: new Date('2026-01-07'),
                cuposDisponibles: 15,
                profesor: 'Prof. Sarah Johnson',
                nivel: 'intermedio',
                requisitos: ['Nivel básico de inglés'],
                objetivos: ['Mejorar fluidez oral', 'Ampliar vocabulario', 'Ganar confianza al hablar'],
                metodologia: 'Conversación grupal y ejercicios interactivos',
                evaluacion: 'Evaluaciones orales continuas',
                certificacion: true,
                destacado: false,
                estado: 'activo'
            },
            {
                nombre: 'Administración de Empresas',
                descripcion: 'Fundamentos de administración para emprendedores',
                categoria: categorias[2]._id, // Negocios
                modalidad: 'semipresencial',
                duracion: '16 semanas',
                precio: 350000,
                fechaInicio: new Date('2025-11-01'),
                fechaFin: new Date('2026-02-28'),
                cuposDisponibles: 20,
                profesor: 'MBA Ana García',
                nivel: 'básico',
                requisitos: ['Ninguno'],
                objetivos: ['Comprender principios de administración', 'Desarrollar plan de negocios', 'Aprender gestión financiera básica'],
                metodologia: 'Clases presenciales y virtuales alternadas',
                evaluacion: 'Proyecto de plan de negocios',
                certificacion: true,
                destacado: true,
                estado: 'activo'
            },
            {
                nombre: 'Pintura al Óleo',
                descripcion: 'Técnicas de pintura al óleo para principiantes',
                categoria: categorias[3]._id, // Arte
                modalidad: 'presencial',
                duracion: '10 semanas',
                precio: 120000,
                fechaInicio: new Date('2025-10-20'),
                fechaFin: new Date('2025-12-29'),
                cuposDisponibles: 12,
                profesor: 'Artista Luis Rodríguez',
                nivel: 'básico',
                requisitos: ['Ninguno', 'Materiales incluidos'],
                objetivos: ['Dominar técnicas básicas', 'Crear obras originales', 'Desarrollar estilo personal'],
                metodologia: 'Clases prácticas con demostración',
                evaluacion: 'Portafolio de obras',
                certificacion: false,
                destacado: false,
                estado: 'activo'
            },
            {
                nombre: 'Yoga y Meditación',
                descripcion: 'Programa integral de bienestar físico y mental',
                categoria: categorias[4]._id, // Salud
                modalidad: 'presencial',
                duracion: '6 semanas',
                precio: 80000,
                fechaInicio: new Date('2025-10-10'),
                fechaFin: new Date('2025-11-21'),
                cuposDisponibles: 18,
                profesor: 'Instructora Paz Morales',
                nivel: 'básico',
                requisitos: ['Ropa cómoda', 'Mat de yoga (se puede alquilar)'],
                objetivos: ['Reducir estrés', 'Mejorar flexibilidad', 'Aprender técnicas de relajación'],
                metodologia: 'Sesiones prácticas grupales',
                evaluacion: 'Participación y progreso personal',
                certificacion: false,
                destacado: false,
                estado: 'activo'
            }
        ];

        const programasCreados = await ProgramaAcademico.insertMany(programas);
        console.log('🎓 Programas académicos creados');
        return programasCreados;
    } catch (error) {
        console.error('❌ Error creando programas académicos:', error);
        return [];
    }
}

async function createCabanas(categorias) {
    try {
        // Encontrar categorías de cabañas
        const catFamiliar = categorias.find(c => c.codigo === 'FAM');
        const catEjecutiva = categorias.find(c => c.codigo === 'EXEC');

        const cabanas = [
            {
                nombre: 'Cabaña Los Pinos',
                descripcion: 'Cabaña rústica con vista al lago',
                capacidad: 6,
                precio: 80000,
                ubicacion: 'Sector Norte',
                categoria: catFamiliar._id,
                estado: 'disponible',
                imagen: ['/images/cabana1.jpg']
            },
            {
                nombre: 'Cabaña El Roble',
                descripcion: 'Cabaña familiar con todas las comodidades',
                capacidad: 8,
                precio: 120000,
                ubicacion: 'Sector Central',
                categoria: catFamiliar._id,
                estado: 'disponible',
                imagen: ['/images/cabana2.jpg']
            },
            {
                nombre: 'Cabaña La Montaña',
                descripcion: 'Cabaña con vista panorámica a las montañas',
                capacidad: 4,
                precio: 60000,
                ubicacion: 'Sector Sur',
                categoria: catEjecutiva._id,
                estado: 'disponible',
                imagen: ['/images/cabana3.jpg']
            }
        ];

        const cabanasCreadas = await Cabana.insertMany(cabanas);
        console.log('🏠 Cabañas creadas');
        return cabanasCreadas;
    } catch (error) {
        console.error('❌ Error creando cabañas:', error);
        return [];
    }
}

async function createEventos(categorias) {
    try {
        // Encontrar categorías de eventos
        const catConferencia = categorias.find(c => c.codigo === 'CONF');
        const catTaller = categorias.find(c => c.codigo === 'WORK');

        const eventos = [
            {
                nombre: 'Conferencia de Tecnología 2025',
                descripcion: 'Conferencia anual sobre las últimas tendencias tecnológicas',
                fechaEvento: new Date('2025-11-15'),
                horaInicio: '09:00',
                horaFin: '17:00',
                lugar: 'Auditorio Principal',
                precio: 25000,
                categoria: catConferencia._id,
                cuposTotales: 200,
                cuposDisponibles: 200,
                imagen: ['/images/evento1.jpg'],
                etiquetas: ['tecnología', 'innovación', 'conferencia'],
                prioridad: 'Alta',
                active: true
            },
            {
                nombre: 'Taller de Emprendimiento',
                descripcion: 'Taller práctico para desarrollar ideas de negocio',
                fechaEvento: new Date('2025-10-30'),
                horaInicio: '14:00',
                horaFin: '18:00',
                lugar: 'Sala de Conferencias',
                precio: 15000,
                categoria: catTaller._id,
                cuposTotales: 30,
                cuposDisponibles: 30,
                imagen: ['/images/evento2.jpg'],
                etiquetas: ['emprendimiento', 'negocios', 'taller'],
                prioridad: 'Media',
                active: true
            },
            {
                nombre: 'Festival Cultural',
                descripcion: 'Celebración de la diversidad cultural',
                fechaEvento: new Date('2025-12-05'),
                horaInicio: '18:00',
                horaFin: '22:00',
                lugar: 'Plaza Central',
                precio: 0,
                categoria: catConferencia._id,
                cuposTotales: 500,
                cuposDisponibles: 500,
                imagen: ['/images/evento3.jpg'],
                etiquetas: ['cultura', 'festival', 'arte'],
                prioridad: 'Alta',
                active: true
            }
        ];

        const eventosCreados = await Eventos.insertMany(eventos);
        console.log('🎉 Eventos creados');
        return eventosCreados;
    } catch (error) {
        console.error('❌ Error creando eventos:', error);
        return [];
    }
}

async function createTareas(usuarios) {
    try {
        const tareas = [
            {
                titulo: 'Revisar inscripciones pendientes',
                descripcion: 'Revisar y procesar las inscripciones pendientes de programas académicos',
                estado: 'pendiente',
                prioridad: 'Alta',
                asignadoA: usuarios[0]._id, // Admin
                asignadoPor: usuarios[0]._id, // Admin asigna
                fechaLimite: new Date('2025-10-05')
            },
            {
                titulo: 'Preparar material para curso de JavaScript',
                descripcion: 'Crear presentaciones y ejercicios para las primeras 3 semanas',
                estado: 'en_progreso',
                prioridad: 'Alta',
                asignadoA: usuarios[2]._id, // Seminarista
                asignadoPor: usuarios[0]._id, // Admin asigna
                fechaLimite: new Date('2025-09-30')
            },
            {
                titulo: 'Mantenimiento de cabañas',
                descripcion: 'Inspección general de todas las cabañas',
                estado: 'pendiente',
                prioridad: 'Media',
                asignadoA: usuarios[1]._id, // Tesorero
                asignadoPor: usuarios[0]._id, // Admin asigna
                fechaLimite: new Date('2025-10-15')
            }
        ];

        await Tarea.insertMany(tareas);
        console.log('📋 Tareas creadas');
        return tareas;
    } catch (error) {
        console.error('❌ Error creando tareas:', error);
        return [];
    }
}

async function createInscripciones(usuarios, programas, eventos, categorias) {
    try {

        
        // Verificar que tenemos programas o eventos
        if ((!programas || programas.length === 0) && (!eventos || eventos.length === 0)) {
            console.log('❌ No hay programas ni eventos disponibles para crear inscripciones');
            return [];
        }

        const inscripciones = [];
        
        // Agregar inscripciones a programas si existen
        if (programas && programas.length > 0) {
            inscripciones.push({
                usuario: usuarios[3]._id, // Usuario externo
                nombre: 'Juan Carlos',
                apellido: 'Pérez',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '12345678',
                correo: 'juan.perez@email.com',
                telefono: '3001234567',
                edad: 25,
                tipoReferencia: 'ProgramaAcademico',
                referencia: programas[0]._id, // JavaScript
                categoria: categorias[0]._id,
                estado: 'aprobada'
            });
            
            if (programas.length > 1) {
                inscripciones.push({
                    usuario: usuarios[3]._id, // Usuario externo
                    nombre: 'Ana Sofía',
                    apellido: 'Rodríguez',
                    tipoDocumento: 'Cédula de ciudadanía',
                    numeroDocumento: '11223344',
                    correo: 'ana.rodriguez@email.com',
                    telefono: '3009876543',
                    edad: 22,
                    tipoReferencia: 'ProgramaAcademico',
                    referencia: programas[1]._id, // Segundo programa
                    categoria: categorias[2] ? categorias[2]._id : categorias[0]._id,
                    estado: 'aprobada'
                });
            }
        }
        
        // Agregar inscripciones a eventos si existen
        if (eventos && eventos.length > 0) {
            inscripciones.push({
                usuario: usuarios[2]._id, // Seminarista
                nombre: 'María Elena',
                apellido: 'González',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '87654321',
                correo: 'maria.gonzalez@email.com',
                telefono: '3007654321',
                edad: 28,
                tipoReferencia: 'Eventos',
                referencia: eventos[0]._id, // Primer evento
                categoria: categorias[1] ? categorias[1]._id : categorias[0]._id,
                estado: 'pendiente'
            });
        }

        await Inscripciones.insertMany(inscripciones);
        console.log(`📝 ${inscripciones.length} inscripciones creadas`);
        return inscripciones;
    } catch (error) {
        console.error('❌ Error creando inscripciones:', error);
        return [];
    }
}

async function createReservas(usuarios, cabanas) {
    try {
        const reservas = [
            {
                usuario: usuarios[3]._id, // Usuario externo
                cabana: cabanas[0]._id, // Los Pinos
                fechaInicio: new Date('2025-10-25'),
                fechaFin: new Date('2025-10-27'),
                nombre: 'Juan',
                apellido: 'Pérez',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '12345678',
                correoElectronico: 'juan.perez@email.com',
                telefono: '3001234567',
                numeroPersonas: 4,
                propositoEstadia: 'Fin de semana familiar',
                estado: 'Confirmada'
            },
            {
                usuario: usuarios[2]._id, // Seminarista
                cabana: cabanas[1]._id, // El Roble
                fechaInicio: new Date('2025-11-10'),
                fechaFin: new Date('2025-11-12'),
                nombre: 'María',
                apellido: 'González',
                tipoDocumento: 'Cédula de ciudadanía',
                numeroDocumento: '87654321',
                correoElectronico: 'maria.gonzalez@email.com',
                telefono: '3007654321',
                numeroPersonas: 6,
                propositoEstadia: 'Retiro espiritual',
                estado: 'Pendiente'
            }
        ];

        await Reservas.insertMany(reservas);
        console.log('🏨 Reservas creadas');
        return reservas;
    } catch (error) {
        console.error('❌ Error creando reservas:', error);
        return [];
    }
}

async function createSolicitudes(usuarios, categorias) {
    try {
        const solicitudes = [
            {
                solicitante: usuarios[3]._id, // Usuario externo
                titulo: 'Solicitud de beca para curso de JavaScript',
                correo: 'usuario.externo@email.com',
                telefono: '3001234567',
                tipoSolicitud: 'Otra',
                categoria: categorias[0]._id, // Primera categoría
                descripcion: 'Solicito una beca parcial para el curso de JavaScript debido a mi situación económica',
                estado: 'Nueva',
                prioridad: 'Media',
                responsable: usuarios[0]._id, // Admin como responsable
                creadoPor: usuarios[3]._id,
                origen: 'formulario'
            },
            {
                solicitante: usuarios[2]._id, // Seminarista
                titulo: 'Solicitud de proyector para clases',
                correo: 'seminarista@email.com',
                telefono: '3007654321',
                tipoSolicitud: 'Otra',
                categoria: categorias[1]._id, // Segunda categoría
                descripcion: 'Necesito un proyector adicional para las clases de los martes',
                estado: 'En Revisión',
                prioridad: 'Alta',
                responsable: usuarios[0]._id, // Admin como responsable
                creadoPor: usuarios[2]._id,
                origen: 'formulario'
            }
        ];

        await Solicitud.insertMany(solicitudes);
        console.log('📄 Solicitudes creadas');
        return solicitudes;
    } catch (error) {
        console.error('❌ Error creando solicitudes:', error);
        return [];
    }
}

async function createReportes(usuarios) {
    try {
        const reportes = [
            {
                nombre: 'Reporte Mensual de Inscripciones - Septiembre 2025',
                tipo: 'inscripciones',
                descripcion: 'Resumen de inscripciones del mes de septiembre',
                datos: {
                    totalInscripciones: 25,
                    ingresoTotal: 3750000,
                    programaMasPopular: 'JavaScript Avanzado'
                },
                creadoPor: usuarios[0]._id // Admin
            },
            {
                nombre: 'Reporte de Ocupación de Cabañas - Q3 2025',
                tipo: 'ocupacion',
                descripcion: 'Análisis de ocupación de cabañas en el tercer trimestre',
                datos: {
                    tasaOcupacion: 75,
                    ingresoTotal: 2400000,
                    cabanaMasReservada: 'El Roble'
                },
                creadoPor: usuarios[1]._id // Tesorero
            }
        ];

        await Reportes.insertMany(reportes);
        console.log('📊 Reportes creados');
        return reportes;
    } catch (error) {
        console.error('❌ Error creando reportes:', error);
    }
}

async function main() {
    console.log('🚀 Iniciando población de base de datos...\n');
    
    await connectToDatabase();
    
    console.log('🧹 Limpiando base de datos existente...');
    await clearDatabase();
    
    console.log('\n📝 Creando datos de ejemplo...');
    
    const usuarios = await createUsers();
    const categorias = await createCategorizaciones();
    const programas = await createProgramasAcademicos(categorias);
    console.log('DEBUG - Programas creados:', programas ? programas.length : 'undefined');
    const cabanas = await createCabanas(categorias);
    const eventos = await createEventos(categorias);
    console.log('DEBUG - Eventos creados:', eventos ? eventos.length : 'undefined');
    const tareas = await createTareas(usuarios);
    const inscripciones = await createInscripciones(usuarios, programas, eventos, categorias);
    const reservas = await createReservas(usuarios, cabanas);
    const solicitudes = await createSolicitudes(usuarios, categorias);
    const reportes = await createReportes(usuarios);
    
    console.log('\n✅ ¡Base de datos poblada exitosamente!');
    console.log('\n👥 Usuarios creados:');
    console.log('   • admin@luckas.com / admin123 (Administrador)');
    console.log('   • tesorero@luckas.com / tesorero123 (Tesorero)');
    console.log('   • seminarista@luckas.com / seminarista123 (Seminarista)');
    console.log('   • externa@luckas.com / externa123 (Usuario Externo)');
    
    console.log('\n🎓 Programas académicos: 5 programas creados');
    console.log('🏠 Cabañas: 3 cabañas creadas');
    console.log('🎉 Eventos: 3 eventos creados');
    console.log('📋 Tareas: 3 tareas creadas');
    console.log('📝 Inscripciones: 2 inscripciones creadas');
    console.log('🏨 Reservas: 2 reservas creadas');
    console.log('📄 Solicitudes: 2 solicitudes creadas');
    console.log('📊 Reportes: 2 reportes creados');
    
    await mongoose.connection.close();
    console.log('\n🔌 Conexión a base de datos cerrada');
    console.log('✨ ¡Proceso completado!');
}

main().catch(error => {
    console.error('💥 Error durante la población:', error);
    process.exit(1);
});