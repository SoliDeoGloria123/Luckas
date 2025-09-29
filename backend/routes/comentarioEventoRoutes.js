const express = require('express');
const router = express.Router();
const comentarioEventoController = require('../controllers/comentarioEventoController');
const { authJwt } = require('../middlewares');

router.use(authJwt.verifyToken);

// Obtener comentarios de un evento
router.get('/evento/:eventoId', comentarioEventoController.getComentariosByEvento);
// Crear comentario
router.post('/evento/:eventoId', comentarioEventoController.createComentario);
// Like
router.post('/:comentarioId/like', comentarioEventoController.likeComentario);
// Dislike
router.post('/:comentarioId/dislike', comentarioEventoController.dislikeComentario);
// Responder comentario
router.post('/:comentarioId/responder', comentarioEventoController.responderComentario);
// Editar comentario
router.put('/evento/:eventoId/comentario/:comentarioId', comentarioEventoController.editarComentario);
// Eliminar comentario
router.delete('/evento/:eventoId/comentario/:comentarioId', comentarioEventoController.eliminarComentario);
// Moderar comentario (admin)
router.patch('/evento/:eventoId/comentario/:comentarioId/moderar', comentarioEventoController.moderarComentario);

module.exports = router;
