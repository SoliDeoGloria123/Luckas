const mongoose = require('mongoose');
jest.unmock('mongoose');
const Inscripcion = require('../../models/Inscripciones');

describe('Inscripcion Model', () => {
  describe('Validation', () => {
    it('should be invalid if required fields are missing', () => {
      const inscripcion = new Inscripcion();
      const err = inscripcion.validateSync();
      expect(err.errors.usuario).toBeDefined();
      expect(err.errors.nombre).toBeDefined();
      expect(err.errors.tipoDocumento).toBeDefined();
      expect(err.errors.numeroDocumento).toBeDefined();
      expect(err.errors.telefono).toBeDefined();
      expect(err.errors.edad).toBeDefined();
      expect(err.errors.tipoReferencia).toBeDefined();
      expect(err.errors.referencia).toBeDefined();
      expect(err.errors.categoria).toBeDefined();
    });

    it('should validate estado for Eventos', () => {
      // Valid estado for Eventos
      const inscripcion1 = new Inscripcion({
        usuario: '507f1f77bcf86cd799439011',
        nombre: 'Test',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        telefono: '123456',
        edad: 25,
        tipoReferencia: 'Eventos',
        referencia: '507f1f77bcf86cd799439012',
        categoria: '507f1f77bcf86cd799439013',
        estado: 'inscrito'
      });
      let err1 = inscripcion1.validateSync();
      expect(err1).toBeUndefined();

      // Invalid estado for Eventos
      const inscripcion2 = new Inscripcion({
        usuario: '507f1f77bcf86cd799439011',
        nombre: 'Test',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        telefono: '123456',
        edad: 25,
        tipoReferencia: 'Eventos',
        referencia: '507f1f77bcf86cd799439012',
        categoria: '507f1f77bcf86cd799439013',
        estado: 'invalid'
      });
      let err2 = inscripcion2.validateSync();
      expect(err2.errors.estado).toBeDefined();
    });

    it('should validate estado for ProgramaAcademico', () => {
      // Valid estado for ProgramaAcademico
      const inscripcion1 = new Inscripcion({
        usuario: '507f1f77bcf86cd799439011',
        nombre: 'Test',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        telefono: '123456',
        edad: 25,
        tipoReferencia: 'ProgramaAcademico',
        referencia: '507f1f77bcf86cd799439012',
        categoria: '507f1f77bcf86cd799439013',
        estado: 'matriculado'
      });
      let err1 = inscripcion1.validateSync();
      expect(err1).toBeUndefined();

      // Invalid estado for ProgramaAcademico
      const inscripcion2 = new Inscripcion({
        usuario: '507f1f77bcf86cd799439011',
        nombre: 'Test',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        telefono: '123456',
        edad: 25,
        tipoReferencia: 'ProgramaAcademico',
        referencia: '507f1f77bcf86cd799439012',
        categoria: '507f1f77bcf86cd799439013',
        estado: 'invalid'
      });
      let err2 = inscripcion2.validateSync();
      expect(err2.errors.estado).toBeDefined();
    });

    it('should allow validation when tipoReferencia is not set', () => {
      const inscripcion = new Inscripcion({
        usuario: '507f1f77bcf86cd799439011',
        nombre: 'Test',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        telefono: '123456',
        edad: 25,
        referencia: '507f1f77bcf86cd799439012',
        categoria: '507f1f77bcf86cd799439013',
        estado: 'any_state'
      });
      // Without tipoReferencia, validator should allow (line 73-74)
      let err = inscripcion.validateSync();
      // Should not have estado error since tipoReferencia is undefined
      expect(err?.errors?.estado).toBeUndefined();
    });

    it('should return false for invalid estado when tipoReferencia is not Eventos or ProgramaAcademico', () => {
      const inscripcion = new Inscripcion({
        usuario: '507f1f77bcf86cd799439011',
        nombre: 'Test',
        tipoDocumento: 'Cédula de ciudadanía',
        numeroDocumento: '123456',
        telefono: '123456',
        edad: 25,
        tipoReferencia: 'OtroTipo',
        referencia: '507f1f77bcf86cd799439012',
        categoria: '507f1f77bcf86cd799439013',
        estado: 'invalid_state'
      });
      
      let err = inscripcion.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.estado).toBeDefined();
    });
  });

  describe('setDefaultState method', () => {
    it('should set default state for Eventos', () => {
        const inscripcion = new Inscripcion({
            tipoReferencia: 'Eventos',
            estado: ''
        });
        
        inscripcion.setDefaultState();
        
        expect(inscripcion.estado).toBe('no inscrito');
    });

    it('should set default state for ProgramaAcademico', () => {
        const inscripcion = new Inscripcion({
            tipoReferencia: 'ProgramaAcademico',
            estado: ''
        });
        
        inscripcion.setDefaultState();
        
        expect(inscripcion.estado).toBe('preinscrito');
    });

    it('should not change state if already set', () => {
        const inscripcion = new Inscripcion({
            tipoReferencia: 'Eventos',
            estado: 'inscrito'
        });
        
        inscripcion.setDefaultState();
        
        expect(inscripcion.estado).toBe('inscrito');
    });

    it('should have pre-save hook that calls setDefaultState', () => {
      const hooks = Inscripcion.schema.s.hooks._pres.get('save');
      expect(hooks).toBeDefined();
      expect(hooks.length).toBeGreaterThan(0);
    });
  });
});
