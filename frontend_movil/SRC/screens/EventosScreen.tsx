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
    RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { eventosService } from '../services/eventos';
import { Evento } from '../types';
import { colors, spacing, typography, shadows } from '../styles';

const EventosScreen: React.FC = () => {
    const { canEdit, canDelete, user, hasRole } = useAuth();
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Verificar si el usuario tiene permisos para ver eventos
    useEffect(() => {
        if (!user || (!hasRole('admin') && !hasRole('tesorero') && !hasRole('seminarista'))) {
            Alert.alert(
                'Acceso Denegado',
                'No tienes permisos para ver la información de los eventos',
                [{ text: 'OK' }]
            );
            return;
        }
        loadEventos();
    }, [user, hasRole]);

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

    // Refrescar eventos
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadEventos();
        setRefreshing(false);
    }, [loadEventos]);

    // Filtrar eventos por búsqueda
    const filteredEventos = eventos.filter(evento =>
        evento.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        evento.lugar?.toLowerCase().includes(searchText.toLowerCase()) ||
        evento.descripcion?.toLowerCase().includes(searchText.toLowerCase())
    );

    // Manejar ver detalles del evento
    const handleVerDetalles = (evento: Evento) => {
        Alert.alert(
            evento.nombre,
            `Fecha: ${evento.fechaEvento}\nHora: ${evento.horaInicio} - ${evento.horaFin}\nLugar: ${evento.lugar}\n\n${evento.descripcion}`
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Eventos</Text>
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
                        <Text style={styles.loadingText}>Cargando eventos...</Text>
                    </View>
                ) : filteredEventos.length > 0 ? (
                    filteredEventos.map(evento => (
                        <TouchableOpacity
                            key={evento._id}
                            style={styles.eventoCard}
                            onPress={() => handleVerDetalles(evento)}
                        >
                            <View style={styles.eventoHeader}>
                                <Text style={styles.eventoTitle}>{evento.nombre}</Text>
                                <View style={styles.eventoMeta}>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                                        <Text style={styles.metaText}>{eventosService.formatDate(new Date(evento.fechaEvento))}</Text>
                                    </View>
                                    <View style={styles.metaItem}>
                                        <Ionicons name="time-outline" size={16} color={colors.primary} />
                                        <Text style={styles.metaText}>{evento.horaInicio} - {evento.horaFin}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            <Text style={styles.eventoDescripcion} numberOfLines={2}>
                                {evento.descripcion}
                            </Text>

                            <View style={styles.eventoFooter}>
                                <View style={styles.metaItem}>
                                    <Ionicons name="location-outline" size={16} color={colors.primary} />
                                    <Text style={styles.metaText}>{evento.lugar}</Text>
                                </View>
                                <View style={styles.metaItem}>
                                    <Ionicons name="people-outline" size={16} color={colors.primary} />
                                    <Text style={styles.metaText}>{evento.cupos} cupos</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
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
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        ...shadows.small,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
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
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    loadingText: {
        fontSize: typography.fontSize.lg,
        color: colors.textSecondary,
    },
    eventoCard: {
        backgroundColor: colors.surface,
        margin: spacing.md,
        marginBottom: 0,
        padding: spacing.lg,
        borderRadius: 8,
        ...shadows.small,
    },
    eventoHeader: {
        marginBottom: spacing.md,
    },
    eventoTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    eventoMeta: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    metaText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    eventoDescripcion: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        marginBottom: spacing.md,
    },
    eventoFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    emptyText: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.textSecondary,
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    emptySubtext: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        textAlign: 'center',
    },
});

export default EventosScreen;