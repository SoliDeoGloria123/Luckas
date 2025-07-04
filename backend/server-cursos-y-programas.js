require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

// Importar solo las rutas nuevas que funcionan
const cursosRoutes = require('./routes/cursosRoutes');
const programasTecnicosRoutes = require('./routes/programasTecnicosRoutes');

// Crear aplicación Express
const app = express();

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
    .then(() => console.log('✅ MongoDB conectado'))
    .catch(error => console.error('❌ Error de MongoDB', error.message));

// Rutas de API nuevas
app.use('/api/cursos', cursosRoutes);
app.use('/api/programas-tecnicos', programasTecnicosRoutes);

// Ruta de prueba
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'Servidor funcionando correctamente',
        nuevasRutas: [
            'GET/POST/PUT/DELETE /api/cursos',
            'GET/POST/PUT/DELETE /api/programas-tecnicos'
        ]
    });
});

// Rutas para páginas externas/públicas
app.get('/', (req, res) => {
    res.send(`
        <h1>🎓 Sistema Luckas - Servidor Backend</h1>
        <h2>✅ Servidor funcionando correctamente</h2>
        <h3>Nuevas funcionalidades implementadas:</h3>
        <ul>
            <li>✅ Gestión completa de Cursos</li>
            <li>✅ Gestión completa de Programas Técnicos</li>
        </ul>
        <h3>Rutas disponibles:</h3>
        <ul>
            <li><strong>GET</strong> /api/test - Prueba del servidor</li>
            <li><strong>GET</strong> /api/cursos - Obtener todos los cursos</li>
            <li><strong>POST</strong> /api/cursos - Crear nuevo curso (admin)</li>
            <li><strong>GET</strong> /api/programas-tecnicos - Obtener programas técnicos</li>
            <li><strong>POST</strong> /api/programas-tecnicos - Crear programa técnico (admin)</li>
        </ul>
        <p><strong>Nota:</strong> Para acceder al dashboard admin, usar el frontend React en puerto 3001</p>
    `);
});

// Manejo de rutas no encontradas
app.get('*', (req, res) => {
    if (!req.path.startsWith('/api/')) {
        res.redirect('/');
    } else {
        res.status(404).json({ message: 'Ruta de API no encontrada' });
    }
});

// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`\n🚀 ============================================`);
    console.log(`✅ Servidor Luckas (NUEVAS FUNCIONALIDADES) corriendo`);
    console.log(`🌐 Backend: http://localhost:${PORT}`);
    console.log(`📊 Dashboard Admin: Iniciar frontend React en puerto 3001`);
    console.log(`🧪 Prueba: http://localhost:${PORT}/api/test`);
    console.log(`============================================\n`);
    console.log(`📚 NUEVAS FUNCIONALIDADES DISPONIBLES:`);
    console.log(`   ✅ Gestión completa de Cursos`);
    console.log(`   ✅ Gestión completa de Programas Técnicos`);
    console.log(`   ✅ CRUD completo para ambos`);
    console.log(`   ✅ Estadísticas y filtros`);
    console.log(`   ✅ Inscripciones de usuarios`);
    console.log(`============================================\n`);
});
