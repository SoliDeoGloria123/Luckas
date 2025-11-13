import React from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash2 } from 'lucide-react';

const PensumList = ({ pensum, onChangePensum, onAddPensum, onRemovePensum }) => (
  <div>
    {pensum.map((modulo, index) => (
      <div key={modulo.id || index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        <input
          id={`modulo-nombre-${index}`}
          type="text"
          value={modulo.modulo}
          onChange={(e) => onChangePensum(index, 'modulo', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Nombre del módulo"
        />
        <input
          id={`modulo-descripcion-${index}`}
          type="text"
          value={modulo.descripcion}
          onChange={(e) => onChangePensum(index, 'descripcion', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descripción"
        />
        <div className="flex gap-2">
          <input
            id={`modulo-horas-${index}`}
            type="number"
            value={modulo.horas}
            onChange={(e) => onChangePensum(index, 'horas', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Horas"
            min="1"
          />
          {pensum.length > 1 && (
            <button
              type="button"
              onClick={() => onRemovePensum(index)}
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>
      </div>
    ))}
    <button
      type="button"
      onClick={onAddPensum}
      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
    >
      <Plus size={16} /> Agregar módulo
    </button>
  </div>
);

PensumList.propTypes = {
  pensum: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), modulo: PropTypes.string, descripcion: PropTypes.string, horas: PropTypes.oneOfType([PropTypes.string, PropTypes.number]) })).isRequired,
  onChangePensum: PropTypes.func.isRequired,
  onAddPensum: PropTypes.func.isRequired,
  onRemovePensum: PropTypes.func.isRequired
};

export default PensumList;
