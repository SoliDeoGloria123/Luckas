import React from 'react';
import PropTypes from 'prop-types';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  onPrevious, 
  onNext,
  className = ''
}) => {
  return (
    <div className={`pagination-admin flex items-center justify-center gap-4 mt-6 ${className}`}>
      <button
        className="pagination-btn-admin"
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i>
      </button>
      
      <span className="pagination-info-admin">
        Página {currentPage} de {totalPages}
      </span>
      
      <button
        className="pagination-btn-admin"
        onClick={onNext}
        disabled={currentPage === totalPages || totalPages === 0}
      >
        <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Pagination;