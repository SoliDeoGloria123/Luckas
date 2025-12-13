const notificationUtils = require('../../utils/notificationUtils');
const Notification = require('../../models/Notification');
const Usuario = require('../../models/User');

jest.mock('../../models/Notification');
jest.mock('../../models/User');

describe('Notification Utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('enviarNotificacionAUsuariosConRol', () => {
    it('should send notifications to users with specified roles', async () => {
      const mockUsers = [{ _id: 'user1' }, { _id: 'user2' }];
      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });
      Notification.insertMany.mockResolvedValue([{}, {}]);

      const result = await notificationUtils.enviarNotificacionAUsuariosConRol('Title', 'Message');

      expect(Usuario.find).toHaveBeenCalledWith(expect.objectContaining({ role: { $in: ['admin', 'tesorero'] } }));
      expect(Notification.insertMany).toHaveBeenCalledTimes(1);
      expect(result.success).toBe(true);
      expect(result.count).toBe(2);
    });

    it('should exclude specified user', async () => {
      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([])
      });

      await notificationUtils.enviarNotificacionAUsuariosConRol('Title', 'Message', 'Icon', ['admin'], 'excludeId');

      expect(Usuario.find).toHaveBeenCalledWith(expect.objectContaining({ _id: { $ne: 'excludeId' } }));
    });

    it('should return error if no users found', async () => {
      Usuario.find.mockReturnValue({
        select: jest.fn().mockResolvedValue([])
      });

      const result = await notificationUtils.enviarNotificacionAUsuariosConRol('Title', 'Message');

      expect(result.success).toBe(false);
      expect(result.message).toBe('No se encontraron usuarios destinatarios');
    });

    it('should handle errors', async () => {
      Usuario.find.mockImplementation(() => { throw new Error('DB Error'); });
      const result = await notificationUtils.enviarNotificacionAUsuariosConRol('Title', 'Message');
      expect(result.success).toBe(false);
    });
  });

  describe('notificarNuevaInscripcion', () => {
    it('should notify new event inscription', async () => {
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      const referencia = { nombre: 'Evento 1' };
      const inscripcion = { tipoReferencia: 'Eventos' };

      // Mock internal call
      Usuario.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'admin1' }]) });
      Notification.insertMany.mockResolvedValue([{}]);

      const result = await notificationUtils.notificarNuevaInscripcion(inscripcion, usuario, referencia);

      expect(result.success).toBe(true);
    });

    it('should notify new program inscription', async () => {
        const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
        const referencia = { nombre: 'Programa 1' };
        const inscripcion = { tipoReferencia: 'ProgramaAcademico' };
  
        Usuario.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'admin1' }]) });
        Notification.insertMany.mockResolvedValue([{}]);
  
        const result = await notificationUtils.notificarNuevaInscripcion(inscripcion, usuario, referencia);
  
        expect(result.success).toBe(true);
      });

    it('should handle errors', async () => {
        Usuario.find.mockImplementation(() => { throw new Error('DB Error'); });
        const result = await notificationUtils.notificarNuevaInscripcion({}, {}, {});
        expect(result.success).toBe(false);
    });
  });

  describe('notificarNuevaReserva', () => {
    it('should notify new reservation', async () => {
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      const cabana = { nombre: 'Cabana 1' };
      const reserva = { fechaInicio: '2023-01-01', fechaFin: '2023-01-05' };

      Usuario.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'admin1' }]) });
      Notification.insertMany.mockResolvedValue([{}]);

      const result = await notificationUtils.notificarNuevaReserva(reserva, usuario, cabana);

      expect(result.success).toBe(true);
    });

    it('should handle errors', async () => {
        Usuario.find.mockImplementation(() => { throw new Error('DB Error'); });
        const result = await notificationUtils.notificarNuevaReserva({}, {}, {});
        expect(result.success).toBe(false);
    });
  });

  describe('notificarNuevaSolicitud', () => {
    it('should notify new request', async () => {
      const usuario = { _id: 'user1', nombre: 'John', apellido: 'Doe' };
      const solicitud = { tipoSolicitud: 'General', titulo: 'Test' };

      Usuario.find.mockReturnValue({ select: jest.fn().mockResolvedValue([{ _id: 'admin1' }]) });
      Notification.insertMany.mockResolvedValue([{}]);

      const result = await notificationUtils.notificarNuevaSolicitud(solicitud, usuario);

      expect(result.success).toBe(true);
    });

    it('should handle errors', async () => {
        Usuario.find.mockImplementation(() => { throw new Error('DB Error'); });
        const result = await notificationUtils.notificarNuevaSolicitud({}, {});
        expect(result.success).toBe(false);
    });
  });
});
