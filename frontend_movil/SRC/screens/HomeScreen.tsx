// Pantalla principal (Dashboard) del sistema seminario

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { colors, spacing, typography, shadows } from '../styles';

const HomeScreen: React.FC = () => {
    const { user, logout, isAdmin, isTesorero, isSeminarista } = useAuth();

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
        <ScrollView style={styles.container}>
            {/* Header con información del usuario */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.greeting}>
                        {getWelcomeMessage()}, {user?.nombre}
                    </Text>
                    <Text style={styles.roleText}>
                        {getRoleDisplayName(user?.role || '')}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color={colors.danger} />
                </TouchableOpacity>
            </View>

            {/* Cards de acceso rápido */}
            <View style={styles.quickAccessContainer}>
                <Text style={styles.sectionTitle}>Acceso Rápido</Text>
                
                <View style={styles.cardGrid}>
                    {/* Card Cursos */}
                    <TouchableOpacity style={styles.card}>
                        <View style={[styles.cardIcon, { backgroundColor: colors.primary + '20' }]}>
                            <Ionicons name="school-outline" size={32} color={colors.primary} />
                        </View>
                        <Text style={styles.cardTitle}>Cursos</Text>
                        <Text style={styles.cardSubtitle}>Gestionar cursos</Text>
                    </TouchableOpacity>

                    {/* Card Eventos */}
                    <TouchableOpacity style={styles.card}>
                        <View style={[styles.cardIcon, { backgroundColor: colors.success + '20' }]}>
                            <Ionicons name="calendar-outline" size={32} color={colors.success} />
                        </View>
                        <Text style={styles.cardTitle}>Eventos</Text>
                        <Text style={styles.cardSubtitle}>Ver eventos</Text>
                    </TouchableOpacity>

                    {/* Card Reservas */}
                    <TouchableOpacity style={styles.card}>
                        <View style={[styles.cardIcon, { backgroundColor: colors.warning + '20' }]}>
                            <Ionicons name="bed-outline" size={32} color={colors.warning} />
                        </View>
                        <Text style={styles.cardTitle}>Reservas</Text>
                        <Text style={styles.cardSubtitle}>Cabañas</Text>
                    </TouchableOpacity>

                    {/* Card Programas (solo admin y tesorero) */}
                    {(isAdmin() || isTesorero()) && (
                        <TouchableOpacity style={styles.card}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.info + '20' }]}>
                                <Ionicons name="library-outline" size={32} color={colors.info} />
                            </View>
                            <Text style={styles.cardTitle}>Programas</Text>
                            <Text style={styles.cardSubtitle}>Técnicos</Text>
                        </TouchableOpacity>
                    )}

                    {/* Card Reportes (solo admin y tesorero) */}
                    {(isAdmin() || isTesorero()) && (
                        <TouchableOpacity style={styles.card}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.secondary + '20' }]}>
                                <Ionicons name="bar-chart-outline" size={32} color={colors.secondary} />
                            </View>
                            <Text style={styles.cardTitle}>Reportes</Text>
                            <Text style={styles.cardSubtitle}>Estadísticas</Text>
                        </TouchableOpacity>
                    )}

                    {/* Card Usuarios (solo admin) */}
                    {isAdmin() && (
                        <TouchableOpacity style={styles.card}>
                            <View style={[styles.cardIcon, { backgroundColor: colors.danger + '20' }]}>
                                <Ionicons name="people-outline" size={32} color={colors.danger} />
                            </View>
                            <Text style={styles.cardTitle}>Usuarios</Text>
                            <Text style={styles.cardSubtitle}>Gestionar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Información del sistema */}
            <View style={styles.systemInfo}>
                <Text style={styles.sectionTitle}>Sistema Seminario</Text>
                <Text style={styles.systemText}>
                    Bienvenido al sistema de gestión del seminario. 
                    Desde aquí puedes acceder a todas las funcionalidades disponibles según tu rol.
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        backgroundColor: colors.surface,
        ...shadows.small,
    },
    userInfo: {
        flex: 1,
    },
    greeting: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    roleText: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
    logoutButton: {
        padding: spacing.sm,
    },
    quickAccessContainer: {
        padding: spacing.lg,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    cardGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: spacing.md,
        marginBottom: spacing.md,
        alignItems: 'center',
        ...shadows.medium,
    },
    cardIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    cardTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semiBold,
        color: colors.text,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    cardSubtitle: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    systemInfo: {
        padding: spacing.lg,
        backgroundColor: colors.surface,
        margin: spacing.lg,
        borderRadius: 12,
        ...shadows.small,
    },
    systemText: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        lineHeight: typography.lineHeight.relaxed,
    },
});

export default HomeScreen;