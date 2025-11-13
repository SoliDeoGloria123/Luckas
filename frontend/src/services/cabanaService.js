import BaseService from './BaseService';

const API_URL = "http://localhost:3000/api/cabanas";

// Crear instancia del servicio base
const baseService = new BaseService(API_URL, 'cabaña');

export const cabanaService = {
  // Operaciones CRUD básicas usando BaseService (maneja FormData automáticamente)
  getAll: () => baseService.getAll(),
  getById: (id) => baseService.getById(id),
  create: (cabana) => baseService.create(cabana), // BaseService maneja FormData automáticamente
  update: (id, cabana) => baseService.update(id, cabana),
  delete: (id) => baseService.delete(id),
};