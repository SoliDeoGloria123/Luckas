// backend/scripts/seedCursosProgramas.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Curso = require('../models/Curso');
const ProgramaTecnico = require('../models/ProgramaTecnico');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
};

const seedCursos = async () => {
  const cursos = [
    {
      nombre: 'Curso Bíblico Básico',
      descripcion: 'Introducción a la Biblia y sus enseñanzas.',
      categoria: 'biblico',
      nivel: 'basico',
      duracion: { horas: 20, semanas: 4 },
      modalidad: 'virtual',
      instructor: 'Juan Pérez',
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 4 * 7 * 24 * 60 * 60 * 1000),
      horario: {
        dias: ['lunes', 'miercoles'],
        horaInicio: '18:00',
        horaFin: '20:00'
      },
      cuposDisponibles: 30,
      costo: 0,
      requisitos: [],
      material: [],
    },
    // Puedes agregar más cursos aquí
  ];
  await Curso.deleteMany();
  await Curso.create(cursos);
  console.log('Cursos de ejemplo creados:', cursos.length);
};

const seedProgramasTecnicos = async () => {
  const programas = [
    {
      nombre: 'Técnico en Tecnología',
      descripcion: 'Programa técnico en tecnología básica.',
      area: 'tecnologia',
      nivel: 'tecnico_laboral',
      duracion: { meses: 6, horas: 120 },
      modalidad: 'presencial',
      coordinador: 'Ana Gómez',
      fechaInicio: new Date(),
      fechaFin: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000),
      horarios: [
        { dia: 'martes', horaInicio: '08:00', horaFin: '12:00' },
        { dia: 'jueves', horaInicio: '08:00', horaFin: '12:00' }
      ],
      cuposDisponibles: 25,
      costo: { matricula: 100, mensualidad: 50, certificacion: 20 },
      requisitos: { academicos: [], documentos: [], otros: [] },
      competencias: [],
      modulos: [],
    },
    // Puedes agregar más programas aquí
  ];
  await ProgramaTecnico.deleteMany();
  await ProgramaTecnico.create(programas);
  console.log('Programas técnicos de ejemplo creados:', programas.length);
};

const seedDatabase = async () => {
  await connectDB();
  await seedCursos();
  await seedProgramasTecnicos();
  mongoose.connection.close();
  console.log('Seeding completado y conexión cerrada');
};

if (require.main === module) {
  seedDatabase();
}