import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FieldList from './common/FieldList';
import PensumList from './common/PensumList';
import FormField from './common/FormField';
import PropTypes from 'prop-types';
import { programaSeleccionadoPropType, formDataPropType } from './common/programaModalTypes';
import { categorizacionService } from '../../../services/categorizacionService';

// ============ HELPERS CENTRALIZADOS ============

// Helper para obtener fecha hoy en formato YYYY-MM-DD
const obtenerFechaHoy = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Helper genérico para extraer lista de respuesta API
const extraerListaDeRespuesta = (respuesta) => {
  if (!respuesta) return [];
  if (Array.isArray(respuesta)) return respuesta;
  if (respuesta.data && Array.isArray(respuesta.data)) return respuesta.data;
  return [];
};

// Estado inicial del formulario
const FORMDATA_INICIAL = {
  titulo: '',
  descripcion: '',
  tipo: 'curso',
  modalidad: 'presencial',
  duracion: '',
  precio: '',
  fechaInicio: '',
  fechaFin: '',
  cupos: '',
  profesor: '',
  profesorBio: '',
  categoria: '',
  requisitos: [{ id: 'req_0', value: '' }],
  pensum: [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
  objetivos: [{ id: 'obj_0', value: '' }],
  metodologia: '',
  evaluacion: '',
  certificacion: '',
  imagen: '',
  destacado: false
};

// Campos de tipo select reutilizables
const TIPO_OPCIONES = [
  { value: 'curso', label: 'Curso' },
  { value: 'programa-tecnico', label: 'Programa Técnico' }
];

const MODALIDAD_OPCIONES = [
  { value: 'presencial', label: 'Presencial' },
  { value: 'virtual', label: 'Virtual' },
  { value: 'hibrido', label: 'Híbrido' }
];

const ProgramaModal = ({
  mostrar,
  modoEdicion,
  programaSeleccionado,
  formData,
  setFormData,
  onClose,
  onSubmit
}) => {
  const todayStr = obtenerFechaHoy();
  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);

  // Helper function to extract categoria ID - fixes SonarQube S3358
  const extractCategoriaId = (categoria) => {
    if (!categoria) return '';
    if (typeof categoria === 'object') {
      return categoria._id || categoria.id || '';
    }
    return categoria;
  };

  // Helper para convertir array a items con id
  const arrayAItems = (arr, fieldName = 'value') => {
    return Array.isArray(arr) && arr.length > 0
      ? arr.map((item, i) => ({
          id: `${fieldName.slice(0, 3)}_${i}`,
          [fieldName]: item
        }))
      : [{ id: `${fieldName.slice(0, 3)}_0`, [fieldName]: '' }];
  };

  // Helper function to configure form data from selected program
  const configureFormDataFromProgram = (programa) => {
    console.log('Modal - Programa seleccionado:', programa);
    setFormData({
      titulo: programa.nombre || '',
      descripcion: programa.descripcion || '',
      tipo: programa.tipo || 'curso',
      modalidad: programa.modalidad || 'presencial',
      duracion: programa.duracion || '',
      precio: programa.precio || '',
      fechaInicio: programa.fechaInicio ? programa.fechaInicio.split('T')[0] : '',
      fechaFin: programa.fechaFin ? programa.fechaFin.split('T')[0] : '',
      cupos: programa.cuposDisponibles || '',
      profesor: programa.profesor || '',
      profesorBio: programa.profesorBio || '',
      categoria: extractCategoriaId(programa.categoria),
      requisitos: arrayAItems(programa.requisitos, 'value'),
      pensum: Array.isArray(programa.pensum) && programa.pensum.length > 0
        ? programa.pensum.map((mod, i) => ({ id: `pen_${i}`, ...mod }))
        : [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
      objetivos: arrayAItems(programa.objetivos, 'value'),
      metodologia: programa.metodologia || '',
      evaluacion: programa.evaluacion || '',
      certificacion: programa.certificacion || '',
      imagen: programa.imagen || '',
      destacado: programa.destacado || false
    });
    console.log('Modal - FormData actualizado');
  };

  useEffect(() => {
    if (modoEdicion && programaSeleccionado) {
      configureFormDataFromProgram(programaSeleccionado);
    }
  }, [modoEdicion, programaSeleccionado, setFormData]);

  // Obtener categorías del sistema
  const obtenerCategorias = async () => {
    try {
      const res = await categorizacionService.getAll();
      const lista = extraerListaDeRespuesta(res);
      setCategorias(lista);
    } catch (error) {
      console.error('Error obteniendo categorías:', error);
      setCategorias([]);
    }
  };

  useEffect(() => {
    if (mostrar) obtenerCategorias();
  }, [mostrar]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayInputChange = (index, value, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) =>
        i === index ? { ...item, value } : item
      )
    }));
  };

  const handlePensumChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      pensum: prev.pensum.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  // Generador simple de id único
  let idCounter = 0;
  const generateId = () => `item_${Date.now()}_${++idCounter}`;

  const addArrayItem = (arrayName, defaultValue) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [
        ...prev[arrayName],
        typeof defaultValue === 'object'
          ? { ...defaultValue, id: generateId() }
          : { id: generateId(), value: defaultValue }
      ]
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  // FieldList and PensumList moved to separate files to reduce duplication and satisfy Sonar rules

  // Validación de fechas - helper centralizado
  const validarFechas = () => {
    const errores = {};
    if (!formData.fechaInicio) {
      errores.fechaInicio = 'La fecha de inicio es requerida';
    } else if (formData.fechaInicio < todayStr) {
      errores.fechaInicio = 'La fecha de inicio no puede ser anterior a hoy';
    }
    if (!formData.fechaFin) {
      errores.fechaFin = 'La fecha de fin es requerida';
    } else if (formData.fechaFin < todayStr) {
      errores.fechaFin = 'La fecha de fin no puede ser anterior a hoy';
    } else if (formData.fechaFin < formData.fechaInicio) {
      errores.fechaFin = 'La fecha de fin no puede ser anterior a la de inicio';
    }
    return errores;
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validaciones de campos requeridos
    const camposRequeridos = [
      { field: 'titulo', mensaje: 'El título es requerido' },
      { field: 'descripcion', mensaje: 'La descripción es requerida' },
      { field: 'duracion', mensaje: 'La duración es requerida' },
      { field: 'precio', mensaje: 'El precio es requerido' },
      { field: 'cupos', mensaje: 'Los cupos son requeridos' },
      { field: 'profesor', mensaje: 'El profesor es requerido' }
    ];

    for (const { field, mensaje } of camposRequeridos) {
      if (!formData[field] || (typeof formData[field] === 'string' && !formData[field].trim())) {
        newErrors[field] = mensaje;
      }
    }

    // Validaciones de fechas
    Object.assign(newErrors, validarFechas());
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };
  // Efecto para manejar el scroll del body cuando el modal está abierto
  React.useEffect(() => {
    if (mostrar) {
      // Desactivar scroll del body
      document.body.style.overflow = 'hidden';
      return () => {
        // Reactivar scroll del body al cerrar el modal
        document.body.style.overflow = 'auto';
      };
    }
  }, [mostrar]);

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ zIndex: 1100 }}>
      <div className="glass-card rounded-2xl shadow-2xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white">
        {/* Header */}
        <div
          className="sticky top-0 glass-card border-b border-white/20 px-6 py-4 flex items-center justify-between modal-header-admin"
          style={{
            background: 'linear-gradient(90deg, var(--color-blue-principal), var(--color-blue-oscuro))',
            color: 'white'
          }}
        >
          <h2>
            {modoEdicion ? 'Editar Programa' : 'Crear Nuevo Programa'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información Básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Título del Programa"
              name="titulo"
              type="text"
              value={formData.titulo}
              onChange={handleInputChange}
              error={errors.titulo}
              required
              placeholder="Ej: Desarrollo Web Full Stack"
            />

            <FormField
              label="Tipo de Programa"
              name="tipo"
              type="select"
              value={formData.tipo}
              onChange={handleInputChange}
              required
              options={TIPO_OPCIONES}
            />

            <FormField
              label="Categoría"
              name="categoria"
              type="select"
              value={formData.categoria}
              onChange={handleInputChange}
              required
              options={categorias.map(c => ({ value: c._id || c.id, label: `${c.nombre} (${c.tipo})` }))}
            />

            <FormField
              label="Modalidad"
              name="modalidad"
              type="select"
              value={formData.modalidad}
              onChange={handleInputChange}
              required
              options={MODALIDAD_OPCIONES}
            />

            <FormField
              label="Duración"
              name="duracion"
              type="text"
              value={formData.duracion}
              onChange={handleInputChange}
              error={errors.duracion}
              required
              placeholder="Ej: 6 meses, 120 horas"
            />

            <FormField
              label="Precio"
              name="precio"
              type="number"
              value={formData.precio}
              onChange={handleInputChange}
              error={errors.precio}
              required
              placeholder="0.00"
              min="0"
              step="0.01"
            />

            <FormField
              label="Cupos Disponibles"
              name="cupos"
              type="number"
              value={formData.cupos}
              onChange={handleInputChange}
              error={errors.cupos}
              required
              placeholder="30"
              min="1"
            />

            <FormField
              label="Fecha de Inicio"
              name="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleInputChange}
              error={errors.fechaInicio}
              required
              min={todayStr}
            />

            <FormField
              label="Fecha de Fin"
              name="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={handleInputChange}
              error={errors.fechaFin}
              required
              min={todayStr}
            />
          </div>

          {/* Descripción */}
          <FormField
            label="Descripción del Programa"
            name="descripcion"
            type="textarea"
            value={formData.descripcion}
            onChange={handleInputChange}
            error={errors.descripcion}
            required
            rows={4}
            placeholder="Describe detalladamente el programa académico..."
          />

          {/* Información del Profesor */}
          <FormField
            label="Profesor/Instructor"
            name="profesor"
            type="text"
            value={formData.profesor}
            onChange={handleInputChange}
            error={errors.profesor}
            required
            placeholder="Nombre del profesor"
          />
          {/* Biografía del Profesor */}
          <FormField
            label="Biografía del Profesor"
            name="profesorBio"
            type="textarea"
            value={formData.profesorBio}
            onChange={handleInputChange}
            rows={3}
            placeholder="Experiencia y formación del profesor..."
          />

          {/* Requisitos */}
          <div>
            <label htmlFor="requisitos" className="block text-sm font-medium text-gray-700 mb-2">
              Requisitos
            </label>
            <FieldList
              items={formData.requisitos}
              onChangeItem={(i, v) => handleArrayInputChange(i, v, 'requisitos')}
              onAddItem={() => addArrayItem('requisitos', '')}
              onRemoveItem={(i) => removeArrayItem(i, 'requisitos')}
              placeholderPrefix="Requisito"
            />
          </div>

          {/* Objetivos */}
          <div>
            <label htmlFor="objetivos" className="block text-sm font-medium text-gray-700 mb-2">
              Objetivos del Programa
            </label>
            <FieldList
              items={formData.objetivos}
              onChangeItem={(i, v) => handleArrayInputChange(i, v, 'objetivos')}
              onAddItem={() => addArrayItem('objetivos', '')}
              onRemoveItem={(i) => removeArrayItem(i, 'objetivos')}
              placeholderPrefix="Objetivo"
            />
          </div>

          {/* Pensum */}
          <div>
            <label htmlFor="pensum" className="block text-sm font-medium text-gray-700 mb-2">
              Pensum/Módulos del Programa
            </label>
            <PensumList
              pensum={formData.pensum}
              onChangePensum={handlePensumChange}
              onAddPensum={() => addArrayItem('pensum', { modulo: '', descripcion: '', horas: '' })}
              onRemovePensum={(i) => removeArrayItem(i, 'pensum')}
            />
          </div>

          {/* Información Adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Metodología"
              name="metodologia"
              type="textarea"
              value={formData.metodologia}
              onChange={handleInputChange}
              rows={3}
              placeholder="Metodología de enseñanza..."
            />

            <FormField
              label="Sistema de Evaluación"
              name="evaluacion"
              type="textarea"
              value={formData.evaluacion}
              onChange={handleInputChange}
              rows={3}
              placeholder="Cómo se evaluará el programa..."
            />
          </div>

          {/* Certificación */}
          <FormField
            label="Información de Certificación"
            name="certificacion"
            type="textarea"
            value={formData.certificacion}
            onChange={handleInputChange}
            rows={2}
            placeholder="Detalles sobre la certificación que se otorgará..."
          />

          {/* Destacado */}
          <FormField
            label="Marcar como programa destacado"
            name="destacado"
            type="checkbox"
            value={formData.destacado}
            onChange={handleInputChange}
          />

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {modoEdicion ? 'Actualizar Programa' : 'Crear Programa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
ProgramaModal.propTypes = {
  mostrar: PropTypes.bool.isRequired,
  modoEdicion: PropTypes.bool,
  programaSeleccionado: programaSeleccionadoPropType,
  formData: formDataPropType.isRequired,
  setFormData: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default ProgramaModal;