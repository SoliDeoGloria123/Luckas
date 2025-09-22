import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles/colors';
import { Tarea, User } from '../../types';
import { tareasService } from '../../services';

interface TareaCardProps {
    tarea: Tarea;
    onCambiarEstado: (tareaId: string, nuevoEstado: string) => void;
    usuarioActual: User | null;
}

export const TareaCard: React.FC<TareaCardProps> = ({
    tarea,
    onCambiarEstado,
    usuarioActual
}) => {
    const puedeEditarEstado = usuarioActual &&
        (usuarioActual.role === 'admin' ||
         usuarioActual.role === 'tesorero' ||
         usuarioActual._id === String(tarea.asignadoA));

    const getEstadoSiguiente = (estadoActual: string): string => {
        const estados = ['pendiente', 'en_progreso', 'completada'];
        const indiceActual = estados.indexOf(estadoActual);
        if (indiceActual === -1 || indiceActual === estados.length - 1) {
            return estados[0];
        }
        return estados[indiceActual + 1];
    };

    return (
        <View style={[
            styles.card,
            { borderLeftColor: tareasService.getPrioridadColor(tarea.prioridad) }
        ]}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{tarea.titulo}</Text>
                    <View style={[
                        styles.estadoBadge,
                        { backgroundColor: tareasService.getEstadoColor(tarea.estado) }
                    ]}>
                        <Text style={styles.estadoText}>{tarea.estado}</Text>
                    </View>
                </View>
                {puedeEditarEstado && (
                    <TouchableOpacity
                        onPress={() => onCambiarEstado(tarea._id, getEstadoSiguiente(tarea.estado))}
                        style={styles.estadoButton}
                    >
                        <Icon
                            name={tarea.estado === 'pendiente' ? 'time' : tarea.estado === 'en_progreso' ? 'sync' : tarea.estado === 'completada' ? 'checkmark-circle' : 'close-circle'}
                            size={24}
                            color={colors.primary}
                        />
                    </TouchableOpacity>
                )}
            </View>

            <Text style={styles.description}>{tarea.descripcion}</Text>

            <View style={styles.metaInfo}>
                <View style={styles.metaItem}>
                    <Icon name="calendar-outline" size={16} color={colors.gray} />
                    <Text style={styles.metaText}>
                        Límite: {tareasService.formatDate(tarea.fechaLimite)}
                    </Text>
                </View>
                {tarea.categoria && (
                    <View style={styles.metaItem}>
                        <Icon name="bookmark-outline" size={16} color={colors.gray} />
                        <Text style={styles.metaText}>{tarea.categoria}</Text>
                    </View>
                )}
            </View>

            {tarea.etiquetas && tarea.etiquetas.length > 0 && (
                <View style={styles.tags}>
                    {tarea.etiquetas.map((etiqueta: string, index: number) => (
                        <View key={`tag-${index}`} style={styles.tag}>
                            <Text style={styles.tagText}>{etiqueta}</Text>
                        </View>
                    ))}
                </View>
            )}

            {tarea.observaciones && (
                <Text style={styles.observaciones}>{tarea.observaciones}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginRight: 8,
    },
    estadoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    estadoText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    estadoButton: {
        padding: 8,
    },
    description: {
        color: colors.text.secondary,
        marginBottom: 12,
    },
    metaInfo: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        color: colors.text.secondary,
        fontSize: 12,
        marginLeft: 4,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tag: {
        backgroundColor: colors.transparent.black10,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        color: colors.text.secondary,
        fontSize: 12,
    },
    observaciones: {
        color: colors.text.secondary,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 8,
    },
});