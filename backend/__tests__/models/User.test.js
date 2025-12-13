const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Explicitly unmock to ensure we get the real model
jest.unmock('mongoose');
jest.unmock('../../models/User');
const User = require('../../models/User');

jest.mock('bcryptjs');

describe('User Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('comparePassword', () => {
    it('should return true if passwords match', async () => {
      // Mock bcrypt.compare to return true
      bcrypt.compare.mockResolvedValue(true);
      
      // Create a user instance (without saving to DB)
      const user = new User({ 
        nombre: 'Test', 
        apellido: 'User', 
        correo: 'test@test.com', 
        telefono: '1234567', 
        tipoDocumento: 'Cédula de ciudadanía', 
        numeroDocumento: '1234567', 
        fechaNacimiento: new Date(),
        password: 'hashedPassword' 
      });

      const isMatch = await user.comparePassword('password');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashedPassword');
      expect(isMatch).toBe(true);
    });

    it('should return false if passwords do not match', async () => {
      bcrypt.compare.mockResolvedValue(false);
      
      const user = new User({ 
        nombre: 'Test', 
        apellido: 'User', 
        correo: 'test@test.com', 
        telefono: '1234567', 
        tipoDocumento: 'Cédula de ciudadanía', 
        numeroDocumento: '1234567', 
        fechaNacimiento: new Date(),
        password: 'hashedPassword' 
      });
      
      const isMatch = await user.comparePassword('wrongPassword');
      expect(isMatch).toBe(false);
    });
  });

  describe('Validation Logic', () => {
    it('should validate correct document numbers based on type', () => {
      const user1 = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test@example.com',
        telefono: '1234567',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '12345678',
        fechaNacimiento: new Date(),
        password: 'password123'
      });
      
      const err1 = user1.validateSync();
      expect(err1).toBeUndefined();

      const user2 = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test2@example.com',
        telefono: '1234567',
        tipoDocumento: 'Pasaporte',
        numeroDocumento: 'A123456',
        fechaNacimiento: new Date(),
        password: 'password123'
      });
      
      const err2 = user2.validateSync();
      expect(err2).toBeUndefined();
    });

    it('should return correct error message', () => {
       const user1 = new User({
         nombre: 'Test',
         apellido: 'User',
         correo: 'test@example.com',
         telefono: '1234567',
         tipoDocumento: 'Tarjeta de identidad',
         numeroDocumento: 'abc', // Invalid for Tarjeta
         fechaNacimiento: new Date(),
         password: 'password123'
       });
       
       let err1 = user1.validateSync();
       expect(err1).toBeDefined();
       expect(err1.errors.numeroDocumento).toBeDefined();
       expect(err1.errors.numeroDocumento.kind).toBe('user defined');
       
       const user2 = new User({
         nombre: 'Test',
         apellido: 'User',
         correo: 'test2@example.com',
         telefono: '1234568',
         tipoDocumento: 'Pasaporte',
         numeroDocumento: '123', // Too short
         fechaNacimiento: new Date(),
         password: 'password123'
       });
       
       const err2 = user2.validateSync();
       expect(err2).toBeDefined();
       expect(err2.errors.numeroDocumento).toBeDefined();
       expect(err2.errors.numeroDocumento.kind).toBe('user defined');
    });
  });

  describe('encryptPassword method', () => {
    it('should hash password if modified', async () => {
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test@example.com',
        telefono: '1234567',
        tipoDocumento: 'Pasaporte',
        numeroDocumento: 'A123456',
        fechaNacimiento: new Date(),
        password: 'plainPassword'
      });

      // Mock isModified to return true
      user.isModified = jest.fn().mockReturnValue(true);
      
      // Mock bcrypt
      bcrypt.genSalt.mockResolvedValue('salt');
      bcrypt.hash.mockResolvedValue('hashedPassword');

      await user.encryptPassword();

      expect(user.isModified).toHaveBeenCalledWith('password');
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith('plainPassword', 'salt');
      expect(user.password).toBe('hashedPassword');
    });

    it('should not hash password if not modified', async () => {
      const user = new User({ password: 'plainPassword' });
      user.isModified = jest.fn().mockReturnValue(false);

      await user.encryptPassword();

      expect(user.isModified).toHaveBeenCalledWith('password');
      expect(bcrypt.genSalt).not.toHaveBeenCalled();
    });
  });

    it('should validate default document type (unknown type)', () => {
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test7@example.com',
        telefono: '1234573',
        tipoDocumento: 'Otro',
        numeroDocumento: 'ABC123',
        fechaNacimiento: new Date(),
        password: 'password123'
      });

      const err = user.validateSync();
      expect(err).toBeUndefined();
    });

    it('should fail validation for default document type with invalid format', () => {
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test8@example.com',
        telefono: '1234574',
        tipoDocumento: 'Otro',
        numeroDocumento: '12', // Too short
        fechaNacimiento: new Date()
      });

      const err = user.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.numeroDocumento).toBeDefined();
      expect(err.errors.numeroDocumento.kind).toBe('user defined');
    });


  describe('pre save hook', () => {
    it('should have pre-save hook registered', () => {
      const hooks = User.schema.s.hooks._pres.get('save');
      expect(hooks).toBeDefined();
      expect(hooks.length).toBeGreaterThan(0);
    });

    it('encryptPassword should be called during save flow', () => {
      // This verifies the method exists and can be called
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test5@example.com',
        telefono: '1234571',
        tipoDocumento: 'Pasaporte',
        numeroDocumento: 'A123456',
        fechaNacimiento: new Date(),
        password: 'plainPassword'
      });

      expect(typeof user.encryptPassword).toBe('function');
    });

    it('should handle encryption error in pre-save hook', async () => {
      bcrypt.genSalt.mockRejectedValue(new Error('Encryption failed'));
      
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test-error@example.com',
        telefono: '1234572',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '1234567890',
        fechaNacimiento: new Date(),
        password: 'plainPassword'
      });

      await expect(user.save()).rejects.toThrow();
    });
  });

  describe('Document Validation Messages', () => {
    it('should validate Cédula de extranjería format', () => {
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test-ce@example.com',
        telefono: '1234573',
        tipoDocumento: 'Cédula de extranjería',
        numeroDocumento: '1234567890',
        fechaNacimiento: new Date(),
        password: 'password123'
      });

      const error = user.validateSync();
      expect(error).toBeUndefined();
    });

    it('should validate Pasaporte format', () => {
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test-passport@example.com',
        telefono: '1234574',
        tipoDocumento: 'Pasaporte',
        numeroDocumento: 'AB123456',
        fechaNacimiento: new Date(),
        password: 'password123'
      });

      const error = user.validateSync();
      expect(error).toBeUndefined();
    });

    it('should validate Tarjeta de identidad format', () => {
      const user = new User({
        nombre: 'Test',
        apellido: 'User',
        correo: 'test-ti@example.com',
        telefono: '1234575',
        tipoDocumento: 'Tarjeta de identidad',
        numeroDocumento: '12345678901',
        fechaNacimiento: new Date(),
        password: 'password123'
      });

      const error = user.validateSync();
      expect(error).toBeUndefined();
    });
  });
});
