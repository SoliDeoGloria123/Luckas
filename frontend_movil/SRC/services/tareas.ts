// Servicio para manejo de tareas

import { authService } from './auth';
import { API_CONFIG } from '../config';

// Tipo Tarea basado en el modelo del backend
export interface Tarea {
    _id: string;
    titulo: string;
    descripcion: string;
    fechaLimite: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada';
    asignadoA: string; // ObjectId del usuario
    creadoPor: string; // ObjectId del usuario
    categoria?: string;
    etiquetas: string[];
    observaciones?: string;
    fechaCompletada?: string;
    createdAt: string;
    updatedAt: string;
}

export interface TareaForm {
    titulo: string;
    descripcion: string;
    fechaLimite: string;
    prioridad: 'Alta' | 'Media' | 'Baja';
    asignadoA: string;
    categoria?: string;
    etiquetas: string[];
    observaciones?: string;
}

export class TareasService {
    
    async getAllTareas(): Promise<{ success: boolean; data?: Tarea[]; message?: string }> {
        try {
            const response = await authService.makeRequest<any>(API_CONFIG.ENDPOINTS.TAREAS, {
                method: 'GET',
            });
            if (response.success) {
                // Navegar a través de la estructura anidada
                const responseData = response.data?.data || response.data || [];
                const tareas = Array.isArray(responseData) ? responseData : [];
            
                return {
                    success: true,
                    data: tareas
                };
            }

            console.log('❌ Error al obtener tareas:', response.message);
            return { 
                success: false, 
                message: response.message || 'Error al obtener tareas',
                data: []
            };
        } catch (error) {
            console.error('Error getting tareas:', error);
            return { success: false, message: 'Error de conexión', data: [] };
        }
    }

