import React, { useState } from 'react';
import CategorizacionModal from '../modal/CategorizacionModal';


const Gestioncategorizacion = () => {
  // Datos de ejemplo
  const users = [
    {
      id: "GSI0405100d800b0f9b2c5656",
      username: "pedrasa",
      email: "admin@gmail.com",
      phone: "3115524272",
      docType: "Cédula de ciudadanía",
      docNumber: "117200207",
      role: "(Administrador)",
      status: "ACTIVO",
      date: "2/8/2025"
    },
    {
      id: "GSI0405100d800b0f9b2c5667",
      username: "perera",
      email: "sabat@mail.com",
      phone: "1311354354",
      docType: "Cédula de ciudadanía",
      docNumber: "12135434354",
      role: "(Tesorero)",
      status: "ACTIVO",
      date: "2/8/2025"
    },
    // Más usuarios...
  ];

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);

  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setCurrentItem(item);
    setShowModal(true);
  };

  const handleSubmit = (data) => {
    if (modalMode === 'create') {

    } else {

    }
  };

  return (
    <div className="user-management-tesorero">
      <div className="header-section">
        <h2>Gestión de Categorizacion</h2>
        <button className="add-user-btn" onClick={handleCreate}>
          + Nuevo Categorizacion
        </button>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="Buscar usuario..."
          className="search-input"
        />
        <select className="filter-select">
          <option>Todos los Roles</option>
          <option>Administrador</option>
          <option>Tesorero</option>
        </select>
        <select className="filter-select">
          <option>Todos los Estados</option>
          <option>Activo</option>
          <option>Inactivo</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>USUARIO</th>
              <th>EMAIL</th>
              <th>TELÉFONO</th>
              <th>DOCUMENTO</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>FECHA</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={user.id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                <td>
                  <div className="user-avatar">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  {user.username}
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <div className="doc-info">
                    <span className="doc-type">{user.docType}</span>
                    <span className="doc-number">{user.docNumber}</span>
                  </div>
                </td>
                <td>
                  <span className={`role-badge ${user.role.includes("Admin") ? "admin" : "tesorero"
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`status-badge ${user.status === "ACTIVO" ? "active" : "inactive"
                    }`}>
                    {user.status}
                  </span>
                </td>
                <td>{user.date}</td>
                <td>
                  <div className="actions">
                    <button className="action-btn edit">
                      ✏️
                    </button>
                    <button className="action-btn view" onClick={handleEdit}>
                      👁️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination-controls">
        <button className="pagination-btn">← Anterior</button>
        <span>Página 1 de 5</span>
        <button className="pagination-btn">Siguiente →</button>
      </div>

      {showModal && (
        <CategorizacionModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default Gestioncategorizacion;