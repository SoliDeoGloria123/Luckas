const request = require('supertest');
const express = require('express');
const reportesRoutes = require('../../routes/reportesRoutes');
const reportesController = require('../../controllers/reportesControllers');
const { authJwt, role } = require('../../middlewares');

jest.mock('../../controllers/reportesControllers');
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

describe('Reportes Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/reportes', reportesRoutes);
    jest.clearAllMocks();
  });

  it('should handle GET /api/reportes/dashboard', async () => {
    reportesController.getDashboardReport.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: {} });
    });

    const res = await request(app).get('/api/reportes/dashboard');
    expect(res.statusCode).toBe(200);
  });

  it('should handle GET /api/reportes/inscripciones', async () => {
    reportesController.getInscripcionesReport.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/reportes/inscripciones');
    expect(res.statusCode).toBe(200);
  });

  it('should handle GET /api/reportes/eventos', async () => {
    reportesController.getEventosReport.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/reportes/eventos');
    expect(res.statusCode).toBe(200);
  });

  it('should handle GET /api/reportes/usuarios', async () => {
    reportesController.getUsuariosReport.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/reportes/usuarios');
    expect(res.statusCode).toBe(200);
  });

  it('should handle GET /api/reportes', async () => {
    reportesController.getReportesGuardados.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/reportes');
    expect(res.statusCode).toBe(200);
  });

  it('should handle POST /api/reportes', async () => {
    reportesController.guardarReporte.mockImplementation((req, res) => {
      res.status(201).json({ success: true, data: {} });
    });

    const res = await request(app).post('/api/reportes').send({});
    expect(res.statusCode).toBe(201);
  });
});
