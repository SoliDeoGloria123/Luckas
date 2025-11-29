const Inscripcion = require('../../models/Inscripciones');
const Solicitud = require('../../models/Solicitud');
const Evento = require('../../models/Eventos');
const Usuario = require('../../models/User');
const Categorizacion = require('../../models/categorizacion');
const inscripcionController = require('../../controllers/inscripcionController');

jest.mock('../../models/Inscripciones');
jest.mock('../../models/Solicitud');
jest.mock('../../models/Eventos');
jest.mock('../../models/User');
jest.mock('../../models/categorizacion');
jest.mock('../../models/ProgramaAcademico');
jest.mock('../../utils/notificationUtils');

describe('Inscripcion Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      userId: 'user-123',
      userRole: 'admin'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('crearInscripcion', () => {
    it('should create inscripcion successfully', async () => {
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockEvento = { _id: 'evento-123', nombre: 'Evento Test' };
      const mockCategoria = { _id: 'cat-123', nombre: 'Cat Test' };
      const mockInscripcion = {
        _id: 'inscripcion-123',
        save: jest.fn().mockResolvedValue(true)
      };
      const mockSolicitud = {
        _id: 'solicitud-123',
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {
        usuario: 'user-123',
        referencia: 'evento-123',
        tipoReferencia: 'Eventos',
        categoria: 'cat-123',
        nombre: 'Juan',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123',
        telefono: '123',
        edad: 25
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      Evento.findById = jest.fn().mockResolvedValue(mockEvento);
      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Inscripcion.findOne = jest.fn().mockResolvedValue(null);
      Inscripcion.mockImplementation(() => mockInscripcion);
      Solicitud.mockImplementation(() => mockSolicitud);

      await inscripcionController.crearInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {
        usuario: 'user-123'
      };

      await inscripcionController.crearInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });
  });

  describe('obtenerInscripciones', () => {
    it('should return all inscripciones', async () => {
      const mockInscripciones = [
        { _id: '1', nombre: 'Test 1' },
        { _id: '2', nombre: 'Test 2' }
      ];

      Inscripcion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockInscripciones)
            })
          })
        })
      });

      await inscripcionController.obtenerInscripciones(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInscripciones
      });
    });

    it('should filter by user for seminarista role', async () => {
      req.userRole = 'seminarista';
      const mockInscripciones = [{ _id: '1' }];

      Inscripcion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockInscripciones)
            })
          })
        })
      });

      await inscripcionController.obtenerInscripciones(req, res);

      expect(Inscripcion.find).toHaveBeenCalledWith({ usuario: 'user-123' });
    });
  });

  describe('obtenerInscripcionPorId', () => {
    it('should return inscripcion by id', async () => {
      const mockInscripcion = { _id: 'inscripcion-123' };
      req.params.id = 'inscripcion-123';

      Inscripcion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(mockInscripcion)
          })
        })
      });

      await inscripcionController.obtenerInscripcionPorId(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInscripcion
      });
    });

    it('should return 404 if not found', async () => {
      req.params.id = 'nonexistent';

      Inscripcion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockResolvedValue(null)
          })
        })
      });

      await inscripcionController.obtenerInscripcionPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('actualizarInscripcion', () => {
    it('should update inscripcion', async () => {
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockEvento = { _id: 'evento-123', nombre: 'Evento Test' };
      const mockCategoria = { _id: 'cat-123' };
      const mockInscripcionActual = { _id: 'inscripcion-123', tipoReferencia: 'Eventos' };
      const mockInscripcion = { _id: 'inscripcion-123', solicitud: 'solicitud-123' };

      req.params.id = 'inscripcion-123';
      req.body = {
        usuario: 'user-123',
        referencia: 'evento-123',
        tipoReferencia: 'Eventos',
        categoria: 'cat-123',
        nombre: 'Juan Updated',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123',
        telefono: '123',
        edad: 26
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      Evento.findById = jest.fn().mockResolvedValue(mockEvento);
      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Inscripcion.findById = jest.fn().mockResolvedValue(mockInscripcionActual);
      Inscripcion.findByIdAndUpdate = jest.fn().mockResolvedValue(mockInscripcion);
      Solicitud.findByIdAndUpdate = jest.fn().mockResolvedValue({});

      await inscripcionController.actualizarInscripcion(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInscripcion
      });
    });
  });

  describe('eliminarInscripcion', () => {
    it('should delete inscripcion', async () => {
      req.params.id = 'inscripcion-123';

      Inscripcion.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: 'inscripcion-123'
      });

      await inscripcionController.eliminarInscripcion(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Inscripción eliminada'
      });
    });

    it('should return 404 if not found', async () => {
      req.params.id = 'nonexistent';

      Inscripcion.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await inscripcionController.eliminarInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerInscripcionesPorUsuario', () => {
    it('should return inscripciones for user', async () => {
      const mockInscripciones = [{ _id: '1' }, { _id: '2' }];
      req.params.userId = 'user-123';

      Inscripcion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockResolvedValue(mockInscripciones)
            })
          })
        })
      });

      await inscripcionController.obtenerInscripcionesPorUsuario(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInscripciones
      });
    });

    it('should return 400 if userId is missing', async () => {
      req.params = {};

      await inscripcionController.obtenerInscripcionesPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('obtenerEstadisticasInscripciones', () => {
    it('should return statistics', async () => {
      Inscripcion.countDocuments = jest.fn()
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(10)  // nuevas esta semana
        .mockResolvedValueOnce(50)  // aprobadas
        .mockResolvedValueOnce(30); // pendientes

      await inscripcionController.obtenerEstadisticasInscripciones(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalInscripciones: 100,
          nuevasEstaSemana: 10,
          aprobadas: 50,
          pendientes: 30
        }
      });
    });
  });
});
