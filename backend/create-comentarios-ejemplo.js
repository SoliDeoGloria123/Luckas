// Agrega comentarios de ejemplo a eventos y usuarios
const ComentarioEvento = require('./models/ComentarioEvento');

async function createComentariosDeEjemplo(usuarios, eventos) {
    try {
        if (!usuarios.length || !eventos.length) return [];
        const comentarios = [
            {
                evento: eventos[0]._id,
                usuario: usuarios[0]._id,
                nombreUsuario: usuarios[0].nombre,
                texto: '¡Este evento será increíble! ¿Quién más viene?',
                likes: [usuarios[1]._id],
                dislikes: [],
                respuestas: [
                    {
                        usuario: usuarios[1]._id,
                        nombreUsuario: usuarios[1].nombre,
                        texto: '¡Yo voy! Nos vemos allá.',
                    }
                ]
            },
            {
                evento: eventos[0]._id,
                usuario: usuarios[2]._id,
                nombreUsuario: usuarios[2].nombre,
                texto: '¿Alguien sabe si hay parqueadero?',
                likes: [],
                dislikes: [],
                respuestas: []
            },
            {
                evento: eventos[1]._id,
                usuario: usuarios[1]._id,
                nombreUsuario: usuarios[1].nombre,
                texto: '¡Me encanta este taller, lo recomiendo!',
                likes: [usuarios[0]._id, usuarios[2]._id],
                dislikes: [],
                respuestas: []
            },
            {
                evento: eventos[2]._id,
                usuario: usuarios[3]._id,
                nombreUsuario: usuarios[3].nombre,
                texto: '¿El festival es apto para niños?',
                likes: [],
                dislikes: [usuarios[2]._id],
                respuestas: [
                    {
                        usuario: usuarios[0]._id,
                        nombreUsuario: usuarios[0].nombre,
                        texto: 'Sí, es para toda la familia.',
                    }
                ]
            }
        ];
        await ComentarioEvento.insertMany(comentarios);
        console.log('💬 Comentarios de ejemplo creados');
        return comentarios;
    } catch (error) {
        console.error('❌ Error creando comentarios de ejemplo:', error);
        return [];
    }
}

module.exports = createComentariosDeEjemplo;
