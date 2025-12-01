const request = require('supertest');
const express = require('express');
const notificationRoutes = require('../../routes/notificationRoutes');
const notificationController = require('../../controllers/notificationController');
const { authJwt } = require('../../middlewares');

jest.mock('../../controllers/notificationController');
jest.mock('../../middlewares', () => ({
  authJwt: {
    verifyToken: jest.fn((req, res, next) => {
      req.userId = 'test-user-id';
      req.userRole = 'admin';
      next();
    })
  }
}));

describe('Notification Routes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/api/notifications', notificationRoutes);
    jest.clearAllMocks();
  });

  it('should handle POST /api/notifications', async () => {
    notificationController.createNotification.mockImplementation((req, res) => {
      res.status(201).json({ success: true, data: {} });
    });

    const res = await request(app).post('/api/notifications').send({});
    expect(res.statusCode).toBe(201);
  });

  it('should handle GET /api/notifications', async () => {
    notificationController.getUserNotifications.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [] });
    });

    const res = await request(app).get('/api/notifications');
    expect(res.statusCode).toBe(200);
  });

  it('should handle GET /api/notifications/unread-count', async () => {
    notificationController.getUnreadCount.mockImplementation((req, res) => {
      res.status(200).json({ success: true, count: 0 });
    });

    const res = await request(app).get('/api/notifications/unread-count');
    expect(res.statusCode).toBe(200);
  });

  it('should handle PUT /api/notifications/read', async () => {
    notificationController.markAsRead.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).put('/api/notifications/read').send({});
    expect(res.statusCode).toBe(200);
  });

  it('should handle PUT /api/notifications/read-all', async () => {
    notificationController.markAllAsRead.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).put('/api/notifications/read-all');
    expect(res.statusCode).toBe(200);
  });

  it('should handle DELETE /api/notifications/:id', async () => {
    notificationController.deleteNotification.mockImplementation((req, res) => {
      res.status(200).json({ success: true });
    });

    const res = await request(app).delete('/api/notifications/123');
    expect(res.statusCode).toBe(200);
  });
});
