import React from 'react';
import PropTypes from 'prop-types';

const SearchAndFilters = ({ 
  searchPlaceholder = "Buscar...", 
  searchValue = "", 
  onSearchChange,
  filters = []
}) => {
  return (
    <section className="filtros-section-admin">
      <div className="busqueda-contenedor">
        <i className="fas fa-search"></i>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          className="input-busqueda"
        />
      </div>
      {filters.length > 0 && (
        <div className="filtro-grupo-admin">
          {filters.map((filter, index) => (
            <select 
              key={`filter-${filter.value || index}-${filter.options?.[0]?.value || 'default'}`}
              className="filtro-dropdown"
              value={filter.value}
              onChange={filter.onChange}
            >
              {filter.options.map((option) => (
                <option key={`option-${option.value}-${option.label}`} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
        </div>
      )}
    </section>
  );
};

SearchAndFilters.propTypes = {
  searchPlaceholder: PropTypes.string,
  searchValue: PropTypes.string,
  onSearchChange: PropTypes.func,
  filters: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string,
      label: PropTypes.string
    }))
  }))
};

export default SearchAndFilters;