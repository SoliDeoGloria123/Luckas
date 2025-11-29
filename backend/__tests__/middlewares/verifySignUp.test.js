const { checkDuplicateEmailOrPhone, checkRolesExisted } = require('../../middlewares/verifySignUp');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('VerifySignUp Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('checkDuplicateEmailOrPhone', () => {
    it('should call next if email and phone are unique', async () => {
      req.body = {
        correo: 'test@example.com',
        telefono: '1234567890'
      };

      User.findOne = jest.fn().mockResolvedValue(null);

      await checkDuplicateEmailOrPhone(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 400 if email already exists', async () => {
      req.body = {
        correo: 'existing@example.com',
        telefono: '1234567890'
      };

      User.findOne = jest.fn().mockResolvedValueOnce({ correo: 'existing@example.com' });

      await checkDuplicateEmailOrPhone(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'El email ya está en uso'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 400 if phone already exists', async () => {
      req.body = {
        correo: 'new@example.com',
        telefono: '1234567890'
      };

      User.findOne = jest.fn()
        .mockResolvedValueOnce(null) // email check
        .mockResolvedValueOnce({ telefono: '1234567890' }); // phone check

      await checkDuplicateEmailOrPhone(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'El teléfono ya está en uso'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle errors', async () => {
      req.body = {
        correo: 'test@example.com',
        telefono: '1234567890'
      };

      User.findOne = jest.fn().mockRejectedValue(new Error('DB Error'));

      await checkDuplicateEmailOrPhone(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error al verificar email/teléfono',
        error: 'DB Error'
      });
    });
  });

  describe('checkRolesExisted', () => {
    it('should call next if role is valid', () => {
      req.body.role = 'admin';

      checkRolesExisted(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should call next if no role is provided', () => {
      req.body = {};

      checkRolesExisted(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should return 400 if role does not exist', () => {
      req.body.role = 'invalid_role';

      checkRolesExisted(req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Rol invalid_role no existe'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow all valid roles', () => {
      const validRoles = ['admin', 'tesorero', 'seminarista', 'externo'];

      validRoles.forEach(role => {
        req.body.role = role;
        next.mockClear();

        checkRolesExisted(req, res, next);

        expect(next).toHaveBeenCalled();
      });
    });
  });
});
