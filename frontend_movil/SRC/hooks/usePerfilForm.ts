import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { userService } from '../services';
import { User } from '../types';

export const usePerfilForm = (user: User | null, onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    const [perfilData, setPerfilData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        username: user?.username || '',
        role: user?.role || ''
    });

    const handleUpdatePerfil = useCallback(async () => {
        if (!user?._id) {
            Alert.alert('Error', 'No se encontró información del usuario');
            return;
        }

        try {
            setLoading(true);

            // Validaciones
            if (!perfilData.nombre.trim() || !perfilData.apellido.trim()) {
                Alert.alert('Error', 'El nombre y apellido son requeridos');
                return;
            }

            const response = await userService.updateUser(user._id, {
                ...perfilData,
                role: user.role // Mantenemos el rol actual
            });

            if (response.success) {
                Alert.alert('Éxito', 'Perfil actualizado correctamente');
                onSuccess();
            } else {
                Alert.alert('Error', response.message || 'Error al actualizar el perfil');
            }
        } catch (error) {
            console.error('Error actualizando perfil:', error);
            Alert.alert('Error', 'Error de conexión al actualizar el perfil');
        } finally {
            setLoading(false);
        }
    }, [perfilData, user, onSuccess]);

    return {
        loading,
        perfilData,
        setPerfilData,
        handleUpdatePerfil
    };
};