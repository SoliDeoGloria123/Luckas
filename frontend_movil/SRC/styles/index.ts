// Estilos y constantes de diseño para la aplicación

export const colors = {
    // Colores principales
    primary: '#007bff',
    primaryDark: '#0056b3',
    primaryLight: '#66b3ff',
    
    // Colores secundarios
    secondary: '#6c757d',
    secondaryDark: '#495057',
    secondaryLight: '#adb5bd',
    
    // Colores de estado
    success: '#28a745',
    successDark: '#1e7e34',
    successLight: '#71dd8a',
    
    danger: '#dc3545',
    dangerDark: '#bd2130',
    dangerLight: '#f1b0b7',
    
    warning: '#ffc107',
    warningDark: '#d39e00',
    warningLight: '#fff3cd',
    
    info: '#17a2b8',
    infoDark: '#117a8b',
    infoLight: '#bee5eb',
    
    // Colores de fondo y superficie
    background: '#f8f9fa',
    surface: '#ffffff',
    surfaceVariant: '#f1f3f4',
    
    // Colores de texto
    text: '#212529',
    textSecondary: '#6c757d',
    textDisabled: '#adb5bd',
    textOnPrimary: '#ffffff',
    textOnDark: '#ffffff',
    
    // Colores de borde y división
    border: '#dee2e6',
    borderLight: '#e9ecef',
    divider: '#e0e0e0',
    
    // Colores específicos del seminario
    seminary: {
        gold: '#ffd700',
        darkBlue: '#1e3a8a',
        lightBlue: '#3b82f6',
        cream: '#fdf6e3',
        brown: '#8b4513'
    }
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50
};

export const typography = {
    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32
    },
    fontWeight: {
        light: '300' as const,
        normal: '400' as const,
        medium: '500' as const,
        semiBold: '600' as const,
        bold: '700' as const,
        extraBold: '800' as const
    },
    lineHeight: {
        tight: 1.2,
        normal: 1.4,
        relaxed: 1.6,
        loose: 1.8
    }
};

export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2
    },
    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4
    },
    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 8
    }
};

export const layout = {
    container: {
        flex: 1,
        backgroundColor: colors.background,
        padding: spacing.md
    },
    center: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const
    },
    row: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const
    },
    column: {
        flexDirection: 'column' as const
    }
};

// Constantes de la aplicación
export const APP_CONSTANTS = {
    HEADER_HEIGHT: 60,
    TAB_BAR_HEIGHT: 60,
    SCREEN_PADDING: spacing.md,
    BUTTON_HEIGHT: 48,
    INPUT_HEIGHT: 48
};

export default {
    colors,
    spacing,
    borderRadius,
    typography,
    shadows,
    layout,
    APP_CONSTANTS
};