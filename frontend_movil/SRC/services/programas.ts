// Servicio para gestión de programas técnicos

import { API_CONFIG } from '../config';
import { ProgramaTecnico, ApiResponse } from '../types';
import { authService } from './auth';

interface ProgramaTecnicoForm {
    nombre: string;
    descripcion: string;
    area: 'tecnologia' | 'administracion' | 'oficios' | 'arte_diseno' | 'salud' | 'otros';
    nivel: 'tecnico_laboral' | 'tecnico_profesional' | 'especializacion_tecnica';
    duracion: {
        meses: number;
        horas: number;
    };
    modalidad: 'presencial' | 'virtual' | 'semipresencial';
    coordinador: string;
    fechaInicio: string;
    fechaFin: string;
    cuposTotales: number;
    costoInscripcion: number;
    costoMensualidad: number;
    certificacion: string;
    requisitos: string[];
    objetivos: string[];
    competencias: string[];
}

class ProgramasService {
    private baseUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PROGRAMAS}`;

    // Realizar petición HTTP con autenticación
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const token = authService.getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string>)
            };

            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
                headers['x-access-token'] = token;
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Error en la petición',
                    error: data.error
                };
            }

            return data;
        } catch (error) {
            console.error('Programas técnicos service error:', error);
            return {
                success: false,
                message: 'Error de conexión',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Obtener todos los programas técnicos
    async getAllProgramas(): Promise<ApiResponse<ProgramaTecnico[]>> {
        return this.makeRequest<ProgramaTecnico[]>('');
    }

    // Obtener programa por ID
    async getProgramaById(id: string): Promise<ApiResponse<ProgramaTecnico>> {
        return this.makeRequest<ProgramaTecnico>(`/${id}`);
    }

    // Crear nuevo programa
    async createPrograma(programaData: ProgramaTecnicoForm): Promise<ApiResponse<ProgramaTecnico>> {
        return this.makeRequest<ProgramaTecnico>('', {
            method: 'POST',
            body: JSON.stringify(programaData)
        });
    }

    // Actualizar programa
    async updatePrograma(id: string, programaData: Partial<ProgramaTecnicoForm>): Promise<ApiResponse<ProgramaTecnico>> {
        return this.makeRequest<ProgramaTecnico>(`/${id}`, {
            method: 'PUT',
            body: JSON.stringify(programaData)
        });
    }

    // Eliminar programa
    async deletePrograma(id: string): Promise<ApiResponse<void>> {
        return this.makeRequest<void>(`/${id}`, {
            method: 'DELETE'
        });
    }

    // Obtener programas por área
    async getProgramasByArea(area: string): Promise<ApiResponse<ProgramaTecnico[]>> {
        return this.makeRequest<ProgramaTecnico[]>(`/area/${area}`);
    }

    // Obtener programas por nivel
    async getProgramasByNivel(nivel: string): Promise<ApiResponse<ProgramaTecnico[]>> {
        return this.makeRequest<ProgramaTecnico[]>(`/nivel/${nivel}`);
    }

    // Obtener programas por modalidad
    async getProgramasByModalidad(modalidad: string): Promise<ApiResponse<ProgramaTecnico[]>> {
        return this.makeRequest<ProgramaTecnico[]>(`/modalidad/${modalidad}`);
    }

    // Obtener programas con inscripciones abiertas
    async getProgramasConInscripcionesAbiertas(): Promise<ApiResponse<ProgramaTecnico[]>> {
        return this.makeRequest<ProgramaTecnico[]>('/inscripciones-abiertas');
    }

    // Buscar programas por nombre
    async searchProgramas(query: string): Promise<ApiResponse<ProgramaTecnico[]>> {
        return this.makeRequest<ProgramaTecnico[]>(`/buscar?q=${encodeURIComponent(query)}`);
    }

    // Inscribirse a un programa
    async inscribirsePrograma(programaId: string): Promise<ApiResponse<any>> {
        return this.makeRequest<any>(`/${programaId}/inscribir`, {
            method: 'POST'
        });
    }

    // Obtener inscripciones del usuario
    async getMisInscripciones(): Promise<ApiResponse<any[]>> {
        return this.makeRequest<any[]>('/mis-inscripciones');
    }
}

export const programasService = new ProgramasService();
