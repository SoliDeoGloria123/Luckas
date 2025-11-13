import BaseService from './BaseService';

const API_URL = "http://localhost:3000/api/reservas";

// Crear instancia del servicio base
const baseService = new BaseService(API_URL, 'reserva');

export const reservaService = {
  // Operaciones CRUD básicas usando BaseService
  getAll: () => baseService.getAll(),
  getById: (id) => baseService.getById(id),
  create: (reserva) => baseService.create(reserva),
  update: (id, reserva) => baseService.update(id, reserva),
  delete: (id) => baseService.delete(id),
  // Obtener historial de reservas de un usuario
  getReservasPorUsuario: async (userId) => {
    const res = await fetch(`${API_URL}/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    });
    if (!res.ok) throw new Error("Error al obtener reservas del usuario");
    return await res.json();
  }
  
};

