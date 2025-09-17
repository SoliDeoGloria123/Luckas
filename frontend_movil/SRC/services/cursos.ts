// Servicio para manejo de cursos

import { authService } from './auth';
import { Curso } from '../types';
import { API_CONFIG } from '../config';

export class CursosService {
    
    async getAllCursos(): Promise<{ success: boolean; data?: Curso[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CURSOS, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting cursos:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getCursoById(id: string): Promise<{ success: boolean; data?: Curso; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CURSOS}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting curso:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createCurso(cursoData: Partial<Curso>): Promise<{ success: boolean; data?: Curso; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.CURSOS, {
                method: 'POST',
                body: JSON.stringify(cursoData),
            });
        } catch (error) {
            console.error('Error creating curso:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateCurso(id: string, cursoData: Partial<Curso>): Promise<{ success: boolean; data?: Curso; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CURSOS}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(cursoData),
            });
        } catch (error) {
            console.error('Error updating curso:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteCurso(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.CURSOS}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting curso:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos de utilidad
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    formatTime(date: Date): string {
        return date.toTimeString().slice(0, 5);
    }

    // Validaciones
    validateCurso(curso: Partial<Curso>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!curso.nombre || curso.nombre.trim().length === 0) {
            errors.push('El nombre del curso es requerido');
        }

        if (!curso.descripcion || curso.descripcion.trim().length === 0) {
            errors.push('La descripción del curso es requerida');
        }

        if (!curso.fechaInicio) {
            errors.push('La fecha de inicio es requerida');
        }

        if (!curso.fechaFin) {
            errors.push('La fecha de fin es requerida');
        }

        if (curso.fechaInicio && curso.fechaFin && curso.fechaInicio >= curso.fechaFin) {
            errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
        }

        if (!curso.precio || curso.precio < 0) {
            errors.push('El precio debe ser mayor o igual a 0');
        }

        if (!curso.cupos || curso.cupos <= 0) {
            errors.push('Los cupos deben ser mayor a 0');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Estados de curso
    getEstados(): string[] {
        return ['activo', 'inactivo', 'finalizado', 'suspendido'];
    }

    getEstadoColor(estado: string): string {
        switch (estado) {
            case 'activo': return '#28a745';
            case 'inactivo': return '#6c757d';
            case 'finalizado': return '#17a2b8';
            case 'suspendido': return '#dc3545';
            default: return '#6c757d';
        }
    }

    // Modalidades
    getModalidades(): string[] {
        return ['presencial', 'virtual', 'semipresencial'];
    }
}

export const cursosService = new CursosService();