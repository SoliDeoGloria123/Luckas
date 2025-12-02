const eventosController = require('../../controllers/eventosController');
const Evento = require('../../models/Eventos');
const Categorizacion = require('../../models/categorizacion');
const Usuario = require('../../models/User');
const Inscripcion = require('../../models/Inscripciones');
const cloudinary = require('../../config/cloudinary');

jest.mock('../../models/Eventos');
jest.mock('../../models/categorizacion');
jest.mock('../../models/User');
jest.mock('../../models/Inscripciones');
jest.mock('../../config/cloudinary');

// Ensure static methods are mocked
Evento.updateMany = jest.fn();
Inscripcion.deleteMany = jest.fn();

describe('EventosController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      query: {},
      userId: 'user-id',
      userRole: 'admin'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('categorizarEvento', () => {
    it('should return 400 if categoria is missing', async () => {
      req.body = {};
      await eventosController.categorizarEvento(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if event not found', async () => {
      req.params.id = 'event-id';
      req.body = { categoria: 'cat-id' };
      Evento.findByIdAndUpdate.mockResolvedValue(null);
      
      await eventosController.categorizarEvento(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should categorize event', async () => {
      req.params.id = 'event-id';
      req.body = { categoria: 'cat-id', etiquetas: ['tag'] };
      Evento.findByIdAndUpdate.mockResolvedValue({ _id: 'event-id' });
      
      await eventosController.categorizarEvento(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      req.body = { categoria: 'cat-id' };
      Evento.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));
      
      await eventosController.categorizarEvento(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getEventosPorCategoria', () => {
    it('should return events filtered by category', async () => {
      req.query.categoria = 'cat-id';
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };
      Evento.find.mockReturnValue(mockFind);
      
      await eventosController.getEventosPorCategoria(req, res);
      expect(Evento.find).toHaveBeenCalledWith({ categoria: 'cat-id' });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return all events if no category', async () => {
      const mockFind = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue([])
      };
      Evento.find.mockReturnValue(mockFind);
      
      await eventosController.getEventosPorCategoria(req, res);
      expect(Evento.find).toHaveBeenCalledWith({});
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      Evento.find.mockImplementation(() => { throw new Error('DB Error'); });
      
      await eventosController.getEventosPorCategoria(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('activarTodosLosEventos', () => {
    it('should activate all events', async () => {
      Evento.updateMany.mockResolvedValue({ modifiedCount: 5 });
      
      await eventosController.activarTodosLosEventos(req, res);
      expect(Evento.updateMany).toHaveBeenCalledWith({ active: false }, { $set: { active: true } });
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      Evento.updateMany.mockRejectedValue(new Error('DB Error'));
      
      await eventosController.activarTodosLosEventos(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });



  describe('obtenerEstadisticasEventos', () => {
    it('should return statistics', async () => {
      Evento.countDocuments.mockResolvedValue(10);
      
      await eventosController.obtenerEstadisticasEventos(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          totalEvents: 10,
          upcoming: 10,
          completed: 10,
          cancelled: 10
        })
      }));
    });

    it('should handle errors', async () => {
      Evento.countDocuments.mockRejectedValue(new Error('DB Error'));
      
      await eventosController.obtenerEstadisticasEventos(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteEvent', () => {
    it('should handle cloudinary deletion errors', async () => {
      req.params.id = 'event-id';
      Evento.findByIdAndDelete.mockResolvedValue({ 
        _id: 'event-id', 
        imagen: ['https://res.cloudinary.com/demo/image/upload/v1/Luckas/eventos/image.jpg'] 
      });
      Inscripcion.deleteMany.mockResolvedValue({ deletedCount: 0 });
      cloudinary.uploader.destroy.mockRejectedValue(new Error('Cloudinary Error'));
      
      await eventosController.deleteEvent(req, res);
      // Should still return 200 even if cloudinary fails (it catches the error)
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('disableEvent', () => {
    it('should disable event', async () => {
      req.params.id = 'event-id';
      Evento.findByIdAndUpdate.mockResolvedValue({ _id: 'event-id', active: false });
      
      await eventosController.disableEvent(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if event not found', async () => {
      req.params.id = 'event-id';
      Evento.findByIdAndUpdate.mockResolvedValue(null);
      
      await eventosController.disableEvent(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle errors', async () => {
      req.params.id = 'event-id';
      Evento.findByIdAndUpdate.mockRejectedValue(new Error('DB Error'));
      
      await eventosController.disableEvent(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
