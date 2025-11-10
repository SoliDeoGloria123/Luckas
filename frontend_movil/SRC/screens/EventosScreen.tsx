// Pantalla de gestión de eventos
import React, { useState, useEffect, useCallback } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    RefreshControl,
    Image,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { eventosService } from '../services/eventos';
import { Evento, EventoForm, Categorizacion } from '../types';
import { colors, spacing, typography, shadows } from '../styles';
import categorizacionService from '../services/categorizacion';

// Tipos para el programa del evento
interface ProgramaEvento {
    horaInicio: string;
    horaFin: string;
    tema: string;
    descripcion: string;
}

// Funciones auxiliares para reducir complejidad cognitiva
const getCategoriaNombre = (categoria: any): string => {
    return typeof categoria === 'string' ? categoria : '';
};

const shouldShowEvento = (evento: any, searchText: string, filtros: any): boolean => {
    const matchSearch = evento.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
        evento.lugar?.toLowerCase().includes(searchText.toLowerCase()) ||
        evento.descripcion?.toLowerCase().includes(searchText.toLowerCase());

    const categoriaNombre = getCategoriaNombre(evento.categoria);
    const matchCategoria = !filtros.categoria || categoriaNombre === filtros.categoria;
    const matchPrioridad = !filtros.prioridad || evento.prioridad === filtros.prioridad;
    
    return matchSearch && matchCategoria && matchPrioridad;
};

const getCategoriaId = (categoria: any): string => {
    if (typeof categoria === 'string') {
        return categoria;
    }
    if (categoria && typeof categoria === 'object' && '_id' in categoria) {
        return (categoria as any)._id;
    }
    return '';
};

