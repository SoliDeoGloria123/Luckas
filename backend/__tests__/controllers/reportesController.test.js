const reportesController = require('../../controllers/reportesControllers');
const Reporte = require('../../models/Reportes');
const Usuario = require('../../models/User');
const Reserva = require('../../models/Reservas');
const Inscripcion = require('../../models/Inscripciones');
const Solicitud = require('../../models/Solicitud');
const Evento = require('../../models/Eventos');
const Categorizacion = require('../../models/categorizacion');
const Cabana = require('../../models/Cabana');
const Tarea = require('../../models/Tarea');

jest.mock('../../models/Reportes');
jest.mock('../../models/User');
jest.mock('../../models/Reservas');
jest.mock('../../models/Inscripciones');
jest.mock('../../models/Solicitud');
jest.mock('../../models/Eventos');
jest.mock('../../models/categorizacion');
jest.mock('../../models/Cabana');
jest.mock('../../models/Tarea');
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    Types: {
      ...actualMongoose.Types,
      ObjectId: {
        ...actualMongoose.Types.ObjectId,
        isValid: jest.fn(val => val === '507f1f77bcf86cd799439011')
      }
    }
  };
});

describe('Reportes Controller', () => {
  let req, res;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

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
      Cabana.countDocuments.mockResolvedValue(2);
      Solicitud.countDocuments.mockResolvedValue(4);
      Tarea.countDocuments.mockResolvedValue(6);

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
    });
  });

  describe('getReservasReport', () => {
    it('should return reservas report with filters and stats', async () => {
      req.query = { fechaInicio: '2023-01-01', fechaFin: '2023-12-31', cabana: 'cabanaId' };
      
      const mockReservas = [
        { _id: 'res1', activo: true, estado: 'Confirmada', cabana: { precio: 100 }, fechaInicio: new Date('2023-01-01') },
        { _id: 'res2', activo: false, estado: 'Cancelada', cabana: { precio: 200 }, fechaInicio: new Date('2023-02-01') }
      ];
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockReservas)
      };
      mockFind.populate.mockReturnValue(mockFind);
      mockFind.populate.mockReturnValue(mockFind);

      Reserva.find.mockReturnValue(mockFind);
      Reserva.aggregate.mockResolvedValue([]);

      await reportesController.getReservasReport(req, res);

      expect(Reserva.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          estadisticas: expect.objectContaining({
            total: 2,
            activos: 1,
            inactivos: 1
          })
        })
      }));
    });
  });

  describe('getInscripcionesReport', () => {
    it('should return inscripciones report with stats', async () => {
      req.query = { evento: 'eventoId' };
      const mockInscripciones = [
        { _id: 'ins1', tipoReferencia: 'Eventos', referencia: { name: 'Evento 1' }, createdAt: new Date('2023-01-01') },
        { _id: 'ins2', tipoReferencia: 'ProgramaAcademico', referencia: { nombre: 'Prog 1' }, createdAt: new Date('2023-02-01') }
      ];
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockInscripciones)
      };
      mockFind.populate.mockReturnValue(mockFind);
      mockFind.populate.mockReturnValue(mockFind);
      mockFind.populate.mockReturnValue(mockFind);

      Inscripcion.find.mockReturnValue(mockFind);
      Inscripcion.aggregate.mockResolvedValue([]);

      await reportesController.getInscripcionesReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          estadisticas: expect.objectContaining({
            total: 2
          })
        })
      }));
    });
  });

  describe('guardarReporte', () => {
    it('should save a report with resolved category and user', async () => {
      req.body = {
        nombre: 'Test Report',
        descripcion: 'Desc',
        tipo: 'reservas',
        filtros: { categoria: 'CatName', usuario: 'UserName', fechaInicio: '2023-01-01', fechaFin: '2023-01-31' },
        formatoExportacion: ['pdf']
      };

      Categorizacion.findOne.mockResolvedValue({ _id: 'cat-id', nombre: 'CatName' });
      Usuario.findOne.mockResolvedValue({ _id: 'user-id', username: 'UserName' });
      
      // Mock Reserva.find for generarDatosReporte('reservas')
      const mockReservas = [];
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockReservas)
      };
      mockFind.populate.mockReturnValue(mockFind);
      Reserva.find.mockReturnValue(mockFind);

      // Mock Usuario.findOne for resolverUsuario
      const mockUsuarioQuery = {
        select: jest.fn().mockResolvedValue({ _id: 'user-id', username: 'UserName' })
      };
      Usuario.findOne.mockReturnValue(mockUsuarioQuery);

      // Mock Reporte constructor and save
      const mockSave = jest.fn().mockResolvedValue({});
      Reporte.mockImplementation(() => ({ save: mockSave }));

      await reportesController.guardarReporte(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle ObjectId inputs for category and user', async () => {
      req.body = {
        nombre: 'Test Report',
        descripcion: 'Desc',
        tipo: 'inscripciones',
        filtros: { categoria: '507f1f77bcf86cd799439011', usuario: '507f1f77bcf86cd799439011' }
      };

      Categorizacion.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', nombre: 'CatName' }) });
      Usuario.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', username: 'UserName' }) });

      const mockInscripciones = [];
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockInscripciones)
      };
      mockFind.populate.mockReturnValue(mockFind);
      Inscripcion.find.mockReturnValue(mockFind);

      const mockSave = jest.fn().mockResolvedValue({});
      Reporte.mockImplementation(() => ({ save: mockSave }));

      await reportesController.guardarReporte(req, res);

      expect(mockSave).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe('getActividadUsuarios', () => {
    it('should return actividad usuarios report', async () => {
      req.query = { usuarioId: 'userId' };
      Usuario.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'userId' }) });
      
      const mockFind = { 
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([])
      };
      mockFind.populate.mockReturnValue(mockFind);
      
      // Mocking promises for Promise.all
      Reserva.find.mockReturnValue(mockFind);
      Inscripcion.find.mockReturnValue(mockFind);
      Solicitud.find.mockReturnValue(mockFind);
      // Wait, Promise.all takes promises. .find() returns a Query which is thenable.
      // But we need to make sure populate returns the query object.
      
      await reportesController.getActividadUsuarios(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });
  });

  describe('getSolicitudesReport', () => {
    it('should return solicitudes report with stats', async () => {
      req.query = { estado: 'Pendiente' };
      const mockSolicitudes = [
        { _id: 'sol1', estado: 'Pendiente', tipoSolicitud: 'Tipo1', prioridad: 'Alta', fechaSolicitud: new Date() }
      ];
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockSolicitudes)
      };
      mockFind.populate.mockReturnValue(mockFind);
      mockFind.populate.mockReturnValue(mockFind);

      Solicitud.find.mockReturnValue(mockFind);
      Solicitud.aggregate.mockResolvedValue([]);

      await reportesController.getSolicitudesReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          estadisticas: expect.objectContaining({
            total: 1
          })
        })
      }));
    });
  });

  describe('getUsuariosReport', () => {
    it('should return usuarios report with stats', async () => {
      req.query = { rol: 'admin' };
      const mockUsuarios = [
        { _id: 'u1', roles: ['admin'], active: true, createdAt: new Date() }
      ];
      
      const mockFind = {
        select: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockUsuarios)
      };
      mockFind.select.mockReturnValue(mockFind);

      Usuario.find.mockReturnValue(mockFind);
      Usuario.aggregate.mockResolvedValue([]);
      Usuario.countDocuments.mockResolvedValue(1);

      await reportesController.getUsuariosReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          estadisticas: expect.objectContaining({
            total: 1
          })
        })
      }));
    });
  });

  describe('getEventosReport', () => {
    it('should return eventos report with stats', async () => {
      req.query = { categoria: 'catId' };
      const mockEventos = [
        { _id: 'ev1', active: true, precio: 100, toObject: () => ({ _id: 'ev1' }) }
      ];
      
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockEventos)
      };
      mockFind.populate.mockReturnValue(mockFind);

      Evento.find.mockReturnValue(mockFind);
      Evento.countDocuments.mockResolvedValue(1);
      Evento.aggregate.mockResolvedValue([]);
      Inscripcion.countDocuments.mockResolvedValue(5);

      await reportesController.getEventosReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          eventos: expect.arrayContaining([
            expect.objectContaining({ totalInscripciones: 5 })
          ])
        })
      }));
    });
  });

  describe('getReporteFinanciero', () => {
    it('should return financial report', async () => {
      req.query = { fechaInicio: '2023-01-01', fechaFin: '2023-12-31' };
      
      Reserva.aggregate.mockResolvedValue([{
        totalReservas: 10,
        ingresoTotal: 1000,
        promedioPorReserva: 100
      }]);
      
      Inscripcion.aggregate.mockResolvedValue([{
        totalInscripciones: 5,
        ingresoTotal: 500,
        promedioPorInscripcion: 100
      }]);

      await reportesController.getReporteFinanciero(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          resumen: expect.objectContaining({
            ingresoTotalConsolidado: 1500,
            transaccionesTotales: 15
          })
        })
      }));
    });
  });

  describe('getReportesGuardados', () => {
    it('should return all saved reports', async () => {
      const mockReportes = [{ _id: 'r1', nombre: 'Reporte 1' }];
      const mockFind = {
        populate: jest.fn().mockResolvedValue(mockReportes)
      };
      Reporte.find.mockReturnValue(mockFind);

      await reportesController.getReportesGuardados(req, res);

      expect(res.json).toHaveBeenCalledWith(mockReportes);
    });
  });

  describe('editarReporteGuardado', () => {
    it('should update a saved report', async () => {
      req.params = { id: 'r1' };
      req.body = { nombre: 'Updated Name' };
      
      const mockReporte = { _id: 'r1', nombre: 'Updated Name' };
      Reporte.findOneAndUpdate.mockResolvedValue(mockReporte);

      await reportesController.editarReporteGuardado(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockReporte
      }));
    });

    it('should return 404 if report not found', async () => {
      req.params = { id: 'r1' };
      req.body = { nombre: 'Updated Name' };
      Reporte.findOneAndUpdate.mockResolvedValue(null);

      await reportesController.editarReporteGuardado(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarReporteGuardado', () => {
    it('should delete a saved report', async () => {
      req.params = { id: 'r1' };
      Reporte.findByIdAndDelete.mockResolvedValue({ _id: 'r1' });

      await reportesController.eliminarReporteGuardado(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });

    it('should return 404 if report not found', async () => {
      req.params = { id: 'r1' };
      Reporte.findByIdAndDelete.mockResolvedValue(null);

      await reportesController.eliminarReporteGuardado(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
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
      Reporte.countDocuments.mockResolvedValue(1);

      await reportesController.getTotalGestiones(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });
  });
  describe('Error Handling and Edge Cases', () => {
    it('getReportesGuardados should handle errors', async () => {
      Reporte.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('DB Error'))
      });
      await reportesController.getReportesGuardados(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('guardarReporte should handle errors', async () => {
      req.body = { nombre: 'Test', descripcion: 'Desc', tipo: 'reservas' };
      Reporte.mockImplementation(() => {
        throw new Error('Save Error');
      });
      await reportesController.guardarReporte(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('guardarReporte should validate missing fields', async () => {
      req.body = {};
      await reportesController.guardarReporte(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Faltan campos obligatorios'
      }));
    });

    it('editarReporteGuardado should handle errors', async () => {
      req.params.id = 'id';
      req.body = { nombre: 'Updated' };
      Reporte.findOneAndUpdate.mockRejectedValue(new Error('Update Error'));
      await reportesController.editarReporteGuardado(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('editarReporteGuardado should validate empty body', async () => {
      req.params.id = 'id';
      req.body = {};
      await reportesController.editarReporteGuardado(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('eliminarReporteGuardado should handle errors', async () => {
      req.params.id = 'id';
      Reporte.findByIdAndDelete.mockRejectedValue(new Error('Delete Error'));
      await reportesController.eliminarReporteGuardado(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('getTotalGestiones should handle errors', async () => {
      Usuario.countDocuments.mockRejectedValue(new Error('Count Error'));
      await reportesController.getTotalGestiones(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    describe('Helper Functions Logic', () => {
    it('should resolve category and user by name/email using regex', async () => {
      req.body = {
        nombre: 'Test Regex',
        descripcion: 'Desc',
        tipo: 'reservas',
        filtros: { categoria: 'CatName', usuario: 'test@example.com' }
      };

      // Mock Categorizacion
      Categorizacion.findOne.mockResolvedValue({ _id: 'cat-id-regex', nombre: 'CatName' });

      // Mock Usuario with chaining support for .select()
      const mockUsuarioQuery = {
        select: jest.fn().mockResolvedValue({ _id: 'user-id-regex' })
      };
      Usuario.findOne.mockReturnValue(mockUsuarioQuery);

      // Mock Reserva.find with chaining support
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };
      mockFind.populate.mockReturnValue(mockFind);
      Reserva.find.mockReturnValue(mockFind);

      const mockSave = jest.fn().mockResolvedValue({});
      Reporte.mockImplementation(() => ({ save: mockSave }));

      await reportesController.guardarReporte(req, res);

      expect(Categorizacion.findOne).toHaveBeenCalledWith(expect.objectContaining({
        nombre: expect.anything()
      }));
      expect(Usuario.findOne).toHaveBeenCalledWith(expect.objectContaining({
        $or: expect.arrayContaining([{ email: 'test@example.com' }])
      }));
      expect(mockSave).toHaveBeenCalled();
    });

    it('should handle missing category and user resolution gracefully', async () => {
      req.body = {
        nombre: 'Test Missing',
        descripcion: 'Desc',
        tipo: 'reservas',
        filtros: { categoria: 'UnknownCat', usuario: 'UnknownUser' }
      };

      // Mock Categorizacion
      Categorizacion.findOne.mockResolvedValue(null);
      
      // Mock Usuario with chaining support
      const mockUsuarioQuery = {
        select: jest.fn().mockResolvedValue(null)
      };
      Usuario.findOne.mockReturnValue(mockUsuarioQuery);

      // Mock Reserva.find with chaining support
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };
      mockFind.populate.mockReturnValue(mockFind);
      Reserva.find.mockReturnValue(mockFind);

      const mockSave = jest.fn().mockResolvedValue({});
      Reporte.mockImplementation(() => ({ save: mockSave }));

      await reportesController.guardarReporte(req, res);

      expect(mockSave).toHaveBeenCalled();
    });
  });
});
});
