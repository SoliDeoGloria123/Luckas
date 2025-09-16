require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');
const { MongoClient, ObjectId } = require('mongodb');

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
const eventosRoutes = require('./routes/eventosRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const categotizacionRoutes = require('./routes/categorizacionRoutes');
const reservasRoutes = require('./routes/reservasRoutes'); 
const cabanasRoutes = require('./routes/cabanasRoutes');
const inscripcionesRoutes = require('./routes/inscripcionRoutes');
const ReportesRoutes = require('./routes/reportesRoutes');
const programasAcademicosRoutes = require('./routes/programasAcademicosRoutes');
const cursosRoutes = require('./routes/cursosRoutes');
const programasTecnicosRoutes = require('./routes/programasTecnicosRoutes');

// Crear aplicación Express
const app = express();

// Configurar MongoDB
const mongoClient = new MongoClient(process.env.MONGODB_URI);
(async () => {
    await mongoClient.connect();
    app.set('mongoDb', mongoClient.db());
    console.log('✅ Conexión directa a MongoDB establecida');
})();

// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend
app.use('/Externo', express.static(path.join(__dirname, '../frontend/public/Externo')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Ok MongoDB conectado'))
    .catch(error => console.error('❌ Error de MongoDB', error.message));

// Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/cabanas', cabanasRoutes);
app.use('/api/tareas', tareaRoutes);
app.use('/api/categorizacion', categotizacionRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/inscripciones', inscripcionesRoutes);
app.use('/api/reportes', ReportesRoutes);
app.use('/api/programas-academicos', programasAcademicosRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/programas-tecnicos', programasTecnicosRoutes);

// Rutas para páginas externas/públicas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/home.html'));
});

app.get('/external', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/home.html'));
});

app.get('/eventos', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/eventos.html'));
});

app.get('/cursos', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/cursos_home.html'));
});

app.get('/programas-academicos', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/programas-academicos-external.html'));
});

app.get('/inscripcion', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/inscripcion.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/login-unified.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/dashboard.html'));
});

// Ruta para el admin - redirigir al frontend React
app.get('/admin', (req, res) => {
    res.redirect('http://localhost:3001/login');
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/home.html'));
    } else {
        res.status(404).json({ message: 'Ruta de API no encontrada' });
    }
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 ============================================`);
    console.log(`✅ Servidor Luckas corriendo en http://localhost:${PORT}`);
    console.log(`📊 Dashboard Admin: http://localhost:3001/admin`);
    console.log(`🌐 Dashboard Externo: http://localhost:${PORT}/dashboard`);
    console.log(`🏠 Página Principal: http://localhost:${PORT}`);
    console.log(`============================================\n`);
});
