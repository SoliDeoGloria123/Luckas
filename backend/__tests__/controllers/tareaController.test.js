const Tarea = require('../../models/Tarea');
const Usuario = require('../../models/User');
const mongoose = require('mongoose');
const tareaController = require('../../controllers/tareaController');

jest.mock('../../models/Tarea');
jest.mock('../../models/User');

describe('Tarea Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: 'user-123',
      userRole: 'admin'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('crearTarea', () => {
    it('should create tarea successfully', async () => {
      const mockUsuarioAsignado = { _id: 'user-456', role: 'seminarista' };
      const mockUsuarioAsignador = { _id: 'user-123', role: 'admin' };
      const mockTarea = {
        _id: 'tarea-123',
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {
        asignadoA: 'user-456',
        asignadoPor: 'user-123',
        titulo: 'Tarea Test',
        descripcion: 'Descripción test'
      };

      Usuario.findById = jest.fn()
        .mockResolvedValueOnce(mockUsuarioAsignado)
        .mockResolvedValueOnce(mockUsuarioAsignador);
      
      Tarea.mockImplementation(() => mockTarea);
      Tarea.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockTarea)
        })
      });

      await tareaController.crearTarea(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        message: 'Tarea creada exitosamente'
      }));
    });

    it('should return 400 if asignadoA ID is invalid', async () => {
      req.body = {
        asignadoA: 'invalid-id',
        asignadoPor: 'user-123'
      };

      await tareaController.crearTarea(req, res);

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);
      await tareaController.crearTarea(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if usuario asignado does not exist', async () => {
      req.body = {
        asignadoA: '507f1f77bcf86cd799439011',
        asignadoPor: '507f1f77bcf86cd799439012'
      };

      Usuario.findById = jest.fn().mockResolvedValue(null);

      await tareaController.crearTarea(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('obtenerTareas', () => {
    it('should return all tareas', async () => {
      const mockTareas = [
        { _id: '1', titulo: 'Tarea 1' },
        { _id: '2', titulo: 'Tarea 2' }
      ];

      Tarea.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockTareas)
        })
      });

      await tareaController.obtenerTareas(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTareas
      });
    });
  });

  describe('obtenerTareaPorId', () => {
    it('should return tarea by id', async () => {
      const mockTarea = { _id: 'tarea-123', titulo: 'Test' };
      req.params.id = 'tarea-123';

      Tarea.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockTarea)
        })
      });

      await tareaController.obtenerTareaPorId(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTarea
      });
    });

    it('should return 404 if tarea not found', async () => {
      req.params.id = 'nonexistent';

      Tarea.findById = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await tareaController.obtenerTareaPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('actualizarTarea', () => {
    it('should update tarea', async () => {
      const mockTarea = { _id: 'tarea-123', titulo: 'Updated' };
      req.params.id = 'tarea-123';
      req.body = { titulo: 'Updated' };

      Tarea.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockTarea)
        })
      });

      await tareaController.actualizarTarea(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Tarea actualizada exitosamente',
        data: mockTarea
      });
    });

    it('should return 404 if tarea not found', async () => {
      req.params.id = 'nonexistent';
      req.body = { titulo: 'Updated' };

      Tarea.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });

      await tareaController.actualizarTarea(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('eliminarTarea', () => {
    it('should delete tarea', async () => {
      req.params.id = 'tarea-123';

      Tarea.findByIdAndDelete = jest.fn().mockResolvedValue({
        _id: 'tarea-123'
      });

      await tareaController.eliminarTarea(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Tarea eliminada'
      });
    });

    it('should return 404 if tarea not found', async () => {
      req.params.id = 'nonexistent';

      Tarea.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      await tareaController.eliminarTarea(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('cambiarEstado', () => {
    it('should change estado successfully', async () => {
      const mockTarea = { _id: 'tarea-123', estado: 'completada' };
      req.params.id = 'tarea-123';
      req.body = { estado: 'completada' };

      Tarea.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockTarea)
        })
      });

      await tareaController.cambiarEstado(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Estado actualizado correctamente',
        data: mockTarea
      });
    });

    it('should return 400 for invalid estado', async () => {
      req.params.id = 'tarea-123';
      req.body = { estado: 'invalid' };

      await tareaController.cambiarEstado(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('agregarComentario', () => {
    it('should add comentario successfully', async () => {
      const mockTarea = {
        _id: 'tarea-123',
        comentarios: [],
        save: jest.fn().mockResolvedValue(true)
      };
      const mockTareaActualizada = {
        _id: 'tarea-123',
        comentarios: [{ texto: 'Test comment', autor: 'user-123' }]
      };

      req.params.id = 'tarea-123';
      req.body = { texto: 'Test comment' };

      Tarea.findById = jest.fn()
        .mockResolvedValueOnce(mockTarea)
        .mockReturnValueOnce({
          populate: jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({
              populate: jest.fn().mockResolvedValue(mockTareaActualizada)
            })
          })
        });

      await tareaController.agregarComentario(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Comentario agregado correctamente',
        data: mockTareaActualizada
      });
    });

    it('should return 400 if texto is empty', async () => {
      req.params.id = 'tarea-123';
      req.body = { texto: '' };

      await tareaController.agregarComentario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('obtenerTareasPorUsuario', () => {
    it('should return tareas for user', async () => {
      const mockTareas = [{ _id: '1' }, { _id: '2' }];
      req.params.usuarioId = 'user-123';

      Tarea.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockReturnValue({
            sort: jest.fn().mockResolvedValue(mockTareas)
          })
        })
      });

      await tareaController.obtenerTareasPorUsuario(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        data: mockTareas
      });
    });

    it('should return 400 for invalid usuarioId', async () => {
      req.params.usuarioId = 'invalid-id';

      mongoose.Types.ObjectId.isValid.mockReturnValueOnce(false);
      await tareaController.obtenerTareasPorUsuario(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('obtenerEstadisticasTareas', () => {
    it('should return statistics', async () => {
      Tarea.countDocuments = jest.fn()
        .mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(30)  // pendientes
        .mockResolvedValueOnce(40)  // en progreso
        .mockResolvedValueOnce(20)  // completadas
        .mockResolvedValueOnce(10); // vencidas

      Tarea.aggregate = jest.fn().mockResolvedValue([
        { _id: 'alta', total: 30 },
        { _id: 'media', total: 50 },
        { _id: 'baja', total: 20 }
      ]);

      await tareaController.obtenerEstadisticasTareas(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        total: 100,
        pendientes: 30,
        enProgreso: 40,
        completadas: 20,
        vencidas: 10
      }));
    });

    it('should handle catch error', async () => {
      Tarea.countDocuments = jest.fn().mockRejectedValue(new Error('DB Error'));
      await tareaController.obtenerEstadisticasTareas(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  // Additional tests for coverage
  describe('Edge cases and Error handling', () => {
    it('crearTarea: should return 400 if asignadoPor ID is invalid', async () => {
      req.body = { asignadoA: '507f1f77bcf86cd799439011', asignadoPor: 'invalid' };
      mongoose.Types.ObjectId.isValid = jest.fn()
          .mockReturnValueOnce(true) // asignadoA
          .mockReturnValueOnce(false); // asignadoPor

      await tareaController.crearTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'ID de usuario que asigna inválido' }));
    });

    it('crearTarea: should return 404 if usuario asignador does not exist', async () => {
      req.body = { asignadoA: '507f1f77bcf86cd799439011', asignadoPor: '507f1f77bcf86cd799439012' };
      Usuario.findById = jest.fn()
        .mockResolvedValueOnce({ _id: 'user1' }) // asignadoA exists
        .mockResolvedValueOnce(null); // asignadoPor not found

      await tareaController.crearTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El usuario que asigna no existe' }));
    });

    it('crearTarea: seminarista assigning to non-seminarist should fail', async () => {
      req.userRole = 'seminarista';
      req.userId = 'sem-123';
      req.body = { asignadoA: 'other-123' }; // Not assigning to self

      Usuario.findById = jest.fn()
        .mockResolvedValueOnce({ _id: 'other-123', role: 'admin' }) // Assignee is admin
        .mockResolvedValueOnce({ _id: 'sem-123' }); // Assigner

      await tareaController.crearTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Como seminarista, solo puedes asignar tareas a otros seminaristas' }));
    });

    it('crearTarea: validation of comments - invalid author ID', async () => {
      req.body = { 
        asignadoA: '507f1f77bcf86cd799439011', 
        asignadoPor: '507f1f77bcf86cd799439012',
        comentarios: [{ autor: 'invalid' }]
      };
      
      Usuario.findById = jest.fn().mockResolvedValue({}); // Users exist
      mongoose.Types.ObjectId.isValid = jest.fn()
          .mockReturnValueOnce(true) // asignadoA
          .mockReturnValueOnce(true) // asignadoPor
          .mockReturnValueOnce(false); // comment author

      await tareaController.crearTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'ID de autor de comentario inválido' }));
    });

    it('crearTarea: validation of comments - author not found', async () => {
      req.body = { 
        asignadoA: '507f1f77bcf86cd799439011', 
        asignadoPor: '507f1f77bcf86cd799439012',
        comentarios: [{ autor: '507f1f77bcf86cd799439013' }]
      };
      
      Usuario.findById = jest.fn()
          .mockResolvedValueOnce({}) // asignadoA
          .mockResolvedValueOnce({}) // asignadoPor
          .mockResolvedValueOnce(null); // comment author

      await tareaController.crearTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'El autor del comentario no existe' }));
    });

    it('crearTarea: should handle catch error', async () => {
      req.body = {};
      // Force error by passing invalid body structure that causes internal error before validations or mocking throw
      Usuario.findById = jest.fn().mockRejectedValue(new Error('DB Error'));
      await tareaController.crearTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('obtenerTareas: should handle catch error', async () => {
      Tarea.find = jest.fn().mockImplementation(() => { throw new Error('DB Error'); });
      await tareaController.obtenerTareas(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('obtenerTareasPorUsuario: should handle catch error', async () => {
      req.params.usuarioId = '507f1f77bcf86cd799439011';
      Tarea.find = jest.fn().mockImplementation(() => { throw new Error('DB Error'); });
      await tareaController.obtenerTareasPorUsuario(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('obtenerTareaPorId: should handle catch error', async () => {
      req.params.id = '123';
      Tarea.findById = jest.fn().mockImplementation(() => { throw new Error('DB Error'); });
      await tareaController.obtenerTareaPorId(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('actualizarTarea: should handle catch error', async () => {
      req.params.id = '123';
      Tarea.findByIdAndUpdate = jest.fn().mockImplementation(() => { throw new Error('DB Error'); });
      await tareaController.actualizarTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('eliminarTarea: should handle catch error', async () => {
      req.params.id = '123';
      Tarea.findByIdAndDelete = jest.fn().mockImplementation(() => { throw new Error('DB Error'); });
      await tareaController.eliminarTarea(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('cambiarEstado: should return 404 if task not found', async () => {
      req.params.id = '123';
      req.body = { estado: 'completada' };
      Tarea.findByIdAndUpdate = jest.fn().mockReturnValue({
        populate: jest.fn().mockReturnValue({
          populate: jest.fn().mockResolvedValue(null)
        })
      });
      await tareaController.cambiarEstado(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('cambiarEstado: should handle catch error', async () => {
      req.params.id = '123';
      req.body = { estado: 'completada' };
      Tarea.findByIdAndUpdate = jest.fn().mockImplementation(() => { throw new Error('DB Error'); });
      await tareaController.cambiarEstado(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('agregarComentario: should return 404 if task not found', async () => {
      req.params.id = '123';
      req.body = { texto: 'Comment' };
      Tarea.findById = jest.fn().mockResolvedValue(null);
      await tareaController.agregarComentario(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('agregarComentario: should handle catch error', async () => {
      req.params.id = '123';
      req.body = { texto: 'Comment' };
      Tarea.findById = jest.fn().mockRejectedValue(new Error('DB Error'));
      await tareaController.agregarComentario(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
