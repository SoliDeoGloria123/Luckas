const notificationUtils = require('../../utils/notificationUtils');
const Notification = require('../../models/Notification');
const Usuario = require('../../models/User');

jest.mock('../../models/Notification');
jest.mock('../../models/User');

describe('Notification Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('enviarNotificacionAUsuariosConRol', () => {
    it('should send notifications to users with specified roles', async () => {
      const mockUsers = [{ _id: 'user1' }, { _id: 'user2' }];
      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });
      Notification.insertMany.mockResolvedValue([{}, {}]);

      const result = await notificationUtils.enviarNotificacionAUsuariosConRol(
        'Test Title',
        'Test Message'
      );

      expect(Usuario.find).toHaveBeenCalledWith({
        role: { $in: ['admin', 'tesorero'] },
        estado: 'activo'
      });
      expect(Notification.insertMany).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
      expect(result.count).toBe(2);
    });

    it('should exclude specified user', async () => {
      const mockUsers = [{ _id: 'user2' }];
      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });
      Notification.insertMany.mockResolvedValue([{}]);

      await notificationUtils.enviarNotificacionAUsuariosConRol(
        'Test Title',
        'Test Message',
        'Bell',
        ['admin'],
        'user1'
      );

      expect(Usuario.find).toHaveBeenCalledWith({
        role: { $in: ['admin'] },
        estado: 'activo',
        _id: { $ne: 'user1' }
      });
    });

    it('should return error if no users found', async () => {
      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([])
      });

      const result = await notificationUtils.enviarNotificacionAUsuariosConRol(
        'Test Title',
        'Test Message'
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe('No se encontraron usuarios destinatarios');
    });

    it('should handle errors', async () => {
      Usuario.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('DB Error'))
      });

      const result = await notificationUtils.enviarNotificacionAUsuariosConRol(
        'Test Title',
        'Test Message'
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe('DB Error');
    });
  });

  describe('notificarNuevaInscripcion', () => {
    it('should notify new inscripcion for Evento', async () => {
      const inscripcion = { tipoReferencia: 'Eventos' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      const referencia = { nombre: 'Evento Test' };

      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([{ _id: 'admin1' }])
      });
      Notification.insertMany.mockResolvedValue([{}]);

      await notificationUtils.notificarNuevaInscripcion(inscripcion, usuario, referencia);

      expect(Notification.insertMany).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          title: 'Nueva Inscripción - evento',
          message: 'John Doe se ha inscrito en el evento: Evento Test'
        })
      ]));
    });

    it('should notify new inscripcion for Programa Academico', async () => {
      const inscripcion = { tipoReferencia: 'ProgramaAcademico' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      const referencia = { nombre: 'Curso Test' };

      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([{ _id: 'admin1' }])
      });
      Notification.insertMany.mockResolvedValue([{}]);

      await notificationUtils.notificarNuevaInscripcion(inscripcion, usuario, referencia);

      expect(Notification.insertMany).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          title: 'Nueva Inscripción - programa académico'
        })
      ]));
    });

    it('should handle missing reference name', async () => {
      const inscripcion = { tipoReferencia: 'Eventos' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      
      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([{ _id: 'admin1' }])
      });
      Notification.insertMany.mockResolvedValue([{}]);

      await notificationUtils.notificarNuevaInscripcion(inscripcion, usuario, null);

      expect(Notification.insertMany).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          message: expect.stringContaining('desconocido')
        })
      ]));
    });

    it('should handle errors', async () => {
      const inscripcion = { tipoReferencia: 'Eventos' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      
      Usuario.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('DB Error'))
      });

      const result = await notificationUtils.notificarNuevaInscripcion(inscripcion, usuario, {});
      expect(result.success).toBe(false);
    });
  });

  describe('notificarNuevaReserva', () => {
    it('should notify new reserva', async () => {
      const reserva = { fechaInicio: '2023-01-01', fechaFin: '2023-01-05' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      const cabana = { nombre: 'Cabana 1' };

      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([{ _id: 'admin1' }])
      });
      Notification.insertMany.mockResolvedValue([{}]);

      await notificationUtils.notificarNuevaReserva(reserva, usuario, cabana);

      expect(Notification.insertMany).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          title: 'Nueva Reserva de Cabaña',
          icon: 'Calendar'
        })
      ]));
    });

    it('should handle errors', async () => {
      const reserva = { fechaInicio: '2023-01-01', fechaFin: '2023-01-05' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      const cabana = { nombre: 'Cabana 1' };

      Usuario.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('DB Error'))
      });

      const result = await notificationUtils.notificarNuevaReserva(reserva, usuario, cabana);
      expect(result.success).toBe(false);
    });
  });

  describe('notificarNuevaSolicitud', () => {
    it('should notify new solicitud', async () => {
      const solicitud = { tipoSolicitud: 'Mantenimiento', titulo: 'Arreglar puerta' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };

      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([{ _id: 'admin1' }])
      });
      Notification.insertMany.mockResolvedValue([{}]);

      await notificationUtils.notificarNuevaSolicitud(solicitud, usuario);

      expect(Notification.insertMany).toHaveBeenCalledWith(expect.arrayContaining([
        expect.objectContaining({
          title: 'Nueva Solicitud - Mantenimiento',
          icon: 'FileText'
        })
      ]));
    });

    it('should handle errors', async () => {
      const solicitud = { tipoSolicitud: 'Mantenimiento', titulo: 'Arreglar puerta' };
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };

      Usuario.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('DB Error'))
      });

      const result = await notificationUtils.notificarNuevaSolicitud(solicitud, usuario);
      expect(result.success).toBe(false);
    });
  });
});
