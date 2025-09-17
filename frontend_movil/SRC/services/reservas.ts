// Servicio para manejo de reservas

import { authService } from './auth';
import { Reserva } from '../types';
import { API_CONFIG } from '../config';

export class ReservasService {
    
    async getAllReservas(): Promise<{ success: boolean; data?: Reserva[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.RESERVAS, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting reservas:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getReservaById(id: string): Promise<{ success: boolean; data?: Reserva; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`/api/reservas/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting reserva:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createReserva(reservaData: Partial<Reserva>): Promise<{ success: boolean; data?: Reserva; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest('/api/reservas', {
                method: 'POST',
                body: JSON.stringify(reservaData),
            });
        } catch (error) {
            console.error('Error creating reserva:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateReserva(id: string, reservaData: Partial<Reserva>): Promise<{ success: boolean; data?: Reserva; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`/api/reservas/${id}`, {
                method: 'PUT',
                body: JSON.stringify(reservaData),
            });
        } catch (error) {
            console.error('Error updating reserva:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteReserva(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`/api/reservas/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting reserva:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getDatosParaReserva(): Promise<any> {
        try {
            return await authService.makeAuthenticatedRequest('/api/reservas/datos', {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting datos para reserva:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getReservasByUser(userId: string): Promise<{ success: boolean; data?: Reserva[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`/api/reservas/usuario/${userId}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting user reservas:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getReservasByCabana(cabanaId: string): Promise<{ success: boolean; data?: Reserva[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`/api/reservas/cabana/${cabanaId}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting cabana reservas:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async checkDisponibilidad(cabanaId: string, fechaInicio: string, fechaFin: string): Promise<{ success: boolean; data?: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`/api/reservas/disponibilidad/${cabanaId}?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error checking disponibilidad:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos de utilidad para fechas
    formatDate(date: Date): string {
        return date.toISOString().split('T')[0];
    }

    calculateNights(fechaInicio: string, fechaFin: string): number {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diffTime = Math.abs(fin.getTime() - inicio.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    calculateTotal(precioNoche: number, noches: number): number {
        return precioNoche * noches;
    }

    // Validaciones
    validateReserva(reserva: Partial<Reserva>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!reserva.usuario) {
            errors.push('Usuario es requerido');
        }

        if (!reserva.cabana) {
            errors.push('Cabaña es requerida');
        }

        if (!reserva.fechaInicio) {
            errors.push('Fecha de inicio es requerida');
        }

        if (!reserva.fechaFin) {
            errors.push('Fecha de fin es requerida');
        }

        if (reserva.fechaInicio && reserva.fechaFin) {
            const inicio = new Date(reserva.fechaInicio);
            const fin = new Date(reserva.fechaFin);
            
            if (inicio >= fin) {
                errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
            }

            if (inicio < new Date()) {
                errors.push('La fecha de inicio no puede ser en el pasado');
            }
        }

        if (reserva.precio && reserva.precio <= 0) {
            errors.push('El precio debe ser mayor a 0');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Estados de reserva
    getEstados(): string[] {
        return ['Pendiente', 'Confirmada', 'En curso', 'Completada', 'Cancelada'];
    }

    getEstadoColor(estado: string): string {
        switch (estado) {
            case 'Pendiente': return '#f59e0b';
            case 'Confirmada': return '#10b981';
            case 'En curso': return '#3b82f6';
            case 'Completada': return '#059669';
            case 'Cancelada': return '#ef4444';
            default: return '#6b7280';
        }
    }
}

export const reservasService = new ReservasService();