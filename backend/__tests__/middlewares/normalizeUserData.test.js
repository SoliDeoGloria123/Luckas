const normalizeUserData = require('../../middlewares/normalizeUserData');

describe('NormalizeUserData Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {};
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should normalize tipoDocumento to full name', () => {
    req.body = {
      tipoDocumento: 'CC'
    };

    normalizeUserData(req, res, next);

    expect(req.body.tipoDocumento).toBe('Cédula de ciudadanía');
    expect(next).toHaveBeenCalled();
  });

  it('should normalize CE to Cédula de extranjería', () => {
    req.body = {
      tipoDocumento: 'CE'
    };

    normalizeUserData(req, res, next);

    expect(req.body.tipoDocumento).toBe('Cédula de extranjería');
    expect(next).toHaveBeenCalled();
  });

  it('should normalize TI to Tarjeta de identidad', () => {
    req.body = {
      tipoDocumento: 'TI'
    };

    normalizeUserData(req, res, next);

    expect(req.body.tipoDocumento).toBe('Tarjeta de identidad');
    expect(next).toHaveBeenCalled();
  });

  it('should keep Pasaporte unchanged', () => {
    req.body = {
      tipoDocumento: 'Pasaporte'
    };

    normalizeUserData(req, res, next);

    expect(req.body.tipoDocumento).toBe('Pasaporte');
    expect(next).toHaveBeenCalled();
  });

  it('should handle missing tipoDocumento', () => {
    req.body = {};

    normalizeUserData(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
