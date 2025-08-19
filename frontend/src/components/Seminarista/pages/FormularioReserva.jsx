import React, { useState, useEffect } from 'react';
import './FormularioReserva.css';

const FormularioReserva = ({ cabana, isOpen, onClose, onSucces }) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState({});
  const [checkInMinDate, setCheckInMinDate] = useState('');
  


  // Efecto para establecer la fecha mínima de check-in al cargar el componente
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCheckInMinDate(today);
  }, []);


const closeReservationModal = () => {
  if (onClose) onClose();
};

  // Función para ir a un paso específico
  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    
    // Si es el paso 2, validar que tenemos los datos necesarios
    if (stepNumber === 2 && (!reservationData.checkInDate || !reservationData.checkOutDate)) {
      alert('Por favor completa los datos del paso 1 primero');
      return;
    }
  };

  // Función para manejar cambios en las fechas
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    setReservationData(prev => ({ ...prev, [id]: value }));
    
    // Si es el check-in, actualizar el mínimo del check-out
    if (id === 'checkInDate' && value) {
      const checkOutInput = document.getElementById('checkOutDate');
      checkOutInput.min = value;
      
      // Si la fecha de check-out es anterior a la nueva fecha de check-in, limpiarla
      if (checkOutInput.value && checkOutInput.value <= value) {
        checkOutInput.value = '';
        setReservationData(prev => ({ ...prev, checkOutDate: '' }));
      }
    }
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setReservationData(prev => ({ ...prev, [id]: value }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar fechas
    if (!reservationData.checkInDate || !reservationData.checkOutDate) {
      alert('Por favor selecciona las fechas de check-in y check-out');
      return;
    }
    
    if (new Date(reservationData.checkOutDate) <= new Date(reservationData.checkInDate)) {
      alert('La fecha de check-out debe ser posterior a la fecha de check-in');
      return;
    }
    
    // Avanzar al paso 2
    goToStep(2);
  };

  // Función para procesar el pago
  const processPayment = (method) => {
    // Simular procesamiento de pago
    setTimeout(() => {
      goToStep(4);
    }, 2000);
  };


  // Función para calcular noches
  const calculateNights = () => {
    if (reservationData.checkInDate && reservationData.checkOutDate) {
      const checkIn = new Date(reservationData.checkInDate);
      const checkOut = new Date(reservationData.checkOutDate);
      const diffTime = Math.abs(checkOut - checkIn);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Función para obtener el nombre del método de pago
  const getPaymentMethodName = (method) => {
    const methods = {
      'tarjeta': 'Tarjeta de Crédito/Débito',
      'transferencia': 'Transferencia Bancaria',
      'pse': 'PSE'
    };
    return methods[method] || method;
  };

  // Calcular total
  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = 180000;
    const subtotal = nights * pricePerNight;
    const cleaningFee = 50000;
    return subtotal + cleaningFee;
  };

  // Calcular progreso
  const progressPercentage = ((currentStep - 1) / 3) * 100;

  if (!isOpen) return null;


  return (
    <div>
      {/* Botón de prueba para abrir el modal */}

      {/* Modal */}
      <div id="reservationModal" className="modal-overlay-seminarista-reserva active">
        <div className="modal-container-seminarista-reserva">
          <div className="cabin-header-seminarista-reserva">
            <div className="cabin-info">
              <h2 className="cabin-title">Cabaña del Bosque</h2>
              <p className="cabin-description">
                Hermosa cabaña rodeada de naturaleza, perfecta para familias que buscan tranquilidad y conexión espiritual.
              </p>
              <div className="cabin-details">
                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <span>Hasta 6 personas</span>
                </div>
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Zona Norte</span>
                </div>
                <div className="price-tag">$180,000 COP/noche</div>
              </div>
            </div>
            <button className="close-button" onClick={onClose}>
              Cerrar
            </button>
          </div>

          {/* Sección de Progreso */}
          <div className="progress-section">
            <h3 className="progress-title">Progreso de Reserva</h3>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="steps-container">
              {/* Paso 1 */}
              <div className={`step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`} data-step="1">
                <div className="step-icon">
                  <i className="fas fa-file-text"></i>
                </div>
                <div className="step-content">
                  <div className="step-title">Detalles de Reserva</div>
                  <div className="step-description">Selecciona fechas y completa tus datos</div>
                </div>
              </div>
              
              {/* Paso 2 */}
              <div className={`step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`} data-step="2">
                <div className="step-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="step-content">
                  <div className="step-title">Revisión y Confirmación</div>
                  <div className="step-description">Verifica los detalles de tu reserva</div>
                </div>
              </div>
              
              {/* Paso 3 */}
              <div className={`step ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`} data-step="3">
                <div className="step-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="step-content">
                  <div className="step-title">Proceso de Pago</div>
                  <div className="step-description">Realiza el pago para confirmar tu reserva</div>
                </div>
              </div>
              
              {/* Paso 4 */}
              <div className={`step ${currentStep === 4 ? 'active' : ''}`} data-step="4">
                <div className="step-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="step-content">
                  <div className="step-title">Reserva Confirmada</div>
                  <div className="step-description">¡Tu reserva ha sido confirmada exitosamente!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contenido de los pasos */}
          <div className="step-content-area">
            {/* Paso 1: Detalles de Reserva */}
            <div className={`step-form ${currentStep === 1 ? 'active' : ''}`} id="step1">
              <div className="form-header">
                <h3 className="form-title">Paso 1: Detalles de Reserva</h3>
                <p className="form-subtitle">Selecciona las fechas de tu estadía y completa tus datos personales</p>
              </div>
              
              <form className="reservation-form" onSubmit={handleSubmit}>
                <div className="form-row-reservation">
                  <div className="form-group-reservation">
                    <label className="form-label">Fecha de Check-in *</label>
                    <div className="date-input-container">
                      <input 
                        type="date" 
                        className="form-input-reservation" 
                        id="checkInDate" 
                        min={checkInMinDate}
                        value={reservationData.checkInDate || ''}
                        onChange={handleDateChange}
                        required
                      />
                      <i className="fas fa-calendar-alt date-icon"></i>
                    </div>
                  </div>
                  <div className="form-group-reservation">
                    <label className="form-label-reservation">Fecha de Check-out *</label>
                    <div className="date-input-container">
                      <input 
                        type="date" 
                        className="form-input-reservation" 
                        id="checkOutDate" 
                        min={reservationData.checkInDate || ''}
                        value={reservationData.checkOutDate || ''}
                        onChange={handleDateChange}
                        required
                      />
                      <i className="fas fa-calendar-alt date-icon"></i>
                    </div>
                  </div>
                </div>

                <div className="form-row-reservation">
                  <div className="form-group-reservation">
                    <label className="form-label-reservation">Nombre Completo *</label>
                    <input 
                      type="text" 
                      className="form-input-reservation" 
                      id="fullName" 
                      value={reservationData.fullName || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-reservation">
                    <label className="form-label-reservation">Número de Documento *</label>
                    <input 
                      type="text" 
                      className="form-input-reservation" 
                      id="documentNumber" 
                      value={reservationData.documentNumber || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-reservation">
                  <div className="form-group-reservation">
                    <label className="form-labe-reservationl">Correo Electrónico *</label>
                    <input 
                      type="email" 
                      className="form-input-reservation" 
                      id="email" 
                      value={reservationData.email || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-reservation">
                    <label className="form-label-reservation">Teléfono *</label>
                    <input 
                      type="tel" 
                      className="form-input-reservation" 
                      id="phone" 
                      value={reservationData.phone || ''}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row-reservation">
                  <div className="form-group-reservation">
                    <label className="form-label-reservation">Número de Personas *</label>
                    <input 
                      type="number" 
                      className="form-input-reservation" 
                      id="numberOfPeople" 
                      value={reservationData.numberOfPeople || 1}
                      min="1" 
                      max="6" 
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group-reservation">
                    <label className="form-label-reservation">Propósito de la Estadía</label>
                    <input 
                      type="text" 
                      className="form-input-reservation" 
                      id="stayPurpose" 
                      value={reservationData.stayPurpose || ''}
                      onChange={handleInputChange}
                      placeholder="Retiro espiritual, descanso, etc."
                    />
                  </div>
                </div>

                <div className="form-group-reservation full-width">
                  <label className="form-label-reservation">Solicitudes Especiales</label>
                  <textarea 
                    className="form-textarea-reservation" 
                    id="specialRequests" 
                    rows="4" 
                    value={reservationData.specialRequests || ''}
                    onChange={handleInputChange}
                    placeholder="Alguna solicitud especial o necesidad particular..."
                  ></textarea>
                </div>

                <button type="submit" className="continue-button-seminarista-reserva">
                  Continuar con la Reserva
                </button>
              </form>
            </div>

            {/* Paso 2: Revisión y Confirmación */}
            <div className={`step-form ${currentStep === 2 ? 'active' : ''}`} id="step2">
              <div className="form-header">
                <h3 className="form-title">Paso 2: Revisión y Confirmación</h3>
                <p className="form-subtitle">Verifica todos los detalles de tu reserva antes de proceder al pago</p>
              </div>
              <div className="review-content">
                <div className="review-section">
                  <h4>Detalles de la Reserva</h4>
                  <div className="review-item">
                    <span>Cabaña:</span>
                    <span>Cabaña del Bosque</span>
                  </div>
                  <div className="review-item">
                    <span>Check-in:</span>
                    <span>{formatDate(reservationData.checkInDate)}</span>
                  </div>
                  <div className="review-item">
                    <span>Check-out:</span>
                    <span>{formatDate(reservationData.checkOutDate)}</span>
                  </div>
                  <div className="review-item">
                    <span>Noches:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="review-item">
                    <span>Huéspedes:</span>
                    <span>{reservationData.numberOfPeople || 1} personas</span>
                  </div>
                  
                  <h4 style={{ marginTop: '24px' }}>Datos del Huésped</h4>
                  <div className="review-item">
                    <span>Nombre:</span>
                    <span>{reservationData.fullName || '-'}</span>
                  </div>
                  <div className="review-item">
                    <span>Email:</span>
                    <span>{reservationData.email || '-'}</span>
                  </div>
                  <div className="review-item">
                    <span>Teléfono:</span>
                    <span>{reservationData.phone || '-'}</span>
                  </div>
                  <div className="review-item">
                    <span>Documento:</span>
                    <span>{reservationData.documentNumber || '-'}</span>
                  </div>
                </div>
                
                <div className="review-section">
                  <h4>Resumen de Costos</h4>
                  <div className="review-item">
                    <span>$180,000 x {calculateNights()} noches</span>
                    <span>${(180000 * calculateNights()).toLocaleString()}</span>
                  </div>
                  <div className="review-item">
                    <span>Tarifa de limpieza</span>
                    <span>$50,000</span>
                  </div>
                  <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                  <div className="review-item" style={{ fontWeight: '600', fontSize: '16px' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--orange)' }}>${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="back-button" onClick={() => goToStep(1)}>
                  Volver a Editar
                </button>
                <button type="button" className="continue-button-seminarista-reserva" onClick={() => goToStep(3)}>
                  Confirmar y Proceder al Pago
                </button>
              </div>
            </div>

            {/* Paso 3: Proceso de Pago */}
            <div className={`step-form ${currentStep === 3 ? 'active' : ''}`} id="step3">
              <div className="form-header">
                <h3 className="form-title">Paso 3: Proceso de Pago</h3>
                <p className="form-subtitle">Selecciona tu método de pago preferido para confirmar la reserva</p>
              </div>
              <div className="payment-content">
                <div className="payment-methods">
                  <h4>Métodos de Pago Disponibles</h4>
                  <div className="payment-options">
                    <button className="payment-option" onClick={() => processPayment('tarjeta')}>
                      <i className="fas fa-credit-card"></i>
                      <div className="payment-info">
                        <div className="payment-title">Tarjeta de Crédito/Débito</div>
                        <div className="payment-subtitle">Visa, Mastercard, American Express</div>
                      </div>
                    </button>
                    <button className="payment-option" onClick={() => processPayment('transferencia')}>
                      <i className="fas fa-university"></i>
                      <div className="payment-info">
                        <div className="payment-title">Transferencia Bancaria</div>
                        <div className="payment-subtitle">Pago directo desde tu banco</div>
                      </div>
                    </button>
                    <button className="payment-option" onClick={() => processPayment('pse')}>
                      <i className="fas fa-money-check-alt"></i>
                      <div className="payment-info">
                        <div className="payment-title">PSE</div>
                        <div className="payment-subtitle">Débito desde cuenta corriente o ahorros</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 4: Reserva Confirmada */}
            <div className={`step-form ${currentStep === 4 ? 'active' : ''}`} id="step4">
              <div className="form-header">
                <h3 className="form-title success-title">¡Reserva Confirmada!</h3>
                <p className="form-subtitle">Tu reserva ha sido procesada exitosamente</p>
              </div>
              <div className="success-content">
                <div className="success-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h4 className="success-message">¡Felicitaciones!</h4>
                <p className="success-description">
                  Tu reserva en "Cabaña del Bosque" ha sido confirmada exitosamente.
                </p>
                
                <div className="confirmation-details">
                  <h4>Detalles de tu Reserva</h4>
                  <div className="confirmation-grid">
                    <div>
                      <div className="confirmation-item">
                        <strong>Número de Reserva:</strong> #RES-2025-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
                      </div>
                      <div className="confirmation-item">
                        <strong>Huésped Principal:</strong> {reservationData.fullName || '-'}
                      </div>
                      <div className="confirmation-item">
                        <strong>Email:</strong> {reservationData.email || '-'}
                      </div>
                      <div className="confirmation-item">
                        <strong>Teléfono:</strong> {reservationData.phone || '-'}
                      </div>
                    </div>
                    <div>
                      <div className="confirmation-item">
                        <strong>Cabaña:</strong> Cabaña del Bosque
                      </div>
                      <div className="confirmation-item">
                        <strong>Check-in:</strong> {formatDate(reservationData.checkInDate)}
                      </div>
                      <div className="confirmation-item">
                        <strong>Check-out:</strong> {formatDate(reservationData.checkOutDate)}
                      </div>
                      <div className="confirmation-item">
                        <strong>Total Pagado:</strong> ${calculateTotal().toLocaleString()} COP
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="success-actions">
                  <button className="download-button">
                    <i className="fas fa-download"></i>
                    Descargar Comprobante de Reserva
                  </button>
                  <button className="back-to-cabins-button" onClick={closeReservationModal}>
                    Volver a Cabañas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioReserva;
