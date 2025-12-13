const request = require('supertest');
const express = require('express');
const categorizacionRoutes = require('../../routes/categorizacionRoutes');
const categorizacionController = require('../../controllers/categorizacionController');
const { authJwt, role } = require('../../middlewares');

// Mock de los middlewares y controladores
jest.mock('../../controllers/categorizacionController');
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

describe('Categorizacion Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/categorizacion', categorizacionRoutes);
    jest.clearAllMocks();
  });

  describe('GET /api/categorizacion', () => {
    it('should call obtenerCategorias controller', async () => {
      categorizacionController.obtenerCategorias.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: [] });
      });

      const res = await request(app).get('/api/categorizacion');

      expect(res.statusCode).toBe(200);
      expect(categorizacionController.obtenerCategorias).toHaveBeenCalled();
    });
  });

  describe('GET /api/categorizacion/estadistica', () => {
    it('should call estadisticasCategorias controller', async () => {
      categorizacionController.estadisticasCategorias.mockImplementation((req, res) => {
        res.status(200).json({ success: true, stats: {} });
      });

      const res = await request(app).get('/api/categorizacion/estadistica');

      expect(res.statusCode).toBe(200);
      expect(categorizacionController.estadisticasCategorias).toHaveBeenCalled();
    });
  });

  describe('GET /api/categorizacion/:id', () => {
    it('should call obtenerCategoriaPorId controller', async () => {
      categorizacionController.obtenerCategoriaPorId.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: {} });
      });

      const res = await request(app).get('/api/categorizacion/123');

      expect(res.statusCode).toBe(200);
      expect(categorizacionController.obtenerCategoriaPorId).toHaveBeenCalled();
    });
  });

  describe('PATCH /api/categorizacion/toggle-activation/:id', () => {
    it('should call activarDesactivarCategoria controller', async () => {
      categorizacionController.activarDesactivarCategoria.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: {} });
      });

      const res = await request(app)
        .patch('/api/categorizacion/toggle-activation/123')
        .send({ activo: true });

      expect(res.statusCode).toBe(200);
      expect(categorizacionController.activarDesactivarCategoria).toHaveBeenCalled();
    });
  });

  describe('POST /api/categorizacion', () => {
    it('should call crearCategoria controller', async () => {
      categorizacionController.crearCategoria.mockImplementation((req, res) => {
        res.status(201).json({ success: true, data: {} });
      });

      const res = await request(app)
        .post('/api/categorizacion')
        .send({ nombre: 'Test Category' });

      expect(res.statusCode).toBe(201);
      expect(categorizacionController.crearCategoria).toHaveBeenCalled();
    });
  });

  describe('PUT /api/categorizacion/:id', () => {
    it('should call actualizarCategoria controller', async () => {
      categorizacionController.actualizarCategoria.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: {} });
      });

      const res = await request(app)
        .put('/api/categorizacion/123')
        .send({ nombre: 'Updated Category' });

      expect(res.statusCode).toBe(200);
      expect(categorizacionController.actualizarCategoria).toHaveBeenCalled();
    });
  });

  describe('PUT /api/categorizacion/solicitud/:id/categorizar', () => {
    it('should call categorizarSolicitud controller', async () => {
      categorizacionController.categorizarSolicitud.mockImplementation((req, res) => {
        res.status(200).json({ success: true, data: {} });
      });

      const res = await request(app)
        .put('/api/categorizacion/solicitud/123/categorizar')
        .send({ categoria: 'cat-123' });

      expect(res.statusCode).toBe(200);
      expect(categorizacionController.categorizarSolicitud).toHaveBeenCalled();
    });
  });

  describe('DELETE /api/categorizacion/:id', () => {
    it('should call eliminarCategoria controller', async () => {
      categorizacionController.eliminarCategoria.mockImplementation((req, res) => {
        res.status(200).json({ success: true, message: 'Deleted' });
      });

      const res = await request(app).delete('/api/categorizacion/123');

      expect(res.statusCode).toBe(200);
      expect(categorizacionController.eliminarCategoria).toHaveBeenCalled();
    });
  });
});
