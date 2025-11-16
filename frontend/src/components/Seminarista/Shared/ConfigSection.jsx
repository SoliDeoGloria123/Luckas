import React from 'react';
import PropTypes from 'prop-types';

const ConfigSection = ({ iconClass, title, settings }) => {
  return (
    <section className="config-section">
      <div className="section-header">
        <div className={`section-icon ${iconClass}`}></div>
        <h2 className="section-title">{title}</h2>
      </div>
      <div className="section-content">
        {settings.map(({ name, description, defaultChecked, onChange }) => (
          <div className="setting-item" key={name}>
            <div className="setting-info">
              <h3>{name}</h3>
              <p>{description}</p>
            </div>
            <label className="toggle-switch">
              <span className="sr-only">Activar {name}</span>
              <input
                type="checkbox"
                defaultChecked={defaultChecked}
                onChange={onChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        ))}
      </div>
    </section>
  );
};

ConfigSection.propTypes = {
  iconClass: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  settings: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      defaultChecked: PropTypes.bool,
      onChange: PropTypes.func.isRequired,
    })
  ).isRequired,
};

export default ConfigSection;