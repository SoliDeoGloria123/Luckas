import React from 'react';
import Dashboard from './Dashboard';

const DashboardSeminarista = () => {
  // Dashboard para seminarista - puede crear solicitudes, inscripciones y reservas, pero no modificar ni eliminar
  return (
    <Dashboard 
      userRole="seminarista"
      readOnly={false}
      canCreate={true}
      canEdit={false}
      canDelete={false}
    />
  );
};

export default DashboardSeminarista;
