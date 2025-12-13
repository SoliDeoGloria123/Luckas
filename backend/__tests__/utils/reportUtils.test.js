const reportUtils = require('../../utils/reportUtils');

describe('Report Utils', () => {
  describe('construirFiltrosFecha', () => {
    it('should return empty object if no dates provided', () => {
      const query = {};
      const result = reportUtils.construirFiltrosFecha(query);
      expect(result).toEqual({});
    });

    it('should return filter with start date', () => {
      const query = { fechaInicio: '2023-01-01' };
      const result = reportUtils.construirFiltrosFecha(query);
      expect(result.fechaCreacion.$gte).toEqual(new Date('2023-01-01'));
      expect(result.fechaCreacion.$lte).toBeUndefined();
    });

    it('should return filter with end date', () => {
      const query = { fechaFin: '2023-01-31' };
      const result = reportUtils.construirFiltrosFecha(query);
      expect(result.fechaCreacion.$lte).toEqual(new Date('2023-01-31'));
      expect(result.fechaCreacion.$gte).toBeUndefined();
    });

    it('should return filter with both dates', () => {
      const query = { fechaInicio: '2023-01-01', fechaFin: '2023-01-31' };
      const result = reportUtils.construirFiltrosFecha(query);
      expect(result.fechaCreacion.$gte).toEqual(new Date('2023-01-01'));
      expect(result.fechaCreacion.$lte).toEqual(new Date('2023-01-31'));
    });
  });

  describe('generarEstadisticasAgregadas', () => {
    it('should generate aggregated statistics', async () => {
      const mockModel = {
        aggregate: jest.fn().mockResolvedValue([{ total: 10 }])
      };
      const filtros = { estado: 'activo' };
      const agregaciones = [{ $count: 'total' }];

      const result = await reportUtils.generarEstadisticasAgregadas(mockModel, filtros, agregaciones);

      expect(mockModel.aggregate).toHaveBeenCalledWith([
        { $match: filtros },
        ...agregaciones
      ]);
      expect(result).toEqual([{ total: 10 }]);
    });

    it('should handle errors', async () => {
      const mockModel = {
        aggregate: jest.fn().mockRejectedValue(new Error('DB Error'))
      };
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      const result = await reportUtils.generarEstadisticasAgregadas(mockModel, {});

      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('construirRespuestaReporte', () => {
    it('should build standard report response', () => {
      const data = [{ id: 1 }, { id: 2 }];
      const estadisticas = { total: 2 };

      const result = reportUtils.construirRespuestaReporte(data, estadisticas);

      expect(result).toEqual(expect.objectContaining({
        success: true,
        data,
        estadisticas,
        metadata: { total: 2 }
      }));
      expect(result.fechaGeneracion).toBeInstanceOf(Date);
    });

    it('should handle non-array data', () => {
      const data = { id: 1 };
      const result = reportUtils.construirRespuestaReporte(data);

      expect(result.metadata.total).toBe(0);
    });
  });
});
