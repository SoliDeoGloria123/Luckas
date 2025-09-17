import React from 'react';
import { Ionicons } from '@expo/vector-icons';
//importar de react-navigation
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, MainTabParamList } from '../types/navigation';
import { colors, spacing, typography } from '../styles';

//importar pantallas
import LoginScreen from '../screens/LoginScreen';
import LoadingScreen from '../screens/LoadingScreen';
import HomeScreen from '../screens/HomeScreen';
import CursosScreen from '../screens/CursosScreen';
import EventosScreen from '../screens/EventosScreen';
import CabanasScreen from '../screens/CabanasScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Pantallas temporales para desarrollo
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

// Componente temporal para pantallas en desarrollo
const TemporaryScreen = ({ title }: { title: string }) => (
    <View style={tempStyles.container}>
        <Ionicons name="construct-outline" size={64} color={colors.textSecondary} />
        <Text style={tempStyles.title}>{title}</Text>
        <Text style={tempStyles.subtitle}>En desarrollo</Text>
        <TouchableOpacity 
            style={tempStyles.button}
            onPress={() => Alert.alert('Info', `Pantalla de ${title} en construcción`)}
        >
            <Text style={tempStyles.buttonText}>Próximamente</Text>
        </TouchableOpacity>
    </View>
);

const tempStyles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        color: colors.text,
        marginTop: spacing.md,
        marginBottom: spacing.sm,
    },
    subtitle: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    button: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderRadius: 8,
    },
    buttonText: {
        color: colors.textOnPrimary,
        fontWeight: typography.fontWeight.medium,
    },
});

// Ya no necesitamos pantallas temporales, todas están implementadas

//Creacion de navegadores
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

//Navegador principal con tabs
const MainTabNavigator: React.FC = () => {
    const { isAdmin, isTesorero } = useAuth();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: spacing.sm,
                    paddingTop: spacing.sm,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: typography.fontWeight.medium,
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
                            name={focused ? 'home' : 'home-outline'}
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

//Navigator principal de la aplicación
function AppNavigator() {
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
                <Stack.Screen 
                    name="Main" 
                    component={MainTabNavigator} 
                    options={{ animationTypeForReplace: 'push' }} 
                />
            ) : (
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options={{ animationTypeForReplace: 'pop' }} 
                />
            )}
        </Stack.Navigator> 
    );
}

export default AppNavigator;