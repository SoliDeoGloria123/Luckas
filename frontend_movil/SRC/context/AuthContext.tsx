import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services';
import { User } from '../types';

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    verifyToken: () => Promise<boolean>;
    canEdit: () => boolean;
    canDelete: () => boolean;
    hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    user: null,
    loading: true,
    login: async () => false,
    logout: () => {},
    verifyToken: async () => false,
    canEdit: () => false,
    canDelete: () => false,
    hasRole: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const verifyToken = async () => {
        try {
            const isValid = await authService.verifyToken();
            if (isValid) {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    setUser(currentUser);
                    setIsAuthenticated(true);
                    return true;
                }
            }
            await authService.clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } catch (error) {
            console.error('Error verificando token:', error);
            await authService.clearAuthData();
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const login = async (username: string, password: string) => {
        try {
            const response = await authService.login({ correo: username, password });
            if (response.success && response.data?.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                return true;
            }
            setUser(null);
            setIsAuthenticated(false);
            return false;
        } catch (error) {
            console.error('Error en login:', error);
            setUser(null);
            setIsAuthenticated(false);
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    useEffect(() => {
        verifyToken();
    }, []);

    const canEdit = () => {
        return user && (user.role === 'admin' || user.role === 'tesorero');
    };

    const canDelete = () => {
        return user && user.role === 'admin';
    };

    const hasRole = (role: string) => {
        return user?.role === role;
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            user,
            loading,
            login,
            logout,
            verifyToken,
            canEdit,
            canDelete,
            hasRole
        }}>
            {children}
        </AuthContext.Provider>
    );
};