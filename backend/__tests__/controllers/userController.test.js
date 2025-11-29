const userController = require('../../controllers/userController');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const { normalizeTipoDocumento } = require('../../utils/userValidation');

jest.mock('../../utils/userValidation');

describe('User Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
      body: {},
      user: { _id: 'userId' },
      userId: 'userId',
      userRole: 'admin'
    };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [{ _id: 'user1' }, { _id: 'user2' }];
      User.find.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUsers)
      });

      await userController.getAllUsers(req, res);

      expect(User.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        data: mockUsers
      }));
    });

    it('should handle errors', async () => {
      User.find.mockReturnValue({
        select: jest.fn().mockRejectedValue(new Error('Database error'))
      });

      await userController.getAllUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    });
  });

  describe('getUserById', () => {
    it('should return user by id for admin', async () => {
      req.params.id = 'targetUserId';
      req.userRole = 'admin';
      const mockUser = { _id: 'targetUserId', name: 'Test' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await userController.getUserById(req, res);

      expect(User.findById).toHaveBeenCalledWith('targetUserId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: mockUser }));
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'targetUserId';
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should deny access for external user viewing another profile', async () => {
      req.params.id = 'targetUserId';
      req.userRole = 'externo';
      req.userId = 'myUserId';
      const mockUser = { _id: 'targetUserId' };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('getUserByDocumento', () => {
    it('should return user by document', async () => {
      req.params.numeroDocumento = '123456';
      const mockUser = { _id: 'user1', numeroDocumento: '123456' };
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await userController.getUserByDocumento(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ numeroDocumento: '123456' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ user: mockUser }));
    });

    it('should return 404 if user not found', async () => {
      req.params.numeroDocumento = '123456';
      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await userController.getUserByDocumento(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      req.body = {
        nombre: 'John',
        apellido: 'Doe',
        correo: 'john@example.com',
        password: 'password123',
        tipoDocumento: 'CC'
      };
      normalizeTipoDocumento.mockReturnValue('Cédula de Ciudadanía');
      
      const mockSavedUser = { ...req.body, _id: 'newUserId' };
      User.prototype.save = jest.fn().mockResolvedValue(mockSavedUser);

      await userController.createUser(req, res);

      expect(normalizeTipoDocumento).toHaveBeenCalledWith('CC');
      expect(User.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should handle errors during creation', async () => {
      req.body = {};
      User.prototype.save = jest.fn().mockRejectedValue(new Error('Validation error'));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('updateUser', () => {
    it('should update user', async () => {
      req.params.id = 'userId';
      req.body = { nombre: 'Updated Name', tipoDocumento: 'CC' };
      normalizeTipoDocumento.mockReturnValue('Cédula de Ciudadanía');
      
      const mockUpdatedUser = { _id: 'userId', nombre: 'Updated Name' };
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUpdatedUser)
      });

      await userController.updateUser(req, res);

      expect(normalizeTipoDocumento).toHaveBeenCalledWith('CC');
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'userId';
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue(null)
      });

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateOwnProfile', () => {
    it('should update own profile', async () => {
      req.userId = 'userId';
      req.body = { nombre: 'New Name' };
      
      User.findById.mockResolvedValue({ _id: 'userId' });
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: 'userId', nombre: 'New Name' })
      });

      await userController.updateOwnProfile(req, res);

      expect(User.findById).toHaveBeenCalledWith('userId');
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user not found', async () => {
      req.userId = 'userId';
      User.findById.mockResolvedValue(null);

      await userController.updateOwnProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('changePassword', () => {
    it('should change password', async () => {
      req.userId = 'userId';
      req.body = { currentPassword: 'oldPass', newPassword: 'newPass' };
      
      const mockUser = {
        _id: 'userId',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await userController.changePassword(req, res);

      expect(mockUser.comparePassword).toHaveBeenCalledWith('oldPass');
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 400 if current password is incorrect', async () => {
      req.userId = 'userId';
      req.body = { currentPassword: 'wrongPass', newPassword: 'newPass' };
      
      const mockUser = {
        _id: 'userId',
        comparePassword: jest.fn().mockResolvedValue(false)
      };
      User.findById.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      await userController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('getUserStats', () => {
    it('should return user stats', async () => {
      User.countDocuments.mockResolvedValueOnce(100) // total
        .mockResolvedValueOnce(80) // activos
        .mockResolvedValueOnce(5) // admins
        .mockResolvedValueOnce(10); // nuevos

      await userController.getUserStats(req, res);

      expect(User.countDocuments).toHaveBeenCalledTimes(4);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        success: true,
        stats: expect.objectContaining({
          totalUsuarios: 100,
          usuariosActivos: 80
        })
      }));
    });
  });

  describe('toggleUserActivation', () => {
    it('should toggle user activation', async () => {
      req.params.id = 'userId';
      req.body = { estado: 'activo' };
      
      User.findByIdAndUpdate.mockReturnValue({
        select: jest.fn().mockResolvedValue({ _id: 'userId', estado: 'activo' })
      });

      await userController.toggleUserActivation(req, res);

      expect(User.findByIdAndUpdate).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
    });

    it('should return 400 for invalid state', async () => {
      req.body = { estado: 'invalid' };
      await userController.toggleUserActivation(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('deleteUser', () => {
    it('should delete user', async () => {
      req.params.id = 'userId';
      User.findByIdAndDelete.mockResolvedValue({ _id: 'userId' });

      await userController.deleteUser(req, res);

      expect(User.findByIdAndDelete).toHaveBeenCalledWith('userId');
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should return 404 if user not found', async () => {
      req.params.id = 'userId';
      User.findByIdAndDelete.mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });
});
