const Notification = require('../models/Notification');
const Usuario = require('../models/User');

/**
 * Función utilitaria para enviar notificaciones a usuarios con roles específicos
 * @param {string} title - Título de la notificación
 * @param {string} message - Mensaje de la notificación
 * @param {string} icon - Ícono de la notificación (opcional)
 * @param {Array} targetRoles - Roles de los usuarios que deben recibir la notificación
 * @param {string} excludeUserId - ID del usuario que no debe recibir la notificación (opcional)
 */
async function enviarNotificacionAUsuariosConRol(title, message, icon = 'Bell', targetRoles = ['admin', 'tesorero'], excludeUserId = null) {
  try {
    // Buscar usuarios con los roles especificados
    const filtro = {
      role: { $in: targetRoles },
      estado: 'activo'
    };
    
    // Excluir al usuario especificado si se proporciona
    if (excludeUserId) {
      filtro._id = { $ne: excludeUserId };
    }
    
    const usuarios = await Usuario.find(filtro, '_id');
    
    if (usuarios.length === 0) {
      console.log('No se encontraron usuarios con los roles especificados:', targetRoles);
      return { success: false, message: 'No se encontraron usuarios destinatarios' };
    }
    
    // Crear notificaciones para cada usuario
    const notificaciones = usuarios.map(usuario => ({
      userId: usuario._id,
      title,
      message,
      icon,
      read: false,
      createdAt: new Date()
    }));
    
    // Insertar todas las notificaciones
    const notificacionesCreadas = await Notification.insertMany(notificaciones);
    
    console.log(`✅ Se enviaron ${notificacionesCreadas.length} notificaciones con título: "${title}"`);
    
    return {
      success: true,
      count: notificacionesCreadas.length,
      notifications: notificacionesCreadas
    };
    
  } catch (error) {
    console.error('❌ Error al enviar notificaciones:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Función específica para notificar nueva inscripción
 * @param {Object} inscripcion - Datos de la inscripción
 * @param {Object} usuario - Datos del usuario que se inscribió
 * @param {Object} referencia - Datos del evento o programa académico
 */
async function notificarNuevaInscripcion(inscripcion, usuario, referencia) {
  try {
    const tipoReferencia = inscripcion.tipoReferencia === 'Eventos' ? 'evento' : 'programa académico';
    const nombreReferencia = referencia?.nombre || 'desconocido';
    
    const title = `Nueva Inscripción - ${tipoReferencia}`;
    const message = `${usuario.nombre} ${usuario.apellido} se ha inscrito en el ${tipoReferencia}: ${nombreReferencia}`;
    
    return await enviarNotificacionAUsuariosConRol(
      title,
      message,
      'UserPlus',
      ['admin', 'tesorero'],
      usuario._id
    );
  } catch (error) {
    console.error('Error al notificar nueva inscripción:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Función específica para notificar nueva reserva
 * @param {Object} reserva - Datos de la reserva
 * @param {Object} usuario - Datos del usuario que hizo la reserva
 * @param {Object} cabana - Datos de la cabaña reservada
 */
async function notificarNuevaReserva(reserva, usuario, cabana) {
  try {
    const fechaInicio = new Date(reserva.fechaInicio).toLocaleDateString('es-CO');
    const fechaFin = new Date(reserva.fechaFin).toLocaleDateString('es-CO');
    
    const title = 'Nueva Reserva de Cabaña';
    const message = `${usuario.nombre} ${usuario.apellido} ha reservado la cabaña "${cabana.nombre}" del ${fechaInicio} al ${fechaFin}`;
    
    return await enviarNotificacionAUsuariosConRol(
      title,
      message,
      'Calendar',
      ['admin', 'tesorero'],
      usuario._id
    );
  } catch (error) {
    console.error('Error al notificar nueva reserva:', error);
    return { success: false, message: error.message };
  }
}

/**
 * Función específica para notificar nueva solicitud general
 * @param {Object} solicitud - Datos de la solicitud
 * @param {Object} usuario - Datos del usuario que hizo la solicitud
 */
async function notificarNuevaSolicitud(solicitud, usuario) {
  try {
    const title = `Nueva Solicitud - ${solicitud.tipoSolicitud}`;
    const message = `${usuario.nombre} ${usuario.apellido} ha enviado una nueva solicitud: ${solicitud.titulo}`;
    
    return await enviarNotificacionAUsuariosConRol(
      title,
      message,
      'FileText',
      ['admin', 'tesorero'],
      usuario._id
    );
  } catch (error) {
    console.error('Error al notificar nueva solicitud:', error);
    return { success: false, message: error.message };
  }
}

module.exports = {
  enviarNotificacionAUsuariosConRol,
  notificarNuevaInscripcion,
  notificarNuevaReserva,
  notificarNuevaSolicitud
};