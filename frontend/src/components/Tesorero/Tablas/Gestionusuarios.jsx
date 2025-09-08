import React, { useState, useEffect, useRef } from 'react';
import UsuarioModal from '../modal/UsuarioModal';
import { userService } from '../../../services/userService'
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'



const Gestionusuarios = () => {
  // Datos de ejemplo
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModalUsuario] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);

  const handleCreate = () => {
    setModalMode('create');
    setCurrentItem(null);
    setShowModalUsuario(true);
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //obtener usuarios
  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      const usuariosData = Array.isArray(data.data) ? data.data : [];
      setUsuarios(usuariosData);
    } catch (error) {
      console.error("Error al obtener los usuarios de la base de datos", error.mensage);
    }
  };
  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleSubmit = async (Usuariodata) => {
    try {
      if (modalMode === 'create') {
          console.log("Datos enviados al backend:", Usuariodata); // <-- Verifica aquí
        await userService.createUser(Usuariodata)
        mostrarAlerta("¡Éxito!", "Usuario creado exitosamente");

      } else {
        await userService.updateUser(currentItem._id, Usuariodata);
        mostrarAlerta("¡Éxito!", "Usuario actualizado exitosamente");
        obtenerUsuarios();
      }
      setShowModalUsuario(false);
      obtenerUsuarios();
    } catch (error) {
      mostrarAlerta( 'Error','Error al procesar el usuario','error' );
    };
  };

  return (
    <> 
    <Header />
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Usuarios</h1>
            <p>Administr a las cuentas de usuario del sistema</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nuevo Usuario
        </button>
      </div>
      <div className="stats-grid-usuarios">
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios blue">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="totalUsers">5</div>
            <div className="stat-label-usuarios">Total Usuarios</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios green">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="activeUsers">4</div>
            <div className="stat-label-usuarios">Usuarios Activos</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios purple">
            <i className="fas fa-user-shield"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="adminUsers">1</div>
            <div className="stat-label-usuarios">Administradores</div>
          </div>
        </div>
        <div className="stat-card-usuarios">
          <div className="stat-icon-usuarios orange">
            <i className="fas fa-user-plus"></i>
          </div>
          <div className="stat-content">
            <div className="stat-number-usuarios" id="newUsers">12</div>
            <div className="stat-label-usuarios">Nuevos Este Mes</div>
          </div>
        </div>
      </div>

      <div className="filters-section-tesorero">
        <div className="search-filters-tesorero">
          <div className="search-input-container-tesorero">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Buscar usuarios..." id="userSearch"></input>
          </div>
          <select className="filter-select">
            <option value="">Todos los roles</option>
            <option value="administrador">Administrador</option>
            <option value="tesorero">Tesorero</option>
            <option value="seminarista">Seminarista</option>
          </select>
          <select id="statusFilter" className="filter-select">
            <option value="">Todos los estados</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>
        <div className="export-actions">
          <button className="btn-outline-tesorero" >
            <i className="fas fa-download"></i>
          </button>
          <button className="btn-outline-tesorero" >
            <i class="fas fa-share"></i>
          </button>
        </div>
      </div>

      <div className="table-container-tesorero">
        <table className="users-table-tesorero">
          <thead>
            <tr>
              <th>
                <input type="checkbox" id="selectAll"></input>
              </th>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>APELLIDO</th>
              <th>TIPO DE DOCUEMENTO</th>
              <th>NUMERO DE DOCUMENTO </th>
              <th>CORREO</th>
              <th>TELEFONO</th>
              <th>ROL</th>
              <th>ESTADO</th>
              <th>ACCINES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={9}>No hay usuarios para mostrar</td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr hey={user._id}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>{user._id}</td>
                  <td>{user.nombre}</td>
                  <td>{user.apellido}</td>
                  <td>{user.tipoDocumento}</td>
                  <td>{user.numeroDocumento}</td>
                  <td>{user.correo}</td>
                  <td>{user.telefono}</td>
                  <td>
                    <span
                      className={`role-badge ${user.role === "admin"
                        ? "role-administrador"
                        : user.role === "tesorero"
                          ? "role-tesorero"
                          : "role-seminarista"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td>
                      <span className={`badge-tesorero badge-tesorero-${user.estado}`}>
                        {user.estado}
                      </span>
                  </td>
                  <td className='actions-cell'>
                    <button className='action-btn edit'
                      onClick={() => {
                        setModalMode('edit');
                        setCurrentItem(user);
                        setShowModalUsuario(true);
                      }}>
                      <i class="fas fa-edit"></i>
                    </button>
                  </td>
                </tr>

              ))
            )}

          </tbody>
        </table>
      </div>

      {showModal && (
        <UsuarioModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModalUsuario(false)}
          onSubmit={handleSubmit}
        />
      )}
    </main>
    <Footer />
    </>

  );
};

export default Gestionusuarios;