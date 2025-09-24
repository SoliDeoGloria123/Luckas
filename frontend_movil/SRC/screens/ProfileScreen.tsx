// Pantalla de perfil de usuario

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
import { useAuth } from '../context/AuthContext';
import { colors, spacing, typography, shadows } from '../styles';

const ProfileScreen: React.FC = () => {
    const { user, logout } = useAuth();

    const handleEditProfile = () => {
        Alert.alert('Información', 'Función de editar perfil en desarrollo');
    };

    const handleChangePassword = () => {
        Alert.alert('Información', 'Función de cambiar contraseña en desarrollo');
    };

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

    const getStatusDisplayName = (estado: string) => {
        return estado === 'activo' ? 'Activo' : 'Inactivo';
    };

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>

            {/* Información del usuario */}
            <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={50} color={colors.textOnPrimary} />
                    </View>
                </View>
                
                <Text style={styles.userName}>
                    {user?.nombre} {user?.apellido}
                </Text>
                <Text style={styles.userRole}>
                    {getRoleDisplayName(user?.role || '')}
                </Text>
                <Text style={[styles.userStatus, 
                    user?.estado === 'activo' ? styles.statusActive : styles.statusInactive
                ]}>
                    {getStatusDisplayName(user?.estado || 'inactivo')}
                </Text>
            </View>

            {/* Información detallada */}
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Información Personal</Text>
                
                <View style={styles.infoItem}>
                    <Ionicons name="mail-outline" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Correo Electrónico</Text>
                        <Text style={styles.infoValue}>{user?.correo}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="call-outline" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Teléfono</Text>
                        <Text style={styles.infoValue}>{user?.telefono}</Text>
                    </View>
                </View>

                <View style={styles.infoItem}>
                    <Ionicons name="card-outline" size={20} color={colors.primary} />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Documento</Text>
                        <Text style={styles.infoValue}>
                            {user?.tipoDocumento}: {user?.numeroDocumento}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Opciones del perfil */}
            <View style={styles.optionsSection}>
                <Text style={styles.sectionTitle}>Opciones</Text>
                
                <TouchableOpacity style={styles.optionItem} onPress={handleEditProfile}>
                    <Ionicons name="pencil-outline" size={20} color={colors.primary} />
                    <Text style={styles.optionText}>Editar Perfil</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionItem} onPress={handleChangePassword}>
                    <Ionicons name="lock-closed-outline" size={20} color={colors.primary} />
                    <Text style={styles.optionText}>Cambiar Contraseña</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.optionItem, styles.logoutOption]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                    <Text style={[styles.optionText, styles.logoutText]}>Cerrar Sesión</Text>
                    <Ionicons name="chevron-forward-outline" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
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
        backgroundColor: colors.surface,
        padding: spacing.lg,
        ...shadows.small,
    },
    headerTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        textAlign: 'center',
    },
    profileSection: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.sm,
        ...shadows.small,
    },
    avatarContainer: {
        marginBottom: spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.xs,
    },
    userRole: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    userStatus: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: 12,
    },
    statusActive: {
        backgroundColor: colors.success + '20',
        color: colors.success,
    },
    statusInactive: {
        backgroundColor: colors.danger + '20',
        color: colors.danger,
    },
    infoSection: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        marginTop: spacing.sm,
        ...shadows.small,
    },
    sectionTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginBottom: spacing.md,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    infoContent: {
        marginLeft: spacing.md,
        flex: 1,
    },
    infoLabel: {
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.xs,
    },
    infoValue: {
        fontSize: typography.fontSize.md,
        color: colors.text,
        fontWeight: typography.fontWeight.medium,
    },
    optionsSection: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        marginTop: spacing.sm,
        marginBottom: spacing.lg,
        ...shadows.small,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.borderLight,
    },
    optionText: {
        flex: 1,
        fontSize: typography.fontSize.md,
        color: colors.text,
        marginLeft: spacing.md,
    },
    logoutOption: {
        borderBottomWidth: 0,
    },
    logoutText: {
        color: colors.danger,
    },
});

export default ProfileScreen;