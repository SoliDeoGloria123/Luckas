import React from 'react';
import Dashboard from './Dashboard';

const DashboardExterno = () => {
  // Dashboard para usuario externo - solo lectura
  return (
    <Dashboard 
      userRole="externo"
      readOnly={true}
    />
  );
};

export default DashboardExterno;
