const request = require('supertest');
const express = require('express');
const tareaRoutes = require('../../routes/tareaRoutes');
const tareaController = require('../../controllers/tareaController');
const { authJwt, role } = require('../../middlewares');

jest.mock('../../controllers/tareaController');
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

describe('Tarea Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/tareas', tareaRoutes);
    jest.clearAllMocks();
  });

  it('should handle GET /api/tareas', async () => {
    tareaController.obtenerTareas.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/tareas');
    expect(res.statusCode).toBe(200);
  });

  it('should handle POST /api/tareas', async () => {
    tareaController.crearTarea.mockImplementation((req, res) => {
      res.status(201).json({ success: true, data: {} });
    });

    const res = await request(app).post('/api/tareas').send({});
    expect(res.statusCode).toBe(201);
  });

  it('should handle PUT /api/tareas/:id', async () => {
    tareaController.actualizarTarea.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: {} });
    });

    const res = await request(app).put('/api/tareas/123').send({});
    expect(res.statusCode).toBe(200);
  });

  it('should handle DELETE /api/tareas/:id', async () => {
    tareaController.eliminarTarea.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).delete('/api/tareas/123');
    expect(res.statusCode).toBe(200);
  });
});
