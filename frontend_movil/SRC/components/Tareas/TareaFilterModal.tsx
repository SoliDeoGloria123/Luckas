import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles/colors';
import { tareasService } from '../../services';

interface Filtros {
    estado: string;
    prioridad: string;
    categoria: string;
}

interface TareaFilterModalProps {
    visible: boolean;
    onClose: () => void;
    filtros: Filtros;
    onFiltrosChange: (filtros: Filtros) => void;
    onAplicar: () => void;
}

export const TareaFilterModal: React.FC<TareaFilterModalProps> = ({
    visible,
    onClose,
    filtros,
    onFiltrosChange,
    onAplicar,
}) => {
    const estados = [
        { label: 'Pendiente', value: 'pendiente' },
        { label: 'En Progreso', value: 'en_progreso' },
        { label: 'Completada', value: 'completada' },
        { label: 'Cancelada', value: 'cancelada' }
    ];
    
    const prioridades = [
        { label: 'Alta', value: 'alta' },
        { label: 'Media', value: 'media' },
        { label: 'Baja', value: 'baja' }
    ];

    const handleEstadoPress = (estado: string) => {
        onFiltrosChange({
            ...filtros,
            estado: filtros.estado === estado ? '' : estado
        });
    };

    const handlePrioridadPress = (prioridad: string) => {
        onFiltrosChange({
            ...filtros,
            prioridad: filtros.prioridad === prioridad ? '' : prioridad
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Filtrar Tareas</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color={colors.text.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Estado</Text>
                        <View style={styles.optionsContainer}>
                            {estados.map((estado) => (
                                <TouchableOpacity
                                    key={estado.value}
                                    style={[
                                        styles.filterChip,
                                        filtros.estado === estado.value && styles.filterChipSelected,
                                        { borderColor: tareasService.getEstadoColor(estado.value) }
                                    ]}
                                    onPress={() => handleEstadoPress(estado.value)}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        filtros.estado === estado.value && styles.filterChipTextSelected
                                    ]}>
                                        {estado.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Prioridad</Text>
                        <View style={styles.optionsContainer}>
                            {prioridades.map((prioridad) => (
                                <TouchableOpacity
                                    key={prioridad.value}
                                    style={[
                                        styles.filterChip,
                                        filtros.prioridad === prioridad.value && styles.filterChipSelected,
                                        { borderColor: tareasService.getPrioridadColor(prioridad.value) }
                                    ]}
                                    onPress={() => handlePrioridadPress(prioridad.value)}
                                >
                                    <Text style={[
                                        styles.filterChipText,
                                        filtros.prioridad === prioridad.value && styles.filterChipTextSelected
                                    ]}>
                                        {prioridad.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={onClose}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.applyButton]}
                            onPress={() => {
                                onAplicar();
                                onClose();
                            }}
                        >
                            <Text style={[styles.buttonText, styles.applyButtonText]}>
                                Aplicar Filtros
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: colors.transparent.black40,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 32,
        maxHeight: '80%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -4,
    },
    filterChip: {
        backgroundColor: colors.background,
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 6,
        margin: 4,
        borderWidth: 1,
        borderColor: colors.divider,
    },
    filterChipSelected: {
        backgroundColor: colors.transparent.black10,
    },
    filterChipText: {
        color: colors.text.primary,
        fontSize: 14,
        fontWeight: '500',
    },
    filterChipTextSelected: {
        color: colors.text.primary,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 16,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
        marginLeft: 12,
    },
    cancelButton: {
        backgroundColor: colors.background,
    },
    applyButton: {
        backgroundColor: colors.primary,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    applyButtonText: {
        color: colors.white,
    },
});