// Servicio para manejo de usuarios

import { authService } from './auth';
import { User, SignupData } from '../types';
import { API_CONFIG } from '../config';

export class UsuariosService {
    
    async getAllUsers(): Promise<{ success: boolean; data?: User[]; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.USERS, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting users:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async getUserById(id: string): Promise<{ success: boolean; data?: User; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
                method: 'GET',
            });
        } catch (error) {
            console.error('Error getting user:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async createUser(userData: SignupData): Promise<{ success: boolean; data?: User; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(API_CONFIG.ENDPOINTS.USERS, {
                method: 'POST',
                body: JSON.stringify(userData),
            });
        } catch (error) {
            console.error('Error creating user:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async updateUser(id: string, userData: Partial<User>): Promise<{ success: boolean; data?: User; message?: string }> {
        try {
            // Si el usuario edita su propio perfil, usar /profile/update
            const currentUser = authService.getUser();
            const isOwnProfile = currentUser?._id === id;
            const endpoint = isOwnProfile
                ? '/api/users/profile/update'
                : `${API_CONFIG.ENDPOINTS.USERS}/${id}`;
            return await authService.makeAuthenticatedRequest(endpoint, {
                method: 'PUT',
                body: JSON.stringify(userData),
            });
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    async deleteUser(id: string): Promise<{ success: boolean; message?: string }> {
        try {
            return await authService.makeAuthenticatedRequest(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            console.error('Error deleting user:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Métodos específicos para gestión de usuarios

    // Filtrar usuarios por rol
    async getUsersByRole(role: string): Promise<{ success: boolean; data?: User[]; message?: string }> {
        try {
            const response = await this.getAllUsers();
            if (response.success && response.data) {
                const filtered = response.data.filter(user => user.role === role);
                return { success: true, data: filtered };
            }
            return response;
        } catch (error) {
            console.error('Error filtering users by role:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Solo usuarios activos
    async getActiveUsers(): Promise<{ success: boolean; data?: User[]; message?: string }> {
        try {
            const response = await this.getAllUsers();
            if (response.success && response.data) {
                const activos = response.data.filter(user => user.estado === 'activo');
                return { success: true, data: activos };
            }
            return response;
        } catch (error) {
            console.error('Error getting active users:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Cambiar estado de usuario
    async changeUserStatus(id: string, estado: 'activo' | 'inactivo'): Promise<{ success: boolean; data?: User; message?: string }> {
        try {
            return await this.updateUser(id, { estado });
        } catch (error) {
            console.error('Error changing user status:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Cambiar rol de usuario
    async changeUserRole(id: string, role: 'admin' | 'tesorero' | 'seminarista' | 'externo'): Promise<{ success: boolean; data?: User; message?: string }> {
        try {
            return await this.updateUser(id, { role });
        } catch (error) {
            console.error('Error changing user role:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Buscar usuarios por término
    searchUsers(users: User[], searchTerm: string): User[] {
        if (!searchTerm.trim()) return users;
        
        const term = searchTerm.toLowerCase();
        return users.filter(user => 
            user.nombre.toLowerCase().includes(term) ||
            user.apellido.toLowerCase().includes(term) ||
            user.correo.toLowerCase().includes(term) ||
            user.numeroDocumento.includes(term)
        );
    }

    // Validaciones
    validateUser(userData: Partial<SignupData>): { valid: boolean; errors: string[] } {
        const errors: string[] = [];

        if (!userData.nombre || userData.nombre.trim().length === 0) {
            errors.push('El nombre es requerido');
        }

        if (!userData.apellido || userData.apellido.trim().length === 0) {
            errors.push('El apellido es requerido');
        }

        if (!userData.correo || userData.correo.trim().length === 0) {
            errors.push('El correo es requerido');
        } else if (!this.isValidEmail(userData.correo)) {
            errors.push('El correo no tiene un formato válido');
        }

        if (!userData.telefono || userData.telefono.trim().length === 0) {
            errors.push('El teléfono es requerido');
        }

        if (!userData.tipoDocumento) {
            errors.push('El tipo de documento es requerido');
        }

        if (!userData.numeroDocumento || userData.numeroDocumento.trim().length === 0) {
            errors.push('El número de documento es requerido');
        }

        if (!userData.password || userData.password.length < 6) {
            errors.push('La contraseña debe tener al menos 6 caracteres');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }

    // Validar email
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Métodos de utilidad
    getFullName(user: User): string {
        return `${user.nombre} ${user.apellido}`;
    }

    getRoles(): Array<{ label: string; value: string }> {
        return [
            { label: 'Administrador', value: 'admin' },
            { label: 'Tesorero', value: 'tesorero' },
            { label: 'Seminarista', value: 'seminarista' },
            { label: 'Externo', value: 'externo' }
        ];
    }

    getRoleColor(role: string): string {
        switch (role) {
            case 'admin': return '#dc3545';
            case 'tesorero': return '#fd7e14';
            case 'seminarista': return '#198754';
            case 'externo': return '#0d6efd';
            default: return '#6c757d';
        }
    }

    getRoleLabel(role: string): string {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'tesorero': return 'Tesorero';
            case 'seminarista': return 'Seminarista';
            case 'externo': return 'Externo';
            default: return role;
        }
    }

    getEstados(): Array<{ label: string; value: string }> {
        return [
            { label: 'Activo', value: 'activo' },
            { label: 'Inactivo', value: 'inactivo' }
        ];
    }

    getEstadoColor(estado: string): string {
        return estado === 'activo' ? '#28a745' : '#dc3545';
    }

    getTiposDocumento(): Array<{ label: string; value: string }> {
        return [
            { label: 'Cédula de ciudadanía', value: 'Cédula de ciudadanía' },
            { label: 'Cédula de extranjería', value: 'Cédula de extranjería' },
            { label: 'Pasaporte', value: 'Pasaporte' },
            { label: 'Tarjeta de identidad', value: 'Tarjeta de identidad' }
        ];
    }
}

// Exportar la instancia del servicio
export const usuariosService = new UsuariosService();

// Exportar tipos adicionales para evitar errores de módulo
export type { User, SignupData } from '../types';

// Re-exportar funciones útiles
export const createUsuarioValidator = (userData: Partial<SignupData>) => {
    return new UsuariosService().validateUser(userData);
};

export const searchUsuarios = (users: User[], term: string) => {
    return new UsuariosService().searchUsers(users, term);
};