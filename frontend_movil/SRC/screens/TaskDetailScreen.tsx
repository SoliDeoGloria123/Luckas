import React, { useState, useEffect } from 'react';
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
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { tareasService } from '../services';
import { Tarea } from '../services/tareas';

const TaskDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { user, hasRole } = useAuth();
  const taskId = route.params?.taskId;
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [tarea, setTarea] = useState<Tarea | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaLimite: '',
    prioridad: '',
    estado: '',
  });

  useEffect(() => {
    loadTarea();
  }, [taskId]);

  const loadTarea = async () => {
    if (!taskId) return;
    
    try {
      setLoading(true);
      const response = await tareasService.getTareaById(taskId);
      if (response.success && response.data) {
        setTarea(response.data);
        setFormData({
          titulo: response.data.titulo,
          descripcion: response.data.descripcion,
          fechaLimite: response.data.fechaLimite,
          prioridad: response.data.prioridad,
          estado: response.data.estado,
        });
      } else {
        Alert.alert('Error', response.message || 'Error al cargar la tarea');
        navigation.goBack();
      }
    } catch (error) {
      Alert.alert('Error', 'Error al conectar con el servidor');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const response = await tareasService.updateTarea(taskId, {
        ...formData,
        prioridad: formData.prioridad as "Alta" | "Media" | "Baja",
      });
      if (response.success) {
        Alert.alert('Éxito', 'Tarea actualizada correctamente');
        setEditMode(false);
        loadTarea();
      } else {
        Alert.alert('Error', response.message || 'Error al actualizar la tarea');
      }
    } catch (error) {
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
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
        <Text style={styles.title}>
          {editMode ? 'Editar Tarea' : 'Detalle de Tarea'}
        </Text>
        {hasRole('admin') && !editMode && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Text style={styles.editButtonText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Título</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={formData.titulo}
              onChangeText={(value) => handleInputChange('titulo', value)}
            />
          ) : (
            <Text style={styles.value}>{tarea?.titulo}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Descripción</Text>
          {editMode ? (
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descripcion}
              onChangeText={(value) => handleInputChange('descripcion', value)}
              multiline
              numberOfLines={4}
            />
          ) : (
            <Text style={styles.value}>{tarea?.descripcion}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Fecha Límite</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={formData.fechaLimite}
              onChangeText={(value) => handleInputChange('fechaLimite', value)}
            />
          ) : (
            <Text style={styles.value}>
              {new Date(tarea?.fechaLimite || '').toLocaleDateString()}
            </Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Prioridad</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={formData.prioridad}
              onChangeText={(value) => handleInputChange('prioridad', value)}
            />
          ) : (
            <Text style={styles.value}>{tarea?.prioridad}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Estado</Text>
          {editMode ? (
            <TextInput
              style={styles.input}
              value={formData.estado}
              onChangeText={(value) => handleInputChange('estado', value)}
            />
          ) : (
            <Text style={styles.value}>{tarea?.estado}</Text>
          )}
        </View>

        {editMode && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => {
                setEditMode(false);
                loadTarea();
              }}
            >
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0066CC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
  },
  editButtonText: {
    color: '#0066CC',
    fontWeight: 'bold',
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
  value: {
    fontSize: 16,
    color: '#666666',
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

export default TaskDetailScreen;