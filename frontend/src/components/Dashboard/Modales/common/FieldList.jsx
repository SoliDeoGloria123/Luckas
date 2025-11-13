import React from 'react';
import PropTypes from 'prop-types';
import { Plus, Trash2 } from 'lucide-react';

const FieldList = ({ items, onChangeItem, onAddItem, onRemoveItem, placeholderPrefix }) => (
  <div>
    {items.map((item, index) => (
      <div key={item.id || index} className="flex gap-2 mb-2">
        <input
          id={`${placeholderPrefix.toLowerCase()}-${index}`}
          type="text"
          value={item.value}
          onChange={(e) => onChangeItem(index, e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={`${placeholderPrefix} ${index + 1}`}
        />
        {items.length > 1 && (
          <button
            type="button"
            onClick={() => onRemoveItem(index)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    ))}
    <button
      type="button"
      onClick={onAddItem}
      className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
    >
      <Plus size={16} /> Agregar {placeholderPrefix.toLowerCase()}
    </button>
  </div>
);

FieldList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), value: PropTypes.string })).isRequired,
  onChangeItem: PropTypes.func.isRequired,
  onAddItem: PropTypes.func.isRequired,
  onRemoveItem: PropTypes.func.isRequired,
  placeholderPrefix: PropTypes.string.isRequired
};

export default FieldList;
