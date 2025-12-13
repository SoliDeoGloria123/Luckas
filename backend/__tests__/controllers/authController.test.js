const authController = require('../../controllers/authControllers');
const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../../utils/sendEmail');
const crypto = require('node:crypto');

jest.mock('../../models/User');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('../../utils/sendEmail');
jest.mock('node:crypto');

describe('AuthController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      userRole: 'admin',
      userId: 'admin-id'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('signup', () => {
    it('should return 400 if required fields are missing', async () => {
      req.body = {};
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle duplicate key error (11000)', async () => {
      req.body = {
        nombre: 'Test', apellido: 'User', correo: 'test@test.com',
        telefono: '123', tipoDocumento: 'CC', numeroDocumento: '123',
        fechaNacimiento: '2000-01-01', password: 'pass'
      };
      const error = { code: 11000, keyPattern: { correo: 1 } };
      User.prototype.save = jest.fn().mockRejectedValue(error);
      
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'El correo ya está en uso'
      }));
    });

    it('should handle ValidationError', async () => {
      req.body = {
        nombre: 'Test', apellido: 'User', correo: 'test@test.com',
        telefono: '123', tipoDocumento: 'CC', numeroDocumento: '123',
        fechaNacimiento: '2000-01-01', password: 'pass'
      };
      const error = { 
        name: 'ValidationError', 
        errors: { field: { message: 'Invalid field' } } 
      };
      User.prototype.save = jest.fn().mockRejectedValue(error);
      
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should handle generic error', async () => {
      req.body = {
        nombre: 'Test', apellido: 'User', correo: 'test@test.com',
        telefono: '123', tipoDocumento: 'CC', numeroDocumento: '123',
        fechaNacimiento: '2000-01-01', password: 'pass'
      };
      User.prototype.save = jest.fn().mockRejectedValue(new Error('DB Error'));
      
      await authController.signup(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('signin', () => {
    it('should handle errors', async () => {
      req.body = { correo: 'test@test.com', password: 'pass' };
      User.findOne.mockImplementation(() => { throw new Error('DB Error'); });
      
      await authController.signin(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateUser', () => {
    it('should return 404 if user not found', async () => {
      req.params.id = 'user-id';
      User.findById.mockResolvedValue(null);
      
      await authController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 403 if user has no permission', async () => {
      req.params.id = 'other-user-id';
      req.userRole = 'externo';
      req.userId = 'my-id';
      User.findById.mockResolvedValue({ _id: 'other-user-id' });
      
      await authController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should update user if admin', async () => {
      req.params.id = 'user-id';
      req.userRole = 'admin';
      req.body = { nombre: 'Updated' };
      User.findById.mockResolvedValue({ _id: 'user-id' });
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue({ nombre: 'Updated' })
      });
      
      await authController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      req.params.id = 'user-id';
      User.findById.mockRejectedValue(new Error('DB Error'));
      
      await authController.updateUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteUser', () => {
    it('should return 403 if not admin', async () => {
      req.userRole = 'externo';
      await authController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 404 if user not found', async () => {
      req.userRole = 'admin';
      req.params.id = 'user-id';
      User.findByIdAndDelete.mockResolvedValue(null);
      
      await authController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should delete user', async () => {
      req.userRole = 'admin';
      req.params.id = 'user-id';
      User.findByIdAndDelete.mockResolvedValue({ _id: 'user-id' });
      
      await authController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      req.userRole = 'admin';
      User.findByIdAndDelete.mockRejectedValue(new Error('DB Error'));
      
      await authController.deleteUser(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('forgotPassword', () => {
    it('should return 404 if user not found', async () => {
      req.body.correo = 'test@test.com';
      User.findOne.mockResolvedValue(null);
      
      await authController.forgotPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should send email and save code', async () => {
      req.body.correo = 'test@test.com';
      const mockUser = { save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);
      crypto.randomInt.mockReturnValue(123456);
      
      await authController.forgotPassword(req, res);
      expect(mockUser.save).toHaveBeenCalled();
      expect(sendEmail).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('should handle sendEmail error', async () => {
      req.body.correo = 'test@test.com';
      const mockUser = { save: jest.fn() };
      User.findOne.mockResolvedValue(mockUser);
      sendEmail.mockRejectedValue(new Error('Email Error'));
      
      await authController.forgotPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('resetPassword', () => {
    it('should return 400 if missing fields', async () => {
      req.body = {};
      await authController.resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if token invalid', async () => {
      req.body = { resetToken: 'token', newPassword: 'pass' };
      jwt.verify.mockImplementation(() => { throw new Error('Invalid'); });
      
      await authController.resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 404 if user not found', async () => {
      req.body = { resetToken: 'token', newPassword: 'pass' };
      jwt.verify.mockReturnValue({ purpose: 'password-reset', userId: 'id' });
      User.findById.mockResolvedValue(null);
      
      await authController.resetPassword(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should update password', async () => {
      req.body = { resetToken: 'token', newPassword: 'pass' };
      jwt.verify.mockReturnValue({ purpose: 'password-reset', userId: 'id' });
      const mockUser = { save: jest.fn() };
      User.findById.mockResolvedValue(mockUser);
      
      await authController.resetPassword(req, res);
      expect(mockUser.password).toBe('pass');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('verifyResetCode', () => {
    it('should return 400 if missing fields', async () => {
      req.body = {};
      await authController.verifyResetCode(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 if code invalid', async () => {
      req.body = { correo: 'test@test.com', code: '123' };
      User.findOne.mockResolvedValue(null);
      
      await authController.verifyResetCode(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return token if code valid', async () => {
      req.body = { correo: 'test@test.com', code: '123' };
      User.findOne.mockResolvedValue({ _id: 'id', correo: 'test@test.com' });
      jwt.sign.mockReturnValue('reset-token');
      
      await authController.verifyResetCode(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        resetToken: 'reset-token'
      }));
    });
  });
});
