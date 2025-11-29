const Categorizacion = require('../../models/categorizacion');
const Solicitud = require('../../models/Solicitud');
const Eventos = require('../../models/Eventos');
const Cabana = require('../../models/Cabana');
const ProgramaAcademico = require('../../models/ProgramaAcademico');
const Inscripcion = require('../../models/Inscripciones');
const categorizacionController = require('../../controllers/categorizacionController');
const mongoose = require('mongoose');

jest.mock('../../models/categorizacion');
jest.mock('../../models/Solicitud');
jest.mock('../../models/Eventos');
jest.mock('../../models/Cabana');
jest.mock('../../models/ProgramaAcademico');
jest.mock('../../models/Inscripciones');

jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    Types: {
      ...actualMongoose.Types,
      ObjectId: {
        ...actualMongoose.Types.ObjectId,
        isValid: jest.fn().mockReturnValue(true),
        createFromHexString: jest.fn().mockReturnValue('507f1f77bcf86cd799439011')
      }
    }
  };
});

describe('Categorizacion Controller', () => {
  let req, res;

  beforeAll(() => {
    console.log('DEBUG TEST: mongoose.Types.ObjectId', mongoose.Types.ObjectId);
    console.log('DEBUG TEST: createFromHexString', mongoose.Types.ObjectId.createFromHexString);
    if (!mongoose.Types.ObjectId.createFromHexString) {
      mongoose.Types.ObjectId.createFromHexString = jest.fn().mockReturnValue('507f1f77bcf86cd799439011');
    }
  });

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      userId: 'user-123',
      usuario: { id: 'user-123' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('crearCategoria', () => {
    it('should create categoria successfully', async () => {
      const mockCategoria = {
        _id: 'cat-123',
        nombre: 'Test Category',
        codigo: 'TEST',
        tipo: 'general',
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {
        nombre: 'Test Category',
        codigo: 'test',
        tipo: 'general'
      };

      Categorizacion.findOne = jest.fn().mockResolvedValue(null);
      Categorizacion.mockImplementation(() => mockCategoria);

      await categorizacionController.crearCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Categoría creada exitosamente'
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      req.body = {
        nombre: 'Test'
      };

      await categorizacionController.crearCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    it('should return 400 if codigo already exists', async () => {
      req.body = {
        nombre: 'Test Category',
        codigo: 'TEST',
        tipo: 'general'
      };

      Categorizacion.findOne = jest.fn().mockResolvedValue({ codigo: 'TEST' });

      await categorizacionController.crearCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Ya existe una categoría con ese código'
      }));
    });
  });

  describe('obtenerCategorias', () => {
    it('should return all categorias', async () => {
      const mockCategorias = [
        { _id: '1', nombre: 'Cat 1' },
        { _id: '2', nombre: 'Cat 2' }
      ];

      Categorizacion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockCategorias)
        })
      });

      await categorizacionController.obtenerCategorias(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategorias,
        total: 2
      });
    });

    it('should filter by activo status', async () => {
      req.query.activo = 'true';
      const mockCategorias = [{ _id: '1', activo: true }];

      Categorizacion.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockCategorias)
        })
      });

      await categorizacionController.obtenerCategorias(req, res);

      expect(Categorizacion.find).toHaveBeenCalledWith({ activo: true });
    });
  });

  describe('obtenerCategoriaPorId', () => {
    it('should return categoria by id', async () => {
      const mockCategoria = { _id: 'cat-123', nombre: 'Test' };
      req.params.id = 'cat-123';

      Categorizacion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockCategoria)
      });

      await categorizacionController.obtenerCategoriaPorId(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockCategoria
      });
    });

    it('should return 404 if not found', async () => {
      req.params.id = 'nonexistent';

      Categorizacion.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(null)
      });

      await categorizacionController.obtenerCategoriaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('actualizarCategoria', () => {
    it('should update categoria', async () => {
      const mockCategoria = { _id: 'cat-123', nombre: 'Updated' };
      req.params.id = '507f1f77bcf86cd799439011';
      req.body = { nombre: 'Updated' };

      Categorizacion.findOne = jest.fn().mockResolvedValue(null);
      Categorizacion.findByIdAndUpdate = jest.fn().mockResolvedValue(mockCategoria);

      await categorizacionController.actualizarCategoria(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Categoría actualizada exitosamente',
        data: mockCategoria
      });
    });

    it('should return 400 for invalid ID', async () => {
      req.params.id = 'invalid-id';
      req.body = { nombre: 'Updated' };
      
      const mongoose = require('mongoose');
      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);

      await categorizacionController.actualizarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('eliminarCategoria', () => {
    it('should delete categoria', async () => {
      req.params.id = 'cat-123';

      Solicitud.countDocuments = jest.fn().mockResolvedValue(0);
      Categorizacion.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: 'cat-123'
      });

      await categorizacionController.eliminarCategoria(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Categoría eliminada exitosamente'
      });
    });

    it('should return 400 if has associated solicitudes', async () => {
      req.params.id = 'cat-123';

      Solicitud.countDocuments = jest.fn().mockResolvedValue(5);

      await categorizacionController.eliminarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('5 solicitudes asociadas')
      }));
    });
  });

  describe('categorizarSolicitud', () => {
    it('should categorize solicitud', async () => {
      const mockCategoria = { _id: 'cat-123', nombre: 'Test', tipo: 'general', codigo: 'TEST' };
      const mockSolicitud = { _id: 'sol-123' };
      const mockSolicitudActualizada = { _id: 'sol-123', categoria: mockCategoria };

      req.params.id = 'sol-123';
      req.body = { categoriaId: 'cat-123' };

      Categorizacion.findById = jest.fn().mockResolvedValue(mockCategoria);
      Solicitud.findById = jest.fn().mockResolvedValue(mockSolicitud);
      Solicitud.findByIdAndUpdate = jest.fn().mockResolvedValue(mockSolicitudActualizada);

      await categorizacionController.categorizarSolicitud(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Solicitud categorizada exitosamente',
        data: mockSolicitudActualizada
      });
    });

    it('should return 404 if categoria not found', async () => {
      req.params.id = 'sol-123';
      req.body = { categoriaId: 'cat-123' };

      Categorizacion.findById = jest.fn().mockResolvedValue(null);

      await categorizacionController.categorizarSolicitud(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('activarDesactivarCategoria', () => {
    it('should activate categoria', async () => {
      const mockCategoria = { _id: 'cat-123', estado: 'activo' };
      req.params.id = 'cat-123';
      req.body = { estado: 'activo' };

      Categorizacion.findByIdAndUpdate = jest.fn().mockResolvedValue(mockCategoria);

      await categorizacionController.activarDesactivarCategoria(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Categoría actualizada a activo',
        data: mockCategoria
      });
    });

    it('should return 400 for invalid estado', async () => {
      req.params.id = 'cat-123';
      req.body = { estado: 'invalid' };

      await categorizacionController.activarDesactivarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if has associations when deactivating', async () => {
      req.params.id = 'cat-123';
      req.body = { estado: 'inactivo' };

      Solicitud.countDocuments = jest.fn().mockResolvedValue(5);
      Eventos.countDocuments = jest.fn().mockResolvedValue(0);
      Cabana.countDocuments = jest.fn().mockResolvedValue(0);
      ProgramaAcademico.countDocuments = jest.fn().mockResolvedValue(0);
      Inscripcion.countDocuments = jest.fn().mockResolvedValue(0);

      await categorizacionController.activarDesactivarCategoria(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('estadisticasCategorias', () => {
    it('should return statistics', async () => {
      Categorizacion.countDocuments = jest.fn()
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80)  // activo
        .mockResolvedValueOnce(20)  // inactivo
        .mockResolvedValueOnce(15); // nuevas este mes

      await categorizacionController.estadisticasCategorias(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        stats: {
          totalCategorias: 100,
          categoriasActivas: 80,
          categoriasInactivas: 20,
          nuevasEsteMes: 15
        }
      });
    });
  });
});
