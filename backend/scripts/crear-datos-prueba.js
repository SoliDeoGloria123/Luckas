const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/seminario';

const crearDatosPrueba = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Conectado a MongoDB');

    const Categorizacion = require('./models/categorizacion');
    const Eventos = require('./models/Eventos');
    const Cabana = require('./models/Cabana');

    // Buscar o crear categorías
    let categoriaEventos = await Categorizacion.findOne({ nombre: 'Eventos Académicos' });
    if (!categoriaEventos) {
      categoriaEventos = await Categorizacion.create({
        nombre: 'Eventos Académicos',
        codigo: 'EVE-ACD',
        activo: true
      });
    }

    let categoriaCabanas = await Categorizacion.findOne({ nombre: 'Hospedaje' });
    if (!categoriaCabanas) {
      categoriaCabanas = await Categorizacion.create({
        nombre: 'Hospedaje',
        codigo: 'HOS-CAB',
        activo: true
      });
    }

    // Si no existen, usar las categorías disponibles o crear una genérica
    if (!categoriaEventos) {
      const categorias = await Categorizacion.find({});
      if (categorias.length > 0) {
        categoriaEventos = categorias[0];
      } else {
        categoriaEventos = await Categorizacion.create({
          nombre: 'General',
          codigo: 'GEN-001',
          activo: true
        });
      }
    }

    if (!categoriaCabanas) {
      const categorias = await Categorizacion.find({});
      if (categorias.length > 0) {
        categoriaCabanas = categorias[0];
      } else {
        categoriaCabanas = categoriaEventos; // Usar la misma categoría
      }
    }

    console.log('Categorías creadas');

    // Crear eventos de prueba
    const eventosData = [
      {
        nombre: 'Conferencia de Teología Contemporánea',
        descripcion: 'Una conferencia magistral sobre los desafíos teológicos del siglo XXI, con expertos internacionales.',
        precio: 50000,
        categoria: categoriaEventos._id,
        etiquetas: ['teologia', 'conferencia', 'contemporaneo'],
        fechaEvento: new Date('2025-10-15'),
        horaInicio: '09:00',
        horaFin: '17:00',
        lugar: 'Auditorio Principal',
        direccion: 'Campus Universitario, Edificio Central',
        duracionDias: 1,
        cuposTotales: 100,
        cuposDisponibles: 100,
        programa: [
          {
            horaInicio: '09:00',
            horaFin: '10:30',
            tema: 'Apertura y Conferencia Magistral',
            descripcion: 'Introducción a los temas centrales'
          },
          {
            horaInicio: '11:00',
            horaFin: '12:30',
            tema: 'Panel de Discusión',
            descripcion: 'Debate entre expertos'
          }
        ],
        prioridad: 'Alta',
        active: true
      },
      {
        nombre: 'Seminario de Liderazgo Cristiano',
        descripcion: 'Taller intensivo sobre principios de liderazgo cristiano para jóvenes y adultos.',
        precio: 35000,
        categoria: categoriaEventos._id,
        etiquetas: ['liderazgo', 'seminario', 'cristiano'],
        fechaEvento: new Date('2025-11-20'),
        horaInicio: '14:00',
        horaFin: '18:00',
        lugar: 'Sala de Conferencias B',
        direccion: 'Campus Universitario, Edificio Pastoral',
        duracionDias: 2,
        cuposTotales: 50,
        cuposDisponibles: 50,
        programa: [
          {
            horaInicio: '14:00',
            horaFin: '15:30',
            tema: 'Fundamentos del Liderazgo',
            descripcion: 'Bases bíblicas del liderazgo'
          }
        ],
        prioridad: 'Media',
        active: true
      }
    ];

    // Crear cabañas de prueba
    const cabanasData = [
      {
        nombre: 'Cabaña Los Pinos',
        descripcion: 'Hermosa cabaña rodeada de pinos, perfecta para retiros espirituales y descanso. Incluye sala de estar, cocina completamente equipada y área de oración.',
        capacidad: 8,
        categoria: categoriaCabanas._id,
        precio: 120000,
        ubicacion: 'Zona Norte del Campus, sector montañoso',
        estado: 'disponible',
        imagen: ['cabana1.jpg']
      },
      {
        nombre: 'Cabaña El Refugio',
        descripcion: 'Cabaña acogedora con vista al lago, ideal para parejas o familias pequeñas. Cuenta con chimenea, terraza y acceso directo a senderos naturales.',
        capacidad: 4,
        categoria: categoriaCabanas._id,
        precio: 95000,
        ubicacion: 'Junto al lago artificial, zona de recreación',
        estado: 'disponible',
        imagen: ['cabana2.jpg']
      },
      {
        nombre: 'Cabaña Gran Familia',
        descripcion: 'Amplia cabaña diseñada para grupos grandes, con múltiples habitaciones, salón de reuniones y área de juegos. Perfecta para retiros familiares.',
        capacidad: 12,
        categoria: categoriaCabanas._id,
        precio: 180000,
        ubicacion: 'Centro del complejo de cabañas',
        estado: 'disponible',
        imagen: ['cabana3.jpg']
      }
    ];

    // Insertar eventos
    for (const eventoData of eventosData) {
      await Eventos.findOneAndUpdate(
        { nombre: eventoData.nombre },
        eventoData,
        { upsert: true, new: true }
      );
    }

    // Insertar cabañas
    for (const cabanaData of cabanasData) {
      await Cabana.findOneAndUpdate(
        { nombre: cabanaData.nombre },
        cabanaData,
        { upsert: true, new: true }
      );
    }

    console.log('✅ Datos de prueba creados exitosamente:');
    console.log(`- ${eventosData.length} eventos`);
    console.log(`- ${cabanasData.length} cabañas`);

    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error creando datos de prueba:', error);
    process.exit(1);
  }
};

crearDatosPrueba();
