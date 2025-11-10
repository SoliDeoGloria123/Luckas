import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faTimesCircle,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';

const StatsGridSeminarista = ({ stats, data, type = 'reservas' }) => {
  // Si se pasan stats directamente, usarlos, sino calcular
  const finalStats = stats || (() => {
    if (!Array.isArray(data)) return { confirmadas: 0, pendientes: 0, canceladas: 0, total: 0 };
    
    return {
      confirmadas: data.filter(item => item.estado === 'Confirmada' || item.estado === 'confirmada').length,
      pendientes: data.filter(item => item.estado === 'Pendiente' || item.estado === 'pendiente').length,
      canceladas: data.filter(item => item.estado === 'Cancelada' || item.estado === 'cancelada').length,
      total: data.length
    };
  })();

  // Si se pasa un array de stats con configuración personalizada
  if (Array.isArray(stats)) {
    return (
      <div className="stats-grid-inscripciones-semianrista">
        {stats.map((stat, index) => (
          <div key={`stat-${index}-${stat.label}`} className="stat-card-misolicitudes">
            <div className={`stat-icon-inscripciones-semianrista ${stat.className}`}>
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div className="stat-content">
              <div className="stat-number">{stat.count}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const getLabels = () => {
    switch (type) {
      case 'inscripciones':
        return { confirmadas: 'Confirmadas', pendientes: 'Pendientes', canceladas: 'Canceladas', total: 'Total' };
      case 'solicitudes':
        return { confirmadas: 'Aprobadas', pendientes: 'Pendientes', canceladas: 'Rechazadas', total: 'Total' };
      default:
        return { confirmadas: 'Confirmadas', pendientes: 'Pendientes', canceladas: 'Canceladas', total: 'Total' };
    }
  };

  const labels = getLabels();

  return (
    <div className="stats-grid-inscripciones-semianrista">
      <div className="stat-card-misolicitudes">
        <div className="stat-icon-inscripciones-semianrista confirmed">
          <FontAwesomeIcon icon={faCheckCircle} />
        </div>
        <div className="stat-content">
          <div className="stat-number">{finalStats.confirmadas}</div>
          <div className="stat-label">{labels.confirmadas}</div>
        </div>
      </div>

      <div className="stat-card-misolicitudes">
        <div className="stat-icon-inscripciones-semianrista pending">
          <FontAwesomeIcon icon={faExclamationTriangle} />
        </div>
        <div className="stat-content">
          <div className="stat-number">{finalStats.pendientes}</div>
          <div className="stat-label">{labels.pendientes}</div>
        </div>
      </div>

      <div className="stat-card-misolicitudes">
        <div className="stat-icon-inscripciones-semianrista cancelled">
          <FontAwesomeIcon icon={faTimesCircle} />
        </div>
        <div className="stat-content">
          <div className="stat-number">{finalStats.canceladas}</div>
          <div className="stat-label">{labels.canceladas}</div>
        </div>
      </div>

      <div className="stat-card-misolicitudes">
        <div className="stat-icon-inscripciones-semianrista total">
          <FontAwesomeIcon icon={faCalendar} />
        </div>
        <div className="stat-content">
          <div className="stat-number">{finalStats.total}</div>
          <div className="stat-label">{labels.total}</div>
        </div>
      </div>
    </div>
  );
};

StatsGridSeminarista.propTypes = {
  stats: PropTypes.oneOfType([
    PropTypes.shape({
      confirmadas: PropTypes.number,
      pendientes: PropTypes.number,
      canceladas: PropTypes.number,
      total: PropTypes.number
    }),
    PropTypes.arrayOf(PropTypes.shape({
      icon: PropTypes.object.isRequired,
      count: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired,
      className: PropTypes.string
    }))
  ]),
  data: PropTypes.array,
  type: PropTypes.oneOf(['reservas', 'inscripciones', 'solicitudes'])
};

export default StatsGridSeminarista;