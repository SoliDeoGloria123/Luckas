// Servicio para gestión de eventos

import { authService } from './auth';
import { Evento } from '../types';
import { API_CONFIG } from '../config';

class EventosService {
    constructor() {
        console.log('EventosService inicializado');
    }

    async getAllEventos(): Promise<{ success: boolean; data?: Evento[]; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.EVENTOS, {
                method: 'GET',
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al obtener eventos' };
            }
            // Asegurar que la respuesta sea un array
            const eventos = Array.isArray((response.data as any)?.data) ? (response.data as any).data : [];
            return { success: true, data: eventos as Evento[] };
        } catch (error) {
            console.error('Error getting eventos:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getEventoById(id: string): Promise<{ success: boolean; data?: Evento; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.EVENTOS}/${id}`, {
                method: 'GET',
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al obtener el evento' };
            }
            return { success: true, data: response.data as Evento };
        } catch (error) {
            console.error('Error getting evento:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createEvento(eventoData: Partial<Evento>): Promise<{ success: boolean; data?: Evento; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.EVENTOS, {
                method: 'POST',
                body: JSON.stringify(eventoData),
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al crear el evento' };
            }
            return { success: true, data: response.data as Evento };
        } catch (error) {
            console.error('Error creating evento:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateEvento(id: string, eventoData: Partial<Evento>): Promise<{ success: boolean; data?: Evento; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.EVENTOS}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(eventoData),
            });
            if (!response.success) {
                return { success: false, message: response.message || 'Error al actualizar el evento' };
            }
            return { success: true, data: response.data as Evento };
        } catch (error) {
            console.error('Error updating evento:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteEvento(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            const response = await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.EVENTOS}/${id}`, {
                method: 'DELETE',
            });
            return {
                success: response.success,
                message: response.message || (response.success ? 'Evento eliminado con éxito' : 'Error al eliminar el evento')
            };
        } catch (error) {
            console.error('Error deleting evento:', error);
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

    calculateDuration(horaInicio: string, horaFin: string): number {
        const inicio = new Date(`2000-01-01T${horaInicio}:00`);
        const fin = new Date(`2000-01-01T${horaFin}:00`);
        return (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60); // horas
    }

    // Validaciones
    validateEvento(evento: Partial<Evento>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!evento.nombre || evento.nombre.trim().length === 0) {
            errors.push('El nombre del evento es requerido');
        }

        if (!evento.descripcion || evento.descripcion.trim().length === 0) {
            errors.push('La descripción del evento es requerida');
        }

        if (!evento.fechaEvento) {
            errors.push('La fecha del evento es requerida');
        }

        if (!evento.horaInicio) {
            errors.push('La hora de inicio es requerida');
        }

        if (!evento.horaFin) {
            errors.push('La hora de fin es requerida');
        }

        if (evento.horaInicio && evento.horaFin && evento.horaInicio >= evento.horaFin) {
            errors.push('La hora de fin debe ser posterior a la hora de inicio');
        }

        if (!evento.lugar || evento.lugar.trim().length === 0) {
            errors.push('El lugar del evento es requerido');
        }

        if (!evento.precio || evento.precio < 0) {
            errors.push('El precio debe ser mayor o igual a 0');
        }

        if (!evento.cuposTotales || evento.cuposTotales <= 0) {
            errors.push('Los cupos totales deben ser mayor a 0');
        }

      if (evento.fechaEvento && new Date(evento.fechaEvento) < new Date()) {
    errors.push('La fecha del evento no puede ser en el pasado');
}
        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Estados y prioridades
    getPrioridades(): string[] {
        return ['Alta', 'Media', 'Baja'];
    }

    getPrioridadColor(prioridad: string): string {
        switch (prioridad) {
            case 'Alta': return '#dc3545';
            case 'Media': return '#ffc107';
            case 'Baja': return '#28a745';
            default: return '#6c757d';
        }
    }
}

// Exportar una instancia única del servicio
export const eventosService = new EventosService();