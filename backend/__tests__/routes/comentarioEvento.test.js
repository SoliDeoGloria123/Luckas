const request = require('supertest');
const express = require('express');
const comentarioEventoRoutes = require('../../routes/comentarioEventoRoutes');
const comentarioEventoController = require('../../controllers/comentarioEventoController');
const { authJwt, role } = require('../../middlewares');

jest.mock('../../controllers/comentarioEventoController');
jest.mock('../../middlewares', () => ({
  authJwt: {
    verifyToken: jest.fn((req, res, next) => {
      req.userId = 'test-user-id';
      req.userRole = 'admin';
      next();
    })
  },
  role: {
    checkRole: jest.fn(() => (req, res, next) => next()),
    isAdmin: jest.fn((req, res, next) => next())
  }
}));

describe('ComentarioEvento Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/comentarios', comentarioEventoRoutes);
    jest.clearAllMocks();
  });

  it('should handle GET /api/comentarios/evento/:eventoId', async () => {
    comentarioEventoController.getComentariosByEvento.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/comentarios/evento/123');
    expect(res.statusCode).toBe(200);
  });

  it('should handle POST /api/comentarios/evento/:eventoId', async () => {
    comentarioEventoController.createComentario.mockImplementation((req, res) => {
      res.status(201).json({ success: true, data: {} });
    });

    const res = await request(app).post('/api/comentarios/evento/123').send({});
    expect(res.statusCode).toBe(201);
  });

  it('should handle POST /api/comentarios/:comentarioId/like', async () => {
    comentarioEventoController.likeComentario.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).post('/api/comentarios/123/like');
    expect(res.statusCode).toBe(200);
  });

  it('should handle DELETE /api/comentarios/evento/:eventoId/comentario/:comentarioId', async () => {
    comentarioEventoController.eliminarComentario.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).delete('/api/comentarios/evento/123/comentario/456');
    expect(res.statusCode).toBe(200);
  });
});
