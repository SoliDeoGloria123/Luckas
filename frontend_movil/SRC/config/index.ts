// Configuración de la aplicación móvil

// Declaración para __DEV__ en TypeScript
declare const __DEV__: boolean;

// Configuración de la API
export const API_CONFIG = {
    // Configura aquí la URL de tu backend
    // Para desarrollo local con emulador: 'http://10.0.2.2:3000'
    // Para desarrollo local con dispositivo físico: 'http://TU_IP_LOCAL:3000'
    // Para producción: 'https://tu-dominio.com'
   // BASE_URL: (typeof __DEV__ !== 'undefined' && __DEV__) ? 'http://10.0.2.2:3000' : 'https://tu-dominio.com',
    BASE_URL: 'http://192.168.80.22:3000',
    
    ENDPOINTS: {
        // Auth endpoints
        LOGIN: '/api/auth/signin',
        REGISTER: '/api/auth/signup',
        VERIFY_TOKEN: '/api/auth/verify-token',
        REFRESH_TOKEN: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        PROFILE: '/api/auth/profile',
        
        // User endpoints
        USERS: '/api/users',
        UPDATE_USER: '/api/users',
        DELETE_USER: '/api/users',
        
        // Otros endpoints que tengas en tu backend
        CURSOS: '/api/cursos',
        EVENTOS: '/api/eventos',
        PROGRAMAS: '/api/programas-academicos',
        RESERVAS: '/api/reservas',
        CABANAS: '/api/cabanas',
        REPORTES: '/api/reportes',
        SOLICITUDES: '/api/solicitudes',
        TAREAS: '/api/tareas',
        INSCRIPCIONES: '/api/inscripciones',
        CATEGORIZACION: '/api/categorizacion'
    },
    
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3
};

// Configuración de almacenamiento
export const STORAGE_KEYS = {
    TOKEN: 'auth_token',
    USER_DATA: 'user_data',
    REMEMBER_USER: 'remember_user',
    THEME: 'app_theme',
    LANGUAGE: 'app_language'
} as const;

// Configuración de la aplicación
export const APP_CONFIG = {
    NAME: 'Sistema Seminario',
    VERSION: '1.0.0',
    THEME: {
        PRIMARY_COLOR: '#007bff',
        SECONDARY_COLOR: '#6c757d',
        SUCCESS_COLOR: '#28a745',
        DANGER_COLOR: '#dc3545',
        WARNING_COLOR: '#ffc107',
        INFO_COLOR: '#17a2b8'
    }
};

// Roles y permisos
export const ROLES = {
    ADMIN: 'admin',
    TESORERO: 'tesorero',
    SEMINARISTA: 'seminarista',
    EXTERNO: 'externo'
} as const;

// Configuración de validación
export const VALIDATION_RULES = {
    PASSWORD_MIN_LENGTH: 6,
    PHONE_MIN_LENGTH: 7,
    PHONE_MAX_LENGTH: 15,
    NAME_MIN_LENGTH: 2,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE_REGEX: /^[0-9]{7,15}$/
};

// Mensajes de la aplicación
export const MESSAGES = {
    ERRORS: {
        NETWORK: 'Error de conexión. Verifica tu internet.',
        TIMEOUT: 'La petición ha tardado demasiado.',
        UNAUTHORIZED: 'No tienes permisos para esta acción.',
        VALIDATION: 'Por favor verifica los datos ingresados.',
        GENERIC: 'Ha ocurrido un error inesperado.'
    },
    SUCCESS: {
        LOGIN: 'Bienvenido al sistema.',
        LOGOUT: 'Sesión cerrada correctamente.',
        REGISTER: 'Usuario registrado exitosamente.',
        UPDATE: 'Datos actualizados correctamente.',
        DELETE: 'Elemento eliminado correctamente.'
    }
};

// Función para obtener la URL base según el entorno
export const getApiBaseUrl = (): string => {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
        // En desarrollo, puedes cambiar esto según tu configuración
        // return 'http://10.0.2.2:3000/api'; // Para emulador Android
        return 'http://192.168.80.22:3000/api'; // Para dispositivo físico (cambiar IP)
    }
    return 'https://tu-dominio.com/api'; // Para producción
};

export default {
    API_CONFIG,
    STORAGE_KEYS,
    APP_CONFIG,
    ROLES,
    VALIDATION_RULES,
    MESSAGES,
    getApiBaseUrl
};