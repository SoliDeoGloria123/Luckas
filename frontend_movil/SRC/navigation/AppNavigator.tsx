import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../context/AuthContext';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { seminaristaStyles } from '../styles/SeminaristaMovil';

// Constantes de estilo
const NAVIGATION_COLORS = {
    active: '#198754',
    inactive: '#6c757d',
    background: '#ffffff',
    border: '#e9ecef'
};

// Importar pantallas
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import CursosScreen from '../screens/CursosScreen';
import EventosScreen from '../screens/EventosScreen';
import CabanasScreen from '../screens/CabanasScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { TareasScreen } from '../screens/TareasScreen';
import ChangePasswordScreen  from '../screens/ChangePasswordScreen';

// Ya no necesitamos pantallas temporales, todas están implementadas

//Creacion de navegadores
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Navegador principal con tabs
const MainTabNavigator: React.FC = () => {
    const { isAdmin, isTesorero } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: NAVIGATION_COLORS.active,
                tabBarInactiveTintColor: NAVIGATION_COLORS.inactive,
                tabBarStyle: {
                    backgroundColor: NAVIGATION_COLORS.background,
                    borderTopColor: NAVIGATION_COLORS.border,
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                },
            }}
        >
            {/* Tab de inicio - dashboard principal */}
            <Tab.Screen 
                name="Home" 
                component={HomeScreen} 
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ focused, color, size }: any) => (
                        <Ionicons
                            name={focused ? 'home' : 'home-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }} 
            />

            {/* Tab de cursos - disponible para todos */}
            <Tab.Screen 
                name="Cursos" 
                component={CursosScreen} 
                options={{
                    tabBarIcon: ({ focused, color, size }: any) => (
                        <Ionicons
                            name={focused ? 'school' : 'school-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }} 
            />

            {/* Tab de eventos - disponible para todos */}
            <Tab.Screen 
                name="Eventos" 
                component={EventosScreen} 
                options={{
                    tabBarIcon: ({ focused, color, size }: any) => (
                        <Ionicons
                            name={focused ? 'calendar' : 'calendar-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }} 
            />

            {/* Tab de cabañas - disponible para todos */}
            <Tab.Screen 
                name="Cabanas" 
                component={CabanasScreen} 
                options={{
                    tabBarLabel: 'Cabañas',
                    tabBarIcon: ({ focused, color, size }: any) => (
                        <Ionicons
                            name={focused ? 'bed' : 'bed-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }} 
            />

            {/* Tab de tareas */}
            <Tab.Screen 
                name="Tasks" 
                component={TareasScreen} 
                options={{
                    tabBarLabel: 'Tareas',
                    tabBarIcon: ({ focused, color, size }: any) => (
                        <Ionicons
                            name={focused ? 'checkbox' : 'checkbox-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }} 
            />

            {/* Tab de perfil - disponible para todos */}
            <Tab.Screen 
                name="Profile" 
                component={ProfileScreen} 
                options={{
                    tabBarLabel: 'Perfil',
                    tabBarIcon: ({ focused, color, size }: any) => (
                        <Ionicons
                            name={focused ? 'person' : 'person-outline'}
                            size={size}
                            color={color}
                        />
                    ),
                }} 
            />
        </Tab.Navigator>
    );
};

// Navegador principal de la aplicación
const AppNavigator: React.FC = () => {
    const { isAuthenticated, isLoading } = useAuth();
    
    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <Stack.Navigator 
            screenOptions={{ 
                headerShown: false,
                animation: 'slide_from_right'
            }}
        >
            {isAuthenticated ? (
                <>
                    <Stack.Screen 
                        name="Main" 
                        component={MainTabNavigator} 
                        options={{ 
                            animationTypeForReplace: 'push'
                        }} 
                    />
                    <Stack.Screen 
                        name="EditProfile" 
                        component={PerfilScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Editar Perfil',
                            animation: 'slide_from_right'
                        }}
                    />
                    <Stack.Screen 
                        name="ChangePassword" 
                        component={ChangePasswordScreen}
                        options={{
                            headerShown: true,
                            headerTitle: 'Cambiar Contraseña',
                            animation: 'slide_from_right'
                        }}
                    />
                </>
            ) : (
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ 
                        animationTypeForReplace: 'pop'
                    }}
                />
            )}
        </Stack.Navigator> 
    );
};

export default AppNavigator;