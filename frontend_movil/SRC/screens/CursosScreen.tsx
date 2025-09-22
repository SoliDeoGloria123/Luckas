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
import { useAuth } from '../contexts/AuthContext';
import { cursosService } from '../services/cursos';
import { colors, spacing, typography, shadows } from '../styles';

const CursosScreen: React.FC = () => {
    const { canEdit, canDelete, user, hasRole } = useAuth();
    const [cursos, setCursos] = useState<any[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Verificar si el usuario tiene permisos para ver cursos
    useEffect(() => {
        if (!user || (!hasRole('admin') && !hasRole('tesorero') && !hasRole('seminarista'))) {
            Alert.alert(
                'Acceso Denegado',
                'No tienes permisos para ver la información de los cursos',
                [{ text: 'OK' }]
            );
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
                setCursos(response.data);
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

    const filteredCursos = cursos.filter(curso =>
        curso.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        curso.instructor.toLowerCase().includes(searchText.toLowerCase())
    );

    // Nota: Funcionalidad de agregar cursos deshabilitada
    const handleEditCurso = (cursoId: string) => {
        Alert.alert('Solo Visualización', 'La funcionalidad de edición no está disponible en la versión móvil');
    };

    const handleDeleteCurso = (cursoId: string) => {
        Alert.alert('Solo Visualización', 'La funcionalidad de eliminación no está disponible en la versión móvil');
    };

    const renderCursoCard = (curso: any) => (
        <View key={curso.id} style={styles.cursoCard}>
            <View style={styles.cursoHeader}>
                <View style={styles.cursoInfo}>
                    <Text style={styles.cursoTitle}>{curso.nombre}</Text>
                    <Text style={styles.cursoInstructor}>Por: {curso.instructor}</Text>
                    <Text style={styles.cursoDuracion}>Duración: {curso.duracion}</Text>
                </View>
                <View style={[
                    styles.statusBadge,
                    curso.estado === 'activo' ? styles.statusActive : styles.statusInactive
                ]}>
                    <Text style={[
                        styles.statusText,
                        curso.estado === 'activo' ? styles.statusActiveText : styles.statusInactiveText
                    ]}>
                        {curso.estado}
                    </Text>
                </View>
            </View>
            
            <Text style={styles.cursoDescription}>{curso.descripcion}</Text>
            
            <View style={styles.cursoActions}>
                <TouchableOpacity 
                    style={styles.actionButton}
                    onPress={() => Alert.alert('Información', 'Ver detalles - En desarrollo')}
                >
                    <Ionicons name="eye-outline" size={20} color={colors.primary} />
                    <Text style={styles.actionText}>Ver</Text>
                </TouchableOpacity>
                
                {canEdit() && (
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleEditCurso(curso.id)}
                    >
                        <Ionicons name="pencil-outline" size={20} color={colors.warning} />
                        <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>
                )}
                
                {canDelete() && (
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleDeleteCurso(curso.id)}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                        <Text style={styles.actionText}>Eliminar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cursos</Text>
            </View>

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
    cursoCard: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        ...shadows.medium,
    },
    cursoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.sm,
    },
    cursoInfo: {
        flex: 1,
        marginRight: spacing.sm,
    },
    cursoTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    cursoInstructor: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    cursoDuracion: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    statusBadge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: colors.success + '20',
    },
    statusInactive: {
        backgroundColor: colors.danger + '20',
    },
    statusText: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
        textTransform: 'capitalize',
    },
    statusActiveText: {
        color: colors.success,
    },
    statusInactiveText: {
        color: colors.danger,
    },
    cursoDescription: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        lineHeight: typography.lineHeight.relaxed,
        marginBottom: spacing.md,
    },
    cursoActions: {
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
});

export default CursosScreen;