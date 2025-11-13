import PropTypes from 'prop-types';

// Estado inicial del formulario para evitar duplicación
export const initialFormState = {
  nombre: "",
  descripcion: "",
  tipo: "",
  fechaInicio: "",
  fechaFin: "",
  estado: "",
  categoria: "",
  usuario: ""
};

// Función para obtener la fecha actual en formato YYYY-MM-DD
export const getCurrentDate = () => {
  return new Date().toISOString().split('T')[0];
};

// Función para formatear fecha para el formulario
export const formatDateForForm = (date) => {
  if (!date) return "";
  return new Date(date).toISOString().split('T')[0];
};

// Función para construir datos de envío
export const buildSubmissionData = (form) => {
  const filtros = {
    fechaInicio: form.fechaInicio ? new Date(form.fechaInicio) : null,
    fechaFin: form.fechaFin ? new Date(form.fechaFin) : null,
    estado: form.estado,
    categoria: form.categoria,
    usuario: form.usuario,
    otros: {}
  };

  return {
    nombre: form.nombre,
    descripcion: form.descripcion,
    tipo: form.tipo,
    filtros
  };
};

// PropTypes compartidos
export const filtrosPropType = PropTypes.shape({
  fechaInicio: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  fechaFin: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  estado: PropTypes.string,
  categoria: PropTypes.string,
  usuario: PropTypes.string,
  otros: PropTypes.object
});

export const datosInicialesPropType = PropTypes.shape({
  nombre: PropTypes.string,
  descripcion: PropTypes.string,
  description: PropTypes.string,
  tipo: PropTypes.string,
  type: PropTypes.string,
  filtros: filtrosPropType
});