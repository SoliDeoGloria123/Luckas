import PropTypes from 'prop-types';

const cabanaShape = PropTypes.shape({
  nombre: PropTypes.string,
  descripcion: PropTypes.string,
  capacidad: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  categoria: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  estado: PropTypes.string,
  imagen: PropTypes.array,
  ubicacion: PropTypes.string
});

export default cabanaShape;
