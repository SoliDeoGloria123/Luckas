const jwt = require('jsonwebtoken');
const { verifyToken } = require('../../middlewares/authJwt');
const User = require('../../models/User');

jest.mock('jsonwebtoken');
jest.mock('../../models/User');
jest.mock('../../config/auth.config.js', () => ({
  secret: 'test-secret'
}));

describe('AuthJwt Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
      userId: null,
      userRole: null,
      originalUrl: '/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('verifyToken', () => {
    it('should verify valid token and set userId and userRole', async () => {
      req.headers['x-access-token'] = 'valid-token';
      const mockDecoded = { id: 'user-123', role: 'admin' };
      
      jwt.verify.mockReturnValue(mockDecoded);

      await verifyToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
      expect(req.userId).toBe('user-123');
      expect(req.userRole).toBe('admin');
      expect(next).toHaveBeenCalled();
    });

    it('should return 403 if no token provided', async () => {
      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Token no proporcionado'
      }));
    });

    it('should return 401 if token is invalid', async () => {
      req.headers['x-access-token'] = 'invalid-token';
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await verifyToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Token invalido '
      }));
    });
  });

});
