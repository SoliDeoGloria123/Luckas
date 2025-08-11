import React, { useState } from 'react';
import './FormularioInscripcion.css';

const FormularioInscripcion =   ({
  evento,
    usuario,
    loading,
    mensaje,
    nuevoUsuario,
    onSubmit,
    onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: usuario?.nombre || '',
    documento: usuario?.documento || '',
    email: usuario?.email || '',
    telefono: usuario?.telefono || '',
    motivacion: '',
    experiencia: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Llama a onSubmit del padre al enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simula envío y luego llama a onSubmit
    setTimeout(async () => {
      setIsLoading(false);
      setCurrentStep(2);
      updateProgress(50);

      // Llama a onSubmit para notificar al padre
      if (onSubmit) {
        await onSubmit(formData);
      }

      // Simula revisión después de 3 segundos
      setTimeout(() => {
        setCurrentStep(3);
        updateProgress(75);
      }, 3000);
    }, 1000);
  };

  const procesarPago = (metodo) => {
    setIsLoading(true);

    // Simular procesamiento de pago
    setTimeout(() => {
      setIsLoading(false);
      setCurrentStep(4);
      updateProgress(100);
    }, 2000);
  };

  const updateProgress = (percentage) => {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
      progressFill.style.width = `${percentage}%`;
    }
  };

  React.useEffect(() => {
    switch (currentStep) {
      case 1:
        updateProgress(25);
        break;
      case 2:
        updateProgress(50);
        break;
      case 3:
        updateProgress(75);
        break;
      case 4:
        updateProgress(100);
        break;
      default:
        updateProgress(25);
    }
  }, [currentStep]);
  // Usa datos del evento si existen
  const tituloEvento = evento?.nombre;
  const descripcionEvento = evento?.descripcion ;
  const fechaEvento = evento?.fecha ? new Date(evento.fecha).toLocaleDateString() : "15 de Agosto, 2025";
  const horaEvento = evento?.hora ;
  const lugarEvento = evento?.lugar ;
  const precioEvento = evento?.precio  ;

  return (
    <div className="container-seminario">
      {/* Encabezado del Evento */}
      <div className="event-header-seminario">
        <div className="event-info-seminario">
          <h1 className="event-title-seminario">{tituloEvento}</h1>
          <p className="event-description-seminario">{descripcionEvento}</p>
          <div className="event-details-seminario">
            <span> {fechaEvento}</span>
            <span> {horaEvento}</span>
            <span>{lugarEvento}</span>
            <span className="price-seminario">{precioEvento}</span>
          </div>
        </div>
        <button className="close-btn-seminario" onClick={onClose}>
       
        </button>
      </div>

      {/* Barra de Progreso */}
      <div className="progress-container-seminario">
        <h2>Progreso de Inscripción</h2>
        <div className="progress-bar-seminario">
          <div className="progress-fill" id="progressFill"></div>
        </div>
        <div className="steps-container">
          <div className={`step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-icon">
            
            </div>
            <div className="step-info">
              <h4>Solicitud de Inscripción</h4>
              <p>Completa tus datos y envía la solicitud</p>
            </div>
          </div>
          <div className={`step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-icon">
             
            </div>
            <div className="step-info">
              <h4>Revisión del Personal</h4>
              <p>El personal académico revisará tu solicitud</p>
            </div>
          </div>
          <div className={`step ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
            <div className="step-icon">
     
            </div>
            <div className="step-info">
              <h4>Proceso de Pago</h4>
              <p>Realiza el pago para confirmar tu inscripción</p>
            </div>
          </div>
          <div className={`step ${currentStep === 4 ? 'active' : 'completed'}`}>
            <div className="step-icon">
            
            </div>
            <div className="step-info">
              <h4>Inscripción Completada</h4>
              <p>¡Felicitaciones! Tu inscripción está confirmada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido de los Pasos */}
      <div className="step-content">
        {/* Paso 1: Solicitud de Inscripción */}
        <div className={`content-panel ${currentStep === 1 ? 'active' : ''}`} id="content1">
          <div className="panel-header">
            <h3>Paso 1: Solicitud de Inscripción</h3>
            <p>Completa todos los campos requeridos para enviar tu solicitud de inscripción</p>
          </div>
          <form onSubmit={handleSubmit} className="registration-form-semianrio">
            <div className="form-row-semianrio">
              <div className="form-group-semianrio">
                <label htmlFor="nombre">Nombre Completo *</label>
                <input 
                  type="text" 
                  id="nombre" 
                  name="nombre" 
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group-semianrio">
                <label htmlFor="documento">Número de Documento *</label>
                <input 
                  type="text" 
                  id="documento" 
                  name="documento" 
                  value={formData.documento}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            <div className="form-row-semianrio">
              <div className="form-group-semianrio">
                <label htmlFor="email">Correo Electrónico *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className="form-group-semianrio">
                <label htmlFor="telefono">Teléfono *</label>
                <input 
                  type="tel" 
                  id="telefono" 
                  name="telefono" 
                  value={formData.telefono}
                  onChange={handleInputChange}
                  required 
                />
              </div>
            </div>
            <div className="form-group-semianrio">
              <label htmlFor="motivacion">Motivación para participar *</label>
              <textarea 
                id="motivacion" 
                name="motivacion" 
                rows="4"
                value={formData.motivacion}
                onChange={handleInputChange}
                placeholder="Explica por qué quieres participar en este evento..." 
                required
              ></textarea>
            </div>
            <div className="form-group-semianrio">
              <label htmlFor="experiencia">Experiencia previa (opcional)</label>
              <textarea 
                id="experiencia" 
                name="experiencia" 
                rows="3"
                value={formData.experiencia}
                onChange={handleInputChange}
                placeholder="Describe tu experiencia relacionada con el tema del evento..."
              ></textarea>
            </div>
            <button type="submit" className="btn-primary-semianrio" disabled={isLoading}>
              {isLoading ? 'Enviando...' : 'Enviar Solicitud de Inscripción'}
            </button>
          </form>
        </div>

        {/* Paso 2: Revisión del Personal */}
        <div className={`content-panel ${currentStep === 2 ? 'active' : ''}`} id="content2">
          <div className="panel-header">
            <h3>Paso 2: Revisión del Personal</h3>
            <p>Tu solicitud está siendo revisada por el personal académico</p>
          </div>
          <div className="review-content">
            <div className="loading-spinner">
             
            </div>
            <h4>Revisando tu solicitud...</h4>
            <p>El personal académico está evaluando tu solicitud. Este proceso puede tomar entre 1-3 días hábiles.</p>
            
            <div className="submitted-data">
              <h5>Datos enviados:</h5>
              <div>
                <p><strong>Nombre:</strong> {formData.nombre}</p>
                <p><strong>Documento:</strong> {formData.documento}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Teléfono:</strong> {formData.telefono}</p>
                <p><strong>Motivación:</strong> {formData.motivacion}</p>
                {formData.experiencia && <p><strong>Experiencia:</strong> {formData.experiencia}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Paso 3: Proceso de Pago */}
        <div className={`content-panel ${currentStep === 3 ? 'active' : ''}`} id="content3">
          <div className="panel-header">
            <h3>Paso 3: Proceso de Pago</h3>
            <p>¡Tu solicitud ha sido aprobada! Procede con el pago para confirmar tu inscripción</p>
          </div>
          <div className="payment-content">
            <div className="approval-notice">
              
              <div>
                <h4>¡Solicitud Aprobada!</h4>
                <p>Tu solicitud ha sido revisada y aprobada por el personal académico.</p>
              </div>
            </div>

            <div className="payment-summary">
              <div className="summary-section">
                <h4>Resumen del Evento</h4>
                <div className="event-summary">
                  <p><strong>Evento:</strong> {tituloEvento}</p>
                  <p><strong>Fecha:</strong> {fechaEvento}</p>
                  <p><strong>Horario:</strong> {horaEvento}</p>
                  <p><strong>Lugar:</strong> {lugarEvento}</p>
                </div>
              </div>

              <div className="payment-details">
                <h4>Detalles del Pago</h4>
                <div className="payment-breakdown">
                  <div className="payment-row">
                    <span>Costo del evento:</span>
                    <span>{precioEvento}</span>
                  </div>
                  <div className="payment-row">
                    <span>Descuento seminarista:</span>
                    <span className="discount">-$0 COP</span>
                  </div>
                  <hr />
                  <div className="payment-row total">
                    <span>Total a pagar:</span>
                    <span>{precioEvento}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="payment-methods">
              <h4>Métodos de Pago Disponibles</h4>
              <div className="payment-options">
                <button 
                  className="payment-option" 
                  onClick={() => procesarPago('tarjeta')}
                  disabled={isLoading}
                >
               
                  <span>Tarjeta de Crédito/Débito</span>
                </button>
                <button 
                  className="payment-option" 
                  onClick={() => procesarPago('transferencia')}
                  disabled={isLoading}
                >
                  
                  <span>Transferencia Bancaria</span>
                </button>
                <button 
                  className="payment-option" 
                  onClick={() => procesarPago('pse')}
                  disabled={isLoading}
                >
            
                  <span>PSE</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Paso 4: Completado */}
        <div className={`content-panel ${currentStep === 4 ? 'active' : ''}`} id="content4">
          <div className="panel-header">
            <h3>¡Inscripción Completada!</h3>
            <p>Tu inscripción ha sido procesada exitosamente</p>
          </div>
          <div className="completion-content">
            <div className="success-icon">
            
            </div>
            <h2>¡Felicitaciones!</h2>
            <p>Tu inscripción al evento "{tituloEvento}" ha sido completada exitosamente.</p>

            <div className="inscription-details">
              <h4>Detalles de tu Inscripción</h4>
              <div className="details-grid">
                <div className="detail-item">
                  <p><strong>Número de Inscripción:</strong> #INS-2025-001</p>
                  <p><strong>Participante:</strong> {formData.nombre}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                </div>
                <div className="detail-item">
                  <p><strong>Evento:</strong> {tituloEvento}</p>
                  <p><strong>Fecha:</strong> {fechaEvento}</p>
                  <p><strong>Lugar:</strong> {lugarEvento}</p>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button className="btn-primary">
              
                Descargar Comprobante de Inscripción
              </button>
              <button className="btn-secondary" onClick={onClose}>
                Volver a Eventos
              </button>
            </div>

            <div className="next-steps">
              <p><strong>Próximos pasos:</strong> Recibirás un correo de confirmación con todos los detalles del evento. 
              Te contactaremos 48 horas antes del evento con información adicional.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioInscripcion;