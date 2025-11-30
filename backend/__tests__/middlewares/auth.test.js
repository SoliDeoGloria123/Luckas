const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { authenticate, authorize } = require('../../middlewares/auth');

jest.mock('jsonwebtoken');
jest.mock('../../models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      header: jest.fn()
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('authenticate', () => {
    it('should authenticate valid token', async () => {
      const mockUser = { _id: 'user-123', nombre: 'Test User' };
      req.header.mockReturnValue('Bearer valid-token');
      jwt.verify.mockReturnValue({ id: 'user-123' });
      User.findById.mockResolvedValue(mockUser);

      await authenticate(req, res, next);

      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it('should return 401 if no token provided', async () => {
      req.header.mockReturnValue(undefined);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Token de autenticacion requerido'
      }));
    });

    it('should return 401 if user not found', async () => {
      req.header.mockReturnValue('Bearer valid-token');
      jwt.verify.mockReturnValue({ id: 'user-123' });
      User.findById.mockResolvedValue(null);

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Usuario no encontrado'
      }));
    });

    it('should return 401 if token is invalid', async () => {
      req.header.mockReturnValue('Bearer invalid-token');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'Token inválido o expirado'
      }));
    });
  });

  describe('authorize', () => {
    it('should allow access if user has required role', () => {
      req.user = { roles: 'admin' };
      const middleware = authorize(['admin', 'moderator']);

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access if user does not have required role', () => {
      req.user = { roles: 'user', role: 'user' };
      const middleware = authorize(['admin', 'moderator']);

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: false,
        message: 'No tienes permisos para esta accion'
      }));
    });
  });
});
