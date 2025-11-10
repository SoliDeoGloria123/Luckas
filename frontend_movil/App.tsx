import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { AppRegistry } from 'react-native';
import AppLoading from 'expo-app-loading';

import { AuthProvider } from './SRC/context/AuthContext';
import AppNavigator from './SRC/navigation/AppNavigator';
import { colors } from './SRC/styles';
import { loadFonts } from './SRC/utils/FontLoader';

const App: React.FC = () => {
    const [fontsLoaded, setFontsLoaded] = useState(false);

    const handleLoadFonts = async () => {
        try {
            await loadFonts();
            setFontsLoaded(true);
        } catch (error) {
            console.error('Error loading fonts:', error);
            setFontsLoaded(true); // Continue anyway
        }
    };

    if (!fontsLoaded) {
        return (
            <AppLoading
                startAsync={handleLoadFonts}
                onFinish={() => setFontsLoaded(true)}
                onError={(error) => {
                    console.error('App loading error:', error);
                    setFontsLoaded(true);
                }}
            />
        );
    }

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