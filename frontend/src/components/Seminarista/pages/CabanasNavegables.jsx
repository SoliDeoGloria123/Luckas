import React, { useState, useEffect } from 'react';
import './CabanasSeminario.css';
import Header from '../Shared/Header';
import { cabanaService } from '../../../services/cabanaService';
import Footer from '../../footer/Footer'
import Reserva from '../pages/FormularioReserva';
import { Heart,Star } from 'lucide-react';

const CabanasSeminario = () => {
  const [activeFilter, setActiveFilter] = useState('todas');
  const [favorites, setFavorites] = useState({});
  const [notification, setNotification] = useState({ show: false, message: '' });

  const [cabanas, setCabanas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cabanaSeleccionada, setCabanaSeleccionada] = useState(null);
  const [feedback, setFeedback] = useState(null);


  const [selectedCabana, setSelectedCabana] = useState(null);
  const [isReservaOpen, setIsReservaOpen] = useState(false);
  const [mostrarFormularioReserva, setMostrarFormularioReserva] = useState(false);

  const abrirReserva = (cabana) => {
    setSelectedCabana(cabana);
    setIsReservaOpen(true);
  };

  const showNotification = (message) => {
    setNotification({ show: true, message });
    setTimeout(() => setNotification({ show: false, message: '' }), 3000);
  };

  const verDetalles = (cabana) => {
    setCabanaSeleccionada(cabana);
    // Aquí iría la lógica para mostrar detalles
  };


  const loadMoreCabins = () => {
    showNotification('Cargando más cabañas...');
    // Aquí iría la lógica para cargar más cabañas
  };

  const goBack = () => {
    window.history.back();
  };

  const filterCabins = (category) => {
    setActiveFilter(category);
    // En una implementación real, aquí filtrarías las cabañas
  };

  useEffect(() => {
    const fetchCabanas = async () => {
      try {
        const data = await cabanaService.getAll();
        let cabanasArray = [];
        if (Array.isArray(data)) {
          cabanasArray = data;
        } else if (data && Array.isArray(data.cabanas)) {
          cabanasArray = data.cabanas;
        } else if (data && Array.isArray(data.data)) {
          cabanasArray = data.data;
        }
        setCabanas(cabanasArray);
      } catch (err) {
        setError('No se pudieron cargar las cabañas.');
      } finally {
        setLoading(false);
      }
    };
    fetchCabanas();
  }, []);


  const getIcon = (iconName) => {
    switch (iconName) {
      case 'people':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        );
      case 'home':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9,22 9,12 15,12 15,22" />
          </svg>
        );
      case 'bath':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            <path d="M20 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        );
      case 'map':
        return (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="cabanas-seminario">
      <Header/>

      <main className="main-content">
        {/* Breadcrumb */}
        <div className="breadcrumb">
          <button className="back-btn" onClick={goBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Volver al Dashboard
          </button>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <div className="page-title">
            <h1>Cabañas Disponibles</h1>
            <p>Encuentra el lugar perfecto para tu retiro espiritual y descanso</p>
          </div>
          <div className="page-stats">
            <div className="stat-item">
              <span className="stat-number">12</span>
              <span className="stat-label">Cabañas Totales</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">8</span>
              <span className="stat-label">Disponibles</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">4</span>
              <span className="stat-label">Reservadas</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-section">
          <div className="search-bar">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input type="text" placeholder="Buscar cabañas..." id="searchInput" />
          </div>

          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === 'todas' ? 'active' : ''}`}
              onClick={() => filterCabins('todas')}
              data-category="todas"
            >
              Todas
            </button>
            <button
              className={`filter-btn ${activeFilter === 'disponible' ? 'active' : ''}`}
              onClick={() => filterCabins('disponible')}
              data-category="disponible"
            >
              Disponibles
            </button>
            <button
              className={`filter-btn ${activeFilter === 'familiar' ? 'active' : ''}`}
              onClick={() => filterCabins('familiar')}
              data-category="familiar"
            >
              Familiares
            </button>
            <button
              className={`filter-btn ${activeFilter === 'individual' ? 'active' : ''}`}
              onClick={() => filterCabins('individual')}
              data-category="individual"
            >
              Individuales
            </button>
            <button
              className={`filter-btn ${activeFilter === 'premium' ? 'active' : ''}`}
              onClick={() => filterCabins('premium')}
              data-category="premium"
            >
              Premium
            </button>
          </div>

          <div className="sort-dropdown">
            <select id="sortSelect">
              <option value="nombre">Ordenar por nombre</option>
              <option value="precio">Ordenar por precio</option>
              <option value="capacidad">Ordenar por capacidad</option>
              <option value="disponibilidad">Ordenar por disponibilidad</option>
            </select>
          </div>
        </div>

        {/* Cabins Grid */}
        <div className="cabins-grid" id="cabinsGrid">
          {cabanas.map((cab) => (
            <div className="cabin-card" key={cab.id}>  {/*data-category={`${cabin.status === 'available' ? 'disponible ' : ''}${cabin.category}`}*/}
              <div className="cabin-image">
                {Array.isArray(cab.imagen) && cab.imagen.length > 0 ? (
                  <img
                    src={`http://localhost:3000/uploads/cabanas/${cab.imagen[0]}`}
                    alt="Imagen del evento"
                  />
                ) : (
                  <p>Sin imagen</p>
                )}
                <div className={`cabin-status ${cab.estado === 'available' ? 'available' : 'reserved'}`}>
                  {cab.estado === 'available' ? 'Disponible' : 'Reservada'}
                </div>
                <div
                  className={`cabin-favorite ${favorites[cab.id] ? 'active' : ''}`}>
                   <Heart/>
                </div>
                <div className="cabin-gallery">
                  <span className="gallery-count">
                    +{Math.floor(Math.random() * 10) + 5} fotos
                  </span>
                </div>
                {cab.premium && (
                  <div className="premium-badge">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                    </svg>
                    Premium
                  </div>
                )}
              </div>
              <div className="cabin-content">
                <div className="cabin-header">
                  <div className="cabin-category">
                    {cab.category === 'familiar' ? 'Familiar' :
                      cab.category === 'individual' ? 'Individual' : 'Premium'}
                  </div>
                  <div className="cabin-rating">
                    <Star size={15}  />
                    <span>4.2</span>
                  </div>
                </div>

                <h3 className="cabin-title-cabana">{cab.nombre}</h3>
                <p className="cabin-description">{cab.descripcion}</p>

                <div className="cabin-features">
                  {(cab.features || []).map((feature, index) => (
                    <div className="feature-item" key={index}>
                      {getIcon(feature.icon)}
                      <span>{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="cabin-amenities">
                  {(cab.amenities || []).map((amenity, index) => (
                    <div className="amenity-tag" key={index}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                      </svg>
                      {amenity}
                    </div>
                  ))}
                </div>

                <div className="cabin-footer">
                  <div className="cabin-price">
                    <span className="price">${cab.precio}</span>
                    <span className="price-period">/ noche</span>
                  </div>
                  <div className="cabin-availability">
                    <span className={`availability-text ${cab.estado === 'reserved' ? 'reserved' : ''}`}>
                      {cab.availability}
                    </span>
                  </div>
                </div>

                <div className="cabin-actions">
                  <button className="cabin-btn secondary" onClick={() => verDetalles(cab)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    Ver Detalles
                  </button>
                  <button
                    className="cabin-btn primary"
                    onClick={() => {
                      abrirReserva(cabanaSeleccionada);
                      setMostrarFormularioReserva(true);
                      setCabanaSeleccionada(null);
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </>
                      <>
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </>
                    </svg>
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Load More Button */}
        <div className="load-more-section">
          <button className="load-more-btn" onClick={loadMoreCabins}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
            Cargar más cabañas
          </button>
        </div>
      </main>
      {/* Notification Toast */}
      <div id="notification" className={`notification ${notification.show ? 'show' : ''}`}>
        <div className="notification-content">
          <svg className="notification-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 12l2 2 4-4" />
          </svg>
          <span className="notification-message">{notification.message}</span>
        </div>
      </div>
      {cabanaSeleccionada && (
        <div id="detailsModal" className="modal-semianrio active">
          <div className="modalContent-semianrio">
            <button className="closeBtn-semianrio" onClick={() => setCabanaSeleccionada(null)} >
              <i className="fas fa-times"></i>
            </button>

            <div className="imageGallery-semianrio">
              <div className='imagenContainer-seminario'>
                <img
                  id="currentImage"
                  src={
                    cabanaSeleccionada.imagen && cabanaSeleccionada.imagen[0]
                      ? `http://localhost:3000/uploads/cabanas/${cabanaSeleccionada.imagen[0]}`
                      : "/placeholder.svg"
                  }
                  alt={cabanaSeleccionada.nombre}
                  className="galleryImage-semianrio"
                />
                <button className="galleryBtn-seminario prevBtn-seminario" onClick={() => { }}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="galleryBtn-seminario nextBtn-seminario" onClick={() => { }}>
                  <i className="fas fa-chevron-right"></i>
                </button>
                <div className='imagenIndicators-seminario'>
                  <div className="indicator active" onclick="ge(0)"></div>
                  <div className="indicator" onclick="goToImage(1)"></div>
                  <div className="indicator" onclick="goToImage(2)"></div>
                </div>
              </div>
            </div>

            <div className='modalContent-seminario'>
              <div className="detailsHeader-seminario">
                <div className="detailsInfo">
                  <h3 className="detailsTitle-seminario" id="modalTitle">
                    {cabanaSeleccionada.nombre}
                  </h3>
                  <div className="detailsMeta-seminario">
                    <div className="rating-seminario">
                      <div className='rating'>
                        <i className="fas fa-star"></i>
                        <span id="rating-value">4.8</span>
                        <span className="rating-count">(24 reseñas)</span>
                      </div>
                    </div>
                    <div className="location-seminario">
                      <i className="fas fa-map-marker-alt"></i>
                      <span id="modalLocation">
                        {cabanaSeleccionada.ubicacion || "Ubicación no disponible"}
                      </span>
                    </div>
                  </div>
                  <p className="detailsDescription-seminario" id="modalDescription">
                    {cabanaSeleccionada.descripcion}
                  </p>
                </div>
                <div className="priceInfo-seminario">
                  <div className="price-seminario" id="modalPrice">
                    ${cabanaSeleccionada.precio}
                    <span className='price-unit'>/noche</span>
                  </div>
                  <div className="availability" id="modalAvailability">
                    {cabanaSeleccionada.estado === "available" ? "Disponible" : "Reservada"}
                  </div>
                </div>
              </div>

              <div className="content-grid">
                <div className="details-column-seminario">
                  <div className="section">
                    <h3 className="section-title-seminario">Capacidad y Espacios</h3>
                    <div className="capacity-grid-seminario">
                      <div className="capacity-item-seminario">
                        <div className="capacity-icon-seminario">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="capacity-info-seminario">
                          <div className="capacity-number-seminario">6</div>
                          <div className="capacity-label">Personas</div>
                        </div>
                      </div>
                      <div className="capacity-item-seminario">
                        <div className="capacity-icon-seminario">
                          <i class="fas fa-bed"></i>
                        </div>
                        <div className="capacity-info-seminario">
                          <div className="capacity-number-seminario">3</div>
                          <div className="capacity-label">Habitaciones</div>
                        </div>
                      </div>
                      <div className="capacity-item-seminario">
                        <div className="capacity-ico-seminarion">
                          <i className="fas fa-bath"></i>
                        </div>
                        <div className="capacity-info-seminario">
                          <div className="capacity-number">2</div>
                          <div className="capacity-label">Baños</div>
                        </div>
                      </div>
                      <div className="capacity-item-seminario">
                        <div className="capacity-icon-seminario">
                          <i class="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="capacity-info-seminario">
                          <div className="capacity-number-seminario">Zona Norte</div>
                          <div className="capacity-label">Ubicación</div>
                        </div>
                      </div>
                    </div>
                  </div>


                  <div className="section">
                    <h3 className="section-title-seminario">Servicios Incluidos</h3>
                    <div className="services-grid">
                      <div className="service-item">
                        <i className="fas fa-wifi"></i>
                        <span>WiFi</span>
                      </div>
                      <div className="service-item">
                        <i className="fas fa-tv"></i>
                        <span>TV</span>
                      </div>
                      <div className="service-item">
                        <i className="fas fa-utensils"></i>
                        <span>Cocina</span>
                      </div>
                      <div className="service-item">
                        <i className="fas fa-snowflake"></i>
                        <span>A/C</span>
                      </div>
                    </div>
                  </div>


                  <div className="section">
                    <h3 className="section-title-seminario">Características Especiales</h3>
                    <div className="features-grid-seminario">
                      <div className="feature-item-seminario">
                        <span className="feature-icon">✨</span>
                        <span>Vista al bosque</span>
                      </div>
                      <div className="feature-item-seminario">
                        <span className="feature-icon">✨</span>
                        <span>Chimenea</span>
                      </div>
                      <div className="feature-item-seminario">
                        <span class="feature-icon">✨</span>
                        <span>Terraza privada</span>
                      </div>
                      <div className="feature-item-seminario">
                        <span class="feature-icon">✨</span>
                        <span>Parrilla</span>
                      </div>
                    </div>
                  </div>


                  <div className="section">
                    <h3 className="section-title-seminario">Políticas de la Cabaña</h3>
                    <div class="policies">
                      <div className="policy-item">
                        <i className="fas fa-clock"></i>
                        <span><strong>Check-in:</strong> 3:00 PM - 8:00 PM</span>
                      </div>
                      <div className="policy-item">
                        <i className="fas fa-clock"></i>
                        <span><strong>Check-out:</strong> 11:00 AM</span>
                      </div>
                      <div className="policy-item">
                        <i className="fas fa-calendar"></i>
                        <span><strong>Cancelación:</strong> Gratuita hasta 24 horas antes</span>
                      </div>
                      <div className="policy-item">
                        <span>🚭</span>
                        <span>Prohibido fumar en el interior</span>
                      </div>
                      <div className="policy-item">
                        <span>🎵</span>
                        <span>Música permitida hasta las 10:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>


                <div className="reservation-column">
                  <div className="reservation-panel">
                    <div className="panel-header">
                      <h3>Reservar Ahora</h3>
                    </div>
                    <div className="panel-content">
                      <div className="price-display">
                        <div className="main-price">$180,000</div>
                        <div className="price-unit">por noche</div>
                      </div>

                      <div className="suggested-dates">
                        <div className="dates-header">Fechas sugeridas</div>
                        <div className="dates-value">15 - 17 Marzo, 2025</div>
                        <div className="nights-count">2 noches</div>
                      </div>

                      <div className="cost-breakdown">
                        <div className="cost-row">
                          <span>$180,000 x 2 noches</span>
                          <span>$360,000</span>
                        </div>
                        <div className="cost-row">
                          <span>Tarifa de limpieza</span>
                          <span>$50,000</span>
                        </div>
                        <div className="cost-divider"></div>
                        <div className="cost-total">
                          <span>Total</span>
                          <span>$410,000</span>
                        </div>
                      </div>

                      <button className="reserve-button" onClick={() => {
                        abrirReserva(cabanaSeleccionada);
                        setMostrarFormularioReserva(true);
                        setCabanaSeleccionada(null);
                      }}
                      >
                        Proceder con la Reserva
                      </button>

                      <div className="no-charge-notice">
                        No se realizará ningún cargo hasta confirmar
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {mostrarFormularioReserva && selectedCabana && (
        <Reserva
          cabana={selectedCabana}
          isOpen={isReservaOpen}
          onClose={() => {
            setMostrarFormularioReserva(false);
            setIsReservaOpen(false);
            setSelectedCabana(null);
          }}
        />
      )}
      <Footer/>
    </div>
  );
};

export default CabanasSeminario;