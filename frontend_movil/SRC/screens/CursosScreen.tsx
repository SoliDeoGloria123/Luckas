// Pantalla de lista de cursos

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, shadows } from '../styles';

const CursosScreen: React.FC = () => {
    const { canEdit, canDelete } = useAuth();
    const [searchText, setSearchText] = useState('');

    // Datos de ejemplo - en una app real vendrían de la API
    const cursos = [
        {
            id: '1',
            nombre: 'Teología Fundamental',
            descripcion: 'Curso básico de teología para seminaristas',
            duracion: '6 meses',
            estado: 'activo',
            instructor: 'P. José González'
        },
        {
            id: '2',
            nombre: 'Historia de la Iglesia',
            descripcion: 'Estudio de la historia eclesiástica',
            duracion: '4 meses',
            estado: 'activo',
            instructor: 'P. María Rodríguez'
        },
        {
            id: '3',
            nombre: 'Filosofía Cristiana',
            descripcion: 'Fundamentos de la filosofía desde la perspectiva cristiana',
            duracion: '5 meses',
            estado: 'inactivo',
            instructor: 'P. Carlos Méndez'
        }
    ];

    const filteredCursos = cursos.filter(curso =>
        curso.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        curso.instructor.toLowerCase().includes(searchText.toLowerCase())
    );

    const handleAddCurso = () => {
        if (canEdit()) {
            Alert.alert('Información', 'Función de agregar curso en desarrollo');
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para agregar cursos');
        }
    };

    const handleEditCurso = (cursoId: string) => {
        if (canEdit()) {
            Alert.alert('Información', `Editar curso ${cursoId} - En desarrollo`);
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para editar cursos');
        }
    };

    const handleDeleteCurso = (cursoId: string) => {
        if (canDelete()) {
            Alert.alert(
                'Eliminar Curso',
                '¿Estás seguro de que quieres eliminar este curso?',
                [
                    { text: 'Cancelar', style: 'cancel' },
                    { text: 'Eliminar', style: 'destructive', onPress: () => {
                        Alert.alert('Información', `Curso ${cursoId} eliminado - En desarrollo`);
                    }}
                ]
            );
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para eliminar cursos');
        }
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
                {canEdit() && (
                    <TouchableOpacity style={styles.addButton} onPress={handleAddCurso}>
                        <Ionicons name="add" size={24} color={colors.textOnPrimary} />
                    </TouchableOpacity>
                )}
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