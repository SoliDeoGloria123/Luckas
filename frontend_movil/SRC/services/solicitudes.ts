// Servicio para manejo de solicitudes

import { authService } from './auth';
import { API_CONFIG } from '../config';

// Tipo Solicitud basado en el modelo del backend
export interface Solicitud {
    _id: string;
    usuario: string; // ObjectId del usuario
    tipo: 'reserva_cabana' | 'inscripcion_evento' | 'inscripcion_curso' | 'inscripcion_programa' | 'otra';
    titulo: string;
    descripcion: string;
    estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'completada';
    prioridad: 'Alta' | 'Media' | 'Baja';
    fechaSolicitud: string;
    fechaRespuesta?: string;
    respuesta?: string;
    documentos?: string[];
    datos?: any; // Datos específicos según el tipo de solicitud
    observaciones?: string;
    revisadoPor?: string; // ObjectId del revisor
    activo: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface SolicitudForm {
    tipo: 'reserva_cabana' | 'inscripcion_evento' | 'inscripcion_curso' | 'inscripcion_programa' | 'otra';
    titulo: string;
    descripcion: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    datos?: any;
    observaciones?: string;
}

export class SolicitudesService {
    
    async getAllSolicitudes(): Promise<{ success: boolean; data?: Solicitud[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.SOLICITUDES, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting solicitudes:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getSolicitudById(id: string): Promise<{ success: boolean; data?: Solicitud; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.SOLICITUDES}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting solicitud:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createSolicitud(solicitudData: SolicitudForm): Promise<{ success: boolean; data?: Solicitud; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.SOLICITUDES, {
                method: 'POST',
                body: JSON.stringify(solicitudData),
            });
        } catch (error) {
            console.error('Error creating solicitud:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateSolicitud(id: string, solicitudData: Partial<SolicitudForm>): Promise<{ success: boolean; data?: Solicitud; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.SOLICITUDES}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(solicitudData),
            });
        } catch (error) {
            console.error('Error updating solicitud:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteSolicitud(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.SOLICITUDES}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting solicitud:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos específicos para solicitudes

    // Obtener solicitudes del usuario actual
    async getMisSolicitudes(): Promise<{ success: boolean; data?: Solicitud[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.SOLICITUDES}/mis-solicitudes`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting mis solicitudes:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener solicitudes por tipo
    async getSolicitudesByTipo(tipo: string): Promise<{ success: boolean; data?: Solicitud[]; message?: string }> {
        try {
            const response = await this.getAllSolicitudes();
            if (response.success && response.data) {
                const filtered = response.data.filter(solicitud => solicitud.tipo === tipo);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting solicitudes by tipo:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener solicitudes por estado
    async getSolicitudesByEstado(estado: string): Promise<{ success: boolean; data?: Solicitud[]; message?: string }> {
        try {
            const response = await this.getAllSolicitudes();
            if (response.success && response.data) {
                const filtered = response.data.filter(solicitud => solicitud.estado === estado);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting solicitudes by estado:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener solicitudes por prioridad
    async getSolicitudesByPrioridad(prioridad: string): Promise<{ success: boolean; data?: Solicitud[]; message?: string }> {
        try {
            const response = await this.getAllSolicitudes();
            if (response.success && response.data) {
                const filtered = response.data.filter(solicitud => solicitud.prioridad === prioridad);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting solicitudes by prioridad:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Cambiar estado de solicitud
    async changeEstadoSolicitud(id: string, estado: 'pendiente' | 'en_revision' | 'aprobada' | 'rechazada' | 'completada', respuesta?: string): Promise<{ success: boolean; data?: Solicitud; message?: string }> {
        try {
            const updateData: any = { estado };
            
            if (estado !== 'pendiente') {
                updateData.fechaRespuesta = new Date().toISOString();
            }
            
            if (respuesta) {
                updateData.respuesta = respuesta;
            }
            
            return await this.updateSolicitud(id, updateData);
        } catch (error) {
            console.error('Error changing solicitud estado:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Asignar revisor
    async asignarRevisor(id: string, revisorId: string): Promise<{ success: boolean; data?: Solicitud; message?: string }> {
        try {
            return await this.updateSolicitud(id, { revisadoPor: revisorId } as any);
        } catch (error) {
            console.error('Error asignando revisor:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Buscar solicitudes
    searchSolicitudes(solicitudes: Solicitud[], searchTerm: string): Solicitud[] {
        if (!searchTerm.trim()) return solicitudes;
        
        const term = searchTerm.toLowerCase();
        return solicitudes.filter(solicitud => 
            solicitud.titulo.toLowerCase().includes(term) ||
            solicitud.descripcion.toLowerCase().includes(term) ||
            solicitud.observaciones?.toLowerCase().includes(term)
        );
    }

    // Filtros combinados
    filterSolicitudes(solicitudes: Solicitud[], filters: {
        estado?: string;
        tipo?: string;
        prioridad?: string;
        usuario?: string;
        fechaInicio?: string;
        fechaFin?: string;
    }): Solicitud[] {
        return solicitudes.filter(solicitud => {
            if (filters.estado && solicitud.estado !== filters.estado) return false;
            if (filters.tipo && solicitud.tipo !== filters.tipo) return false;
            if (filters.prioridad && solicitud.prioridad !== filters.prioridad) return false;
            if (filters.usuario && solicitud.usuario !== filters.usuario) return false;
            
            if (filters.fechaInicio || filters.fechaFin) {
                const fechaSolicitud = new Date(solicitud.fechaSolicitud);
                if (filters.fechaInicio && fechaSolicitud < new Date(filters.fechaInicio)) return false;
                if (filters.fechaFin && fechaSolicitud > new Date(filters.fechaFin)) return false;
            }
            
            return true;
        });
    }

    // Validaciones
    validateSolicitud(solicitud: Partial<SolicitudForm>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!solicitud.titulo || solicitud.titulo.trim().length === 0) {
            errors.push('El título de la solicitud es requerido');
        }

        if (!solicitud.descripcion || solicitud.descripcion.trim().length === 0) {
            errors.push('La descripción de la solicitud es requerida');
        }

        if (!solicitud.tipo) {
            errors.push('El tipo de solicitud es requerido');
        }

        if (!solicitud.prioridad) {
            errors.push('La prioridad es requerida');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Métodos de utilidad
    getTipos(): Array<{ label: string; value: string }> {
        return [
            { label: 'Reserva de Cabaña', value: 'reserva_cabana' },
            { label: 'Inscripción a Evento', value: 'inscripcion_evento' },
            { label: 'Inscripción a Curso', value: 'inscripcion_curso' },
            { label: 'Inscripción a Programa', value: 'inscripcion_programa' },
            { label: 'Otra', value: 'otra' }
        ];
    }

    getTipoColor(tipo: string): string {
        switch (tipo) {
            case 'reserva_cabana': return '#17a2b8';
            case 'inscripcion_evento': return '#28a745';
            case 'inscripcion_curso': return '#fd7e14';
            case 'inscripcion_programa': return '#6f42c1';
            case 'otra': return '#6c757d';
            default: return '#6c757d';
        }
    }

    getTipoLabel(tipo: string): string {
        switch (tipo) {
            case 'reserva_cabana': return 'Reserva de Cabaña';
            case 'inscripcion_evento': return 'Inscripción a Evento';
            case 'inscripcion_curso': return 'Inscripción a Curso';
            case 'inscripcion_programa': return 'Inscripción a Programa';
            case 'otra': return 'Otra';
            default: return tipo;
        }
    }

    getEstados(): Array<{ label: string; value: string }> {
        return [
            { label: 'Pendiente', value: 'pendiente' },
            { label: 'En Revisión', value: 'en_revision' },
            { label: 'Aprobada', value: 'aprobada' },
            { label: 'Rechazada', value: 'rechazada' },
            { label: 'Completada', value: 'completada' }
        ];
    }

    getEstadoColor(estado: string): string {
        switch (estado) {
            case 'pendiente': return '#ffc107';
            case 'en_revision': return '#17a2b8';
            case 'aprobada': return '#28a745';
            case 'rechazada': return '#dc3545';
            case 'completada': return '#6f42c1';
            default: return '#6c757d';
        }
    }

    getEstadoLabel(estado: string): string {
        switch (estado) {
            case 'pendiente': return 'Pendiente';
            case 'en_revision': return 'En Revisión';
            case 'aprobada': return 'Aprobada';
            case 'rechazada': return 'Rechazada';
            case 'completada': return 'Completada';
            default: return estado;
        }
    }

    getPrioridades(): Array<{ label: string; value: string }> {
        return [
            { label: 'Alta', value: 'Alta' },
            { label: 'Media', value: 'Media' },
            { label: 'Baja', value: 'Baja' }
        ];
    }

    getPrioridadColor(prioridad: string): string {
        switch (prioridad) {
            case 'Alta': return '#dc3545';
            case 'Media': return '#ffc107';
            case 'Baja': return '#28a745';
            default: return '#6c757d';
        }
    }

    // Formatear fechas
    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('es-ES');
    }

    formatDateTime(date: string): string {
        return new Date(date).toLocaleString('es-ES');
    }

    // Verificar si una solicitud está vencida (más de 30 días sin respuesta)
    isOverdue(solicitud: Solicitud): boolean {
        if (solicitud.estado !== 'pendiente' && solicitud.estado !== 'en_revision') {
            return false;
        }
        const fechaLimite = new Date(solicitud.fechaSolicitud);
        fechaLimite.setDate(fechaLimite.getDate() + 30);
        return new Date() > fechaLimite;
    }

    // Obtener estadísticas de solicitudes
    getEstadisticas(solicitudes: Solicitud[]) {
        const total = solicitudes.length;
        const pendientes = solicitudes.filter(s => s.estado === 'pendiente').length;
        const enRevision = solicitudes.filter(s => s.estado === 'en_revision').length;
        const aprobadas = solicitudes.filter(s => s.estado === 'aprobada').length;
        const rechazadas = solicitudes.filter(s => s.estado === 'rechazada').length;
        const completadas = solicitudes.filter(s => s.estado === 'completada').length;
        const vencidas = solicitudes.filter(s => this.isOverdue(s)).length;

        const tipoStats = solicitudes.reduce((acc, solicitud) => {
            acc[solicitud.tipo] = (acc[solicitud.tipo] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            pendientes,
            enRevision,
            aprobadas,
            rechazadas,
            completadas,
            vencidas,
            porTipo: tipoStats,
            porcentajeAprobadas: total > 0 ? Math.round((aprobadas / total) * 100) : 0,
            porcentajeCompletadas: total > 0 ? Math.round((completadas / total) * 100) : 0,
            tiempoPromedioRespuesta: this.calculateAverageResponseTime(solicitudes)
        };
    }

    // Calcular tiempo promedio de respuesta
    private calculateAverageResponseTime(solicitudes: Solicitud[]): number {
        const respondidas = solicitudes.filter(s => s.fechaRespuesta);
        if (respondidas.length === 0) return 0;

        const tiempos = respondidas.map(s => {
            const inicio = new Date(s.fechaSolicitud);
            const fin = new Date(s.fechaRespuesta!);
            return fin.getTime() - inicio.getTime();
        });

        const promedioMs = tiempos.reduce((sum, tiempo) => sum + tiempo, 0) / tiempos.length;
        return Math.round(promedioMs / (1000 * 60 * 60 * 24)); // Convertir a días
    }
}

export const solicitudesService = new SolicitudesService();