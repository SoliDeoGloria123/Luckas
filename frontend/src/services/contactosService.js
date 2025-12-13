const API_BASE_URL = "http://localhost:3000/api/contacto";

/**
 * Servicio de Contacto - Gestiona todas las solicitudes de contacto
 */

// ============================================
// ENVIAR MENSAJE DE CONTACTO
// ============================================
export const enviarMensajeContacto = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enviar-mensaje`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono || "",
        asunto: datos.asunto,
        mensaje: datos.mensaje,
        tipo: "contacto", // Tipo para identificar el formulario
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al enviar el mensaje");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en enviarMensajeContacto:", error);
    throw error;
  }
};

// ============================================
// ENVIAR MENSAJE DESDE PANEL PRINCIPAL
// ============================================
export const enviarMensajePanel = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enviar-mensaje`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: datos.nombre,
        email: datos.email,
        telefono: datos.telefono || "",
        asunto: datos.asunto || "Mensaje desde Panel Principal",
        mensaje: datos.mensaje,
        tipo: "panel", // Tipo para identificar el formulario
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al enviar el mensaje");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en enviarMensajePanel:", error);
    throw error;
  }
};

// ============================================
// ENVIAR REPORTE DE SOPORTE TÉCNICO
// ============================================
export const enviarReporteSoporte = async (datos) => {
  try {
    const response = await fetch(`${API_BASE_URL}/enviar-soporte`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nombre: datos.nombre,
        email: datos.email,
        modulo: datos.modulo,
        severidad: datos.severidad,
        descripcion: datos.descripcion,
        pasos: datos.pasos || "",
        navegador: datos.navegador,
        dispositivo: datos.dispositivo || "",
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error al enviar el reporte");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en enviarReporteSoporte:", error);
    throw error;
  }
};

