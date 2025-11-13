import React from 'react';
import PropTypes from 'prop-types';

const ReportFilters = ({ form, onChange, maxDate }) => (
  <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4 mt-6">
    <div className="flex items-center gap-2 mb-2">
      {/* Icon passed from parent if needed */}
      <h3 className="font-semibold text-gray-900">Filtros</h3>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <label htmlFor="fechaInicio" className="mb-1 block text-sm font-medium text-gray-700">Fecha Desde</label>
        <input
          id="fechaInicio"
          type="date"
          name="fechaInicio"
          value={form.fechaInicio}
          onChange={onChange}
          max={maxDate}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      <div>
        <label htmlFor="fechaFin" className="mb-1 block text-sm font-medium text-gray-700">Fecha Hasta</label>
        <input
          id="fechaFin"
          type="date"
          name="fechaFin"
          value={form.fechaFin}
          onChange={onChange}
          max={maxDate}
          className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {(form.tipo === "usuarios" || form.tipo === "reservas" || form.tipo === "solicitudes") && (
        <div>
          <label htmlFor="estado" className="mb-1 block text-sm font-medium text-gray-700">Estado</label>
          <select
            id="estado"
            name="estado"
            value={form.estado}
            onChange={onChange}
            className="h-10 w-full rounded-lg border border-gray-200 bg-white px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="">Sin filtro</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
            <option value="pendiente">Pendiente</option>
            <option value="finalizado">Finalizado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      )}
    </div>
  </div>
);

ReportFilters.propTypes = {
  form: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  maxDate: PropTypes.string
};

export default ReportFilters;
