const ComentarioEvento = require('../models/ComentarioEvento');
const Evento = require('../models/Eventos');
const User = require('../models/User');

// Obtener comentarios de un evento
exports.getComentariosByEvento = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const comentarios = await ComentarioEvento.find({ evento: eventoId })
      .populate('usuario', 'nombre')
      .populate('likes', 'nombre')
      .populate('dislikes', 'nombre')
      .sort({ createdAt: 1 });
    res.json({ success: true, comentarios });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Crear comentario
exports.createComentario = async (req, res) => {
  try {
    const { eventoId } = req.params;
    const { texto } = req.body;
    const usuario = req.userId;
    const user = await User.findById(usuario);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    const comentario = new ComentarioEvento({
      evento: eventoId,
      usuario,
      nombreUsuario: user.nombre,
      texto
    });
    await comentario.save();
    res.status(201).json({ success: true, comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Like
exports.likeComentario = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const usuario = req.userId;
    const comentario = await ComentarioEvento.findById(comentarioId);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    if (comentario.likes.includes(usuario)) return res.status(400).json({ success: false, message: 'Ya diste like' });
    comentario.likes.push(usuario);
    comentario.dislikes = comentario.dislikes.filter(id => id.toString() !== usuario);
    await comentario.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dislike
exports.dislikeComentario = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const usuario = req.userId;
    const comentario = await ComentarioEvento.findById(comentarioId);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    if (comentario.dislikes.includes(usuario)) return res.status(400).json({ success: false, message: 'Ya diste dislike' });
    comentario.dislikes.push(usuario);
    comentario.likes = comentario.likes.filter(id => id.toString() !== usuario);
    await comentario.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Responder comentario
exports.responderComentario = async (req, res) => {
  try {
    const { comentarioId } = req.params;
    const { texto } = req.body;
    const usuario = req.userId;
    const user = await User.findById(usuario);
    if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    const comentario = await ComentarioEvento.findById(comentarioId);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    comentario.respuestas.push({ usuario, nombreUsuario: user.nombre, texto });
    await comentario.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Editar comentario
exports.editarComentario = async (req, res) => {
  try {
    const { eventoId, comentarioId } = req.params;
    const { texto } = req.body;
    const usuario = req.userId;
    const comentario = await ComentarioEvento.findById(comentarioId);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    if (comentario.evento.toString() !== eventoId) return res.status(400).json({ success: false, message: 'Evento incorrecto' });
    if (comentario.usuario.toString() !== usuario) return res.status(403).json({ success: false, message: 'No autorizado' });
    comentario.texto = texto;
    await comentario.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar comentario
exports.eliminarComentario = async (req, res) => {
  try {
    const { eventoId, comentarioId } = req.params;
    const usuario = req.userId;
    const comentario = await ComentarioEvento.findById(comentarioId);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    if (comentario.evento.toString() !== eventoId) return res.status(400).json({ success: false, message: 'Evento incorrecto' });
    if (comentario.usuario.toString() !== usuario) return res.status(403).json({ success: false, message: 'No autorizado' });
    await comentario.deleteOne();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Moderar comentario (admin)
exports.moderarComentario = async (req, res) => {
  try {
    const { eventoId, comentarioId } = req.params;
    const usuario = req.userId;
    const user = await User.findById(usuario);
    if (!user || user.rol !== 'admin') return res.status(403).json({ success: false, message: 'Solo admin puede moderar' });
    const comentario = await ComentarioEvento.findById(comentarioId);
    if (!comentario) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    if (comentario.evento.toString() !== eventoId) return res.status(400).json({ success: false, message: 'Evento incorrecto' });
    comentario.texto = '[Moderado por admin] ' + comentario.texto;
    await comentario.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
