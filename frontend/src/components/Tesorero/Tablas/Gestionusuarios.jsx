import React, { useState, useEffect, useRef } from 'react';
import UsuarioModal from '../modal/UsuarioModal';
import { userService } from '../../../services/userService'
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'



const Gestionusuarios = () => {
  // Datos de ejemplo
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
      setUsuariosFiltrados(usuariosData);
    } catch (error) {
      console.error("Error al obtener los usuarios de la base de datos", error.mensage);
    }
  };

  // Función de búsqueda por número de cédula, nombre, apellido y correo
  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    if (!searchValue.trim()) {
      setUsuariosFiltrados(usuarios);
    } else {
      const searchLower = searchValue.toLowerCase().trim();
      const filteredUsers = usuarios.filter(user => {
        const numeroDocumento = user.numeroDocumento?.toString().toLowerCase();
        const nombre = user.nombre?.toLowerCase();
        const apellido = user.apellido?.toLowerCase();
        const correo = user.correo?.toLowerCase();

        return numeroDocumento?.includes(searchLower) ||
          nombre?.includes(searchLower) ||
          apellido?.includes(searchLower) ||
          correo?.includes(searchLower);
      });
      setUsuariosFiltrados(filteredUsers);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  // Efecto para actualizar usuarios filtrados cuando cambia la lista de usuarios
  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      setUsuariosFiltrados(usuarios);
    }
  }, [usuarios]);

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
      mostrarAlerta('Error', 'Error al procesar el usuario', 'error');
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
              <input
                type="text"
                placeholder="Buscar por cédula, nombre, apellido o correo..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
              />
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
          {searchTerm && (
            <div className="search-results-info" style={{
              padding: '10px 15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '6px',
              marginBottom: '15px',
              fontSize: '14px',
              color: '#666'
            }}>
              {usuariosFiltrados.length === 0
                ? `No se encontraron usuarios que coincidan con "${searchTerm}"`
                : `Se encontraron ${usuariosFiltrados.length} usuario${usuariosFiltrados.length === 1 ? '' : 's'} que coinciden con "${searchTerm}"`
              }
            </div>
          )}
          <table className="users-table-tesorero">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" id="selectAll"></input>
                </th>
                <th>ID</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Tipo de Documento</th>
                <th>Número de Documento</th>
                <th>Fecha de Nacimiento</th>
                <th>Correo</th>
                <th>Teléfono</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="usersTableBody">
              {usuariosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={11}>
                    {searchTerm ? 'No se encontraron usuarios con ese número de cédula' : 'No hay usuarios para mostrar'}
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((user) => (
                  <tr hey={user._id}>
                    <td>
                      <input type="checkbox" />
                    </td>
                    <td>{user._id}</td>
                    <td>{user.nombre}</td>
                    <td>{user.apellido}</td>
                    <td>{user.tipoDocumento}</td>
                    <td>{user.numeroDocumento}</td>
                    <td>{user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : "N/A"}</td>
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