const EventosScreen: React.FC = () => {
    // Filtro modal igual a CabañasScreen
    const [showFilters, setShowFilters] = useState(false);
    const [filtros, setFiltros] = useState({ categoria: '', prioridad: '' });

    // Opciones para el filtro
    const prioridades = [
        { label: 'Alta', value: 'Alta' },
        { label: 'Media', value: 'Media' },
        { label: 'Baja', value: 'Baja' }
    ];


    const handleCategoriaPress = (categoria: string) => {
        setFiltros({ ...filtros, categoria: filtros.categoria === categoria ? '' : categoria });
    };
    const handlePrioridadPress = (prioridad: string) => {
        setFiltros({ ...filtros, prioridad: filtros.prioridad === prioridad ? '' : prioridad });
    };
    const aplicarFiltros = useCallback(() => {
        setShowFilters(false);
        // Aquí podrías recargar eventos si el filtro se aplica desde backend
    }, []);
    const { canEdit, canDelete, user, hasRole } = useAuth();
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [categorias, setCategorias] = useState<Categorizacion[]>([]);
    const [selectedCategoria, setSelectedCategoria] = useState<string | null>(null);
    const [searchText, setSearchText] = useState('');
    const [selectedEventos, setSelectedEventos] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const [formData, setFormData] = useState<EventoForm>({
        nombre: '',
        descripcion: '',
        precio: 0,
        categoria: '',
        etiquetas: [],
        fechaEvento: '', // Se enviará como string ISO
        horaInicio: '',
        horaFin: '',
        lugar: '',
        direccion: '',
        cuposDisponibles: 0,
        cuposTotales: 50,
        programa: [], // ProgramaEvento[]
        prioridad: 'Media',
        observaciones: '',
        imagen: [] // Nuevo campo para imágenes
    });
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Opciones para el filtro de categorías (debe ir después de declarar 'categorias')
    const categoriasFiltro = categorias.map(cat => ({ label: cat.nombre, value: cat._id }));

    // Verificar si el usuario tiene permisos para ver eventos
    useEffect(() => {
        if (!user || (!hasRole('admin') && !hasRole('tesorero') && !hasRole('seminarista') && !hasRole('externo'))) {
            return;
        }
        loadEventos();
        loadCategorias(); // Cargar categorías una sola vez al inicio

    }, [user, hasRole]);

    // Cargar categorías
    const loadCategorias = useCallback(async () => {
        try {
            console.log('🔄 Iniciando carga de categorías...');
            const response = await categorizacionService.getAllCategorizaciones();
            console.log('📥 Respuesta completa del servicio:', JSON.stringify(response, null, 2));

            let categoriasArray: Categorizacion[] = [];
            if (response.success && response.data) {
                console.log('✅ Respuesta exitosa, procesando datos...');
                console.log('📊 Tipo de response.data:', Array.isArray(response.data) ? 'array' : typeof response.data);
                console.log('📊 Contenido de response.data:', response.data);

                // Si response.data es un array directamente
                if (Array.isArray(response.data)) {
                    console.log('📋 Datos son array directo');
                    categoriasArray = response.data;
                }
                // Si response.data es un objeto con .data
                else if ((response.data as any).data && Array.isArray((response.data as any).data)) {
                    console.log('📋 Datos están en response.data.data');
                    categoriasArray = (response.data as any).data;
                }

                console.log('📋 Array de categorías extraído:', categoriasArray);
                console.log('📊 Cantidad de categorías:', categoriasArray.length);

                // Filtrar solo las activas
                const activas = categoriasArray.filter(cat => cat.activo);
                console.log('✅ Categorías activas filtradas:', activas);
                console.log('📊 Cantidad de activas:', activas.length);

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

    // Filtrar eventos por búsqueda usando función auxiliar
    const filteredEventos = eventos.filter(evento => 
        shouldShowEvento(evento, searchText, filtros)
    );

    // Manejar ver detalles del evento
    const handleVerDetalles = (evento: any) => {
        setSelectedEventos(evento);
        setModalVisible(true);
    };

    // Abrir modal para crear evento
    const handleCrearEvento = async () => {
        setEditingEvento(null);
        setSelectedImages([]);
        setFormData({
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria: '',
            etiquetas: [],
            fechaEvento: '', // Se enviará como string ISO
            horaInicio: '',
            horaFin: '',
            lugar: '',
            direccion: '',
            cuposDisponibles: 50,
            cuposTotales: 50,
            programa: [], // ProgramaEvento[]
            prioridad: 'Media',
            observaciones: '',
            imagen: [] // Nuevo campo para imágenes
        });
        setShowModal(true);
    };

    const handleEditarEvento = async (evento: Evento) => {
        setEditingEvento(evento);
        setSelectedImages(evento.imagen || []);

        const categoriaId = getCategoriaId(evento.categoria);
        setFormData({
            nombre: evento.nombre,
            descripcion: evento.descripcion,
            precio: evento.precio,
            categoria: categoriaId,
            etiquetas: evento.etiquetas || [],
            fechaEvento: evento.fechaEvento,
            horaInicio: evento.horaInicio,
            horaFin: evento.horaFin,
            lugar: evento.lugar,
            direccion: evento.direccion || '',
            cuposDisponibles: evento.cuposDisponibles || evento.cuposTotales,
            cuposTotales: evento.cuposTotales,
            programa: evento.programa || [],
            prioridad: evento.prioridad,
            observaciones: evento.observaciones || '',
            imagen: evento.imagen || []
        });
        setShowModal(true);
    };

    // Guardar evento (crear o editar)
    const handleGuardarEvento = async () => {
        try {
            // Validación básica manual
            if (!formData.nombre.trim()) {
                Alert.alert('Error de Validación', 'El nombre del evento es obligatorio');
                return;
            }
            if (!formData.descripcion.trim()) {
                Alert.alert('Error de Validación', 'La descripción es obligatoria');
                return;
            }
            if (!formData.fechaEvento) {
                Alert.alert('Error de Validación', 'La fecha del evento es obligatoria');
                return;
            }
            if (!formData.horaInicio.trim()) {
                Alert.alert('Error de Validación', 'La hora de inicio es obligatoria');
                return;
            }
            if (!formData.horaFin.trim()) {
                Alert.alert('Error de Validación', 'La hora de fin es obligatoria');
                return;
            }
            if (!formData.lugar.trim()) {
                Alert.alert('Error de Validación', 'El lugar es obligatorio');
                return;
            }
            if (!formData.categoria) {
                Alert.alert('Error de Validación', 'La categoría es obligatoria');
                return;
            }
            if (formData.cuposTotales <= 0) {
                Alert.alert('Error de Validación', 'Los cupos totales deben ser mayor a 0');
                return;
            }

            // Preparar datos para enviar
            const eventoData = {
                nombre: formData.nombre.trim(),
                descripcion: formData.descripcion.trim(),
                precio: formData.precio || 0,
                categoria: formData.categoria,
                etiquetas: formData.etiquetas || [],
                fechaEvento: new Date(formData.fechaEvento).toISOString(), // Enviar como string ISO
                horaInicio: formData.horaInicio.trim(),
                horaFin: formData.horaFin.trim(),
                lugar: formData.lugar.trim(),
                direccion: formData.direccion?.trim() || '',
                cuposTotales: formData.cuposTotales,
                cuposDisponibles: formData.cuposTotales, // Los cupos disponibles inicialmente son iguales a los totales
                programa: formData.programa || [],
                prioridad: formData.prioridad,
                observaciones: formData.observaciones?.trim() || '',
                imagen: selectedImages // Incluir imágenes seleccionadas
            };

            console.log('📤 Datos del evento a enviar:', eventoData);

            let response;
            if (editingEvento) {
                console.log('✏️ Actualizando evento existente...');
                response = await eventosService.updateEvento(editingEvento._id, eventoData);
            } else {
                console.log('➕ Creando nuevo evento...');
                response = await eventosService.createEvento(eventoData);
            }

            console.log('📥 Respuesta del servidor:', response);

            if (response.success) {
                Alert.alert(
                    'Éxito',
                    editingEvento ? 'Evento actualizado correctamente' : 'Evento creado correctamente'
                );
                setShowModal(false);
                loadEventos(); // Recargar la lista
            } else {
                console.error('❌ Error en respuesta:', response.message);
                Alert.alert('Error', response.message || 'No se pudo guardar el evento');
            }
        } catch (error) {
            console.error('❌ Error saving evento:', error);
            Alert.alert('Error', 'Error de conexión');
        }
    };

    // Función para seleccionar imágenes
    const handleSelectImages = () => {
        Alert.alert(
            'Seleccionar Imagen',
            'Elige una opción',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cámara',
                    onPress: () => openImagePicker('camera')
                },
                {
                    text: 'Galería',
                    onPress: () => openImagePicker('gallery')
                }
            ]
        );
    };

    // Abrir selector de imágenes
    const openImagePicker = (source: 'camera' | 'gallery') => {
        // Para simplificar, vamos a simular la selección de imagen
        // En una implementación real, aquí usarías React Native Image Picker
        const mockImageUri = `mock-image-${Date.now()}.jpg`;
        setSelectedImages(prev => [...prev, mockImageUri]);

        Alert.alert('Imagen Seleccionada', 'La funcionalidad de imágenes será implementada con React Native Image Picker');
    };

    // Eliminar imagen seleccionada
    const handleRemoveImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowModal(false);
        setEditingEvento(null);
        setFormData({
            nombre: '',
            descripcion: '',
            precio: 0,
            categoria: '',
            etiquetas: [],
            fechaEvento: '', // Se enviará como string ISO
            horaInicio: '',
            horaFin: '',
            lugar: '',
            direccion: '',
            cuposDisponibles: 50,
            cuposTotales: 50,
            programa: [], // ProgramaEvento[]
            prioridad: 'Media',
            observaciones: '',
            imagen: [] // Nuevo campo para imágenes
        });
        setSelectedImages([]);
    };

    // Eliminar evento
    const handleEliminarEvento = (evento: Evento) => {
        Alert.alert(
            'Confirmar Eliminación',
            `¿Estás seguro de que deseas eliminar el evento "${evento.nombre}"?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: () => {
                        (async () => {
                            try {
                                const response = await eventosService.deleteEvento(evento._id);
                                if (response.success) {
                                    Alert.alert('Éxito', 'Evento eliminado correctamente');
                                    loadEventos(); // Recargar la lista
                                } else {
                                    Alert.alert('Error', response.message || 'No se pudo eliminar el evento');
                                }
                            } catch (error) {
                                console.error('Error deleting evento:', error);
                                Alert.alert('Error', 'Error de conexión');
                            }
                        })();
                    }
                }
            ]
        );
    };

    // Cerrar modal
    const handleCerrarModal = () => {
        setShowModal(false);
        setEditingEvento(null);
    };

    return (

        <View style={styles.container}>
            {/* Header igual a Cabañas */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Eventos del Seminario</Text>
                <Text style={styles.headerSubtitle}>Descubre y participa en los eventos más importantes de nuestra comunidad</Text>
            </View>
            {/* Header de lista igual a Cabañas */}
            <View style={styles.listHeader}>
                <View style={styles.titleContainer}>
                    <Ionicons name="calendar" size={24} color={colors.primary} />
                    <Text style={styles.listTitle}>Eventos</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{filteredEventos.length}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => setShowFilters(true)}
                    style={styles.filterIcon}
                >
                    <Ionicons name="filter" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Modal de filtros igual a CabañasScreen */}
            <Modal
                visible={showFilters}
                transparent
                animationType="slide"
                onRequestClose={() => setShowFilters(false)}
            >
                <View style={styles.modalContainerTareas}>
                    <View style={styles.modalContentTareas}>
                        <View style={styles.filterHeaderTareas}>
                            <Text style={styles.filterTitleTareas}>Filtrar Eventos</Text>
                            <TouchableOpacity onPress={() => setShowFilters(false)} style={styles.closeButtonTareas}>
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.sectionTareas}>
                            <Text style={styles.sectionTitleTareas}>Categoría</Text>
                            <View style={styles.optionsContainerTareas}>
                                {categoriasFiltro.map((cat) => (
                                    <TouchableOpacity
                                        key={cat.value}
                                        style={[styles.filterChipTareas, filtros.categoria === cat.value && styles.filterChipSelectedTareas]}
                                        onPress={() => handleCategoriaPress(cat.value)}
                                    >
                                        <Text style={[styles.filterChipTextTareas, filtros.categoria === cat.value && styles.filterChipTextSelectedTareas]}>
                                            {cat.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.sectionTareas}>
                            <Text style={styles.sectionTitleTareas}>Prioridad</Text>
                            <View style={styles.optionsContainerTareas}>
                                {prioridades.map((pri) => (
                                    <TouchableOpacity
                                        key={pri.value}
                                        style={[styles.filterChipTareas, filtros.prioridad === pri.value && styles.filterChipSelectedTareas]}
                                        onPress={() => handlePrioridadPress(pri.value)}
                                    >
                                        <Text style={[styles.filterChipTextTareas, filtros.prioridad === pri.value && styles.filterChipTextSelectedTareas]}>
                                            {pri.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                        <View style={styles.filterButtonsTareas}>
                            <TouchableOpacity
                                style={styles.filterButtonSecondaryTareas}
                                onPress={() => {
                                    setFiltros({ categoria: '', prioridad: '' });
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
                {(() => {
                    if (isLoading) {
                        return (
                            <View style={styles.loadingContainer}>
                                <Text style={styles.loadingText}>Cargando eventos...</Text>
                            </View>
                        );
                    }
                    
                    if (filteredEventos.length > 0) {
                        return filteredEventos.map(evento => (
                        <View
                            key={evento._id}
                            style={styles.eventoCardWeb}
                        >
                            {evento.imagen && evento.imagen.length > 0 && (
                                <View style={styles.imageContainer}>
                                    <ScrollView
                                        horizontal
                                        showsHorizontalScrollIndicator={false}
                                        pagingEnabled
                                        style={styles.imageScrollView}
                                    >
                                        {evento.imagen.map((imageUri, index) => (
                                            <View key={`evento-image-${evento._id}-${index}-${imageUri.slice(-10)}`} style={styles.imageWrapper}>
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
                                    {evento.imagen.length > 1 && (
                                        <View style={styles.imageIndicator}>
                                            <Text style={styles.imageIndicatorText}>
                                                1/{evento.imagen.length}
                                            </Text>
                                        </View>
                                    )}
                                </View>
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

                            <TouchableOpacity
                                style={styles.eyeButton}
                                onPress={() => handleVerDetalles(evento)}
                            >
                                <Ionicons name="eye-outline" size={20} color={colors.primary} />
                                <Text style={styles.actionTextWeb}>Ver</Text>
                            </TouchableOpacity>

                            {/* Botones de administración solo para admins */}
                            {(hasRole('admin') || hasRole('tesorero')) && (
                                <View style={styles.adminActions}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => handleEditarEvento(evento)}
                                    >
                                        <Ionicons name="pencil" size={16} color="#fff" />
                                        <Text style={styles.actionButtonText}>Editar</Text>
                                    </TouchableOpacity>

                                    {hasRole('admin') && (
                                        <TouchableOpacity
                                            style={styles.deleteButton}
                                            onPress={() => handleEliminarEvento(evento)}
                                        >
                                            <Ionicons name="trash" size={16} color="#fff" />
                                            <Text style={styles.actionButtonText}>Eliminar</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            )}
                        </View>
                        ));
                    }
                    
                    return (
                        <View style={styles.emptyContainer}>
                            <Ionicons name="calendar-outline" size={64} color={colors.textSecondary} />
                            <Text style={styles.emptyText}>No se encontraron eventos</Text>
                            <Text style={styles.emptySubtext}>
                                {searchText ? 'Intenta con otros términos de búsqueda' : 'Aún no hay eventos registrados'}
                            </Text>
                        </View>
                    );
                })()}

            </ScrollView>
            {/* Botón crear evento solo para admins */}
            {(hasRole('admin') || hasRole('tesorero')) && (
                <TouchableOpacity style={styles.fab} onPress={handleCrearEvento}>
                    <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
            )}
               <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent_detalle}>
                        <View style={styles.modalHeader_detalle}>
                            <Text style={styles.modalTitle_detalle}>Información del Evento</Text>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Ionicons name="close" size={24} color={colors.text} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                            {selectedEventos && (
                                <>
                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Información General</Text>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Nombre:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.nombre}</Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Descripción:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.descripcion}</Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Categoría:</Text>
                                            <Text style={styles.modalValue}>
                                                {typeof selectedEventos.categoria === 'object' && selectedEventos.categoria?.nombre 
                                                    ? selectedEventos.categoria.nombre 
                                                    : selectedEventos.categoria || '-'}
                                            </Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Prioridad:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.prioridad}</Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Lugar:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.lugar}</Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Dirección:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.direccion || '-'}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Fechas y Horarios</Text>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Fecha:</Text>
                                            <Text style={styles.modalValue}>
                                                {selectedEventos.fechaEvento ? new Date(selectedEventos.fechaEvento).toLocaleDateString() : '-'}
                                            </Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Hora Inicio:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.horaInicio}</Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Hora Fin:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.horaFin}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Cupos y Precio</Text>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Cupos Totales:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.cuposTotales}</Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Cupos Disponibles:</Text>
                                            <Text style={styles.modalValue}>{selectedEventos.cuposDisponibles}</Text>
                                        </View>

                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Precio:</Text>
                                            <Text style={styles.modalValue}>
                                                {selectedEventos.precio ? `$${selectedEventos.precio}` : 'Gratuito'}
                                            </Text>
                                        </View>
                                    </View>

                                    {selectedEventos.observaciones && (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>Observaciones</Text>
                                            <Text style={styles.modalDescription}>{selectedEventos.observaciones}</Text>
                                        </View>
                                    )}

                                    {Array.isArray(selectedEventos.etiquetas) && selectedEventos.etiquetas.length > 0 && (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>Etiquetas</Text>
                                            <Text style={styles.modalDescription}>{selectedEventos.etiquetas.join(', ')}</Text>
                                        </View>
                                    )}

                                    {Array.isArray(selectedEventos.programa) && selectedEventos.programa.length > 0 && (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>Programa del Evento</Text>
                                            {selectedEventos.programa.map((item: any, idx: number) => (
                                                <Text key={`programa-${selectedEventos._id}-${idx}-${item.tema?.slice(0, 10) || 'item'}`} style={styles.modalListItem}>
                                                    • {item.horaInicio} - {item.horaFin}: {item.tema} 
                                                    {item.descripcion && ` (${item.descripcion})`}
                                                </Text>
                                            ))}
                                        </View>
                                    )}
                                </>
                            )}
                        </ScrollView>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* Modal para crear/editar evento */}
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
                            {editingEvento ? 'Editar Evento' : 'Crear Evento'}
                        </Text>
                        <TouchableOpacity onPress={handleGuardarEvento}>
                            <Text style={styles.saveButtonText}>Guardar</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {/* Nombre */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nombre del evento *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.nombre}
                                onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                                placeholder="Ingresa el nombre del evento"
                            />
                        </View>

                        {/* Descripción */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Descripción *</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={formData.descripcion}
                                onChangeText={(text) => setFormData({ ...formData, descripcion: text })}
                                placeholder="Describe el evento"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        {/* Fecha */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Fecha del evento *</Text>
                            <TouchableOpacity
                                onPress={() => setShowDatePicker(true)}
                                style={styles.textInput}
                                activeOpacity={0.7}
                            >
                                <Text style={{ color: formData.fechaEvento ? colors.text : colors.textSecondary }}>
                                    {formData.fechaEvento ? formData.fechaEvento.toString() : 'Selecciona la fecha'}
                                </Text>
                            </TouchableOpacity>
                            {showDatePicker && (
                                <DateTimePicker
                                    value={formData.fechaEvento ? new Date(formData.fechaEvento) : new Date()}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={(event, selectedDate) => {
                                        setShowDatePicker(false);
                                        if (selectedDate) {
                                            // Formatear a YYYY-MM-DD
                                            const year = selectedDate.getFullYear();
                                            const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
                                            const day = selectedDate.getDate().toString().padStart(2, '0');
                                            setFormData({ ...formData, fechaEvento: `${year}-${month}-${day}` });
                                        }
                                    }}
                                />
                            )}
                        </View>

                        {/* Horarios */}
                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Hora inicio *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.horaInicio}
                                    onChangeText={(text) => setFormData({ ...formData, horaInicio: text })}
                                    placeholder="09:00"
                                />
                            </View>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Hora fin *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.horaFin}
                                    onChangeText={(text) => setFormData({ ...formData, horaFin: text })}
                                    placeholder="17:00"
                                />
                            </View>
                        </View>

                        {/* Lugar y Dirección */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Lugar *</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.lugar}
                                onChangeText={(text) => setFormData({ ...formData, lugar: text })}
                                placeholder="Ubicación del evento"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Dirección</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.direccion}
                                onChangeText={(text) => setFormData({ ...formData, direccion: text })}
                                placeholder="Dirección específica (opcional)"
                            />
                        </View>

                        {/* Precio, Cupos y Duración */}
                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Precio</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.precio.toString()}
                                    onChangeText={(text) => setFormData({ ...formData, precio: Number.parseFloat(text) || 0 })}
                                    placeholder="0"
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Cupos totales *</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.cuposTotales.toString()}
                                    onChangeText={(text) => setFormData({ ...formData, cuposTotales: Number.parseInt(text, 10) || 50 })}
                                    placeholder="50"
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Cupos disponibles</Text>
                                <TextInput
                                    style={styles.textInput}
                                    value={formData.cuposDisponibles.toString()}
                                    onChangeText={(text) => setFormData({ ...formData, cuposDisponibles: Number.parseInt(text, 10) || 0 })}
                                    placeholder="Se asignará automáticamente"
                                    keyboardType="numeric"
                                    editable={false}
                                />
                            </View>
                        </View>

                        {/* Categoría y Prioridad */}

                        <View style={styles.rowInputs}>
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Categoría *</Text>
                                {categorias.length === 0 ? (
                                    <View style={styles.noCategoriesContainer}>
                                        <Text style={styles.noCategoriesText}>No hay categorías disponibles</Text>
                                    </View>
                                ) : (
                                    <View style={styles.pickerWrapper}>
                                        <Picker
                                            selectedValue={formData.categoria}
                                            onValueChange={(itemValue) => setFormData({ ...formData, categoria: itemValue })}
                                            style={styles.picker}
                                            dropdownIconColor={colors.primary}
                                        >
                                            <Picker.Item
                                                label="Selecciona una categoría"
                                                value=""
                                                color={colors.textSecondary}
                                            />
                                            {categorias.map((cat) => (
                                                <Picker.Item
                                                    key={cat._id}
                                                    label={cat.tipo ? `${cat.nombre} (${cat.tipo})` : cat.nombre}
                                                    value={cat._id}
                                                    color={colors.text}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                )}
                            </View>

                            {/* Prioridad */}
                            <View style={[styles.inputGroup, styles.halfWidth]}>
                                <Text style={styles.inputLabel}>Prioridad</Text>
                                <View style={styles.pickerWrapper}>
                                    <Picker
                                        selectedValue={formData.prioridad}
                                        onValueChange={(itemValue) => setFormData({ ...formData, prioridad: itemValue })}
                                        style={styles.picker}
                                        dropdownIconColor={colors.primary}
                                    >
                                        <Picker.Item label="Media" value="Media" color={colors.text} />
                                        <Picker.Item label="Alta" value="Alta" color={colors.text} />
                                        <Picker.Item label="Baja" value="Baja" color={colors.text} />
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        {/* Etiquetas */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Etiquetas</Text>
                            <TextInput
                                style={styles.textInput}
                                value={formData.etiquetas.join(', ')}
                                onChangeText={(text) => {
                                    const etiquetas = text.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                                    setFormData({ ...formData, etiquetas });
                                }}
                                placeholder="Separadas por comas (ej: música, concierto, cultura)"
                            />
                        </View>

                        {/* Sección de Imágenes */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Imágenes del Evento</Text>
                            <TouchableOpacity
                                style={styles.imageSelector}
                                onPress={handleSelectImages}
                            >
                                <Text style={styles.imageSelectorText}>+ Agregar Imagen</Text>
                            </TouchableOpacity>

                            {selectedImages.length > 0 && (
                                <ScrollView horizontal style={styles.imagePreviewContainer}>
                                    {selectedImages.map((imageUri, index) => (
                                        <View key={`selected-image-${index}-${imageUri.slice(-10)}`} style={styles.imagePreview}>
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

                        {/* Observaciones */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Observaciones</Text>
                            <TextInput
                                style={[styles.textInput, styles.textArea]}
                                value={formData.observaciones}
                                onChangeText={(text) => setFormData({ ...formData, observaciones: text })}
                                placeholder="Observaciones adicionales"
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    </ScrollView>

                    {/* Botones del Modal */}
                    <View style={styles.modalButtons}>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSecondary]}
                            onPress={handleCloseModal}
                        >
                            <Text style={styles.buttonSecondaryText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.buttonPrimary]}
                            onPress={handleGuardarEvento}
                        >
                            <Text style={styles.buttonPrimaryText}>
                                {editingEvento ? 'Actualizar' : 'Crear'} Evento
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    eyeButton: {
        flexDirection: 'row',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        marginLeft: spacing.sm,
        alignSelf: 'flex-end',
    },
    actionTextWeb: {
        marginLeft: spacing.xs,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    // Header y lista igual a Cabañas
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
    titleContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
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
    // Estilos de filtro igual a tareas/cabañas
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
    createButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: 8,
        marginTop: spacing.md,
        ...shadows.small,
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
        width: 348,
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
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
        backgroundColor: colors.surface,
    },
    modalTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
    },
    saveButtonText: {
        color: colors.primary,
        fontWeight: typography.fontWeight.bold,
        fontSize: typography.fontSize.md,
    },
    modalContent: {
        flex: 1,
        padding: spacing.lg,
    },
    inputGroup: {
        marginBottom: 16,
        flex: 1,
    },
    inputLabel: {
        fontSize: typography.fontSize.md,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        fontSize: typography.fontSize.md,
        color: colors.text,
        backgroundColor: colors.surface,
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

    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    halfWidth: {
        flex: 1,
        marginRight: 8,
    },

    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: '#fff',
        marginTop: 4,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
        width: '100%',
    },
    noCategoriesContainer: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        marginTop: 4,
    },
    noCategoriesText: {
        color: '#888',
        fontSize: typography.fontSize.md,
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
    // (Eliminadas definiciones duplicadas de header y headerTitle)
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
    // Estilos para la sección de imágenes
    imageSelector: {
        backgroundColor: colors.background,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        borderRadius: spacing.sm,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: spacing.xs,
    },
    imageSelectorText: {
        color: colors.primary,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
    },
    imagePreviewContainer: {
        marginTop: spacing.md,
        paddingHorizontal: spacing.xs,
    },
    imagePreview: {
        marginRight: spacing.md,
        alignItems: 'center',
        position: 'relative',
    },
    imagePlaceholder: {
        width: 80,
        height: 80,
        backgroundColor: colors.background,
        borderRadius: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    imagePlaceholderText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: colors.danger,
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: colors.surface,
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        lineHeight: typography.fontSize.lg,
    },
    // Estilos para los botones del modal
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSecondary: {
        backgroundColor: colors.background,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    buttonPrimary: {
        backgroundColor: colors.primary,
        marginLeft: spacing.sm,
    },
    buttonSecondaryText: {
        color: colors.textSecondary,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.medium,
    },
    buttonPrimaryText: {
        color: colors.surface,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
    },
        listContainer: {
        flex: 1,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent_detalle: {
        backgroundColor: colors.surface,
        marginHorizontal: 0,
        marginVertical: spacing.md,
        borderRadius: 16,
        maxHeight: '96%',
        width: '95%',
        height: '95%',
        alignSelf: 'center',
        ...shadows.medium,
    },
    modalHeader_detalle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    modalTitle_detalle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
    },
    closeButton: {
        padding: spacing.xs,
        borderRadius: 20,
        backgroundColor: '#f1f5f9',
    },
    modalBody: {
        flex: 1,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.lg,
    },
    modalSection: {
        marginBottom: spacing.lg,
    },
    modalSectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.primary,
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        paddingBottom: spacing.xs,
    },
    modalInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
        flexWrap: 'wrap',
    },
    modalLabel: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.textSecondary,
        flex: 1,
        minWidth: 100,
    },
    modalValue: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        flex: 2,
        textAlign: 'right',
    },
    modalDescription: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        lineHeight: 20,
        textAlign: 'justify',
    },
    modalListItem: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        marginBottom: spacing.xs,
        paddingLeft: spacing.sm,
    },
    modalFooter: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    modalCloseButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        borderRadius: 8,
        alignItems: 'center',
    },
    modalCloseButtonText: {
        color: colors.surface,
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
    },
});

export default EventosScreen;