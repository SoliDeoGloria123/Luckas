const request = require('supertest');
const express = require('express');
const programaAcademicoRoutes = require('../../routes/programaAcademicoRoutes');
const programaAcademicoController = require('../../controllers/programaAcademicoController');
const { authJwt, role } = require('../../middlewares');

jest.mock('../../controllers/programaAcademicoController');
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

describe('ProgramaAcademico Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/programas', programaAcademicoRoutes);
    jest.clearAllMocks();
  });

  it('should handle GET /api/programas', async () => {
    programaAcademicoController.obtenerProgramasAcademicos.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/programas');
    expect(res.statusCode).toBe(200);
  });

  it('should handle POST /api/programas', async () => {
    programaAcademicoController.crearProgramaAcademico.mockImplementation((req, res) => {
      res.status(201).json({ success: true, data: {} });
    });

    const res = await request(app).post('/api/programas').send({});
    expect(res.statusCode).toBe(201);
  });

  it('should handle PUT /api/programas/:id', async () => {
    programaAcademicoController.actualizarProgramaAcademico.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: {} });
    });

    const res = await request(app).put('/api/programas/123').send({});
    expect(res.statusCode).toBe(200);
  });

  it('should handle DELETE /api/programas/:id', async () => {
    programaAcademicoController.eliminarProgramaAcademico.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).delete('/api/programas/123');
    expect(res.statusCode).toBe(200);
  });
});
