const reportesController = require('../../controllers/reportesControllers');
const Reserva = require('../../models/Reservas');
const Inscripcion = require('../../models/Inscripciones');
const Solicitud = require('../../models/Solicitud');
const Usuario = require('../../models/User');
const Evento = require('../../models/Eventos');
const Cabana = require('../../models/Cabana');
const Tarea = require('../../models/Tarea');
const Reporte = require('../../models/Reportes');
const Categorizacion = require('../../models/categorizacion');
const mongoose = require('mongoose');

jest.mock('../../models/Reservas');
jest.mock('../../models/Inscripciones');
jest.mock('../../models/Solicitud');
jest.mock('../../models/User');
jest.mock('../../models/Eventos');
jest.mock('../../models/Cabana');
jest.mock('../../models/Tarea');
jest.mock('../../models/Reportes');
jest.mock('../../models/categorizacion');

describe('Reportes Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
      params: {},
      user: { _id: 'user-123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('getDashboardReport', () => {
    it('should return dashboard data', async () => {
      Usuario.countDocuments.mockResolvedValue(10);
      Reserva.countDocuments.mockResolvedValue(5);
      Inscripcion.countDocuments.mockResolvedValue(20);
      Evento.countDocuments.mockResolvedValue(8);
      Cabana.countDocuments.mockResolvedValue(3);
      Solicitud.countDocuments.mockResolvedValue(15);
      Tarea.countDocuments.mockResolvedValue(7);

      await reportesController.getDashboardReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          resumen: expect.objectContaining({
            totalUsuarios: 10,
            totalReservas: 5
          })
        })
      }));
    });

    it('should handle errors', async () => {
      Usuario.countDocuments.mockRejectedValue(new Error('DB Error'));
      await reportesController.getDashboardReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getReservasReport', () => {
    it('should return reservas report with filters', async () => {
      req.query = { fechaInicio: '2023-01-01', fechaFin: '2023-12-31', cabana: 'cab-123' };
      const mockReservas = [
        { _id: '1', activo: true, cabana: 'cab-123' },
        { _id: '2', activo: 'false', cabana: 'cab-123' }
      ];

      Reserva.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockReservas)
            })
          })
        })
      });

      Reserva.aggregate.mockResolvedValue([]);

      await reportesController.getReservasReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          reservas: expect.arrayContaining([
            expect.objectContaining({ activo: true }),
            expect.objectContaining({ activo: false })
          ])
        })
      }));
    });

    it('should handle errors', async () => {
      Reserva.find.mockImplementation(() => { throw new Error('DB Error'); });
      await reportesController.getReservasReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getInscripcionesReport', () => {
    it('should return inscripciones report', async () => {
      req.query = { fechaInicio: '2023-01-01', fechaFin: '2023-12-31' };
      const mockInscripciones = [{ _id: '1' }];

      Inscripcion.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockInscripciones)
              })
            })
          })
        })
      });
      Inscripcion.aggregate.mockResolvedValue([]);

      await reportesController.getInscripcionesReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ inscripciones: mockInscripciones })
      }));
    });

    it('should handle errors', async () => {
      Inscripcion.find.mockImplementation(() => { throw new Error('DB Error'); });
      await reportesController.getInscripcionesReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getSolicitudesReport', () => {
    it('should return solicitudes report', async () => {
      req.query = { estado: 'Nueva' };
      const mockSolicitudes = [{ _id: '1' }];

      Solicitud.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockSolicitudes)
            })
          })
        })
      });
      Solicitud.aggregate.mockResolvedValue([]);

      await reportesController.getSolicitudesReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ solicitudes: mockSolicitudes })
      }));
    });

    it('should handle errors', async () => {
      Solicitud.find.mockImplementation(() => { throw new Error('DB Error'); });
      await reportesController.getSolicitudesReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUsuariosReport', () => {
    it('should return usuarios report', async () => {
      req.query = { rol: 'admin', activo: 'true' };
      const mockUsuarios = [{ _id: '1' }];

      Usuario.find.mockReturnValue({
        select: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockUsuarios)
        })
      });
      Usuario.aggregate.mockResolvedValue([]);
      Usuario.countDocuments.mockResolvedValue(5);

      await reportesController.getUsuariosReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ usuarios: mockUsuarios })
      }));
    });

    it('should handle errors', async () => {
      Usuario.find.mockImplementation(() => { throw new Error('DB Error'); });
      await reportesController.getUsuariosReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getEventosReport', () => {
    it('should return eventos report', async () => {
      req.query = { activo: 'true' };
      const mockEventos = [{ _id: '1', toObject: () => ({ _id: '1' }) }];

      Evento.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockEventos)
        })
      });
      Inscripcion.countDocuments.mockResolvedValue(10);
      Evento.countDocuments.mockResolvedValue(5);
      Evento.aggregate.mockResolvedValue([]);

      await reportesController.getEventosReport(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ eventos: expect.any(Array) })
      }));
    });

    it('should handle errors', async () => {
      Evento.find.mockImplementation(() => { throw new Error('DB Error'); });
      await reportesController.getEventosReport(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getReporteFinanciero', () => {
    it('should return financial report', async () => {
      req.query = { fechaInicio: '2023-01-01', fechaFin: '2023-12-31' };
      
      Reserva.aggregate.mockResolvedValue([{ totalReservas: 10, ingresoTotal: 1000 }]);
      Inscripcion.aggregate.mockResolvedValue([{ totalInscripciones: 5, ingresoTotal: 500 }]);

      await reportesController.getReporteFinanciero(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          resumen: expect.objectContaining({ ingresoTotalConsolidado: 1500 })
        })
      }));
    });

    it('should handle errors', async () => {
      Reserva.aggregate.mockRejectedValue(new Error('DB Error'));
      await reportesController.getReporteFinanciero(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getActividadUsuarios', () => {
    it('should return user activity', async () => {
      req.query = { usuarioId: 'user-123' };
      
      Reserva.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue([]) }) });
      Inscripcion.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockResolvedValue([]) }) });
      Solicitud.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
      Usuario.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user-123' }) });

      await reportesController.getActividadUsuarios(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({ usuario: expect.any(Object) })
      }));
    });

    it('should handle errors', async () => {
      Reserva.find.mockImplementation(() => { throw new Error('DB Error'); });
      await reportesController.getActividadUsuarios(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('guardarReporte', () => {
    it('should save report successfully', async () => {
      req.body = {
        nombre: 'Test Report',
        descripcion: 'Test Desc',
        tipo: 'reservas',
        filtros: { categoria: 'cat-123' }
      };

      Categorizacion.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'cat-123', nombre: 'Cat 1' }) });
      Reserva.find.mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue([])
          })
        })
      });
      Reporte.prototype.save = jest.fn().mockResolvedValue(true);

      await reportesController.guardarReporte(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if required fields missing', async () => {
      req.body = {};
      await reportesController.guardarReporte(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle errors', async () => {
      req.body = { nombre: 'Test', descripcion: 'Desc', tipo: 'reservas' };
      Reporte.prototype.save = jest.fn().mockRejectedValue(new Error('DB Error'));
      await reportesController.guardarReporte(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
    
    it('should resolve user by ID', async () => {
        req.body = {
          nombre: 'Test Report',
          descripcion: 'Test Desc',
          tipo: 'reservas',
          filtros: { usuario: '507f1f77bcf86cd799439011' }
        };
        
        Usuario.findById.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011', username: 'testuser' }) });
        Reserva.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }) });
        Reporte.prototype.save = jest.fn().mockResolvedValue(true);
  
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should resolve user by name', async () => {
        req.body = {
          nombre: 'Test Report',
          descripcion: 'Test Desc',
          tipo: 'reservas',
          filtros: { usuario: 'testuser' }
        };
        
        Usuario.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' }) });
        Reserva.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }) });
        Reporte.prototype.save = jest.fn().mockResolvedValue(true);
  
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });
    
    it('should resolve category by name', async () => {
        req.body = {
          nombre: 'Test Report',
          descripcion: 'Test Desc',
          tipo: 'reservas',
          filtros: { categoria: 'General' }
        };
        
        Categorizacion.findOne.mockResolvedValue({ _id: 'cat-123' });
        Reserva.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }) });
        Reporte.prototype.save = jest.fn().mockResolvedValue(true);
  
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle resolverCategoria with invalid ID', async () => {
        req.body = {
          nombre: 'Test', descripcion: 'Desc', tipo: 'reservas',
          filtros: { categoria: 'invalid-id' }
        };
        mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);
        Categorizacion.findOne.mockResolvedValue(null); // Not found by name either
        
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle resolverUsuario with invalid ID', async () => {
        req.body = {
          nombre: 'Test', descripcion: 'Desc', tipo: 'reservas',
          filtros: { usuario: 'invalid-id' }
        };
        mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);
        Usuario.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) }); // Fix chaining
        
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should generate inscripciones report with different reference types', async () => {
        req.body = {
          nombre: 'Inscripciones Report',
          descripcion: 'Desc',
          tipo: 'inscripciones',
          filtros: { fechaInicio: '2023-01-01', fechaFin: '2023-12-31' }
        };

        const mockInscripciones = [
            { tipoReferencia: 'Eventos', referencia: { name: 'Evento 1' } },
            { tipoReferencia: 'ProgramaAcademico', referencia: { nombre: 'Programa 1' } },
            { tipoReferencia: 'Otro', referencia: { nombre: 'Otro 1' } },
            { tipoReferencia: 'Eventos', referencia: null } // Missing reference
        ];

        Inscripcion.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    populate: jest.fn().mockReturnValue({
                        sort: jest.fn().mockResolvedValue(mockInscripciones)
                    })
                })
            })
        });

        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    });

    it('should handle unsupported report type', async () => {
        req.body = {
            nombre: 'Test', descripcion: 'Desc', tipo: 'unsupported'
        };
        await reportesController.guardarReporte(req, res);
        // Should save with empty data or error state
        expect(res.status).toHaveBeenCalledWith(201); 
    });
  });

  describe('getTotalGestiones', () => {
    it('should return total gestiones', async () => {
      Usuario.countDocuments.mockResolvedValue(10);
      Reserva.countDocuments.mockResolvedValue(5);
      Inscripcion.countDocuments.mockResolvedValue(20);
      Solicitud.countDocuments.mockResolvedValue(15);
      Evento.countDocuments.mockResolvedValue(8);
      Cabana.countDocuments.mockResolvedValue(3);
      Tarea.countDocuments.mockResolvedValue(7);
      Reporte.countDocuments.mockResolvedValue(2);

      await reportesController.getTotalGestiones(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          totalUsuarios: 10,
          totalReservas: 5
        })
      }));
    });

    it('should handle errors', async () => {
      Usuario.countDocuments.mockRejectedValue(new Error('DB Error'));
      await reportesController.getTotalGestiones(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('Helper Functions Coverage', () => {
      it('should resolve category by regex name', async () => {
        req.body = {
          nombre: 'Test Report',
          descripcion: 'Test Desc',
          tipo: 'reservas',
          filtros: { categoria: 'General' }
        };
        
        mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);
        Categorizacion.findOne.mockResolvedValue({ _id: 'cat-123' }); // Found by regex
        Reserva.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }) });
        Reporte.prototype.save = jest.fn().mockResolvedValue(true);
  
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
      });

      it('should resolve user by username/email', async () => {
        req.body = {
          nombre: 'Test Report',
          descripcion: 'Test Desc',
          tipo: 'reservas',
          filtros: { usuario: 'test@test.com' }
        };
        
        mongoose.Types.ObjectId.isValid = jest.fn().mockReturnValue(false);
        Usuario.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue({ _id: 'user-123' }) }); // Fix chaining
        Reserva.find.mockReturnValue({ populate: jest.fn().mockReturnValue({ populate: jest.fn().mockReturnValue({ sort: jest.fn().mockResolvedValue([]) }) }) });
        Reporte.prototype.save = jest.fn().mockResolvedValue(true);
  
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
      });
      
      it('should generate stats with data', async () => {
         // Test with data to trigger loops in generarEstadisticasPorEstado/Mes
         req.body = {
          nombre: 'Stats Report',
          descripcion: 'Desc',
          tipo: 'reservas',
          filtros: { fechaInicio: '2023-01-01', fechaFin: '2023-12-31' }
        };
        
        const mockReservas = [
            { _id: '1', activo: true, estado: 'Confirmada', fechaInicio: new Date('2023-01-15') },
            { _id: '2', activo: false, estado: 'Pendiente', fechaInicio: new Date('2023-02-20') }
        ];

        Reserva.find.mockReturnValue({
            populate: jest.fn().mockReturnValue({
                populate: jest.fn().mockReturnValue({
                    sort: jest.fn().mockResolvedValue(mockReservas)
                })
            })
        });
        
        await reportesController.guardarReporte(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
      });
  });

  describe('editarReporteGuardado', () => {
    it('should update report', async () => {
      req.params.id = 'rep-123';
      req.body = { nombre: 'Updated' };
      Reporte.findOneAndUpdate.mockResolvedValue({ _id: 'rep-123' });

      await reportesController.editarReporteGuardado(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 400 if no data provided', async () => {
      req.params.id = 'rep-123';
      req.body = {};
      await reportesController.editarReporteGuardado(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if not found', async () => {
      req.params.id = 'rep-123';
      req.body = { nombre: 'Updated' };
      Reporte.findOneAndUpdate.mockResolvedValue(null);
      await reportesController.editarReporteGuardado(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarReporteGuardado', () => {
    it('should delete report', async () => {
      req.params.id = 'rep-123';
      Reporte.findByIdAndDelete.mockResolvedValue({ _id: 'rep-123' });

      await reportesController.eliminarReporteGuardado(req, res);

      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 404 if not found', async () => {
      req.params.id = 'rep-123';
      Reporte.findByIdAndDelete.mockResolvedValue(null);
      await reportesController.eliminarReporteGuardado(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
  
  describe('getReportesGuardados', () => {
      it('should return saved reports', async () => {
          Reporte.find.mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
          await reportesController.getReportesGuardados(req, res);
          expect(res.json).toHaveBeenCalledWith([]);
      });
      
      it('should handle errors', async () => {
          Reporte.find.mockImplementation(() => { throw new Error('DB Error'); });
          await reportesController.getReportesGuardados(req, res);
          expect(res.status).toHaveBeenCalledWith(500);
      });
  });
});
