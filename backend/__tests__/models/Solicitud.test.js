const mongoose = require('mongoose');
jest.unmock('mongoose');
const Solicitud = require('../../models/Solicitud');

describe('Solicitud Model', () => {
  describe('Validation', () => {
    it('should require modeloReferencia when tipoSolicitud is Inscripción', () => {
      const solicitud = new Solicitud({
        solicitante: '507f1f77bcf86cd799439011',
        titulo: 'Test',
        correo: 'test@test.com',
        telefono: '123456',
        tipoSolicitud: 'Inscripción',
        categoria: '507f1f77bcf86cd799439012',
        descripcion: 'Test description',
        responsable: '507f1f77bcf86cd799439013'
        // modeloReferencia missing
      });

      const err = solicitud.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.modeloReferencia).toBeDefined();
    });

    it('should require modeloReferencia when tipoSolicitud is Hospedaje', () => {
      const solicitud = new Solicitud({
        solicitante: '507f1f77bcf86cd799439011',
        titulo: 'Test',
        correo: 'test@test.com',
        telefono: '123456',
        tipoSolicitud: 'Hospedaje',
        categoria: '507f1f77bcf86cd799439012',
        descripcion: 'Test description',
        responsable: '507f1f77bcf86cd799439013'
        // modeloReferencia missing
      });

      const err = solicitud.validateSync();
      expect(err).toBeDefined();
      expect(err.errors.modeloReferencia).toBeDefined();
    });

    it('should not require modeloReferencia when tipoSolicitud is Otra', () => {
      const solicitud = new Solicitud({
        solicitante: '507f1f77bcf86cd799439011',
        titulo: 'Test',
        correo: 'test@test.com',
        telefono: '123456',
        tipoSolicitud: 'Otra',
        categoria: '507f1f77bcf86cd799439012',
        descripcion: 'Test description',
        responsable: '507f1f77bcf86cd799439013'
        // modeloReferencia not required
      });

      const err = solicitud.validateSync();
      expect(err).toBeUndefined();
    });

    it('should validate all required fields', () => {
      const solicitud = new Solicitud();
      const err = solicitud.validateSync();
      
      expect(err.errors.solicitante).toBeDefined();
      expect(err.errors.titulo).toBeDefined();
      expect(err.errors.correo).toBeDefined();
      expect(err.errors.telefono).toBeDefined();
      expect(err.errors.tipoSolicitud).toBeDefined();
      expect(err.errors.categoria).toBeDefined();
      expect(err.errors.descripcion).toBeDefined();
      expect(err.errors.responsable).toBeDefined();
    });
  });
});
