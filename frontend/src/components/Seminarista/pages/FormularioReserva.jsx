import React, { useState, useEffect } from 'react';
import './FormularioReserva.css';
import { reservaService } from "../../../services/reservaService";
import PropTypes from 'prop-types';

const FormularioReserva = ({ cabana, isOpen, onClose, onSucces }) => {

  const [currentStep, setCurrentStep] = useState(1);
  const [reservationData, setReservationData] = useState({
    usuario: "",
    cabana: "",
    fullName: "",
    lastName: "",
    documentType: "",
    documentNumber: "",
    email: "",
    phone: "",
    numberOfPeople: 1,
    stayPurpose: "",
    specialRequests: "",
    checkInDate: "",
    checkOutDate: "",
    estado: "Pendiente",
    observaciones: "",
    activo: true
  });
  // Obtener usuario logueado y rellenar datos personales al cargar el modal
  useEffect(() => {
    if (!isOpen) return;
    const usuarioStorage = localStorage.getItem('usuario');
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
    if (usuario) {
      setReservationData(prev => ({
        ...prev,
        fullName: usuario.nombre || "",
        lastName: usuario.apellido || "",
        documentType: usuario.tipoDocumento || "",
        documentNumber: usuario.numeroDocumento || "",
        email: usuario.correo || usuario.correoElectronico || usuario.email || "",
        phone: usuario.telefono || usuario.phone || "",
      }));
    }
  }, [isOpen]);
  const [checkInMinDate, setCheckInMinDate] = useState('');
  const [reservasExistentes, setReservasExistentes] = useState([]);



  // Efecto para establecer la fecha mínima de check-in al cargar el componente
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCheckInMinDate(today);
  }, []);

  // Obtener reservas existentes de la cabaña y usuario
  useEffect(() => {
    if (!cabana) return;
    const usuarioLogueado = (() => {
      try {
        const usuarioStorage = localStorage.getItem('usuario');
        return usuarioStorage ? JSON.parse(usuarioStorage) : null;
      } catch {
        return null;
      }
    })();
    const userId = usuarioLogueado?._id || usuarioLogueado?.id;
    if (!userId) return;
    reservaService.getReservasPorUsuario(userId)
      .then(data => {
        const reservasData = Array.isArray(data) ? data : data.data;
        // Solo reservas de la cabaña actual
        const reservasCabana = reservasData.filter(r => r.cabana === cabana._id || r.cabana === cabana.id);
        setReservasExistentes(reservasCabana);
      })
      .catch(() => setReservasExistentes([]));
  }, [cabana]);


  const closeReservationModal = () => {
    if (onClose) onClose();
  };

  // Función para ir a un paso específico
  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);

    // Si es el paso 2, validar que tenemos los datos necesarios
    if (stepNumber === 2 && (!reservationData.checkInDate || !reservationData.checkOutDate)) {
      alert('Por favor completa los datos del paso 1 primero');
    }
  };

  const crearReserva = async () => {
    try {
      // Obtener usuario logueado desde localStorage como objeto
      const usuarioLogueado = (() => {
        try {
          const usuarioStorage = localStorage.getItem('usuario');
          return usuarioStorage ? JSON.parse(usuarioStorage) : null;
        } catch {
          return null;
        }
      })();
      const userId = usuarioLogueado?._id || usuarioLogueado?.id;
      if (!userId) {
        alert('No se encontró el usuario logueado. Inicia sesión nuevamente.');
        return;
      }
      // Tomar la cabaña seleccionada
      const cabanaId = cabana?._id || cabana?.id;
      // Construir objeto reserva para la API
      const reservaData = {
        usuario: userId,
        cabana: cabanaId,
        nombre: reservationData.fullName || "",
        apellido: reservationData.lastName || "",
        numeroDocumento: reservationData.documentNumber || "",
        correoElectronico: reservationData.email || "",
        telefono: reservationData.phone || "",
        tipoDocumento: reservationData.documentType || "",
        numeroPersonas: reservationData.numberOfPeople || "",
        propositoEstadia: reservationData.stayPurpose || "",
        solicitudesEspeciales: reservationData.specialRequests || "",
        fechaInicio: reservationData.checkInDate || "",
        fechaFin: reservationData.checkOutDate || "",
        estado: "Pendiente",
        observaciones: "",
        activo: true
      };
      await reservaService.create(reservaData);
      if (onSucces) onSucces();
    } catch (err) {
      alert("Error al crear la reserva: " + err.message);
    }
  };

  // Función para manejar cambios en las fechas
  const handleDateChange = (e) => {
    const { id, value } = e.target;
    if (id === 'checkInDate') {
      // Si cambia la fecha de inicio, ajusta la fecha mínima de fin
      setReservationData(prev => {
        let newCheckOut = prev.checkOutDate;
        if (newCheckOut && new Date(newCheckOut) <= new Date(value)) {
          newCheckOut = '';
        }
        return {
          ...prev,
          checkInDate: value,
          checkOutDate: newCheckOut
        };
      });
    } else if (id === 'checkOutDate') {
      setReservationData(prev => ({ ...prev, checkOutDate: value }));
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

    // Validar solapamiento
    if (haySolapamiento()) {
      alert('Ya tienes una reserva para esta cabaña en las fechas seleccionadas. Elige otras fechas.');
      return;
    }

    // Avanzar al paso 2
    goToStep(2);
  };

  // Función para procesar el pago
  const processPayment = (method) => {
    // Simular procesamiento de pago
    setTimeout(async () => {
      goToStep(4);
      // Cuando el pago simulado finaliza, crear la reserva
      await crearReserva();
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
  // const getPaymentMethodName = (method) => {
  //   const methods = {
  //     'tarjeta': 'Tarjeta de Crédito/Débito',
  //     'transferencia': 'Transferencia Bancaria',
  //     'pse': 'PSE'
  //   };
  //   return methods[method] || method;
  // };

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

  // Validar solapamiento de fechas
  const haySolapamiento = () => {
    if (!reservationData.checkInDate || !reservationData.checkOutDate) return false;
    const nuevaInicio = new Date(reservationData.checkInDate);
    const nuevaFin = new Date(reservationData.checkOutDate);
    return reservasExistentes.some(r => {
      const inicio = new Date(r.fechaInicio);
      const fin = new Date(r.fechaFin);
      // Si las fechas se solapan
      return (
        (nuevaInicio <= fin && nuevaFin >= inicio)
      );
    });
  };

  if (!isOpen) return null;

  // Precompute step classes to avoid nested ternaries in JSX (resuelve SonarQube)
  let step1Class = '';
  if (currentStep === 1) step1Class = 'active';
  else if (currentStep > 1) step1Class = 'completed';

  let step2Class = '';
  if (currentStep === 2) step2Class = 'active';
  else if (currentStep > 2) step2Class = 'completed';

  let step3Class = '';
  if (currentStep === 3) step3Class = 'active';
  else if (currentStep > 3) step3Class = 'completed';

  let step4Class = '';
  if (currentStep === 4) step4Class = 'active';

  return (
    <>
      {/* Modal */}
      <div id="reservationModal" className="modal-overlay-seminarista-reserva active">
        <div className="modal-container-seminarista-reserva">
          <div className="cabin-header-seminarista-reserva">
            <div className="cabin-info-seminario-reserva">
              <h2 className="cabin-title-seminario-reserva">{cabana?.nombre || 'Cabaña seleccionada'}</h2>
              <p className="cabin-description-seminario-reserva">
                {cabana?.descripcion || 'Descripción no disponible.'}
              </p>
              <div className="cabin-details-seminario-reserva">
                <div className="detail-item-seminario-reserva">
                  <i className="fas fa-users"></i>
                  <span>{cabana?.capacidad ? `Hasta ${cabana.capacidad} personas` : 'Capacidad no disponible'}</span>
                </div>
                <div className="detail-item-seminario-reserva">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{cabana?.ubicacion || 'Ubicación no disponible'}</span>
                </div>
                <div className="price-tag-seminario-reserva">
                  {cabana?.precio ? `$${cabana.precio.toLocaleString()} COP/noche` : 'Precio no disponible'}
                </div>
              </div>
            </div>
            <button className="close-button-seminario-reserva" onClick={onClose}>
              Cerrar
            </button>
          </div>

          {/* Sección de Progreso */}
          <div className="progress-section-seminario-reserva">
            <h3 className="progress-title-seminario-reserva">Progreso de Reserva</h3>
            <div className="progress-bar-seminario-reserva">
              <div
                className="progress-fill-seminario-reserva"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="steps-container-seminario-reserva">
              {/* Paso 1 */}
              <div className={`step-seminario-reserva ${step1Class}`} data-step="1">
                <div className="step-icon-seminario-reserva">
                  <i className="fas fa-file-text"></i>
                </div>
                <div className="step-content">
                  <div className="step-title">Detalles de Reserva</div>
                  <div className="step-description">Selecciona fechas y completa tus datos</div>
                </div>
              </div>

              {/* Paso 2 */}
              <div className={`step-seminario-reserva ${step2Class}`} data-step="2">
                <div className="step-icon-seminario-reserva">
                  <i className="fas fa-clock"></i>
                </div>
                <div className="step-content">
                  <div className="step-title">Revisión y Confirmación</div>
                  <div className="step-description">Verifica los detalles de tu reserva</div>
                </div>
              </div>

              {/* Paso 3 */}
              <div className={`step-seminario-reserva ${step3Class}`} data-step="3">
                <div className="step-icon-seminario-reserva">
                  <i className="fas fa-credit-card"></i>
                </div>
                <div className="step-content">
                  <div className="step-title">Proceso de Pago</div>
                  <div className="step-description">Realiza el pago para confirmar tu reserva</div>
                </div>
              </div>

              {/* Paso 4 */}
              <div className={`step-seminario-reserva ${step4Class}`} data-step="4">
                <div className="step-icon-seminario-reserva">
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
          <div className="step-content-area-seminario-reserva">
            {/* Paso 1: Detalles de Reserva */}
            <div className={`step-form-seminario-reserva ${currentStep === 1 ? 'active' : ''}`} id="step1">
              <div className="form-header-seminario-reserva">
                <h3 className="form-title-seminario-reserva">Paso 1: Detalles de Reserva</h3>
                <p className="form-subtitle-seminario-reserva">Selecciona las fechas de tu estadía y completa tus datos personales</p>
              </div>

              <form className="reservation-form-seminario" onSubmit={handleSubmit}>
                <div className="form-row-reservation-seminario">
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="checkInDate" className="form-label-reservation-seminario">Fecha de Inicio </label>
                    <div className="date-input-container-seminario">
                      <input
                        type="date"
                        className="form-input-reservation"
                        min={checkInMinDate}
                        value={reservationData.checkInDate || ''}
                        onChange={handleDateChange}
                        required
                        id="checkInDate"
                      />
                      <i className="fas fa-calendar-alt date-icon"></i>
                    </div>
                  </div>
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="checkOutDate" className="form-label-reservation-seminario">Fecha de Fin </label>
                    <div className="date-input-container-seminario">
                      <input
                        type="date"
                        className="form-input-reservation"
                        min={reservationData.checkInDate ? new Date(new Date(reservationData.checkInDate).getTime() + 86400000).toISOString().split('T')[0] : checkInMinDate}
                        value={reservationData.checkOutDate || ''}
                        onChange={handleDateChange}
                        required
                        id="checkOutDate"
                      />
                      <i className="fas fa-calendar-alt date-icon"></i>
                    </div>
                  </div>
                </div>

                <div className="form-row-reservation-seminario">
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="firstName" className="form-label-reservation-seminario">Nombre</label>
                    <input
                      type="text"
                      className="form-input-reservation"
                      value={reservationData.fullName || ''}
                      readOnly
                      required
                    />
                  </div>
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="lastName" className="form-label-reservation-seminario">Apellido</label>
                    <input
                      type="text"
                      className="form-input-reservation"
                      value={reservationData.lastName || ''}
                      readOnly
                      required
                    />
                  </div>
                </div>



                <div className="form-row-reservation-seminario">
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="documentType" className="form-label-reservation-seminario">Tipo de Documento</label>
                    <select
                      id="documentType"
                      name="documentType"
                      value={reservationData.documentType || ''}
                      disabled
                      required
                    >
                      <option value="">Selecciona...</option>
                      <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                      <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                      <option value="Cédula de extranjería">Cédula de extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="documentNumber" className="form-label-reservation-seminario">Número de Documento</label>
                    <input
                      type="text"
                      className="form-input-reservation"
                      id="documentNumber"
                      value={reservationData.documentNumber || ''}
                      readOnly
                      required
                    />
                  </div>

                 
                </div>

                <div className="form-row-reservation-seminario">
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="email" className="form-label-reservation-seminario">Correo Electrónico </label>
                    <input
                      type="email"
                      className="form-input-reservation"
                      id="email"
                      value={reservationData.email || ''}
                      readOnly
                      required
                    />
                  </div>
                  <div className="form-group-reservation-seminario">
                    <label htmlFor="phone" className="form-label-reservation-seminario">Teléfono </label>
                    <input
                      type="tel"
                      className="form-input-reservation"
                      id="phone"
                      value={reservationData.phone || ''}
                      readOnly
                      required
                    />
                  </div>
                </div>
                <div className="form-row-reservation-seminario">
                <div className="form-group-reservation-seminario">
                    <label htmlFor="numberOfPeople" className="form-label-reservation-seminario">Número de Personas *</label>
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
                <div className="form-group-reservation-seminario">
                  <label htmlFor="stayPurpose" className="form-label-reservation-seminario">Propósito de la Estadía</label>
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

                <div className="form-group-reservation-seminario full-width">
                  <label htmlFor="specialRequests" className="form-label-reservation-seminario">Solicitudes Especiales</label>
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
            <div className={`step-form-seminario-reserva ${currentStep === 2 ? 'active' : ''}`} id="step2">
              <div className="form-header-seminario-reserva">
                <h3 className="form-title-seminario-reserva">Paso 2: Revisión y Confirmación</h3>
                <p className="form-subtitle-seminario-reserva">Verifica todos los detalles de tu reserva antes de proceder al pago</p>
              </div>
              <div className="review-content-seminario-reserva">
                <div className="review-section-seminario-reserva">
                  <h4>Detalles de la Reserva</h4>
                  <div className="review-item-seminario-reserva">
                    <span>Cabaña:</span>
                    <span>Cabaña del Bosque</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Check-in:</span>
                    <span>{formatDate(reservationData.checkInDate)}</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Check-out:</span>
                    <span>{formatDate(reservationData.checkOutDate)}</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Noches:</span>
                    <span>{calculateNights()}</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Huéspedes:</span>
                    <span>{reservationData.numberOfPeople || 1} personas</span>
                  </div>

                  <h4 style={{ marginTop: '24px' }}>Datos del Huésped</h4>
                  <div className="review-item-seminario-reserva">
                    <span>Nombre:</span>
                    <span>{reservationData.fullName || '-'}</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Email:</span>
                    <span>{reservationData.email || '-'}</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Teléfono:</span>
                    <span>{reservationData.phone || '-'}</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Documento:</span>
                    <span>{reservationData.documentNumber || '-'}</span>
                  </div>
                </div>

                <div className="review-section-seminario-reserva">
                  <h4>Resumen de Costos</h4>
                  <div className="review-item-seminario-reserva">
                    <span>$180,000 x {calculateNights()} noches</span>
                    <span>${(180000 * calculateNights()).toLocaleString()}</span>
                  </div>
                  <div className="review-item-seminario-reserva">
                    <span>Tarifa de limpieza</span>
                    <span>$50,000</span>
                  </div>
                  <hr style={{ margin: '16px 0', border: 'none', borderTop: '1px solid var(--border-color)' }} />
                  <div className="review-item-seminario-reserva" style={{ fontWeight: '600', fontSize: '16px' }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--orange)' }}>${calculateTotal().toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="form-actions-seminario-reserva">
                <button type="button" className="back-button-seminario-reserva" onClick={() => goToStep(1)}>
                  Volver a Editar
                </button>
                <button type="button" className="continue-button-seminarista-reserva" onClick={() => goToStep(3)}>
                  Confirmar y Proceder al Pago
                </button>
              </div>
            </div>

            {/* Paso 3: Proceso de Pago */}
            <div className={`step-form-seminario-reserva ${currentStep === 3 ? 'active' : ''}`} id="step3">
              <div className="form-header-seminario-reserva">
                <h3 className="form-title-seminario-reserva">Paso 3: Proceso de Pago</h3>
                <p className="form-subtitle-seminario-reserva">Selecciona tu método de pago preferido para confirmar la reserva</p>
              </div>
              <div className="payment-content-seminario-reserva">
                <div className="payment-methods-seminario-reserva">
                  <h4>Métodos de Pago Disponibles</h4>
                  <div className="payment-options-seminario-reserva">
                    <button className="payment-option-seminario-reserva" onClick={() => processPayment('tarjeta')}>
                      <i className="fas fa-credit-card"></i>
                      <div className="payment-info">
                        <div className="payment-title-seminario-reserva">Tarjeta de Crédito/Débito</div>
                        <div className="payment-subtitle-seminario-reserva">Visa, Mastercard, American Express</div>
                      </div>
                    </button>
                    <button className="payment-option-seminario-reserva" onClick={() => processPayment('transferencia')}>
                      <i className="fas fa-university"></i>
                      <div className="payment-info">
                        <div className="payment-title-seminario-reserva">Transferencia Bancaria</div>
                        <div className="payment-subtitle-seminario-reserva">Pago directo desde tu banco</div>
                      </div>
                    </button>
                    <button className="payment-option-seminario-reserva" onClick={() => processPayment('pse')}>
                      <i className="fas fa-money-check-alt"></i>
                      <div className="payment-info">
                        <div className="payment-title-seminario-reserva">PSE</div>
                        <div className="payment-subtitle-seminario-reserva">Débito desde cuenta corriente o ahorros</div>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Paso 4: Reserva Confirmada */}
            <div className={`step-form-seminario-reserva ${currentStep === 4 ? 'active' : ''}`} id="step4">
              <div className="form-header-seminario-reserva">
                <h3 className="form-title-seminario-reserva success-title-seminario-reserva">¡Reserva Confirmada!</h3>
                <p className="form-subtitle-seminario-reserva">Tu reserva ha sido procesada exitosamente</p>
              </div>
              <div className="success-content-seminario-reserva">
                <div className="success-icon-seminario-reserva">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h4 className="success-message-seminario-reserva">¡Felicitaciones!</h4>
                <p className="success-description-seminario-reserva">
                  Tu reserva en "Cabaña del Bosque" ha sido confirmada exitosamente.
                </p>

                <div className="confirmation-details-seminario-reserva">
                  <h4>Detalles de tu Reserva</h4>
                  <div className="confirmation-grid-seminario-reserva">
                    <div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Número de Reserva:</strong> #RES-2025-{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
                      </div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Huésped Principal:</strong> {reservationData.fullName || '-'}
                      </div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Email:</strong> {reservationData.email || '-'}
                      </div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Teléfono:</strong> {reservationData.phone || '-'}
                      </div>
                    </div>
                    <div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Cabaña:</strong> Cabaña del Bosque
                      </div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Check-in:</strong> {formatDate(reservationData.checkInDate)}
                      </div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Check-out:</strong> {formatDate(reservationData.checkOutDate)}
                      </div>
                      <div className="confirmation-item-seminario-reserva">
                        <strong>Total Pagado:</strong> ${calculateTotal().toLocaleString()} COP
                      </div>
                    </div>
                  </div>
                </div>

                <div className="success-actions-seminario-reserva">
                  <button className="download-button-seminario-reserva">
                    <i className="fas fa-download"></i> {' '}
                    Descargar Comprobante de Reserva
                  </button>
                  <button className="back-to-cabins-button-seminario-reserva" onClick={closeReservationModal}>
                    Volver a Cabañas
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
FormularioReserva.propTypes = {
  cabana: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSucces: PropTypes.func
};

export default FormularioReserva;
