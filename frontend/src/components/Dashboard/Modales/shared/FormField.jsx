import React from 'react';
import PropTypes from 'prop-types';

const FormField = ({ id, label, type = 'text', value, onChange, required = false, placeholder, children, inputProps = {}, name }) => {
  return (
    <div className="form-grupo-admin">
      <label htmlFor={id}>{label}</label>
      {type === 'select' ? (
        <select id={id} name={name || id} value={value} onChange={onChange} required={required} {...inputProps}>
          {children}
        </select>
      ) : (
        <input id={id} name={name || id} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} {...inputProps} />
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
  inputProps: PropTypes.object,
  name: PropTypes.string,
};

export default FormField;
