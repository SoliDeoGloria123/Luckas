import React from 'react';
import PropTypes from 'prop-types';

const FilterButtonsSeminarista = ({ 
  activeFilter, 
  onFilterChange, 
  filterOptions = [
    { value: 'Todas', label: 'Todas' },
    { value: 'Confirmada', label: 'Confirmada' },
    { value: 'Pendiente', label: 'Pendiente' },
    { value: 'Cancelada', label: 'Cancelada' }
  ]
}) => {
  return (
    <div className="filters-card-inscripciones-semianrista">
      <div className="filters-content-inscripciones-semianrista">
        <span className="filter-label-inscripciones-semianrista">Filtrar por estado:</span>
        <div className="filter-buttons-inscripciones-semianrista">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              className={`filter-btn-inscripciones-semianrista ${activeFilter === option.value ? 'active' : ''}`}
              onClick={() => onFilterChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

FilterButtonsSeminarista.propTypes = {
  activeFilter: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired
  }))
};

export default FilterButtonsSeminarista;