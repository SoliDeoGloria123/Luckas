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
    if (!response.ok) {
      throw new Error(`Error al ${operation} ${this.resourceName}`);
    }
    return await response.json();
  }

  // GET ALL - Obtener todos los recursos
  async getAll() {
    const response = await fetch(this.baseURL, {
      headers: this.getDefaultHeaders(),
    });
    return this.handleResponse(response, 'obtener');
  }

  // GET BY ID - Obtener un recurso por ID
  async getById(id) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      headers: this.getDefaultHeaders(),
    });
    return this.handleResponse(response, 'obtener');
  }

  // CREATE - Crear un nuevo recurso
  async create(data) {
    const isFormData = data instanceof FormData;
    const headers = this.getDefaultHeaders(isFormData);
    
    const response = await fetch(this.baseURL, {
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
      method: "PUT",
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    });
    return this.handleResponse(response, 'actualizar');
  }

  // DELETE - Eliminar un recurso
  async delete(id) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: "DELETE",
      headers: this.getDefaultHeaders(),
    });
    return this.handleResponse(response, 'eliminar');
  }

  // PATCH - Actualización parcial
  async patch(id, data) {
    const response = await fetch(`${this.baseURL}/${id}`, {
      method: "PATCH",
      headers: this.getDefaultHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse(response, 'actualizar parcialmente');
  }
}

export default BaseService;