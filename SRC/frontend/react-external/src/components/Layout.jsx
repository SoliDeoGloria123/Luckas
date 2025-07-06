import React from 'react';

const Layout = ({ children }) => {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <h3>Navegación</h3>
        <p>Sidebar placeholder</p>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

export default Layout;