import React, { useState, useEffect } from 'react';
import CategorizacionModal from '../modal/CategorizacionModal';
import { categorizacionService } from '../../../services/categorizacionService';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import { Edit } from "lucide-react"


const Gestioncategorizacion = () => {
  const [categorias, setCategorias] = useState([]);
  const [modalMode, setModalMode] = useState('create');
  const [showModal, setShowModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
      mostrarAlerta("ERROR", `Error al obtener categorías: ${error.message}`, 'error');
    }
  };
  useEffect(() => {
    obtenerCategorias();
  }, []);

  const handleSubmit = async (data) => {
    try {
      if (modalMode === "create") {
        await categorizacionService.create(data);
        mostrarAlerta("¡EXITO!", "Categoría creada exitosamente");
      } else {
        await categorizacionService.update(currentItem._id, data);
        mostrarAlerta("¡EXITO!", "Categoría actualizada exitosamente");
      }
      setShowModal(false);
      obtenerCategorias();
    } catch (error) {
      mostrarAlerta("ERROR", `Error: ${error.message}`, 'error');
    }
  };

  // Abrir modal para crear
  const handleCreate = () => {
    setModalMode("create");
    setCurrentItem(null);
    setShowModal(true);
  };

  // Abrir modal para editar
  const handleEdit = (categoria) => {
    setModalMode("edit");
    setCurrentItem(categoria);
    setShowModal(true);
  };

  
    // Paginación
    const [paginaActual, setPaginaActual] = useState(1);
    const registrosPorPagina = 10;
    const totalPaginas = Math.ceil(categorias.length / registrosPorPagina);
    const categorizacionPaginados = categorias.slice(
      (paginaActual - 1) * registrosPorPagina,
      paginaActual * registrosPorPagina
    );
  
    // Reiniciar a la página 1 si cambia el filtro de usuarios
    useEffect(() => {
      setPaginaActual(1);
    }, [categorias]);

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
              <h1>Gestión de Categorías</h1>
              <p>Administra y organiza las categorías del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nueva Categoría
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i className="fas fa-tags"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios">4</div>
              <div className="stat-label-usuarios">Total Categorías</div>
            </div>
          </div>

          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios">1</div>
              <div className="stat-label-usuarios">Activas</div>
            </div>

          </div>

          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios">1</div>
              <div className="stat-label-usuarios">Principales</div>
            </div>

          </div>

          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios">2</div>
              <div className="stat-label-usuarios">Nuevas Este Mes</div>
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
            <button className="btn-outline-tesorero" id="exportBtn">
              <i className="fas fa-download"></i>
            </button>
            <button className="btn-outline-tesorero" id="importBtn">
              <i className="fas fa-upload"></i>
            </button>
          </div>
        </div>


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">

                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">Tipo de categoria</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">Codigo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">Acciones</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                  {categorias.length === 0 ? (
                    <tr>
                      <td colSpan={5}>no hay categorias para mostrar</td>
                    </tr>
                  ) : (
                    categorizacionPaginados.map((cate) => (
                      <tr key={cate._id}>

                        <td>{cate._id}</td>
                        <td>{cate.nombre}</td>
                        <td>{cate.tipo}</td>
                        <td>{cate.codigo}</td>
                        <td>
                          <span className={`badge-tesorero badge-tesorero-${cate.activo ? 'activo' : 'desactivado'}`}>
                            {cate.activo ? 'activo' : 'desactivado'}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-4">
                          <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(cate)} size="icon">
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          
        </div>
        <div className="pagination-admin flex items-center justify-center gap-4 mt-6">
            <button
              className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
            disabled={paginaActual === 1}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="pagination-info-admin">
              Página {paginaActual} de {totalPaginas}
            </span>
          
            <button
              className="pagination-btn-admin"
            onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
          disabled={paginaActual === totalPaginas || totalPaginas === 0}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        {showModal && (
          <CategorizacionModal
            mode={modalMode}
            initialData={currentItem || {}}
            onClose={() => setShowModal(false)}
            onSubmit={handleSubmit}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestioncategorizacion;