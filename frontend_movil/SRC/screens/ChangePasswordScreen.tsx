import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../styles/colors';
import { Ionicons } from '@expo/vector-icons';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      // Aquí deberías llamar a tu servicio para cambiar la contraseña
      // await userService.changePassword(currentPassword, newPassword);
      setTimeout(() => {
        setLoading(false);
        Alert.alert('Éxito', 'Contraseña cambiada correctamente');
        navigation.goBack();
      }, 1200);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'No se pudo cambiar la contraseña');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cambiar Contraseña</Text>
        <Text style={styles.headerSubtitle}>Actualiza tu contraseña de acceso</Text>
      </View>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Contraseña actual *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="Contraseña actual"
              secureTextEntry={!showCurrent}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIconInside}
              onPress={() => setShowCurrent((v) => !v)}
              disabled={loading}
            >
              <Ionicons
                name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#2563eb"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nueva contraseña *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Nueva contraseña"
              secureTextEntry={!showNew}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIconInside}
              onPress={() => setShowNew((v) => !v)}
              disabled={loading}
            >
              <Ionicons
                name={showNew ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#2563eb"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar nueva contraseña *</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, styles.inputWithIcon]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirmar nueva contraseña"
              secureTextEntry={!showConfirm}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity
              style={styles.eyeIconInside}
              onPress={() => setShowConfirm((v) => !v)}
              disabled={loading}
            >
              <Ionicons
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#2563eb"
              />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Guardar Contraseña</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  inputWrapper: {
  position: 'relative',
  justifyContent: 'center',
},
inputWithIcon: {
  paddingRight: 40,
},
eyeIconInside: {
  position: 'absolute',
  right: 10,
  top: 12,
  padding: 4,
  zIndex: 2,
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

export default ChangePasswordScreen;
