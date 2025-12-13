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

    it('should return 400 if validation fails (invalid ID)', async () => {
      req.body = { usuario: 'invalid-id' };
      await inscripcionController.crearInscripcion(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });

    it('should return 400 if usuario does not exist', async () => {
      req.body = { usuario: '507f1f77bcf86cd799439011', referencia: '507f1f77bcf86cd799439011', categoria: '507f1f77bcf86cd799439011' };
      Usuario.findById = jest.fn().mockResolvedValue(null);
      await inscripcionController.crearInscripcion(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if duplicate inscription', async () => {
      req.body = { 
        usuario: '507f1f77bcf86cd799439011', 
        referencia: '507f1f77bcf86cd799439011', 
        categoria: '507f1f77bcf86cd799439011',
        tipoReferencia: 'Eventos'
      };
      Usuario.findById = jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });
      Evento.findById = jest.fn().mockResolvedValue({ _id: '507f1f77bcf86cd799439011' });
      Inscripcion.findOne = jest.fn().mockResolvedValue({ _id: 'existing' });
      
      await inscripcionController.crearInscripcion(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('Ya estás inscrito') }));
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
    })
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

    it('should return 400 if validation fails in update', async () => {
      req.body = { usuario: 'invalid-id' };
      await inscripcionController.actualizarInscripcion(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if invalid state transition', async () => {
      req.params.id = 'inscripcion-123';
      req.body = { 
        usuario: '507f1f77bcf86cd799439011', 
        referencia: '507f1f77bcf86cd799439011', 
        categoria: '507f1f77bcf86cd799439011',
        nombre: 'Juan', tipoDocumento: 'CC', numeroDocumento: '123', telefono: '123', edad: 20,
        estado: 'invalid-state' 
      };
      
      Usuario.findById = jest.fn().mockResolvedValue({});
      Evento.findById = jest.fn().mockResolvedValue({});
      Categorizacion.findById = jest.fn().mockResolvedValue({});
      Inscripcion.findById = jest.fn().mockResolvedValue({ tipoReferencia: 'Eventos' });

      await inscripcionController.actualizarInscripcion(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: expect.stringContaining('estado debe ser') }));
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

    it('should handle error when fetching statistics', async () => {
      Inscripcion.countDocuments = jest.fn().mockRejectedValue(new Error('Database error'));

      await inscripcionController.obtenerEstadisticasInscripciones(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al obtener estadísticas de inscripciones'
      });
    });
  });

  describe('crearInscripcion - Additional Coverage', () => {
    it('should handle error when creating inscripcion in database', async () => {
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockEvento = { _id: 'evento-123', nombre: 'Evento Test' };
      const mockCategoria = { _id: 'cat-123', nombre: 'Cat Test' };

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
      Inscripcion.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database save error'))
      }));

      await inscripcionController.crearInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Error al crear inscripción')
      }));
    });

    it('should handle internal error in crearInscripcion', async () => {
      req.body = {
        usuario: 'user-123',
        referencia: 'evento-123',
        tipoReferencia: 'Eventos',
        categoria: 'cat-123'
      };

      Usuario.findById = jest.fn().mockRejectedValue(new Error('Internal error'));

      await inscripcionController.crearInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: expect.stringContaining('Error interno')
      }));
    });

    it('should create inscripcion for ProgramaAcademico', async () => {
      const ProgramaAcademico = require('../../models/ProgramaAcademico');
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockPrograma = { 
        _id: 'programa-123', 
        nombre: 'Programa Test',
        cuposDisponibles: 10,
        save: jest.fn().mockResolvedValue(true)
      };
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
        referencia: 'programa-123',
        tipoReferencia: 'ProgramaAcademico',
        categoria: 'cat-123',
        nombre: 'Juan',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123',
        telefono: '123',
        edad: 25
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      ProgramaAcademico.findById = jest.fn().mockResolvedValue(mockPrograma);
      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Inscripcion.findOne = jest.fn().mockResolvedValue(null);
      Inscripcion.mockImplementation(() => mockInscripcion);
      Solicitud.mockImplementation(() => mockSolicitud);

      await inscripcionController.crearInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockPrograma.save).toHaveBeenCalled();
    });

    it('should handle no cupos disponibles for ProgramaAcademico', async () => {
      const ProgramaAcademico = require('../../models/ProgramaAcademico');
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockPrograma = { 
        _id: 'programa-123', 
        nombre: 'Programa Test',
        cuposDisponibles: 0
      };
      const mockCategoria = { _id: 'cat-123', nombre: 'Cat Test' };

      req.body = {
        usuario: 'user-123',
        referencia: 'programa-123',
        tipoReferencia: 'ProgramaAcademico',
        categoria: 'cat-123',
        nombre: 'Juan',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123',
        telefono: '123',
        edad: 25
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      ProgramaAcademico.findById = jest.fn().mockResolvedValue(mockPrograma);
      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Inscripcion.findOne = jest.fn().mockResolvedValue(null);

      await inscripcionController.crearInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('No hay cupos disponibles')
      }));
    });
  });

  describe('obtenerInscripciones - Additional Coverage', () => {
    it('should filter by user for externo role', async () => {
      req.userRole = 'externo';
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

    it('should handle error when fetching inscripciones', async () => {
      Inscripcion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockRejectedValue(new Error('Database error'))
            })
          })
        })
      });

      await inscripcionController.obtenerInscripciones(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });

  describe('obtenerMisInscripciones', () => {
    it('should return inscripciones for current user', async () => {
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

      await inscripcionController.obtenerMisInscripciones(req, res);

      expect(Inscripcion.find).toHaveBeenCalledWith({ usuario: 'user-123' });
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockInscripciones
      });
    });

    it('should handle error when fetching mis inscripciones', async () => {
      Inscripcion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockRejectedValue(new Error('Database error'))
            })
          })
        })
      });

      await inscripcionController.obtenerMisInscripciones(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });

  describe('obtenerDatosParaInscripcion', () => {
    it('should return data for creating inscripcion', async () => {
      const mockUsuarios = [{ _id: 'user-1', nombre: 'Juan', apellido: 'Perez', correo: 'juan@test.com' }];
      const mockEventos = [{ _id: 'evento-1', nombre: 'Evento 1', fecha: new Date() }];
      const mockCategorias = [{ _id: 'cat-1', nombre: 'Categoria 1', codigo: 'CAT1' }];

      Usuario.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockUsuarios)
      });
      Evento.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockEventos)
      });
      Categorizacion.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue(mockCategorias)
      });

      await inscripcionController.obtenerDatosParaInscripcion(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: expect.objectContaining({
          usuarios: mockUsuarios,
          eventos: mockEventos,
          categorias: mockCategorias,
          ejemplo: expect.any(Object)
        })
      });
    });

    it('should handle error when fetching datos para inscripcion', async () => {
      Usuario.find = jest.fn().mockReturnValue({
        limit: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await inscripcionController.obtenerDatosParaInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });

  describe('obtenerInscripcionPorId - Additional Coverage', () => {
    it('should handle error when fetching inscripcion by id', async () => {
      req.params.id = 'inscripcion-123';

      Inscripcion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockRejectedValue(new Error('Database error'))
          })
        })
      });

      await inscripcionController.obtenerInscripcionPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });

  describe('actualizarInscripcion - Additional Coverage', () => {
    it('should return 404 if inscripcion not found before update', async () => {
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockEvento = { _id: 'evento-123', nombre: 'Evento Test' };
      const mockCategoria = { _id: 'cat-123' };

      req.params.id = 'nonexistent-id';
      req.body = {
        usuario: 'user-123',
        referencia: 'evento-123',
        tipoReferencia: 'Eventos',
        categoria: 'cat-123',
        nombre: 'Juan',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123',
        telefono: '123',
        edad: 26
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      Evento.findById = jest.fn().mockResolvedValue(mockEvento);
      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Inscripcion.findById = jest.fn().mockResolvedValue(null);

      await inscripcionController.actualizarInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Inscripción no encontrada'
      });
    });

    it('should handle error during update', async () => {
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockEvento = { _id: 'evento-123', nombre: 'Evento Test' };
      const mockCategoria = { _id: 'cat-123' };
      const mockInscripcionActual = { _id: 'inscripcion-123', tipoReferencia: 'Eventos' };

      req.params.id = 'inscripcion-123';
      req.body = {
        usuario: 'user-123',
        referencia: 'evento-123',
        tipoReferencia: 'Eventos',
        categoria: 'cat-123',
        nombre: 'Juan',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123',
        telefono: '123',
        edad: 26
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      Evento.findById = jest.fn().mockResolvedValue(mockEvento);
      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Inscripcion.findById = jest.fn().mockResolvedValue(mockInscripcionActual);
      Inscripcion.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('Update error'));

      await inscripcionController.actualizarInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: expect.stringContaining('Error al actualizar')
      });
    });

    it('should return 404 if inscripcion not found after update', async () => {
      const mockUsuario = { _id: 'user-123', correo: 'test@test.com', telefono: '123' };
      const mockEvento = { _id: 'evento-123', nombre: 'Evento Test' };
      const mockCategoria = { _id: 'cat-123' };
      const mockInscripcionActual = { _id: 'inscripcion-123', tipoReferencia: 'Eventos' };

      req.params.id = 'inscripcion-123';
      req.body = {
        usuario: 'user-123',
        referencia: 'evento-123',
        tipoReferencia: 'Eventos',
        categoria: 'cat-123',
        nombre: 'Juan',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123',
        telefono: '123',
        edad: 26
      };

      Usuario.findById = jest.fn().mockResolvedValue(mockUsuario);
      Evento.findById = jest.fn().mockResolvedValue(mockEvento);
      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Inscripcion.findById = jest.fn().mockResolvedValue(mockInscripcionActual);
      Inscripcion.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await inscripcionController.actualizarInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Inscripción no encontrada'
      });
    });

    it('should handle general error in actualizarInscripcion', async () => {
      req.params.id = 'inscripcion-123';
      req.body = {
        usuario: 'user-123',
        referencia: 'evento-123',
        categoria: 'cat-123'
      };

      Usuario.findById = jest.fn().mockRejectedValue(new Error('General error'));

      await inscripcionController.actualizarInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'General error'
      });
    });
  });

  describe('eliminarInscripcion - Additional Coverage', () => {
    it('should handle error when deleting inscripcion', async () => {
      req.params.id = 'inscripcion-123';

      Inscripcion.findByIdAndDelete = jest.fn().mockRejectedValue(new Error('Delete error'));

      await inscripcionController.eliminarInscripcion(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Delete error'
      });
    });
  });

  describe('obtenerInscripcionesPorUsuario - Additional Coverage', () => {
    it('should handle error when fetching inscripciones por usuario', async () => {
      req.params.userId = 'user-123';

      Inscripcion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              sort: jest.fn().mockRejectedValue(new Error('Database error'))
            })
          })
        })
      });

      await inscripcionController.obtenerInscripcionesPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Database error'
      });
    });
  });
});
