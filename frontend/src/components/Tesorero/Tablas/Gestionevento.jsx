import React, { useState, useEffect } from 'react';
import { eventService } from "../../../services/eventService";
import { categorizacionService } from "../../../services/categorizacionService";
import { mostrarAlerta } from '../../utils/alertas';
import EventosModal from '../modal/EventosModal'


const Gestionevento = () => {
  const [eventos, setEventos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalEvento] = useState('create');
  const [currentItem, setCurrentItem] = useState(null);

  // Obtener eventos
  const obtenerEventos = async () => {
    try {
      const data = await eventService.getAllEvents();
      setEventos(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      setEventos([]);
    }
  };

  // Obtener categorías
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      setCategorias(res.data || []);
    } catch (error) {
      setCategorias([]);
    }
  };

  useEffect(() => {
    obtenerEventos();
    obtenerCategorias();
  }, []);

  const handleSubmit = async (data) => {
    if (modalMode === 'create') {
      try {
        await eventService.createEvent(data);
        mostrarAlerta("¡Éxito!", "Evento creado exitosamente");
        obtenerEventos();
      } catch (error) {
        mostrarAlerta("Error", `Error al crear el evento: ${error.message}`);
      }
    } else {
      try {
        await eventService.updateEvent(setCurrentItem._id, data);
        mostrarAlerta("¡Éxito!", "Evento actualizado exitosamente");
        obtenerEventos();
      } catch (error) {
        mostrarAlerta("Error"`Error al actualizar el evento: ${error.message}`);
      }
    }
  };



  const handleCreate = () => {
    setModalEvento('create');
    setCurrentItem(null);
    setShowModal(true);
  };

  return (
    <main className="main-content-tesorero">
      <div className="page-header-tesorero">
        <div className="card-header-tesorero">
          <button className="back-btn-tesorero">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="page-title-tesorero">
            <h1>Gestión de Eventos</h1>
            <p>Administra y organiza todos los eventos del sistema</p>
          </div>
        </div>

        <button className="btn-primary-tesorero" onClick={handleCreate}>
          <i className="fas fa-plus"></i>
          Nuevo Evento
        </button>
      </div>

      <div className="stats-grid-solicitudes">
        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">4</div>
            <div className="stat-label-solicitudes">Total Eventos</div>
          </div>
          <div className="stat-icon-solicitudes purple">
            <i className="fas fa-calendar-alt"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">1</div>
            <div className="stat-label-solicitudes">Próximos</div>
          </div>
          <div className="stat-icon-solicitudes orange">
            <i class="fas fa-clock"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">1</div>
            <div className="stat-label-solicitudes">Completados</div>
          </div>
          <div className="stat-icon-solicitudes green">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>

        <div className="stat-card-solicitudes">
          <div className="stat--solicitudes">
            <div className="stat-number-solicitudes">2</div>
            <div className="stat-label-solicitudes">Cancelados</div>
          </div>
          <div className="stat-icon-solicitudes red">
            <i class="fas fa-times-circle"></i>
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
      <div className="table-container-tesorero">
        <table className="users-table-tesorero">
          <thead>
            <tr>
              <th>
                <input type="checkbox" id="selectAll"></input>
              </th>
              <th>ID</th>
              <th>NOMBRE</th>
              <th>PRECIO</th>
              <th>CATEGORIA</th>
              <th>FECHA EVENTO</th>
              <th>HORA INICIO</th>
              <th>HORA FIN </th>
              <th>LUGAR</th>
              <th>CUPOS TOTALES</th>
              <th>CUPOS DISPONIBLES</th>
              <th>PRIORIDAD</th>
              <th>ESTADO</th>
              <th>FECHA CREACION</th>
              <th>IMAGEN </th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody id="usersTableBody">
            {eventos.map((event) => (
              <tr key={event._id}>
                <td>
                  <input type="checkbox" className="select-row"></input>
                </td>
                <td>{event._id}</td>
                <td>{event.nombre}</td>
                <td>${event.precio}</td>
                <td>{event.categoria?.nombre || "Sin categoría"}</td>
                <td>{event.fechaEvento ? new Date(event.fechaEvento).toLocaleDateString() : "N/A"}</td>
                <td>{event.horaInicio}</td>
                <td>{event.horaFin}</td>
                <td>{event.lugar}</td>
                <td>{event.cuposTotales}</td>
                <td>{event.cuposDisponibles}</td>
                <td><span className={`prioridad-${(event.prioridad || "media").toLowerCase()}`}>
                  {event.prioridad || "Media"}
                </span>
                </td>
                <td>
                  <span className={`badge-estado estado-${event.active ? "activo" : "inactivo"}`}>
                    {event.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td>{event.createdAt ? new Date(event.createdAt).toLocaleDateString() : "N/A"}</td>
                <td>{Array.isArray(event.imagen) && event.imagen.length > 0
                  ? <img src={event.imagen[0]} alt="Evento" className="tabla-imagen" />
                  : "Sin imagen"
                }</td>

                <td className='actions-cell'>
                  <button className='action-btn edit' onClick={() => {
                    setModalEvento('edit');
                    setCurrentItem(event);
                    setShowModal(true);
                  }}>
                    <i class="fas fa-edit"></i>
                  </button>

                </td>


              </tr>
            ))}

          </tbody>
        </table>
      </div>

      {showModal && (
        <EventosModal
          mode={modalMode}
          initialData={currentItem || {}}
          onClose={() => setShowModal(false)}
          onSubmit={handleSubmit}
          categorias={categorias}

        />
      )}
    </main>
  );
};

export default Gestionevento;