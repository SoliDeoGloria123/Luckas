/**
 * Utilidades para normalización de datos de usuario
 */

// Función para normalizar el tipo de documento
const normalizeTipoDocumento = (tipoDocumento) => {
  if (!tipoDocumento) return '';
  
  // Normalizar la cadena: trim, lowercase, y normalizar caracteres unicode
  let tipo = tipoDocumento.trim().toLowerCase().normalize('NFD').replaceAll(/[\u0300-\u036f]/g, '');
  
  // Mapeo de variaciones comunes a valores válidos
  const mappings = {
    // Sin tildes
    'cedula de ciudadania': 'Cédula de ciudadanía',
    'cedula de extranjeria': 'Cédula de extranjería',
    'pasaporte': 'Pasaporte',
    'tarjeta de identidad': 'Tarjeta de identidad',
    // Con diferentes combinaciones de tildes
    'cédula de ciudadania': 'Cédula de ciudadanía',
    'cedula de ciudadanía': 'Cédula de ciudadanía', 
    'cédula de ciudadanía': 'Cédula de ciudadanía',
    'cédula de extranjeria': 'Cédula de extranjería',
    'cedula de extranjería': 'Cédula de extranjería',
    'cédula de extranjería': 'Cédula de extranjería',
    // Errores ortográficos comunes
    'cedula de ciuania': 'Cédula de ciudadanía',
    'cedula de ciudania': 'Cédula de ciudadanía',
    'cedula de cíudania': 'Cédula de ciudadanía',
    'cédula de cíudania': 'Cédula de ciudadanía'
  };
  
  const valorNormalizado = mappings[tipo];
  if (valorNormalizado) {
    return valorNormalizado;
  }
  
  // Si no se encuentra en el mapeo, devolver el valor original con trim
  return tipoDocumento.trim();
};

// Valores válidos para tipo de documento (para validación)
const TIPOS_DOCUMENTO_VALIDOS = [
  'Cédula de ciudadanía',
  'Cédula de extranjería', 
  'Pasaporte',
  'Tarjeta de identidad'
];

module.exports = {
  normalizeTipoDocumento,
  TIPOS_DOCUMENTO_VALIDOS
};
