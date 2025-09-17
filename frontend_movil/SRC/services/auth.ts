// Servicio de autenticación para conectar con el backend

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, LoginCredentials, LoginResponse, SignupData, ApiResponse } from '../types';
import { API_CONFIG, STORAGE_KEYS } from '../config';

class AuthService {
    private token: string | null = null;
    private user: User | null = null;

    constructor() {
        this.loadStoredData();
    }

    // Cargar datos almacenados al inicializar
    private async loadStoredData(): Promise<void> {
        try {
            const storedToken = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
            const storedUser = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
            
            if (storedToken) {
                this.token = storedToken;
            }
            
            if (storedUser) {
                this.user = JSON.parse(storedUser);
            }
        } catch (error) {
            console.error('Error loading stored auth data:', error);
        }
    }

    // Realizar petición HTTP con manejo de errores
    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<ApiResponse<T>> {
        try {
            const url = `${API_CONFIG.BASE_URL}${endpoint}`;
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(options.headers as Record<string, string>)
            };

            // Agregar token si existe
            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
                headers['x-access-token'] = this.token;
            }

            const response = await fetch(url, {
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
            console.error('Request error:', error);
            return {
                success: false,
                message: 'Error de conexión',
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    // Login del usuario
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await this.makeRequest<{
                user: User;
                token: string;
            }>(API_CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });

            if (response.success && response.data) {
                this.token = response.data.token;
                this.user = response.data.user;

                // Guardar en AsyncStorage
                await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, this.token);
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));

                return {
                    success: true,
                    message: response.message,
                    data: {
                        user: this.user,
                        token: this.token,
                        expiresIn: 86400 // 24 horas por defecto
                    }
                };
            }

            return {
                success: false,
                message: response.message || 'Error en login',
                data: {
                    user: null as unknown as User,
                    token: '',
                    expiresIn: 0
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Error de conexión',
                data: {
                    user: null as unknown as User,
                    token: '',
                    expiresIn: 0
                }
            };
        }
    }

    // Registro de usuario
    async register(userData: SignupData): Promise<ApiResponse<{ user: User; token: string }>> {
        try {
            const response = await this.makeRequest<{
                user: User;
                token: string;
            }>(API_CONFIG.ENDPOINTS.REGISTER, {
                method: 'POST',
                body: JSON.stringify(userData)
            });

            if (response.success && response.data) {
                this.token = response.data.token;
                this.user = response.data.user;

                // Guardar en AsyncStorage
                await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, this.token);
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));
            }

            return response;
        } catch (error) {
            console.error('Register error:', error);
            return {
                success: false,
                message: 'Error de conexión'
            };
        }
    }

    // Logout
    async logout(): Promise<void> {
        try {
            // Intentar logout en el servidor (opcional)
            if (this.token) {
                await this.makeRequest(API_CONFIG.ENDPOINTS.LOGOUT, {
                    method: 'POST'
                });
            }
        } catch (error) {
            console.warn('Server logout failed:', error);
        } finally {
            // Limpiar datos locales
            await this.clearAuthData();
        }
    }

    // Verificar si el token es válido
    async verifyToken(): Promise<boolean> {
        if (!this.token) return false;

        try {
            const response = await this.makeRequest(API_CONFIG.ENDPOINTS.VERIFY_TOKEN, {
                method: 'GET'
            });

            return response.success;
        } catch (error) {
            console.error('Token verification error:', error);
            return false;
        }
    }

    // Obtener usuario actual
    async getCurrentUser(): Promise<User | null> {
        if (this.user) return this.user;

        if (!this.token) return null;

        try {
            const response = await this.makeRequest<User>(API_CONFIG.ENDPOINTS.PROFILE, {
                method: 'GET'
            });

            if (response.success && response.data) {
                this.user = response.data;
                await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(this.user));
                return this.user;
            }

            return null;
        } catch (error) {
            console.error('Get current user error:', error);
            return null;
        }
    }

    // Verificar si está autenticado
    async isAuthenticated(): Promise<boolean> {
        const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
        return !!token;
    }

    // Limpiar datos de autenticación
    async clearAuthData(): Promise<void> {
        this.token = null;
        this.user = null;
        
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.TOKEN,
            STORAGE_KEYS.USER_DATA,
            STORAGE_KEYS.REMEMBER_USER
        ]);
    }

    // Obtener token actual
    getToken(): string | null {
        return this.token;
    }

    // Obtener usuario actual (sincrónico)
    getUser(): User | null {
        return this.user;
    }

    // Actualizar configuración de la API (útil para desarrollo)
    updateApiConfig(baseUrl: string): void {
        API_CONFIG.BASE_URL = baseUrl;
    }

    // Método público para hacer requests autenticados
    async makeAuthenticatedRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<{ success: boolean; data?: T; message?: string; error?: any }> {
        return await this.makeRequest<T>(endpoint, options);
    }
}

// Instancia singleton del servicio
export const authService = new AuthService();

export default authService;