import React, { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator, 
    Alert,
    Modal,
    TextInput,
    ScrollView,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { Tarea } from '../types';
import { colors } from '../styles/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { TareaCard } from '../components/Tareas/TareaCard';
import { TareaFilterModal } from '../components/Tareas/TareaFilterModal';
import { TareasHeader } from '../components/Tareas/TareasHeader';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useTareasHandlers } from '../hooks/useTareasHandlers';
import { useCrearTareaForm } from '../hooks/useCrearTareaForm';
import { tareasService } from '../services';

const INITIAL_FILTROS = {
    estado: '',
    prioridad: '',
    categoria: ''
};

export const TareasScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();

    // State hooks
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [showFilters, setShowFilters] = useState(false);
    const [filtros, setFiltros] = useState(INITIAL_FILTROS);

    // Custom hooks for task handling
    const {
        loading,
        refreshing,
        cargarTareas,
        handleCambioEstado,
        onRefresh
    } = useTareasHandlers(user, setTareas);

    // Custom hooks for task creation
    const {
        showCreateModal,
        setShowCreateModal,
        showDatePicker,
        setShowDatePicker,
        nuevaTarea,
        setNuevaTarea,
        asignadoAOptions,
        cargarUsuarios,
        handleDateChange,
        handleCrearTarea
    } = useCrearTareaForm(cargarTareas, user?._id);

    // Load tasks when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            if (user?._id) {
                cargarTareas();
            }
        }, [user?._id, cargarTareas])
    );

    // Load users when create modal is opened
    useEffect(() => {
        if (showCreateModal) {
            cargarUsuarios();
        }
    }, [showCreateModal, cargarUsuarios]);

    // Filter handling
    const aplicarFiltros = useCallback(() => {
        setShowFilters(false);
        cargarTareas();
    }, [setShowFilters, cargarTareas]);

    // User role check
    const canCreateTasks = user?.role === 'admin' || user?.role === 'tesorero';

    // Show loading indicator
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TareasHeader
                onFilterPress={() => setShowFilters(true)}
                cantidadTareas={tareas.length}
            />

            <FlatList
                data={tareas}
                renderItem={({ item }) => (
                    <TareaCard
                        tarea={item}
                        onCambiarEstado={handleCambioEstado}
                        usuarioActual={user}
                    />
                )}
                keyExtractor={item => item._id}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <Icon name="clipboard-outline" size={50} color={colors.gray} />
                        <Text style={styles.emptyText}>No hay tareas disponibles</Text>
                    </View>
                )}
                contentContainerStyle={styles.listContainer}
            />

            {canCreateTasks && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => setShowCreateModal(true)}
                >
                    <Icon name="add" size={24} color="white" />
                </TouchableOpacity>
            )}

            <TareaFilterModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filtros={filtros}
                onFiltrosChange={setFiltros}
                onAplicar={aplicarFiltros}
            />

            <Modal
                visible={showCreateModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowCreateModal(false)}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.modalContainer}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Nueva Tarea</Text>
                            <TouchableOpacity
                                onPress={() => setShowCreateModal(false)}
                                style={styles.closeButton}
                            >
                                <Icon name="close" size={24} color={colors.gray} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Título *</Text>
                                <TextInput
                                    style={styles.input}
                                    value={nuevaTarea.titulo}
                                    onChangeText={(text) => setNuevaTarea({...nuevaTarea, titulo: text})}
                                    placeholder="Ingrese el título de la tarea"
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Descripción *</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={nuevaTarea.descripcion}
                                    onChangeText={(text) => setNuevaTarea({...nuevaTarea, descripcion: text})}
                                    placeholder="Ingrese la descripción"
                                    multiline
                                    numberOfLines={4}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Prioridad *</Text>
                                <View style={styles.prioridadContainer}>
                                    {['Baja', 'Media', 'Alta'].map((prioridad) => (
                                        <TouchableOpacity
                                            key={prioridad}
                                            style={[
                                                styles.prioridadButton,
                                                nuevaTarea.prioridad === prioridad && styles.prioridadButtonActive,
                                                { backgroundColor: tareasService.getPrioridadColor(prioridad) }
                                            ]}
                                            onPress={() => setNuevaTarea({...nuevaTarea, prioridad})}
                                        >
                                            <Text style={styles.prioridadButtonText}>
                                                {prioridad}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Asignar a *</Text>
                                <View style={styles.pickerContainer}>
                                    <Picker
                                        selectedValue={nuevaTarea.asignadoA}
                                        onValueChange={(itemValue) =>
                                            setNuevaTarea({...nuevaTarea, asignadoA: itemValue})
                                        }
                                        style={styles.picker}
                                    >
                                        <Picker.Item label="Seleccione un usuario" value="" />
                                        {asignadoAOptions.map((user) => (
                                            <Picker.Item 
                                                key={user._id}
                                                label={`${user.nombre} ${user.apellido}`}
                                                value={user._id}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Fecha Límite *</Text>
                                <TouchableOpacity
                                    style={styles.dateButton}
                                    onPress={() => setShowDatePicker(true)}
                                >
                                    <Text style={styles.dateButtonText}>
                                        {nuevaTarea.fechaLimite.toLocaleDateString()}
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={handleCrearTarea}
                            >
                                <Text style={styles.submitButtonText}>Crear Tarea</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {showDatePicker && (
                <DateTimePicker
                    testID="dateTimePicker"
                    value={nuevaTarea.fechaLimite}
                    mode="date"
                    is24Hour={true}
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    locale="es-ES"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    listContainer: {
        flexGrow: 1,
        padding: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 32,
    },
    emptyText: {
        marginTop: 8,
        fontSize: 16,
        color: '#757575',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: colors.primary,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
        zIndex: 999,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333333',
    },
    closeButton: {
        padding: 8,
    },
    formContainer: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#FFFFFF',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    prioridadContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    prioridadButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        alignItems: 'center',
    },
    prioridadButtonActive: {
        transform: [{ scale: 1.05 }],
    },
    prioridadButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    pickerContainer: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        marginBottom: 15,
    },
    picker: {
        height: 50,
    },
    dateButton: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333333',
    },
    submitButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 24,
        marginBottom: 32,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});