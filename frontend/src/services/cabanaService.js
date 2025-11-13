const API_URL = "http://localhost:3000/api/cabanas";

export const cabanaService = {
  getAll: async () => {
    const res = await fetch(API_URL, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener cabañas");
    return await res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al obtener la cabaña");
    return await res.json();
  },

  create: async (cabana) => {

    
    // Si es FormData (para imágenes), no agregamos Content-Type
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    
    // Solo agregar Content-Type si no es FormData
    if (!(cabana instanceof FormData)) {
      headers["Content-Type"] = "application/json";
   
    } else {
      console.log('CabanaService: Enviando FormData con imágenes');
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: headers,
        body: cabana instanceof FormData ? cabana : JSON.stringify(cabana),
      });
      
      console.log('CabanaService: Respuesta recibida, status:', res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('CabanaService: Error en respuesta:', errorText);
        throw new Error(`Error al crear cabaña: ${res.status} ${errorText}`);
      }
      
      const result = await res.json();
      console.log('CabanaService: Cabaña creada exitosamente:', result);
      return result;
    } catch (error) {
      console.error('CabanaService: Error en create:', error);
      throw error;
    }
  },

  update: async (id, cabana) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(cabana),
    });
    if (!res.ok) throw new Error("Error al actualizar cabaña");
    return await res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) throw new Error("Error al eliminar cabaña");
    return await res.json();
  },
};