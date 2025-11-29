// BaseService - Servicio base para eliminar duplicación en operaciones CRUD
class BaseService {
  constructor(baseURL, resourceName = 'recurso') {
    this.baseURL = baseURL;
    this.resourceName = resourceName;
  }

  // Obtener headers por defecto
  getDefaultHeaders(excludeContentType = false) {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    
    if (!excludeContentType) {
      headers["Content-Type"] = "application/json";
    }
    
    return headers;
  }

  // Manejar errores de respuesta
  async handleResponse(response, operation = 'operación') {
    // Respuestas sin cuerpo o no modificadas
    if (response.status === 204 || response.status === 304) return null;

    const contentType = response.headers.get('content-type') || '';
    let json = null;
    if (contentType.includes('application/json')) {
      json = await response.json();
    }

    if (!response.ok) {
      const message = (json && json.message) || `Error al ${operation} ${this.resourceName}`;
      throw new Error(message);
    }

    // Si la API retorna { success: true, data: [...] } devolver directamente data
    if (json && typeof json === 'object' && Object.hasOwn(json, 'data')) {
      return json.data;
    }

    return json;
  }

  // GET ALL - Obtener todos los recursos
  async getAll() {
    const response = await fetch(this.baseURL, { cache: 'no-cache', headers: this.getDefaultHeaders() });
    return this.handleResponse(response, 'obtener');
  }

  // GET BY ID - Obtener un recurso por ID
  async getById(id) {
    const response = await fetch(`${this.baseURL}/${id}`, { cache: 'no-cache', headers: this.getDefaultHeaders() });
    return this.handleResponse(response, 'obtener');
  }

  // CREATE - Crear un nuevo recurso
  async create(data) {
    const isFormData = data instanceof FormData;
    const headers = this.getDefaultHeaders(isFormData);
    
    const response = await fetch(this.baseURL, {
      cache: 'no-cache',
      method: "POST",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return this.handleResponse(response, 'crear');
  }

  // UPDATE - Actualizar un recurso
  async update(id, data) {
    const isFormData = data instanceof FormData;
    const headers = this.getDefaultHeaders(isFormData);
    
    const response = await fetch(`${this.baseURL}/${id}`, {
      cache: 'no-cache',
      method: "PUT",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return this.handleResponse(response, 'actualizar');
  }

  // DELETE - Eliminar un recurso
  async delete(id) {
    const response = await fetch(`${this.baseURL}/${id}`, { cache: 'no-cache', method: "DELETE", headers: this.getDefaultHeaders() });
    return this.handleResponse(response, 'eliminar');
  }

  // PATCH - Actualización parcial
  async patch(id, data) {
    const response = await fetch(`${this.baseURL}/${id}`, { cache: 'no-cache', method: "PATCH", headers: this.getDefaultHeaders(), body: JSON.stringify(data) });
    return this.handleResponse(response, 'actualizar parcialmente');
  }

  // Obtener estadísticas generales
  async getEstadisticasGenerales() {
    try {
      const response = await fetch(`${this.baseURL}/estadisticas`, { cache: 'no-cache', headers: this.getDefaultHeaders() });
      return this.handleResponse(response, 'obtener estadísticas generales');
    } catch (error) {
      console.error(`Error en getEstadisticasGenerales:`, error);
      throw error;
    }
  }
}

export default BaseService;