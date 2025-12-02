const request = require('supertest');
const express = require('express');
const solicitudRoutes = require('../../routes/solicitudRoutes');
const Solicitud = require('../../models/Solicitud');
const Inscripcion = require('../../models/Inscripciones');
const Reserva = require('../../models/Reservas');

// Mock middlewares
jest.mock('../../middlewares', () => ({
  authJwt: {
    verifyToken: (req, res, next) => {
      req.userId = 'mockUserId';
      next();
    }
  },
  role: {
    checkRole: (...roles) => (req, res, next) => next(),
    isAdmin: (req, res, next) => next()
  }
}));

// Mock models
jest.mock('../../models/Solicitud');
jest.mock('../../models/Inscripciones');
jest.mock('../../models/Reservas');

const app = express();
app.use(express.json());
app.use('/api/solicitudes', solicitudRoutes);

describe('Solicitud Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/solicitudes/unificado', () => {
    it('should return unified data from solicitudes, inscripciones, and reservas', async () => {
      const mockSolicitudes = [{ _id: '1', solicitante: 'Test' }];
      const mockInscripciones = [{ _id: '2', usuario: 'User1' }];
      const mockReservas = [{ _id: '3', cabana: 'Cabana1' }];

      Solicitud.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockSolicitudes)
      });

      Inscripcion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockInscripciones)
      });

      Reserva.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockReservas)
      });

      const res = await request(app).get('/api/solicitudes/unificado');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('solicitudes');
      expect(res.body.data).toHaveProperty('inscripciones');
      expect(res.body.data).toHaveProperty('reservas');
      expect(res.body.data.solicitudes).toEqual(mockSolicitudes);
      expect(res.body.data.inscripciones).toEqual(mockInscripciones);
      expect(res.body.data.reservas).toEqual(mockReservas);
    });

    it('should handle errors', async () => {
      Solicitud.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        lean: jest.fn().mockRejectedValue(new Error('DB Error'))
      });

      const res = await request(app).get('/api/solicitudes/unificado');

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('DB Error');
    });
  });
});
