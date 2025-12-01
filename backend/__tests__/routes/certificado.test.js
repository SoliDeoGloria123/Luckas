const request = require('supertest');
const express = require('express');
const certificadoRoutes = require('../../routes/certificadoRoutes');
const certificadoController = require('../../controllers/certificadoControllers');
const { authJwt, role } = require('../../middlewares');

jest.mock('../../controllers/certificadoControllers');
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

describe('Certificado Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/certificados', certificadoRoutes);
    jest.clearAllMocks();
  });

  it('should handle GET /api/certificados/estadisticas', async () => {
    certificadoController.obtenerEstadisticasCertificados.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/certificados/estadisticas');
    expect(res.statusCode).toBe(200);
  });

  it('should handle POST /api/certificados/generar', async () => {
    certificadoController.generarCertificado.mockImplementation((req, res) => {
      res.status(201).json({ success: true, data: {} });
    });

    const res = await request(app).post('/api/certificados/generar').send({});
    expect(res.statusCode).toBe(201);
  });
});
