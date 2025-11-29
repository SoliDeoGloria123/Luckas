  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: 'user-123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('crearReserva', () => {
    it('should create a reserva successfully', async () => {
      const mockUsuario = { _id: 'user-123', nombre: 'Test User' };
      const mockCabana = { _id: 'cabana-123', nombre: 'Cabaña Test' };
      const mockReserva = {
        _id: 'reserva-123',
        usuario: 'user-123',
        cabana: 'cabana-123',
        cabana: 'cabana-123',
        save: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({ _id: 'reserva-123' })
      };
      const mockSolicitud = {
        _id: 'solicitud-123',
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {
        usuario: 'user-123',
        cabana: 'cabana-123',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-01-05',
        numeroPersonas: 4,
        fechaFin: '2024-01-05',
        numeroPersonas: 4,
        numeroPersonas: 4,
        estado: 'Pendiente',
        nombre: 'Test',
        apellido: 'User',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '1234567890',
        correoElectronico: 'test@example.com',
        telefono: '1234567890'
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      Cabana.findById = jest.fn().mockResolvedValue(mockCabana);
      Reserva.mockImplementation(() => mockReserva);
      Solicitud.mockImplementation(() => mockSolicitud);

      await reservasController.crearReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {
        usuario: 'user-123'
        // missing other required fields
      };

      await reservasController.crearReserva(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });
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
      req.body = { estado: 'confirmada' };

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
      req.body = { estado: 'confirmada' };

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
      const mockReservas = [{ _id: '1' }, { _id: '2' }];
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

  describe('toggleReservaActivation', () => {
    it('should toggle reserva activation', async () => {
      const mockReserva = {
        _id: 'reserva-123',
        activo: true,
        save: jest.fn().mockResolvedValue(true)
      };

      req.params.id = 'reserva-123';

      Reserva.findById = jest.fn().mockResolvedValue(mockReserva);

      await reservasController.toggleReservaActivation(req, res);

      expect(mockReserva.activo).toBe(false);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('obtenerEstadisticasReservas', () => {
    it('should return reservas statistics', async () => {
      Reserva.countDocuments = jest.fn().mockResolvedValue(10);
      Reserva.aggregate = jest.fn().mockResolvedValue([
        { cabanaId: 'cabana-1', nombre: 'Cabana 1', total: 5 }
      ]);

      await reservasController.obtenerEstadisticasReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        totalReservas: 10,
        pendientes: 10,
        confirmadas: 10,
        canceladas: 10
      }));
    });

    it('should handle errors', async () => {
      Reserva.countDocuments = jest.fn().mockRejectedValue(new Error('DB Error'));

      await reservasController.obtenerEstadisticasReservas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
