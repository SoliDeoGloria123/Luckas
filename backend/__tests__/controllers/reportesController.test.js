
describe('Reportes Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      user: { _id: 'userId' },
      params: {}
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getDashboardReport', () => {
    it('should return dashboard report data', async () => {
      Usuario.countDocuments.mockResolvedValue(10);
      Reserva.countDocuments.mockResolvedValue(5);
      Inscripcion.countDocuments.mockResolvedValue(20);
      Evento.countDocuments.mockResolvedValue(3);
      Cabana.countDocuments.mockResolvedValue(8);
      Solicitud.countDocuments.mockResolvedValue(15);
      Tarea.countDocuments.mockResolvedValue(7);

      await reportesController.getDashboardReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          resumen: expect.objectContaining({
            totalUsuarios: 10,
            totalReservas: 5,
            totalInscripciones: 20
          })
        })
      }));
    });

    it('should handle errors', async () => {
      Usuario.countDocuments.mockRejectedValue(new Error('Database error'));
      await reportesController.getDashboardReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('getReservasReport', () => {
    it('should return reservas report with filters', async () => {
      req.query = { fechaInicio: '2023-01-01', fechaFin: '2023-12-31', cabana: 'cabanaId' };
      
      const mockReservas = [
        { _id: 'reserva1', activo: true, estado: 'Confirmada' },
        { _id: 'reserva2', activo: false, estado: 'Cancelada' }
      ];
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockReservas)
      };
      Reserva.find.mockReturnValue(mockFind);
      Reserva.aggregate.mockResolvedValue([]);

      await reportesController.getReservasReport(req, res);

      expect(Reserva.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          reservas: expect.any(Array),
          estadisticas: expect.any(Object)
        })
      }));
    });

    it('should handle errors in getReservasReport', async () => {
      Reserva.find.mockImplementation(() => { throw new Error('Error'); });
      await reportesController.getReservasReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getInscripcionesReport', () => {
    it('should return inscripciones report', async () => {
      req.query = { evento: 'eventoId' };
      const mockInscripciones = [{ _id: 'ins1' }];
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockInscripciones)
      };
      Inscripcion.find.mockReturnValue(mockFind);
      Inscripcion.aggregate.mockResolvedValue([]);

      await reportesController.getInscripcionesReport(req, res);

      expect(Inscripcion.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          inscripciones: expect.any(Array)
        })
      }));
    });
  });

  describe('getSolicitudesReport', () => {
    it('should return solicitudes report', async () => {
      const mockSolicitudes = [{ _id: 'sol1' }];
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockSolicitudes)
      };
      Solicitud.find.mockReturnValue(mockFind);
      Solicitud.aggregate.mockResolvedValue([]);

      await reportesController.getSolicitudesReport(req, res);

      expect(Solicitud.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          solicitudes: expect.any(Array)
        })
      }));
    });
  });

  describe('getUsuariosReport', () => {
    it('should return usuarios report', async () => {
      const mockUsuarios = [{ _id: 'user1' }];
      const mockFind = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockUsuarios)
      };
      Usuario.find.mockReturnValue(mockFind);
      Usuario.aggregate.mockResolvedValue([]);
      Usuario.countDocuments.mockResolvedValue(5);

      await reportesController.getUsuariosReport(req, res);

      expect(Usuario.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          usuarios: expect.any(Array)
        })
      }));
    });
  });

  describe('getEventosReport', () => {
    it('should return eventos report', async () => {
      const mockEventos = [{ _id: 'evento1', toObject: () => ({ _id: 'evento1' }) }];
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockEventos)
      };
      Evento.find.mockReturnValue(mockFind);
      Inscripcion.countDocuments.mockResolvedValue(2);
      Evento.countDocuments.mockResolvedValue(1);
      Evento.aggregate.mockResolvedValue([]);

      await reportesController.getEventosReport(req, res);

      expect(Evento.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          eventos: expect.any(Array)
        })
      }));
    });
  });

  describe('getReporteFinanciero', () => {
    it('should return financiero report', async () => {
      req.query = { fechaInicio: '2023-01-01', fechaFin: '2023-12-31' };
      Reserva.aggregate.mockResolvedValue([{ totalReservas: 10, ingresoTotal: 1000 }]);
      Inscripcion.aggregate.mockResolvedValue([{ totalInscripciones: 5, ingresoTotal: 500 }]);

      await reportesController.getReporteFinanciero(req, res);

      expect(Reserva.aggregate).toHaveBeenCalled();
      expect(Inscripcion.aggregate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          resumen: expect.objectContaining({
            ingresoTotalConsolidado: 1500
          })
        })
      }));
    });
  });

  describe('getActividadUsuarios', () => {
    it('should return actividad usuarios report', async () => {
      req.query = { usuarioId: 'userId' };
      Usuario.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'userId' }) });
      
      const mockFindReserva = { populate: jest.fn().mockReturnThis(), populate: jest.fn().mockResolvedValue([]) };
      // Need to handle chaining properly for multiple populates
      // Simplified mock for Promise.all
      Reserva.find.mockReturnValue({ populate: jest.fn().mockReturnThis(), populate: jest.fn().mockResolvedValue([]) });
      Inscripcion.find.mockReturnValue({ populate: jest.fn().mockReturnThis(), populate: jest.fn().mockResolvedValue([]) });
      Solicitud.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });

      // Fix mock return values to be thenable for Promise.all
      Reserva.find.mockImplementation(() => ({
        populate: jest.fn().mockReturnThis(),
        then: (cb) => cb([]) 
      }));
      // Actually Promise.all expects promises.
      Reserva.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
        then: (resolve) => resolve([])
      });
      Inscripcion.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
        then: (resolve) => resolve([])
      });
      Solicitud.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue([])
      });

      await reportesController.getActividadUsuarios(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });
  });

  describe('guardarReporte', () => {
    it('should save a report', async () => {
      req.body = { nombre: 'Test Report', descripcion: 'Desc', tipo: 'reservas', filtros: {} };
      Reserva.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      });
      Reporte.prototype.save = jest.fn().mockResolvedValue({});

      await reportesController.guardarReporte(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should validate required fields', async () => {
      req.body = {};
      await reportesController.guardarReporte(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getReportesGuardados', () => {
    it('should return saved reports', async () => {
      const mockReportes = [{ _id: 'rep1' }];
      Reporte.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockReportes)
      });

      await reportesController.getReportesGuardados(req, res);

      expect(res.json).toHaveBeenCalledWith(mockReportes);
    });
  });

  describe('editarReporteGuardado', () => {
    it('should update a saved report', async () => {
      req.params = { id: 'rep1' };
      req.body = { nombre: 'Updated' };
      Reporte.findOneAndUpdate.mockResolvedValue({ _id: 'rep1', nombre: 'Updated' });

      await reportesController.editarReporteGuardado(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('eliminarReporteGuardado', () => {
    it('should delete a saved report', async () => {
      req.params = { id: 'rep1' };
      Reporte.findByIdAndDelete.mockResolvedValue({ _id: 'rep1' });

      await reportesController.eliminarReporteGuardado(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });
  });

  describe('getTotalGestiones', () => {
    it('should return total gestiones', async () => {
      Usuario.countDocuments.mockResolvedValue(1);
      Reserva.countDocuments.mockResolvedValue(1);
      Inscripcion.countDocuments.mockResolvedValue(1);
      Solicitud.countDocuments.mockResolvedValue(1);
      Evento.countDocuments.mockResolvedValue(1);
      Cabana.countDocuments.mockResolvedValue(1);
      Tarea.countDocuments.mockResolvedValue(1);

      await reportesController.getTotalGestiones(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          totalGestiones: 7
        })
      }));
    });
  });
});
