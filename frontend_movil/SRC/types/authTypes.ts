import { User } from '../types';

export interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    verifyToken: () => Promise<boolean>;
    updateUserInContext: (updatedUser: User) => void;
    canEdit: () => boolean;
    canDelete: () => boolean;
    hasRole: (role: string) => boolean;
    isAdmin: () => boolean;
    isTesorero: () => boolean;
    isSeminarista: () => boolean;
}