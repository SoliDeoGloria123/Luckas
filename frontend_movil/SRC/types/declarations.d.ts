// Declaraciones de tipos básicas para módulos que no tienen tipos completos

declare module '@react-navigation/native' {
    export const NavigationContainer: any;
    export const useNavigation: any;
    export const useFocusEffect: any;
    export const useRoute: any;
}

declare module '@react-navigation/native-stack' {
    export function createNativeStackNavigator<T = any>(): any;
}

declare module '@react-navigation/bottom-tabs' {
    export function createBottomTabNavigator<T = any>(): any;
}

declare module 'react-native-safe-area-context' {
    export const SafeAreaProvider: any;
    export const SafeAreaView: any;
    export const useSafeAreaInsets: any;
}

declare module 'react-native-toast-message' {
    const Toast: any;
    export default Toast;
}

declare module '@expo/vector-icons' {
    export const Ionicons: any;
    export const MaterialIcons: any;
    export const FontAwesome: any;
}