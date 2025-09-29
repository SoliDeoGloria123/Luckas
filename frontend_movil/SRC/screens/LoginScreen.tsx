// Componente de Login usando el AuthContext

import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import type { LoginCredentials } from '../types';

const LoginScreen: React.FC = () => {
    const { login } = useAuth();
    const [credentials, setCredentials] = useState({
        correo: '',
        password: ''
    });
    const [errors, setErrors] = useState<{ correo?: string; password?: string }>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Validar campos
    const validateFields = (): boolean => {
        const newErrors: { correo?: string; password?: string } = {};

        if (!credentials.correo.trim()) {
            newErrors.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(credentials.correo)) {
            newErrors.correo = 'El correo no es válido';
        }

        if (!credentials.password.trim()) {
            newErrors.password = 'La contraseña es requerida';
        } else if (credentials.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar login
    const handleLogin = async () => {
        if (!validateFields()) return;

        setIsLoading(true);
        try {
            console.log('Intentando login con credenciales:', { correo: credentials.correo });
            const success = await login(credentials.correo, credentials.password);
            
            if (success) {
                console.log('Login exitoso, esperando redirección automática...');
            } else {
                Alert.alert(
                    'Error de inicio de sesión',
                    'Credenciales incorrectas. Por favor verifica tus datos.'
                );
            }
        } catch (error: any) {
            console.error('Login error:', error);
            Alert.alert(
                'Error de conexión',
                'No se pudo conectar con el servidor. Por favor verifica tu conexión a internet.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    {/* Logo y título principal */}
                    <View style={styles.logoContainer}>
                        <Ionicons name="book-outline" size={48} color="#fff" style={styles.logoIcon} />
                    </View>
                    <Text style={styles.luckasTitle}>LUCKAS</Text>
                    <Text style={styles.subtitleWeb}>Sistema de Gestión Integral</Text>
                    <Text style={styles.descriptionWeb}>
                        Plataforma digital para la administración eficiente de las actividades del Seminario Bautista de Colombia
                    </Text>

                    {/* Campo de correo */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Correo Electrónico</Text>
                        <TextInput
                            style={[styles.input, errors.correo ? styles.inputError : null]}
                            value={credentials.correo}
                            onChangeText={(text) => {
                                setCredentials({ ...credentials, correo: text.toLowerCase().trim() });
                                if (errors.correo) {
                                    setErrors({ ...errors, correo: undefined });
                                }
                            }}
                            placeholder="Ingrese su Correo electronico"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                        {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
                    </View>

                    {/* Campo de contraseña con ojito dentro del input */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, errors.password ? styles.inputError : null, styles.inputWithIcon]}
                                value={credentials.password}
                                onChangeText={(text) => {
                                    setCredentials({ ...credentials, password: text });
                                    if (errors.password) {
                                        setErrors({ ...errors, password: undefined });
                                    }
                                }}
                                placeholder="Ingresa tu contraseña"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoCorrect={false}
                                editable={!isLoading}
                            />
                            <TouchableOpacity
                                style={styles.eyeIconInside}
                                onPress={() => setShowPassword((prev) => !prev)}
                                disabled={isLoading}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                                    size={22}
                                    color="#2563eb"
                                />
                            </TouchableOpacity>
                        </View>
                        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                    </View>

                    {/* Botón de login */}
                    <TouchableOpacity
                        style={[styles.loginButton, isLoading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>
                                Iniciar Sesión
                            </Text>
                        )}
                    </TouchableOpacity>

                    {/* Link para registro (si lo necesitas) */}
                    <TouchableOpacity style={styles.registerLink} disabled={isLoading}>
                        <Text style={[styles.registerLinkText, isLoading && styles.textDisabled]}>
                            ¿No tienes cuenta? Contacta al administrador
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563eb',
        borderRadius: 32,
        width: 64,
        height: 64,
        alignSelf: 'center',
        marginBottom: 12,
    },
    logoIcon: {
        marginTop: 8,
    },
    luckasTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2563eb',
        textAlign: 'center',
        marginBottom: 4,
        letterSpacing: 2,
    },
    subtitleWeb: {
        fontSize: 18,
        color: '#334155',
        textAlign: 'center',
        marginBottom: 4,
        fontWeight: '600',
    },
    descriptionWeb: {
        fontSize: 14,
        color: '#334155',
        textAlign: 'center',
        marginBottom: 24,
        opacity: 0.8,
    },
    inputWrapper: {
        position: 'relative',
        justifyContent: 'center',
    },
    inputWithIcon: {
        paddingRight: 40, // Espacio para el ícono
    },
    eyeIconInside: {
        position: 'absolute',
        right: 10,
        top: 12,
        padding: 4,
        zIndex: 2,
    },
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9', // Gris claro de la nueva paleta
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    formContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8, // Para Android
        marginHorizontal: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2563eb', // Azul principal de la nueva paleta
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#334155', // Gris oscuro de la nueva paleta
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155', // Gris oscuro de la nueva paleta
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#d1d5db', // Color del borde más neutro
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9fafb', // Fondo más claro como el web
        color: '#374151', // Color de texto más oscuro
    },
    inputError: {
        borderColor: '#dc3545',
        backgroundColor: '#fef2f2', // Fondo ligeramente rojizo para errores
    },
    errorText: {
        color: '#dc3545',
        fontSize: 14,
        marginTop: 5,
    },
    loginButton: {
        backgroundColor: '#2563eb', // Azul principal de la nueva paleta
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        minHeight: 52, // Altura mínima para mantener consistencia con el loader
        shadowColor: '#2563eb', // Sombra del mismo color del botón
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // Para Android
    },
    buttonDisabled: {
        backgroundColor: '#334155', // Gris oscuro de la nueva paleta
        opacity: 0.6,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    registerLink: {
        marginTop: 20,
        alignItems: 'center'
    },
    registerLinkText: {
        color: '#2563eb', // Azul principal de la nueva paleta
        opacity: 1,
        fontSize: 16
    },
    textDisabled: {
        opacity: 0.6
    }
});

export default LoginScreen;