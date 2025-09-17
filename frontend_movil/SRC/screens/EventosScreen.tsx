// Pantalla de gestión de eventos

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
    Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { eventosService } from '../services/eventos';
import { Evento } from '../types';
import { colors, spacing, typography, shadows } from '../styles';

const EventosScreen: React.FC = () => {
    const { canEdit, canDelete, user } = useAuth();
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Cargar eventos
    const loadEventos = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await eventosService.getAllEventos();
            if (response.success && response.data) {
                setEventos(response.data);
            } else {
                Alert.alert('Error', response.message || 'No se pudieron cargar los eventos');
                setEventos([]);
            }
        } catch (error) {
            console.error('Error loading eventos:', error);
            Alert.alert('Error', 'Error de conexión');
            setEventos([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadEventos();
    }, [loadEventos]);

    // Refrescar eventos
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadEventos();
        setRefreshing(false);
    }, [loadEventos]);

    // Filtrar eventos por búsqueda
    const filteredEventos = eventos.filter(evento =>
        evento.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        evento.lugar.toLowerCase().includes(searchText.toLowerCase()) ||
        evento.descripcion.toLowerCase().includes(searchText.toLowerCase())
    );

    // Manejar agregar evento
    const handleAddEvento = () => {
        if (canEdit()) {
            Alert.alert('Información', 'Función de agregar evento en desarrollo');
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para agregar eventos');
        }
    };

    // Manejar editar evento
    const handleEditEvento = (evento: Evento) => {
        if (canEdit()) {
            Alert.alert('Información', `Editar evento "${evento.nombre}" - En desarrollo`);
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para editar eventos');
        }
    };

    // Manejar eliminar evento
    const handleDeleteEvento = (evento: Evento) => {
        if (canDelete()) {
            Alert.alert(
                'Eliminar Evento',
                `¿Estás seguro de que quieres eliminar "${evento.nombre}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { 
                        text: 'Eliminar', 
                        style: 'destructive', 
                        onPress: async () => {
                            try {
                                const response = await eventosService.deleteEvento(evento._id);
                                if (response.success) {
                                    Alert.alert('Éxito', 'Evento eliminado correctamente');
                                    loadEventos();
                                } else {
                                    Alert.alert('Error', response.message || 'No se pudo eliminar el evento');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Error de conexión');
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para eliminar eventos');
        }
    };

    // Mostrar detalles del evento
    const showEventoDetails = (evento: Evento) => {
        setSelectedEvento(evento);
        setShowModal(true);
    };

    // Formatear fecha
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Obtener color por prioridad
    const getPriorityColor = (prioridad: string) => {
        switch (prioridad) {
            case 'Alta': return colors.danger;
            case 'Media': return colors.warning;
            case 'Baja': return colors.success;
            default: return colors.textSecondary;
        }
    };

    // Renderizar card de evento
    const renderEventoCard = (evento: Evento) => (
        <TouchableOpacity 
            key={evento._id} 
            style={styles.eventoCard}
            onPress={() => showEventoDetails(evento)}
        >
            {/* Imagen del evento */}
            {evento.imagen && evento.imagen.length > 0 && (
                <Image 
                    source={{ uri: evento.imagen[0] }} 
                    style={styles.eventoImage}
                    resizeMode="cover"
                />
            )}
            
            <View style={styles.eventoContent}>
                {/* Header con título y prioridad */}
                <View style={styles.eventoHeader}>
                    <View style={styles.eventoInfo}>
                        <Text style={styles.eventoTitle}>{evento.nombre}</Text>
                        <Text style={styles.eventoLugar}>📍 {evento.lugar}</Text>
                    </View>
                    <View style={[
                        styles.priorityBadge,
                        { backgroundColor: getPriorityColor(evento.prioridad) + '20' }
                    ]}>
                        <Text style={[
                            styles.priorityText,
                            { color: getPriorityColor(evento.prioridad) }
                        ]}>
                            {evento.prioridad}
                        </Text>
                    </View>
                </View>

                {/* Fecha y hora */}
                <View style={styles.eventoDateTime}>
                    <Text style={styles.eventoFecha}>
                        📅 {formatDate(evento.fechaEvento)}
                    </Text>
                    <Text style={styles.eventoHora}>
                        🕐 {evento.horaInicio} - {evento.horaFin}
                    </Text>
                </View>

                {/* Descripción */}
                <Text style={styles.eventoDescription} numberOfLines={2}>
                    {evento.descripcion}
                </Text>

                {/* Info adicional */}
                <View style={styles.eventoFooter}>
                    <View style={styles.footerInfo}>
                        <Text style={styles.eventoPrecio}>
                            💰 ${evento.precio.toLocaleString()}
                        </Text>
                        <Text style={styles.eventoCupos}>
                            👥 {evento.cuposDisponibles}/{evento.cuposTotales}
                        </Text>
                    </View>
                    
                    {/* Etiquetas */}
                    {evento.etiquetas.length > 0 && (
                        <View style={styles.etiquetasContainer}>
                            {evento.etiquetas.slice(0, 2).map((etiqueta, index) => (
                                <View key={index} style={styles.etiqueta}>
                                    <Text style={styles.etiquetaText}>{etiqueta}</Text>
                                </View>
                            ))}
                            {evento.etiquetas.length > 2 && (
                                <Text style={styles.masEtiquetas}>+{evento.etiquetas.length - 2}</Text>
                            )}
                        </View>
                    )}
                </View>

                {/* Acciones */}
                <View style={styles.eventoActions}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => showEventoDetails(evento)}
                    >
                        <Ionicons name="eye-outline" size={20} color={colors.primary} />
                        <Text style={styles.actionText}>Ver</Text>
                    </TouchableOpacity>
                    
                    {canEdit() && (
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleEditEvento(evento)}
                        >
                            <Ionicons name="pencil-outline" size={20} color={colors.warning} />
                            <Text style={styles.actionText}>Editar</Text>
                        </TouchableOpacity>
                    )}
                    
                    {canDelete() && (
                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => handleDeleteEvento(evento)}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.danger} />
                            <Text style={styles.actionText}>Eliminar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    // Modal de detalles del evento
    const EventoDetailModal = () => {
        if (!selectedEvento) return null;

        return (
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Detalles del Evento</Text>
                        <TouchableOpacity onPress={() => setShowModal(false)}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>
                    
                    <ScrollView style={styles.modalContent}>
                        {/* Contenido del modal con detalles completos */}
                        <Text style={styles.modalEventoTitle}>{selectedEvento.nombre}</Text>
                        <Text style={styles.modalEventoDescription}>{selectedEvento.descripcion}</Text>
                        
                        <View style={styles.modalSection}>
                            <Text style={styles.modalSectionTitle}>Información del Evento</Text>
                            <Text>📅 Fecha: {formatDate(selectedEvento.fechaEvento)}</Text>
                            <Text>🕐 Horario: {selectedEvento.horaInicio} - {selectedEvento.horaFin}</Text>
                            <Text>📍 Lugar: {selectedEvento.lugar}</Text>
                            {selectedEvento.direccion && (
                                <Text>📍 Dirección: {selectedEvento.direccion}</Text>
                            )}
                            <Text>💰 Precio: ${selectedEvento.precio.toLocaleString()}</Text>
                            <Text>👥 Cupos: {selectedEvento.cuposDisponibles}/{selectedEvento.cuposTotales}</Text>
                            <Text>📅 Duración: {selectedEvento.duracionDias} día(s)</Text>
                        </View>

                        {selectedEvento.programa.length > 0 && (
                            <View style={styles.modalSection}>
                                <Text style={styles.modalSectionTitle}>Programa</Text>
                                {selectedEvento.programa.map((item, index) => (
                                    <View key={index} style={styles.programaItem}>
                                        <Text style={styles.programaHora}>
                                            {item.horaInicio} - {item.horaFin}
                                        </Text>
                                        <Text style={styles.programaTema}>{item.tema}</Text>
                                        <Text style={styles.programaDescripcion}>{item.descripcion}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>
                </View>
            </Modal>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Eventos</Text>
                {canEdit() && (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddEvento}>
                        <Ionicons name="add" size={24} color={colors.textOnPrimary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar eventos..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Lista de eventos */}
            <ScrollView 
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Cargando eventos...</Text>
                    </View>
                ) : filteredEventos.length > 0 ? (
                    filteredEventos.map(renderEventoCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No se encontraron eventos</Text>
                        <Text style={styles.emptySubtext}>
                            {searchText ? 'Intenta con otros términos de búsqueda' : 'Aún no hay eventos registrados'}
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Modal de detalles */}
            <EventoDetailModal />
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
    eventoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        marginBottom: spacing.md,
        overflow: 'hidden',
        ...shadows.medium,
    },
    eventoImage: {
        width: '100%',
        height: 150,
    },
    eventoContent: {
        padding: spacing.md,
    },
    eventoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    eventoInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    eventoTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    eventoLugar: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    priorityBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    priorityText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
    },
    eventoDateTime: {
        marginBottom: spacing.sm,
    },
    eventoFecha: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    eventoHora: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    eventoDescription: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        lineHeight: typography.lineHeight.relaxed,
        marginBottom: spacing.md,
    },
    eventoFooter: {
        marginBottom: spacing.md,
    },
    footerInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.sm,
    },
    eventoPrecio: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.success,
    },
    eventoCupos: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    etiquetasContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    etiqueta: {
        backgroundColor: colors.primary + '20',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
        marginRight: spacing.xs,
    },
    etiquetaText: {
        fontSize: typography.fontSize.xs,
        color: colors.primary,
    },
    masEtiquetas: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
    },
    eventoActions: {
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
    modalEventoTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    modalEventoDescription: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        lineHeight: typography.lineHeight.relaxed,
        marginBottom: spacing.lg,
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
    programaItem: {
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 8,
        marginBottom: spacing.sm,
    },
    programaHora: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.primary,
        marginBottom: spacing.xs,
    },
    programaTema: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    programaDescripcion: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
});

export default EventosScreen;