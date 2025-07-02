const { normalizeTipoDocumento } = require('../utils/userValidation');

/**
 * Middleware para normalizar datos de usuario antes del procesamiento
 */
const normalizeUserData = (req, res, next) => {
  // Normalizar tipoDocumento si está presente en el cuerpo de la petición
  if (req.body.tipoDocumento) {
    req.body.tipoDocumento = normalizeTipoDocumento(req.body.tipoDocumento);
    console.log('[Middleware] Tipo de documento normalizado:', req.body.tipoDocumento);
  }
  
  next();
};

module.exports = normalizeUserData;
