const { normalizeTipoDocumento, TIPOS_DOCUMENTO_VALIDOS } = require('../../utils/userValidation');

describe('User Validation Utils', () => {
  describe('normalizeTipoDocumento', () => {
    it('should normalize "cedula de ciudadania" to proper format', () => {
      const result = normalizeTipoDocumento('cedula de ciudadania');
      expect(result).toBe('Cédula de ciudadanía');
    });

    it('should normalize "cedula de extranjeria" to proper format', () => {
      const result = normalizeTipoDocumento('cedula de extranjeria');
      expect(result).toBe('Cédula de extranjería');
    });

    it('should normalize "pasaporte" to proper format', () => {
      const result = normalizeTipoDocumento('pasaporte');
      expect(result).toBe('Pasaporte');
    });

    it('should normalize "tarjeta de identidad" to proper format', () => {
      const result = normalizeTipoDocumento('tarjeta de identidad');
      expect(result).toBe('Tarjeta de identidad');
    });

    it('should handle variations with tildes', () => {
      expect(normalizeTipoDocumento('cédula de ciudadania')).toBe('Cédula de ciudadanía');
      expect(normalizeTipoDocumento('cedula de ciudadanía')).toBe('Cédula de ciudadanía');
      expect(normalizeTipoDocumento('cédula de ciudadanía')).toBe('Cédula de ciudadanía');
    });

    it('should handle common typos', () => {
      expect(normalizeTipoDocumento('cedula de ciuania')).toBe('Cédula de ciudadanía');
      expect(normalizeTipoDocumento('cedula de ciudania')).toBe('Cédula de ciudadanía');
    });

    it('should trim whitespace', () => {
      const result = normalizeTipoDocumento('  pasaporte  ');
      expect(result).toBe('Pasaporte');
    });

    it('should return empty string for null/undefined', () => {
      expect(normalizeTipoDocumento(null)).toBe('');
      expect(normalizeTipoDocumento(undefined)).toBe('');
    });

    it('should return trimmed original value for unknown types', () => {
      const result = normalizeTipoDocumento('  Unknown Document  ');
      expect(result).toBe('Unknown Document');
    });
  });

  describe('TIPOS_DOCUMENTO_VALIDOS', () => {
    it('should contain all valid document types', () => {
      expect(TIPOS_DOCUMENTO_VALIDOS).toContain('Cédula de ciudadanía');
      expect(TIPOS_DOCUMENTO_VALIDOS).toContain('Cédula de extranjería');
      expect(TIPOS_DOCUMENTO_VALIDOS).toContain('Pasaporte');
      expect(TIPOS_DOCUMENTO_VALIDOS).toContain('Tarjeta de identidad');
    });

    it('should have exactly 4 valid types', () => {
      expect(TIPOS_DOCUMENTO_VALIDOS).toHaveLength(4);
    });
  });
});
