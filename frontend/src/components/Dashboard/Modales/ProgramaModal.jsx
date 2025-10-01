import React, { useState, useEffect } from 'react';
import { X, Upload, Plus, Trash2 } from 'lucide-react';

const ProgramaModal = ({
  mostrar,
  modoEdicion,
  programaSeleccionado,
  formData,
  setFormData,
  onClose,
  onSubmit
}) => {
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
        requisitos: programaSeleccionado.requisitos || [''],
        pensum: programaSeleccionado.pensum || [{ modulo: '', descripcion: '', horas: '' }],
        objetivos: programaSeleccionado.objetivos || [''],
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
        i === index ? value : item
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

  const addArrayItem = (arrayName, defaultValue) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [...prev[arrayName], defaultValue]
    }));
  };

  const removeArrayItem = (index, arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo?.trim()) newErrors.titulo = 'El título es requerido';
    if (!formData.descripcion?.trim()) newErrors.descripcion = 'La descripción es requerida';
    if (!formData.duracion?.trim()) newErrors.duracion = 'La duración es requerida';
    if (!formData.precio) newErrors.precio = 'El precio es requerido';
    if (!formData.fechaInicio) newErrors.fechaInicio = 'La fecha de inicio es requerida';
    if (!formData.fechaFin) newErrors.fechaFin = 'La fecha de fin es requerida';
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del Programa *
              </label>
              <input
                type="text"
                name="titulo"
                value={formData.titulo}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.titulo ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Desarrollo Web Full Stack"
              />
              {errors.titulo && <p className="text-red-500 text-xs mt-1">{errors.titulo}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Programa *
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="curso">Curso</option>
                <option value="programa-tecnico">Programa Técnico</option>
                <option value="diplomado">Diplomado</option>
                <option value="certificacion">Certificación</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Modalidad *
              </label>
              <select
                name="modalidad"
                value={formData.modalidad}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="presencial">Presencial</option>
                <option value="virtual">Virtual</option>
                <option value="hibrido">Híbrido</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duración *
              </label>
              <input
                type="text"
                name="duracion"
                value={formData.duracion}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.duracion ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: 6 meses, 120 horas"
              />
              {errors.duracion && <p className="text-red-500 text-xs mt-1">{errors.duracion}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio *
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.precio ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
              {errors.precio && <p className="text-red-500 text-xs mt-1">{errors.precio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cupos Disponibles *
              </label>
              <input
                type="number"
                name="cupos"
                value={formData.cupos}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cupos ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="30"
                min="1"
              />
              {errors.cupos && <p className="text-red-500 text-xs mt-1">{errors.cupos}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Inicio *
              </label>
              <input
                type="date"
                name="fechaInicio"
                value={formData.fechaInicio}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fechaInicio ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fechaInicio && <p className="text-red-500 text-xs mt-1">{errors.fechaInicio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Fin *
              </label>
              <input
                type="date"
                name="fechaFin"
                value={formData.fechaFin}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.fechaFin ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fechaFin && <p className="text-red-500 text-xs mt-1">{errors.fechaFin}</p>}
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Programa *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.descripcion ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe detalladamente el programa académico..."
            />
            {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
          </div>

          {/* Información del Profesor */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profesor/Instructor *
              </label>
              <input
                type="text"
                name="profesor"
                value={formData.profesor}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.profesor ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre del profesor"
              />
              {errors.profesor && <p className="text-red-500 text-xs mt-1">{errors.profesor}</p>}
            </div>
          {/* Biografía del Profesor */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía del Profesor
            </label>
            <textarea
              name="profesorBio"
              value={formData.profesorBio}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Experiencia y formación del profesor..."
            />
          </div>

          {/* Requisitos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Requisitos
            </label>
            {formData.requisitos.map((requisito, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={requisito}
                  onChange={(e) => handleArrayInputChange(index, e.target.value, 'requisitos')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Requisito ${index + 1}`}
                />
                {formData.requisitos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'requisitos')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requisitos', '')}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={16} /> Agregar requisito
            </button>
          </div>

          {/* Objetivos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Objetivos del Programa
            </label>
            {formData.objetivos.map((objetivo, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={objetivo}
                  onChange={(e) => handleArrayInputChange(index, e.target.value, 'objetivos')}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Objetivo ${index + 1}`}
                />
                {formData.objetivos.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem(index, 'objetivos')}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('objetivos', '')}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={16} /> Agregar objetivo
            </button>
          </div>

          {/* Pensum */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pensum/Módulos del Programa
            </label>
            {formData.pensum.map((modulo, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={modulo.modulo}
                  onChange={(e) => handlePensumChange(index, 'modulo', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del módulo"
                />
                <input
                  type="text"
                  value={modulo.descripcion}
                  onChange={(e) => handlePensumChange(index, 'descripcion', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Descripción"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={modulo.horas}
                    onChange={(e) => handlePensumChange(index, 'horas', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Horas"
                    min="1"
                  />
                  {formData.pensum.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index, 'pensum')}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('pensum', { modulo: '', descripcion: '', horas: '' })}
              className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={16} /> Agregar módulo
            </button>
          </div>

          {/* Información Adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metodología
              </label>
              <textarea
                name="metodologia"
                value={formData.metodologia}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Metodología de enseñanza..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sistema de Evaluación
              </label>
              <textarea
                name="evaluacion"
                value={formData.evaluacion}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cómo se evaluará el programa..."
              />
            </div>
          </div>

          {/* Certificación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Información de Certificación
            </label>
            <textarea
              name="certificacion"
              value={formData.certificacion}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Detalles sobre la certificación que se otorgará..."
            />
          </div>

          {/* Destacado */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="destacado"
              id="destacado"
              checked={formData.destacado}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
            <label htmlFor="destacado" className="text-sm font-medium text-gray-700">
              Marcar como programa destacado
            </label>
          </div>

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

export default ProgramaModal;