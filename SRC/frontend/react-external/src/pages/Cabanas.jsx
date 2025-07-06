import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Cabanas.css';

const Cabanas = () => {
  const [selectedCabin, setSelectedCabin] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
    tipo: 'todas'
  });
  const [bookingData, setBookingData] = useState({
    fechaInicio: '',
    fechaFin: '',
    huespedes: 1,
    solicitudEspecial: ''
  });

  const cabanasData = [
    {
      id: 'cabana-familiar-1',
      nombre: 'Cabaña Familiar "El Refugio"',
      tipo: 'familiar',
      capacidad: 8,
      habitaciones: 3,
      banos: 2,
      precioPorNoche: 120,
      calificacion: 4.8,
      numeroResenas: 24,
      descripcion: 'Amplia cabaña familiar con vista panorámica a las montañas. Perfect para retiros familiares y grupos pequeños.',
      servicios: [
        'Wi-Fi gratuito',
        'Cocina completa',
        'Chimenea',
        'Terraza privada',
        'Estacionamiento',
        'Parrilla BBQ',
        'Área de juegos',
        'Vista a la montaña'
      ],
      imagenes: [
        '/static/img/cabana-familiar-1-main.jpg',
        '/static/img/cabana-familiar-1-interior.jpg',
        '/static/img/cabana-familiar-1-cocina.jpg',
        '/static/img/cabana-familiar-1-exterior.jpg'
      ],
      disponible: true,
      ubicacion: 'Zona Norte del Seminario'
    },
    {
      id: 'cabana-parejas-1',
      nombre: 'Cabaña Romántica "Rincón de Paz"',
      tipo: 'parejas',
      capacidad: 2,
      habitaciones: 1,
      banos: 1,
      precioPorNoche: 80,
      calificacion: 4.9,
      numeroResenas: 18,
      descripcion: 'Íntima cabaña para parejas con jacuzzi privado y ambiente acogedor. Ideal para luna de miel y retiros en pareja.',
      servicios: [
        'Wi-Fi gratuito',
        'Jacuzzi privado',
        'Chimenea',
        'Kitchenette',
        'Terraza privada',
        'Estacionamiento',
        'Desayuno incluido',
        'Vista al jardín'
      ],
      imagenes: [
        '/static/img/cabana-parejas-1-main.jpg',
        '/static/img/cabana-parejas-1-jacuzzi.jpg',
        '/static/img/cabana-parejas-1-interior.jpg',
        '/static/img/cabana-parejas-1-terraza.jpg'
      ],
      disponible: true,
      ubicacion: 'Zona Sur del Seminario'
    },
    {
      id: 'cabana-grupo-1',
      nombre: 'Casa de Retiros "Emmanuel"',
      tipo: 'grupo',
      capacidad: 16,
      habitaciones: 6,
      banos: 4,
      precioPorNoche: 250,
      calificacion: 4.7,
      numeroResenas: 31,
      descripcion: 'Amplia casa de retiros ideal para grupos grandes, conferencias y eventos especiales. Incluye salón de reuniones.',
      servicios: [
        'Wi-Fi gratuito',
        'Salón de reuniones',
        'Cocina industrial',
        'Comedor para 20 personas',
        'Proyector y equipo A/V',
        'Estacionamiento amplio',
        'Jardín privado',
        'Servicio de catering'
      ],
      imagenes: [
        '/static/img/cabana-grupo-1-main.jpg',
        '/static/img/cabana-grupo-1-salon.jpg',
        '/static/img/cabana-grupo-1-comedor.jpg',
        '/static/img/cabana-grupo-1-exterior.jpg'
      ],
      disponible: true,
      ubicacion: 'Zona Central del Seminario'
    },
    {
      id: 'cabana-economica-1',
      nombre: 'Cabaña Económica "Betel"',
      tipo: 'economica',
      capacidad: 4,
      habitaciones: 2,
      banos: 1,
      precioPorNoche: 60,
      calificacion: 4.5,
      numeroResenas: 15,
      descripcion: 'Cabaña sencilla y acogedora para presupuestos ajustados. Limpia, cómoda y con lo esencial para una estancia agradable.',
      servicios: [
        'Wi-Fi gratuito',
        'Cocina básica',
        'Estacionamiento',
        'Terraza',
        'Ventilador',
        'Ropa de cama incluida'
      ],
      imagenes: [
        '/static/img/cabana-economica-1-main.jpg',
        '/static/img/cabana-economica-1-interior.jpg',
        '/static/img/cabana-economica-1-cocina.jpg'
      ],
      disponible: false,
      ubicacion: 'Zona Este del Seminario'
    }
  ];

  const filteredCabanas = cabanasData.filter(cabana => {
    const matchesTipo = searchFilters.tipo === 'todas' || cabana.tipo === searchFilters.tipo;
    const matchesCapacity = cabana.capacidad >= searchFilters.huespedes;
    // En un sistema real, aquí también verificaríamos la disponibilidad por fechas
    
    return matchesTipo && matchesCapacity;
  });

  const openModal = (cabana) => {
    setSelectedCabin(cabana);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCabin(null);
  };

  const openBookingModal = (cabana) => {
    setSelectedCabin(cabana);
    setBookingData({
      ...bookingData,
      fechaInicio: searchFilters.fechaInicio,
      fechaFin: searchFilters.fechaFin,
      huespedes: searchFilters.huespedes
    });
    setShowBookingModal(true);
  };

  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedCabin(null);
    setBookingData({
      fechaInicio: '',
      fechaFin: '',
      huespedes: 1,
      solicitudEspecial: ''
    });
  };

  const handleBooking = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para procesar la reserva
    alert(`Reserva enviada para ${selectedCabin.nombre}. Te contactaremos pronto para confirmar.`);
    closeBookingModal();
  };

  const calculateNights = () => {
    if (bookingData.fechaInicio && bookingData.fechaFin) {
      const start = new Date(bookingData.fechaInicio);
      const end = new Date(bookingData.fechaFin);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * (selectedCabin?.precioPorNoche || 0);
  };

  return (
    <div className="cabanas-container">
      {/* Header Section */}
      <div className="cabanas-header">
        <h1>Reserva de Cabañas</h1>
        <p>Encuentra el hospedaje perfecto para tu retiro o evento en el Seminario Bautista de Colombia</p>
      </div>

      {/* Search Filters */}
      <div className="search-filters">
        <div className="filter-group">
          <label>Fecha de llegada:</label>
          <input
            type="date"
            value={searchFilters.fechaInicio}
            onChange={(e) => setSearchFilters({...searchFilters, fechaInicio: e.target.value})}
            className="date-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Fecha de salida:</label>
          <input
            type="date"
            value={searchFilters.fechaFin}
            onChange={(e) => setSearchFilters({...searchFilters, fechaFin: e.target.value})}
            className="date-input"
          />
        </div>
        
        <div className="filter-group">
          <label>Huéspedes:</label>
          <select
            value={searchFilters.huespedes}
            onChange={(e) => setSearchFilters({...searchFilters, huespedes: parseInt(e.target.value)})}
            className="filter-select"
          >
            {[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16].map(num => (
              <option key={num} value={num}>{num} {num === 1 ? 'huésped' : 'huéspedes'}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Tipo de cabaña:</label>
          <select
            value={searchFilters.tipo}
            onChange={(e) => setSearchFilters({...searchFilters, tipo: e.target.value})}
            className="filter-select"
          >
            <option value="todas">Todas</option>
            <option value="familiar">Familiar</option>
            <option value="parejas">Parejas</option>
            <option value="grupo">Grupos grandes</option>
            <option value="economica">Económica</option>
          </select>
        </div>
      </div>

      {/* Cabins Grid */}
      <div className="cabanas-grid">
        {filteredCabanas.map((cabana) => (
          <div key={cabana.id} className={`cabana-card ${!cabana.disponible ? 'no-disponible' : ''}`}>
            <div className="cabana-imagen">
              <img src={cabana.imagenes[0]} alt={cabana.nombre} />
              {!cabana.disponible && (
                <div className="no-disponible-overlay">
                  <span>No Disponible</span>
                </div>
              )}
              <div className="cabana-tipo">{cabana.tipo}</div>
            </div>
            
            <div className="cabana-content">
              <div className="cabana-header">
                <h3>{cabana.nombre}</h3>
                <div className="calificacion">
                  <i className="fas fa-star"></i>
                  <span>{cabana.calificacion}</span>
                  <span className="resenas">({cabana.numeroResenas} reseñas)</span>
                </div>
              </div>
              
              <p className="cabana-descripcion">{cabana.descripcion}</p>
              
              <div className="cabana-info">
                <div className="info-item">
                  <i className="fas fa-users"></i>
                  <span>{cabana.capacidad} huéspedes</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-bed"></i>
                  <span>{cabana.habitaciones} habitaciones</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-bath"></i>
                  <span>{cabana.banos} baños</span>
                </div>
                <div className="info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{cabana.ubicacion}</span>
                </div>
              </div>
              
              <div className="cabana-precio">
                <span className="precio">${cabana.precioPorNoche} USD</span>
                <span className="precio-nota">por noche</span>
              </div>
              
              <div className="cabana-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => openModal(cabana)}
                >
                  Ver Detalles
                </button>
                <button 
                  className={`btn-primary ${!cabana.disponible ? 'disabled' : ''}`}
                  onClick={() => openBookingModal(cabana)}
                  disabled={!cabana.disponible}
                >
                  {cabana.disponible ? 'Reservar' : 'No Disponible'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCabanas.length === 0 && (
        <div className="no-results">
          <i className="fas fa-home"></i>
          <h3>No se encontraron cabañas</h3>
          <p>Intenta ajustar tus criterios de búsqueda</p>
        </div>
      )}

      {/* Modal de Detalles */}
      {showModal && selectedCabin && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCabin.nombre}</h2>
              <button className="modal-close" onClick={closeModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="modal-content">
              <div className="modal-gallery">
                <div className="main-image">
                  <img src={selectedCabin.imagenes[0]} alt={selectedCabin.nombre} />
                </div>
                <div className="gallery-thumbs">
                  {selectedCabin.imagenes.slice(1).map((imagen, index) => (
                    <img key={index} src={imagen} alt={`Vista ${index + 2}`} />
                  ))}
                </div>
              </div>
              
              <div className="modal-details">
                <div className="detail-section">
                  <h3>Descripción</h3>
                  <p>{selectedCabin.descripcion}</p>
                </div>
                
                <div className="detail-section">
                  <h3>Información de la Cabaña</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <strong>Capacidad:</strong> {selectedCabin.capacidad} huéspedes
                    </div>
                    <div className="detail-item">
                      <strong>Habitaciones:</strong> {selectedCabin.habitaciones}
                    </div>
                    <div className="detail-item">
                      <strong>Baños:</strong> {selectedCabin.banos}
                    </div>
                    <div className="detail-item">
                      <strong>Precio:</strong> ${selectedCabin.precioPorNoche} USD/noche
                    </div>
                  </div>
                </div>
                
                <div className="detail-section">
                  <h3>Servicios Incluidos</h3>
                  <div className="servicios-grid">
                    {selectedCabin.servicios.map((servicio, index) => (
                      <div key={index} className="servicio-item">
                        <i className="fas fa-check"></i>
                        <span>{servicio}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button className="btn-secondary" onClick={closeModal}>
                Cerrar
              </button>
              <button 
                className={`btn-primary ${!selectedCabin.disponible ? 'disabled' : ''}`}
                onClick={() => {
                  closeModal();
                  openBookingModal(selectedCabin);
                }}
                disabled={!selectedCabin.disponible}
              >
                {selectedCabin.disponible ? 'Reservar Ahora' : 'No Disponible'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Reserva */}
      {showBookingModal && selectedCabin && (
        <div className="modal-overlay" onClick={closeBookingModal}>
          <div className="modal-container booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservar {selectedCabin.nombre}</h2>
              <button className="modal-close" onClick={closeBookingModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleBooking} className="booking-form">
              <div className="modal-content">
                <div className="booking-details">
                  <h3>Detalles de la Reserva</h3>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label>Fecha de llegada *</label>
                      <input
                        type="date"
                        value={bookingData.fechaInicio}
                        onChange={(e) => setBookingData({...bookingData, fechaInicio: e.target.value})}
                        required
                        className="form-input"
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Fecha de salida *</label>
                      <input
                        type="date"
                        value={bookingData.fechaFin}
                        onChange={(e) => setBookingData({...bookingData, fechaFin: e.target.value})}
                        required
                        className="form-input"
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Número de huéspedes *</label>
                    <select
                      value={bookingData.huespedes}
                      onChange={(e) => setBookingData({...bookingData, huespedes: parseInt(e.target.value)})}
                      required
                      className="form-select"
                    >
                      {Array.from({length: selectedCabin.capacidad}, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>{num} {num === 1 ? 'huésped' : 'huéspedes'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Solicitudes especiales</label>
                    <textarea
                      value={bookingData.solicitudEspecial}
                      onChange={(e) => setBookingData({...bookingData, solicitudEspecial: e.target.value})}
                      placeholder="¿Hay algo especial que necesites para tu estadía?"
                      className="form-textarea"
                      rows="4"
                    />
                  </div>
                </div>
                
                {calculateNights() > 0 && (
                  <div className="booking-summary">
                    <h3>Resumen de la Reserva</h3>
                    <div className="summary-item">
                      <span>${selectedCabin.precioPorNoche} USD x {calculateNights()} noches</span>
                      <span>${calculateTotal()} USD</span>
                    </div>
                    <div className="summary-total">
                      <strong>Total: ${calculateTotal()} USD</strong>
                    </div>
                    <p className="summary-note">
                      * Los precios están sujetos a confirmación y pueden incluir tasas adicionales.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={closeBookingModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn-primary">
                  Enviar Solicitud de Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Information Section */}
      <div className="cabanas-info">
        <h2>Información Importante</h2>
        <div className="info-grid">
          <div className="info-card">
            <i className="fas fa-clock"></i>
            <h3>Check-in / Check-out</h3>
            <p>Check-in: 3:00 PM<br />Check-out: 11:00 AM</p>
          </div>
          
          <div className="info-card">
            <i className="fas fa-ban"></i>
            <h3>Política de Cancelación</h3>
            <p>Cancelación gratuita hasta 48 horas antes de la llegada</p>
          </div>
          
          <div className="info-card">
            <i className="fas fa-phone"></i>
            <h3>Contacto</h3>
            <p>+57 (601) 123-4567<br />cabanas@luckas.org</p>
          </div>
          
          <div className="info-card">
            <i className="fas fa-rules"></i>
            <h3>Normas de la Casa</h3>
            <p>No fumar • No mascotas • Silencio después de las 10 PM</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cabanas;