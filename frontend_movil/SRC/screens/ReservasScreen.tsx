// Pantalla de gestión de reservas

import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    RefreshControl,
    Modal,
    Pressable
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { reservasService } from '../services/reservas';
import { Reserva } from '../types';
import { colors, spacing, typography, shadows } from '../styles';

const ReservasScreen: React.FC = () => {
    const { canEdit, canDelete, user } = useAuth();
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedReserva, setSelectedReserva] = useState<Reserva | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filterEstado, setFilterEstado] = useState<string>('Todos');

    // Estados disponibles
    const estados = ['Todos', ...reservasService.getEstados()];

    // Funciones de utilidad para tipos union
    const getUsuario = (usuario: string | any): any => {
        return typeof usuario === 'object' ? usuario : null;
    };

    const getCabana = (cabana: string | any): any => {
        return typeof cabana === 'object' ? cabana : null;
    };

    const getUsuarioNombre = (usuario: string | any): string => {
        const usuarioObj = getUsuario(usuario);
        return usuarioObj ? `${usuarioObj.nombre} ${usuarioObj.apellido}` : 'Usuario no disponible';
    };

    const getCabanaNombre = (cabana: string | any): string => {
        const cabanaObj = getCabana(cabana);
        return cabanaObj?.nombre || 'Cabaña no disponible';
    };

    // Cargar reservas
    const loadReservas = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await reservasService.getAllReservas();
            if (response.success && response.data) {
                setReservas(response.data);
            } else {
                Alert.alert('Error', response.message || 'No se pudieron cargar las reservas');
                setReservas([]);
            }
        } catch (error) {
            console.error('Error loading reservas:', error);
            Alert.alert('Error', 'Error de conexión');
            setReservas([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadReservas();
    }, [loadReservas]);

    // Refrescar reservas
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReservas();
        setRefreshing(false);
    }, [loadReservas]);

    // Filtrar reservas
    const filteredReservas = reservas.filter(reserva => {
        const usuario = typeof reserva.usuario === 'object' ? reserva.usuario : null;
        const cabana = typeof reserva.cabana === 'object' ? reserva.cabana : null;
        
        const matchesSearch = 
            usuario?.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
            usuario?.apellido?.toLowerCase().includes(searchText.toLowerCase()) ||
            cabana?.nombre?.toLowerCase().includes(searchText.toLowerCase()) ||
            reserva.observaciones?.toLowerCase().includes(searchText.toLowerCase());
        
        const matchesFilter = filterEstado === 'Todos' || reserva.estado === filterEstado;
        
        return matchesSearch && matchesFilter;
    });

    // Manejar agregar reserva
    const handleAddReserva = () => {
        if (canEdit()) {
            Alert.alert('Información', 'Función de agregar reserva en desarrollo');
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para agregar reservas');
        }
    };

    // Manejar editar reserva
    const handleEditReserva = (reserva: Reserva) => {
        if (canEdit()) {
            Alert.alert('Información', `Editar reserva de ${getUsuarioNombre(reserva.usuario)} - En desarrollo`);
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para editar reservas');
        }
    };

    // Manejar eliminar reserva
    const handleDeleteReserva = (reserva: Reserva) => {
        if (canDelete()) {
            Alert.alert(
                'Eliminar Reserva',
                `¿Estás seguro de que quieres eliminar la reserva de ${getUsuarioNombre(reserva.usuario)}?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                        text: 'Eliminar', 
                        style: 'destructive', 
                        onPress: async () => {
                            try {
                                const response = await reservasService.deleteReserva(reserva._id);
                                if (response.success) {
                                    Alert.alert('Éxito', 'Reserva eliminada correctamente');
                                    loadReservas();
                                } else {
                                    Alert.alert('Error', response.message || 'No se pudo eliminar la reserva');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Error de conexión');
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para eliminar reservas');
        }
    };

    // Mostrar detalles de la reserva
    const showReservaDetails = (reserva: Reserva) => {
        setSelectedReserva(reserva);
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

    // Calcular duración de la reserva
    const calculateDuration = (fechaInicio: string, fechaFin: string) => {
        const inicio = new Date(fechaInicio);
        const fin = new Date(fechaFin);
        const diffTime = Math.abs(fin.getTime() - inicio.getTime());
        const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return days;
    };

    // Renderizar card de reserva
    const renderReservaCard = (reserva: Reserva) => (
        <TouchableOpacity 
            key={reserva._id} 
            style={styles.reservaCard}
            onPress={() => showReservaDetails(reserva)}
        >
            {/* Header con usuario y estado */}
            <View style={styles.reservaHeader}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                        {getUsuarioNombre(reserva.usuario)}
                    </Text>
                    <Text style={styles.userEmail}>
                        {getUsuario(reserva.usuario)?.correo || 'Email no disponible'}
                    </Text>
                </View>
                <View style={[
                    styles.estadoBadge,
                    { backgroundColor: reservasService.getEstadoColor(reserva.estado) + '20' }
                ]}>
                    <Text style={[
                        styles.estadoText,
                        { color: reservasService.getEstadoColor(reserva.estado) }
                    ]}>
                        {reserva.estado}
                    </Text>
                </View>
            </View>

            {/* Información de la cabaña */}
            <View style={styles.cabanaInfo}>
                <Text style={styles.cabanaTitle}>🏠 {getCabanaNombre(reserva.cabana)}</Text>
                <Text style={styles.cabanaCategory}>
                    Categoría: {getCabana(reserva.cabana)?.categoria || 'No disponible'}
                </Text>
                <Text style={styles.cabanaCapacity}>
                    👥 Capacidad: {getCabana(reserva.cabana)?.capacidad || 'No disponible'} personas
                </Text>
            </View>

            {/* Fechas de la reserva */}
            <View style={styles.fechasContainer}>
                <View style={styles.fechaItem}>
                    <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                    <Text style={styles.fechaLabel}>Entrada:</Text>
                    <Text style={styles.fechaValue}>{formatDate(reserva.fechaInicio)}</Text>
                </View>
                <View style={styles.fechaItem}>
                    <Ionicons name="calendar-outline" size={16} color={colors.danger} />
                    <Text style={styles.fechaLabel}>Salida:</Text>
                    <Text style={styles.fechaValue}>{formatDate(reserva.fechaFin)}</Text>
                </View>
            </View>

            {/* Información adicional */}
            <View style={styles.infoContainer}>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>💰 Precio:</Text>
                    <Text style={styles.infoValue}>${reserva.precio?.toLocaleString()}</Text>
                </View>
                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>📅 Duración:</Text>
                    <Text style={styles.infoValue}>
                        {calculateDuration(reserva.fechaInicio, reserva.fechaFin)} días
                    </Text>
                </View>
            </View>

            {/* Observaciones */}
            {reserva.observaciones && (
                <View style={styles.observacionesContainer}>
                    <Text style={styles.observacionesLabel}>📝 Observaciones:</Text>
                    <Text style={styles.observacionesText} numberOfLines={2}>
                        {reserva.observaciones}
                    </Text>
                </View>
            )}

            {/* Acciones */}
            <View style={styles.reservaActions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => showReservaDetails(reserva)}
                >
                    <Ionicons name="eye-outline" size={20} color={colors.primary} />
                    <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                
                {canEdit() && (
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditReserva(reserva)}
                    >
                        <Ionicons name="pencil-outline" size={20} color={colors.warning} />
                        <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>
                )}
                
                {canDelete() && (
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteReserva(reserva)}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                        <Text style={styles.actionText}>Eliminar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </TouchableOpacity>
    );

    // Modal de detalles de la reserva
    const ReservaDetailModal = () => {
        if (!selectedReserva) return null;

        return (
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Detalles de la Reserva</Text>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalContent}>
                        {/* Estado de la reserva */}
                        <View style={[
                            styles.modalEstadoBadge,
                            { backgroundColor: reservasService.getEstadoColor(selectedReserva.estado) + '20' }
                        ]}>
                            <Text style={[
                                styles.modalEstadoText,
                                { color: reservasService.getEstadoColor(selectedReserva.estado) }
                            ]}>
                                {selectedReserva.estado}
                            </Text>
                        </View>

                        {/* Información del usuario */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>👤 Información del Usuario</Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Nombre: </Text>
                                {getUsuarioNombre(selectedReserva.usuario)}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Email: </Text>
                                {getUsuario(selectedReserva.usuario)?.correo || 'Email no disponible'}
                            </Text>
                        </View>

                        {/* Información de la cabaña */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>🏠 Información de la Cabaña</Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Nombre: </Text>
                                {getCabanaNombre(selectedReserva.cabana)}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Categoría: </Text>
                                {getCabana(selectedReserva.cabana)?.categoria || 'No disponible'}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Capacidad: </Text>
                                {getCabana(selectedReserva.cabana)?.capacidad || 'No disponible'} personas
                            </Text>
                            {getCabana(selectedReserva.cabana)?.descripcion && (
                                <Text style={styles.modalText}>
                                    <Text style={styles.modalLabel}>Descripción: </Text>
                                    {getCabana(selectedReserva.cabana)?.descripcion}
                                </Text>
                            )}
                        </View>

                        {/* Fechas y duración */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>📅 Fechas de la Reserva</Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Check-in: </Text>
                                {formatDate(selectedReserva.fechaInicio)}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Check-out: </Text>
                                {formatDate(selectedReserva.fechaFin)}
                            </Text>
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Duración: </Text>
                                {calculateDuration(selectedReserva.fechaInicio, selectedReserva.fechaFin)} días
                            </Text>
                        </View>

                        {/* Precio */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>💰 Información de Pago</Text>
                            <Text style={[styles.modalText, styles.precioText]}>
                                Total: ${selectedReserva.precio?.toLocaleString()}
                            </Text>
                        </View>

                        {/* Observaciones */}
                        {selectedReserva.observaciones && (
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>📝 Observaciones</Text>
                                <Text style={styles.modalText}>
                                    {selectedReserva.observaciones}
                                </Text>
                            </View>
                        )}

                        {/* Fechas de creación/actualización */}
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>ℹ️ Información del Sistema</Text>
                            {selectedReserva.createdAt && (
                                <Text style={styles.modalText}>
                                    <Text style={styles.modalLabel}>Creada: </Text>
                                    {formatDate(selectedReserva.createdAt)}
                                </Text>
                            )}
                            {selectedReserva.updatedAt && (
                                <Text style={styles.modalText}>
                                    <Text style={styles.modalLabel}>Actualizada: </Text>
                                    {formatDate(selectedReserva.updatedAt)}
                                </Text>
                            )}
                            <Text style={styles.modalText}>
                                <Text style={styles.modalLabel}>Estado: </Text>
                                {selectedReserva.activo ? 'Activa' : 'Inactiva'}
                            </Text>
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
                <Text style={styles.headerTitle}>Reservas</Text>
                {canEdit() && (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddReserva}>
                        <Ionicons name="add" size={24} color={colors.textOnPrimary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por usuario, cabaña..."
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

            {/* Lista de reservas */}
            <ScrollView 
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Cargando reservas...</Text>
                    </View>
                ) : filteredReservas.length > 0 ? (
                    filteredReservas.map(renderReservaCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="bed-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No se encontraron reservas</Text>
                        <Text style={styles.emptySubtext}>
                            {searchText || filterEstado !== 'Todos' ? 
                                'Intenta ajustar los filtros de búsqueda' : 
                                'Aún no hay reservas registradas'
                            }
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal de detalles */}
            <ReservaDetailModal />
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
    reservaCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: spacing.md,
        padding: spacing.md,
        ...shadows.medium,
    },
    reservaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    userInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    userName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    userEmail: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    estadoBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    estadoText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
    },
    cabanaInfo: {
        marginBottom: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    cabanaTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    cabanaCategory: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    cabanaCapacity: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    fechasContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    fechaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    fechaLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginLeft: spacing.xs,
        marginRight: spacing.xs,
    },
    fechaValue: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text,
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
    infoLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginRight: spacing.xs,
    },
    infoValue: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.text,
    },
    observacionesContainer: {
        marginBottom: spacing.md,
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
    },
    observacionesLabel: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    observacionesText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        lineHeight: typography.lineHeight.relaxed,
    },
    reservaActions: {
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
    modalEstadoBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 16,
        marginBottom: spacing.lg,
    },
    modalEstadoText: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
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
    modalText: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        marginBottom: spacing.sm,
        lineHeight: typography.lineHeight.relaxed,
    },
    modalLabel: {
        fontWeight: typography.fontWeight.semiBold,
    },
    precioText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.success,
    },
});

export default ReservasScreen;