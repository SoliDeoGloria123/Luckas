const crypto = require("node:crypto");
const sendEmail = require("../utils/sendEmail");

// ============================================
// FUNCIONES AUXILIARES PARA TEMPLATES DE EMAIL
// ============================================

// Función para obtener color según severidad
const getSeveridadColor = (severidad) => {
  switch (severidad) {
    case "critico":
      return "#dc2626";
    case "alto":
      return "#ea580c";
    case "medio":
      return "#eab308";
    default:
      return "#3b82f6";
  }
};

// Función para obtener mensaje de tiempo de respuesta
const getTiempoRespuesta = (severidad) => {
  switch (severidad) {
    case "critico":
      return "<strong>1-2 horas</strong> - Nuestro equipo está trabajando en tu caso de inmediato";
    case "alto":
      return "<strong>4-8 horas</strong> - Tu caso está en alta prioridad";
    case "medio":
      return "<strong>1-2 días hábiles</strong> - Revisaremos tu caso pronto";
    default:
      return "<strong>2-5 días hábiles</strong> - Tu consulta será atendida en orden de llegada";
  }
};

// Función para obtener mensaje de alerta según severidad
const getMensajeAlerta = (severidad) => {
  switch (severidad) {
    case "critico":
      return "⚠️ URGENTE - Requiere Atención Inmediata";
    case "alto":
      return "⚡ ALTA PRIORIDAD - Revisar Pronto";
    case "medio":
      return "📊 PRIORIDAD MEDIA - Atender En Breve";
    default:
      return "📝 PRIORIDAD BAJA - Revisar Cuando Sea Posible";
  }
};

