import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes
} from '@fortawesome/free-solid-svg-icons';

const InscripcionModal = ({ inscripcion, isOpen, onClose, onCancel }) => {
  if (!isOpen || !inscripcion) return null;

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
            <span className={`status-badge-misinscripciones ${getStatusClass(inscripcion.estado)}`}>
              {getStatusText(inscripcion.estado)}
            </span>
            <span className="modal-price-misinscripciones">
              {inscripcion.referencia?.precio || 'Precio no disponible'}
            </span>
          </div>

          <h2 id="modal-title" className="modal-title-misinscripciones">
            {inscripcion.referencia?.nombre || inscripcion.referencia?.titulo || 'Evento sin título'}
          </h2>

          <div className="modal-details-grid-misinscripciones">
            <div className="modal-section-misinscripciones">
              <h3 className="section-title-misinscripciones">
                Detalles del {inscripcion.tipoReferencia === 'Eventos' ? 'Evento' : 'Programa'}
              </h3>
              <div className="detail-item-misinscripciones">
                <strong>Nombre:</strong> {inscripcion.referencia?.nombre || inscripcion.referencia?.titulo || 'No disponible'}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Descripción:</strong> {inscripcion.referencia?.descripcion || 'No disponible'}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Fecha:</strong> {inscripcion.referencia?.fechaEvento 
                  ? new Date(inscripcion.referencia.fechaEvento).toLocaleDateString()
                  : 'Fecha no disponible'}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Horario:</strong> {inscripcion.referencia?.horaInicio && inscripcion.referencia?.horaFin
                  ? `${inscripcion.referencia.horaInicio} - ${inscripcion.referencia.horaFin}`
                  : 'Horario no disponible'}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Ubicación:</strong> {inscripcion.referencia?.lugar || 'Ubicación no disponible'}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Precio:</strong> {inscripcion.referencia?.precio || 'Precio no disponible'}
              </div>
            </div>

            <div className="modal-section-misinscripciones">
              <h3 className="section-title-misinscripciones">Información de Inscripción</h3>
              <div className="detail-item-misinscripciones">
                <strong>Estado:</strong> {getStatusText(inscripcion.estado)}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Fecha de inscripción:</strong> {new Date(inscripcion.fechaInscripcion || inscripcion.createdAt).toLocaleDateString()}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Tipo:</strong> {inscripcion.tipoReferencia === 'Eventos' ? 'Evento' : 'Programa Académico'}
              </div>
              {inscripcion.categoria && (
                <div className="detail-item-misinscripciones">
                  <strong>Categoría:</strong> {inscripcion.categoria.nombre}
                </div>
              )}
            </div>

            <div className="modal-section-misinscripciones">
              <h3 className="section-title-misinscripciones">Datos del Participante</h3>
              <div className="detail-item-misinscripciones">
                <strong>Nombre completo:</strong> {inscripcion.nombre} {inscripcion.apellido}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Documento:</strong> {inscripcion.tipoDocumento} - {inscripcion.numeroDocumento}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Correo:</strong> {inscripcion.correo || 'No disponible'}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Teléfono:</strong> {inscripcion.telefono || 'No disponible'}
              </div>
              <div className="detail-item-misinscripciones">
                <strong>Edad:</strong> {inscripcion.edad || 'No disponible'}
              </div>
              {inscripcion.observaciones && (
                <div className="detail-item-misinscripciones">
                  <strong>Observaciones:</strong> {inscripcion.observaciones}
                </div>
              )}
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
    fechaInscripcion: PropTypes.string,
    tipoReferencia: PropTypes.string,
    categoria: PropTypes.string,
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    identificacion: PropTypes.string,
    telefono: PropTypes.string,
    email: PropTypes.string,
    correo: PropTypes.string,
    tipoDocumento: PropTypes.string,
    numeroDocumento: PropTypes.string,
    edad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    observaciones: PropTypes.string,
    referencia: PropTypes.shape({
      _id: PropTypes.string,
      titulo: PropTypes.string,
      nombre: PropTypes.string,
      fechaEvento: PropTypes.string,
      horaInicio: PropTypes.string,
      horaFin: PropTypes.string,
      lugar: PropTypes.string,
      precio: PropTypes.string,
      imagen: PropTypes.array,
      descripcion: PropTypes.string
    })
  }),
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default InscripcionModal;