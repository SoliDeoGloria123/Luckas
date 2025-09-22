import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles/colors';

interface TareasHeaderProps {
    onFilterPress: () => void;
    cantidadTareas: number;
}

export const TareasHeader: React.FC<TareasHeaderProps> = ({
    onFilterPress,
    cantidadTareas
}) => {
    return (
        <View style={styles.header}>
            <View style={styles.titleContainer}>
                <Icon name="list" size={24} color={colors.primary} />
                <Text style={styles.title}>Mis Tareas</Text>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cantidadTareas}</Text>
                </View>
            </View>
            <Icon
                name="filter"
                size={24}
                color={colors.primary}
                onPress={onFilterPress}
                style={styles.filterIcon}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text.primary,
        marginLeft: 8,
    },
    badge: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginLeft: 8,
    },
    badgeText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: 'bold',
    },
    filterIcon: {
        padding: 8,
    },
});