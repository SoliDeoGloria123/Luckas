import React, { useState, useEffect, useRef } from 'react';
import UsuarioModal from '../modal/UsuarioModal';
import { userService } from '../../../services/userService'
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'

import { Search, Download, Share2, Edit, ChevronLeft, ChevronRight } from "lucide-react"



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
        <div className="space-y-4">
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


          {/* Filters and search */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              {/* <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#334155]/40" /> */}
              <input
                type="text"
                placeholder="Buscar por ID, nombre, correo..."


                className="h-10 w-full rounded-lg border border-[#334155]/10 bg-white pl-10 pr-4 text-sm text-[#334155] placeholder:text-[#334155]/40 focus:border-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/20"
              />
            </div>

            <div className="flex items-center gap-2">

            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Apellido
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Tipo de Documento
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Número de Documento
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Fecha de Nacimiento
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Correo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Teléfono
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#334155]/10">
                  {usuariosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={11}>
                        {searchTerm ? 'No se encontraron usuarios con ese número de cédula' : 'No hay usuarios para mostrar'}
                      </td>
                    </tr>
                  ) : (
                    usuariosFiltrados.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-[#f1f5f9]/50">
                        <td className="whitespace-nowrap px-6 py-4 text-base font-medium text-[#334155]">{user._id}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]">{user.nombre}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]">{user.apellido}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-[#334155]">{user.tipoDocumento}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-[#334155]">{user.numeroDocumento}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]/60">{user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString() : "N/A"}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#2563eb]">{user.correo}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base font-semibold text-[#334155]">{user.telefono}</td>
                        <td className="whitespace-nowrap px-6 py-4 text-base text-[#334155]">{user.role}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold`}
                          >
                            {user.estado}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button
                            onClick={() => {
                              setModalMode('edit');
                              setCurrentItem(user);
                              setShowModalUsuario(true);
                            }}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Editar registro</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t border-[#334155]/10 bg-[#f1f5f9] px-6 py-4">
              <div className="text-sm text-[#334155]/60">

              </div>
              <div className="flex items-center gap-2">
                <button
                  variant="outline"
                  size="sm"


                  className="border-[#334155]/10 text-[#334155] hover:bg-white hover:text-[#2563eb] disabled:opacity-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <div className="flex items-center gap-1">
                </div>
                <button
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </button>
                <div className="flex items-center gap-1">

                </div>
                <button
                  variant="outline"
                  size="sm"


                  className="border-[#334155]/10 text-[#334155] hover:bg-white hover:text-[#2563eb] disabled:opacity-50"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>


        {showModal && (
          <UsuarioModal
            mode={modalMode}
            initialData={currentItem || {}}
            onClose={() => setShowModalUsuario(false)}
            onSubmit={handleSubmit}
          />
        )}
      </main >
      <Footer />
    </>

  );
};

export default Gestionusuarios;