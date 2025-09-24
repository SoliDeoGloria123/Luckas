import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { userService, tareasService } from '../services';
import { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';

const INITIAL_TAREA = {
    titulo: '',
    descripcion: '',
    estado: 'pendiente',
    prioridad: 'Media',
    asignadoA: '',
    fechaLimite: new Date(),
    comentarios: [],
    etiquetas: []
};

export const useCrearTareaForm = (onTareaCreada: () => void, userId?: string) => {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [nuevaTarea, setNuevaTarea] = useState(INITIAL_TAREA);
    const [asignadoAOptions, setAsignadoAOptions] = useState([]);

    const cargarUsuarios = useCallback(async () => {
        try {
            const response = await userService.getAllUsers();
            if (response.success && response.data) {
                setAsignadoAOptions(response.data);
            }
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    }, []);

    const handleDateChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || nuevaTarea.fechaLimite;
        setShowDatePicker(Platform.OS === 'ios');
        setNuevaTarea(prev => ({...prev, fechaLimite: currentDate}));
    }, [nuevaTarea.fechaLimite]);

    const handleCrearTarea = useCallback(async () => {
        try {
            // Validaciones
            if (!nuevaTarea.titulo.trim()) {
                Alert.alert('Error', 'El título es requerido');
                return;
            }
            if (!nuevaTarea.descripcion.trim()) {
                Alert.alert('Error', 'La descripción es requerida');
                return;
            }
            if (!nuevaTarea.asignadoA) {
                Alert.alert('Error', 'Debe seleccionar un usuario para asignar la tarea');
                return;
            }

            const tareaData = {
                ...nuevaTarea,
                estado: 'pendiente',
                asignadoA: nuevaTarea.asignadoA,
                asignadoPor: userId,
                prioridad: nuevaTarea.prioridad as 'Baja' | 'Media' | 'Alta',
                fechaLimite: nuevaTarea.fechaLimite.toISOString(),
                etiquetas: []
            };

            const response = await tareasService.createTarea(tareaData);

            if (response.success) {
                Alert.alert('Éxito', 'Tarea creada correctamente');
                setShowCreateModal(false);
                setNuevaTarea(INITIAL_TAREA);
                onTareaCreada();
            } else {
                Alert.alert('Error', response.message || 'Error al crear la tarea');
            }
        } catch (error) {
            console.error('Error creando tarea:', error);
            Alert.alert('Error', 'Error de conexión al crear la tarea');
        }
    }, [nuevaTarea, userId, onTareaCreada]);

    return {
        showCreateModal,
        setShowCreateModal,
        showDatePicker,
        setShowDatePicker,
        nuevaTarea,
        setNuevaTarea,
        asignadoAOptions,
        cargarUsuarios,
        handleDateChange,
        handleCrearTarea
    };
};