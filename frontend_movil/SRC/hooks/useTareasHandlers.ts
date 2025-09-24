import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { userService, tareasService } from '../services';
import { Tarea } from '../types';

export const useTareasHandlers = (user: any, onTareasUpdated: (tareas: Tarea[]) => void) => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const cargarTareas = useCallback(async () => {
        try {
            setLoading(true);
            console.log('🔄 Iniciando carga de tareas...');
            console.log('Usuario actual:', user?._id, user?.role);
            
            if (!user?._id) {
                console.log('❌ No se encontró el ID del usuario');
                Alert.alert('Error', 'No se encontró el ID del usuario');
                return;
            }

            let response;
            console.log('📱 Intentando cargar tareas para usuario con rol:', user.role);
            
            if (user.role === 'admin' || user.role === 'tesorero') {
                console.log('🔍 Cargando todas las tareas (admin/tesorero)');
                response = await tareasService.getAllTareas();
            } else {
                console.log('🔍 Cargando tareas específicas del usuario:', user._id);
                response = await tareasService.getTareasByUsuario(user._id);
            }

            console.log('📥 Respuesta del servidor:', response);

            if (response.success && Array.isArray(response.data)) {
                console.log('✅ Tareas cargadas exitosamente:', response.data.length, 'tareas');
                onTareasUpdated(response.data);
            } else {
                console.error('❌ Error en la respuesta:', response.message);
                Alert.alert('Error', response.message || 'Error al cargar las tareas');
                onTareasUpdated([]);
            }
        } catch (error) {
            console.error('❌ Error cargando tareas:', error);
            Alert.alert('Error', 'Error de conexión al cargar las tareas');
        } finally {
            console.log('🏁 Finalizando carga de tareas');
            setLoading(false);
            setRefreshing(false);
        }
    }, [user, onTareasUpdated]);

    const handleCambioEstado = useCallback(async (tareaId: string, nuevoEstado: string) => {
        try {
            const response = await tareasService.changeEstadoTarea(tareaId, nuevoEstado as any);
            if (response.success) {
                cargarTareas();
                Alert.alert('Éxito', 'Estado de la tarea actualizado correctamente');
            } else {
                Alert.alert('Error', response.message || 'Error al actualizar el estado');
            }
        } catch (error) {
            console.error('Error actualizando estado:', error);
            Alert.alert('Error', 'Error de conexión al actualizar el estado');
        }
    }, [cargarTareas]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        cargarTareas();
    }, [cargarTareas]);

    return {
        loading,
        refreshing,
        cargarTareas,
        handleCambioEstado,
        onRefresh
    };
};