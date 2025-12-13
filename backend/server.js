require('dotenv').config();
// Registrar todos los modelos para evitar MissingSchemaError en populate
require('./models');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('node:path');
const config = require('./config');
const http = require('node:http');
const { Server } = require('socket.io');

async function startServer() {

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
const contactoRoutes = require('./routes/contactoRoutes');

// Inicializar Express
const app = express();

// Deshabilitar la cabecera X-Powered-By por seguridad
app.disable('x-powered-by');

// Configuración de middlewares
app.use(morgan('dev')); // Logging
app.use(cors({
      origin: [ // ¡ASEGÚRATE DE QUE ESTA LÍNEA ESTÉ PRESENTE Y SIN CAMBIOS!
        'https://luckas.zapto.org',   // Frontend en producción
        'http://localhost:3000',     // Frontend estático (desarrollo)
        'http://localhost:3001',     // Frontend React (desarrollo)
        'http://localhost:19006',    // App móvil Expo (desarrollo)
        // Las versiones HTTPS de localhost son opcionales pero buenas para tener
        'https://localhost:3000',
        'https://localhost:3001',
        'https://localhost:19006',
    ],
    credentials: true
}));
app.use(express.json({ limit: '50mb' })); // Para parsear JSON con límite aumentado
app.use(express.urlencoded({ extended: true, limit: '50mb' })); // Para parsear URL-encoded con límite aumentado

// Proteger rutas del panel antes de servir archivos estáticos
// Esto evita que el middleware estático entregue el `index.html` del frontend
// para rutas como `/admin`, `/tesorero`, `/seminarista` o `/externo` sin pasar por la verificación.
const { authJwt, role } = require('./middlewares');

// Proteger rutas de admin - solo admin puede acceder
app.use(['/admin', '/admin/*'], (req, res, next) => {
    authJwt.verifyToken(req, res, () => {
        role.isAdmin(req, res, next);
    });
});

// Proteger rutas de tesorero - solo admin y tesorero pueden acceder
app.use(['/tesorero', '/tesorero/*'], (req, res, next) => {
    authJwt.verifyToken(req, res, () => {
        role.checkRole('admin', 'tesorero')(req, res, next);
    });
});

// Proteger rutas de seminarista - solo admin, tesorero y seminarista pueden acceder
app.use(['/seminarista', '/seminarista/*'], (req, res, next) => {
    authJwt.verifyToken(req, res, () => {
        role.checkRole('admin', 'tesorero', 'seminarista')(req, res, next);
    });
});

// Proteger rutas de externo - todos los roles autenticados pueden acceder
app.use(['/externo', '/externo/*'], (req, res, next) => {
    authJwt.verifyToken(req, res, () => {
        role.checkRole('admin', 'tesorero', 'seminarista', 'externo')(req, res, next);
    });
});

// Servir archivos estáticos del frontend (carpeta `public` generada por React)
app.use(express.static(path.join(__dirname, '../frontend/public')));

//Conexion a mongo 
// Verificar variable de entorno antes de conectar
if (!process.env.MONGODB_URI) {
    console.error('❌ Error: la variable de entorno MONGODB_URI no está definida.');
    console.error('Asegúrate de tener un archivo .env con MONGODB_URI=... o exportar la variable antes de iniciar.');
    process.exit(1);
}

try {
    console.log('🔌 Intentando conectar a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
} catch (error) {
    console.error('❌ Error de MongoDB:', error && error.message ? error.message : error);
    process.exit(1);
}

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
app.use('/api/contacto', contactoRoutes);

// Ruta para el login/admin - redirigir al frontend React
app.get('/login', (req, res) => {
    res.redirect('http://localhost/login');
});

// Proteger el acceso a las páginas del panel administrativo en el servidor
// Si el cliente no envía token, redirigimos al login para evitar que
// usuarios sin autenticación vean el HTML del panel.
app.get(['/admin*', '/tesorero*'], authJwt.verifyToken, role.checkRole('admin', 'tesorero'), (req, res) => {
    // Servir el SPA protegido (misma página que el fallback)
    res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
    // Si la ruta es de API, retornar error 404
    if (req.path.startsWith('/api/')) {
        res.status(404).json({ message: 'Ruta de API no encontrada' });
    } else {
        res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
    }
});


//Inicio del servidor
const PORT = process.env.PORT || 3000;

// Crear servidor HTTP (necesario para Socket.IO)
const server = http.createServer(app);

// Configurar Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      'https://luckas.zapto.org',
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:19006',
      'https://localhost:3000',
      'https://localhost:3001',
      'https://localhost:19006',
    ],
    credentials: true
  }
});

// Guardar io en app para que los controladores puedan usarlo
app.set('io', io);

// Manejo de conexiones Socket.IO
io.on('connection', (socket) => {
  // Unirse al room personal del usuario
  socket.on('join-user', (userId) => {
    if (userId) {
      socket.join(`user_${userId}`);
      console.log(`✅ Usuario ${userId} unido a su room`);
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket desconectado:', socket.id);
  });
});

// Usar server.listen en lugar de app.listen
server.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
}

// Iniciar el servidor
async function main() {
    try {
        await startServer();
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
}

main(); /* NOSONAR */