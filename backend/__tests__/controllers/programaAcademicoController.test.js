const ProgramaAcademico = require('../../models/ProgramaAcademico');
const programaController = require('../../controllers/programaAcademicoController');

jest.mock('../../models/ProgramaAcademico');

describe('Programa Academico Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('crearProgramaAcademico', () => {
    it('should create a programa academico successfully', async () => {
      const mockPrograma = {
        _id: 'programa-123',
        nombre: 'Programa Test',
        tipo: 'curso',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {
        nombre: 'Programa Test',
        tipo: 'curso',
        descripcion: 'Test desc',
        categoria: 'cat-123',
        modalidad: 'presencial',
        duracion: '6 meses',
        precio: 1000,
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31',
        cuposDisponibles: 30
      };

      ProgramaAcademico.mockImplementation(() => mockPrograma);

      await programaController.crearProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Programa académico creado exitosamente',
        data: mockPrograma
      });
    });

    it('should return 400 if fechaFin is before fechaInicio', async () => {
      req.body = {
        nombre: 'Test',
        fechaInicio: '2024-12-31',
        fechaFin: '2024-01-01'
      };

      await programaController.crearProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'La fecha de fin debe ser posterior a la fecha de inicio'
      });
    });

    it('should handle errors', async () => {
      req.body = {
        nombre: 'Test',
        fechaInicio: '2024-01-01',
        fechaFin: '2024-12-31'
      };

      ProgramaAcademico.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB Error'))
      }));

      await programaController.crearProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('obtenerProgramasAcademicos', () => {
    it('should return all programas academicos', async () => {
      const mockProgramas = [
        { _id: '1', nombre: 'Programa 1' },
        { _id: '2', nombre: 'Programa 2' }
      ];

      ProgramaAcademico.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue(mockProgramas)
        })
      });

      await programaController.obtenerProgramasAcademicos(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockProgramas
      });
    });

    it('should handle errors', async () => {
      ProgramaAcademico.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          sort: jest.fn().mockRejectedValue(new Error('DB Error'))
        })
      });

      await programaController.obtenerProgramasAcademicos(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('obtenerProgramaAcademicoPorId', () => {
    it('should return a programa by id', async () => {
      const mockPrograma = { _id: 'programa-123', nombre: 'Programa Test' };
      req.params.id = 'programa-123';

      ProgramaAcademico.findById = jest.fn().mockResolvedValue(mockPrograma);

      await programaController.obtenerProgramaAcademicoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockPrograma
      });
    });

    it('should return 404 if programa not found', async () => {
      req.params.id = 'nonexistent';

      ProgramaAcademico.findById = jest.fn().mockResolvedValue(null);

      await programaController.obtenerProgramaAcademicoPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Programa académico no encontrado'
      });
    });
  });

  describe('actualizarProgramaAcademico', () => {
    it('should update a programa academico', async () => {
      const mockPrograma = {
        _id: 'programa-123',
        nombre: 'Updated Programa'
      };

      req.params.id = 'programa-123';
      req.body = { nombre: 'Updated Programa' };

      ProgramaAcademico.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPrograma);

      await programaController.actualizarProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Programa académico actualizado',
        data: mockPrograma
      });
    });

    it('should return 400 if fechaFin is before fechaInicio', async () => {
      req.params.id = 'programa-123';
      req.body = {
        fechaInicio: '2024-12-31',
        fechaFin: '2024-01-01'
      };

      await programaController.actualizarProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if programa not found', async () => {
      req.params.id = 'nonexistent';
      req.body = { nombre: 'Test' };

      ProgramaAcademico.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await programaController.actualizarProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarProgramaAcademico', () => {
    it('should delete a programa academico', async () => {
      req.params.id = 'programa-123';

      ProgramaAcademico.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: 'programa-123'
      });

      await programaController.eliminarProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Programa académico eliminado'
      });
    });

    it('should return 404 if programa not found', async () => {
      req.params.id = 'nonexistent';

      ProgramaAcademico.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await programaController.eliminarProgramaAcademico(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerEstadisticasProgramas', () => {
    it('should return programas statistics', async () => {
      ProgramaAcademico.countDocuments = jest.fn()
        .mockResolvedValueOnce(20) // total
        .mockResolvedValueOnce(15) // cursos
        .mockResolvedValueOnce(5)  // programas tecnicos
        .mockResolvedValueOnce(18) // activos
        .mockResolvedValueOnce(2)  // inactivos
        .mockResolvedValueOnce(3); // nuevos este mes

      await programaController.obtenerEstadisticasProgramas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: {
          totalProgramas: 20,
          totalCursos: 15,
          totalProgramasTecnicos: 5,
          programasActivos: 18,
          programasInactivos: 2,
          nuevosProgramasEsteMes: 3
        }
      });
    });

    it('should handle errors', async () => {
      ProgramaAcademico.countDocuments = jest.fn().mockRejectedValue(new Error('DB Error'));

      await programaController.obtenerEstadisticasProgramas(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
