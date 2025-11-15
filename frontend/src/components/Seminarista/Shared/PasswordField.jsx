import React from 'react';
import PropTypes from 'prop-types';
import { Eye, EyeOff } from 'lucide-react';

const PasswordField = ({ id, label, value, onChange, show, toggleShow }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
      />
      <button
        type="button"
        onClick={() => toggleShow(!show)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </button>
    </div>
  </div>
);

PasswordField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  toggleShow: PropTypes.func.isRequired,
};

export default PasswordField;
