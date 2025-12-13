const { validatePermissions } = require('../../utils/roleValidation');

describe('Role Validation Utils', () => {
  describe('validatePermissions', () => {
    it('should not throw error if user has allowed role', () => {
      expect(() => {
        validatePermissions('admin', ['admin', 'tesorero']);
      }).not.toThrow();
    });

    it('should throw error if user does not have allowed role', () => {
      expect(() => {
        validatePermissions('externo', ['admin', 'tesorero']);
      }).toThrow('Acceso denegado: permisos insuficientes');
    });

    it('should throw error with status 403', () => {
      try {
        validatePermissions('externo', ['admin']);
      } catch (error) {
        expect(error.status).toBe(403);
        expect(error.message).toBe('Acceso denegado: permisos insuficientes');
      }
    });

    it('should allow if role is in allowed roles array', () => {
      expect(() => {
        validatePermissions('seminarista', ['admin', 'seminarista', 'tesorero']);
      }).not.toThrow();
    });

    it('should deny if role is not in allowed roles array', () => {
      expect(() => {
        validatePermissions('externo', ['admin', 'seminarista']);
      }).toThrow();
    });
  });
});
