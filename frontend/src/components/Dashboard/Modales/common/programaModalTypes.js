import PropTypes from 'prop-types';

// Tipos compartidos para evitar duplicación
export const programaBasePropType = {
  nombre: PropTypes.string,
  descripcion: PropTypes.string,
  tipo: PropTypes.string,
  modalidad: PropTypes.string,
  duracion: PropTypes.string,
  precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fechaInicio: PropTypes.string,
  fechaFin: PropTypes.string,
  profesor: PropTypes.string,
  profesorBio: PropTypes.string,
  metodologia: PropTypes.string,
  evaluacion: PropTypes.string,
  certificacion: PropTypes.string,
  imagen: PropTypes.string,
  destacado: PropTypes.bool
};

export const pensumItemPropType = PropTypes.shape({
  modulo: PropTypes.string,
  descripcion: PropTypes.string,
  horas: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
});

export const programaSeleccionadoPropType = PropTypes.shape({
  ...programaBasePropType,
  cuposDisponibles: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  requisitos: PropTypes.arrayOf(PropTypes.string),
  pensum: PropTypes.arrayOf(pensumItemPropType),
  objetivos: PropTypes.arrayOf(PropTypes.string)
});

export const formDataPropType = PropTypes.shape({
  ...programaBasePropType,
  titulo: PropTypes.string,
  cupos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  requisitos: PropTypes.arrayOf(PropTypes.string),
  pensum: PropTypes.arrayOf(pensumItemPropType),
  objetivos: PropTypes.arrayOf(PropTypes.string)
});