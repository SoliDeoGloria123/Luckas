// Pantalla de carga mientras se verifica la autenticación

import React from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet
} from 'react-native';
import { colors, spacing, typography } from '../styles';

const LoadingScreen: React.FC = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator 
                size="large" 
                color={colors.primary} 
                style={styles.spinner}
            />
            <Text style={styles.text}>Cargando...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.background,
        padding: spacing.lg,
    },
    spinner: {
        marginBottom: spacing.md,
    },
    text: {
        fontSize: typography.fontSize.md,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
});

export default LoadingScreen;