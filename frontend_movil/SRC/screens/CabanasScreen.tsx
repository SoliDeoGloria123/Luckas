// Pantalla de gestión de cabañas
import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Image,
    RefreshControl,
    Modal,
    StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { cabanasService } from '../services';
import { Cabana } from '../types';
import { seminaristaStyles } from '../styles/SeminaristaMovil';
import { colors } from '../styles/colors';

const CabanasScreen: React.FC = () => {
    const { canEdit, canDelete, user, hasRole } = useAuth();
    const [cabanas, setCabanas] = useState<Cabana[]>([]);
    const [searchText, setSearchText] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedCabana, setSelectedCabana] = useState<Cabana | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filterEstado, setFilterEstado] = useState<string>('Todos');

    // Verificar si el usuario tiene permisos para ver cabañas
    useEffect(() => {
        if (!user || (!hasRole('admin') && !hasRole('tesorero') && !hasRole('seminarista'))) {
            Alert.alert(
                'Acceso Denegado',
                'No tienes permisos para ver la información de las cabañas',
                [{ text: 'OK' }]
            );
            // Aquí podrías redirigir al usuario a otra pantalla si lo deseas
        }
    }, [user, hasRole]);

    // Estados disponibles
    const estados = ['Todos', ...cabanasService.getEstados()];

    // Cargar cabañas
    const loadCabanas = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await cabanasService.getAllCabanas();
            if (response.success && response.data) {
                setCabanas(response.data);
            } else {
                Alert.alert('Error', response.message || 'No se pudieron cargar las cabañas');
                setCabanas([]);
            }
        } catch (error) {
            console.error('Error loading cabanas:', error);
            Alert.alert('Error', 'Error de conexión');
            setCabanas([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCabanas();
    }, [loadCabanas]);

    // Refrescar cabañas
    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadCabanas();
        setRefreshing(false);
    }, [loadCabanas]);

    // Filtrar cabañas
    const filteredCabanas = cabanas.filter(cabana => {
        const matchesSearch = 
            cabana.nombre.toLowerCase().includes(searchText.toLowerCase()) ||
            cabana.descripcion?.toLowerCase().includes(searchText.toLowerCase()) ||
            cabana.ubicacion?.toLowerCase().includes(searchText.toLowerCase());
        
        const matchesFilter = filterEstado === 'Todos' || cabana.estado === filterEstado;
        
        return matchesSearch && matchesFilter;
    });

    // Nota: Funcionalidad de agregar cabañas deshabilitada en la versión móvil

    // Manejar editar cabaña - solo visualización
    const handleEditCabana = (cabana: Cabana) => {
        Alert.alert('Solo Visualización', 'La funcionalidad de edición no está disponible en la versión móvil');
    };

    // Manejar cambiar estado de cabaña
    const handleChangeEstado = (cabana: Cabana) => {
        if (canEdit()) {
            const estados = cabanasService.getEstados();
            Alert.alert(
                'Cambiar Estado',
                `Estado actual: ${cabana.estado}`,
                [
                    { text: 'Cancelar', style: 'cancel' },
                    ...estados.map(estado => ({
                        text: estado,
                        onPress: async () => {
                            try {
                                const response = await cabanasService.updateCabana(cabana._id, { estado: estado as 'disponible' | 'ocupada' | 'mantenimiento' });
                                if (response.success) {
                                    Alert.alert('Éxito', `Estado cambiado a ${estado}`);
                                    loadCabanas();
                                } else {
                                    Alert.alert('Error', response.message || 'No se pudo cambiar el estado');
                                }
                            } catch (error) {
                                Alert.alert('Error', 'Error de conexión');
                            }
                        }
                    }))
                ]
            );
        } else {
            Alert.alert('Sin permisos', 'No tienes permisos para cambiar el estado');
        }
    };

    // Manejar eliminar cabaña
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
        <View style={seminaristaStyles.container}>
            {/* Header */}
            <View style={[seminaristaStyles.card, { marginBottom: 10 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={seminaristaStyles.title}>Cabañas</Text>
                </View>
            </View>

            {/* Barra de búsqueda */}
            <View style={[seminaristaStyles.card, { marginBottom: 15 }]}>
                <View style={{ 
                    flexDirection: 'row', 
                    backgroundColor: '#fff',
                    borderRadius: 8,
                    padding: 10,
                    borderWidth: 1,
                    borderColor: '#ddd'
                }}>
                    <Ionicons name="search-outline" size={20} color="#666" style={{ marginRight: 10 }} />
                    <TextInput
                        placeholder="Buscar cabañas..."
                        value={searchText}
                        onChangeText={setSearchText}
                        style={{ flex: 1 }}
                    />
                </View>
            </View>

            {/* Filtros */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 15 }}
            >
                {estados.map((estado) => (
                    <TouchableOpacity
                        key={estado}
                        style={[
                            seminaristaStyles.button,
                            { 
                                marginRight: 10,
                                backgroundColor: filterEstado === estado ? '#198754' : '#fff',
                                borderWidth: 1,
                                borderColor: '#198754'
                            }
                        ]}
                        onPress={() => setFilterEstado(estado)}
                    >
                        <Text style={[
                            seminaristaStyles.buttonText,
                            { color: filterEstado === estado ? '#fff' : '#198754' }
                        ]}>
                            {estado}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Lista de cabañas */}
            <ScrollView 
                style={styles.scrollContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Cargando cabañas...</Text>
                    </View>
                ) : filteredCabanas.length > 0 ? (
                    filteredCabanas.map(cabana => (
                        <View key={cabana._id} style={[seminaristaStyles.card, { marginBottom: 15 }]}>
                            {cabana.imagen && cabana.imagen.length > 0 && (
                                <Image 
                                    source={{ uri: cabana.imagen[0] }}
                                    style={styles.cabanaImage}
                                    resizeMode="cover"
                                />
                            )}

                            <View style={{ padding: 15 }}>
                                <View style={{ 
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={[seminaristaStyles.title, { marginBottom: 0 }]}>
                                            {cabana.nombre}
                                        </Text>
                                        {cabana.ubicacion && (
                                            <Text style={[seminaristaStyles.text, { color: '#666' }]}>
                                                📍 {cabana.ubicacion}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={[seminaristaStyles.badge, { backgroundColor: cabanasService.getEstadoColor(cabana.estado) }]}>
                                        <Ionicons 
                                            name={cabanasService.getEstadoIcon(cabana.estado) as any}
                                            size={16}
                                            color="#fff"
                                            style={{ marginRight: 5 }}
                                        />
                                        <Text style={seminaristaStyles.badgeText}>
                                            {cabana.estado}
                                        </Text>
                                    </View>
                                </View>

                                {cabana.descripcion && (
                                    <Text style={[seminaristaStyles.text, { marginBottom: 10 }]} numberOfLines={2}>
                                        {cabana.descripcion}
                                    </Text>
                                )}

                                <View style={{ flexDirection: 'row', marginBottom: 10, gap: 15 }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="people-outline" size={16} color="#198754" />
                                        <Text style={[seminaristaStyles.text, { marginLeft: 5 }]}>
                                            {cabana.capacidad} personas
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Ionicons name="cash-outline" size={16} color="#198754" />
                                        <Text style={[seminaristaStyles.text, { marginLeft: 5 }]}>
                                            ${cabana.precio?.toLocaleString()}/noche
                                        </Text>
                                    </View>
                                </View>

                                {cabana.categoria && (
                                    <View style={{ 
                                        backgroundColor: '#e9ecef',
                                        padding: 5,
                                        borderRadius: 4,
                                        alignSelf: 'flex-start',
                                        marginBottom: 10
                                    }}>
                                        <Text style={{ color: '#666', fontSize: 14 }}>
                                            Categoría: {cabana.categoria}
                                        </Text>
                                    </View>
                                )}

                                <View style={{ 
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    gap: 10
                                }}>
                                    <TouchableOpacity 
                                        style={[seminaristaStyles.button, { backgroundColor: '#0dcaf0' }]}
                                        onPress={() => handleChangeEstado(cabana)}
                                    >
                                        <Ionicons name="eye-outline" size={20} color="#fff" />
                                    </TouchableOpacity>

                                    {canEdit() && (
                                        <>
                                            <TouchableOpacity 
                                                style={[seminaristaStyles.button, { backgroundColor: '#ffc107' }]}
                                                onPress={() => handleEditCabana(cabana)}
                                            >
                                                <Ionicons name="pencil-outline" size={20} color="#000" />
                                            </TouchableOpacity>
                                            
                                            <TouchableOpacity 
                                                style={[seminaristaStyles.button, { backgroundColor: '#0dcaf0' }]}
                                                onPress={() => handleChangeEstado(cabana)}
                                            >
                                                <Ionicons name="swap-horizontal-outline" size={20} color="#fff" />
                                            </TouchableOpacity>
                                        </>
                                    )}
                                    
                                    {canDelete() && (
                                        <TouchableOpacity 
                                            style={[seminaristaStyles.button, { backgroundColor: '#dc3545' }]}
                                            onPress={() => handleDeleteCabana(cabana)}
                                        >
                                            <Ionicons name="trash-outline" size={20} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
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
        </View>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    cabanaImage: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    emptyText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#666',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    }
});

export default CabanasScreen;