    async getTareaById(id: string): Promise<{ success: boolean; data?: Tarea; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.TAREAS}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting tarea:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createTarea(tareaData: TareaForm): Promise<{ success: boolean; data?: Tarea; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.TAREAS, {
                method: 'POST',
                body: JSON.stringify(tareaData),
            });
        } catch (error) {
            console.error('Error creating tarea:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateTarea(id: string, tareaData: Partial<TareaForm>): Promise<{ success: boolean; data?: Tarea; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.TAREAS}/${id}`, {
                method: 'PUT',
                body: JSON.stringify(tareaData),
            });
        } catch (error) {
            console.error('Error updating tarea:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteTarea(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.TAREAS}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting tarea:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos específicos para tareas

    // Obtener tareas asignadas a un usuario
    async getTareasByUsuario(usuarioId: string): Promise<{ success: boolean; data?: Tarea[]; message?: string }> {
        try {
            console.log('🔄 Obteniendo tareas del usuario:', usuarioId);
            if (!usuarioId) {
                console.error('getTareasByUsuario: ID de usuario no proporcionado');
                return { success: false, message: 'ID de usuario no proporcionado' };
            }
            
            console.log('getTareasByUsuario - ID:', usuarioId);
            const url = `${API_CONFIG.ENDPOINTS.TAREAS}/usuario/${usuarioId}`;
            console.log('getTareasByUsuario - URL:', url);
            
            return await authService.makeAuthenticatedRequest(url, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting tareas by usuario:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener tareas por estado
    async getTareasByEstado(estado: string): Promise<{ success: boolean; data?: Tarea[]; message?: string }> {
        try {
            const response = await this.getAllTareas();
            if (response.success && response.data) {
                const filtered = response.data.filter(tarea => tarea.estado === estado);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting tareas by estado:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Obtener tareas por prioridad
    async getTareasByPrioridad(prioridad: string): Promise<{ success: boolean; data?: Tarea[]; message?: string }> {
        try {
            const response = await this.getAllTareas();
            if (response.success && response.data) {
                const filtered = response.data.filter(tarea => tarea.prioridad === prioridad);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error getting tareas by prioridad:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Cambiar estado de tarea
    async changeEstadoTarea(id: string, estado: 'pendiente' | 'en_progreso' | 'completada' | 'cancelada'): Promise<{ success: boolean; data?: Tarea; message?: string }> {
        try {
            const updateData: any = { estado };
            if (estado === 'completada') {
                updateData.fechaCompletada = new Date().toISOString();
            }
            return await this.updateTarea(id, updateData);
        } catch (error) {
            console.error('Error changing tarea estado:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Buscar tareas
    searchTareas(tareas: Tarea[], searchTerm: string): Tarea[] {
        if (!searchTerm.trim()) return tareas;
        
        const term = searchTerm.toLowerCase();
        return tareas.filter(tarea => 
            tarea.titulo.toLowerCase().includes(term) ||
            tarea.descripcion.toLowerCase().includes(term) ||
            tarea.etiquetas.some(etiqueta => etiqueta.toLowerCase().includes(term))
        );
    }

    // Filtros combinados
    filterTareas(tareas: Tarea[], filters: {
        estado?: string;
        prioridad?: string;
        asignadoA?: string;
        categoria?: string;
    }): Tarea[] {
        return tareas.filter(tarea => {
            if (filters.estado && tarea.estado !== filters.estado) return false;
            if (filters.prioridad && tarea.prioridad !== filters.prioridad) return false;
            if (filters.asignadoA && tarea.asignadoA !== filters.asignadoA) return false;
            if (filters.categoria && tarea.categoria !== filters.categoria) return false;
            return true;
        });
    }

    // Validaciones
    validateTarea(tarea: Partial<TareaForm>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!tarea.titulo || tarea.titulo.trim().length === 0) {
            errors.push('El título de la tarea es requerido');
        }

        if (!tarea.descripcion || tarea.descripcion.trim().length === 0) {
            errors.push('La descripción de la tarea es requerida');
        }

        if (tarea.fechaLimite) {
            const fechaLimite = new Date(tarea.fechaLimite);
            if (fechaLimite < new Date()) {
                errors.push('La fecha límite debe ser posterior a la fecha actual');
            }
        } else {
            errors.push('La fecha límite es requerida');
        }

        if (!tarea.prioridad) {
            errors.push('La prioridad es requerida');
        }

        if (!tarea.asignadoA) {
            errors.push('Debe asignar la tarea a un usuario');
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
            { label: 'En Progreso', value: 'en_progreso' },
            { label: 'Completada', value: 'completada' },
            { label: 'Cancelada', value: 'cancelada' }
        ];
    }

    getEstadoColor(estado: string): string {
        switch (estado) {
            case 'pendiente': return '#ffc107';
            case 'en_progreso': return '#17a2b8';
            case 'completada': return '#28a745';
            case 'cancelada': return '#dc3545';
            default: return '#6c757d';
        }
    }

    getEstadoLabel(estado: string): string {
        switch (estado) {
            case 'pendiente': return 'Pendiente';
            case 'en_progreso': return 'En Progreso';
            case 'completada': return 'Completada';
            case 'cancelada': return 'Cancelada';
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

    // Verificar si una tarea está vencida
    isOverdue(tarea: Tarea): boolean {
        if (tarea.estado === 'completada' || tarea.estado === 'cancelada') {
            return false;
        }
        return new Date(tarea.fechaLimite) < new Date();
    }

    // Obtener estadísticas de tareas
    getEstadisticas(tareas: Tarea[]) {
        const total = tareas.length;
        const pendientes = tareas.filter(t => t.estado === 'pendiente').length;
        const enProgreso = tareas.filter(t => t.estado === 'en_progreso').length;
        const completadas = tareas.filter(t => t.estado === 'completada').length;
        const canceladas = tareas.filter(t => t.estado === 'cancelada').length;
        const vencidas = tareas.filter(t => this.isOverdue(t)).length;

        return {
            total,
            pendientes,
            enProgreso,
            completadas,
            canceladas,
            vencidas,
            porcentajeCompletadas: total > 0 ? Math.round((completadas / total) * 100) : 0
        };
    }
}

export const tareasService = new TareasService();