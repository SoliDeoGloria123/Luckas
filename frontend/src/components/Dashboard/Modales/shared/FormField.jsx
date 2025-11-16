import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({ id, label, type = 'text', value, onChange, required = false, placeholder, children }) => {
  return (
    <div className="form-grupo-admin">
      <label htmlFor={id}>{label}</label>
      {type === 'select' ? (
        <select id={id} value={value} onChange={onChange} required={required}>
          {children}
        </select>
      ) : (
        <input id={id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
      )}
    </div>
  );
};

FormField.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  children: PropTypes.node,
};

export default FormField;
