require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const config = require('./config');
const{MongoClient, ObjectId} = require('mongodb');
//importar Rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const solicitudRoutes = require('./routes/solicitudRoutes');
const eventosRoutes = require('./routes/eventosRoutes');
const tareaRoutes = require('./routes/tareaRoutes');
const categotizacionRoutes = require('./routes/categorizacionRoutes');
const reservasRoutes = require('./routes/reservasRoutes'); 
const cabanasRoutes = require('./routes/cabanasRoutes'); // Asegúrate de que esta ruta exista
const inscripcionesRoutes = require('./routes/inscripcionRoutes');
const ReportesRoutes= require ('./routes/reportesRoutes')// Asegúrate de que esta ruta exista
const cursosRoutes = require('./routes/cursosRoutes');
const programasTecnicosRoutes = require('./routes/programasTecnicosRoutes');
const reporteguardarRoutes = require('./routes/reporteRoutes');
// Primero declaramos app
const app = express();

// Luego usamos app
const mongoClient = new MongoClient(process.env.MONGODB_URI);
(async ()=>{
    await mongoClient.connect();
    app.set('mongoDb', mongoClient.db());
    console.log('Conexión directa a mongoDB establecida'); // Corregir typo
})();


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//Middlewares
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

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
app.use('/api/inscripciones', inscripcionesRoutes); // Asegúrate de que esta ruta exista
app.use('/api/reportes', ReportesRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/programas-tecnicos', programasTecnicosRoutes);
app.use('/api/reporte', reporteguardarRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));


// Ruta para el login/admin - redirigir al frontend React
app.get('/admin', (req, res) => {
    res.redirect('http://localhost:3000/login');
});

app.get('/login', (req, res) => {
    res.redirect('http://localhost:3000/login');
});

// Manejo de rutas no encontradas
app.all('*', (req, res, next) => {
    if (!req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'Ruta no encontrada' });
    }
    next();
});


//Inicio del servidor
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado:', socket.id);
    // Puedes agregar aquí tus eventos personalizados
    socket.on('disconnect', () => {
        console.log('Cliente desconectado:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});