const Reserva = require('../../models/Reservas');
const Solicitud = require('../../models/Solicitud');
const Cabana = require('../../models/Cabana');
const Usuario = require('../../models/User');
const reservasController = require('../../controllers/reservasController');

jest.mock('../../utils/notificationUtils');

describe('Reservas Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: 'user-123',
      userRole: 'admin'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('obtenerReservas', () => {
    it('should return all reservas', async () => {
      const mockReservas = [
        { _id: '1', usuario: 'user-1' },
        { _id: '2', usuario: 'user-2' }
      ];

      Reserva.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockReservas)
        })
      });

      await reservasController.obtenerReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReservas
      });
    });

    it('should handle errors', async () => {
      Reserva.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockRejectedValue(new Error('DB Error'))
        })
      });

      await reservasController.obtenerReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('obtenerReservaPorId', () => {
    it('should return a reserva by id', async () => {
      const mockReserva = { _id: 'reserva-123', usuario: 'user-123' };
      req.params.id = 'reserva-123';

      Reserva.findById = jest.fn().mockResolvedValue(mockReserva);

      await reservasController.obtenerReservaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReserva
      });
    });

    it('should return 404 if reserva not found', async () => {
      req.params.id = 'nonexistent';

      Reserva.findById = jest.fn().mockResolvedValue(null);

      await reservasController.obtenerReservaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('actualizarReserva', () => {
    it('should update a reserva', async () => {
      const mockReserva = {
        _id: 'reserva-123',
        usuario: 'user-123'
      };

      req.params.id = 'reserva-123';
      req.body = { estado: 'Confirmada' };

      Reserva.findByIdAndUpdate = jest.fn().mockResolvedValue(mockReserva);

      await reservasController.actualizarReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReserva
      });
    });

    it('should return 404 if reserva not found', async () => {
      req.params.id = 'nonexistent';
      req.body = { estado: 'Confirmada' };

      Reserva.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await reservasController.actualizarReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarReserva', () => {
    it('should delete a reserva', async () => {
      req.params.id = 'reserva-123';

      Reserva.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: 'reserva-123'
      });

      await reservasController.eliminarReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Reserva eliminada'
      });
    });

    it('should return 404 if reserva not found', async () => {
      req.params.id = 'nonexistent';

      Reserva.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await reservasController.eliminarReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerReservasPorUsuario', () => {
    it('should return reservas for a user', async () => {
      const mockReservas = [{ _id: '1' }, { _id: '2' }]
;
      req.params.userId = 'user-123';

      Reserva.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockReservas)
        })
      });

      await reservasController.obtenerReservasPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReservas
      });
    });
  });

  describe('obtenerEstadisticasReservas', () => {
    it('should return reservas statistics', async () => {
      Reserva.countDocuments = jest.fn()
        .mockResolvedValueOnce(50)  // total
        .mockResolvedValueOnce(20)  // pendientes
        .mockResolvedValueOnce(25)  // confirmadas
        .mockResolvedValueOnce(5);  // canceladas
      
      Reserva.aggregate = jest.fn().mockResolvedValue([
        { cabanaId: 'cabana-1', nombre: 'Cabana 1', total: 5 }
      ]);

      await reservasController.obtenerEstadisticasReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });

    it('should handle errors', async () => {
      Reserva.countDocuments = jest.fn().mockRejectedValue(new Error('DB Error'));

      await reservasController.obtenerEstadisticasReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
