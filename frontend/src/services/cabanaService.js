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
  getEstadisticasGenerales: () => baseService.getEstadisticasGenerales(),
};

export const UPLOADS_CABANAS_BASE = "http://localhost:3000/uploads/cabanas";

export const getCabanaImageUrl = (imgPath) => {
  if (!imgPath) return null;
  if (typeof imgPath === 'string' && (imgPath.startsWith('http://') || imgPath.startsWith('https://'))) {
    return imgPath;
  }
  return `${UPLOADS_CABANAS_BASE}/${imgPath}`;
};