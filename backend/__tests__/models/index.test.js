jest.unmock('../../models/User');
jest.unmock('../../models/Solicitud');
jest.unmock('../../models/Reservas');
jest.unmock('../../models/Reportes');
jest.unmock('../../models/Inscripciones');
jest.unmock('../../models/Eventos');
jest.unmock('../../models/categorizacion');
jest.unmock('../../models/Tarea');
jest.unmock('../../models/Cabana');
jest.unmock('../../models/ProgramaAcademico');
jest.unmock('../../models/index');
jest.unmock('mongoose');

describe('Models Index', () => {
  it('should export all models with correct names', () => {
    jest.isolateModules(() => {
      const models = require('../../models/index');
      
      expect(models.User).toBeDefined();
      expect(models.User.modelName).toBe('User');
      
      expect(models.Solicitud).toBeDefined();
      expect(models.Solicitud.modelName).toBe('Solicitud');
      
      expect(models.Reserva).toBeDefined();
      expect(models.Reserva.modelName).toBe('Reserva');
      
      expect(models.Reporte).toBeDefined();
      expect(models.Reporte.modelName).toBe('Reporte');
      
      expect(models.Inscripcion).toBeDefined();
      expect(models.Inscripcion.modelName).toBe('Inscripcion');
      
      expect(models.Evento).toBeDefined();
      expect(models.Evento.modelName).toBe('Evento');
      
      expect(models.Categorizacion).toBeDefined();
      expect(models.Categorizacion.modelName).toBe('Categorizacion');
      
      expect(models.Tarea).toBeDefined();
      expect(models.Tarea.modelName).toBe('Tarea');
      
      expect(models.Cabanas).toBeDefined();
      expect(models.Cabanas.modelName).toBe('Cabana');
      
      expect(models.ProgramaAcademico).toBeDefined();
      expect(models.ProgramaAcademico.modelName).toBe('ProgramaAcademico');
    });
  });
});
