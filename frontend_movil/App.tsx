import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppRegistry } from 'react-native';

import { AuthProvider } from './SRC/context/AuthContext';
import AppNavigator from './SRC/navigation/AppNavigator';
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

export default App;

// Registrar la aplicación
AppRegistry.registerComponent('main', () => App);