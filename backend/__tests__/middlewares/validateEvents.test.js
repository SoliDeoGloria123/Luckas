const { validarCategorizacion } = require('../../middlewares/validateEvents');

describe('ValidateEvents Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        categoria: 'Conferencia',
        subCategoria: 'Tech',
        etiquetas: ['AI', 'ML']
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should call next if all inputs are valid', () => {
    validarCategorizacion(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('should return 400 if category is invalid', () => {
    req.body.categoria = 'InvalidCategory';
    validarCategorizacion(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Categoría no válida'
    }));
  });

  it('should return 400 if subCategory exceeds 50 chars', () => {
    req.body.subCategoria = 'a'.repeat(51);
    validarCategorizacion(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'La subcategoría no puede exceder 50 caracteres'
    }));
  });

  it('should return 400 if etiquetas is not an array', () => {
    req.body.etiquetas = 'not-an-array';
    validarCategorizacion(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Las etiquetas deben ser un array'
    }));
  });

  it('should allow empty subCategoria and etiquetas', () => {
    req.body.subCategoria = undefined;
    req.body.etiquetas = undefined;
    validarCategorizacion(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
