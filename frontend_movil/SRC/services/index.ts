// Índice de servicios - exporta todos los servicios de la aplicación

// Servicio de autenticación
export * from './auth';

// Servicios principales
export * from './eventos';
export * from './cabanas';
export * from './cursos';

// Servicios de gestión
export * from './usuarios';
export * from './categorizacion';
export * from './tareas';
export * from './reportes';
export * from './inscripciones';
export * from './solicitudes';

// Servicios existentes
export * from './programas';
export * from './reservas';

// Re-exportar instancias de servicios para uso directo
export { authService } from './auth';
export { eventosService } from './eventos';
export { cabanasService } from './cabanas';
export { cursosService } from './cursos';
export { usuariosService } from './usuarios';
export { categorizacionService } from './categorizacion';
export { tareasService } from './tareas';
export { reportesService } from './reportes';
export { inscripcionesService } from './inscripciones';
export { solicitudesService } from './solicitudes';
export { programasTecnicosService } from './programas';
export { reservasService } from './reservas';
export { userService } from './userService';

// Tipos comunes para servicios
export interface ServiceResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginatedResponse<T = any> {
    success: boolean;
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    message?: string;
    error?: string;
}

export interface ServiceError {
    message: string;
    code?: string;
    status?: number;
}

// Helper para manejo de errores de servicios
export const handleServiceError = (error: any): ServiceResponse => {
    console.error('Service error:', error);
    
    if (error.response) {
        // Error de respuesta HTTP
        return {
            success: false,
            message: error.response.data?.message || 'Error del servidor',
            error: error.response.data?.error
        };
    } else if (error.request) {
        // Error de red
        return {
            success: false,
            message: 'Error de conexión. Verifica tu conexión a internet.',
            error: 'NETWORK_ERROR'
        };
    } else {
        // Error general
        return {
            success: false,
            message: error.message || 'Error inesperado',
            error: 'UNKNOWN_ERROR'
        };
    }
};

// Helper para validar respuestas de servicios
export const validateServiceResponse = <T>(response: any): ServiceResponse<T> => {
    if (!response) {
        return {
            success: false,
            message: 'Respuesta vacía del servidor'
        };
    }

    if (typeof response.success !== 'boolean') {
        return {
            success: false,
            message: 'Formato de respuesta inválido'
        };
    }

    return response;
};

// Configuración común para todos los servicios
export const SERVICE_CONFIG = {
    DEFAULT_TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
};

// Estados comunes
export const COMMON_STATES = {
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
    IDLE: 'idle'
} as const;

export type ServiceState = typeof COMMON_STATES[keyof typeof COMMON_STATES];

// Interface para estado de loading común
export interface LoadingState {
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

// Helper para crear estado inicial de loading
export const createInitialLoadingState = (): LoadingState => ({
    isLoading: false,
    error: null,
    success: false
});

// Helper para actualizar estado de loading
export const updateLoadingState = (
    currentState: LoadingState,
    updates: Partial<LoadingState>
): LoadingState => ({
    ...currentState,
    ...updates
});

// Constantes para roles y permisos
export const USER_ROLES = {
    ADMIN: 'admin',
    TESORERO: 'tesorero',
    SEMINARISTA: 'seminarista',
    EXTERNO: 'externo'
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Constantes para estados comunes
export const ENTITY_STATES = {
    ACTIVE: 'activo',
    INACTIVE: 'inactivo',
    PENDING: 'pendiente',
    COMPLETED: 'completada',
    CANCELLED: 'cancelada'
} as const;

export type EntityState = typeof ENTITY_STATES[keyof typeof ENTITY_STATES];