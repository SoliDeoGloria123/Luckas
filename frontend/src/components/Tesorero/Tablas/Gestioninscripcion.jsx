import React, { useState, useEffect } from 'react';
import { inscripcionService } from '../../../services/inscripcionService';
import { eventService } from '../../../services/eventService';
import { categorizacionService } from '../../../services/categorizacionService';
import { programasAcademicosService } from '../../../services/programasAcademicosService';
import InscripcionModal from '../modal/InscripcionModal';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import { Edit } from "lucide-react"

const Gestioninscripcion = () => {

  const [eventos, setEventos] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);
  const [showModal, setShowModalnscribir] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentItemIncribir, setcurrentItemIncribir] = useState(null);



  //Obtener inscripciones eventos y ctaegorias
  const obtenerInscripciones = async () => {
    try {
      const data = await inscripcionService.getAll();
      setInscripciones(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setInscripciones([]);
    }
  };


  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setEventos([]);
    }
  };


  const obtenerProgramas = async () => {
    try {
      const data = await programasAcademicosService.getAllProgramas();
      setProgramas(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setProgramas([]);
    }
  };

  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerInscripciones();
    obtenerEventos();
    obtenerProgramas();
    obtenerCategorias();
  }, []);

  const handleSubmit = async (Inscribirdata) => {
    try {
      if (modalMode === 'create') {
        await inscripcionService.create(Inscribirdata);
        mostrarAlerta("¡Éxito!", "Inscripción creada exitosamente");
        // Lógica para crear
      } else {
        await inscripcionService.update(currentItemIncribir._id, Inscribirdata);
        mostrarAlerta("¡Éxito!", "Inscripción actualizada exitosamente");
      }
      setShowModalnscribir(false);
      obtenerInscripciones();

    } catch (error) {
      mostrarAlerta("ERROR", `Error: ${error.message}`, 'error');
    }
  };
  const handleCreate = () => {
    setModalMode('create');
    setcurrentItemIncribir(null);
    setShowModalnscribir(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setcurrentItemIncribir(item);
    setShowModalnscribir(true);
  };
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil(inscripciones.length / registrosPorPagina);
  const inscripcionesPaginadas = inscripciones.slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia el filtro de usuarios
  useEffect(() => {
    setPaginaActual(1);
  }, [inscripciones]);


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
              <h1>Gestión de Inscripciones</h1>
              <p>Procesar inscripciones y categorizar</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i>
            Nueva Inscripción
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i class="fas fa-user-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalUsers">5</div>
              <div className="stat-label-usuarios">Total Inscripciones</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i class="fas fa-calendar-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">4</div>
              <div className="stat-label-usuarios">Nuevas Esta Semana</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i class="fas fa-check-double"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">1</div>
              <div className="stat-label-usuarios">Aprobadas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i class="fas fa-hourglass-half"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="newUsers">12</div>
              <div className="stat-label-usuarios">Pendientes</div>
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
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">

                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">ID INSCRIPCION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">NOMBRE COMPLETO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">TIPO DOCUEMNTO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">NUMERO DOCUEMENTO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">TELEFOO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">EDAD</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">CATEGORIA</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">EVENTO</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">OBSERVACIONES</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">FECHA INCRIPCION</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">ESTADO </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">SOLICITUD</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider text-[#334155]">ACCIONES</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                  {inscripciones.length === 0 ? (
                    <tr>
                      <td colSpan="14">No hay inscripciones disponibles.</td>
                    </tr>
                  ) : (
                    inscripcionesPaginadas.map((ins) => (
                      <tr key={ins._id}>

                        <td>{ins._id}</td>
                        <td>{(ins.nombre && ins.apelledio) ? `${ins.nombre} ${ins.apellido}` : ins.nombre || ins.apellido || "N/A"}</td>
                        <td>{ins.tipoDocumento}</td>
                        <td>{ins.numeroDocumento}</td>
                        <td>{ins.telefono}</td>
                        <td>{ins.edad}</td>
                        <td>{ins.categoria?.nombre}</td>
                        <td>{ins.evento?.nombre}</td>
                        <td>{ins.observaciones}</td>
                        <td>
                          {ins.fechaInscripcion ? new Date(ins.fechaInscripcion).toLocaleDateString('es-ES', { day: 'numeric', month: '2-digit', year: 'numeric' }) : ''}
                        </td>
                        <td className={`badge-tesorero badge-tesorero-${ins.estado}`}>
                          <span>
                            {ins.estado}
                          </span>
                        </td>
                        <td>{ins.solicitud}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(ins)}>
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
          <InscripcionModal
            mode={modalMode}
            initialData={currentItemIncribir || {}}
            onClose={() => setShowModalnscribir(false)}
            onSubmit={handleSubmit}
            categorias={categorias}
            eventos={eventos}
            programas={programas}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestioninscripcion;