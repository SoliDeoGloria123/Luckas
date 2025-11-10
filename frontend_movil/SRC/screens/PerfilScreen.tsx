
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../styles/colors';
import { usePerfilForm } from '../hooks/usePerfilForms';

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
    // Opciones para el select de tipo de documento
    const tipoDocumentoOpciones = [
        'Cédula de Ciudadanía',
        'Cédula de Extranjería',
        'Pasaporte',
        'Tarjeta de Identidad',
        'Otro'
    ];

    return (
        <ScrollView style={styles.container}>
            <View>
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
                        <Text style={styles.label}>Correo *</Text>
                        <TextInput
                            style={[styles.input, styles.inputReadonly]}
                            value={perfilData.correo}
                            editable={false}
                            placeholder="Tu correo"
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Teléfono *</Text>
                        <TextInput
                            style={styles.input}
                            value={perfilData.telefono}
                            onChangeText={(text) => setPerfilData({ ...perfilData, telefono: text })}
                            placeholder="Tu teléfono"
                            keyboardType="phone-pad"
                        />
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Tipo de Documento *</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={perfilData.tipoDocumento}
                                onValueChange={(itemValue) => setPerfilData({ ...perfilData, tipoDocumento: itemValue })}
                                style={styles.picker}
                            >
                                {tipoDocumentoOpciones.map((opcion) => (
                                    <Picker.Item key={opcion} label={opcion} value={opcion} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Número de Documento *</Text>
                        <TextInput
                            style={styles.input}
                            value={perfilData.numeroDocumento}
                            onChangeText={(text) => setPerfilData({ ...perfilData, numeroDocumento: text })}
                            placeholder="Número de documento"
                            keyboardType="default"
                        />
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
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    pickerContainer: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        marginTop: 2,
        marginBottom: 2,
        overflow: 'hidden',
    },
    picker: {
        color: '#334155',
        fontSize: 15,
        height: 44,
        width: '100%',
        backgroundColor: 'transparent',
    },
    inputReadonly: {
        backgroundColor: '#e2e8f0',
        color: '#334155',
    },
    container: {
        flex: 1,
        backgroundColor: '#f1f5f9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
    },
    header: {
        paddingTop: 35,
        paddingBottom: 24,
        paddingHorizontal: 20,
        backgroundColor: '#2563eb',
        marginBottom: 20,
        elevation: 4,
        shadowColor: '#1d4ed8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#f1f5f9',
        opacity: 0.9,
    },
    formContainer: {
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 18,
        marginHorizontal: 16,
        elevation: 2,
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    inputContainer: {
        marginBottom: 18,
    },
    label: {
        fontSize: 15,
        marginBottom: 6,
        color: '#334155',
        fontWeight: 'bold',
    },
    input: {
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: '#334155',
        elevation: 1,
    },
    infoText: {
        fontSize: 15,
        color: '#334155',
        backgroundColor: '#f1f5f9',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: 10,
        padding: 12,
        fontSize: 15,
        color: '#334155',
    },
    submitButton: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 28,
        elevation: 2,
        shadowColor: '#334155',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 3,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
});