//Contexto Global de autenticación 

//importar dependencias
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth'; //Servicio de autenticación
import { User, LoginCredentials, LoginResponse } from '../types'; //tipos TypeScript

//Interfaz de contexto - ajustada según los roles del backend
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;

    //funciones de autenticación
    login: (credentials: LoginCredentials) => Promise<LoginResponse>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    
    //verificar permisos - según roles del backend: admin, tesorero, seminarista, externo
    canDelete: () => boolean;
    canEdit: () => boolean;
    canModifyUsers: () => boolean;
    canViewReports: () => boolean;
    hasRole: (role: 'admin' | 'tesorero' | 'seminarista' | 'externo') => boolean;
    
    //helpers de roles específicos
    isAdmin: () => boolean;
    isTesorero: () => boolean;
    isSeminarista: () => boolean;
    isExterno: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        checkAuthStatus().finally(() => setIsLoading(false));
    }, []);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const isAuth = await authService.isAuthenticated();
            if (isAuth) {
                const isValidToken = await authService.verifyToken();
                if (isValidToken) {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                } else {
                    await authService.clearAuthData();
                    setUser(null);
                }
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Error verificación autenticación:', error);
            await authService.clearAuthData();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    //proceso de inicio de sesión login
    const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
        try {
            setIsLoading(true);
            const response = await authService.login(credentials);
            if (response.success && response.data) {
                setUser(response.data.user);
            }
            return response;
        } catch (error) {
            console.error('Error en login:', error);
            setUser(null);
            return { 
                success: false, 
                message: 'Error en login', 
                data: { 
                    user: null as unknown as User,
                    token: '',
                    expiresIn: 0
                }
            };
        } finally {
            setIsLoading(false);
        }
    };

    //cierre de sesión usuario
    const logout = async (): Promise<void> => {
        try {
            setIsLoading(true);
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.warn('Error en logout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // refresca los datos de usuario actual sin hacer login de nuevo
    const refreshUser = async (): Promise<void> => {
        try {
            if (user) {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            }
        } catch (error) {
            console.warn('Error al refrescar datos de usuario:', error);
            await logout();
        } 
    };

    //Permisos de eliminar - solo admin según backend
    const canDelete = (): boolean => {
        return user?.role === 'admin';
    };

    //permisos de edición - admin puede todo, otros roles pueden editar según reglas específicas
    const canEdit = (): boolean => {
        return user?.role === 'admin' || user?.role === 'tesorero' || user?.role === 'seminarista';
    };

    //permisos para modificar usuarios - solo admin
    const canModifyUsers = (): boolean => {
        return user?.role === 'admin';
    };

    //permisos para ver reportes - admin y tesorero
    const canViewReports = (): boolean => {
        return user?.role === 'admin' || user?.role === 'tesorero';
    };

    //verificar rol específico
    const hasRole = (role: 'admin' | 'tesorero' | 'seminarista' | 'externo'): boolean => {
        return user?.role === role;
    };

    //helpers de roles específicos
    const isAdmin = (): boolean => user?.role === 'admin';
    const isTesorero = (): boolean => user?.role === 'tesorero';
    const isSeminarista = (): boolean => user?.role === 'seminarista';
    const isExterno = (): boolean => user?.role === 'externo';

    const isAuthenticated = !!user;

    //Datos de las funciones que estarán en app
    const value: AuthContextType = {
        user,
        isAuthenticated,                                                                                                 
        isLoading,
        login,
        logout,
        refresh: refreshUser,
        canDelete,
        canEdit,
        canModifyUsers,
        canViewReports,
        hasRole,
        isAdmin,
        isTesorero,
        isSeminarista,
        isExterno
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export { AuthContext };
export default AuthProvider;