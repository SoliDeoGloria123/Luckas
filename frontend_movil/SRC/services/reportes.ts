// Servicio para manejo de reportes

import { authService } from './auth';
import { Reporte } from '../types';
import { API_CONFIG } from '../config';

export interface ReporteForm {
    titulo: string;
    tipo: string;
    datos: any;
    filtros?: any;
}

export interface FiltrosReporte {
    fechaInicio?: string;
    fechaFin?: string;
    tipo?: string;
    generadoPor?: string;
}

export class ReportesService {
    
    async getAllReportes(): Promise<{ success: boolean; data?: Reporte[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.REPORTES, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting reportes:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getReporteById(id: string): Promise<{ success: boolean; data?: Reporte; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.REPORTES}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting reporte:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createReporte(reporteData: ReporteForm): Promise<{ success: boolean; data?: Reporte; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.REPORTES, {
                method: 'POST',
                body: JSON.stringify(reporteData),
            });
        } catch (error) {
            console.error('Error creating reporte:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateReporte(id: string, reporteData: Partial<ReporteForm>): Promise<{ success: boolean; data?: Reporte; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.REPORTES}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(reporteData),
            });
        } catch (error) {
            console.error('Error updating reporte:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteReporte(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.REPORTES}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting reporte:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos específicos para reportes

    // Obtener reportes por tipo
    async getReportesByTipo(tipo: string): Promise<{ success: boolean; data?: Reporte[]; message?: string }> {
        try {
            const response = await this.getAllReportes();
            if (response.success && response.data) {
                const filtered = response.data.filter(reporte => reporte.tipo === tipo);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting reportes by tipo:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener reportes por generador
    async getReportesByGenerador(generadoPor: string): Promise<{ success: boolean; data?: Reporte[]; message?: string }> {
        try {
            const response = await this.getAllReportes();
            if (response.success && response.data) {
                const filtered = response.data.filter(reporte => reporte.generadoPor === generadoPor);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting reportes by generador:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener reportes por rango de fechas
    async getReportesByFechas(fechaInicio: string, fechaFin: string): Promise<{ success: boolean; data?: Reporte[]; message?: string }> {
        try {
            const response = await this.getAllReportes();
            if (response.success && response.data) {
                const filtered = response.data.filter(reporte => {
                    const fechaReporte = new Date(reporte.fechaGeneracion);
                    const inicio = new Date(fechaInicio);
                    const fin = new Date(fechaFin);
                    return fechaReporte >= inicio && fechaReporte <= fin;
                });
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting reportes by fechas:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Buscar reportes
    searchReportes(reportes: Reporte[], searchTerm: string): Reporte[] {
        if (!searchTerm.trim()) return reportes;
        
        const term = searchTerm.toLowerCase();
        return reportes.filter(reporte => 
            reporte.titulo.toLowerCase().includes(term) ||
            reporte.tipo.toLowerCase().includes(term)
        );
    }

    // Filtros combinados
    filterReportes(reportes: Reporte[], filters: FiltrosReporte): Reporte[] {
        return reportes.filter(reporte => {
            if (filters.tipo && reporte.tipo !== filters.tipo) return false;
            if (filters.generadoPor && reporte.generadoPor !== filters.generadoPor) return false;
            
            if (filters.fechaInicio || filters.fechaFin) {
                const fechaReporte = new Date(reporte.fechaGeneracion);
                if (filters.fechaInicio && fechaReporte < new Date(filters.fechaInicio)) return false;
                if (filters.fechaFin && fechaReporte > new Date(filters.fechaFin)) return false;
            }
            
            return true;
        });
    }

    // Validaciones
    validateReporte(reporte: Partial<ReporteForm>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!reporte.titulo || reporte.titulo.trim().length === 0) {
            errors.push('El título del reporte es requerido');
        }

        if (!reporte.tipo || reporte.tipo.trim().length === 0) {
            errors.push('El tipo de reporte es requerido');
        }

        if (!reporte.datos) {
            errors.push('Los datos del reporte son requeridos');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Métodos de utilidad
    getTiposReporte(): Array<{ label: string; value: string }> {
        return [
            { label: 'Eventos', value: 'eventos' },
            { label: 'Cabañas', value: 'cabanas' },
            { label: 'Cursos', value: 'cursos' },
            { label: 'Usuarios', value: 'usuarios' },
            { label: 'Reservas', value: 'reservas' },
            { label: 'Inscripciones', value: 'inscripciones' },
            { label: 'Financiero', value: 'financiero' },
            { label: 'General', value: 'general' }
        ];
    }

    getTipoColor(tipo: string): string {
        switch (tipo) {
            case 'eventos': return '#28a745';
            case 'cabanas': return '#17a2b8';
            case 'cursos': return '#fd7e14';
            case 'usuarios': return '#6f42c1';
            case 'reservas': return '#20c997';
            case 'inscripciones': return '#0d6efd';
            case 'financiero': return '#dc3545';
            default: return '#6c757d';
        }
    }

    getTipoLabel(tipo: string): string {
        switch (tipo) {
            case 'eventos': return 'Eventos';
            case 'cabanas': return 'Cabañas';
            case 'cursos': return 'Cursos';
            case 'usuarios': return 'Usuarios';
            case 'reservas': return 'Reservas';
            case 'inscripciones': return 'Inscripciones';
            case 'financiero': return 'Financiero';
            case 'general': return 'General';
            default: return tipo;
        }
    }

    // Formatear fechas
    formatDate(date: string): string {
        return new Date(date).toLocaleDateString('es-ES');
    }

    formatDateTime(date: string): string {
        return new Date(date).toLocaleString('es-ES');
    }

    // Generar datos de ejemplo para diferentes tipos de reporte
    generateSampleData(tipo: string): any {
        switch (tipo) {
            case 'eventos':
                return {
                    totalEventos: 0,
                    eventosPorCategoria: {},
                    asistenciaPorEvento: {},
                    ingresosPorEvento: {}
                };
            case 'cabanas':
                return {
                    totalCabanas: 0,
                    cabanasPorEstado: {},
                    ocupacionPorMes: {},
                    ingresosPorCabana: {}
                };
            case 'cursos':
                return {
                    totalCursos: 0,
                    cursosPorEstado: {},
                    inscripcionesPorCurso: {},
                    ingresosPorCurso: {}
                };
            case 'usuarios':
                return {
                    totalUsuarios: 0,
                    usuariosPorRole: {},
                    usuariosPorEstado: {},
                    registrosPorMes: {}
                };
            case 'financiero':
                return {
                    ingresosTotales: 0,
                    ingresosPorCategoria: {},
                    ingresosPorMes: {},
                    gastosTotales: 0
                };
            default:
                return {};
        }
    }

    // Exportar reporte (simulado - en una app real iría a un endpoint específico)
    async exportReporte(reporte: Reporte, formato: 'pdf' | 'excel' | 'csv'): Promise<{ success: boolean; message?: string; url?: string }> {
        try {
            // Aquí iría la lógica para exportar el reporte
            // Por ahora simulamos una respuesta exitosa
            return {
                success: true,
                message: `Reporte exportado como ${formato}`,
                url: `export/${reporte._id}.${formato}`
            };
        } catch (error) {
            console.error('Error exporting reporte:', error);
            return { success: false, message: 'Error al exportar el reporte' };
        }
    }

    // Programar reporte automático (simulado)
    async scheduleReporte(reporteConfig: {
        titulo: string;
        tipo: string;
        frecuencia: 'diario' | 'semanal' | 'mensual';
        filtros?: any;
    }): Promise<{ success: boolean; message?: string; scheduleId?: string }> {
        try {
            // Aquí iría la lógica para programar reportes automáticos
            return {
                success: true,
                message: 'Reporte programado exitosamente',
                scheduleId: `schedule_${Date.now()}`
            };
        } catch (error) {
            console.error('Error scheduling reporte:', error);
            return { success: false, message: 'Error al programar el reporte' };
        }
    }

    // Obtener estadísticas de reportes
    getEstadisticas(reportes: Reporte[]) {
        const total = reportes.length;
        const tipoStats = reportes.reduce((acc, reporte) => {
            acc[reporte.tipo] = (acc[reporte.tipo] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const fechaStats = reportes.reduce((acc, reporte) => {
            const mes = new Date(reporte.fechaGeneracion).toISOString().slice(0, 7);
            acc[mes] = (acc[mes] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            total,
            porTipo: tipoStats,
            porMes: fechaStats,
            tipoMasComun: Object.keys(tipoStats).reduce((a, b) => tipoStats[a] > tipoStats[b] ? a : b, '')
        };
    }
}

export const reportesService = new ReportesService();