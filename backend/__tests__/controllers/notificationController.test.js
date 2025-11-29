const Notification = require('../../models/Notification');
const notificationController = require('../../controllers/notificationController');

jest.mock('../../models/Notification');

describe('Notification Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userId: 'user-123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const mockNotification = {
        _id: 'notif-123',
        userId: 'user-456',
        title: 'Test Notification',
        message: 'Test message',
        icon: 'bell',
        save: jest.fn().mockResolvedValue(true)
      };

      req.body = {
        userId: 'user-456',
        title: 'Test Notification',
        message: 'Test message',
        icon: 'bell'
      };

      Notification.mockImplementation(() => mockNotification);

      await notificationController.createNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        notification: mockNotification
      });
    });

    it('should handle errors when creating notification', async () => {
      req.body = {
        userId: 'user-456',
        title: 'Test',
        message: 'Test'
      };

      Notification.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB Error'))
      }));

      await notificationController.createNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al crear notificación',
        error: 'DB Error'
      });
    });
  });

  describe('getUserNotifications', () => {
    it('should return user notifications', async () => {
      const mockNotifications = [
        { _id: '1', title: 'Notif 1', read: false },
        { _id: '2', title: 'Notif 2', read: true }
      ];

      Notification.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockNotifications)
      });

      await notificationController.getUserNotifications(req, res);

      expect(Notification.find).toHaveBeenCalledWith({ userId: 'user-123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        notifications: mockNotifications
      });
    });

    it('should handle errors', async () => {
      Notification.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error('DB Error'))
      });

      await notificationController.getUserNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      req.body = { notificationId: 'notif-123' };

      Notification.findByIdAndUpdate = jest.fn().mockResolvedValue({});

      await notificationController.markAsRead(req, res);

      expect(Notification.findByIdAndUpdate).toHaveBeenCalledWith('notif-123', { read: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true });
    });

    it('should handle errors', async () => {
      req.body = { notificationId: 'notif-123' };

      Notification.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error('DB Error'));

      await notificationController.markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      Notification.updateMany = jest.fn().mockResolvedValue({ modifiedCount: 5 });

      await notificationController.markAllAsRead(req, res);

      expect(Notification.updateMany).toHaveBeenCalledWith(
        { userId: 'user-123', read: false },
        { read: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Todas las notificaciones marcadas como leídas'
      });
    });

    it('should handle errors', async () => {
      Notification.updateMany = jest.fn().mockRejectedValue(new Error('DB Error'));

      await notificationController.markAllAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getUnreadCount', () => {
    it('should return unread count', async () => {
      Notification.countDocuments = jest.fn().mockResolvedValue(7);

      await notificationController.getUnreadCount(req, res);

      expect(Notification.countDocuments).toHaveBeenCalledWith({
        userId: 'user-123',
        read: false
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: 7
      });
    });

    it('should handle errors', async () => {
      Notification.countDocuments = jest.fn().mockRejectedValue(new Error('DB Error'));

      await notificationController.getUnreadCount(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification', async () => {
      req.params = { notificationId: 'notif-123' };

      Notification.findOneAndDelete = jest.fn().mockResolvedValue({
        _id: 'notif-123',
        title: 'Deleted'
      });

      await notificationController.deleteNotification(req, res);

      expect(Notification.findOneAndDelete).toHaveBeenCalledWith({
        _id: 'notif-123',
        userId: 'user-123'
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: 'Notificación eliminada'
      });
    });

    it('should return 404 if notification not found', async () => {
      req.params = { notificationId: 'nonexistent' };

      Notification.findOneAndDelete = jest.fn().mockResolvedValue(null);

      await notificationController.deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Notificación no encontrada'
      });
    });

    it('should handle errors', async () => {
      req.params = { notificationId: 'notif-123' };

      Notification.findOneAndDelete = jest.fn().mockRejectedValue(new Error('DB Error'));

      await notificationController.deleteNotification(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