// Template para confirmación de contacto al usuario
const getTemplateConfirmacionContacto = (nombre, email, telefono, asunto, mensaje) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header con Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 30px; text-align: center;">
                  <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                    <span style="font-size: 36px; font-weight: bold; color: #2563eb;">L</span>
                  </div>
                  <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">✓ Mensaje Recibido</h1>
                  <p style="margin: 10px 0 0 0; color: #dbeafe; font-size: 16px;">Seminario Bautista de Colombia</p>
                </td>
              </tr>
              
              <!-- Contenido -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                    Hola <strong style="color: #2563eb;">${nombre}</strong>,
                  </p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                    ¡Gracias por contactarnos! Hemos recibido tu mensaje y nuestro equipo lo está revisando. Te responderemos lo antes posible.
                  </p>
                  
                  <!-- Card de Detalles -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 12px; border-left: 4px solid #2563eb; margin: 30px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 700;">📋 Resumen de tu mensaje</h3>
                        
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 30%;">Asunto:</td>
                            <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${asunto}</td>
                          </tr>
                          <tr style="background: rgba(255, 255, 255, 0.5);">
                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Tu email:</td>
                            <td style="padding: 8px 0; color: #2563eb; font-size: 14px;">${email}</td>
                          </tr>
                          ${telefono ? `
                          <tr>
                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Teléfono:</td>
                            <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${telefono}</td>
                          </tr>
                          ` : ''}
                          <tr style="background: rgba(255, 255, 255, 0.5);">
                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; vertical-align: top;">Mensaje:</td>
                            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; line-height: 1.6;">${mensaje.replaceAll("\n", "<br>")}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Información adicional -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: #fef3c7; border-radius: 12px; border-left: 4px solid #f59e0b; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                          <strong style="color: #78350f;">⏱️ Tiempo de respuesta:</strong><br>
                          Te responderemos en un máximo de <strong>48 horas hábiles</strong>.
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #64748b; text-align: center;">
                    Si tienes alguna pregunta urgente, también puedes contactarnos por teléfono:<br>
                    <strong style="color: #2563eb;">+57 (1) 234-5678</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #1e293b; padding: 30px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: white; font-size: 16px; font-weight: 600;">Seminario Bautista de Colombia</p>
                  <p style="margin: 0 0 15px 0; color: #94a3b8; font-size: 13px;">Formando líderes para el Reino de Dios</p>
                  <div style="margin: 20px 0;">
                    <a href="https://facebook.com" style="display: inline-block; margin: 0 8px; color: #60a5fa; text-decoration: none; font-size: 24px;">📘</a>
                    <a href="https://instagram.com" style="display: inline-block; margin: 0 8px; color: #f472b6; text-decoration: none; font-size: 24px;">📷</a>
                  </div>
                  <p style="margin: 15px 0 0 0; color: #64748b; font-size: 12px;">
                    © 2025 Luckas - Todos los derechos reservados<br>
                    Calle 123 #45-67, Bogotá, Colombia
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// Template para notificación de soporte técnico al usuario
const getTemplateConfirmacionSoporte = (nombre, email, ticketNumber, modulo, severidad, descripcion) => {
  const severidadColors = {
    critico: { bg: '#fee2e2', border: '#dc2626', text: '#991b1b', emoji: '🔴' },
    alto: { bg: '#fed7aa', border: '#ea580c', text: '#9a3412', emoji: '🟠' },
    medio: { bg: '#fef3c7', border: '#eab308', text: '#854d0e', emoji: '🟡' },
    bajo: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af', emoji: '🔵' }
  };
  const severidadInfo = severidadColors[severidad] || severidadColors.bajo;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f1f5f9; padding: 40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              
              <!-- Header con Logo -->
              <tr>
                <td style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); padding: 40px 30px; text-align: center;">
                  <div style="background: white; width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);">
                    <span style="font-size: 36px;">🛠️</span>
                  </div>
                  <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">✓ Ticket Creado</h1>
                  <p style="margin: 10px 0 0 0; color: #ede9fe; font-size: 16px;">Soporte Técnico - Luckas</p>
                </td>
              </tr>
              
              <!-- Contenido -->
              <tr>
                <td style="padding: 40px 30px;">
                  <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                    Hola <strong style="color: #8b5cf6;">${nombre}</strong>,
                  </p>
                  <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #334155;">
                    Tu reporte técnico ha sido recibido y registrado exitosamente. Nuestro equipo de soporte está revisando tu caso.
                  </p>
                  
                  <!-- Ticket Number Destacado -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-radius: 12px; margin: 30px 0; border: 2px solid #8b5cf6;">
                    <tr>
                      <td style="padding: 25px; text-align: center;">
                        <p style="margin: 0 0 10px 0; color: #6b21a8; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Tu Número de Ticket</p>
                        <p style="margin: 0; color: #8b5cf6; font-size: 28px; font-weight: 700; font-family: 'Courier New', monospace; letter-spacing: 2px;">${ticketNumber}</p>
                        <p style="margin: 10px 0 0 0; color: #7c3aed; font-size: 13px;">Guarda este número para hacer seguimiento</p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Información del Ticket -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8fafc; border-radius: 12px; border-left: 4px solid #8b5cf6; margin: 30px 0;">
                    <tr>
                      <td style="padding: 25px;">
                        <h3 style="margin: 0 0 20px 0; color: #1e293b; font-size: 18px; font-weight: 700;">📊 Detalles del Reporte</h3>
                        
                        <table width="100%" cellpadding="8" cellspacing="0">
                          <tr>
                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600; width: 35%;">Módulo:</td>
                            <td style="padding: 8px 0; color: #1e293b; font-size: 14px; font-weight: 500;">${modulo}</td>
                          </tr>
                          <tr style="background: rgba(255, 255, 255, 0.5);">
                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Severidad:</td>
                            <td style="padding: 8px 0;">
                              <span style="background: ${severidadInfo.bg}; color: ${severidadInfo.text}; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: 600; border: 1px solid ${severidadInfo.border};">
                                ${severidadInfo.emoji} ${severidad.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">Tu email:</td>
                            <td style="padding: 8px 0; color: #8b5cf6; font-size: 14px;">${email}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Tiempos de Respuesta -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background: ${severidadInfo.bg}; border-radius: 12px; border-left: 4px solid ${severidadInfo.border}; margin: 20px 0;">
                    <tr>
                      <td style="padding: 20px;">
                        <p style="margin: 0 0 10px 0; color: ${severidadInfo.text}; font-size: 14px; font-weight: 700;">
                          ⏱️ Tiempo Estimado de Respuesta
                        </p>
                        <p style="margin: 0; color: ${severidadInfo.text}; font-size: 14px; line-height: 1.6;">
                          ${getTiempoRespuesta(severidad)}
                        </p>
                      </td>
                    </tr>
                  </table>
                  
                  <!-- Próximos Pasos -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                    <tr>
                      <td>
                        <h4 style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 700;">🔔 Próximos Pasos:</h4>
                        <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 14px; line-height: 1.8;">
                          <li>Recibirás actualizaciones por email</li>
                          <li>Puedes responder a este correo para agregar información</li>
                          <li>Guarda tu número de ticket para consultas futuras</li>
                        </ul>
                      </td>
                    </tr>
                  </table>
                  
                  <p style="margin: 30px 0 0 0; font-size: 14px; line-height: 1.6; color: #64748b; text-align: center;">
                    ¿Tienes una emergencia?<br>
                    <strong style="color: #8b5cf6;">+57 (1) 234-5678</strong>
                  </p>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background: #1e293b; padding: 30px; text-align: center;">
                  <p style="margin: 0 0 10px 0; color: white; font-size: 16px; font-weight: 600;">Soporte Técnico Luckas</p>
                  <p style="margin: 0 0 15px 0; color: #94a3b8; font-size: 13px;">Estamos aquí para ayudarte 24/7</p>
                  <p style="margin: 15px 0 0 0; color: #64748b; font-size: 12px;">
                    © 2025 Luckas - Todos los derechos reservados<br>
                    soporteluckas@gmail.com
                  </p>
                </td>
              </tr>
              
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// ============================================
// CONTROLADORES DE EMAIL UNIFICADOS
// ============================================

/**
 * Enviar mensaje desde formularios de contacto
 * Tipos: "contacto", "panel", "soporte"
 */
exports.enviarMensaje = async (req, res) => {
  try {
    const { nombre, email, telefono, asunto, mensaje, tipo = "contacto" } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !asunto || !mensaje) {
      return res.status(400).json({
        success: false,
        message: "Por favor completa todos los campos requeridos",
      });
    }

    // HTML para el usuario (confirmación)
    const htmlUsuario = getTemplateConfirmacionContacto(nombre, email, telefono, asunto, mensaje);

    // HTML para el administrador
    const htmlAdmin = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="650" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); border: 1px solid #334155;">
                
                <!-- Header Admin -->
                <tr>
                  <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; border-bottom: 3px solid #ea580c;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 60px; vertical-align: middle;">
                          <div style="background: #1e293b; width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);">
                            <span style="font-size: 24px;">📨</span>
                          </div>
                        </td>
                        <td style="vertical-align: middle; padding-left: 15px;">
                          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">NUEVO MENSAJE</h1>
                          <p style="margin: 5px 0 0 0; color: #fed7aa; font-size: 14px; font-weight: 600;">${tipo.charAt(0).toUpperCase() + tipo.slice(1)} • ${new Date().toLocaleString("es-CO")}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Badge de Prioridad -->
                <tr>
                  <td style="background: #0f172a; padding: 20px; text-align: center; border-bottom: 1px solid #334155;">
                    <span style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 8px 20px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 2px 8px rgba(220, 38, 38, 0.4);">
                      ⚡ Requiere Atención
                    </span>
                  </td>
                </tr>
                
                <!-- Información del Contacto -->
                <tr>
                  <td style="padding: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #334155;">
                          <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Datos del Contacto</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <table width="100%" cellpadding="15" cellspacing="0">
                            <tr style="border-bottom: 1px solid #334155;">
                              <td style="width: 35%; color: #94a3b8; font-size: 13px; font-weight: 600;">👤 Nombre</td>
                              <td style="color: white; font-size: 14px; font-weight: 500;">${nombre}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #334155;">
                              <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">📧 Email</td>
                              <td><a href="mailto:${email}" style="color: #f59e0b; font-size: 14px; text-decoration: none; font-weight: 500;">${email}</a></td>
                            </tr>
                            <tr style="border-bottom: 1px solid #334155;">
                              <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">📱 Teléfono</td>
                              <td style="color: white; font-size: 14px;">${telefono || '<span style="color: #64748b; font-style: italic;">No proporcionado</span>'}</td>
                            </tr>
                            <tr>
                              <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">🏷️ Tipo</td>
                              <td>
                                <span style="background: #1e3a8a; color: #93c5fd; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">
                                  ${tipo}
                                </span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Asunto -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; margin-bottom: 25px; border: 1px solid #2563eb;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 8px 0; color: #93c5fd; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Asunto</p>
                          <p style="margin: 0; color: white; font-size: 18px; font-weight: 700; line-height: 1.4;">${asunto}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Mensaje -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155;">
                      <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #334155;">
                          <p style="margin: 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">💬 Mensaje</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${mensaje.replaceAll("\n", "<br>")}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Botón de Acción -->
                <tr>
                  <td style="padding: 0 30px 30px 30px; text-align: center;">
                    <a href="mailto:${email}?subject=RE: ${asunto}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                      📧 Responder Mensaje
                    </a>
                  </td>
                </tr>
                
                <!-- Footer Admin -->
                <tr>
                  <td style="background: #0f172a; padding: 25px; text-align: center; border-top: 1px solid #334155;">
                    <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">Panel de Administración</p>
                    <p style="margin: 0; color: #64748b; font-size: 11px;">Luckas © 2025 • soporteluckas@gmail.com</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      // Enviar email al usuario
      await sendEmail(
        email,
        "Confirmación de tu mensaje - Luckas",
        `Hola ${nombre}, hemos recibido tu mensaje. Te responderemos pronto.`,
        htmlUsuario
      );

      // Enviar email al soporte (soporteluckas@gmail.com)
      await sendEmail(
        "soporteluckas@gmail.com",
        `[${tipo.toUpperCase()}] Nuevo mensaje de ${nombre}`,
        `Nuevo mensaje de contacto de ${nombre} (${email}): ${mensaje}`,
        htmlAdmin
      );

      return res.status(200).json({
        success: true,
        message: "Tu mensaje ha sido enviado exitosamente. Pronto nos pondremos en contacto.",
      });
    } catch (emailError) {
      console.error("Error al enviar emails:", emailError);
      throw emailError;
    }
  } catch (error) {
    console.error("Error al enviar el mensaje:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar el mensaje. Por favor intenta más tarde.",
      error: error.message,
    });
  }
};

