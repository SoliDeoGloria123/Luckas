const User = require('../../models/User');
const ProgramaAcademico = require('../../models/ProgramaAcademico');
const Inscripcion = require('../../models/Inscripciones');
const certificadoController = require('../../controllers/certificadoControllers');

jest.mock('../../models/User');
jest.mock('../../models/ProgramaAcademico');
jest.mock('../../models/Inscripciones');
jest.mock('pdfkit');

describe('Certificado Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      writeHead: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('generarCertificado', () => {
    it('should return 400 if userId or cursoId is missing', async () => {
      req.body = { userId: 'user-123' };

      await certificadoController.generarCertificado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Se requieren userId y cursoId'
      }));
    });

    it('should return 400 if invalid ObjectId', async () => {
      req.body = {
        userId: 'invalid-id',
        cursoId: 'invalid-id'
      };

      await certificadoController.generarCertificado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false
      }));
    });

    it('should return 400 if no valid inscripcion', async () => {
      req.body = {
        userId: '507f1f77bcf86cd799439011',
        cursoId: '507f1f77bcf86cd799439012'
      };

      Inscripcion.findOne = jest.fn().mockResolvedValue(null);

      await certificadoController.generarCertificado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'El usuario no tiene una inscripción válida.'
      }));
    });

    it('should return 400 if not ProgramaAcademico', async () => {
      req.body = {
        userId: '507f1f77bcf86cd799439011',
        cursoId: '507f1f77bcf86cd799439012'
      };

      Inscripcion.findOne = jest.fn().mockResolvedValue({
        tipoReferencia: 'Eventos'
      });

      await certificadoController.generarCertificado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Solo se generan certificados para programas académicos.'
      }));
    });

    it('should return 404 if usuario not found', async () => {
      req.body = {
        userId: '507f1f77bcf86cd799439011',
        cursoId: '507f1f77bcf86cd799439012'
      };

      Inscripcion.findOne = jest.fn().mockResolvedValue({
        tipoReferencia: 'ProgramaAcademico'
      });
      User.findById = jest.fn().mockResolvedValue(null);

      await certificadoController.generarCertificado(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 404 if curso not found', async () => {
      req.body = {
        userId: '507f1f77bcf86cd799439011',
        cursoId: '507f1f77bcf86cd799439012'
      };

      Inscripcion.findOne = jest.fn().mockResolvedValue({
        tipoReferencia: 'ProgramaAcademico'
      });
      User.findById = jest.fn().mockResolvedValue({
        _id: 'user-123',
        nombre: 'Juan',
        apellido: 'Pérez',
        numeroDocumento: '123456'
      });
      ProgramaAcademico.findById = jest.fn().mockResolvedValue(null);

      await certificadoController.generarCertificado(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerEstadisticasCertificados', () => {
    it('should return certificate statistics', async () => {
      Inscripcion.countDocuments = jest.fn()
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(50)  // certificados emitidos
        .mockResolvedValueOnce(5);  // descargas hoy

      await certificadoController.obtenerEstadisticasCertificados(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        totalInscripciones: 100,
        certificadosEmitidos: 50,
        descargasHoy: 5,
        listosParaDescarga: 50
      });
    });

    it('should handle errors', async () => {
      Inscripcion.countDocuments = jest.fn().mockRejectedValue(new Error('DB Error'));

      await certificadoController.obtenerEstadisticasCertificados(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
