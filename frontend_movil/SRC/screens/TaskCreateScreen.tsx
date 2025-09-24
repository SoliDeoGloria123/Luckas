import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { tareasService } from '../services';
import { TareaForm } from '../services/tareas';
import { Picker } from '@react-native-picker/picker';

const TaskCreateScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TareaForm>({
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    prioridad: 'Media',
    asignadoA: '',
    categoria: '',
    etiquetas: [],
    observaciones: '',
  });

  const handleCreate = async () => {
    if (!formData.titulo || !formData.descripcion || !formData.fechaLimite || !formData.asignadoA) {
      Alert.alert('Error', 'Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setLoading(true);
      const response = await tareasService.createTarea(formData);
      if (response.success) {
        Alert.alert('Éxito', 'Tarea creada correctamente', [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Error al crear la tarea');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TareaForm, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nueva Tarea</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Título *</Text>
          <TextInput
            style={styles.input}
            value={formData.titulo}
            onChangeText={(value) => handleInputChange('titulo', value)}
            placeholder="Ingresa el título de la tarea"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descripción *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.descripcion}
            onChangeText={(value) => handleInputChange('descripcion', value)}
            placeholder="Ingresa la descripción de la tarea"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Fecha Límite *</Text>
          <TextInput
            style={styles.input}
            value={formData.fechaLimite}
            onChangeText={(value) => handleInputChange('fechaLimite', value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Prioridad *</Text>
          <Picker
            selectedValue={formData.prioridad}
            onValueChange={(value) => handleInputChange('prioridad', value)}
            style={styles.picker}
          >
            <Picker.Item label="Alta" value="Alta" />
            <Picker.Item label="Media" value="Media" />
            <Picker.Item label="Baja" value="Baja" />
          </Picker>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Asignado A *</Text>
          <TextInput
            style={styles.input}
            value={formData.asignadoA}
            onChangeText={(value) => handleInputChange('asignadoA', value)}
            placeholder="ID del usuario asignado"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Categoría</Text>
          <TextInput
            style={styles.input}
            value={formData.categoria}
            onChangeText={(value) => handleInputChange('categoria', value)}
            placeholder="Categoría de la tarea"
          />
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Observaciones</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.observaciones}
            onChangeText={(value) => handleInputChange('observaciones', value)}
            placeholder="Observaciones adicionales"
            multiline
            numberOfLines={4}
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleCreate}
          >
            <Text style={styles.buttonText}>Crear Tarea</Text>
          </TouchableOpacity>
        </View>
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
  },
  header: {
    padding: 16,
    backgroundColor: '#0066CC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#999999',
  },
  saveButton: {
    backgroundColor: '#0066CC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TaskCreateScreen;