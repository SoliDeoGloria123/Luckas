import React from 'react';
import './PulsingCircle.css';

const PulsingCircle = ({ 
  className = '', 
  size = 200, 
  position = 'bottom-right',
  text = 'EDUCACIÓN • INNOVACIÓN • FUTURO • TRANSFORMACIÓN •',
  centerIcon = '→'
}) => {
  const positionClasses = {
    'bottom-right': 'pulsing-circle-bottom-right',
    'bottom-left': 'pulsing-circle-bottom-left',
    'top-right': 'pulsing-circle-top-right',
    'top-left': 'pulsing-circle-top-left',
  };

  return (
    <div 
      className={`pulsing-circle ${positionClasses[position]} ${className}`}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        '--circle-size': `${size}px`
      }}
    >
      {/* Texto rotatorio */}
      <div className="pulsing-circle-text">
        <svg viewBox={`0 0 ${size} ${size}`} className="rotating-text">
          <path
            id="circle-path"
            d={`M ${size/2}, ${size/2} m -${size/2 - 40}, 0 a ${size/2 - 40},${size/2 - 40} 0 1,1 ${size - 80},0 a ${size/2 - 40},${size/2 - 40} 0 1,1 -${size - 80},0`}
            fill="none"
          />
          <text className="circle-text">
            <textPath href="#circle-path" startOffset="0%">
              {text}
            </textPath>
          </text>
        </svg>
      </div>
      
      {/* Centro del círculo */}
      <div className="pulsing-circle-center">
        {centerIcon}
      </div>
      
      {/* Efectos de pulso */}
      <div className="pulse-ring pulse-ring-1"></div>
      <div className="pulse-ring pulse-ring-2"></div>
      <div className="pulse-ring pulse-ring-3"></div>
    </div>
  );
};

export default PulsingCircle;
