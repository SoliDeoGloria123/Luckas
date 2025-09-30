import React, { useState } from 'react';
import './FormularioInscripcion.css';
import { inscripcionService } from "../../../services/inscripcionService";


const FormularioInscripcion = ({
  evento,
  curso,
  programa,
  usuario,
  loading,
  mensaje,
  nuevoUsuario,
  onSubmit,
  onClose
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  // Obtener usuario logueado desde localStorage o prop
  const usuarioLogueado = (() => {
    if (usuario) return usuario;
    try {
      const usuarioStorage = localStorage.getItem('usuario');
      return usuarioStorage ? JSON.parse(usuarioStorage) : null;
    } catch {
      return null;
    }
  })();

  const [formData, setFormData] = useState({
    nombre: usuarioLogueado?.nombre || '',
    apellido: usuarioLogueado?.apellido || '',
    tipoDocumento: usuarioLogueado?.tipoDocumento || '',
    numeroDocumento: usuarioLogueado?.numeroDocumento || '',
    correo: usuarioLogueado?.correo || '',
    telefono: usuarioLogueado?.telefono || '',
    edad: '',
    motivacion: '',
    experiencia: ''
  });
  const [edadError, setEdadError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Crear inscripción usando usuario logueado y evento
  const crearInscripcion = async () => {
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
      // Calcular edad usando fechaNacimiento del usuario
      const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return '';
        const hoy = new Date();
        const nacimiento = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - nacimiento.getFullYear();
        const m = hoy.getMonth() - nacimiento.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
          edad--;
        }
        return edad;
      };
      const edadCalculada = calcularEdad(usuarioLogueado?.fechaNacimiento);
      // Detectar tipo de inscripción y obtener datos
      let tipoReferencia = '';
      let referencia = null;
      let categoria = null;
      let itemData = null;

      if (evento) {
        tipoReferencia = 'Eventos';
        referencia = evento._id || evento.id;
        categoria = evento.categoria?._id || evento.categoria;
        itemData = evento;
      } else if (curso) {
        tipoReferencia = 'ProgramaAcademico';
        referencia = curso._id || curso.id;
        categoria = curso.categoria?._id || curso.categoria;
        itemData = curso;
      } else if (programa) {
        tipoReferencia = 'ProgramaAcademico';
        referencia = programa._id || programa.id;
        categoria = programa.categoria?._id || programa.categoria;
        itemData = programa;
      }

      if (!tipoReferencia) {
        alert('Error: No se especificó el tipo de inscripción (evento, curso o programa).');
        return;
      }

      // Construir objeto inscripción para la API
      const inscripcionData = {
        usuario: userId,
        nombre: formData.nombre,
        apellido: formData.apellido,
        tipoDocumento: formData.tipoDocumento,
        numeroDocumento: formData.numeroDocumento,
        correo: formData.correo,
        telefono: formData.telefono,
        edad: edadCalculada,
        tipoReferencia: tipoReferencia,
        referencia: referencia,
        categoria: categoria,
        observaciones: formData.motivacion,
      };
      await inscripcionService.create(inscripcionData);
      if (onSubmit) onSubmit(inscripcionData);
    } catch (err) {
      alert('Error al crear la inscripción: ' + err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validar edad si se modifica
    if (name === 'edad') {
      let fechaNacimiento = usuario?.fechaNacimiento;
      if (!fechaNacimiento) {
        try {
          const usuarioStorage = localStorage.getItem('usuario');
          if (usuarioStorage) {
            const usuarioLocal = JSON.parse(usuarioStorage);
            fechaNacimiento = usuarioLocal?.fechaNacimiento;
          }
        } catch { }
      }
      if (fechaNacimiento) {
        const nacimiento = new Date(fechaNacimiento);
        if (!isNaN(nacimiento.getTime())) {
          const hoy = new Date();
          let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
          const m = hoy.getMonth() - nacimiento.getMonth();
          if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
            edadCalculada--;
          }
          if (parseInt(value) !== edadCalculada) {
            setEdadError(`La edad ingresada (${value}) no coincide con la calculada (${edadCalculada}) según la fecha de nacimiento.`);
          } else {
            setEdadError('');
          }
        } else {
          setEdadError('Fecha de nacimiento inválida.');
        }
      } else {
        setEdadError('No se encontró la fecha de nacimiento.');
      }
    }
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

  const procesarPago = async (metodo) => {
    setIsLoading(true);

    // Simular procesamiento de pago
    setTimeout(async () => {
      setIsLoading(false);
      await crearInscripcion();
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
  // Detectar tipo de item y obtener datos dinámicamente
  const getItemData = () => {
    if (evento) return { item: evento, tipo: 'Evento' };
    if (curso) return { item: curso, tipo: 'Curso' };
    if (programa) return { item: programa, tipo: 'Programa Técnico' };
    return { item: null, tipo: 'Item' };
  };

  const { item, tipo } = getItemData();

  // Usa datos del item seleccionado
  const tituloItem = item?.nombre || `${tipo} sin título`;
  const descripcionItem = item?.descripcion || `Descripción del ${tipo.toLowerCase()}`;
  const fechaItem = item?.fecha ? new Date(item.fecha).toLocaleDateString() :
    item?.fechaEvento ? new Date(item.fechaEvento).toLocaleDateString() :
      item?.fechaInicio ? new Date(item.fechaInicio).toLocaleDateString() :
        "Fecha no especificada";
  const horaItem = item?.hora || item?.horaInicio || "Hora no especificada";
  const lugarItem = item?.lugar || item?.ubicacion || "Ubicación no especificada";
  const precioItem = item?.precio || "Precio no especificado";

  return (
    <div className="modal-overlay-inscribirse-seminario active">
      <div className="modal-content-inscribirse-seminario">
        <div className="event-header-inscribirse-seminario">
          <div className="event-info-seminario">
            <h1 className="event-title-inscribirse-seminario ">{tituloItem}</h1>
            <p className="event-description-inscribirse-seminario">{descripcionItem}</p>
            <div className="event-details-inscribirse-seminario">
              <span> {fechaItem}</span>
              <span> {horaItem}</span>
              <span>{lugarItem}</span>
              <span className="price-inscribirse-inscribirse-seminario">{precioItem}</span>
            </div>
          </div>
          <button className="close-btn-inscribirse-seminario" onClick={onClose}>
          <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Barra de Progreso */}
        <div className="progress-container-inscribirse-seminario">
          <h2>Progreso de Inscripción</h2>
          <div className="progress-bar-inscribirse-seminario">
            <div className="progress-fill-inscribirse-seminario" id="progressFill"></div>
          </div>
          <div className="steps-container-inscribirse-seminario">
            <div className={`step-inscribirse-seminario ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
              <div className="step-icon-inscribirse-seminario">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="step-info-inscribirse-seminario">
                <h4>Solicitud de Inscripción</h4>
                <p>Completa tus datos y envía la solicitud</p>
              </div>
            </div>
            <div className={`step-inscribirse-seminario ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
              <div className="step-icon-inscribirse-seminario">
                <i className="fas fa-user-check"></i>
              </div>
              <div className="step-info-inscribirse-seminario">
                <h4>Revisión del Personal</h4>
                <p>El personal académico revisará tu solicitud</p>
              </div>
            </div>
            <div className={`step-inscribirse-seminario  ${currentStep === 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
              <div className="step-icon-inscribirse-seminario">
                <i className="fas fa-credit-card"></i>
              </div>
              <div className="step-info-inscribirse-seminario">
                <h4>Proceso de Pago</h4>
                <p>Realiza el pago para confirmar tu inscripción</p>
              </div>
            </div>
            <div className={`step-inscribirse-seminario  ${currentStep === 4 ? 'active' : 'completed'}`}>
              <div className="step-icon-inscribirse-seminario">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="step-info-inscribirse-seminario">
                <h4>Inscripción Completada</h4>
                <p>¡Felicitaciones! Tu inscripción está confirmada</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contenido de los Pasos */}
        <div className="step-content-seminario">
          {/* Paso 1: Solicitud de Inscripción */}
          <div className={`content-panel-seminario ${currentStep === 1 ? 'active' : ''}`} id="content1">
            <div className="panel-header-seminario">
              <h3>Paso 1: Solicitud de Inscripción</h3>
              <p>Completa todos los campos requeridos para enviar tu solicitud de inscripción</p>
            </div>
            <form onSubmit={handleSubmit} className="registration-form-seminario">
              <div className="form-row-semianrio">
                <div className="form-group-semianrio">
                  <label htmlFor="nombre">Nombres</label>
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
                  <label htmlFor="apellido">Apellidos</label>
                  <input
                    type="text"
                    id="apellido"
                    name="apellido"
                    value={formData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>

              </div>
              <div className="form-row-semianrio">
                <div className="form-group-semianrio">
                  <label htmlFor="documento">Tipo de Documento</label>
                  <select
                    id="documento"
                    name="tipoDocumento"
                    value={formData.tipoDocumento || usuario?.tipoDocumento || ''}
                    onChange={handleInputChange}
                    required
                    disabled={!!usuario?.tipoDocumento}
                  >
                    <option value="">Selecciona...</option>
                    <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                    <option value="Tarjeta de identidad">Tarjeta de identidad</option>
                    <option value="Cédula de extranjería">Cédula de extranjería</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="form-group-semianrio">
                  <label htmlFor="numeroDocumento">Número de Documento</label>
                  <input
                    type="text"
                    id="numeroDocumento"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-row-semianrio">

                <div className="form-group-semianrio">
                  <label htmlFor="edad">Edad</label>
                  <input
                    type="number"
                    id="edad"
                    name="edad"
                    value={formData.edad}
                    onChange={handleInputChange}
                    required
                  />
                  {edadError && (
                    <div style={{ color: 'red', fontSize: '0.9em' }}>{edadError}</div>
                  )}
                </div>
                <div className="form-group-semianrio">
                  <label htmlFor="telefono">Teléfono</label>
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
                  <label htmlFor="correo">Correo Electrónico</label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={usuarioLogueado?.correo || formData.correo}
                    readOnly
                    required
                  />
                </div>
              <div className="form-group-semianrio">
                <label htmlFor="motivacion">Motivación para participar</label>
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
          <div className={`content-panel-seminario ${currentStep === 2 ? 'active' : ''}`} id="content2">
            <div className="panel-header-seminario">
              <h3>Paso 2: Revisión del Personal</h3>
              <p>Tu solicitud está siendo revisada por el personal académico</p>
            </div>
            <div className="review-content-seminario">
              <div className="loading-spinner-seminario"></div>
              <h4>Revisando tu solicitud...</h4>
              <p>El personal académico está evaluando tu solicitud. Este proceso puede tomar entre 1-3 días hábiles.</p>

              {/* Validación automática de datos */}
              {(() => {
                let usuarioLogueado = usuario;
                if (!usuarioLogueado) {
                  try {
                    const usuarioStorage = localStorage.getItem('usuario');
                    if (usuarioStorage) {
                      usuarioLogueado = JSON.parse(usuarioStorage);
                    }
                  } catch { }
                }
                const advertencias = [];
                if (usuarioLogueado) {
                  if (formData.nombre !== usuarioLogueado.nombre) {
                    advertencias.push('El nombre ingresado no coincide con el registrado.');
                  }
                  if (formData.apellido !== usuarioLogueado.apellido) {
                    advertencias.push('El apellido ingresado no coincide con el registrado.');
                  }
                  if (formData.tipoDocumento !== usuarioLogueado.tipoDocumento) {
                    advertencias.push('El tipo de documento no coincide con el registrado.');
                  }
                  if (formData.numeroDocumento !== usuarioLogueado.numeroDocumento) {
                    advertencias.push('El número de documento no coincide con el registrado.');
                  }
                  if (formData.correo !== usuarioLogueado.correo) {
                    advertencias.push('El correo electrónico no coincide con el registrado.');
                  }
                  if (formData.telefono !== usuarioLogueado.telefono) {
                    advertencias.push('El teléfono no coincide con el registrado.');
                  }
                  if (formData.edad) {
                    const nacimiento = new Date(usuarioLogueado.fechaNacimiento);
                    if (!isNaN(nacimiento.getTime())) {
                      const hoy = new Date();
                      let edadCalculada = hoy.getFullYear() - nacimiento.getFullYear();
                      const m = hoy.getMonth() - nacimiento.getMonth();
                      if (m < 0 || (m === 0 && hoy.getDate() < nacimiento.getDate())) {
                        edadCalculada--;
                      }
                      if (parseInt(formData.edad) !== edadCalculada) {
                        advertencias.push('La edad ingresada no coincide con la calculada según la fecha de nacimiento.');
                      }
                    }
                  }
                }
                return advertencias.length > 0 ? (
                  <div style={{ color: 'red', marginBottom: '1em' }}>
                    <strong>Advertencias de validación:</strong>
                    <ul>
                      {advertencias.map((adv, idx) => <li key={idx}>{adv}</li>)}
                    </ul>
                  </div>
                ) : (
                  <div style={{ color: 'green', marginBottom: '1em' }}>
                    Todos los datos coinciden con el usuario registrado.
                  </div>
                );
              })()}

              <div className="submitted-data-seminario">
                <h5>Datos enviados:</h5>
                <div>
                  <p><strong>Nombre:</strong> {formData.nombre}</p>
                  <p><strong>Apellido:</strong> {formData.apellido}</p>
                  <p><strong>Tipo de Documento:</strong> {formData.tipoDocumento}</p>
                  <p><strong>Número de Documento:</strong> {formData.numeroDocumento}</p>
                  <p><strong>Email:</strong> {formData.correo}</p>
                  <p><strong>Teléfono:</strong> {formData.telefono}</p>
                  <p><strong>Edad:</strong> {formData.edad}</p>
                  <p><strong>Motivación:</strong> {formData.motivacion}</p>
                  {formData.experiencia && <p><strong>Experiencia:</strong> {formData.experiencia}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Paso 3: Proceso de Pago */}
          <div className={`content-panel-seminario ${currentStep === 3 ? 'active' : ''}`} id="content3">
            <div className="content-panel-seminarior">
              <h3>Paso 3: Proceso de Pago</h3>
              <p>¡Tu solicitud ha sido aprobada! Procede con el pago para confirmar tu inscripción</p>
            </div>
            <div className="payment-content">
              <div className="approval-notice-seminario">
                <div>
                  <h4>¡Solicitud Aprobada!</h4>
                  <p>Tu solicitud ha sido revisada y aprobada por el personal académico.</p>
                </div>
              </div>

              <div className="payment-summary-seminario">
                <div className="summary-section-seminario">
                  <h4>Resumen del Evento</h4>
                  <div className="event-summary-seminario">
                    <p><strong>Evento:</strong> {tituloItem}</p>
                    <p><strong>Fecha:</strong> {fechaItem}</p>
                    <p><strong>Horario:</strong> {horaItem}</p>
                    <p><strong>Lugar:</strong> {lugarItem}</p>
                  </div>
                </div>

                <div className="payment-details-seminario">
                  <h4>Detalles del Pago</h4>
                  <div className="payment-breakdown-seminario">
                    <div className="payment-row-seminario">
                      <span>Costo del evento:</span>
                      <span>{precioItem}</span>
                    </div>
                    <div className="payment-row-seminario">
                      <span>Descuento seminarista:</span>
                      <span className="discount-seminario">-$0 COP</span>
                    </div>
                    <hr />
                    <div className="payment-row-seminario total">
                      <span>Total a pagar:</span>
                      <span>{precioItem}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="payment-methods-seminario">
                <h4>Métodos de Pago Disponibles</h4>
                <div className="payment-options-seminario">
                  <button
                    className="payment-option-seminario"
                    onClick={() => procesarPago('tarjeta')}
                    disabled={isLoading}
                  >
                    <span>Tarjeta de Crédito/Débito</span>
                  </button>
                  <button
                    className="payment-option-seminario"
                    onClick={() => procesarPago('transferencia')}
                    disabled={isLoading}
                  >
                    <span>Transferencia Bancaria</span>
                  </button>
                  <button
                    className="payment-option-seminario"
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
          <div className={`content-panel-seminario ${currentStep === 4 ? 'active' : ''}`} id="content4">
            <div className="panel-header-seminario">
              <h3>¡Inscripción Completada!</h3>
              <p>Tu inscripción ha sido procesada exitosamente</p>
            </div>
            <div className="completion-content-seminario">
              <div className="success-icon-seminario">
                <i className="fas fa-check-circle"></i>
              </div>
              <h2>¡Felicitaciones!</h2>
              <p>Tu inscripción al evento "{tituloItem}" ha sido completada exitosamente.</p>

              <div className="inscription-details-seminario">
                <h4>Detalles de tu Inscripción</h4>
                <div className="details-grid-seminario">
                  <div className="detail-item-seminario">
                    <p><strong>Número de Inscripción:</strong> #INS-2025-001</p>
                    <p><strong>Participante:</strong> {formData.nombre}</p>
                    <p><strong>Email:</strong> {formData.correo}</p>
                  </div>
                  <div className="detail-item-seminario">
                    <p><strong>Evento:</strong> {tituloItem}</p>
                    <p><strong>Fecha:</strong> {fechaItem}</p>
                    <p><strong>Lugar:</strong> {lugarItem}</p>
                  </div>
                </div>
              </div>
              <div className="action-buttons-seminario">
                <button className="btn-primary-semianrio">

                  Descargar Comprobante de Inscripción
                </button>
                <button className="btn-secondary-semianrio" onClick={onClose}>
                  Volver a Eventos
                </button>
              </div>

              <div className="next-steps-seminario">
                <p><strong>Próximos pasos:</strong> Recibirás un correo de confirmación con todos los detalles del evento.
                  Te contactaremos 48 horas antes del evento con información adicional.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioInscripcion;