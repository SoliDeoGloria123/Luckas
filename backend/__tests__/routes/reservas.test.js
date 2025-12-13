const request = require('supertest');
const express = require('express');
const reservasRoutes = require('../../routes/reservasRoutes');
const reservasController = require('../../controllers/reservasController');
const { authJwt, role } = require('../../middlewares');

jest.mock('../../controllers/reservasController');
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

describe('Reservas Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/reservas', reservasRoutes);
    jest.clearAllMocks();
  });

  it('should handle GET /api/reservas', async () => {
    reservasController.obtenerReservas.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/reservas');
    expect(res.statusCode).toBe(200);
  });

  it('should handle POST /api/reservas', async () => {
    reservasController.crearReserva.mockImplementation((req, res) => {
      res.status(201).json({ success: true, data: {} });
    });

    const res = await request(app).post('/api/reservas').send({});
    expect(res.statusCode).toBe(201);
  });

  it('should handle PUT /api/reservas/:id', async () => {
    reservasController.actualizarReserva.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: {} });
    });

    const res = await request(app).put('/api/reservas/123').send({});
    expect(res.statusCode).toBe(200);
  });

  it('should handle DELETE /api/reservas/:id', async () => {
    reservasController.eliminarReserva.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).delete('/api/reservas/123');
    expect(res.statusCode).toBe(200);
  });
});
