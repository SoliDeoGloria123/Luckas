import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    Alert,
    Modal,
    KeyboardAvoidingView,
    Platform,
    Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { cabanasService } from '../services/cabanas';
import categorizacionService from '../services/categorizacion';
import { Cabana, CabanaForm, Categorizacion } from '../types';
import { StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../styles';

const CabanasScreen: React.FC = () => {
    // Filtros modal tipo tareas
    const [showFilters, setShowFilters] = useState(false);
    const [filtros, setFiltros] = useState({ estado: '' });

    const aplicarFiltros = useCallback(() => {
        setShowFilters(false);
        // Aquí podrías recargar cabañas si el filtro se aplica desde backend
    }, []);


    const handleEstadoPress = (estado: string) => {
        setFiltros({ ...filtros, estado: filtros.estado === estado ? '' : estado });
    };
    const { canEdit, canDelete, user, hasRole } = useAuth();
    const [cabanas, setCabanas] = useState<Cabana[]>([]);
    const [categorias, setCategorias] = useState<Categorizacion[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [filterEstado, setFilterEstado] = useState<string>('Todos');
    const [editingCabana, setEditingCabana] = useState<Cabana | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [formData, setFormData] = useState<CabanaForm>({
        nombre: '',
        descripcion: '',
        capacidad: 1,
        categoria: '',
        precio: 0,
        ubicacion: '',
        estado: 'disponible',
        imagen: []
    });

    //const categorizacionService = categorizacionModule.categorizacionService;

    // Verificar si el usuario tiene permisos para ver cabañas
    useEffect(() => {
        if (!user || (!hasRole('admin') && !hasRole('tesorero') && !hasRole('seminarista'))) {
            return;
        }
        loadCabanas();
        loadCategorias(); // Cargar categorías una sola vez al inicio
    }, [user]);

    // Cargar categorías
    const loadCategorias = useCallback(async () => {
        try {
            const response = await categorizacionService.getAllCategorizaciones();
            let categoriasArray: Categorizacion[] = [];
            if (response.success && response.data) {
              
                // Si response.data es un array directamente
                if (Array.isArray(response.data)) {
                    categoriasArray = response.data;
                }
                // Si response.data es un objeto con .data
                else if ((response.data as any).data && Array.isArray((response.data as any).data)) {
                    categoriasArray = (response.data as any).data;
                }
                // Filtrar solo las activas
                const activas = categoriasArray.filter(cat => cat.activo);
                setCategorias(activas);
            } else {
                console.error('❌ Respuesta sin éxito o sin datos');
                setCategorias([]);
            }
        } catch (error) {
            console.error('❌ Error en loadCategorias:', error);
            setCategorias([]);
        }
    }, []);

    // Cargar cabañas desde el servicio
    const loadCabanas = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await cabanasService.getAllCabanas();
            if (response.success) {
                setCabanas(response.data || []);
            } else {
                Alert.alert('Error', 'No se pudieron cargar las cabañas');
                setCabanas([]);
            }
        } catch (error) {
            console.error('Error loading cabañas:', error);
            Alert.alert('Error', 'Error de conexión');
            setCabanas([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Manejar pull to refresh
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadCabanas();
        setRefreshing(false);
    }, [loadCabanas]);

    // Filtrar cabañas según criterios
    const filteredCabanas = cabanas.filter(cabana => {
        const matchesSearch = !searchText ||
            cabana.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            cabana.descripcion?.toLowerCase().includes(searchText.toLowerCase());

        const matchesEstado = !filtros.estado || cabana.estado === filtros.estado;

        return matchesSearch && matchesEstado;
    });

    // Manejar crear nueva cabaña
    const handleCrearCabana = () => {
        setEditingCabana(null);
        setFormData({
      nombre: '',
        descripcion: '',
        capacidad: 1,
        categoria: '',
        precio: 0,
        ubicacion: '',
        estado: 'disponible',
        imagen: []
        });
        setSelectedImages([]);
        setShowModal(true);
    };

    // Manejar editar cabaña
    const handleEditarCabana = (cabana: Cabana) => {
        setEditingCabana(cabana);
        
        // Manejar categoria que puede venir como string (ObjectId) o como objeto poblado
        let categoriaId = '';
        if (typeof cabana.categoria === 'string') {
            categoriaId = cabana.categoria;
        } else if (cabana.categoria && typeof cabana.categoria === 'object' && '_id' in cabana.categoria) {
            categoriaId = (cabana.categoria as any)._id;
        }

        setFormData({
            nombre: cabana.nombre,
            descripcion: cabana.descripcion || '',
            capacidad: cabana.capacidad,
            categoria: categoriaId,
            precio: cabana.precio,
            ubicacion: cabana.ubicacion || '',
            estado: cabana.estado,
            imagen: cabana.imagen || []
        });
        setSelectedImages(cabana.imagen || []);
        setShowModal(true);
    };

    // Cerrar modal
    const handleCerrarModal = () => {
        setShowModal(false);
        setEditingCabana(null);
        setFormData({
            nombre: '',
            descripcion: '',
            capacidad: 1,
            categoria: '',
            precio: 0,
            ubicacion: '',
            estado: 'disponible',
            imagen: []
        });
        setSelectedImages([]);
    };

    // Seleccionar imágenes
    const handleSelectImages = () => {
        Alert.alert(
            'Seleccionar Imagen',
            '¿Desde dónde quieres seleccionar la imagen?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Cámara', onPress: () => openImagePicker('camera') },
                { text: 'Galería', onPress: () => openImagePicker('gallery') }
            ]
        );
    };

    const openImagePicker = (source: 'camera' | 'gallery') => {
        const mockImageUri = `mock-image-${Date.now()}.jpg`;
        setSelectedImages(prev => [...prev, mockImageUri]);
        Alert.alert('Imagen Seleccionada', 'La funcionalidad de imágenes será implementada con React Native Image Picker');
    };

    const handleRemoveImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    // Guardar cabaña (crear o actualizar)
    const handleGuardarCabana = async () => {
        try {
            if (!formData.nombre.trim()) {
                Alert.alert('Error', 'El nombre de la cabaña es requerido');
                return;
            }

            if (!formData.categoria.trim()) {
                Alert.alert('Error', 'La categoría es requerida');
                return;
            }

            if (formData.capacidad <= 0) {
                Alert.alert('Error', 'La capacidad debe ser mayor a 0');
                return;
            }

            if (formData.precio < 0) {
                Alert.alert('Error', 'El precio no puede ser negativo');
                return;
            }

        
            if (editingCabana) {
                const response = await cabanasService.updateCabana(editingCabana._id, {
                    ...formData,
                    imagen: selectedImages
                });
                if (response.success) {
                    Alert.alert('Éxito', 'Cabaña actualizada correctamente');
                    loadCabanas();
                    handleCerrarModal();
                } else {
                    Alert.alert('Error', response.message || 'Error al actualizar la cabaña');
                }
            } else {
                const response = await cabanasService.createCabana({
                    ...formData,
                    imagen: selectedImages
                });
                if (response.success) {
                    Alert.alert('Éxito', 'Cabaña creada correctamente');
                    loadCabanas();
                    handleCerrarModal();
                } else {
                    Alert.alert('Error', response.message || 'Error al crear la cabaña');
                }
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión');
        }
    };

    // Eliminar cabaña
    const handleDeleteCabana = (cabana: Cabana) => {
        if (canDelete()) {
            Alert.alert(
                'Eliminar Cabaña',
                `¿Estás seguro de que quieres eliminar "${cabana.nombre}"?`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                        text: 'Eliminar',
                        style: 'destructive',
                        onPress: async () => {
                            try {
                                const response = await cabanasService.deleteCabana(cabana._id);
                                if (response.success) {
                                    Alert.alert('Éxito', 'Cabaña eliminada correctamente');
                                    loadCabanas();
                                } else {
                                    Alert.alert('Error', response.message || 'No se pudo eliminar la cabaña');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Error de conexión');
                            }
                        }
                    }
                ]
            );
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para eliminar cabañas');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Cabañas Disponibles</Text>
                <Text style={styles.headerSubtitle}>Encuentra el lugar perfecto para tu retiro espiritual y descanso</Text>
            </View>
            {/* Header con filtro igual a tareas */}
            <View style={styles.listHeader}>
                <View style={styles.titleContainer}>
                    <Ionicons name="home" size={24} color={colors.primary} />
                    <Text style={styles.listTitle}>Cabañas</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{filteredCabanas.length}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => setShowFilters(true)}
                    style={styles.filterIcon}
                >
                    <Ionicons name="filter" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Buscador */}
            <View style={styles.searchBox}>
                <Ionicons name="search" size={20} color="#666" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar cabañas..."
                    value={searchText}
                    onChangeText={setSearchText}
                />
            </View>




            {/* Modal de filtros igual a tareas */}
            <Modal
                visible={showFilters}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalContainerTareas}>
                    <View style={styles.modalContentTareas}>
                        <View style={styles.filterHeaderTareas}>
                            <Text style={styles.filterTitleTareas}>Filtrar Cabañas</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButtonTareas}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sectionTareas}>
                            <Text style={styles.sectionTitleTareas}>Estado</Text>
                            <View style={styles.optionsContainerTareas}>
                                {estados.map((estado) => (
                                    <TouchableOpacity
                                        key={estado.value}
                                        style={[styles.filterChipTareas, filtros.estado === estado.value && styles.filterChipSelectedTareas]}
                                        onPress={() => handleEstadoPress(estado.value)}
                                    >
                                        <Text style={[styles.filterChipTextTareas, filtros.estado === estado.value && styles.filterChipTextSelectedTareas]}>
                                            {estado.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.filterButtonsTareas}>
                            <TouchableOpacity
                                style={styles.filterButtonSecondaryTareas}
                                onPress={() => {
                                    setFiltros({ estado: '' });
                                }}
                            >
                                <Text style={styles.filterButtonSecondaryTextTareas}>Limpiar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.filterButtonPrimaryTareas}
                                onPress={aplicarFiltros}
                            >
                                <Text style={styles.filterButtonPrimaryTextTareas}>Aplicar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Lista de cabañas */}
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {filteredCabanas.length > 0 ? (
                    filteredCabanas.map((cabana) => (
                        <View key={cabana._id} style={styles.cabanaCard}>
                            {/* Imagen de la cabaña */}
                            {cabana.imagen && cabana.imagen.length > 0 && (
                                <View style={styles.imageContainer}>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        pagingEnabled
                                        style={styles.imageScrollView}
                                    >
                                        {cabana.imagen.map((imageUri, index) => (
                                            <View key={index} style={styles.imageWrapper}>
                                                {imageUri.startsWith('mock-image') ? (
                                                    <View style={[styles.cabanaImage, styles.mockImagePlaceholder]}>
                                                        <Ionicons name="image" size={40} color="#718096" />
                                                        <Text style={styles.mockImageText}>Imagen {index + 1}</Text>
                                                    </View>
                                                ) : (
                                                    <Image source={{ uri: imageUri }} style={styles.cabanaImage} />
                                                )}
                                            </View>
                                        ))}
                                    </ScrollView>
                                    {cabana.imagen.length > 1 && (
                                        <View style={styles.imageIndicator}>
                                            <Text style={styles.imageIndicatorText}>
                                                1/{cabana.imagen.length}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                            )}

                            <View style={styles.cabanaHeader}>
                                <Text style={styles.cabanaTitle}>{cabana.nombre}</Text>
                                <View style={[styles.estadoBadge, { backgroundColor: getEstadoColor(cabana.estado) }]}>
                                    <Text style={styles.estadoText}>{cabana.estado}</Text>
                                </View>
                            </View>

                            {cabana.descripcion && (
                                <Text style={styles.cabanaDescription}>{cabana.descripcion}</Text>
                            )}

                            <View style={styles.cabanaDetails}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="people" size={16} color="#666" />
                                    <Text style={styles.detailText}>Capacidad: {cabana.capacidad} personas</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="cash" size={16} color="#666" />
                                    <Text style={styles.detailText}>Precio: ${cabana.precio}/noche</Text>
                                </View>
                                {cabana.ubicacion && (
                                    <View style={styles.detailRow}>
                                        <Ionicons name="location" size={16} color="#666" />
                                        <Text style={styles.detailText}>Ubicación: {cabana.ubicacion}</Text>
                                    </View>
                                )}
                            </View>

                            {/* Acciones de admin */}
                            {(hasRole('admin') || hasRole('tesorero')) && (
                                <View style={styles.adminActions}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => handleEditarCabana(cabana)}
                                    >
                                        <Ionicons name="pencil" size={16} color="#fff" />
                                        <Text style={styles.actionButtonText}>Editar</Text>
                                    </TouchableOpacity>
                                    {hasRole('admin') && (
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleDeleteCabana(cabana)}
                                        >
                                            <Ionicons name="trash" size={16} color="#fff" />
                                            <Text style={styles.actionButtonText}>Eliminar</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="home-outline" size={64} color="#666" />
                        <Text style={styles.emptyText}>No se encontraron cabañas</Text>
                        <Text style={styles.emptySubtext}>
                            {searchText || filterEstado !== 'Todos' ?
                                'Intenta ajustar los filtros de búsqueda' :
                                'Aún no hay cabañas registradas'
                            }
                        </Text>
                    </View>
                )}
            </ScrollView>

            {/* Botón flotante para crear cabaña */}
            {(hasRole('admin') || hasRole('tesorero')) && (
                <TouchableOpacity style={styles.fab} onPress={handleCrearCabana}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            )}

            {/* Modal para crear/editar cabaña */}
            <Modal
                visible={showModal}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={handleCerrarModal}
            >
                <KeyboardAvoidingView
                    style={styles.modalContainer}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.modalHeader}>
                        <TouchableOpacity onPress={handleCerrarModal}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>
                            {editingCabana ? 'Editar Cabaña' : 'Crear Cabaña'}
                        </Text>
                        <TouchableOpacity onPress={handleGuardarCabana}>
                            <Text style={styles.saveButtonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {/* Nombre */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre de la cabaña *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.nombre}
                                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                                placeholder="Ingresa el nombre de la cabaña"
                            />
                        </View>

                        {/* Descripción */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Descripción</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={formData.descripcion}
                                onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                                placeholder="Describe la cabaña"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        {/* Capacidad y Precio */}
                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Capacidad *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.capacidad.toString()}
                                    onChangeText={(text) => setFormData({ ...formData, capacidad: parseInt(text) || 1 })}
                                    placeholder="1"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Precio/noche *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.precio.toString()}
                                    onChangeText={(text) => setFormData({ ...formData, precio: parseFloat(text) || 0 })}
                                    placeholder="0"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        {/* Ubicación */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Ubicación</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.ubicacion}
                                onChangeText={(text) => setFormData({ ...formData, ubicacion: text })}
                                placeholder="Ubicación de la cabaña"
                            />
                        </View>

                        {/* Categoría */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Categoría *</Text>
                            <View style={styles.pickerContainer}>
                                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                    <TouchableOpacity
                                        style={[
                                            styles.pickerOption,
                                            formData.categoria === '' && styles.pickerOptionSelected
                                        ]}
                                        onPress={() => {
                                            setFormData({ ...formData, categoria: '' });
                                            console.log('Seleccionado: Ninguna categoría');
                                        }}
                                    >
                                        <Text style={[
                                            styles.pickerOptionText,
                                            formData.categoria === '' && styles.pickerOptionTextSelected
                                        ]}>Ninguna</Text>
                                    </TouchableOpacity>
                                    {categorias.map((categoria) => (
                                        <TouchableOpacity
                                            key={categoria._id}
                                            style={[
                                                styles.pickerOption,
                                                formData.categoria === categoria._id && styles.pickerOptionSelected
                                            ]}
                                            onPress={() => {
                                                setFormData({ ...formData, categoria: categoria._id });
                                                console.log('Seleccionado:', categoria.nombre);
                                            }}
                                        >
                                            <Text style={[
                                                styles.pickerOptionText,
                                                formData.categoria === categoria._id && styles.pickerOptionTextSelected
                                            ]}>{categoria.nombre}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>

                        {/* Estado */}
                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Estado</Text>
                                <View style={styles.pickerContainer}>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                        {['disponible', 'ocupada', 'mantenimiento'].map(estado => (
                                            <TouchableOpacity
                                                key={estado}
                                                style={[
                                                    styles.pickerOption,
                                                    formData.estado === estado && styles.pickerOptionSelected
                                                ]}
                                                onPress={() => setFormData({ ...formData, estado: estado as 'disponible' | 'ocupada' | 'mantenimiento' })}
                                            >
                                                <Text style={[
                                                    styles.pickerOptionText,
                                                    formData.estado === estado && styles.pickerOptionTextSelected
                                                ]}>{estado.charAt(0).toUpperCase() + estado.slice(1)}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                {/* Espacio vacío para mantener el layout */}
                            </View>
                        </View>

                        {/* Imágenes */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Imágenes de la Cabaña</Text>
                            <TouchableOpacity
                                style={styles.imageSelector}
                                onPress={handleSelectImages}
                            >
                                <Text style={styles.imageSelectorText}>+ Agregar Imagen</Text>
                            </TouchableOpacity>

                            {selectedImages.length > 0 && (
                                <ScrollView horizontal style={styles.imagePreviewContainer}>
                                    {selectedImages.map((imageUri, index) => (
                                        <View key={index} style={styles.imagePreview}>
                                            <View style={styles.imagePlaceholder}>
                                                <Text style={styles.imagePlaceholderText}>IMG {index + 1}</Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.removeImageButton}
                                                onPress={() => handleRemoveImage(index)}
                                            >
                                                <Text style={styles.removeImageText}>×</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    </ScrollView>

                    {/* Botones del Modal */}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSecondary]}
                            onPress={handleCerrarModal}
                        >
                            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonPrimary]}
                            onPress={handleGuardarCabana}
                        >
                            <Text style={styles.buttonPrimaryText}>
                                {editingCabana ? 'Actualizar' : 'Crear'} Cabaña
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

// Función para obtener color del estado
const getEstadoColor = (estado: string) => {
    switch (estado) {
        case 'disponible': return '#10B981';
        case 'ocupada': return '#F59E0B';
        case 'mantenimiento': return '#EF4444';
        default: return '#6B7280';
    }
};

// Opciones de filtro igual a tareas (solo para el modal de filtros)
const estados = [
    { label: 'Disponible', value: 'disponible' },
    { label: 'Ocupada', value: 'ocupada' },
    { label: 'Mantenimiento', value: 'mantenimiento' }
];

const styles = StyleSheet.create({
    // Estilos de filtro igual a tareas
    modalContainerTareas: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContentTareas: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        maxHeight: '80%',
    },
    filterHeaderTareas: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    filterTitleTareas: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    closeButtonTareas: {
        padding: 8,
    },
    sectionTareas: {
        marginBottom: 24,
    },
    sectionTitleTareas: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    optionsContainerTareas: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    filterChipTareas: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: colors.surface,
    },
    filterChipSelectedTareas: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filterChipTextTareas: {
        fontSize: 14,
        color: colors.text,
    },
    filterChipTextSelectedTareas: {
        color: '#fff',
        fontWeight: '600',
    },
    filterButtonsTareas: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        gap: 12,
    },
    filterButtonSecondaryTareas: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    filterButtonSecondaryTextTareas: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '600',
    },
    filterButtonPrimaryTareas: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    filterButtonPrimaryTextTareas: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    contentContainer: {
        paddingBottom: 100,
    },
    header: {
        backgroundColor: colors.surface,
        paddingVertical: spacing.lg + 40,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        height: 170,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl + 4,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    headerSubtitle: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    searchBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        marginHorizontal: spacing.md,
        marginTop: spacing.sm,
        marginBottom: spacing.md,
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    searchInput: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: colors.text,
    },
    filtrosContainer: {
        marginBottom: spacing.md,
    },
    filtrosContent: {
        paddingHorizontal: spacing.md,
    },
    filtroButton: {
        backgroundColor: colors.surface,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: colors.border,
    },
    filtroButtonActive: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    filtroText: {
        color: colors.text,
        fontSize: 14,
        fontWeight: '500',
    },
    filtroTextActive: {
        color: colors.surface,
        fontWeight: 'bold',
    },
    scrollContainer: {
        flex: 1,
    },
    cabanaCard: {
        backgroundColor: colors.surface,
        marginHorizontal: spacing.md,
        marginBottom: spacing.md,
        borderRadius: 12,
        padding: spacing.md,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    imageContainer: {
        marginBottom: spacing.sm,
        position: 'relative',
    },
    imageScrollView: {
        borderRadius: 8,
    },
    imageWrapper: {
        marginRight: 0,
    },
    cabanaImage: {
        width: 280,
        height: 180,
        borderRadius: 8,
        backgroundColor: '#E2E8F0',
    },
    mockImagePlaceholder: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    mockImageText: {
        color: '#718096',
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
    },
    imageIndicator: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    imageIndicatorText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    cabanaHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cabanaTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        flex: 1,
        marginRight: 10,
    },
    estadoBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    estadoText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'capitalize',
    },
    cabanaDescription: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        lineHeight: 20,
    },
    cabanaDetails: {
        marginBottom: spacing.sm,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    detailText: {
        fontSize: 14,
        color: colors.textSecondary,
        marginLeft: 6,
    },
    adminActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: spacing.md,
        gap: spacing.sm,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#17a2b8',
        paddingVertical: spacing.sm,
        borderRadius: 6,
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        paddingVertical: spacing.sm,
        borderRadius: 6,
    },
    actionButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: typography.fontSize.sm,
        marginLeft: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 100,
    },
    emptyText: {
        fontSize: 18,
        color: '#64748b',
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    emptySubtext: {
        fontSize: 16,
        color: '#334155',
        marginTop: 8,
        textAlign: 'center',
        lineHeight: 24,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },

    // Modal styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#fff',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2D3748',
    },
    saveButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
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
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    halfWidth: {
        width: '48%',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 8,
        backgroundColor: '#fff',
        padding: 5,
    },
    pickerOption: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        borderRadius: 6,
        backgroundColor: '#F7FAFC',
    },
    pickerOptionSelected: {
        backgroundColor: colors.primary,
    },
    pickerOptionText: {
        fontSize: 14,
        color: '#4A5568',
    },
    pickerOptionTextSelected: {
        color: '#fff',
        fontWeight: '600',
    },
    imageSelector: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F7FAFC',
    },
    imageSelectorText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    imagePreviewContainer: {
        marginTop: 10,
        flexDirection: 'row',
    },
    imagePreview: {
        marginRight: 10,
        alignItems: 'center',
        position: 'relative',
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: '#E2E8F0',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        color: '#718096',
        fontSize: 10,
        fontWeight: '600',
    },
    removeImageButton: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E53E3E',
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
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

    estadoButton: {
        padding: 8,
    },
    description: {
        color: colors.textSecondary,
        marginBottom: 12,
    },
});

export default CabanasScreen;