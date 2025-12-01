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
  const [inscripcionesFiltradas, setInscripcionesFiltradas] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('todos');
  const [filterTipoReferencia, setFilterTipoReferencia] = useState('todos');
  const [filterEstado, setFilterEstado] = useState('todos');

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
  const [estadisticas, setEstadisticas] = useState({ totalInscripciones: 0, nuevasEstaSemana: 0, aprobadas: 0, pendientes: 0 });

  //Obtener inscripciones eventos y ctaegorias
  const obtenerInscripciones = async () => {
    try {
      const data = await inscripcionService.getAll();
      // Aceptar varias formas de respuesta: array directo o { data: [...] }
      let listaIns = [];
      if (!data) listaIns = [];
      else if (Array.isArray(data)) listaIns = data;
      else if (Array.isArray(data.data)) listaIns = data.data;
      else if (Array.isArray(data.results)) listaIns = data.results;
      setInscripciones(listaIns);
      setInscripcionesFiltradas(listaIns);
    } catch (error) {
      setInscripciones([]);
      mostrarAlerta("Error", `Error al obtener inscripciones: ${error.message}`, 'error');
    }
  };


  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      let lista = [];
      if (!data) lista = [];
      else if (Array.isArray(data)) lista = data;
      else if (Array.isArray(data.data)) lista = data.data;
      else if (Array.isArray(data.results)) lista = data.results;
      setEventos(lista);
    } catch (error) {
      setEventos([]);
      mostrarAlerta("Error", `Error al obtener eventos: ${error.message}`, 'error');
    }
  };


  const obtenerProgramas = async () => {
    try {
      const data = await programasAcademicosService.getAllProgramas();
      let lista = [];
      if (!data) lista = [];
      else if (Array.isArray(data)) lista = data;
      else if (Array.isArray(data.data)) lista = data.data;
      else if (Array.isArray(data.results)) lista = data.results;
      setProgramas(lista);
    } catch (error) {
      setProgramas([]);
      mostrarAlerta("Error", `Error al obtener programas académicos: ${error.message}`, 'error');
    }
  };

  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      let lista = [];
      if (!res) lista = [];
      else if (Array.isArray(res)) lista = res;
      else if (Array.isArray(res.data)) lista = res.data;
      else if (Array.isArray(res.results)) lista = res.results;
      setCategorias(lista);
      Estadisticagenerales();
    } catch (error) {
      setCategorias([]);
      mostrarAlerta("Error", `Error al obtener categorías: ${error.message}`, 'error');
    }
  };

  useEffect(() => {
    obtenerInscripciones();
    obtenerEventos();
    obtenerProgramas();
    obtenerCategorias();
  }, []);

  const extractText = (val) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') {
      return (val.nombre || val.titulo || val.username || JSON.stringify(val));
    }
    return String(val);
  };

  const applyFilters = (search = searchTerm, categoria = filterCategoria, tipoRef = filterTipoReferencia, estado = filterEstado, lista = inscripciones) => {
    const s = (search || '').toString().trim().toLowerCase();
    const arr = Array.isArray(lista) ? lista : [];
    const filtered = arr.filter((item) => {
      // categoria
      if (categoria && categoria !== 'todos') {
        const catId = item.categoria && (item.categoria._id || item.categoria);
        if (String(catId) !== String(categoria)) return false;
      }
      // tipo referencia
      if (tipoRef && tipoRef !== 'todos') {
        if (String((item.tipoReferencia || '')).toLowerCase() !== String(tipoRef).toLowerCase()) return false;
      }
      // estado
      if (estado && estado !== 'todos') {
        if (String((item.estado || '')).toLowerCase() !== String(estado).toLowerCase()) return false;
      }

      if (!s) return true;

      const nombre = extractText(item.nombre).toLowerCase();
      const apellido = extractText(item.apellido).toLowerCase();
      const documento = extractText(item.numeroDocumento).toLowerCase();
      const correo = extractText(item.correo).toLowerCase();
      const telefono = extractText(item.telefono).toLowerCase();
      const eventoNombre = extractText(item.referencia?.nombre || item.evento?.nombre).toLowerCase();
      const categoriaNombre = extractText(item.categoria?.nombre).toLowerCase();

      return (
        nombre.includes(s) ||
        apellido.includes(s) ||
        documento.includes(s) ||
        correo.includes(s) ||
        telefono.includes(s) ||
        eventoNombre.includes(s) ||
        categoriaNombre.includes(s) ||
        String(item.tipoReferencia || '').toLowerCase().includes(s) ||
        String(item.estado || '').toLowerCase().includes(s)
      );
    });

    setInscripcionesFiltradas(filtered);
  };

  //obtener estadísticas generales
  const Estadisticagenerales = async () => {
    try {
      const data = await inscripcionService.gerEstadisticasGenerales();
      setEstadisticas(data.data);
    } catch (error) {
      console.error("ERROR", `Error al obtener estadísticas generales: ${error.message}`, 'error');
    }
  };


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
      mostrarAlerta("Error", `Error al crear inscripción: ${error.message}`, 'error');
    }
  };

  const actualizarInscripcion = async (payload) => {
    try {
      if (payload && typeof payload.preventDefault === 'function') payload.preventDefault();
      const body = (payload && typeof payload.preventDefault !== 'function') ? payload : nuevaInscripcion;
      const id = (body && body._id) ? body._id : (inscripcionSeleccionada && inscripcionSeleccionada._id);
      if (!id) {
        mostrarAlerta('Error', 'No se encontró el ID de la inscripción a actualizar', 'error');
        return;
      }
      await inscripcionService.update(id, body);
      mostrarAlerta("¡Éxito!", "Inscripción actualizada exitosamente", 'success');
      setMostrarModal(false);
      obtenerInscripciones();
    } catch (error) {
      mostrarAlerta("Error", `Error al actualizar inscripción: ${error.message}`, 'error');
    }
  };

  // Mostrar solicitud sin exponer la ID (copia al portapapeles si es posible)
  const handleMostrarSolicitud = async (solicitud) => {
    if (!solicitud) {
      mostrarAlerta('INFO', 'No hay solicitud asociada a esta inscripción', 'info');
      return;
    }

    try {
      if (typeof solicitud === 'string') {
        const fullId = String(solicitud);
        try {
          if (navigator && navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(fullId);
            mostrarAlerta('Solicitud', `ID: ${fullId} (ID copiada al portapapeles)`, 'info');
          } else {
            mostrarAlerta('Solicitud', `ID: ${fullId}`, 'info');
          }
        } catch (err) {
          console.warn('No se pudo copiar ID al portapapeles', err);
          mostrarAlerta('Solicitud', `ID: ${fullId}`, 'info');
        }
        return;
      }

      // solicitud es objeto: mostrar resumen y ID si existe
      const candidatoTitulo = solicitud.titulo || solicitud.nombre || solicitud.tipo || '';
      const usuario = solicitud.usuario?.nombre || solicitud.usuario || '';
      const estado = solicitud.estado ? `Estado: ${solicitud.estado}` : '';
      const fecha = solicitud.fecha ? `Fecha: ${new Date(solicitud.fecha).toLocaleDateString()}` : '';
      const id = solicitud._id ? `ID: ${solicitud._id}` : '';
      const partes = [candidatoTitulo, usuario, estado, fecha].filter(Boolean);
      const mensajeResumen = partes.join(' • ') || 'Solicitud registrada';
      const mensaje = id ? `${mensajeResumen} • ${id}` : mensajeResumen;
      mostrarAlerta('Solicitud', mensaje, 'info');
    } catch (err) {
      console.error('Error mostrando solicitud', err);
      mostrarAlerta('ERROR', 'No se pudo mostrar la solicitud', 'error');
    }
  };
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const registrosPorPagina = 10;
  const totalPaginas = Math.ceil((inscripcionesFiltradas.length || 0) / registrosPorPagina) || 1;
  const inscripcionesPaginadas = (inscripcionesFiltradas || []).slice(
    (paginaActual - 1) * registrosPorPagina,
    paginaActual * registrosPorPagina
  );

  // Reiniciar a la página 1 si cambia la búsqueda o filtros
  useEffect(() => {
    setPaginaActual(1);
  }, [searchTerm, filterCategoria, filterTipoReferencia, filterEstado, inscripcionesFiltradas]);

  // Aplicar filtros cuando cambia la lista original
  useEffect(() => {
    applyFilters(searchTerm, filterCategoria, filterTipoReferencia, filterEstado, inscripciones);
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
            <i className="fas fa-plus" />
            Nueva Inscripción{' '}
          </button>
        </div>
        <div className="stats-grid-usuarios">
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios blue">
              <i className="fas fa-user-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" >{estadisticas.totalInscripciones}</div>
              <div className="stat-label-usuarios">Total Inscripciones</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios green">
              <i className="fas fa-calendar-plus"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="activeUsers">{estadisticas.nuevasEstaSemana}</div>
              <div className="stat-label-usuarios">Nuevas Esta Semana</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios purple">
              <i className="fas fa-check-double"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="adminUsers">{estadisticas.aprobadas}</div>
              <div className="stat-label-usuarios">Aprobadas</div>
            </div>
          </div>
          <div className="stat-card-usuarios">
            <div className="stat-icon-usuarios orange">
              <i className="fas fa-hourglass-half"></i>
            </div>
            <div className="stat-content">
              <div className="stat-number-usuarios" id="newUsers">{estadisticas.pendientes}</div>
              <div className="stat-label-usuarios">Pendientes</div>
            </div>
          </div>
        </div>

        <div className="filters-section-tesorero">
          <div className="search-filters-tesorero">
            <div className="search-input-container-tesorero">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Buscar inscripciones..."
                id="userSearch"
                value={searchTerm}
                onChange={(e) => {
                  const v = e.target.value;
                  setSearchTerm(v);
                  applyFilters(v, filterCategoria, filterTipoReferencia, filterEstado, inscripciones);
                  setPaginaActual(1);
                }}
              />
            </div>
            <select
              className="filter-select"
              value={filterCategoria}
              onChange={(e) => {
                const v = e.target.value;
                setFilterCategoria(v);
                applyFilters(searchTerm, v, filterTipoReferencia, filterEstado, inscripciones);
                setPaginaActual(1);
              }}
            >
              <option value="todos">Todas las categorías</option>
              {Array.isArray(categorias) && categorias.map(cat => (
                <option key={cat._id || cat.id || cat.codigo} value={cat._id || cat.id || cat.codigo}>{cat.nombre || cat.codigo}</option>
              ))}
            </select>
            <select
              id="statusFilter"
              className="filter-select"
              value={filterTipoReferencia}
              onChange={(e) => {
                const v = e.target.value;
                setFilterTipoReferencia(v);
                applyFilters(searchTerm, filterCategoria, v, filterEstado, inscripciones);
                setPaginaActual(1);
              }}
            >
              <option value="todos">Todos los tipos</option>
              <option value="Eventos">Eventos</option>
              <option value="ProgramaAcademico">ProgramaAcademico</option>
            </select>
            <select
              id="statusFilterEstado"
              className="filter-select"
              value={filterEstado}
              onChange={(e) => {
                const v = e.target.value;
                setFilterEstado(v);
                applyFilters(searchTerm, filterCategoria, filterTipoReferencia, v, inscripciones);
                setPaginaActual(1);
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="no inscrito">no inscrito</option>
              <option value="inscrito">inscrito</option>
              <option value="finalizado">finalizado</option>
              <option value="preinscrito">preinscrito</option>
              <option value="matriculado">matriculado</option>
              <option value="en_curso">en_curso</option>
              <option value="certificado">certificado</option>
              <option value="rechazada">rechazada</option>
              <option value="cancelada academico">cancelada academico</option>
            </select>
          </div>
          
        </div>


        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="overflow-hidden rounded-xl border border-[#334155]/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="users-table-tesorero">
                <thead>
                  <tr className="border-b border-[#334155]/10 bg-[#f1f5f9]">
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

                  {inscripcionesPaginadas.map((ins) => (
                    <tr key={ins._id}>
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
                      <td>
                        {ins.solicitud ? (
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => handleMostrarSolicitud(ins.solicitud)}
                            title="Ver solicitud"
                          >
                            Ver solicitud
                          </button>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <button className="h-8 w-8 text-[#2563eb] hover:bg-[#2563eb]/10 hover:text-[#1d4ed8]" onClick={() => handleEdit(ins)}>
                          <Edit className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

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