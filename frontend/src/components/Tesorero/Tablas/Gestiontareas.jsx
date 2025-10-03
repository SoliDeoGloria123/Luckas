import React, { useState, useEffect } from 'react';
import { tareaService } from "../../../services/tareaService";
import { userService } from "../../../services/userService";
import TareaModal from '../modal/TareaModal';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import { Edit } from "lucide-react"


const Gestiontarea = () => {
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModalTarea] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItemTarea, setcurrentItemTarea] = useState(null);


  // Obtener tareas y usuarios
  const obtenerTareas = async () => {
    try {
      const data = await tareaService.getAll();
      setTareas(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.log("Error al obtener tareas: " + err.message);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const data = await userService.getAllUsers();
      setUsuarios(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.log("Error al obtener usuarios: " + err.message);
    }
  };
  useEffect(() => {
    obtenerTareas();
    obtenerUsuarios();
  }, []);

  const handleSubmit = async (Tareadata) => {
    try {
      if (modalMode === 'create') {
        await tareaService.create(Tareadata);
        mostrarAlerta("¡Éxito!", "Tarea creada exitosamente");
      } else {
        await tareaService.update(currentItemTarea._id, Tareadata);
        mostrarAlerta("¡Éxito!", "Tarea actualizada exitosamente");

      }
      setShowModalTarea(false);
      obtenerTareas();
    } catch (error) {
      mostrarAlerta("Error", "Error al procesar la tarea: " + error.message);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setcurrentItemTarea(null);
    setShowModalTarea(true);
  };

  const handleEdit = (item) => {
    // Normalizar valores para el modal
    const normalizado = {
      ...item,
      prioridad: item.prioridad && ['Alta', 'Media', 'Baja'].includes(item.prioridad) ? item.prioridad : 'Media',
      estado: item.estado && ['pendiente', 'en_progreso', 'completada', 'cancelada'].includes(item.estado) ? item.estado : 'pendiente',
      comentarios: Array.isArray(item.comentarios) ? item.comentarios : [],
      asignadoA: item.asignadoA?._id || item.asignadoA || '',
      asignadoPor: item.asignadoPor?._id || item.asignadoPor || ''
    };
    setModalMode('edit');
    setcurrentItemTarea(normalizado);
    setShowModalTarea(true);
  };


  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(tareas.length / registrosPorPagina);
  const tareasPaginadas = tareas.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [tareas]);


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
              <h1>Gestión de Tareas</h1>
              <p>Asignar y supervisar tareas del sistema</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i>
            Nueva Tarea
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i class="fas fa-tasks"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalUsers">5</div>
              <div className="stat-label-usuarios">Total Tareas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i class="fas fa-clock"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">4</div>
              <div className="stat-label-usuarios">Pendientes</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue     ">
              <i class="fas fa-spinner"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">1</div>
              <div className="stat-label-usuarios">En Progreso</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i class="fas fa-check-circle"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="newUsers">12</div>
              <div className="stat-label-usuarios">Completadas</div>
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


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]" >
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >TITULO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >DESCRIPCION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ESTADO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >PRIORIDAD</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGNADO A </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGNADO A ROL</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGNADO POR</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ASIGANADO POR ROL </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >FECHA LIMITE</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >FECHA CREACION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]" >ACCIONES</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                  {tareas.length === 0 ? (
                    <tr>
                      <td colSpan={6}>No hay tareas para mostrar</td>
                    </tr>
                  ) : (
                    tareasPaginadas.map((tarea) => (
                      <tr key={tarea._id}>

                        <td>{tarea._id}</td>
                        <td>{tarea.titulo}</td>
                        <td>{tarea.descripcion}</td>
                        <td>
                          <span className={`badge-tesorero badge-tesorero-${tarea.estado} `}>
                            {tarea.estado}
                          </span>
                        </td>
                        <td>{tarea.prioridad}</td>
                        <td>{tarea.asignadoA?.nombre || "N/A"}</td>
                        <td>{tarea.asignadoA?.role || "N/A"}</td>
                        <td>{tarea.asignadoPor?.nombre || "N/A"}</td>
                        <td>{tarea.asignadoPor?.role || "N/A"}</td>
                        <td>{tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "N/A"}</td>
                        <td>
                          {tarea.updatedAt ? new Date(tarea.updatedAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(tarea)}>
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
          Página {paginaActual} de {totalPaginas || 1}
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
          <TareaModal
            mode={modalMode}
            initialData={currentItemTarea || {}}
            onClose={() => setShowModalTarea(false)}
            onSubmit={handleSubmit}
            usuarios={usuarios}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestiontarea;