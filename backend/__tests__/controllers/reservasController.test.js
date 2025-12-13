const Reserva = require('../../models/Reservas');
const Solicitud = require('../../models/Solicitud');
const Cabana = require('../../models/Cabana');
const Usuario = require('../../models/User');
const mongoose = require('mongoose');
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

      Reserva.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockReserva)
        })
      });

      await reservasController.obtenerReservaPorId(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockReserva
      });
    });

    it('should return 404 if reserva not found', async () => {
      req.params.id = 'nonexistent';

      Reserva.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

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
      const mockReservas = [{ _id: '1' }, { _id: '2' }];
      req.params.userId = 'user-123';

      Reserva.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockReservas)
      });

      await reservasController.obtenerReservasPorUsuario(req, res);

      expect(res.json).toHaveBeenCalledWith(mockReservas);
    });

    it('should return 400 if userId is missing', async () => {
      req.params = {};

      await reservasController.obtenerReservasPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('obtenerEstadisticasReservas', () => {
    it('should return reservas statistics', async () => {
      Reserva.countDocuments = jest.fn()
        .mockResolvedValueOnce(50)  // total
        .mockResolvedValueOnce(20)  // activas
        .mockResolvedValueOnce(25)  // pendientes
        .mockResolvedValueOnce(5)   // confirmadas
        .mockResolvedValueOnce(10)  // canceladas
        .mockResolvedValueOnce(3)   // finalizadas
        .mockResolvedValueOnce(8);  // nuevasEsteMes
      
      Reserva.aggregate = jest.fn().mockResolvedValue([
        { cabanaId: 'cabana-1', nombre: 'Cabana 1', total: 5 }
      ]);

      await reservasController.obtenerEstadisticasReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        totalReservas: 50,
        activas: 20,
        pendientes: 25
      }));
    });

    it('should handle errors', async () => {
      Reserva.countDocuments = jest.fn().mockRejectedValue(new Error('DB Error'));

      await reservasController.obtenerEstadisticasReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('toggleReservaActivation', () => {
    it('should toggle reserva activation', async () => {
      const mockReserva = {
        _id: 'reserva-123',
        activo: false,
        save: jest.fn().mockResolvedValue(true)
      };

      req.params.id = 'reserva-123';
      Reserva.findById = jest.fn().mockResolvedValue(mockReserva);

      await reservasController.toggleReservaActivation(req, res);

      expect(mockReserva.activo).toBe(true);
      expect(mockReserva.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Reserva activada'
      }));
    });

    it('should return 404 if reserva not found', async () => {
      req.params.id = 'nonexistent';
      Reserva.findById = jest.fn().mockResolvedValue(null);

      await reservasController.toggleReservaActivation(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerDatosParaReserva', () => {
    it('should return data for creating reserva', async () => {
      const mockUsuarios = [{ _id: 'user1', nombre: 'Test' }];
      const mockCabanas = [{ _id: 'cabana1', nombre: 'Cabana Test' }];

      Usuario.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockUsuarios)
      });

      Cabana.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockCabanas)
      });

      await reservasController.obtenerDatosParaReserva(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          usuarios: mockUsuarios,
          cabanas: mockCabanas
        })
      }));
    });
  });

  describe('crearReserva', () => {
    it('should create a reservation successfully', async () => {
      req.body = {
        usuario: '507f1f77bcf86cd799439011',
        cabana: '507f1f77bcf86cd799439012',
        fechaInicio: '2023-01-01',
        fechaFin: '2023-01-05',
        nombre: 'John',
        apellido: 'Doe',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        correoElectronico: 'john@example.com',
        telefono: '1234567890',
        numeroPersonas: 2
      };
      req.userId = '507f1f77bcf86cd799439011';

      Usuario.findById.mockResolvedValue({
        _id: '507f1f77bcf86cd799439011',
        nombre: 'John',
        apellido: 'Doe',
        correo: 'john@example.com',
        telefono: '1234567890'
      });

      Cabana.findById.mockResolvedValue({
        _id: '507f1f77bcf86cd799439012',
        nombre: 'Cabana 1',
        categoria: 'Standard'
      });

      const mockReserva = {
        _id: 'reserva-123',
        ...req.body,
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({ _id: 'reserva-123' })
      };
      
      // Reserva and Solicitud are already mocked globally to behave as constructors
      // We don't need to override them here unless we want to change the instance they return
      // But since they are not jest.fn(), we cannot use mockImplementation on them directly.
      // The global mockModel returns an instance with save() mocked.


      await reservasController.crearReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {};
      await reservasController.crearReserva(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ 
        message: expect.stringContaining('Campos requeridos faltantes') 
      }));
    });

    it('should return 400 if invalid IDs', async () => {
      req.body = {
        usuario: 'invalid',
        cabana: 'invalid',
        fechaInicio: '2023-01-01',
        fechaFin: '2023-01-05',
        nombre: 'John',
        apellido: 'Doe',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        correoElectronico: 'john@example.com',
        telefono: '1234567890',
        numeroPersonas: 2
      };
      mongoose.Types.ObjectId.isValid.mockReturnValue(false);

      await reservasController.crearReserva(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user or cabana not found', async () => {
      req.body = {
        usuario: '507f1f77bcf86cd799439011',
        cabana: '507f1f77bcf86cd799439012',
        fechaInicio: '2023-01-01',
        fechaFin: '2023-01-05',
        nombre: 'John',
        apellido: 'Doe',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        correoElectronico: 'john@example.com',
        telefono: '1234567890',
        numeroPersonas: 2
      };
      mongoose.Types.ObjectId.isValid.mockReturnValue(true);
      Usuario.findById.mockResolvedValue(null);

      await reservasController.crearReserva(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('actualizarReserva', () => {
    it('should update reservation successfully', async () => {
      req.params.id = 'reserva-123';
      req.body = { estado: 'Confirmada', activo: 'true' };
      
      Reserva.findByIdAndUpdate.mockResolvedValue({ _id: 'reserva-123', estado: 'Confirmada' });

      await reservasController.actualizarReserva(req, res);

      expect(Reserva.findByIdAndUpdate).toHaveBeenCalledWith('reserva-123', expect.any(Object), { new: true });
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 404 if reservation not found', async () => {
      req.params.id = 'reserva-123';
      Reserva.findByIdAndUpdate.mockResolvedValue(null);

      await reservasController.actualizarReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarReserva', () => {
    it('should delete reservation successfully', async () => {
      req.params.id = 'reserva-123';
      Reserva.findByIdAndDelete.mockResolvedValue({ _id: 'reserva-123' });

      await reservasController.eliminarReserva(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 404 if reservation not found', async () => {
      req.params.id = 'reserva-123';
      Reserva.findByIdAndDelete.mockResolvedValue(null);

      await reservasController.eliminarReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerReservasPorUsuario', () => {
    it('should return reservations for user', async () => {
      req.params.userId = 'user-123';
      Reserva.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([{ _id: 'reserva-1' }])
      });

      await reservasController.obtenerReservasPorUsuario(req, res);

      expect(res.json).toHaveBeenCalledWith([{ _id: 'reserva-1' }]);
    });

    it('should return 400 if userId missing', async () => {
      req.params.userId = undefined;
      await reservasController.obtenerReservasPorUsuario(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle errors', async () => {
      req.params.userId = 'user-123';
      Reserva.find.mockImplementation(() => { throw new Error('DB Error'); });
      await reservasController.obtenerReservasPorUsuario(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
