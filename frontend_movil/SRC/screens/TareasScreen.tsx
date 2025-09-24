import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Tarea } from '../types';
import { tareasService } from '../services';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { TareaCard } from '../components/Tareas/TareaCard';
import { TareaFilterModal } from '../components/Tareas/TareaFilterModal';
import { TareasHeader } from '../components/Tareas/TareasHeader';
import { useFocusEffect } from '@react-navigation/native';

export const TareasScreen = () => {
    const { user } = useAuth();
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filtros, setFiltros] = useState({
        estado: '',
        prioridad: '',
        categoria: ''
    });

    const cargarTareas = async () => {
        try {
            let response;
            console.log('Usuario actual:', user?._id, user?.role);
            
            if (!user?._id) {
                Alert.alert('Error', 'No se encontró el ID del usuario');
                return;
            }

            if (user.role === 'admin' || user.role === 'tesorero') {
                // Los admin y tesoreros ven todas las tareas
                response = await tareasService.getAllTareas();
            } else {
                // Los demás solo ven sus tareas asignadas
                response = await tareasService.getTareasByUsuario(user._id);
            }

            if (response.success && response.data) {
                setTareas(response.data);
            } else {
                Alert.alert('Error', response.message || 'Error al cargar las tareas');
            }
        } catch (error) {
            console.error('Error cargando tareas:', error);
            Alert.alert('Error', 'Error de conexión al cargar las tareas');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Cargar tareas cuando la pantalla obtiene el foco
    useFocusEffect(
        React.useCallback(() => {
            if (user?._id && !loading) {
                console.log('Cargando tareas para usuario:', user._id, 'con rol:', user.role);
                cargarTareas();
            }
        }, [user?._id, user?.role, loading])
    );

    const onRefresh = () => {
        setRefreshing(true);
        cargarTareas();
    };

    const aplicarFiltros = () => {
        setShowFilters(false);
        cargarTareas();
    };

    const handleCambioEstado = async (tareaId: string, nuevoEstado: string) => {
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
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TareasHeader
                onFilterPress={() => setShowFilters(true)}
                cantidadTareas={tareas.length}
            />

            <FlatList
                data={tareas}
                renderItem={({ item }) => (
                    <TareaCard
                        tarea={item}
                        onCambiarEstado={handleCambioEstado}
                        usuarioActual={user}
                    />
                )}
                keyExtractor={item => item._id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Icon name="clipboard-outline" size={50} color={colors.gray} />
                        <Text style={styles.emptyText}>No hay tareas disponibles</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />

            <TareaFilterModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filtros={filtros}
                onFiltrosChange={setFiltros}
                onAplicar={aplicarFiltros}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
    },
    listContainer: {
        flexGrow: 1,
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        marginTop: 8,
        fontSize: 16,
        color: colors.gray,
        textAlign: 'center',
    },
});