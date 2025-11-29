const Solicitud = require('../../models/Solicitud');
const Usuario = require('../../models/User');
const solicitudController = require('../../controllers/solicitudController');

jest.mock('../../models/Solicitud');
jest.mock('../../models/User');
jest.mock('../../utils/solicitudUtils');
jest.mock('../../utils/notificationUtils');
jest.mock('express-validator', () => ({
  validationResult: jest.fn(() => ({ isEmpty: () => true, array: () => [] }))
}));

describe('Solicitud Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      userId: 'user-123',
      userRole: 'admin',
      user: { id: 'user-123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('crearSolicitud', () => {
    it('should create solicitud successfully', async () => {
      const mockSolicitud = {
        _id: 'solicitud-123',
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {
        solicitante: 'user-123',
        titulo: 'Test Solicitud',
        correo: 'test@test.com',
        telefono: '123',
        tipoSolicitud: 'General',
        descripcion: 'Test description'
      };

      Solicitud.mockImplementation(() => mockSolicitud);
      Usuario.findById = jest.fn().mockResolvedValue({ role: 'seminarista' });

      await solicitudController.crearSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Solicitud creada exitosamente'
      }));
    });

    it('should return 400 for invalid modeloReferencia', async () => {
      req.body = {
        solicitante: 'user-123',
        tipoSolicitud: 'Inscripción',
        modeloReferencia: 'Invalid'
      };

      await solicitudController.crearSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('obtenerSolicitudes', () => {
    it('should return all solicitudes with pagination', async () => {
      const mockSolicitudes = [
        { _id: '1', titulo: 'Sol 1' },
        { _id: '2', titulo: 'Sol 2' }
      ];

      const { construirFiltros, configurarPaginacion, generarPipelineEstadisticasSolicitudes } = require('../../utils/solicitudUtils');
      construirFiltros.mockReturnValue({});
      configurarPaginacion.mockReturnValue({ skip: 0, limit: 10, page: 1 });
      generarPipelineEstadisticasSolicitudes.mockReturnValue([]);

      Solicitud.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                skip: jest.fn().mockReturnValue({
                  limit: jest.fn().mockResolvedValue(mockSolicitudes)
                })
              })
            })
          })
        })
      });

      Solicitud.countDocuments = jest.fn().mockResolvedValue(2);
      Solicitud.aggregate = jest.fn().mockResolvedValue([{ total: 2 }]);

      await solicitudController.obtenerSolicitudes(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockSolicitudes
      }));
    });
  });

  describe('obtenerSolicitudPorId', () => {
    it('should return solicitud by id', async () => {
      const mockSolicitud = { _id: 'sol-123', titulo: 'Test' };
      req.params.id = 'sol-123';

      Solicitud.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockSolicitud)
          })
        })
      });

      await solicitudController.obtenerSolicitudPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSolicitud
      });
    });

    it('should return 404 if not found', async () => {
      req.params.id = 'nonexistent';

      Solicitud.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
          })
        })
      });

      await solicitudController.obtenerSolicitudPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('actualizarSolicitud', () => {
    it('should update solicitud', async () => {
      const mockSolicitud = { _id: 'sol-123', titulo: 'Updated' };
      req.params.id = 'sol-123';
      req.body = { titulo: 'Updated' };

      Solicitud.findByIdAndUpdate = jest.fn().mockResolvedValue(mockSolicitud);

      await solicitudController.actualizarSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Solicitud actualizada exitosamente',
        data: mockSolicitud
      });
    });

    it('should return 404 if not found', async () => {
      req.params.id = 'nonexistent';
      req.body = { titulo: 'Updated' };

      Solicitud.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await solicitudController.actualizarSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarSolicitud', () => {
    it('should delete solicitud', async () => {
      const mockSolicitud = {
        _id: 'sol-123',
        creadoPor: 'user-123',
        deleteOne: jest.fn().mockResolvedValue(true)
      };

      req.params.id = 'sol-123';

      Solicitud.findById = jest.fn().mockResolvedValue(mockSolicitud);

      await solicitudController.eliminarSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Solicitud eliminada exitosamente'
      });
    });

    it('should return 403 if not authorized', async () => {
      const mockSolicitud = {
        _id: 'sol-123',
        creadoPor: 'other-user'
      };

      req.params.id = 'sol-123';
      req.userRole = 'seminarista';

      Solicitud.findById = jest.fn().mockResolvedValue(mockSolicitud);

      await solicitudController.eliminarSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('categorizarSolicitud', () => {
    it('should categorize solicitud', async () => {
      const mockSolicitud = { _id: 'sol-123', categoria: 'cat-123' };
      req.params.id = 'sol-123';
      req.body = { categoria: 'cat-123' };

      Solicitud.findByIdAndUpdate = jest.fn().mockResolvedValue(mockSolicitud);

      await solicitudController.categorizarSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Solicitud categorizada exitosamente',
        data: mockSolicitud
      });
    });

    it('should return 400 if categoria is missing', async () => {
      req.params.id = 'sol-123';
      req.body = {};

      await solicitudController.categorizarSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('asignarResponsable', () => {
    it('should assign responsable', async () => {
      const mockSolicitud = { _id: 'sol-123', responsableAsignado: 'user-456' };
      req.params.id = 'sol-123';
      req.body = { responsableAsignado: 'user-456' };

      Solicitud.findByIdAndUpdate = jest.fn().mockResolvedValue(mockSolicitud);

      await solicitudController.asignarResponsable(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Responsable asignado exitosamente',
        data: mockSolicitud
      });
    });
  });

  describe('obtenerEstadisticasPorCategoria', () => {
    it('should return statistics by category', async () => {
      const mockStats = [
        { _id: 'cat-1', total: 10, nuevas: 5 },
        { _id: 'cat-2', total: 8, nuevas: 3 }
      ];

      Solicitud.aggregate = jest.fn().mockResolvedValue(mockStats);

      await solicitudController.obtenerEstadisticasPorCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockStats
      });
    });
  });

  describe('obtenerSolicitudesPorUsuario', () => {
    it('should return solicitudes for user', async () => {
      const mockSolicitudes = [{ _id: '1' }, { _id: '2' }];
      req.params.id = 'user-123';

      Solicitud.find = jest.fn().mockResolvedValue(mockSolicitudes);

      await solicitudController.obtenerSolicitudesPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockSolicitudes
      });
    });
  });

  describe('obtenerEstadisticasGenerales', () => {
    it('should return general statistics', async () => {
      Solicitud.countDocuments = jest.fn()
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(30)
        .mockResolvedValueOnce(50)
        .mockResolvedValueOnce(20);

      Solicitud.aggregate = jest.fn().mockResolvedValue([
        { _id: 'Nueva', count: 30 },
        { _id: 'Aprobada', count: 50 }
      ]);

      await solicitudController.obtenerEstadisticasGenerales(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          totalSolicitudes: 100,
          pendientes: 30,
          aprobadas: 50
        })
      }));
    });
  });
});
