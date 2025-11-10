// Pantalla principal (Dashboard) del sistema seminario
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { seminaristaStyles } from '../styles/SeminaristaMovil';



const HomeScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const { isAdmin, isTesorero, isSeminarista } = useAuth();
    const navigation = useNavigation();
    
    // Estados para estadísticas (simuladas por ahora)
    const [stats, setStats] = useState({
        cursos: 12,
        eventos: 8,
        reservas: 25,
        usuarios: 145
    });

    // Simular carga de estadísticas
    useEffect(() => {
        // Aquí podrías hacer una llamada a la API para obtener estadísticas reales
        const fetchStats = () => {
            // Simulación de datos dinámicos
            setStats({
                cursos: Math.floor(Math.random() * 20) + 10,
                eventos: Math.floor(Math.random() * 15) + 5,
                reservas: Math.floor(Math.random() * 50) + 20,
                usuarios: Math.floor(Math.random() * 100) + 100
            });
        };
        
        fetchStats();
    }, []);

    const handleLogout = async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Cerrar Sesión', 
                    style: 'destructive',
                    onPress: () => {
                        (async () => {
                            try {
                                await logout();
                            } catch (error) {
                                console.error('Error al cerrar sesión:', error);
                                Alert.alert('Error', 'No se pudo cerrar la sesión');
                            }
                        })();
                    }
                }
            ]
        );
    };

    const getRoleDisplayName = (role: string) => {
        switch (role) {
            case 'admin': return 'Administrador';
            case 'tesorero': return 'Tesorero';
            case 'seminarista': return 'Seminarista';
            case 'externo': return 'Usuario Externo';
            default: return 'Usuario';
        }
    };

    const getWelcomeMessage = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Buenos días';
        if (hour < 18) return 'Buenas tardes';
        return 'Buenas noches';
    };

    const getUserInitials = (name: string) => {
        if (!name) return 'U';
        const nameParts = name.split(' ');
        if (nameParts.length >= 2) {
            return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
        }
        return name[0].toUpperCase();
    };

    // Funciones de navegación para acceso rápido
    const navigateToCursos = () => {
        navigation.navigate('Cursos' as never);
    };

    const navigateToEventos = () => {
        navigation.navigate('Eventos' as never);
    };

    const navigateToReservas = () => {
        navigation.navigate('Cabanas' as never);
    };

    const navigateToProfile = () => {
        navigation.navigate('Profile' as never);
    };

    const navigateToProgramas = () => {
        // Si hay una screen específica de programas, navegar allí
        // Por ahora, mostrar un alert indicando que está en desarrollo
        Alert.alert('Programas', 'Funcionalidad en desarrollo');
    };

    return (
        <ScrollView style={seminaristaStyles.container}>
            {/* Header con información del usuario mejorado */}
            <View style={seminaristaStyles.userHeader}>
                {/* Avatar con iniciales */}
                <View style={seminaristaStyles.userAvatar}>
                    <Text style={seminaristaStyles.avatarText}>
                        {getUserInitials(user?.nombre || 'Usuario')}
                    </Text>
                </View>
                
                <View style={seminaristaStyles.userInfo}>
                    <Text style={seminaristaStyles.welcomeText}>
                        {getWelcomeMessage()}, {user?.nombre}
                    </Text>
                    <Text style={seminaristaStyles.roleText}>
                        {getRoleDisplayName(user?.role || '')}
                    </Text>
                </View>
                
                <TouchableOpacity 
                    style={seminaristaStyles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={20} color="white" />
                    <Text style={seminaristaStyles.logoutButtonText}>Salir</Text>
                </TouchableOpacity>
            </View>

            {/* Sección de estadísticas */}
            <Text style={seminaristaStyles.sectionTitle}>Estadísticas del Sistema</Text>
            <View style={seminaristaStyles.statsGrid}>
                <View style={[seminaristaStyles.statCard, { borderLeftColor: '#2563eb' }]}>
                    <View style={seminaristaStyles.statIcon}>
                        <Ionicons name="school-outline" size={32} color="#2563eb" />
                    </View>
                    <Text style={seminaristaStyles.statNumber}>{stats.cursos}</Text>
                    <Text style={seminaristaStyles.statLabel}>Cursos </Text>
                </View>
                
                <View style={[seminaristaStyles.statCard, { borderLeftColor: '#059669' }]}>
                    <View style={seminaristaStyles.statIcon}>
                        <Ionicons name="calendar-outline" size={32} color="#059669" />
                    </View>
                    <Text style={seminaristaStyles.statNumber}>{stats.eventos}</Text>
                    <Text style={seminaristaStyles.statLabel}>Eventos</Text>
                </View>
                
                <View style={[seminaristaStyles.statCard, { borderLeftColor: '#8b5cf6' }]}>
                    <View style={seminaristaStyles.statIcon}>
                        <Ionicons name="bed-outline" size={32} color="#8b5cf6" />
                    </View>
                    <Text style={seminaristaStyles.statNumber}>{stats.reservas}</Text>
                    <Text style={seminaristaStyles.statLabel}>Reservas</Text>
                </View>
                
                <View style={[seminaristaStyles.statCard, { borderLeftColor: '#059669' }]}>
                    <View style={seminaristaStyles.statIcon}>
                        <Ionicons name="bed-outline" size={32} color="#059669" />
                    </View>
                    <Text style={seminaristaStyles.statNumber}>{stats.reservas}</Text>
                    <Text style={seminaristaStyles.statLabel}>Tareas </Text>
                </View>
                
               
            </View>

            {/* Sección de acceso rápido */}
            <Text style={seminaristaStyles.sectionTitle}>Acceso Rápido</Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {/* Card Cursos */}
                <TouchableOpacity 
                    style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}
                    onPress={navigateToCursos}
                >
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="school-outline" size={32} color="#2563eb" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Cursos</Text>
                    <Text style={seminaristaStyles.cardText}>Gestionar cursos</Text>
                </TouchableOpacity>

                {/* Card Eventos */}
                <TouchableOpacity 
                    style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}
                    onPress={navigateToEventos}
                >
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="calendar-outline" size={32} color="#059669" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Eventos</Text>
                    <Text style={seminaristaStyles.cardText}>Ver eventos</Text>
                </TouchableOpacity>

                {/* Card Reservas */}
                <TouchableOpacity 
                    style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}
                    onPress={navigateToReservas}
                >
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="bed-outline" size={32} color="#8b5cf6" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Reservas</Text>
                    <Text style={seminaristaStyles.cardText}>Gestionar reservas</Text>
                </TouchableOpacity>

                {/* Card Perfil */}
                <TouchableOpacity 
                    style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}
                    onPress={navigateToProfile}
                >
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="person-outline" size={32} color="#198754" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Perfil</Text>
                    <Text style={seminaristaStyles.cardText}>Ver mi perfil</Text>
                </TouchableOpacity>
                {/* Card Programas (solo admin y tesorero) */}
                {(isAdmin() || isTesorero()) && (
                    <TouchableOpacity 
                        style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}
                        onPress={navigateToProgramas}
                    >
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name="library-outline" size={32} color="#334155" />
                        </View>
                        <Text style={seminaristaStyles.cardTitle}>Programas</Text>
                        <Text style={seminaristaStyles.cardText}>Programas Técnicos</Text>
                    </TouchableOpacity>
                )}
               
            </View>

            {/* Información del sistema */}
            <View style={[seminaristaStyles.card, { marginTop: 20 }]}>
                <Text style={seminaristaStyles.cardTitle}>Sistema Seminario</Text>
                <Text style={seminaristaStyles.cardText}>
                    Bienvenido al sistema de gestión del seminario. 
                    Desde aquí puedes acceder a todas las funcionalidades disponibles según tu rol.
                </Text>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;