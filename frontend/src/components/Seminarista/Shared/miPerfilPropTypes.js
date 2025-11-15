import PropTypes from 'prop-types';

export const datosEditadosShape = PropTypes.shape({
  nombre: PropTypes.string,
  apellido: PropTypes.string,
  correo: PropTypes.string,
  telefono: PropTypes.string,
  tipoDocumento: PropTypes.string,
  numeroDocumento: PropTypes.string,
  fechaNacimiento: PropTypes.string,
  direccion: PropTypes.string,
  nivelAcademico: PropTypes.string,
  directorEspiritual: PropTypes.string,
  idiomas: PropTypes.string,
  especialidad: PropTypes.string,
});

export const profileDataShape = PropTypes.shape({
  fechaIngreso: PropTypes.string,
});

export const passwordDataShape = PropTypes.shape({
  currentPassword: PropTypes.string,
  newPassword: PropTypes.string,
  confirmPassword: PropTypes.string,
});

export const securityDataShape = PropTypes.shape({
  emailNotifications: PropTypes.bool,
  academicReminders: PropTypes.bool,
  theme: PropTypes.string,
  language: PropTypes.string,
});

export default {
  datosEditadosShape,
  profileDataShape,
  passwordDataShape,
  securityDataShape,
};
