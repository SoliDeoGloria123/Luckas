// Servicio para manejo de cabañas

import { authService } from './auth';
import { Cabana } from '../types';
import { API_CONFIG } from '../config';

export class CabanasService {
    
    async getAllCabanas(): Promise<{ success: boolean; data?: Cabana[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CABANAS, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting cabanas:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getCabanaById(id: string): Promise<{ success: boolean; data?: Cabana; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CABANAS}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting cabana:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createCabana(cabanaData: Partial<Cabana>): Promise<{ success: boolean; data?: Cabana; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CABANAS, {
                method: 'POST',
                body: JSON.stringify(cabanaData),
            });
        } catch (error) {
            console.error('Error creating cabana:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateCabana(id: string, cabanaData: Partial<Cabana>): Promise<{ success: boolean; data?: Cabana; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CABANAS}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(cabanaData),
            });
        } catch (error) {
            console.error('Error updating cabana:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteCabana(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CABANAS}/${id}`, {
                method: 'DELETE',
            });
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