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
    KeyboardAvoidingView,
    RefreshControl
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../context/AuthContext';
import { Tarea, User } from '../types';
import { colors, spacing, typography, shadows } from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { tareasService } from '../services';




const INITIAL_FILTROS = {
    estado: '',
    prioridad: '',
    categoria: ''
};

interface TareaFormData {
    titulo: string;
    descripcion: string;
    prioridad: string;
    asignadoA: string;
    fechaLimite: Date;
    categoria?: string;
    etiquetas?: string[];
}

export const TareasScreen = () => {
    const { user, loading: authLoading } = useAuth();
    const navigation = useNavigation();

    // State hooks
    const [tareas, setTareas] = useState<Tarea[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filtros, setFiltros] = useState(INITIAL_FILTROS);
    
    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [asignadoAOptions, setAsignadoAOptions] = useState<User[]>([]);
    
    // Form data
    const [nuevaTarea, setNuevaTarea] = useState<TareaFormData>({
        titulo: '',
        descripcion: '',
        prioridad: 'Media',
        asignadoA: '',
        fechaLimite: new Date(),
        categoria: '',
        etiquetas: []
    });
    const [editingTarea, setEditingTarea] = useState<Tarea | null>(null);

    // Helper functions
    const getEstadoSiguiente = (estadoActual: string): string => {
        const estados = ['pendiente', 'en_progreso', 'completada'];
        const indiceActual = estados.indexOf(estadoActual);
        if (indiceActual === -1 || indiceActual === estados.length - 1) {
            return estados[0];
        }
        return estados[indiceActual + 1];
    };

    // API functions
    const cargarTareas = useCallback(async () => {
        if (!user?._id) return;
        try {
            setLoading(true);
            const response = await tareasService.getAllTareas();
            if (response.success) {
                const tareasData = response.data as any[] || [];
                setTareas(tareasData); // <-- Esta línea es la clave
            } else {
                setTareas([]);
            }
        } catch (error) {
            setTareas([]);
        } finally {
            setLoading(false);
        }
    }, [user?._id]);

    const cargarUsuarios = useCallback(async () => {
        try {
            // Mock users data
            const mockUsers = [
                { _id: '1', nombre: 'Admin', apellido: 'User' },
                { _id: '2', nombre: 'Tesorero', apellido: 'User' }
            ] as any[];
            setAsignadoAOptions(mockUsers);
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }, []);

    const handleCambioEstado = async (tareaId: string, nuevoEstado: string) => {
        try {
            const response = await tareasService.updateTarea(tareaId, { estado: nuevoEstado } as any);
            if (response.success) {
                cargarTareas();
            } else {
                Alert.alert('Error', 'No se pudo actualizar el estado');
            }
        } catch (error) {
            console.error('Error updating task status:', error);
            Alert.alert('Error', 'Error de conexión');
        }
    };

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await cargarTareas();
        setRefreshing(false);
    }, [cargarTareas]);

    const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || nuevaTarea.fechaLimite;
        setShowDatePicker(Platform.OS === 'ios');
        setNuevaTarea({ ...nuevaTarea, fechaLimite: currentDate });
    };

    const handleCrearTarea = async () => {
        if (editingTarea) {
            // Editar tarea existente
            const tareaData = {
                ...nuevaTarea,
                fechaLimite: nuevaTarea.fechaLimite.toISOString()
            };
            const response = await tareasService.updateTarea(editingTarea._id, tareaData as any);
            if (response.success) {
                Alert.alert('Éxito', 'Tarea actualizada correctamente');
                setShowCreateModal(false);
                setEditingTarea(null);
                setNuevaTarea({
                    titulo: '',
                    descripcion: '',
                    prioridad: 'Media',
                    asignadoA: '',
                    fechaLimite: new Date(),
                    categoria: '',
                    etiquetas: []
                });
                cargarTareas();
            } else {
                Alert.alert('Error', response.message || 'No se pudo actualizar la tarea');
            }
        } else {
            // Crear nueva tarea
            try {
                if (!nuevaTarea.titulo.trim() || !nuevaTarea.descripcion.trim() || !nuevaTarea.asignadoA) {
                    Alert.alert('Error', 'Por favor completa todos los campos requeridos');
                    return;
                }

                const tareaData = {
                    ...nuevaTarea,
                    creadoPor: user?._id,
                    estado: 'pendiente',
                    fechaLimite: nuevaTarea.fechaLimite.toISOString()
                };

                const response = await tareasService.createTarea(tareaData as any);
                if (response.success) {
                    Alert.alert('Éxito', 'Tarea creada correctamente');
                    setShowCreateModal(false);
                    setNuevaTarea({
                        titulo: '',
                        descripcion: '',
                        prioridad: 'Media',
                        asignadoA: '',
                        fechaLimite: new Date(),
                        categoria: '',
                        etiquetas: []
                    });
                    cargarTareas();
                } else {
                    Alert.alert('Error', response.message || 'No se pudo crear la tarea');
                }
            } catch (error) {
                console.error('Error creating task:', error);
                Alert.alert('Error', 'Error de conexión');
            }
        }
    };

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

    // Filter tasks
    const filteredTareas = tareas.filter(tarea => {
        if (filtros.estado && tarea.estado !== filtros.estado) return false;
        if (filtros.prioridad && tarea.prioridad !== filtros.prioridad) return false;
        if (filtros.categoria && tarea.categoria !== filtros.categoria) return false;
        return true;
    });

    console.log('Estado actual:', {
        user: user ? { id: user._id, role: user.role } : 'No user',
        tareasCount: tareas.length,
        filteredCount: filteredTareas.length,
        filtros,
        loading,
        authLoading
    });

    // Render task card
    const renderTareaCard = ({ item: tarea }: { item: Tarea }) => {
        const puedeEditarEstado = user &&
            (user.role === 'admin' ||
             user.role === 'tesorero' ||
             user._id === String(tarea.asignadoA));

        return (
            <View style={[styles.card, { borderLeftColor: tareasService.getPrioridadColor(tarea.prioridad) }]}> 
                <View style={styles.cardHeader}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>{tarea.titulo}</Text>
                        <View style={[styles.estadoBadge, { backgroundColor: tareasService.getEstadoColor(tarea.estado) }]}> 
                            <Text style={styles.estadoText}>{tarea.estado}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {puedeEditarEstado && (
                            <TouchableOpacity
                                onPress={() => handleCambioEstado(tarea._id, getEstadoSiguiente(tarea.estado))}
                                style={styles.estadoButton}
                            >
                                <Icon
                                    name={tarea.estado === 'pendiente' ? 'time' : tarea.estado === 'en_progreso' ? 'sync' : tarea.estado === 'completada' ? 'checkmark-circle' : 'close-circle'}
                                    size={24}
                                    color={colors.primary}
                                />
                            </TouchableOpacity>
                        )}
                        {/* Botón editar */}
                        {(user?.role === 'admin' || user?.role === 'tesorero') && (
                            <TouchableOpacity
                                style={{ marginLeft: 8, padding: 6 }}
                                onPress={() => {
                                    setEditingTarea(tarea);
                                    setNuevaTarea({
                                        titulo: tarea.titulo,
                                        descripcion: tarea.descripcion,
                                        prioridad: tarea.prioridad,
                                        asignadoA: tarea.asignadoA,
                                        fechaLimite: new Date(tarea.fechaLimite),
                                        categoria: tarea.categoria || '',
                                        etiquetas: tarea.etiquetas || []
                                    });
                                    setShowCreateModal(true);
                                }}
                            >
                                <Icon name="pencil" size={20} color="#17a2b8" />
                            </TouchableOpacity>
                        )}
                        {/* Botón eliminar */}
                        {user?.role === 'admin'  && (
                            <TouchableOpacity
                                style={{ marginLeft: 8, padding: 6 }}
                                onPress={() => {
                                    Alert.alert(
                                        'Eliminar tarea',
                                        `¿Seguro que deseas eliminar la tarea "${tarea.titulo}"?`,
                                        [
                                            { text: 'Cancelar', style: 'cancel' },
                                            {
                                                text: 'Eliminar',
                                                style: 'destructive',
                                                onPress: async () => {
                                                    try {
                                                        const response = await tareasService.deleteTarea(tarea._id);
                                                        if (response.success) {
                                                            Alert.alert('Eliminada', 'La tarea fue eliminada');
                                                            cargarTareas();
                                                        } else {
                                                            Alert.alert('Error', response.message || 'No se pudo eliminar la tarea');
                                                        }
                                                    } catch (error) {
                                                        Alert.alert('Error', 'Error de conexión');
                                                    }
                                                }
                                            }
                                        ]
                                    );
                                }}
                            >
                                <Icon name="trash" size={20} color="#dc3545" />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
                <Text style={styles.description}>{tarea.descripcion}</Text>
    
                <View style={styles.metaInfo}>
                    <View style={styles.metaItem}>
                        <Icon name="calendar-outline" size={16} color="#666" />
                        <Text style={styles.metaText}>
                            Límite: {new Date(tarea.fechaLimite).toLocaleDateString()}
                        </Text>
                    </View>
                    {tarea.categoria && (
                        <View style={styles.metaItem}>
                            <Icon name="bookmark-outline" size={16} color="#666" />
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

    // Render filter modal
    const renderFilterModal = () => {
        const estados = [
            { label: 'Pendiente', value: 'pendiente' },
            { label: 'En Progreso', value: 'en_progreso' },
            { label: 'Completada', value: 'completada' },
            { label: 'Cancelada', value: 'cancelada' }
        ];
        
        const prioridades = [
            { label: 'Alta', value: 'Alta' },
            { label: 'Media', value: 'Media' },
            { label: 'Baja', value: 'Baja' }
        ];

        const handleEstadoPress = (estado: string) => {
            setFiltros({
                ...filtros,
                estado: filtros.estado === estado ? '' : estado
            });
        };

        const handlePrioridadPress = (prioridad: string) => {
            setFiltros({
                ...filtros,
                prioridad: filtros.prioridad === prioridad ? '' : prioridad
            });
        };

        return (
            <Modal
                visible={showFilters}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.filterHeader}>
                            <Text style={styles.filterTitle}>Filtrar Tareas</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)}>
                                <Icon name="close" size={24} color={colors.text} />
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
                                            filtros.estado === estado.value && styles.filterChipSelected
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
                                            filtros.prioridad === prioridad.value && styles.filterChipSelected
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

                        <View style={styles.filterButtons}>
                            <TouchableOpacity
                                style={styles.filterButtonSecondary}
                                onPress={() => {
                                    setFiltros(INITIAL_FILTROS);
                                    setShowFilters(false);
                                    cargarTareas();
                                }}
                            >
                                <Text style={styles.filterButtonSecondaryText}>Limpiar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.filterButtonPrimary}
                                onPress={aplicarFiltros}
                            >
                                <Text style={styles.filterButtonPrimaryText}>Aplicar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    };

    // Mostrar loader si el usuario aún no está cargado o el contexto de auth está en loading
    if (authLoading || !user) {
        console.log('Auth loading o no user:', { authLoading, user: !!user });
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ marginTop: 16, color: colors.textSecondary }}>Cargando usuario...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header visual tipo eventos/cabañas */}
            <View style={styles.headerTareas}>
                <Text style={styles.headerTareasTitle}>Tareas</Text>
                <Text style={styles.headerTareasSubtitle}>Gestiona y revisa tus tareas pendientes</Text>
            </View>

            {/* Header with title and filter */}
            <View style={styles.listHeader}>
                <View style={styles.titleContainer}>
                    <Icon name="list" size={24} color={colors.primary} />
                    <Text style={styles.listTitle}>Mis Tareas</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{filteredTareas.length}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => setShowFilters(true)}
                    style={styles.filterIcon}
                >
                    <Icon name="filter" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Task List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={filteredTareas}
                    renderItem={renderTareaCard}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="clipboard-outline" size={64} color="#666" />
                            <Text style={styles.emptyText}>No hay tareas</Text>
                        </View>
                    }
                />
            )}

            {/* Botón flotante para crear tarea */}
            {canCreateTasks && (
                <TouchableOpacity
                    style={styles.fab}
                    onPress={() => {
                        setEditingTarea(null);
                        setNuevaTarea({
                            titulo: '',
                            descripcion: '',
                            prioridad: 'Media',
                            asignadoA: '',
                            fechaLimite: new Date(),
                            categoria: '',
                            etiquetas: []
                        });
                        setShowCreateModal(true);
                    }}
                >
                    <Icon name="add" size={24} color="#fff" />
                </TouchableOpacity>
            )}

            {/* Filter Modal */}
            {renderFilterModal()}

            {/* Modal para crear/editar tarea igual a cabañas */}
            <Modal
                visible={showCreateModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={() => {
                    setShowCreateModal(false);
                    setEditingTarea(null);
                    setNuevaTarea({
                        titulo: '',
                        descripcion: '',
                        prioridad: 'Media',
                        asignadoA: '',
                        fechaLimite: new Date(),
                        categoria: '',
                        etiquetas: []
                    });
                }}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={() => {
                            setShowCreateModal(false);
                            setEditingTarea(null);
                            setNuevaTarea({
                                titulo: '',
                                descripcion: '',
                                prioridad: 'Media',
                                asignadoA: '',
                                fechaLimite: new Date(),
                                categoria: '',
                                etiquetas: []
                            });
                        }}>
                            <Icon name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{editingTarea ? 'Editar Tarea' : 'Crear Tarea'}</Text>
                        <TouchableOpacity onPress={handleCrearTarea}>
                            <Text style={styles.saveButtonText}>{editingTarea ? 'Guardar' : 'Crear'}</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Título *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={nuevaTarea.titulo}
                                onChangeText={text => setNuevaTarea({ ...nuevaTarea, titulo: text })}
                                placeholder="Ingrese el título de la tarea"
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Descripción *</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={nuevaTarea.descripcion}
                                onChangeText={text => setNuevaTarea({ ...nuevaTarea, descripcion: text })}
                                placeholder="Ingrese la descripción"
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Prioridad *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={nuevaTarea.prioridad}
                                    onValueChange={value => setNuevaTarea({ ...nuevaTarea, prioridad: value })}
                                >
                                    <Picker.Item label="Alta" value="Alta" />
                                    <Picker.Item label="Media" value="Media" />
                                    <Picker.Item label="Baja" value="Baja" />
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Asignado a *</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={nuevaTarea.asignadoA}
                                    onValueChange={value => setNuevaTarea({ ...nuevaTarea, asignadoA: value })}
                                >
                                    <Picker.Item label="Seleccione un usuario" value="" />
                                    {asignadoAOptions.map(u => (
                                        <Picker.Item key={u._id} label={`${u.nombre} ${u.apellido}`} value={u._id} />
                                    ))}
                                </Picker>
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Fecha límite *</Text>
                            <TouchableOpacity style={styles.textInput} onPress={() => setShowDatePicker(true)}>
                                <Text>{nuevaTarea.fechaLimite ? nuevaTarea.fechaLimite.toLocaleDateString() : 'Seleccionar fecha'}</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>

                    {/* Botones del Modal */}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonSecondary]}
                            onPress={() => {
                                setShowCreateModal(false);
                                setEditingTarea(null);
                                setNuevaTarea({
                                    titulo: '',
                                    descripcion: '',
                                    prioridad: 'Media',
                                    asignadoA: '',
                                    fechaLimite: new Date(),
                                    categoria: '',
                                    etiquetas: []
                                });
                            }}
                        >
                            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.button, styles.buttonPrimary]}
                            onPress={handleCrearTarea}
                        >
                            <Text style={styles.buttonPrimaryText}>{editingTarea ? 'Guardar Cambios' : 'Crear Tarea'}</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {/* Date Picker */}
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
    // Estilos para modal y botones igual que cabañas
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D3748',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#fff',
        fontSize: 16,
        color: '#2D3748',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
    },
    buttonSecondary: {
        backgroundColor: '#F7FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    buttonPrimaryText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    buttonSecondaryText: {
        color: '#4A5568',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    headerTareas: {
        backgroundColor: colors.surface,
            paddingVertical: spacing.lg + 40,
            paddingHorizontal: spacing.md,
            alignItems: 'center',
            marginBottom: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9',
            height: 170,
    },
    headerTareasTitle: {
       fontSize: typography.fontSize.xl + 4,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    headerTareasSubtitle: {
         fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
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
    // Task card styles
    card: {
        backgroundColor: colors.surface,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderLeftWidth: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    listHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    listTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
        marginLeft: 8,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
    },
    badgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    filterIcon: {
        padding: 8,
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
        color: colors.text,
        marginRight: 8,
    },
    estadoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    estadoText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    estadoButton: {
        padding: 8,
    },
    description: {
        color: colors.textSecondary,
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
        color: colors.textSecondary,
        fontSize: 12,
        marginLeft: 4,
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    tag: {
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
        marginBottom: 4,
    },
    tagText: {
        color: colors.textSecondary,
        fontSize: 12,
    },
    observaciones: {
        color: colors.textSecondary,
        fontSize: 12,
        fontStyle: 'italic',
        marginTop: 8,
    },
    // Filter modal styles
    filterHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    filterTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    optionsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: colors.surface,
    },
    filterChipSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipText: {
        fontSize: 14,
        color: colors.text,
    },
    filterChipTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    filterButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 12,
    },
    filterButtonSecondary: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    filterButtonSecondaryText: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
    },
    filterButtonPrimary: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    filterButtonPrimaryText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
        
});