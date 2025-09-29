// Servicio para manejo de inscripciones

import { authService } from './auth';
import { API_CONFIG } from '../config';

// Tipo Inscripción basado en el modelo del backend
export interface Inscripcion {
    _id: string;
    usuario: string; // ObjectId del usuario
    evento?: string; // ObjectId del evento
    curso?: string; // ObjectId del curso
    programa?: string; // ObjectId del programa
    fechaInscripcion: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
    observaciones?: string;
    fechaConfirmacion?: string;
    fechaCancelacion?: string;
    motivo?: string;
    pago: {
        estado: 'pendiente' | 'pagado' | 'reembolsado';
        monto: number;
        fechaPago?: string;
        metodoPago?: string;
        referencia?: string;
    };
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface InscripcionForm {
    evento?: string;
    curso?: string;
    programa?: string;
    observaciones?: string;
    pago: {
        monto: number;
        metodoPago?: string;
        referencia?: string;
    };
}

export class InscripcionesService {
    
    async getAllInscripciones(): Promise<{ success: boolean; data?: Inscripcion[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.INSCRIPCIONES, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting inscripciones:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getInscripcionById(id: string): Promise<{ success: boolean; data?: Inscripcion; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.INSCRIPCIONES}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting inscripción:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createInscripcion(inscripcionData: InscripcionForm): Promise<{ success: boolean; data?: Inscripcion; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.INSCRIPCIONES, {
                method: 'POST',
                body: JSON.stringify(inscripcionData),
            });
        } catch (error) {
            console.error('Error creating inscripción:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateInscripcion(id: string, inscripcionData: Partial<InscripcionForm>): Promise<{ success: boolean; data?: Inscripcion; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.INSCRIPCIONES}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(inscripcionData),
            });
        } catch (error) {
            console.error('Error updating inscripción:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteInscripcion(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.INSCRIPCIONES}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting inscripción:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos específicos para inscripciones

    // Obtener inscripciones del usuario actual
    async getMisInscripciones(): Promise<{ success: boolean; data?: Inscripcion[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.INSCRIPCIONES}/mis-inscripciones`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting mis inscripciones:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener inscripciones por evento
    async getInscripcionesByEvento(eventoId: string): Promise<{ success: boolean; data?: Inscripcion[]; message?: string }> {
        try {
            const response = await this.getAllInscripciones();
            if (response.success && response.data) {
                const filtered = response.data.filter(inscripcion => inscripcion.evento === eventoId);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting inscripciones by evento:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener inscripciones por curso
    async getInscripcionesByCurso(cursoId: string): Promise<{ success: boolean; data?: Inscripcion[]; message?: string }> {
        try {
            const response = await this.getAllInscripciones();
            if (response.success && response.data) {
                const filtered = response.data.filter(inscripcion => inscripcion.curso === cursoId);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting inscripciones by curso:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener inscripciones por programa
    async getInscripcionesByPrograma(programaId: string): Promise<{ success: boolean; data?: Inscripcion[]; message?: string }> {
        try {
            const response = await this.getAllInscripciones();
            if (response.success && response.data) {
                const filtered = response.data.filter(inscripcion => inscripcion.programa === programaId);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting inscripciones by programa:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener inscripciones por estado
    async getInscripcionesByEstado(estado: string): Promise<{ success: boolean; data?: Inscripcion[]; message?: string }> {
        try {
            const response = await this.getAllInscripciones();
            if (response.success && response.data) {
                const filtered = response.data.filter(inscripcion => inscripcion.estado === estado);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting inscripciones by estado:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Cambiar estado de inscripción
    async changeEstadoInscripcion(id: string, estado: 'pendiente' | 'confirmada' | 'cancelada' | 'completada', motivo?: string): Promise<{ success: boolean; data?: Inscripcion; message?: string }> {
        try {
            const updateData: any = { estado };
            
            if (estado === 'confirmada') {
                updateData.fechaConfirmacion = new Date().toISOString();
            } else if (estado === 'cancelada') {
                updateData.fechaCancelacion = new Date().toISOString();
                if (motivo) updateData.motivo = motivo;
            }
            
            return await this.updateInscripcion(id, updateData);
        } catch (error) {
            console.error('Error changing inscripción estado:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Actualizar estado de pago
    async updateEstadoPago(id: string, estadoPago: 'pendiente' | 'pagado' | 'reembolsado', datosPago?: {
        fechaPago?: string;
        metodoPago?: string;
        referencia?: string;
    }): Promise<{ success: boolean; data?: Inscripcion; message?: string }> {
        try {
            const updateData: any = {
                'pago.estado': estadoPago
            };
            
            if (datosPago) {
                if (datosPago.fechaPago) updateData['pago.fechaPago'] = datosPago.fechaPago;
                if (datosPago.metodoPago) updateData['pago.metodoPago'] = datosPago.metodoPago;
                if (datosPago.referencia) updateData['pago.referencia'] = datosPago.referencia;
            }
            
            return await this.updateInscripcion(id, updateData);
        } catch (error) {
            console.error('Error updating estado pago:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Buscar inscripciones
    searchInscripciones(inscripciones: Inscripcion[], searchTerm: string): Inscripcion[] {
        if (!searchTerm.trim()) return inscripciones;
        
        const term = searchTerm.toLowerCase();
        return inscripciones.filter(inscripcion => 
            inscripcion.observaciones?.toLowerCase().includes(term) ||
            inscripcion.pago.referencia?.toLowerCase().includes(term)
        );
    }

    // Filtros combinados
    filterInscripciones(inscripciones: Inscripcion[], filters: {
        estado?: string;
        estadoPago?: string;
        evento?: string;
        curso?: string;
        programa?: string;
        fechaInicio?: string;
        fechaFin?: string;
    }): Inscripcion[] {
        return inscripciones.filter(inscripcion => {
            if (filters.estado && inscripcion.estado !== filters.estado) return false;
            if (filters.estadoPago && inscripcion.pago.estado !== filters.estadoPago) return false;
            if (filters.evento && inscripcion.evento !== filters.evento) return false;
            if (filters.curso && inscripcion.curso !== filters.curso) return false;
            if (filters.programa && inscripcion.programa !== filters.programa) return false;
            
            if (filters.fechaInicio || filters.fechaFin) {
                const fechaInscripcion = new Date(inscripcion.fechaInscripcion);
                if (filters.fechaInicio && fechaInscripcion < new Date(filters.fechaInicio)) return false;
                if (filters.fechaFin && fechaInscripcion > new Date(filters.fechaFin)) return false;
            }
            
            return true;
        });
    }

    // Validaciones
    validateInscripcion(inscripcion: Partial<InscripcionForm>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        // Debe tener al menos un tipo de inscripción
        if (!inscripcion.evento && !inscripcion.curso && !inscripcion.programa) {
            errors.push('Debe seleccionar un evento, curso o programa para inscribirse');
        }

        // Solo puede inscribirse a uno a la vez
        const tiposSeleccionados = [inscripcion.evento, inscripcion.curso, inscripcion.programa].filter(Boolean).length;
        if (tiposSeleccionados > 1) {
            errors.push('Solo puede inscribirse a un evento, curso o programa a la vez');
        }

        // Validar pago
        if (!inscripcion.pago) {
            errors.push('La información de pago es requerida');
        } else {
            if (!inscripcion.pago.monto || inscripcion.pago.monto <= 0) {
                errors.push('El monto del pago debe ser mayor a 0');
            }
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Métodos de utilidad
    getEstados(): Array<{ label: string; value: string }> {
        return [
            { label: 'Pendiente', value: 'pendiente' },
            { label: 'Confirmada', value: 'confirmada' },
            { label: 'Cancelada', value: 'cancelada' },
            { label: 'Completada', value: 'completada' }
        ];
    }

    getEstadoColor(estado: string): string {
        switch (estado) {
            case 'pendiente': return '#ffc107';
            case 'confirmada': return '#28a745';
            case 'cancelada': return '#dc3545';
            case 'completada': return '#17a2b8';
            default: return '#6c757d';
        }
    }

    getEstadoLabel(estado: string): string {
        switch (estado) {
            case 'pendiente': return 'Pendiente';
            case 'confirmada': return 'Confirmada';
            case 'cancelada': return 'Cancelada';
            case 'completada': return 'Completada';
            default: return estado;
        }
    }

    getEstadosPago(): Array<{ label: string; value: string }> {
        return [
            { label: 'Pendiente', value: 'pendiente' },
            { label: 'Pagado', value: 'pagado' },
            { label: 'Reembolsado', value: 'reembolsado' }
        ];
    }

    getEstadoPagoColor(estado: string): string {
        switch (estado) {
            case 'pendiente': return '#ffc107';
            case 'pagado': return '#28a745';
            case 'reembolsado': return '#17a2b8';
            default: return '#6c757d';
        }
    }

    getEstadoPagoLabel(estado: string): string {
        switch (estado) {
            case 'pendiente': return 'Pendiente';
            case 'pagado': return 'Pagado';
            case 'reembolsado': return 'Reembolsado';
            default: return estado;
        }
    }

    // Formatear fechas
    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('es-ES');
    }

    formatDateTime(date: string): string {
        return new Date(date).toLocaleString('es-ES');
    }

    // Obtener tipo de inscripción
    getTipoInscripcion(inscripcion: Inscripcion): string {
        if (inscripcion.evento) return 'Evento';
        if (inscripcion.curso) return 'Curso';
        if (inscripcion.programa) return 'Programa';
        return 'Desconocido';
    }

    // Obtener estadísticas de inscripciones
    getEstadisticas(inscripciones: Inscripcion[]) {
        const total = inscripciones.length;
        const pendientes = inscripciones.filter(i => i.estado === 'pendiente').length;
        const confirmadas = inscripciones.filter(i => i.estado === 'confirmada').length;
        const canceladas = inscripciones.filter(i => i.estado === 'cancelada').length;
        const completadas = inscripciones.filter(i => i.estado === 'completada').length;
        
        const pagosPendientes = inscripciones.filter(i => i.pago.estado === 'pendiente').length;
        const pagosPagados = inscripciones.filter(i => i.pago.estado === 'pagado').length;
        
        const ingresosTotales = inscripciones
            .filter(i => i.pago.estado === 'pagado')
            .reduce((sum, i) => sum + i.pago.monto, 0);

        return {
            total,
            pendientes,
            confirmadas,
            canceladas,
            completadas,
            pagosPendientes,
            pagosPagados,
            ingresosTotales,
            porcentajeConfirmadas: total > 0 ? Math.round((confirmadas / total) * 100) : 0,
            porcentajePagadas: total > 0 ? Math.round((pagosPagados / total) * 100) : 0
        };
    }
}

export const inscripcionesService = new InscripcionesService();