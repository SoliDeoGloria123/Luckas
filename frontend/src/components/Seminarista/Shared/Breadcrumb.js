import React from 'react';

const Breadcrumb = ({ path }) => {
  return (
    <nav className="breadcrumb">
      {path.map((item, index) => (
        <span key={index} className="breadcrumb-item">
          {item}
          {index < path.length - 1 && (
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              className="breadcrumb-separator"
            >
              <path d="M9 18l6-6-6-6"/>
            </svg>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
