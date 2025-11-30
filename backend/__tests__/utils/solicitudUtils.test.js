const solicitudUtils = require('../../utils/solicitudUtils');

describe('Solicitud Utils', () => {
  describe('construirFiltros', () => {
    it('should return empty object if no query params', () => {
      const query = {};
      const result = solicitudUtils.construirFiltros(query);
      expect(result).toEqual({});
    });

    it('should filter by specific fields', () => {
      const query = {
        categoria: 'Mantenimiento',
        estado: 'Nueva',
        prioridad: 'Alta',
        responsable: 'user1'
      };
      const result = solicitudUtils.construirFiltros(query);
      expect(result).toEqual({
        categoria: 'Mantenimiento',
        estado: 'Nueva',
        prioridad: 'Alta',
        responsableAsignado: 'user1'
      });
    });

    it('should ignore "todos" values', () => {
      const query = {
        categoria: 'todos',
        estado: 'todos',
        prioridad: 'todos'
      };
      const result = solicitudUtils.construirFiltros(query);
      expect(result).toEqual({});
    });

    it('should filter by date range', () => {
      const query = {
        fechaDesde: '2023-01-01',
        fechaHasta: '2023-01-31'
      };
      const result = solicitudUtils.construirFiltros(query);
      expect(result.fechaSolicitud.$gte).toEqual(new Date('2023-01-01'));
      expect(result.fechaSolicitud.$lte).toEqual(new Date('2023-01-31'));
    });
  });

  describe('configurarPaginacion', () => {
    it('should return default pagination', () => {
      const query = {};
      const result = solicitudUtils.configurarPaginacion(query);
      expect(result).toEqual({ skip: 0, limit: 10, page: 1 });
    });

    it('should return custom pagination', () => {
      const query = { page: '2', limit: '20' };
      const result = solicitudUtils.configurarPaginacion(query);
      expect(result).toEqual({ skip: 20, limit: 20, page: 2 });
    });
  });

  describe('generarPipelineEstadisticasSolicitudes', () => {
    it('should generate pipeline with filters', () => {
      const filtros = { estado: 'Nueva' };
      const pipeline = solicitudUtils.generarPipelineEstadisticasSolicitudes(filtros);

      expect(pipeline).toHaveLength(2);
      expect(pipeline[0]).toEqual({ $match: filtros });
      expect(pipeline[1].$group).toBeDefined();
      expect(pipeline[1].$group.nuevas).toBeDefined();
      expect(pipeline[1].$group.enRevision).toBeDefined();
      expect(pipeline[1].$group.urgentes).toBeDefined();
      expect(pipeline[1].$group.completadas).toBeDefined();
    });
  });
});
