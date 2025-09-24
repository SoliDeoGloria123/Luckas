import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { Tarea } from '../services/tareas';
import { tareasService } from '../services';
import { colors } from '../styles';

const TaskListScreen = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { user, hasRole } = useAuth();

  console.log('🔄 TaskListScreen - Usuario actual:', user);

  const loadTareas = async () => {
    try {
      console.log('🔄 Iniciando carga de tareas...');
      setLoading(true);
      
      // Si el usuario es seminarista, cargar solo sus tareas
      let response;
      if (user && hasRole('seminarista')) {
        console.log('📱 Cargando tareas para seminarista:', user._id);
        response = await tareasService.getTareasByUsuario(user._id);
      } else {
        console.log('📱 Cargando todas las tareas');
        response = await tareasService.getAllTareas();
      }

      console.log('📥 Respuesta del servidor:', response);
      
      if (response.success && response.data) {
        console.log(`✅ Tareas cargadas: ${response.data.length} tareas`);
        setTareas(response.data);
      } else {
        console.error('❌ Error al cargar tareas:', response.message);
        Alert.alert('Error', response.message || 'Error al cargar las tareas');
      }
    } catch (error) {
      console.error('❌ Error de conexión:', error);
      Alert.alert('Error', 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadTareas();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadTareas();
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(
      'Confirmar eliminación',
      '¿Estás seguro de que quieres eliminar esta tarea?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await tareasService.deleteTarea(taskId);
              if (response.success) {
                loadTareas();
              } else {
                Alert.alert('Error', response.message || 'Error al eliminar la tarea');
              }
            } catch (error) {
              Alert.alert('Error', 'Error al conectar con el servidor');
            }
          },
        },
      ]
    );
  };

  const getPrioridadColor = (prioridad: string) => {
    switch (prioridad.toLowerCase()) {
      case 'alta':
        return '#FF4444';
      case 'media':
        return '#FFBB33';
      case 'baja':
        return '#00C851';
      default:
        return '#757575';
    }
  };

  const renderTarea = ({ item }: { item: Tarea }) => (
    <TouchableOpacity
      style={styles.tareaCard}
      onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
    >
      <View style={styles.tareaHeader}>
        <Text style={styles.tareaTitulo}>{item.titulo}</Text>
        <View style={[styles.prioridadBadge, { backgroundColor: getPrioridadColor(item.prioridad) }]}>
          <Text style={styles.prioridadTexto}>{item.prioridad}</Text>
        </View>
      </View>
      <Text style={styles.tareaDescripcion} numberOfLines={2}>
        {item.descripcion}
      </Text>
      <View style={styles.tareaFooter}>
        <Text style={styles.tareaFecha}>
          Límite: {new Date(item.fechaLimite).toLocaleDateString()}
        </Text>
        <Text style={styles.tareaEstado}>{item.estado}</Text>
      </View>
      {hasRole('admin') && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item._id)}
        >
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tareas</Text>
        {hasRole('admin') && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('TaskCreate')}
          >
            <Text style={styles.addButtonText}>+ Nueva Tarea</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando tareas...</Text>
        </View>
      ) : tareas.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay tareas disponibles</Text>
        </View>
      ) : (
        <FlatList
          data={tareas}
          renderItem={renderTarea}
          keyExtractor={(item) => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: colors.success,
    padding: 10,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  tareaCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tareaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tareaTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  prioridadBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  prioridadTexto: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  tareaDescripcion: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  tareaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tareaFecha: {
    fontSize: 12,
    color: '#999999',
  },
  tareaEstado: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deleteButton: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: '#FF4444',
    padding: 6,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
});

export default TaskListScreen;