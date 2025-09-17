// Pantalla de gestión de cabañas

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    RefreshControl,
    Modal,
    Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { cabanasService } from '../services/cabanas';
import { Cabana } from '../types';
import { colors, spacing, typography, shadows } from '../styles';

const CabanasScreen: React.FC = () => {
    const { canEdit, canDelete, user } = useAuth();
    const [cabanas, setCabanas] = useState<Cabana[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filterEstado, setFilterEstado] = useState<string>('Todos');

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

    // Manejar agregar cabaña
    const handleAddCabana = () => {
        if (canEdit()) {
            Alert.alert('Información', 'Función de agregar cabaña en desarrollo');
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para agregar cabañas');
        }
    };

    // Manejar editar cabaña
    const handleEditCabana = (cabana: Cabana) => {
        if (canEdit()) {
            Alert.alert('Información', `Editar cabaña "${cabana.nombre}" - En desarrollo`);
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para editar cabañas');
        }
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

    // Mostrar detalles de la cabaña
    const showCabanaDetails = (cabana: Cabana) => {
        setSelectedCabana(cabana);
        setShowModal(true);
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Renderizar card de cabaña
    const renderCabanaCard = (cabana: Cabana) => (
        <TouchableOpacity 
            key={cabana._id} 
            style={styles.cabanaCard}
            onPress={() => showCabanaDetails(cabana)}
        >
            {/* Imagen principal */}
            {cabana.imagen && cabana.imagen.length > 0 && (
                <Image 
                    source={{ uri: cabana.imagen[0] }} 
                    style={styles.cabanaImage}
                    resizeMode="cover"
                />
            )}
            
            <View style={styles.cabanaContent}>
                {/* Header con nombre y estado */}
                <View style={styles.cabanaHeader}>
                    <View style={styles.cabanaInfo}>
                        <Text style={styles.cabanaTitle}>{cabana.nombre}</Text>
                        {cabana.ubicacion && (
                            <Text style={styles.cabanaUbicacion}>📍 {cabana.ubicacion}</Text>
                        )}
                    </View>
                    <View style={styles.estadoContainer}>
                        <Ionicons 
                            name={cabanasService.getEstadoIcon(cabana.estado) as any}
                            size={20}
                            color={cabanasService.getEstadoColor(cabana.estado)}
                        />
                        <Text style={[
                            styles.estadoText,
                            { color: cabanasService.getEstadoColor(cabana.estado) }
                        ]}>
                            {cabana.estado}
                        </Text>
                    </View>
                </View>

                {/* Descripción */}
                {cabana.descripcion && (
                    <Text style={styles.cabanaDescription} numberOfLines={2}>
                        {cabana.descripcion}
                    </Text>
                )}

                {/* Información básica */}
                <View style={styles.infoContainer}>
                    <View style={styles.infoItem}>
                        <Ionicons name="people-outline" size={16} color={colors.primary} />
                        <Text style={styles.infoText}>Capacidad: {cabana.capacidad}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Ionicons name="cash-outline" size={16} color={colors.success} />
                        <Text style={styles.infoText}>${cabana.precio?.toLocaleString()}/noche</Text>
                    </View>
                </View>

                {/* Categoría */}
                {cabana.categoria && (
                    <View style={styles.categoriaContainer}>
                        <Text style={styles.categoriaText}>
                            Categoría: {cabana.categoria || 'Sin categoría'}
                        </Text>
                    </View>
                )}

                {/* Acciones */}
                <View style={styles.cabanaActions}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => showCabanaDetails(cabana)}
                    >
                        <Ionicons name="eye-outline" size={20} color={colors.primary} />
                        <Text style={styles.actionText}>Ver</Text>
                    </TouchableOpacity>
                    
                    {canEdit() && (
                        <>
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleEditCabana(cabana)}
                            >
                                <Ionicons name="pencil-outline" size={20} color={colors.warning} />
                                <Text style={styles.actionText}>Editar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                                style={styles.actionButton}
                                onPress={() => handleChangeEstado(cabana)}
                            >
                                <Ionicons name="swap-horizontal-outline" size={20} color={colors.info} />
                                <Text style={styles.actionText}>Estado</Text>
                            </TouchableOpacity>
                        </>
                    )}
                    
                    {canDelete() && (
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleDeleteCabana(cabana)}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            <Text style={styles.actionText}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Modal de detalles de la cabaña
    const CabanaDetailModal = () => {
        if (!selectedCabana) return null;

        return (
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Detalles de la Cabaña</Text>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalContent}>
                        {/* Galería de imágenes */}
                        {selectedCabana.imagen && selectedCabana.imagen.length > 0 && (
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                style={styles.imageGallery}
                            >
                                {selectedCabana.imagen.map((img, index) => (
                                    <Image 
                                        key={index}
                                        source={{ uri: img }} 
                                        style={styles.galleryImage}
                                        resizeMode="cover"
                                    />
                                ))}
                            </ScrollView>
                        )}

                        {/* Información básica */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>Información Básica</Text>
                            <Text style={styles.modalCabanaTitle}>{selectedCabana.nombre}</Text>
                            {selectedCabana.descripcion && (
                                <Text style={styles.modalCabanaDescription}>{selectedCabana.descripcion}</Text>
                            )}
                            
                            <View style={styles.modalInfoGrid}>
                                <View style={styles.modalInfoItem}>
                                    <Text style={styles.modalLabel}>Capacidad:</Text>
                                    <Text style={styles.modalValue}>{selectedCabana.capacidad} personas</Text>
                                </View>
                                <View style={styles.modalInfoItem}>
                                    <Text style={styles.modalLabel}>Precio:</Text>
                                    <Text style={styles.modalValue}>${selectedCabana.precio?.toLocaleString()}/noche</Text>
                                </View>
                                <View style={styles.modalInfoItem}>
                                    <Text style={styles.modalLabel}>Estado:</Text>
                                    <View style={styles.estadoModalContainer}>
                                        <Ionicons 
                                            name={cabanasService.getEstadoIcon(selectedCabana.estado) as any}
                                            size={16}
                                            color={cabanasService.getEstadoColor(selectedCabana.estado)}
                                        />
                                        <Text style={[
                                            styles.modalValue,
                                            { color: cabanasService.getEstadoColor(selectedCabana.estado) }
                                        ]}>
                                            {selectedCabana.estado}
                                        </Text>
                                    </View>
                                </View>
                                {selectedCabana.ubicacion && (
                                    <View style={styles.modalInfoItem}>
                                        <Text style={styles.modalLabel}>Ubicación:</Text>
                                        <Text style={styles.modalValue}>{selectedCabana.ubicacion}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Información del sistema */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>Información del Sistema</Text>
                            {selectedCabana.createdAt && (
                                <Text style={styles.modalText}>
                                    <Text style={styles.modalLabel}>Creada: </Text>
                                    {formatDate(selectedCabana.createdAt)}
                                </Text>
                            )}
                            {selectedCabana.updatedAt && (
                                <Text style={styles.modalText}>
                                    <Text style={styles.modalLabel}>Actualizada: </Text>
                                    {formatDate(selectedCabana.updatedAt)}
                                </Text>
                            )}
                        </View>
                    </ScrollView>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cabañas</Text>
                {canEdit() && (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCabana}>
                        <Ionicons name="add" size={24} color={colors.textOnPrimary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar cabañas..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Filtros */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={styles.filtersContainer}
                contentContainerStyle={styles.filtersContent}
            >
                {estados.map((estado) => (
                    <Pressable
                        key={estado}
                        style={[
                            styles.filterButton,
                            filterEstado === estado && styles.filterButtonActive
                        ]}
                        onPress={() => setFilterEstado(estado)}
                    >
                        <Text style={[
                            styles.filterButtonText,
                            filterEstado === estado && styles.filterButtonTextActive
                        ]}>
                            {estado}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

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
                    filteredCabanas.map(renderCabanaCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="home-outline" size={64} color={colors.textSecondary} />
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

            {/* Modal de detalles */}
            <CabanaDetailModal />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.surface,
        padding: spacing.lg,
        ...shadows.small,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
    },
    addButton: {
        backgroundColor: colors.primary,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        margin: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        ...shadows.small,
    },
    searchInput: {
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.md,
        color: colors.text,
    },
    filtersContainer: {
        marginHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    filtersContent: {
        paddingRight: spacing.md,
    },
    filterButton: {
        backgroundColor: colors.surface,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 20,
        marginRight: spacing.sm,
        ...shadows.small,
    },
    filterButtonActive: {
        backgroundColor: colors.primary,
    },
    filterButtonText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    filterButtonTextActive: {
        color: colors.textOnPrimary,
        fontWeight: typography.fontWeight.medium,
    },
    scrollContainer: {
        flex: 1,
        paddingHorizontal: spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    cabanaCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: spacing.md,
        overflow: 'hidden',
        ...shadows.medium,
    },
    cabanaImage: {
        width: '100%',
        height: 200,
    },
    cabanaContent: {
        padding: spacing.md,
    },
    cabanaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    cabanaInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    cabanaTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    cabanaUbicacion: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    estadoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    estadoText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        marginLeft: spacing.xs,
    },
    cabanaDescription: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        lineHeight: typography.lineHeight.relaxed,
        marginBottom: spacing.md,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoText: {
        fontSize: typography.fontSize.sm,
        color: colors.text,
        marginLeft: spacing.xs,
    },
    categoriaContainer: {
        marginBottom: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    categoriaText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontStyle: 'italic',
    },
    cabanaActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingTop: spacing.sm,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginLeft: spacing.sm,
    },
    actionText: {
        marginLeft: spacing.xs,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: spacing.xxxl,
    },
    emptyText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textSecondary,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    emptySubtext: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingHorizontal: spacing.lg,
    },
    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.surface,
        ...shadows.small,
    },
    modalTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
    },
    modalContent: {
        flex: 1,
        padding: spacing.lg,
    },
    imageGallery: {
        marginBottom: spacing.lg,
    },
    galleryImage: {
        width: 250,
        height: 180,
        borderRadius: 8,
        marginRight: spacing.md,
    },
    modalSection: {
        marginBottom: spacing.lg,
    },
    modalSectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    modalCabanaTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.sm,
    },
    modalCabanaDescription: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        lineHeight: typography.lineHeight.relaxed,
        marginBottom: spacing.md,
    },
    modalInfoGrid: {
        gap: spacing.md,
    },
    modalInfoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.xs,
    },
    modalLabel: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textSecondary,
    },
    modalValue: {
        fontSize: typography.fontSize.md,
        color: colors.text,
    },
    estadoModalContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalText: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        marginBottom: spacing.sm,
        lineHeight: typography.lineHeight.relaxed,
    },
});

export default CabanasScreen;