const ComentarioEvento = require('../../models/ComentarioEvento');
const User = require('../../models/User');
const comentarioController = require('../../controllers/comentarioEventoController');

jest.mock('../../models/ComentarioEvento');
jest.mock('../../models/User');

describe('Comentario Evento Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: 'user-123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getComentariosByEvento', () => {
    it('should return comentarios for an evento', async () => {
      const mockComentarios = [
        { _id: '1', usuario: { nombre: 'User 1' }, texto: 'Comment 1', likes: [], dislikes: [], respuestas: [] }
      ];

      req.params.eventoId = 'evento-123';

      ComentarioEvento.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                lean: jest.fn().mockResolvedValue(mockComentarios)
              })
            })
          })
        })
      });

      await comentarioController.getComentariosByEvento(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        comentarios: expect.any(Array)
      });
    });
  });

  describe('createComentario', () => {
    it('should create a comentario', async () => {
      const mockUser = { _id: 'user-123', nombre: 'Test User' };
      const mockComentario = {
        _id: 'comentario-123',
        evento: 'evento-123',
        usuario: 'user-123',
        texto: 'Test comment',
        save: jest.fn().mockResolvedValue(true)
      };

      req.params.eventoId = 'evento-123';
      req.body.texto = 'Test comment';

      User.findById = jest.fn().mockResolvedValue(mockUser);
      ComentarioEvento.mockImplementation(() => mockComentario);

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        comentario: mockComentario
      });
    });

    it('should return 404 if user not found', async () => {
      req.params.eventoId = 'evento-123';
      req.body.texto = 'Test';

      User.findById = jest.fn().mockResolvedValue(null);

      await comentarioController.createComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('likeComentario', () => {
    it('should add like to comentario', async () => {
      const mockComentario = {
        _id: 'comentario-123',
        likes: [],
        dislikes: [],
        save: jest.fn().mockResolvedValue(true)
      };

      req.params.comentarioId = 'comentario-123';

      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.likeComentario(req, res);

      expect(mockComentario.likes).toContain('user-123');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 400 if already liked', async () => {
      const mockComentario = {
        likes: ['user-123'],
        dislikes: []
      };

      req.params.comentarioId = 'comentario-123';

      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.likeComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('dislikeComentario', () => {
    it('should add dislike to comentario', async () => {
      const mockComentario = {
        _id: 'comentario-123',
        likes: [],
        dislikes: [],
        save: jest.fn().mockResolvedValue(true)
      };

      req.params.comentarioId = 'comentario-123';

      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.dislikeComentario(req, res);

      expect(mockComentario.dislikes).toContain('user-123');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('responderComentario', () => {
    it('should add response to comentario', async () => {
      const mockUser = { _id: 'user-123', nombre: 'Test User' };
      const mockComentario = {
        _id: 'comentario-123',
        respuestas: [],
        save: jest.fn().mockResolvedValue(true)
      };

      req.params.comentarioId = 'comentario-123';
      req.body.texto = 'Response text';

      User.findById = jest.fn().mockResolvedValue(mockUser);
      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.responderComentario(req, res);

      expect(mockComentario.respuestas.length).toBe(1);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('editarComentario', () => {
    it('should edit comentario', async () => {
      const mockComentario = {
        _id: 'comentario-123',
        evento: 'evento-123',
        usuario: 'user-123',
        texto: 'Old text',
        save: jest.fn().mockResolvedValue(true)
      };

      req.params = { eventoId: 'evento-123', comentarioId: 'comentario-123' };
      req.body.texto = 'New text';

      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.editarComentario(req, res);

      expect(mockComentario.texto).toBe('New text');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 403 if not authorized', async () => {
      const mockComentario = {
        evento: 'evento-123',
        usuario: 'other-user'
      };

      req.params = { eventoId: 'evento-123', comentarioId: 'comentario-123' };
      req.body.texto = 'New text';

      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.editarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('eliminarComentario', () => {
    it('should delete comentario', async () => {
      const mockComentario = {
        _id: 'comentario-123',
        evento: 'evento-123',
        usuario: 'user-123',
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      req.params = { eventoId: 'evento-123', comentarioId: 'comentario-123' };

      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.eliminarComentario(req, res);

      expect(mockComentario.deleteOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });
  });

  describe('moderarComentario', () => {
    it('should moderate comentario if admin', async () => {
      const mockUser = { _id: 'user-123', rol: 'admin' };
      const mockComentario = {
        evento: 'evento-123',
        texto: 'Original text',
        save: jest.fn().mockResolvedValue(true)
      };

      req.params = { eventoId: 'evento-123', comentarioId: 'comentario-123' };

      User.findById = jest.fn().mockResolvedValue(mockUser);
      ComentarioEvento.findById = jest.fn().mockResolvedValue(mockComentario);

      await comentarioController.moderarComentario(req, res);

      expect(mockComentario.texto).toContain('[Moderado por admin]');
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should return 403 if not admin', async () => {
      const mockUser = { _id: 'user-123', rol: 'user' };

      req.params = { eventoId: 'evento-123', comentarioId: 'comentario-123' };

      User.findById = jest.fn().mockResolvedValue(mockUser);

      await comentarioController.moderarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
