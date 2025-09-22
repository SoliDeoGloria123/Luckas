// Ejemplo de uso de los servicios de inscripciones, reportes y solicitudes

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Alert, TouchableOpacity } from 'react-native';
import { seminaristaStyles as styles } from '../styles/SeminaristaMovil';
import { 
    inscripcionesService, 
    reportesService, 
    solicitudesService
} from '../services';
import { Reporte } from '../types';
import { Inscripcion } from '../services/inscripciones';
import { Solicitud } from '../services/solicitudes';

interface ServicesTestScreenProps {}

const ServicesTestScreen: React.FC<ServicesTestScreenProps> = () => {
    const [inscripciones, setInscripciones] = useState<Inscripcion[]>([]);
    const [reportes, setReportes] = useState<Reporte[]>([]);
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
    const [loading, setLoading] = useState(false);

    // Probar servicio de inscripciones
    const testInscripciones = async () => {
        setLoading(true);
        try {
            const response = await inscripcionesService.getAllInscripciones();
            if (response.success && response.data) {
                setInscripciones(response.data);
                Alert.alert('Éxito', `Se obtuvieron ${response.data.length} inscripciones`);
            } else {
                Alert.alert('Error', response.message || 'Error al obtener inscripciones');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión al obtener inscripciones');
            console.error('Error inscripciones:', error);
        } finally {
            setLoading(false);
        }
    };

    // Probar servicio de reportes
    const testReportes = async () => {
        setLoading(true);
        try {
            const response = await reportesService.getAllReportes();
            if (response.success && response.data) {
                setReportes(response.data);
                Alert.alert('Éxito', `Se obtuvieron ${response.data.length} reportes`);
            } else {
                Alert.alert('Error', response.message || 'Error al obtener reportes');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión al obtener reportes');
            console.error('Error reportes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Probar servicio de solicitudes
    const testSolicitudes = async () => {
        setLoading(true);
        try {
            const response = await solicitudesService.getAllSolicitudes();
            if (response.success && response.data) {
                setSolicitudes(response.data);
                Alert.alert('Éxito', `Se obtuvieron ${response.data.length} solicitudes`);
            } else {
                Alert.alert('Error', response.message || 'Error al obtener solicitudes');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión al obtener solicitudes');
            console.error('Error solicitudes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Probar crear inscripción
    const testCreateInscripcion = async () => {
        const nuevaInscripcion = {
            evento: '507f1f77bcf86cd799439011', // ID de ejemplo
            observaciones: 'Inscripción de prueba',
            pago: {
                monto: 50000,
                metodoPago: 'efectivo',
                referencia: 'TEST001'
            }
        };

        try {
            const response = await inscripcionesService.createInscripcion(nuevaInscripcion);
            if (response.success) {
                Alert.alert('Éxito', 'Inscripción creada correctamente');
                testInscripciones(); // Refrescar lista
            } else {
                Alert.alert('Error', response.message || 'Error al crear inscripción');
            }
        } catch (error) {
            Alert.alert('Error', 'Error de conexión al crear inscripción');
            console.error('Error crear inscripción:', error);
        }
    };

    useEffect(() => {
        // Probar al cargar el componente
        console.log('Servicios disponibles:');
        console.log('inscripcionesService:', inscripcionesService);
        console.log('reportesService:', reportesService);
        console.log('solicitudesService:', solicitudesService);
    }, []);

    const renderInscripcion = ({ item }: { item: Inscripcion }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>ID: {item._id}</Text>
            <Text style={styles.cardText}>Estado: {item.estado}</Text>
            <Text style={styles.cardText}>Fecha: {new Date(item.fechaInscripcion).toLocaleDateString()}</Text>
            <Text style={styles.cardText}>Pago: ${item.pago.monto}</Text>
        </View>
    );

    const renderReporte = ({ item }: { item: Reporte }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardText}>Fecha: {new Date(item.fechaGeneracion).toLocaleDateString()}</Text>
        </View>
    );

    const renderSolicitud = ({ item }: { item: Solicitud }) => (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardText}>Tipo: {item.tipo}</Text>
            <Text style={styles.cardText}>Estado: {item.estado}</Text>
            <Text style={styles.cardText}>Prioridad: {item.prioridad}</Text>
            <Text style={styles.cardText}>Fecha: {new Date(item.fechaSolicitud).toLocaleDateString()}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Prueba de Servicios</Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', marginBottom: 20 }}>
                <TouchableOpacity 
                    style={styles.button} 
                    onPress={testInscripciones}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Probar Inscripciones</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={testReportes}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Probar Reportes</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={testSolicitudes}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Probar Solicitudes</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={testCreateInscripcion}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Crear Inscripción</Text>
                </TouchableOpacity>
            </View>

            {loading && <Text style={styles.loading}>Cargando...</Text>}

            {inscripciones.length > 0 && (
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Inscripciones:</Text>
                    <FlatList
                        data={inscripciones}
                        renderItem={renderInscripcion}
                        keyExtractor={(item) => item._id}
                        style={styles.list}
                    />
                </View>
            )}

            {reportes.length > 0 && (
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Reportes:</Text>
                    <FlatList
                        data={reportes}
                        renderItem={renderReporte}
                        keyExtractor={(item) => item._id}
                        style={styles.list}
                    />
                </View>
            )}

            {solicitudes.length > 0 && (
                <View style={styles.container}>
                    <Text style={styles.sectionTitle}>Solicitudes:</Text>
                    <FlatList
                        data={solicitudes}
                        renderItem={renderSolicitud}
                        keyExtractor={(item) => item._id}
                        style={styles.list}
                    />
                </View>
            )}
        </View>
    );
};



export default ServicesTestScreen;