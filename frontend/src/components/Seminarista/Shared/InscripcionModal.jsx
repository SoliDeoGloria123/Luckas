import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faCalendar,
  faClock,
  faMapMarkerAlt,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const InscripcionModal = ({ inscripcion, isOpen, onClose, onCancel }) => {
  if (!isOpen || !inscripcion) return null;

  return (
    <div className="modal-overlay-misinscripciones show">
      <button
        type="button"
        className="modal-backdrop"
        onClick={onClose}
        style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'transparent', 
          border: 'none', 
          cursor: 'default',
          zIndex: 1
        }}
        aria-label="Cerrar modal"
      />
      <dialog 
        className="modal-container-misinscripciones" 
        open
        aria-labelledby="modal-title"
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div className="modal-header-misinscripciones">
          <div className="modal-image-gallery">
            {inscripcion.tipoReferencia === 'Eventos' && 
             Array.isArray(inscripcion.referencia?.imagen) && 
             inscripcion.referencia.imagen.length > 0 && 
             inscripcion.referencia.imagen[0] ? (
              <img
                src={
                  inscripcion.referencia.imagen[0].startsWith('http')
                    ? inscripcion.referencia.imagen[0]
                    : `http://localhost:3000/uploads/eventos/${inscripcion.referencia.imagen[0]}`
                }
                alt={inscripcion.referencia?.nombre || 'Imagen del evento'}
                className="modal-image-misinscripciones"
              />
            ) : (
              <p>Imagen no disponible</p>
            )}
          </div>
          <button className="modal-close-misinscripciones" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="modal-content-misinscripciones">
          <div className="modal-status-price-misinscripciones">
            <span className={`status-badge-misinscripciones ${inscripcion.estado.toLowerCase()}`}>
              {inscripcion.estado}
            </span>
            <span className="modal-price-misinscripciones">
              {inscripcion.precio}
            </span>
          </div>

          <h2 id="modal-title" className="modal-title-misinscripciones">
            {inscripcion.titulo}
          </h2>

          <div className="modal-details-grid-misinscripciones">
            <div className="modal-section-misinscripciones">
              <h3 className="section-title-misinscripciones">Detalles del Evento</h3>
              <div className="detail-item-misinscripciones">
                <FontAwesomeIcon icon={faCalendar} className="detail-icon-misinscripciones" />
                <span>{inscripcion.referencia?.nombre}</span>
              </div>
              <div className="detail-item-misinscripciones">
                <FontAwesomeIcon icon={faCalendar} className="detail-icon-misinscripciones" />
                <span>
                  {inscripcion.referencia?.fechaEvento 
                    ? new Date(inscripcion.referencia.fechaEvento).toLocaleDateString()
                    : 'Fecha no disponible'}
                </span>
              </div>
              <div className="detail-item-misinscripciones">
                <FontAwesomeIcon icon={faClock} className="detail-icon-misinscripciones" />
                <span>
                  {inscripcion.referencia?.horaInicio}-{inscripcion.referencia?.horaFin}
                </span>
              </div>
              <div className="detail-item-misinscripciones">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="detail-icon-misinscripciones" />
                <span>{inscripcion.referencia?.lugar}</span>
              </div>
            </div>

            <div className="modal-section-misinscripciones">
              <h3 className="section-title-misinscripciones">Información de Inscripción</h3>
              <div className="detail-item-misinscripciones">
                <FontAwesomeIcon icon={faCheckCircle} className="detail-icon-misinscripciones" />
                <span>Estado: <span>{inscripcion.estado}</span></span>
              </div>
              <div className="detail-item-misinscripciones">
                <FontAwesomeIcon icon={faCalendar} className="detail-icon-misinscripciones" />
                <span>
                  Inscrito: <span>{new Date(inscripcion.createdAt).toLocaleDateString()}</span>
                </span>
              </div>
              <div className="detail-item-misinscripciones">
                <span className="detail-icon-misinscripciones">💰</span>
                <span>Precio: <span>{inscripcion.referencia?.precio}</span></span>
              </div>
            </div>
          </div>

          <div className="modal-actions-misinscripciones">
            <button className="btn-secondary-misinscripciones" onClick={onClose}>
              Cerrar
            </button>
            {inscripcion.estado === 'Confirmada' && (
              <button
                className="btn-danger-misinscripciones"
                onClick={onCancel}
              >
                Cancelar Inscripción
              </button>
            )}
          </div>
        </div>
      </dialog>
    </div>
  );
};

InscripcionModal.propTypes = {
  inscripcion: PropTypes.shape({
    estado: PropTypes.string.isRequired,
    titulo: PropTypes.string,
    precio: PropTypes.string,
    createdAt: PropTypes.string,
    tipoReferencia: PropTypes.string,
    referencia: PropTypes.shape({
      nombre: PropTypes.string,
      fechaEvento: PropTypes.string,
      horaInicio: PropTypes.string,
      horaFin: PropTypes.string,
      lugar: PropTypes.string,
      precio: PropTypes.string,
      imagen: PropTypes.array
    })
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default InscripcionModal;