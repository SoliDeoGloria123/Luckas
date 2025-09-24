// Pantalla principal (Dashboard) del sistema seminario

import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { seminaristaStyles } from '../styles/SeminaristaMovil';

const HomeScreen: React.FC = () => {
    const { user, logout } = useAuth();
    const { isAdmin, isTesorero, isSeminarista } = useAuth();

    const handleLogout = async () => {
        Alert.alert(
            'Cerrar Sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Cerrar Sesión', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await logout();
                        } catch (error) {
                            Alert.alert('Error', 'No se pudo cerrar la sesión');
                        }
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

    return (
        <ScrollView style={seminaristaStyles.container}>
            {/* Header con información del usuario */}
            <View style={[seminaristaStyles.card, { marginTop: 10 }]}>
                <View>
                    <Text style={seminaristaStyles.cardTitle}>
                        {getWelcomeMessage()}, {user?.nombre}
                    </Text>
                    <Text style={seminaristaStyles.cardText}>
                        {getRoleDisplayName(user?.role || '')}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={[seminaristaStyles.button, { backgroundColor: 'transparent' }]}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#dc3545" />
                </TouchableOpacity>
            </View>

            {/* Sección de acceso rápido */}
            <Text style={seminaristaStyles.sectionTitle}>Acceso Rápido</Text>
            
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                {/* Card Cursos */}
                <TouchableOpacity style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="school-outline" size={32} color="#198754" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Cursos</Text>
                    <Text style={seminaristaStyles.cardText}>Gestionar cursos</Text>
                </TouchableOpacity>

                {/* Card Eventos */}
                <TouchableOpacity style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="calendar-outline" size={32} color="#198754" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Eventos</Text>
                    <Text style={seminaristaStyles.cardText}>Ver eventos</Text>
                </TouchableOpacity>

                {/* Card Reservas */}
                <TouchableOpacity style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="bed-outline" size={32} color="#198754" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Reservas</Text>
                    <Text style={seminaristaStyles.cardText}>Gestionar reservas</Text>
                </TouchableOpacity>

                {/* Card Perfil */}
                <TouchableOpacity style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}>
                    <View style={{ alignItems: 'center', marginBottom: 10 }}>
                        <Ionicons name="person-outline" size={32} color="#198754" />
                    </View>
                    <Text style={seminaristaStyles.cardTitle}>Perfil</Text>
                    <Text style={seminaristaStyles.cardText}>Ver mi perfil</Text>
                </TouchableOpacity>

                {/* Card Programas (solo admin y tesorero) */}
                {(isAdmin() || isTesorero()) && (
                    <TouchableOpacity style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name="library-outline" size={32} color="#198754" />
                        </View>
                        <Text style={seminaristaStyles.cardTitle}>Programas</Text>
                        <Text style={seminaristaStyles.cardText}>Programas Técnicos</Text>
                    </TouchableOpacity>
                )}

                {/* Card Reportes (solo admin y tesorero) */}
                {(isAdmin() || isTesorero()) && (
                    <TouchableOpacity style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name="bar-chart-outline" size={32} color="#198754" />
                        </View>
                        <Text style={seminaristaStyles.cardTitle}>Reportes</Text>
                        <Text style={seminaristaStyles.cardText}>Ver estadísticas</Text>
                    </TouchableOpacity>
                )}

                {/* Card Usuarios (solo admin) */}
                {isAdmin() && (
                    <TouchableOpacity style={[seminaristaStyles.card, { width: '48%', marginBottom: 10 }]}>
                        <View style={{ alignItems: 'center', marginBottom: 10 }}>
                            <Ionicons name="people-outline" size={32} color="#198754" />
                        </View>
                        <Text style={seminaristaStyles.cardTitle}>Usuarios</Text>
                        <Text style={seminaristaStyles.cardText}>Gestionar usuarios</Text>
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