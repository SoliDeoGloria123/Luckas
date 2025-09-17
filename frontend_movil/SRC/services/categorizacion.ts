// Servicio para manejo de categorización

import { authService } from './auth';
import { Categorizacion } from '../types';
import { API_CONFIG } from '../config';

export class CategorizacionService {
    
    async getAllCategorizaciones(): Promise<{ success: boolean; data?: Categorizacion[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CATEGORIZACION, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting categorizaciones:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getCategorizacionById(id: string): Promise<{ success: boolean; data?: Categorizacion; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CATEGORIZACION}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting categorización:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createCategorizacion(categorizacionData: Partial<Categorizacion>): Promise<{ success: boolean; data?: Categorizacion; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CATEGORIZACION, {
                method: 'POST',
                body: JSON.stringify(categorizacionData),
            });
        } catch (error) {
            console.error('Error creating categorización:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateCategorizacion(id: string, categorizacionData: Partial<Categorizacion>): Promise<{ success: boolean; data?: Categorizacion; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CATEGORIZACION}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(categorizacionData),
            });
        } catch (error) {
            console.error('Error updating categorización:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteCategorizacion(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CATEGORIZACION}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting categorización:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos de utilidad
    
    // Filtrar categorizaciones por tipo
    async getCategorizacionesByTipo(tipo: string): Promise<{ success: boolean; data?: Categorizacion[]; message?: string }> {
        try {
            const response = await this.getAllCategorizaciones();
            if (response.success && response.data) {
                const filtered = response.data.filter(cat => cat.tipo === tipo);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error filtering categorizaciones by tipo:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Solo categorizaciones activas
    async getCategorizacionesActivas(): Promise<{ success: boolean; data?: Categorizacion[]; message?: string }> {
        try {
            const response = await this.getAllCategorizaciones();
            if (response.success && response.data) {
                const activas = response.data.filter(cat => cat.activo);
                return { success: true, data: activas };
            }
            return response;
        } catch (error) {
            console.error('Error getting categorizaciones activas:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Validaciones
    validateCategorizacion(categorizacion: Partial<Categorizacion>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!categorizacion.nombre || categorizacion.nombre.trim().length === 0) {
            errors.push('El nombre de la categorización es requerido');
        }

        if (!categorizacion.tipo || categorizacion.tipo.trim().length === 0) {
            errors.push('El tipo de categorización es requerido');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Tipos de categorización comunes
    getTiposComunes(): string[] {
        return [
            'evento',
            'cabana',
            'curso',
            'programa_tecnico',
            'general'
        ];
    }

    // Estados
    getEstados(): Array<{ label: string; value: boolean }> {
        return [
            { label: 'Activo', value: true },
            { label: 'Inactivo', value: false }
        ];
    }

    getEstadoColor(activo: boolean): string {
        return activo ? '#28a745' : '#dc3545';
    }

    getEstadoText(activo: boolean): string {
        return activo ? 'Activo' : 'Inactivo';
    }
}

export const categorizacionService = new CategorizacionService();