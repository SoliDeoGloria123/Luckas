import React from 'react';
import PropTypes from 'prop-types';

const ToggleSwitch = ({ checked, onToggle, label, Icon }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      {Icon ? <Icon className="w-5 h-5 text-gray-400" /> : null}
      <span className="text-gray-700">{label}</span>
    </div>
    <button
      type="button"
      onClick={() => onToggle(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-green-600" : "bg-gray-200"}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  </div>
);

ToggleSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  Icon: PropTypes.elementType,
};

export default ToggleSwitch;
