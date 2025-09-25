import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { userService } from '../services';
import { User } from '../types';

export const usePerfilForm = (user: User | null, onSuccess: () => void) => {
    const [loading, setLoading] = useState(false);
    // Opciones válidas para tipoDocumento
    const tipoDocumentoOpciones = [
        'Cédula de ciudadanía',
        'Cédula de extranjería',
        'Pasaporte',
        'Tarjeta de identidad'
    ] as const;

    // Si el valor actual no es válido, se asigna el primero
    const tipoDocumentoInicial = tipoDocumentoOpciones.includes(user?.tipoDocumento as any)
        ? user?.tipoDocumento
        : tipoDocumentoOpciones[0];

    const [perfilData, setPerfilData] = useState({
        nombre: user?.nombre || '',
        apellido: user?.apellido || '',
        telefono: user?.telefono || '',
        correo: user?.correo || '',
        tipoDocumento: tipoDocumentoInicial,
        numeroDocumento: user?.numeroDocumento || '',
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

            // Aseguramos que tipoDocumento sea uno de los valores válidos
            const tipoDocumentoValido = tipoDocumentoOpciones.includes(perfilData.tipoDocumento as any)
                ? perfilData.tipoDocumento
                : tipoDocumentoOpciones[0];

            const response = await userService.updateUser(user._id, {
                ...perfilData,
                tipoDocumento: tipoDocumentoValido,
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