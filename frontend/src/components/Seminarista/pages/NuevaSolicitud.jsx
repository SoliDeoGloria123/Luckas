import React, { useState, useEffect } from 'react';
import {
  FaCalendarAlt, FaTimes, FaDoorOpen, FaGraduationCap,
  FaTools, FaHeart, FaEllipsisH, FaArrowLeft, FaArrowRight, FaPaperPlane,
  FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle,
  FaCloudUploadAlt, FaFile,
} from 'react-icons/fa';
import './NuevaSolicitud.css';
import Header from '../Shared/Header';
import { solicitudService } from '../../../services/solicirudService';
import { categorizacionService } from '../../../services/categorizacionService';
import { userService } from '../../../services/userService'; // Debes tener un servicio para usuarios


const NuevaSolicitud = () => {
  const [currentStep, setCurrentStep] = useState(2);
  const [selectedType, setSelectedType] = useState('Inscripción');
  const [formData, setFormData] = useState({});
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMobileNav, setShowMobileNav] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [tesoreroId, setTesoreroId] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [categories, setCategories] = useState([]);
  const [modeloReferencia, setModeloReferencia] = useState('');
  const [referencia, setReferencia] = useState('');
  const [opcionesReferencia, setOpcionesReferencia] = useState([]);
  const token = localStorage.getItem('token');


  // Obtener usuario logueado al montar
  useEffect(() => {
    const usuarioStorage = localStorage.getItem('usuario');
    if (usuarioStorage) {
      setUsuarioLogueado(JSON.parse(usuarioStorage));
    }
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categorizacionService.getAll();
        setCategories(Array.isArray(data.data) ? data.data : []);
      } catch (err) {
        showToast('error', 'Error al cargar categorías', err.message || 'No se pudieron cargar las categorías');
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchTesorero = async () => {
      try {
       const res = await userService.getAllUsers(); // Debe devolver todos los usuarios
        const tesorero = res.data.find(u => u.role === 'tesorero');
        if (tesorero) setTesoreroId(tesorero._id);
      } catch (err) {
        console.log('Error fetching tesorero:', err);
      }
    };
    fetchTesorero();
  }, []);

  const typeConfigs = {
    Inscripción: {
      title: 'Inscripción',
      description: 'Solicitudes para inscribirse en eventos, cursos, etc.',
      icon: <FaGraduationCap />
    },
    Hospedaje: {
      title: 'Hospedaje',
      description: 'Solicitudes relacionadas con alojamiento o cabañas.',
      icon: <FaDoorOpen />
    },
    Alimentación: {
      title: 'Alimentación',
      description: 'Solicitudes sobre comidas, comedor, dietas, etc.',
      icon: <FaHeart />
    },
    Otra: {
      title: 'Otra',
      description: 'Cualquier otra solicitud que no encaje en las anteriores.',
      icon: <FaEllipsisH />
    }
  };

  const cargarOpcionesReferencia = async (modelo) => {
    let endpoint = '';
    switch (modelo) {
      case 'Eventos':
        endpoint = 'http://localhost:3000/api/eventos';
        break;
      case 'Cabana':
        endpoint = 'http://localhost:3000/api/cabanas';
        break;
      case 'Curso':
        endpoint = 'http://localhost:3000/api/cursos';
        break;
      case 'ProgramaTecnico':
        endpoint = 'http://localhost:3000/api/programas-tecnicos';
        break;
      case 'Inscripcion':
        endpoint = 'http://localhost:3000/api/inscripciones';
        break;
      case 'Reserva':
        endpoint = 'http://localhost:3000/api/reservas';
        break;
      case 'Comedor':
        endpoint = 'http://localhost:3000/api/comedor';
        break;
      default:
        endpoint = '';
    }
    if (!endpoint) {
      setOpcionesReferencia([]);
      return;
    }
    try {
      const res = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setOpcionesReferencia(data.data || []);
    } catch (err) {
      setOpcionesReferencia([]);
    }
  };

  const modeloCategoriaMap = {
    'Eventos': 'evento',
    'Cabana': 'cabana',
    'Curso': 'curso',
    'ProgramaTecnico': 'programa_tecnico',
    'Inscripcion': 'inscripcion',
    'Reserva': 'reserva',
    'Comedor': 'comedor'
  };

  const handleInputChange = (e) => {
    if (e.target.name === 'modeloReferencia') {
      setModeloReferencia(e.target.value);
      setReferencia('');
      cargarOpcionesReferencia(e.target.value);
      setFormData({
        ...formData,
        category: '', // Limpiar categoría al cambiar modelo
        modeloReferencia: e.target.value
      });
      return;
    }
    if (e.target.name === 'referencia') {
      setReferencia(e.target.value);
      // Buscar la referencia seleccionada en opcionesReferencia
      const refObj = opcionesReferencia.find(op => (op._id || op.id) === e.target.value);
      // Buscar la categoría asociada a la referencia
      let categoriaId = '';
      if (refObj && refObj.categoria) {
        // Puede ser un objeto o solo el id
        categoriaId = typeof refObj.categoria === 'object' ? refObj.categoria._id : refObj.categoria;
        // Mostrar mensaje informativo al usuario
        const categoria = categories.find(cat => cat._id === categoriaId);
        if (categoria) {
          showToast('info', 'Categoría seleccionada automáticamente', 
            `Se ha seleccionado la categoría "${categoria.nombre}" asociada a este evento.`);
        }
      }
      setFormData({
        ...formData,
        category: categoriaId,
        referencia: e.target.value
      });
      return;
    }
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const selectRequestType = (type) => {
    setSelectedType(type);
    setTimeout(() => {
      nextStep();
    }, 500);
  };

  const nextStep = () => {
    if (currentStep === 1 && !selectedType) {
      showToast('warning', 'Selección requerida', 'Por favor selecciona un tipo de solicitud');
      return;
    }

    if (currentStep === 2 && !validateForm()) {
      showToast('error', 'Formulario incompleto', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateForm = () => {
    // Basic validation - check required fields
    if (currentStep === 2) {
      if (!formData.requestTitle || !formData.requestDescription || !formData.requestJustification) {
        return false;
      }
    }
    return true;
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(validateFile);
    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  const validateFile = (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png'
    ];

    if (file.size > maxSize) {
      showToast('error', 'Archivo muy grande', `El archivo ${file.name} excede el límite de 5MB`);
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      showToast('error', 'Tipo de archivo no válido', `El archivo ${file.name} no es un tipo permitido`);
      return false;
    }

    return true;
  };

  const removeFile = (fileName) => {
    setUploadedFiles(uploadedFiles.filter(file => file.name !== fileName));
    showToast('success', 'Archivo eliminado', `${fileName} ha sido eliminado`);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const showToast = (type, title, message) => {
    const newToast = {
      id: Date.now(),
      type,
      title,
      message
    };

    setToasts([...toasts, newToast]);

    setTimeout(() => {
      removeToast(newToast.id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  const submitRequest = async () => {
    console.log('=== INICIANDO ENVÍO DE SOLICITUD ===');

    if (!acceptTerms) {
      showToast('warning', 'Términos requeridos', 'Debes aceptar los términos y condiciones');
      return;
    }

    if (!tesoreroId) {
      showToast('error', 'Responsable no encontrado', 'No se pudo asignar el tesorero como responsable');
      return;
    }

    showToast('info', 'Enviando solicitud', 'Por favor espera...');

    // Obtener usuario logueado
    const usuarioStorage = localStorage.getItem('usuario');
    const usuario = usuarioStorage ? JSON.parse(usuarioStorage) : null;
    console.log('Usuario obtenido:', usuario);

    if (!usuario) {
      showToast('error', 'Usuario no encontrado', 'Debes iniciar sesión para enviar la solicitud');
      return;
    }

    // Validar campos requeridos
    if (!formData.requestTitle || !formData.requestDescription) {
      showToast('error', 'Campos requeridos', 'El título y la descripción son obligatorios');
      console.log('Validación falló - Título:', formData.requestTitle, 'Descripción:', formData.requestDescription);
      return;
    }

    // Construir objeto solicitud para la API
    const solicitudData = {
      solicitante: usuario._id || usuario.id,
      titulo: formData.requestTitle,
      correo: formData.correo || usuario.correo || usuario.email,
      telefono: formData.telefono || usuario.telefono || '',
      tipoSolicitud: selectedType,
      categoria: formData.category || categories[0]?._id,
      descripcion: formData.requestDescription,
      prioridad: formData.requestPriority || 'Media',
      responsable: tesoreroId,
      origen: 'formulario'
    };

    // Solo agregar campos opcionales si existen
    if (modeloReferencia) {
      solicitudData.modeloReferencia = modeloReferencia;
    }
    if (referencia) {
      solicitudData.referencia = referencia;
    }
    if (formData.requestJustification) {
      solicitudData.observaciones = formData.requestJustification;
    }

    console.log('Datos finales a enviar:', solicitudData);

    try {
      const response = await solicitudService.create(solicitudData);
      console.log('Respuesta del backend:', response);
      
      if (response.success) {
        showToast('success', '¡Solicitud enviada!', 'Tu solicitud ha sido registrada correctamente.');
        // Limpiar formulario
        setFormData({});
        setSelectedType('');
        setAcceptTerms(false);
      } else {
        showToast('error', 'Error al enviar', response.message || 'No se pudo enviar la solicitud');
      }
    } catch (err) {
      console.error('Error enviando solicitud:', err);
      showToast('error', 'Error al enviar', err.message || 'No se pudo enviar la solicitud');
    }
  };

  const generateRequestNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `SOL-${year}-${random}`;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      'baja': 'Baja',
      'normal': 'Normal',
      'alta': 'Alta',
      'urgente': 'Urgente'
    };
    return labels[priority] || 'Normal';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderDynamicFields = () => {
    switch (selectedType) {
      case 'permiso':
        return (
          <>
            <div className="form-row-nuevasolicitud">
              <div className="form-group-nuevasolicitud">
                <label htmlFor="exitDate">Fecha de Salida *</label>
                <input
                  type="date"
                  id="exitDate"
                  name="exitDate"
                  required
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group-nuevasolicitud">
                <label htmlFor="returnDate">Fecha de Regreso </label>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  required
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="form-group-nuevasolicitud">
              <label htmlFor="destination">Destino</label>
              <input
                type="text"
                id="destination"
                name="destination"
                placeholder="¿A dónde vas?"
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group-nuevasolicitud">
              <label htmlFor="emergencyContact">Contacto de Emergencia</label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                placeholder="Nombre y teléfono"
                onChange={handleInputChange}
              />
            </div>
          </>
        );
      case 'academico':
        return (
          <>
            <div className="form-row-nuevasolicitud">
              <div className="form-group-nuevasolicitud">
                <label htmlFor="subject">Materia</label>
                <select
                  id="subject"
                  name="subject"
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar materia</option>
                  <option value="teologia">Teología Dogmática</option>
                  <option value="filosofia">Filosofía</option>
                  <option value="liturgia">Liturgia</option>
                  <option value="pastoral">Teología Pastoral</option>
                  <option value="escritura">Sagrada Escritura</option>
                </select>
              </div>
              <div className="form-group-nuevasolicitud">
                <label htmlFor="semester">Semestre</label>
                <select
                  id="semester"
                  name="semester"
                  onChange={handleInputChange}
                >
                  <option value="">Seleccionar semestre</option>
                  <option value="1">Primer Semestre</option>
                  <option value="2">Segundo Semestre</option>
                  <option value="3">Tercer Semestre</option>
                  <option value="4">Cuarto Semestre</option>
                  <option value="5">Quinto Semestre</option>
                  <option value="6">Sexto Semestre</option>
                </select>
              </div>
            </div>
            <div className="form-group-nuevasolicitud">
              <label htmlFor="currentSchedule">Horario Actual</label>
              <textarea
                id="currentSchedule"
                name="currentSchedule"
                rows="3"
                placeholder="Describe tu horario actual"
                onChange={handleInputChange}
              ></textarea>
            </div>
            <div className="form-group-nuevasolicitud">
              <label htmlFor="proposedSchedule">Horario Propuesto</label>
              <textarea
                id="proposedSchedule"
                name="proposedSchedule"
                rows="3"
                placeholder="Describe el horario que propones"
                onChange={handleInputChange}
              ></textarea>
            </div>
          </>
        );
      // Add other cases for different request types
      default:
        return (
          <>
            <div className="form-group-nuevasolicitud">
              <label htmlFor="category">
                Categoría Específica
                {referencia && formData.category && (
                  <span style={{ color: '#28a745', fontSize: '12px', marginLeft: '5px' }}>
                    (Seleccionada automáticamente según el evento)
                  </span>
                )}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                required
                disabled={!!referencia} // Solo deshabilitado si hay una referencia seleccionada
              >
                <option value="">
                  {referencia ? 'Categoría asociada al evento seleccionado' : 'Selecciona una categoría'}
                </option>
                {categories
                  .filter(cat => {
                    // Si hay referencia seleccionada, mostrar solo la categoría asociada
                    if (referencia && formData.category) {
                      return cat._id === formData.category;
                    }
                    // Si no hay referencia, mostrar todas las categorías del tipo correspondiente
                    const tipoCategoria = modeloCategoriaMap[modeloReferencia] || 'general';
                    return !modeloReferencia || cat.tipo === tipoCategoria || cat.tipo === 'general';
                  })
                  .map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.nombre} {cat.codigo ? `(${cat.codigo})` : ''}
                    </option>
                  ))}
              </select>
              {referencia && formData.category && (
                <small style={{ color: '#6c757d', fontSize: '12px' }}>
                  Esta categoría se seleccionó automáticamente porque está asociada al evento elegido.
                </small>
              )}
            </div>
            <div className="form-group-nuevasolicitud">
              <label htmlFor="additionalInfo">Información Adicional</label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                rows="4"
                placeholder="Proporciona cualquier información adicional relevante"
                onChange={handleInputChange}
              ></textarea>
            </div>
          </>
        );
    }
  };

  return (
    <div className="app">
      <Header />
      {/* Main Content */}
      <main className="main-content-nuevasolicitud">
        <div className="container-nuevasolicitud">
          {/* Page Header */}
          <div className="page-header-nuevasolicitud">
            <h1>Nueva Solicitud</h1>
            <p>Crea una nueva solicitud siguiendo los pasos a continuación</p>
          </div>

          {/* Progress Steps */}
          <div className="progress-steps-nuevasolicitud">
            <div className={`step-nuevasolicitud ${currentStep > 1 ? 'completed' : ''} ${currentStep === 1 ? 'active' : ''}`}>
              <div className="step-number-nuevasolicitud">1</div>
              <div className="step-label-nuevasolicitud">Tipo de Solicitud</div>
            </div>
            <div className={`step-nuevasolicitud ${currentStep > 2 ? 'completed' : ''} ${currentStep === 2 ? 'active' : ''}`}>
              <div className="step-number-nuevasolicitud">2</div>
              <div className="step-label-nuevasolicitud">Detalles</div>
            </div>
            <div className={`step-nuevasolicitud ${currentStep === 3 ? 'active' : ''}`}>
              <div className="step-number-nuevasolicitud">3</div>
              <div className="step-label-nuevasolicitud">Confirmación</div>
            </div>
          </div>

          {/* Form Container */}
          <div className="form-container-nuevasolicitud">
            {/* Step 1: Tipo de Solicitud */}
            <div className="step-content-nuevasolicitud" style={{ display: currentStep === 1 ? 'block' : 'none' }}>
              <div className="step-header-nuevasolicitud">
                <h2>Paso 1: Selecciona el Tipo de Solicitud</h2>
                <p>Elige la categoría que mejor describa tu solicitud</p>
              </div>

              <div className="request-types-nuevasolicitud">
                {Object.entries(typeConfigs).map(([type, config]) => (
                  <div
                    key={type}
                    className={`request-type-card-nuevasolicitud ${selectedType === type ? 'selected' : ''}`}
                    onClick={() => selectRequestType(type)}
                    data-type={type}
                  >
                    <div className="card-icon-nuevasolicitud">
                      {config.icon}
                    </div>
                    <div className="card-content-nuevasolicitud">
                      <h3>{config.title}</h3>
                      <p>{config.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 2: Detalles */}
            <div className="step-content-nuevasolicitud" style={{ display: currentStep === 2 ? 'block' : 'none' }}>
              <div className="step-header-nuevasolicitud">
                <h2>Paso 2: Completa los Detalles</h2>
                <p>Proporciona toda la información necesaria para tu solicitud</p>
                <button
                  className="change-type-btn-nuevasolicitud"
                  onClick={() => setCurrentStep(1)}
                >
                  <FaArrowLeft />
                  <span>Cambiar tipo</span>
                </button>
              </div>

              {/* Selected Type Display */}
              <div className="selected-type-nuevasolicitud">
                <div className="selected-type-icon-nuevasolicitud">
                  {typeConfigs[selectedType]?.icon}
                </div>
                <div className="selected-type-content-nuevasolicitud">
                  <h3>{typeConfigs[selectedType]?.title}</h3>
                  <p>{typeConfigs[selectedType]?.description}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="request-form-nuevasolicitud">
                {/* Campos autocompletados y solo lectura */}
                <div className="form-row-nuevasolicitud">
                  <div className="form-group-nuevasolicitud">
                    <label htmlFor="correo">Correo</label>
                    <input
                      type="email"
                      id="correo"
                      name="correo"
                      value={usuarioLogueado?.correo || usuarioLogueado?.correoElectronico || usuarioLogueado?.email || ''}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="form-group-nuevasolicitud">
                    <label htmlFor="telefono">Teléfono</label>
                    <input
                      type="text"
                      id="telefono"
                      name="telefono"
                      value={usuarioLogueado?.telefono || ''}
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                {/* Campos dinámicos para modeloReferencia y referencia */}
                {(selectedType === 'Inscripción' || selectedType === 'Hospedaje') && (
                  <>
                    <div className="form-group-nuevasolicitud">
                      <label htmlFor="modeloReferencia">Modelo de Referencia</label>
                      <select
                        id="modeloReferencia"
                        name="modeloReferencia"
                        value={modeloReferencia}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Selecciona el modelo</option>
                        <option value="Eventos">Evento</option>
                        <option value="Cabana">Cabaña</option>
                        <option value="Curso">Curso</option>
                        <option value="ProgramaTecnico">Programa Técnico</option>
                        <option value="Inscripcion">Inscripción</option>
                        <option value="Reserva">Reserva</option>
                        <option value="Comedor">Comedor</option>
                      </select>
                    </div>
                    {modeloReferencia && (
                      <div className="form-group-nuevasolicitud">
                        <label htmlFor="referencia">Referencia</label>
                        <select
                          id="referencia"
                          name="referencia"
                          value={referencia}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Selecciona una opción</option>
                          {opcionesReferencia.map((op) => (
                            <option key={op._id || op.id} value={op._id || op.id}>
                              {op.nombre || op.titulo || op.descripcion || op._id}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
                <div className="form-group-nuevasolicitud">
                  <label htmlFor="requestTitle">Título de la Solicitud</label>
                  <input
                    type="text"
                    id="requestTitle"
                    name="requestTitle"
                    required
                    onChange={handleInputChange}
                  />
                  <div className="error-message"></div>
                </div>

                <div className="form-group-nuevasolicitud">
                  <label htmlFor="requestDescription">Descripción Detallada</label>
                  <textarea
                    id="requestDescription"
                    name="requestDescription"
                    rows="6"
                    placeholder="Describe detalladamente lo que necesitas..."
                    required
                    onChange={handleInputChange}
                  ></textarea>
                  <div className="error-message"></div>
                </div>

                <div className="form-group-nuevasolicitud">
                  <label htmlFor="requestJustification">Justificación</label>
                  <textarea
                    id="requestJustification"
                    name="requestJustification"
                    rows="4"
                    placeholder="Explica por qué es necesaria esta solicitud..."
                    required
                    onChange={handleInputChange}
                  ></textarea>
                  <div className="error-message"></div>
                </div>

                <div className="form-row-nuevasolicitud">
                  <div className="form-group-nuevasolicitud">
                    <label htmlFor="requestPriority">Prioridad</label>
                    <select
                      id="requestPriority"
                      name="requestPriority"
                      onChange={handleInputChange}
                    >
                      <option value="Baja">Baja</option>
                      <option value="Media" selected>Media</option>
                      <option value="Alta">Alta</option>

                    </select>
                  </div>

                  <div className="form-group-nuevasolicitud">
                    <label htmlFor="requestDate">Fecha Requerida</label>
                    <input
                      type="date"
                      id="requestDate"
                      name="requestDate"
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Dynamic Fields Based on Type */}
                <div className="dynamic-fields">
                  {renderDynamicFields()}
                </div>

                {/* File Upload */}
                <div className="form-group-nuevasolicitud">
                  <label>Documentos Adjuntos</label>
                  <div className="file-upload-area">
                    <div className="file-upload-content">
                      <FaCloudUploadAlt />
                      <p>Arrastra archivos aquí o <span className="upload-link">selecciona archivos</span></p>
                      <small>Máximo 5MB por archivo. Formatos: PDF, DOC, DOCX, JPG, PNG</small>
                    </div>
                    <input
                      type="file"
                      id="fileInput"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                    />
                  </div>
                  <div className="uploaded-files-nuevasolicitud">
                    {uploadedFiles.map(file => (
                      <div key={file.name} className="uploaded-file-nuevasolicitud">
                        <div className="file-info-nuevasolicitud">
                          <FaFile className="file-icon-nuevasolicitud" />
                          <div className="file-details-nuevasolicitud">
                            <div className="file-name-nuevasolicitud">{file.name}</div>
                            <div className="file-size-nuevasolicitud">{formatFileSize(file.size)}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="remove-file"
                          onClick={() => removeFile(file.name)}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Confirmación */}
            <div className="step-content-nuevasolicitud" style={{ display: currentStep === 3 ? 'block' : 'none' }}>
              <div className="step-header-nuevasolicitud">
                <h2>Paso 3: Confirmación</h2>
                <p>Revisa todos los detalles antes de enviar tu solicitud</p>
              </div>

              <div className="confirmation-content-nuevasolicitud">
                <div className="confirmation-card-nuevasolicitud">
                  <h3>Resumen de la Solicitud</h3>
                  <div className="confirmation-details-nuevasolicitud">
                    <div className="detail-row-nuevasolicitud">
                      <div className="detail-label-nuevasolicitud">Tipo de Solicitud:</div>
                      <div className="detail-value-nuevasolicitud">{typeConfigs[selectedType]?.title}</div>
                    </div>
                    <div className="detail-row-nuevasolicitud">
                      <div className="detail-label-nuevasolicitud">Título:</div>
                      <div className="detail-value-nuevasolicitud">{formData.requestTitle || 'No especificado'}</div>
                    </div>
                    <div className="detail-row-nuevasolicitud">
                      <div className="detail-label-nuevasolicitud">Prioridad:</div>
                      <div className="detail-value-nuevasolicitud">{getPriorityLabel(formData.requestPriority)}</div>
                    </div>
                    <div className="detail-row-nuevasolicitud">
                      <div className="detail-label-nuevasolicitud">Fecha Requerida:</div>
                      <div className="detail-value-nuevasolicitud">{formatDate(formData.requestDate)}</div>
                    </div>
                    <div className="detail-row-nuevasolicitud">
                      <div className="detail-label-nuevasolicitud">Descripción:</div>
                      <div className="detail-value-nuevasolicitud">{formData.requestDescription || 'No especificada'}</div>
                    </div>
                    <div className="detail-row-nuevasolicitud">
                      <div className="detail-label-nuevasolicitud">Archivos Adjuntos:</div>
                      <div className="detail-value-nuevasolicitud">{uploadedFiles.length} archivo(s)</div>
                    </div>
                  </div>
                </div>

                <div className="terms-section-nuevasolicitud">
                  <label className="checkbox-container-nuevasolicitud">
                    <input
                      type="checkbox"
                      id="acceptTerms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                    />

                    Acepto los términos y condiciones del seminario
                  </label>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="form-navigation">
              {currentStep > 1 && (
                <button
                  type="button"
                  className="btn-nuevasolicitud btn-secondary-nuevasolicitud"
                  onClick={previousStep}
                >
                  <FaArrowLeft />
                  <span>Anterior</span>
                </button>
              )}
              {currentStep < 3 ? (
                <button
                  type="button"
                  className="btn-nuevasolicitud btn-primary-nuevasolicitud"
                  onClick={nextStep}
                >
                  <span>Siguiente</span>
                  <FaArrowRight />
                </button>
              ) : (
                <button
                  type="button"
                  className={`btn-nuevasolicitud btn-success-nuevasolicitud${!acceptTerms ? ' disabled' : ''}`}
                  onClick={acceptTerms ? submitRequest : undefined}
                  disabled={!acceptTerms}
                  style={{ opacity: !acceptTerms ? 0.5 : 1, cursor: !acceptTerms ? 'not-allowed' : 'pointer' }}
                >
                  <FaPaperPlane />
                  <span>Enviar Solicitud</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map(toast => {
          const iconMap = {
            success: <FaCheckCircle />,
            error: <FaExclamationCircle />,
            warning: <FaExclamationTriangle />,
            info: <FaInfoCircle />
          };

          return (
            <div key={toast.id} className={`toast toast-${toast.type}`}>
              <div className="toast-icon">
                {iconMap[toast.type]}
              </div>
              <div className="toast-content">
                <div className="toast-title">{toast.title}</div>
                <div className="toast-message">{toast.message}</div>
              </div>
              <button
                className="toast-close"
                onClick={() => removeToast(toast.id)}
              >
                <FaTimes />
              </button>
            </div>


          );
        })}
      </div>
    </div>
  );
};

export default NuevaSolicitud;
