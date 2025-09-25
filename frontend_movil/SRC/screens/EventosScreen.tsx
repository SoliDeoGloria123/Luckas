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
    RefreshControl,
    Image
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
    const [selectedCategoria, setSelectedCategoria] = useState('Todos');
    const categorias = ['Todos', 'Académico', 'Social', 'Deportivo', 'Espiritual'];

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
    const filteredEventos = eventos.filter(evento => {
        const matchSearch = evento.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            evento.lugar?.toLowerCase().includes(searchText.toLowerCase()) ||
            evento.descripcion?.toLowerCase().includes(searchText.toLowerCase());
        // Soporta categoria como string o como objeto
        let categoriaNombre = '';
        if (typeof evento.categoria === 'string') {
            categoriaNombre = evento.categoria;
        } else if (evento.categoria && typeof evento.categoria.nombre === 'string') {
            categoriaNombre = evento.categoria.nombre;
        }
        const matchCategoria = selectedCategoria === 'Todos' || categoriaNombre === selectedCategoria;
        return matchSearch && matchCategoria;
    });

    // Manejar ver detalles del evento
    const handleVerDetalles = (evento: Evento) => {
        Alert.alert(
            evento.nombre,
            `Fecha: ${evento.fechaEvento}\nHora: ${evento.horaInicio} - ${evento.horaFin}\nLugar: ${evento.lugar}\n\n${evento.descripcion}`
        );
    };

    return (
        <View style={styles.container}>
            {/* Título y subtítulo */}
            <View style={styles.headerWeb}>
                <Text style={styles.tituloWeb}>Eventos del Seminario</Text>
                <Text style={styles.subtituloWeb}>Descubre y participa en los eventos más importantes de nuestra comunidad</Text>
            </View>

            {/* Filtros de categorías */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosContainer} contentContainerStyle={styles.filtrosContent}>
                {categorias.map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.filtroBtn, selectedCategoria === cat && styles.filtroBtnActivo]}
                        onPress={() => setSelectedCategoria(cat)}
                    >
                        <Text style={[styles.filtroText, selectedCategoria === cat && styles.filtroTextActivo]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

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
                            style={styles.eventoCardWeb}
                            onPress={() => handleVerDetalles(evento)}
                        >
                                   {Array.isArray(evento.imagen) && evento.imagen.length > 0 ? (
                                <Image
                                    source={{ uri: `http://localhost:3000/uploads/eventos/${evento.imagen[0]}` }}
                                    style={{
                                        width: '100%',
                                        height: 160,
                                        borderRadius: 10,
                                        backgroundColor: '#e5e7eb',
                                        marginBottom: 12
                                    }}
                                    resizeMode="cover"
                                />
                            ) : (
                                <Image/>
                            )}
                            {/* Prioridad y fecha etiqueta */}
                            <View style={styles.cardHeaderWeb}>

                                {evento.prioridad && (
                                    <View style={[styles.prioridadTag, styles[`prioridad${evento.prioridad}`]]}>
                                        <Text style={styles.prioridadText}>{`Prioridad ${evento.prioridad}`}</Text>
                                    </View>
                                )}
                                <View style={styles.fechaTag}>
                                    <Text style={styles.fechaText}>{eventosService.formatDate(new Date(evento.fechaEvento))}</Text>
                                </View>
                            </View>
                     

                            {/* Título */}
                            <Text style={styles.eventoTitleWeb}>{evento.nombre}</Text>
                            {/* Descripción */}
                            <Text style={styles.eventoDescripcionWeb} numberOfLines={2}>{evento.descripcion}</Text>
                            {/* Info principal */}
                            <View style={styles.infoRowWeb}>
                                <Ionicons name="calendar-outline" size={16} color={colors.primary} />
                                <Text style={styles.infoTextWeb}>{eventosService.formatDate(new Date(evento.fechaEvento))}</Text>
                                <Ionicons name="time-outline" size={16} color={colors.primary} style={{ marginLeft: 8 }} />
                                <Text style={styles.infoTextWeb}>{evento.horaInicio} - {evento.horaFin}</Text>
                            </View>
                            <View style={styles.infoRowWeb}>
                                <Ionicons name="location-outline" size={16} color={colors.primary} />
                                <Text style={styles.infoTextWeb}>{evento.lugar}</Text>
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
    headerWeb: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.lg + 50,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9', // gris claro
        height: 198,
    },
    tituloWeb: {
        fontSize: typography.fontSize.xl + 4,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    subtituloWeb: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
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
    filtroBtn: {
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 14,
        backgroundColor: '#f1f5f9',
        marginRight: spacing.xs,
        minHeight: 28,
        height: 28,
        justifyContent: 'center',
        alignItems: 'center',
    },
    filtroBtnActivo: {
        backgroundColor: colors.primary,
    },
    filtroText: {
        color: colors.textSecondary,
        fontWeight: '600',
        fontSize: 13,
    },
    filtroTextActivo: {
        color: '#fff',
    },
    eventoCardWeb: {
        backgroundColor: colors.surface,
        margin: spacing.md,
        marginBottom: 0,
        padding: spacing.lg,
        borderRadius: 12,
        ...shadows.small,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardHeaderWeb: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    prioridadTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: '#f1f5f9',
        alignSelf: 'flex-start',
    },
    prioridadAlta: {
        backgroundColor: '#dc3545',
    },
    prioridadMedia: {
        backgroundColor: '#ffc107',
    },
    prioridadBaja: {
        backgroundColor: '#28a745',
    },
    prioridadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: typography.fontSize.sm,
    },
    fechaTag: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    fechaText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: typography.fontSize.sm,
    },
    eventoTitleWeb: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    eventoDescripcionWeb: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    infoRowWeb: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    infoTextWeb: {
        fontSize: typography.fontSize.sm,
        color: colors.text,
        marginLeft: 4,
    },
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