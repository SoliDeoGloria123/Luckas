// Archivo principal de la aplicación móvil del seminario

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Context providers
import { AuthProvider } from './SRC/contexts/AuthContext';

// Navegación principal
import AppNavigator from './SRC/navigation/AppNavigator';

// Estilos
import { colors } from './SRC/styles';

const App: React.FC = () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <AuthProvider>
                    <StatusBar 
                        style="auto" 
                        backgroundColor={colors.primary} 
                    />
                    <AppNavigator />
                    <Toast />
                </AuthProvider>
            </NavigationContainer>
        </SafeAreaProvider>
    );
};

import { AppRegistry } from 'react-native';

export default App;

AppRegistry.registerComponent('main', () => App);