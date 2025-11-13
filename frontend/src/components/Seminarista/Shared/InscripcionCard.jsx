import React from 'react';
import PropTypes from 'prop-types';

const InscripcionCard = ({ inscripcion, onViewDetails }) => {
  // Función para obtener el texto correcto del estado
  const getStatusText = (estado) => {
    const statusMap = {
      'no inscrito': 'No Inscrito',
      'inscrito': 'Inscrito',
      'finalizado': 'Finalizado',
      'preinscrito': 'Preinscrito',
      'matriculado': 'Matriculado',
      'en_curso': 'En Curso',
      'certificado': 'Certificado',
      'rechazada': 'Rechazada',
      'cancelada academico': 'Cancelada'
    };
    return statusMap[estado] || estado;
  };

  // Función para obtener la clase CSS del estado
  const getStatusClass = (estado) => {
    const classMap = {
      'inscrito': 'confirmada',
      'matriculado': 'confirmada',
      'en_curso': 'confirmada',
      'certificado': 'confirmada',
      'finalizado': 'confirmada',
      'preinscrito': 'pendiente',
      'no inscrito': 'pendiente',
      'rechazada': 'cancelada',
      'cancelada academico': 'cancelada'
    };
    return classMap[estado] || 'pendiente';
  };

  return (
    <div className="inscripciones-container-misinscripciones">
      <div className="inscripcion-card-misinscripciones">
        <div className="inscripcion-content-misinscripciones">
          {/* Carrusel de imágenes en la tarjeta */}
          <div className="inscripcion-image-gallery">
            {inscripcion.tipoReferencia === 'Eventos' && Array.isArray(inscripcion.referencia?.imagen) && inscripcion.referencia.imagen.length > 0 ? (
              <img
                src={inscripcion.referencia.imagen[0]}
                alt={inscripcion.referencia?.nombre || 'Imagen del evento'}
                className="inscripcion-image-misinscripciones"
              />
            ) : (
              <p>Imagen no disponible</p>
            )}
          </div>
          <div className="inscripcion-body-misinscripciones">
            <div className="header-misinscripciones">
              <div className="inscripcion-title-section-misinscripciones">
                <div className="inscripcion-title-row-misinscripciones">
                  <h3 className="inscripcion-title-misinscripciones">
                    {inscripcion.referencia?.nombre || inscripcion.referencia?.titulo || 'Evento sin título'}
                  </h3>
                  <span className={`status-badge-misinscripciones ${getStatusClass(inscripcion.estado)}`}>
                    {getStatusText(inscripcion.estado)}
                  </span>
                </div>
                {inscripcion.categoria && (
                  <span className={`categoria-badge ${inscripcion.categoria.nombre?.toLowerCase().replaceAll(' ', '')}`}>
                    {inscripcion.categoria.nombre}
                  </span>
                )}
              </div>
              <div className="inscripcion-price-section-misinscripciones">
                <div className="inscripcion-price-misinscripciones">
                  {inscripcion.referencia?.precio || 'Precio no disponible'}
                </div>
                <div className="inscripcion-date-misinscripciones">
                  Inscrito: {new Date(inscripcion.fechaInscripcion || inscripcion.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="inscripcion-details-misinscripciones">
              <div className="detail-row-misinscripciones">
                <i className="fas fa-calendar"></i>
                <span>
                  {inscripcion.referencia?.fechaEvento 
                    ? new Date(inscripcion.referencia.fechaEvento).toLocaleDateString() 
                    : 'Sin fecha'}
                </span>
              </div>
              <div className="detail-row-misinscripciones">
                <i className="fas fa-clock"></i>
                <span>
                  {inscripcion.referencia?.horaInicio && inscripcion.referencia?.horaFin
                    ? `${inscripcion.referencia.horaInicio} - ${inscripcion.referencia.horaFin}`
                    : 'Horario no disponible'}
                </span>
              </div>
              <div className="detail-row-misinscripciones">
                <i className="fas fa-map-marker-alt"></i>
                <span>{inscripcion.referencia?.lugar || 'Ubicación no disponible'}</span>
              </div>
              <div className="detail-row-misinscripciones">
                <i className="fas fa-user"></i>
                <span>{inscripcion.nombre} {inscripcion.apellido}</span>
              </div>
            </div>
            <div className="inscripcion-footer-misinscripciones">
              <div className="status-info-misinscripciones">
                <i className={`fas status-icon-misinscripciones ${getStatusClass(inscripcion.estado)}`}></i>
                <span className="status-text-misinscripciones">{getStatusText(inscripcion.estado)}</span>
              </div>
              <div className="inscripcion-actions-misinscripciones">
                <button className="btn-outline-misinscripciones" onClick={() => onViewDetails(inscripcion)}>
                  <i className="fas fa-eye"/>Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

InscripcionCard.propTypes = {
  inscripcion: PropTypes.shape({
    id: PropTypes.string,
    _id: PropTypes.string,
    estado: PropTypes.string.isRequired,
    tipoReferencia: PropTypes.string,
    createdAt: PropTypes.string,
    fechaInscripcion: PropTypes.string,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    categoria: PropTypes.shape({
      nombre: PropTypes.string
    }),
    referencia: PropTypes.shape({
      nombre: PropTypes.string,
      titulo: PropTypes.string,
      precio: PropTypes.string,
      fechaEvento: PropTypes.string,
      horaInicio: PropTypes.string,
      horaFin: PropTypes.string,
      lugar: PropTypes.string,
      imagen: PropTypes.array
    })
  }).isRequired,
  onViewDetails: PropTypes.func.isRequired
};

export default InscripcionCard;