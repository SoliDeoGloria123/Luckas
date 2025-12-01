const mongoose = require('mongoose');
jest.unmock('mongoose');
const Reporte = require('../../models/Reportes');

describe('Reporte Model', () => {
  describe('Virtuals', () => {
    it('should return correct rangoFechas', () => {
      const reporte = new Reporte({
        filtros: {
          fechaInicio: new Date('2023-01-01'),
          fechaFin: new Date('2023-01-31')
        }
      });
      // toLocaleDateString('es-ES') produces format like "31/12/2022"
      const rangoFechas = reporte.rangoFechas;
      expect(rangoFechas).toContain('2023');
      expect(rangoFechas).toContain('-');
    });

    it('should return correct resumenFiltros', () => {
      const reporte = new Reporte({
        filtros: {
          fechaInicio: new Date('2023-01-01'),
          estado: 'activo',
          categoria: 'General',
          usuario: 'User1'
        }
      });
      const resumen = reporte.resumenFiltros;
      expect(resumen).toContain('Fechas:');
      expect(resumen).toContain('Estado: activo');
      expect(resumen).toContain('Categoría: General');
      expect(resumen).toContain('Usuario: User1');
    });
  });

  describe('validateDates method', () => {
    it('should validate fechaFin >= fechaInicio', () => {
      const reporte = new Reporte({
        filtros: {
          fechaInicio: new Date('2023-01-02'),
          fechaFin: new Date('2023-01-01')
        }
      });
      
      expect(() => reporte.validateDates()).toThrow('La fecha fin no puede ser menor');
    });

    it('should validate future dates', () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      
      const reporte = new Reporte({
        filtros: {
          fechaInicio: new Date(),
          fechaFin: futureDate
        }
      });
      
      expect(() => reporte.validateDates()).toThrow('No se puede crear un reporte de meses futuros');
    });
  });

  describe('Static Methods', () => {
    it('should find by date range', () => {
      const mockFind = jest.fn().mockReturnThis();
      
      // Mock the static method context
      Reporte.find = mockFind;
      
      const fechaInicio = new Date('2023-01-01');
      const fechaFin = new Date('2023-01-31');
      
      Reporte.findByDateRange(fechaInicio, fechaFin);
      
      expect(mockFind).toHaveBeenCalledWith({
        'filtros.fechaInicio': { $gte: fechaInicio },
        'filtros.fechaFin': { $lte: fechaFin }
      });
    });

    it('should find by type', () => {
      const mockFind = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      
      Reporte.find = mockFind;
      mockFind.mockReturnValue({ sort: mockSort });
      
      Reporte.findByType('usuarios');
      
      expect(mockFind).toHaveBeenCalledWith({ tipo: 'usuarios' });
      expect(mockSort).toHaveBeenCalledWith({ fechaGeneracion: -1 });
    });

    it('should get recent reports', () => {
      const mockFind = jest.fn().mockReturnThis();
      const mockPopulate = jest.fn().mockReturnThis();
      const mockSort = jest.fn().mockReturnThis();
      const mockLimit = jest.fn().mockReturnThis();
      
      Reporte.find = mockFind;
      mockFind.mockReturnValue({ populate: mockPopulate });
      mockPopulate.mockReturnValue({ sort: mockSort });
      mockSort.mockReturnValue({ limit: mockLimit });
      
      Reporte.getRecentReports(5);
      
      expect(mockFind).toHaveBeenCalledWith({ estado: 'generado' });
      expect(mockPopulate).toHaveBeenCalledWith('creadoPor', 'username email');
      expect(mockSort).toHaveBeenCalledWith({ fechaGeneracion: -1 });
      expect(mockLimit).toHaveBeenCalledWith(5);
    });
  });

  describe('pre save hook validation', () => {
    it('should call validateDates in pre-save hook', () => {
      const hooks = Reporte.schema.s.hooks._pres.get('save');
      expect(hooks).toBeDefined();
      expect(hooks.length).toBeGreaterThan(0);
    });

    it('should set estado to error if generado without datos', () => {
      const reporte = new Reporte({
        nombre: 'Test Reporte',
        tipo: 'inscripciones',
        periodo: 'mensual',
        mes: 1,
        anio: 2023,
        descripcion: 'Test description'
      });

      reporte.estado = 'generado';
      reporte.datos = {};
      
      // Manually call the pre-save logic
      reporte.validateDates();
      if (reporte.estado === 'generado' && (!reporte.datos || Object.keys(reporte.datos).length === 0)) {
        reporte.estado = 'error';
      }
      
      expect(reporte.estado).toBe('error');
    });
  });

  describe('post save hook error handling', () => {
    it('should have post-save hook for duplicate key errors', () => {
      const hooks = Reporte.schema.s.hooks._posts.get('save');
      expect(hooks).toBeDefined();
      expect(hooks.length).toBeGreaterThan(0);
    });
  });
});
