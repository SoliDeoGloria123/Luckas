import { API_URL } from '../config/env';
import { User } from '../types';
import { authService } from './auth';

export const userService = {
    getAllUsers: async () => {
        try {
            const token = authService.getToken();
            if (!token) {
                return {
                    success: false,
                    message: 'No hay sesión activa'
                };
            }
            const response = await fetch(`${API_URL}/api/users`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                return {
                    success: false,
                    message: data.message || 'Error al obtener usuarios'
                };
            }
            return {
                success: true,
                data: Array.isArray(data.data) ? data.data : []
            };
        } catch (error) {
            console.error('Error fetching users:', error);
            return {
                success: false,
                message: 'Error al obtener usuarios'
            };
        }
    },

    updateUser: async (userId: string, userData: Partial<User>) => {
        try {
            const token = authService.getToken();
            if (!token) {
                return {
                    success: false,
                    message: 'No hay sesión activa'
                };
            }
            const response = await fetch(`${API_URL}/api/users/profile/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            if (!response.ok) {
                return {
                    success: false,
                    message: data.message || 'Error al actualizar el perfil'
                };
            }
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error updating user:', error);
            return {
                success: false,
                message: 'Error al actualizar usuario'
            };
        }
    },

    getUserProfile: async (userId: string) => {
        try {
            const response = await fetch(`${API_URL}/api/users/${userId}/profile`);
            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error getting user profile:', error);
            return {
                success: false,
                message: 'Error al obtener perfil'
            };
        }
    },
};

