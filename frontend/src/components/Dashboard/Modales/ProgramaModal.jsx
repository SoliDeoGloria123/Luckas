import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FieldList from './common/FieldList';
import PensumList from './common/PensumList';
import FormField from './common/FormField';
import PropTypes from 'prop-types';
import { programaSeleccionadoPropType, formDataPropType } from './common/programaModalTypes';

const ProgramaModal = ({
  mostrar,
  modoEdicion,
  programaSeleccionado,
  formData,
  setFormData,
  onClose,
  onSubmit
}) => {
  // Obtener la fecha de hoy en formato YYYY-MM-DD
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (modoEdicion && programaSeleccionado) {
      console.log('Modal - Programa seleccionado:', programaSeleccionado);
      setFormData({
        titulo: programaSeleccionado.nombre || '', // backend usa 'nombre'
        descripcion: programaSeleccionado.descripcion || '',
        tipo: programaSeleccionado.tipo || 'curso', // este es para el select del frontend
        modalidad: programaSeleccionado.modalidad || 'presencial',
        duracion: programaSeleccionado.duracion || '',
        precio: programaSeleccionado.precio || '',
        fechaInicio: programaSeleccionado.fechaInicio ? programaSeleccionado.fechaInicio.split('T')[0] : '',
        fechaFin: programaSeleccionado.fechaFin ? programaSeleccionado.fechaFin.split('T')[0] : '',
        cupos: programaSeleccionado.cuposDisponibles || '', // backend usa 'cuposDisponibles'
        profesor: programaSeleccionado.profesor || '',
        profesorBio: programaSeleccionado.profesorBio || '',
        requisitos: Array.isArray(programaSeleccionado.requisitos) 
          ? programaSeleccionado.requisitos.map((req, i) => ({ id: `req_${i}`, value: req }))
          : [{ id: 'req_0', value: '' }],
        pensum: Array.isArray(programaSeleccionado.pensum) 
          ? programaSeleccionado.pensum.map((mod, i) => ({ id: `pen_${i}`, ...mod }))
          : [{ id: 'pen_0', modulo: '', descripcion: '', horas: '' }],
        objetivos: Array.isArray(programaSeleccionado.objetivos)
          ? programaSeleccionado.objetivos.map((obj, i) => ({ id: `obj_${i}`, value: obj }))
          : [{ id: 'obj_0', value: '' }],
        metodologia: programaSeleccionado.metodologia || '',
        evaluacion: programaSeleccionado.evaluacion || '',
        certificacion: programaSeleccionado.certificacion || '',
        imagen: programaSeleccionado.imagen || '',
        destacado: programaSeleccionado.destacado || false
      });
      console.log('Modal - FormData actualizado');
    }
  }, [modoEdicion, programaSeleccionado, setFormData]);

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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo?.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.descripcion?.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.duracion?.trim()) newErrors.duracion = 'La duración es requerida';
    if (!formData.precio) newErrors.precio = 'El precio es requerido';
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    } else if (formData.fechaInicio < todayStr) {
      newErrors.fechaInicio = 'La fecha de inicio no puede ser anterior a hoy';
    }
    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida';
    } else if (formData.fechaFin < todayStr) {
      newErrors.fechaFin = 'La fecha de fin no puede ser anterior a hoy';
    } else if (formData.fechaFin < formData.fechaInicio) {
      newErrors.fechaFin = 'La fecha de fin no puede ser anterior a la de inicio';
    }
    if (!formData.cupos) newErrors.cupos = 'Los cupos son requeridos';
    if (!formData.profesor?.trim()) newErrors.profesor = 'El profesor es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(e);
    }
  };

  if (!mostrar) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
              options={[
                { value: 'curso', label: 'Curso' },
                { value: 'programa-tecnico', label: 'Programa Técnico' }
              ]}
            />

            <FormField
              label="Modalidad"
              name="modalidad"
              type="select"
              value={formData.modalidad}
              onChange={handleInputChange}
              required
              options={[
                { value: 'presencial', label: 'Presencial' },
                { value: 'virtual', label: 'Virtual' },
                { value: 'hibrido', label: 'Híbrido' }
              ]}
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