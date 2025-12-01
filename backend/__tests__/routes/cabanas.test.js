const request = require('supertest');
const express = require('express');
const cabanasRoutes = require('../../routes/cabanasRoutes');
const cabanasController = require('../../controllers/cabanasController');
const { authJwt, role } = require('../../middlewares');

// Mock de los middlewares y controladores
jest.mock('../../controllers/cabanasController');
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
jest.mock('../../middlewares/uploadCloudinary', () => ({
  uploadMultiple: jest.fn((req, res, next) => next()),
  uploadMultipleToCloudinary: jest.fn((req, res, next) => {
    req.cloudinaryUrls = ['https://test.com/image.jpg'];
    next();
  })
}));

describe('Cabanas Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/cabanas', cabanasRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/cabanas', () => {
    it('should call obtenerCabanas controller', async () => {
      cabanasController.obtenerCabanas.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: [] });
      });

      const res = await request(app).get('/api/cabanas');

      expect(res.statusCode).toBe(200);
      expect(cabanasController.obtenerCabanas).toHaveBeenCalled();
    });
  });

  describe('GET /api/cabanas/estadisticas', () => {
    it('should call obtenerEstadisticasCabanas controller', async () => {
      cabanasController.obtenerEstadisticasCabanas.mockImplementation((req, res) => {
        res.status(200).json({ success: true, stats: {} });
      });

      const res = await request(app).get('/api/cabanas/estadisticas');

      expect(res.statusCode).toBe(200);
      expect(cabanasController.obtenerEstadisticasCabanas).toHaveBeenCalled();
    });
  });

  describe('GET /api/cabanas/:id', () => {
    it('should call obtenerCabanaPorId controller', async () => {
      cabanasController.obtenerCabanaPorId.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: {} });
      });

      const res = await request(app).get('/api/cabanas/123');

      expect(res.statusCode).toBe(200);
      expect(cabanasController.obtenerCabanaPorId).toHaveBeenCalled();
    });
  });

  describe('POST /api/cabanas', () => {
    it('should call crearCabana controller', async () => {
      cabanasController.crearCabana.mockImplementation((req, res) => {
        res.status(201).json({ success: true, data: {} });
      });

      const res = await request(app)
        .post('/api/cabanas')
        .send({ nombre: 'Test Cabana' });

      expect(res.statusCode).toBe(201);
      expect(cabanasController.crearCabana).toHaveBeenCalled();
    });
  });

  describe('PUT /api/cabanas/:id', () => {
    it('should call actualizarCabana controller', async () => {
      cabanasController.actualizarCabana.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: {} });
      });

      const res = await request(app)
        .put('/api/cabanas/123')
        .send({ nombre: 'Updated Cabana' });

      expect(res.statusCode).toBe(200);
      expect(cabanasController.actualizarCabana).toHaveBeenCalled();
    });
  });

  describe('PUT /api/cabanas/:id/categorizar', () => {
    it('should call categorizarCabana controller', async () => {
      cabanasController.categorizarCabana.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: {} });
      });

      const res = await request(app)
        .put('/api/cabanas/123/categorizar')
        .send({ categoria: 'cat-123' });

      expect(res.statusCode).toBe(200);
      expect(cabanasController.categorizarCabana).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/cabanas/:id', () => {
    it('should call eliminarCabana controller', async () => {
      cabanasController.eliminarCabana.mockImplementation((req, res) => {
        res.status(200).json({ success: true, message: 'Deleted' });
      });

      const res = await request(app).delete('/api/cabanas/123');

      expect(res.statusCode).toBe(200);
      expect(cabanasController.eliminarCabana).toHaveBeenCalled();
    });
  });
});
