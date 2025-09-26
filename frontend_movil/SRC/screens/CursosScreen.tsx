// Pantalla de lista de cursos
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
import { cursosService } from '../services/cursos';
import { colors, spacing, typography, shadows } from '../styles';

const CursosScreen: React.FC = () => {
    const { canEdit, canDelete, user, hasRole } = useAuth();
    const [cursos, setCursos] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedModalidad, setSelectedModalidad] = useState('Todas');
    const [selectedEstado, setSelectedEstado] = useState('Todos');
    const modalidades = ['Todas', 'Presencial', 'Virtual', 'Semipresencial'];
    const estados = ['Todos', 'Activo', 'Inactivo', 'Finalizado', 'Suspendido'];

    // Verificar si el usuario tiene permisos para ver cursos
    useEffect(() => {
        if (!user || (!hasRole('admin') && !hasRole('tesorero') && !hasRole('seminarista'))) {
            // Aquí podrías redirigir al usuario a otra pantalla si lo deseas
            return;
        }
        loadCursos();
    }, [user, hasRole]);

    // Cargar cursos desde el backend
    const loadCursos = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await cursosService.getAllCursos();
            if (response.success && response.data) {
                // Forzar el tipo de la respuesta para evitar errores de tipado
                const cursosArray = Array.isArray(response.data)
                    ? response.data
                    : Array.isArray((response.data as any).data)
                        ? (response.data as any).data
                        : [];
                setCursos(cursosArray);
            } else {
                Alert.alert('Error', response.message || 'No se pudieron cargar los cursos');
                setCursos([]);
            }
        } catch (error) {
            console.error('Error loading cursos:', error);
            Alert.alert('Error', 'Error de conexión');
            setCursos([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const filteredCursos = cursos.filter(curso => {
        const matchSearch = curso.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            curso.instructor.toLowerCase().includes(searchText.toLowerCase());
        const matchModalidad = selectedModalidad === 'Todas' || (curso.modalidad && curso.modalidad.toLowerCase() === selectedModalidad.toLowerCase());
        const matchEstado = selectedEstado === 'Todos' || (curso.estado && curso.estado.toLowerCase() === selectedEstado.toLowerCase());
        return matchSearch && matchModalidad && matchEstado;
    });

    // Nota: Funcionalidad de agregar cursos deshabilitada
    const handleEditCurso = (cursoId: string) => {
        Alert.alert('Solo Visualización', 'La funcionalidad de edición no está disponible en la versión móvil');
    };

    const handleDeleteCurso = (cursoId: string) => {
        Alert.alert('Solo Visualización', 'La funcionalidad de eliminación no está disponible en la versión móvil');
    };

    const renderCursoCard = (curso: any) => (
        <View key={curso._id || curso.id} style={styles.cursoCardWeb}>
            <View style={styles.cardHeaderWeb}>
                <View style={[styles.modalidadTag, styles[`modalidad${curso.modalidad}`]]}>
                    <Text style={styles.modalidadText}>{curso.modalidad}</Text>
                </View>
                <View style={[styles.estadoTag, styles[`estado${curso.estado}`]]}>
                    <Text style={styles.estadoText}>{curso.estado}</Text>
                </View>
            </View>
            <Text style={styles.cursoTitleWeb}>{curso.nombre}</Text>
            <Text style={styles.cursoInstructorWeb}>Por: {curso.instructor}</Text>
            <Text style={styles.cursoDuracionWeb}>
                Duración: {curso.duracion?.horas ? `${curso.duracion.horas} horas` : ''} {curso.duracion?.semanas ? `/ ${curso.duracion.semanas} semanas` : ''}
            </Text>
            <Text style={styles.cursoDescripcionWeb} numberOfLines={2}>{curso.descripcion}</Text>
            <View style={styles.cursoActionsWeb}>
                <TouchableOpacity 
                    style={styles.actionButtonWeb}
                    onPress={() => Alert.alert('Información', `Nombre: ${curso.nombre}\nInstructor: ${curso.instructor}\nModalidad: ${curso.modalidad}\nDuración: ${curso.duracion?.horas || ''} horas / ${curso.duracion?.semanas || ''} semanas\nDescripción: ${curso.descripcion}`)}
                >
                    <Ionicons name="eye-outline" size={20} color={colors.primary} />
                    <Text style={styles.actionTextWeb}>Ver</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header moderno */}
            <View style={styles.headerWeb}>
                <Text style={styles.tituloWeb}>Cursos y Talleres</Text>
                <Text style={styles.subtituloWeb}>Explora y participa en los cursos más importantes del seminario</Text>
            </View>

            {/* Filtros de modalidad */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosContainer} contentContainerStyle={styles.filtrosContent}>
                {modalidades.map(mod => (
                    <TouchableOpacity
                        key={mod}
                        style={[styles.filtroBtn, selectedModalidad === mod && styles.filtroBtnActivo]}
                        onPress={() => setSelectedModalidad(mod)}
                    >
                        <Text style={[styles.filtroText, selectedModalidad === mod && styles.filtroTextActivo]}>{mod}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            {/* Filtros de estado */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosContainer} contentContainerStyle={styles.filtrosContent}>
                {estados.map(est => (
                    <TouchableOpacity
                        key={est}
                        style={[styles.filtroBtn, selectedEstado === est && styles.filtroBtnActivo]}
                        onPress={() => setSelectedEstado(est)}
                    >
                        <Text style={[styles.filtroText, selectedEstado === est && styles.filtroTextActivo]}>{est}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Barra de búsqueda */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={colors.textSecondary} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar cursos..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>

            {/* Lista de cursos */}
            <ScrollView style={styles.scrollContainer}>
                {filteredCursos.length > 0 ? (
                    filteredCursos.map(renderCursoCard)
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="school-outline" size={64} color={colors.textSecondary} />
                        <Text style={styles.emptyText}>No se encontraron cursos</Text>
                        <Text style={styles.emptySubtext}>
                            {searchText ? 'Intenta con otros términos de búsqueda' : 'Aún no hay cursos registrados'}
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    searchContainer: {
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
        flex: 1,
        marginLeft: spacing.sm,
        fontSize: typography.fontSize.md,
        color: colors.text,
        backgroundColor: 'transparent',
        borderWidth: 0,
        paddingVertical: 2,
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    headerWeb: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.lg + 40,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        height: 170,
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
    cursoCardWeb: {
        backgroundColor: colors.surface,
        margin: spacing.md,
        marginBottom: 0,
        padding: spacing.lg,
        borderRadius: 12,
        ...shadows.medium,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    cardHeaderWeb: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    modalidadTag: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        backgroundColor: '#8b5cf6',
        alignSelf: 'flex-start',
    },
    modalidadPresencial: {
        backgroundColor: '#059669',
    },
    modalidadVirtual: {
        backgroundColor: '#2563eb',
    },
    modalidadSemipresencial: {
        backgroundColor: '#1d4ed8',
    },
    modalidadText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: typography.fontSize.sm,
    },
    estadoTag: {
        backgroundColor: '#f1f5f9',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    estadoActivo: {
        backgroundColor: '#059669',
    },
    estadoInactivo: {
        backgroundColor: '#334155',
    },
    estadoFinalizado: {
        backgroundColor: '#8b5cf6',
    },
    estadoSuspendido: {
        backgroundColor: '#dc3545',
    },
    estadoText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: typography.fontSize.sm,
        textTransform: 'capitalize',
    },
    cursoTitleWeb: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    cursoInstructorWeb: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    cursoDuracionWeb: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    cursoDescripcionWeb: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    cursoActionsWeb: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: colors.borderLight,
        paddingTop: spacing.sm,
    },
    actionButtonWeb: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginLeft: spacing.sm,
    },
    actionTextWeb: {
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
});

export default CursosScreen;