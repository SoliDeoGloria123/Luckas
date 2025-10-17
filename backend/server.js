require('dotenv').config();
// Registrar todos los modelos para evitar MissingSchemaError en populate
require('./models');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const config = require('./config');

// Importar Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
const eventosRoutes = require('./routes/eventosRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const categotizacionRoutes = require('./routes/categorizacionRoutes');
const reservasRoutes = require('./routes/reservasRoutes'); 
const cabanasRoutes = require('./routes/cabanasRoutes');
const inscripcionRoutes = require('./routes/inscripcionRoutes');
const ReportesRoutes = require('./routes/reportesRoutes');
const programasAcademicosRoutes = require('./routes/programaAcademicoRoutes');
const reporteguardarRoutes = require('./routes/reportesRoutes');
const comentarioEventoRoutes = require('./routes/comentarioEventoRoutes');
const certificadoRoutes = require('./routes/certificadoRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Inicializar Express
const app = express();

// Configuración de middlewares
app.use(morgan('dev')); // Logging
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:19006', 'http://10.0.2.2:19006'],
    credentials: true
}));
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear URL-encoded

// Servir archivos estáticos del frontend
app.use('/Externo', express.static(path.join(__dirname, '../frontend/public/Externo')));
app.use(express.static(path.join(__dirname, '../frontend/public')));

//Conexion a mongo 
mongoose.connect(process.env.MONGODB_URI).then(()=> console.log('Ok MonfoDB conectado'))
.catch(error => console.error('X Error de MongoDB', error.message));

//Rutas de API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/solicitudes',solicitudRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/cabanas', cabanasRoutes); // Asegúrate de que esta ruta exista
app.use('/api/tareas', tareaRoutes);
app.use('/api/categorizacion', categotizacionRoutes);
app.use('/api/reservas', reservasRoutes); // Asegúrate de que esta ruta exista
app.use('/api/inscripciones', inscripcionRoutes); // Asegúrate de que esta ruta exista
app.use('/api/reportes', ReportesRoutes);
app.use('/api/programas-academicos', programasAcademicosRoutes);
app.use('/api/reporte', reporteguardarRoutes);
app.use('/api/comentarios-evento', comentarioEventoRoutes);
app.use('/api/certificados', certificadoRoutes);
app.use('/api/notifications', notificationRoutes);

// Ruta para el login/admin - redirigir al frontend React
app.get('/admin', (req, res) => {
    res.redirect('http://localhost:3001/login');
});

app.get('/login', (req, res) => {
    res.redirect('http://localhost:3001/login');
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
    // Si la ruta no es de API, servir la página de inicio
    if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(__dirname, '../frontend/public/Externo/templates/home.html'));
    } else {
        res.status(404).json({ message: 'Ruta de API no encontrada' });
    }
});


//Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Servidor en http://localhost:${PORT}`);
});