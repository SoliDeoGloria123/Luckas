import React from 'react';
import PropTypes from 'prop-types';

const Field = ({ id, label, isEditing, value, onChange, type = 'text', options, placeholder }) => {
  let content = null;

  if (isEditing) {
    if (options) {
      content = (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {options.map((opt) => (
            <option key={opt.value ?? opt} value={opt.value ?? opt}>
              {opt.label ?? opt}
            </option>
          ))}
        </select>
      );
    } else {
      content = (
        <input
          id={id}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      );
    }
  } else {
    content = <p className="text-gray-900 py-3">{type === 'date' && value ? new Date(value).toLocaleDateString() : value}</p>;
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      {content}
    </div>
  );
};

Field.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  isEditing: PropTypes.bool.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};

export default Field;
