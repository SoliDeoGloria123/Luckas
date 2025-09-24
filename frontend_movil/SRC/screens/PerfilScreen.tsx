import React, { useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';
import { usePerfilForm } from '../hooks/usePerfilForm';

export const PerfilScreen = () => {
    const { user } = useAuth();
    const navigation = useNavigation();

    const {
        loading,
        perfilData,
        setPerfilData,
        handleUpdatePerfil
    } = usePerfilForm(user, () => {
        // Recargar la pantalla o navegar de vuelta
        navigation.goBack();
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mi Perfil</Text>
                <Text style={styles.headerSubtitle}>
                    Actualiza tu información personal
                </Text>
            </View>

            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre *</Text>
                    <TextInput
                        style={styles.input}
                        value={perfilData.nombre}
                        onChangeText={(text) => setPerfilData({ ...perfilData, nombre: text })}
                        placeholder="Tu nombre"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Apellido *</Text>
                    <TextInput
                        style={styles.input}
                        value={perfilData.apellido}
                        onChangeText={(text) => setPerfilData({ ...perfilData, apellido: text })}
                        placeholder="Tu apellido"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nombre de Usuario</Text>
                    <Text style={styles.infoText}>{user?.username}</Text>
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Rol</Text>
                    <Text style={styles.infoText}>{user?.role}</Text>
                </View>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleUpdatePerfil}
                    disabled={loading}
                >
                    <Text style={styles.submitButtonText}>
                        {loading ? 'Actualizando...' : 'Actualizar Perfil'}
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
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
    header: {
        padding: 20,
        backgroundColor: colors.primary,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    formContainer: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333333',
    },
    input: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    infoText: {
        fontSize: 16,
        color: '#666666',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: colors.primary,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 32,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});