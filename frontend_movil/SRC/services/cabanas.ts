// Servicio para manejo de cabañas

import { authService } from './auth';
import { Cabana } from '../types';
import { API_CONFIG } from '../config';

class CabanasService {
    constructor() {
        console.log('CabanasService inicializado');
    }
    
    async getAllCabanas(): Promise<{ success: boolean; data?: Cabana[]; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CABANAS, {
                method: 'GET',
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al obtener cabañas' };
            }
            // Extraer array de cabañas aunque esté anidado
            let cabanas: Cabana[] = [];
            if (Array.isArray(response.data)) {
                cabanas = response.data as Cabana[];
            } else if (response.data && Array.isArray((response.data as any).data)) {
                cabanas = (response.data as any).data as Cabana[];
            }
            return { success: true, data: cabanas };
        } catch (error) {
            console.error('Error getting cabanas:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getCabanaById(id: string): Promise<{ success: boolean; data?: Cabana; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CABANAS}/${id}`, {
                method: 'GET',
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al obtener la cabaña' };
            }
            return { success: true, data: response.data as Cabana };
        } catch (error) {
            console.error('Error getting cabana:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createCabana(cabanaData: Partial<Cabana>): Promise<{ success: boolean; data?: Cabana; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CABANAS, {
                method: 'POST',
                body: JSON.stringify(cabanaData),
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al crear la cabaña' };
            }
            return { success: true, data: response.data as Cabana };
        } catch (error) {
            console.error('Error creating cabana:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateCabana(id: string, cabanaData: Partial<Cabana>): Promise<{ success: boolean; data?: Cabana; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CABANAS}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(cabanaData),
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al actualizar la cabaña' };
            }
            return { success: true, data: response.data as Cabana };
        } catch (error) {
            console.error('Error updating cabana:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteCabana(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CABANAS}/${id}`, {
                method: 'DELETE',
            });
            return {
                success: response.success,
                message: response.message || (response.success ? 'Cabaña eliminada con éxito' : 'Error al eliminar la cabaña')
            };
        } catch (error) {
            console.error('Error deleting cabana:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos de utilidad
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    // Validaciones
    validateCabana(cabana: Partial<Cabana>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!cabana.nombre || cabana.nombre.trim().length === 0) {
            errors.push('El nombre de la cabaña es requerido');
        }

        if (!cabana.capacidad || cabana.capacidad <= 0) {
            errors.push('La capacidad debe ser mayor a 0');
        }

        if (!cabana.precio || cabana.precio <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }

        if (!cabana.categoria) {
            errors.push('La categoría es requerida');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Estados de cabaña
    getEstados(): string[] {
        return ['disponible', 'ocupada', 'mantenimiento'];
    }

    getEstadoColor(estado: string): string {
        switch (estado) {
            case 'disponible': return '#28a745';
            case 'ocupada': return '#dc3545';
            case 'mantenimiento': return '#ffc107';
            default: return '#6c757d';
        }
    }

    getEstadoIcon(estado: string): string {
        switch (estado) {
            case 'disponible': return 'checkmark-circle';
            case 'ocupada': return 'close-circle';
            case 'mantenimiento': return 'construct';
            default: return 'help-circle';
        }
    }
}

export const cabanasService = new CabanasService();