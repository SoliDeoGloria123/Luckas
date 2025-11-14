import React, { useState, useEffect } from 'react';
import { inscripcionService } from '../../../services/inscripcionService';
import { eventService } from '../../../services/eventService';
import { categorizacionService } from '../../../services/categorizacionService';
import { programasAcademicosService } from '../../../services/programasAcademicosService';
import InscripcionModal from '../../Dashboard/Modales/InscripcionModa';
import { mostrarAlerta } from '../../utils/alertas';
import Header from '../Header/Header-tesorero'
import Footer from '../../footer/Footer'
import { Edit } from "lucide-react"

const Gestioninscripcion = () => {

  const [eventos, setEventos] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [inscripciones, setInscripciones] = useState([]);

  // Variables para el modal del Dashboard
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [inscripcionSeleccionada, setInscripcionSeleccionada] = useState(null);
  const [nuevaInscripcion, setNuevaInscripcion] = useState({
    nombre: '',
    apellido: '',
    tipoDocumento: '',
    numeroDocumento: '',
    correo: '',
    telefono: '',
    edad: '',
    tipoReferencia: 'evento',
    referencia: '',
    categoria: '',
    estado: 'pendiente'
  });



  //Obtener inscripciones eventos y ctaegorias
  const obtenerInscripciones = async () => {
    try {
      const data = await inscripcionService.getAll();
      setInscripciones(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setInscripciones([]);
      mostrarAlerta("ERROR", `Error al obtener inscripciones: ${error.message}`, 'error');
    }
  };


  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setEventos([]);
      mostrarAlerta("ERROR", `Error al obtener eventos: ${error.message}`, 'error');
    }
  };


  const obtenerProgramas = async () => {
    try {
      const data = await programasAcademicosService.getAllProgramas();
      setProgramas(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setProgramas([]);
      mostrarAlerta("ERROR", `Error al obtener programas académicos: ${error.message}`, 'error');
    }
  };

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
    obtenerInscripciones();
    obtenerEventos();
    obtenerProgramas();
    obtenerCategorias();
  }, []);


  const handleCreate = () => {
    setModoEdicion(false);
    setInscripcionSeleccionada(null);
    setNuevaInscripcion({
      nombre: '',
      apellido: '',
      tipoDocumento: '',
      numeroDocumento: '',
      correo: '',
      telefono: '',
      edad: '',
      tipoReferencia: 'evento',
      referencia: '',
      categoria: '',
      estado: 'pendiente'
    });
    setMostrarModal(true);
  };

  const handleEdit = (inscripcion) => {
    setModoEdicion(true);
    setInscripcionSeleccionada(inscripcion);
    setMostrarModal(true);
  };

  // Funciones para el modal del Dashboard
  const crearInscripcion = async (payload) => {
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaInscripcion;
      await inscripcionService.create(body);
      mostrarAlerta("¡Éxito!", "Inscripción creada exitosamente", 'success');
      setMostrarModal(false);
      obtenerInscripciones();
    } catch (error) {
      mostrarAlerta("ERROR", `Error al crear inscripción: ${error.message}`, 'error');
    }
  };

  const actualizarInscripcion = async (payload) => {
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaInscripcion;
      const id = (body && body._id) ? body._id : (inscripcionSeleccionada && inscripcionSeleccionada._id);
      if (!id) {
        mostrarAlerta('ERROR', 'No se encontró el ID de la inscripción a actualizar', 'error');
        return;
      }
      await inscripcionService.update(id, body);
      mostrarAlerta("¡Éxito!", "Inscripción actualizada exitosamente", 'success');
      setMostrarModal(false);
      obtenerInscripciones();
    } catch (error) {
      mostrarAlerta("ERROR", `Error al actualizar inscripción: ${error.message}`, 'error');
    }
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
            <button className="back-btn-tesorero" onClick={() => globalThis.history.back()}>
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="page-title-tesorero">
              <h1>Gestión de Inscripciones</h1>
              <p>Procesar inscripciones y categorizar</p>
            </div>
          </div>

          <button className="btn-primary-tesorero" onClick={handleCreate}>
            <i className="fas fa-plus"></i> {' '}
            Nueva Inscripción{' '}
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="totalUsers">5</div>
              <div className="stat-label-usuarios">Total Inscripciones</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-calendar-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">4</div>
              <div className="stat-label-usuarios">Nuevas Esta Semana</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-check-double"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">1</div>
              <div className="stat-label-usuarios">Aprobadas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-hourglass-half"></i>
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
              <i className="fas fa-share"></i>
            </button>
          </div>
        </div>


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">
                    <th>ID</th>
                    <th>Nombre completo</th>
                    <th>Tipo Doc.</th>
                    <th>Número Doc.</th>
                    <th>Correo</th>
                    <th>Teléfono</th>
                    <th>Edad</th>
                    <th>Tipo Inscripción</th>
                    <th>Evento/Programa</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Observaciones</th>
                    <th>Fecha inscripción</th>
                    <th>Solicitud</th>
                    <th>Acciones</th>
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
                        <td>{ins.correo}</td>
                        <td>{ins.telefono}</td>
                        <td>{ins.edad}</td>
                        <td>{ins.tipoReferencia}</td>
                        <td>{ins.referencia?.nombre || ins.evento?.nombre}</td>
                        <td>{ins.categoria?.nombre || "N/A"}</td>
                        <td>
                          <span className={`badge-estado estado-${(ins.estado || "pendiente").toLowerCase()}`}>
                            {ins.estado || "Pendiente"}
                          </span>
                        </td>
                        <td>{ins.observaciones || "N/A"}</td>
                        <td>
                          {ins.fechaInscripcion
                            ? new Date(ins.fechaInscripcion).toLocaleString()
                            : "N/A"}
                        </td>
                        <td>{ins.solicitud ? ins.solicitud : "N/A"}</td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(ins)}>
                            <Edit className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )};

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

        {mostrarModal && (
          <InscripcionModal
            mostrar={mostrarModal}
            modo={modoEdicion ? "editar" : "crear"}
            inscripcion={inscripcionSeleccionada}
            eventos={eventos}
            categorias={categorias}
            programas={programas}
            onClose={() => setMostrarModal(false)}
            onSubmit={modoEdicion ? actualizarInscripcion : crearInscripcion}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Gestioninscripcion;