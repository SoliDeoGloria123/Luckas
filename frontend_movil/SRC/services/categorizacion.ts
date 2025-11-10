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
    
    async getCategorizacionesActivas(): Promise<{ success: boolean; data?: string[]; message?: string }> {
        try {
            console.log('🔄 Obteniendo categorías activas...');
            const response = await this.getAllCategorizaciones();
            console.log('📥 Respuesta getAllCategorizaciones:', response);
            
            if (response.success && response.data) {
                // Verificar si response.data es un array directamente o está dentro de .data
                let categorias = response.data;
                
                // Si la respuesta tiene una estructura anidada {data: {data: [...]}}, extraer el array
                if (response.data && typeof response.data === 'object' && 'data' in response.data) {
                    categorias = (response.data as any).data;
                }
                
                console.log('📋 Categorías extraídas:', categorias);
                console.log('🔍 Tipo de categorías:', Array.isArray(categorias) ? 'array' : typeof categorias);
                
                // Verificar que sea un array antes de filtrar
                if (Array.isArray(categorias)) {
                    const nombres = categorias
                        .filter(cat => cat?.activo)
                        .map(cat => cat.nombre)
                        .filter(Boolean); // Filtrar nombres válidos
                    
                    console.log('✅ Nombres de categorías activas:', nombres);
                    return { success: true, data: nombres };
                } else {
                    console.error('❌ Las categorías no son un array:', categorias);
                    return { success: false, message: 'Formato de respuesta inválido' };
                }
            }
            
            console.log('❌ Respuesta sin éxito o sin datos:', response);
            return { success: false, message: response.message || 'No hay datos disponibles' };
        } catch (error) {
            console.error('❌ Error getting categorizaciones activas:', error);
            return { success: false, message: 'Error de conexión' };
        }
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

    getEstadoColorActivo(): string {
        return '#28a745';
    }

    getEstadoColorInactivo(): string {
        return '#dc3545';
    }

    getEstadoTextActivo(): string {
        return 'Activo';
    }

    getEstadoTextInactivo(): string {
        return 'Inactivo';
    }


}

const categorizacionService = new CategorizacionService();
export default categorizacionService;