/**
 * Enviar reporte de soporte técnico
 */
exports.enviarReporteSoporte = async (req, res) => {
  try {
    const { nombre, email, modulo, severidad, descripcion, pasos, navegador, dispositivo } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !modulo || !severidad || !descripcion || !navegador) {
      return res.status(400).json({
        success: false,
        message: "Por favor completa todos los campos requeridos",
      });
    }

    // Generar número de ticket único usando número aleatorio criptográficamente seguro
    const randomPart = crypto.randomBytes(2).readUInt16BE(0) % 10000;
    const ticketNumber = `LUCK-${Date.now()}-${randomPart.toString().padStart(4, "0")}`;

    // HTML para el usuario (confirmación)
    const htmlUsuario = getTemplateConfirmacionSoporte(nombre, email, ticketNumber, modulo, severidad, descripcion);

    // HTML para el administrador
    const severidadColors = {
      critico: { bg: '#7f1d1d', border: '#dc2626', text: '#fecaca', emoji: '🔴', badge: '#991b1b' },
      alto: { bg: '#7c2d12', border: '#ea580c', text: '#fed7aa', emoji: '🟠', badge: '#9a3412' },
      medio: { bg: '#713f12', border: '#eab308', text: '#fef3c7', emoji: '🟡', badge: '#854d0e' },
      bajo: { bg: '#1e3a8a', border: '#3b82f6', text: '#bfdbfe', emoji: '🔵', badge: '#1e40af' }
    };
    const sev = severidadColors[severidad] || severidadColors.bajo;
    
    const htmlAdmin = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0f172a; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="650" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); border: 2px solid ${sev.border};">
                
                <!-- Header Admin Soporte -->
                <tr>
                  <td style="background: linear-gradient(135deg, ${sev.bg} 0%, #0f172a 100%); padding: 30px; border-bottom: 3px solid ${sev.border};">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="width: 60px; vertical-align: middle;">
                          <div style="background: rgba(255, 255, 255, 0.1); width: 50px; height: 50px; border-radius: 10px; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px); border: 1px solid ${sev.border};">
                            <span style="font-size: 24px;">🛠️</span>
                          </div>
                        </td>
                        <td style="vertical-align: middle; padding-left: 15px;">
                          <h1 style="margin: 0; color: white; font-size: 24px; font-weight: 700; letter-spacing: -0.5px;">TICKET DE SOPORTE</h1>
                          <p style="margin: 5px 0 0 0; color: ${sev.text}; font-size: 14px; font-weight: 600; font-family: 'Courier New', monospace;">${ticketNumber}</p>
                        </td>
                        <td style="text-align: right; vertical-align: middle; width: 120px;">
                          <div style="background: ${sev.badge}; color: white; padding: 8px 16px; border-radius: 20px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; border: 1px solid ${sev.border}; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);">
                            ${sev.emoji} ${severidad}
                          </div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Alerta de Severidad -->
                <tr>
                  <td style="background: ${sev.bg}; padding: 20px; text-align: center; border-bottom: 1px solid ${sev.border};">
                    <p style="margin: 0; color: ${sev.text}; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                      ${getMensajeAlerta(severidad)}
                    </p>
                  </td>
                </tr>
                
                <!-- Información del Usuario -->
                <tr>
                  <td style="padding: 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #334155;">
                          <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Usuario Reportante</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <table width="100%" cellpadding="15" cellspacing="0">
                            <tr style="border-bottom: 1px solid #334155;">
                              <td style="width: 30%; color: #94a3b8; font-size: 13px; font-weight: 600;">👤 Nombre</td>
                              <td style="color: white; font-size: 14px; font-weight: 500;">${nombre}</td>
                            </tr>
                            <tr>
                              <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">📧 Email</td>
                              <td><a href="mailto:${email}" style="color: #f59e0b; font-size: 14px; text-decoration: none; font-weight: 500;">${email}</a></td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Detalles Técnicos -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 20px; border-bottom: 1px solid #334155;">
                          <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">Información Técnica</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 0;">
                          <table width="100%" cellpadding="15" cellspacing="0">
                            <tr style="border-bottom: 1px solid #334155;">
                              <td style="width: 30%; color: #94a3b8; font-size: 13px; font-weight: 600;">📦 Módulo</td>
                              <td style="color: white; font-size: 14px;">${modulo}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #334155;">
                              <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">🌐 Navegador</td>
                              <td style="color: white; font-size: 14px;">${navegador}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #334155;">
                              <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">💻 Dispositivo</td>
                              <td style="color: white; font-size: 14px;">${dispositivo || '<span style="color: #64748b; font-style: italic;">No especificado</span>'}</td>
                            </tr>
                            <tr>
                              <td style="color: #94a3b8; font-size: 13px; font-weight: 600;">📅 Fecha/Hora</td>
                              <td style="color: #cbd5e1; font-size: 14px;">${new Date().toLocaleString("es-CO")}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Descripción del Problema -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); border-radius: 12px; margin-bottom: 25px; border: 1px solid #2563eb;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #93c5fd; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">🐛 Descripción del Problema</p>
                          <p style="margin: 0; color: white; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${descripcion.replaceAll("\n", "<br>")}</p>
                        </td>
                      </tr>
                    </table>
                    
                    ${pasos ? `
                    <!-- Pasos para Reproducir -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background: #0f172a; border-radius: 12px; border: 1px solid #334155; margin-bottom: 25px;">
                      <tr>
                        <td style="padding: 20px;">
                          <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">🔄 Pasos para Reproducir</p>
                          <p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.7; white-space: pre-wrap;">${pasos.replaceAll("\n", "<br>")}</p>
                        </td>
                      </tr>
                    </table>
                    ` : ''}
                  </td>
                </tr>
                
                <!-- Botones de Acción -->
                <tr>
                  <td style="padding: 0 30px 30px 30px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="text-align: center; padding: 0 5px;">
                          <a href="mailto:${email}?subject=RE: ${ticketNumber}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                            📧 Responder
                          </a>
                        </td>
                        <td style="text-align: center; padding: 0 5px;">
                          <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 13px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3); text-transform: uppercase; letter-spacing: 0.5px;">
                            ✅ Resolver
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Footer Admin -->
                <tr>
                  <td style="background: #0f172a; padding: 25px; text-align: center; border-top: 1px solid #334155;">
                    <p style="margin: 0 0 5px 0; color: #94a3b8; font-size: 13px; font-weight: 600;">Sistema de Soporte Técnico</p>
                    <p style="margin: 0; color: #64748b; font-size: 11px;">Luckas © 2025 • soporteluckas@gmail.com</p>
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    try {
      // Enviar email al usuario
      await sendEmail(
        email,
        `Ticket de Soporte Creado: ${ticketNumber}`,
        `Tu reporte técnico ha sido recibido con el ticket ${ticketNumber}. Te responderemos pronto.`,
        htmlUsuario
      );

      // Enviar email al soporte (soporteluckas@gmail.com)
      await sendEmail(
        "soporteluckas@gmail.com",
        `[SOPORTE-${severidad.toUpperCase()}] ${ticketNumber} - ${nombre}`,
        `Nuevo reporte de soporte técnico: ${descripcion}`,
        htmlAdmin
      );

      return res.status(200).json({
        success: true,
        message: "Tu reporte ha sido creado exitosamente.",
        ticketNumber: ticketNumber,
      });
    } catch (emailError) {
      console.error("Error al enviar emails de soporte:", emailError);
      throw emailError;
    }
  } catch (error) {
    console.error("Error al enviar reporte de soporte:", error);
    return res.status(500).json({
      success: false,
      message: "Error al enviar el reporte. Por favor intenta más tarde.",
      error: error.message,
    });
  }
};
