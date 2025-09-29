const mongoose = require('mongoose');

const comentarioEventoSchema = new mongoose.Schema({
  evento: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Eventos',
    required: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  nombreUsuario: {
    type: String,
    required: true
  },
  texto: {
    type: String,
    required: true
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  respuestas: [
    {
      usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      nombreUsuario: String,
      texto: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
}, {
  timestamps: true
});

module.exports = mongoose.model('ComentarioEvento', comentarioEventoSchema);
