const { checkRole, isAdmin, isTesorero, isSeminarista, isExterno } = require('../../middlewares/role');

describe('Role Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      userRole: '',
      userEmail: 'test@example.com',
      originalUrl: '/test'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('checkRole', () => {
    it('should call next if user has allowed role', () => {
      req.userRole = 'admin';
      const middleware = checkRole('admin', 'tesorero');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if user does not have allowed role', () => {
      req.userRole = 'externo';
      const middleware = checkRole('admin', 'tesorero');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Acceso denegado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 if userRole is not set', () => {
      req.userRole = null;
      const middleware = checkRole('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al verificar rol'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('isAdmin', () => {
    it('should allow admin role', () => {
      req.userRole = 'admin';

      isAdmin(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny non-admin role', () => {
      req.userRole = 'tesorero';

      isAdmin(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('isTesorero', () => {
    it('should allow tesorero role', () => {
      req.userRole = 'tesorero';

      isTesorero(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('isSeminarista', () => {
    it('should allow seminarista role', () => {
      req.userRole = 'seminarista';

      isSeminarista(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('isExterno', () => {
    it('should allow externo role', () => {
      req.userRole = 'externo';

      isExterno(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
