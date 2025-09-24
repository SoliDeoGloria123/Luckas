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
                    <Text style={styles.title}>Sistema Seminario</Text>
                    <Text style={styles.subtitle}>Iniciar Sesión</Text>

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
                            placeholder="ejemplo@correo.com"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
                        {errors.correo && <Text style={styles.errorText}>{errors.correo}</Text>}
                    </View>

                    {/* Campo de contraseña */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contraseña</Text>
                        <TextInput
                            style={[styles.input, errors.password ? styles.inputError : null]}
                            value={credentials.password}
                            onChangeText={(text) => {
                                setCredentials({ ...credentials, password: text });
                                if (errors.password) {
                                    setErrors({ ...errors, password: undefined });
                                }
                            }}
                            placeholder="Ingresa tu contraseña"
                            secureTextEntry
                            autoCapitalize="none"
                            autoCorrect={false}
                            editable={!isLoading}
                        />
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
    container: {
        flex: 1,
        backgroundColor: '#f8fafc', // Color más claro y moderno
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#198754', // Color principal del seminario
        textAlign: 'center',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        color: '#6c757d', // Color secundario más suave
        textAlign: 'center',
        marginBottom: 30,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e9ecef', // Color del borde más suave
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#dc3545',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 14,
        marginTop: 5,
    },
    loginButton: {
        backgroundColor: '#198754', // Color principal del seminario
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
        minHeight: 52, // Altura mínima para mantener consistencia con el loader
    },
    buttonDisabled: {
        backgroundColor: '#6c757d',
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
        color: '#198754', // Color principal del seminario
        opacity: 1,
        fontSize: 16
    },
    textDisabled: {
        opacity: 0.6
    }
});

export default LoginScreen;