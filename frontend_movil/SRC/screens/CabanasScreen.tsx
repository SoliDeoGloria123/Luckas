// Pantalla de gestión de cabañas
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    RefreshControl,
    Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { cabanasService } from '../services';
import { Cabana } from '../types';
import { StyleSheet } from 'react-native';
import { colors, spacing, typography, shadows } from '../styles';

const CabanasScreen: React.FC = () => {
    const { canEdit, canDelete, user, hasRole } = useAuth();
    const [cabanas, setCabanas] = useState<Cabana[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filterEstado, setFilterEstado] = useState<string>('Todos');

    // Verificar si el usuario tiene permisos para ver cabañas
    useEffect(() => {
        if (!user || (!hasRole('admin') && !hasRole('tesorero') && !hasRole('seminarista'))) {
            Alert.alert(
                'Acceso Denegado',
                'No tienes permisos para ver la información de las cabañas',
                [{ text: 'OK' }]
            );
            // Aquí podrías redirigir al usuario a otra pantalla si lo deseas
        }
    }, [user, hasRole]);

    // Estados disponibles
    const estados = ['Todos', ...cabanasService.getEstados()];

    // Cargar cabañas
    const loadCabanas = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await cabanasService.getAllCabanas();
            if (response.success && response.data) {
                setCabanas(response.data);
            } else {
                Alert.alert('Error', response.message || 'No se pudieron cargar las cabañas');
                setCabanas([]);
            }
        } catch (error) {
            console.error('Error loading cabanas:', error);
            Alert.alert('Error', 'Error de conexión');
            setCabanas([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCabanas();
    }, [loadCabanas]);

    // Refrescar cabañas
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadCabanas();
        setRefreshing(false);
    }, [loadCabanas]);

    // Filtrar cabañas
    const filteredCabanas = cabanas.filter(cabana => {
        const matchesSearch =
            cabana.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            cabana.descripcion?.toLowerCase().includes(searchText.toLowerCase()) ||
            cabana.ubicacion?.toLowerCase().includes(searchText.toLowerCase());

        const matchesFilter = filterEstado === 'Todos' || cabana.estado === filterEstado;

        return matchesSearch && matchesFilter;
    });

    // Nota: Funcionalidad de agregar cabañas deshabilitada en la versión móvil

    // Manejar editar cabaña - solo visualización
    const handleEditCabana = (cabana: Cabana) => {
        Alert.alert('Solo Visualización', 'La funcionalidad de edición no está disponible en la versión móvil');
    };

    // Manejar cambiar estado de cabaña
    const handleChangeEstado = (cabana: Cabana) => {
        if (canEdit()) {
            const estados = cabanasService.getEstados();
            Alert.alert(
                'Cambiar Estado',
                `Estado actual: ${cabana.estado}`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    ...estados.map(estado => ({
                        text: estado,
                        onPress: async () => {
                            try {
                                const response = await cabanasService.updateCabana(cabana._id, { estado: estado as 'disponible' | 'ocupada' | 'mantenimiento' });
                                if (response.success) {
                                    Alert.alert('Éxito', `Estado cambiado a ${estado}`);
                                    loadCabanas();
                                } else {
                                    Alert.alert('Error', response.message || 'No se pudo cambiar el estado');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Error de conexión');
                            }
                        }
                    }))
                ]
            );
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para cambiar el estado');
        }
    };

    // Manejar eliminar cabaña
    const handleDeleteCabana = (cabana: Cabana) => {
        if (canDelete()) {
            Alert.alert(
                'Eliminar Cabaña',
                `¿Estás seguro de que quieres eliminar "${cabana.nombre}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                const response = await cabanasService.deleteCabana(cabana._id);
                                if (response.success) {
                                    Alert.alert('Éxito', 'Cabaña eliminada correctamente');
                                    loadCabanas();
                                } else {
                                    Alert.alert('Error', response.message || 'No se pudo eliminar la cabaña');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Error de conexión');
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para eliminar cabañas');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cabañas Disponibles</Text>
                <Text style={styles.headerSubtitle}>Encuentra el lugar perfecto para tu retiro espiritual y descanso</Text>
            </View>



            {/* Filtros */}
          
                <ScrollView
                    horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosContainer} contentContainerStyle={styles.filtrosContent}
                >
                    {estados.map((estado) => (
                        <TouchableOpacity
                            key={estado}
                            style={[
                                styles.filterOption,
                                filterEstado === estado && styles.filterOptionActive
                            ]}
                            onPress={() => setFilterEstado(estado)}
                        >
                            <Text style={[
                                styles.filterText,
                                filterEstado === estado && styles.filterTextActive
                            ]}>
                                {estado.charAt(0).toUpperCase() + estado.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
          
            {/* Barra de búsqueda */}
            <View style={styles.searchBox}>
             
                   <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                    <TextInput
                        placeholder="Buscar cabañas..."
                        value={searchText}
                        onChangeText={setSearchText}
                        style={styles.searchInputField}
                        placeholderTextColor="#334155"
                    />
             
            </View>

            {/* Lista de cabañas */}
            <ScrollView
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Cargando cabañas...</Text>
                    </View>
                ) : filteredCabanas.length > 0 ? (
                    filteredCabanas.map(cabana => (
                        <View key={cabana._id} style={styles.card}>
                            {/* Imagen superior si existe */}
                            {cabana.imagen && cabana.imagen.length > 0 && (
                                <Image
                                    source={{ uri: cabana.imagen[0] }}
                                    style={styles.image}
                                    resizeMode="cover"
                                />
                            )}
                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardTitle}>{cabana.nombre}</Text>
                                    <View style={[styles.cardBadge, { backgroundColor: cabana.estado === 'disponible' ? '#059669' : cabana.estado === 'ocupada' ? '#dc3545' : '#1d4ed8' }]}>
                                        <Text style={styles.cardBadgeText}>{cabana.estado}</Text>
                                    </View>
                                </View>
                                <Text style={styles.cardLocation}>📍 {cabana.ubicacion}</Text>
                                <Text style={styles.cardDescription}>{cabana.descripcion}</Text>
                                <View style={styles.cardInfoRow}>
                                    <Ionicons name="people-outline" size={16} color="#334155" />
                                    <Text style={styles.cardInfoText}>{cabana.capacidad} personas</Text>
                                    <Ionicons name="cash-outline" size={16} color="#059669" />
                                    <Text style={styles.cardPrice}>${cabana.precio?.toLocaleString()}/noche</Text>
                                </View>
                                {cabana.categoria && (
                                    <Text style={styles.cardCategoryText}>
                                        Categoría: {cabana.categoria ? (typeof cabana.categoria === 'object' ? cabana.categoria.nombre : cabana.categoria) : 'Sin categoría'}
                                    </Text>
                                )}
                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={[styles.cardButton, { backgroundColor: '#8b5cf6' }]}
                                        onPress={() => handleChangeEstado(cabana)}
                                    >
                                        <Ionicons name="eye-outline" size={20} color="#fff" />
                                    </TouchableOpacity>
                                    {canEdit() && (
                                        <TouchableOpacity
                                            style={[styles.cardButton, { backgroundColor: '#2563eb' }]}
                                            onPress={() => handleEditCabana(cabana)}
                                        >
                                            <Ionicons name="pencil-outline" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                    {canDelete() && (
                                        <TouchableOpacity
                                            style={[styles.cardButton, { backgroundColor: '#dc3545' }]}
                                            onPress={() => handleDeleteCabana(cabana)}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="home-outline" size={64} color="#666" />
                        <Text style={styles.emptyText}>No se encontraron cabañas</Text>
                        <Text style={styles.emptySubtext}>
                            {searchText || filterEstado !== 'Todos' ?
                                'Intenta ajustar los filtros de búsqueda' :
                                'Aún no hay cabañas registradas'
                            }
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    contentContainer: {
        flex: 1,
        paddingBottom: 20,
    },
    // Header styles
    header: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.lg + 40,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        height: 170,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl + 4,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    // Search styles
    searchBox: {
      flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        ...shadows.small,
    },
    searchInput: {
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchInputField: {
         flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.md,
        color: colors.text,
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingVertical: 2,
    },
    // Filter styles
    filtrosContainer: {
        marginBottom: spacing.sm,
        marginHorizontal: spacing.md,
        height: 36,
        minHeight: 36,
        maxHeight: 36,
    },
        filtrosContent: {
        alignItems: 'center',
        gap: spacing.xs,
        height: 36,
        minHeight: 36,
        maxHeight: 36,
        paddingVertical: 0,
    },

    filterScroll: {
        flexDirection: 'row',
    },
    filterOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#2563eb',
        marginRight: 8,
    },
    filterOptionActive: {
        backgroundColor: '#2563eb',
        borderColor: '#1d4ed8',
    },

    filterText: {
        color: '#2563eb',
        fontSize: 14,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    filterTextActive: {
        color: '#fff',
    },
    card: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginBottom: 16,
        borderRadius: 18,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    image: {
        width: '100%',
        height: 160,
        backgroundColor: '#f1f5f9',
    },
    cardContent: {
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563eb',
        flex: 1,
        marginRight: 8,
    },
    cardBadge: {
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        minWidth: 70,
        alignItems: 'center',
    },
    cardBadgeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 13,
        letterSpacing: 0.5,
        textTransform: 'capitalize',
    },
    cardLocation: {
        color: '#334155',
        fontSize: 14,
        marginBottom: 2,
    },
    cardDescription: {
        color: '#334155',
        fontSize: 14,
        marginBottom: 6,
        lineHeight: 20,
    },
    cardInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    cardInfoText: {
        color: '#334155',
        fontSize: 14,
        marginLeft: 2,
    },
    cardPrice: {
        color: '#059669',
        fontWeight: 'bold',
        fontSize: 15,
        marginLeft: 4,
    },
    cardCategory: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    cardCategoryText: {
        color: '#334155',
        fontSize: 13,
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
        marginTop: 4,
    },
    cardButton: {
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 12,
        elevation: 2,
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    emptyText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#334155',
        marginTop: 16,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 16,
        color: '#334155',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 24,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
    },
    scrollContainer: {
        flex: 1,
    },
});




export default CabanasScreen;