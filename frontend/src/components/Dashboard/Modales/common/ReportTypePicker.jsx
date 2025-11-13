import React from 'react';
import PropTypes from 'prop-types';

const ReportTypePicker = ({ types, selected, onSelect }) => {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {types.map((type) => {
        const Icon = type.icon;
        return (
          <button
            type="button"
            key={type.value}
            id={type.value}
            aria-label={type.label}
            onClick={() => onSelect(type.value)}
            className={`flex items-center gap-3 rounded-lg border-2 p-3 text-left transition-all ${selected === type.value
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
              }`}
          >
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${selected === type.value ? "bg-blue-600" : "bg-gray-100"
                }`}
            >
              <Icon className={`h-5 w-5 ${selected === type.value ? "text-white" : "text-gray-600"}`} />
            </div>
            <span className="font-medium text-gray-900">{type.label}</span>
          </button>
        );
      })}
    </div>
  );
};

ReportTypePicker.propTypes = {
  types: PropTypes.arrayOf(PropTypes.shape({ value: PropTypes.string.isRequired, label: PropTypes.string.isRequired, icon: PropTypes.elementType.isRequired })).isRequired,
  selected: PropTypes.string,
  onSelect: PropTypes.func.isRequired
};

export default ReportTypePicker;
