// Estilos inspirados en DashboardSeminarista.css y componentes Seminarista
// Adaptados para React Native

import { StyleSheet } from 'react-native';

const colors = {
  primary: '#198754', // Verde Seminarista
  secondary: '#f5f5f5',
  accent: '#0d6efd', // Azul
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  background: '#f8fafc',
  card: '#fff',
  text: '#333',
  muted: '#6c757d',
};

export const seminaristaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: colors.text,
  },
  cardText: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 2,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.accent,
    marginVertical: 10,
  },
  list: {
    marginBottom: 10,
  },
  loading: {
    textAlign: 'center',
    fontSize: 16,
    color: colors.muted,
    marginVertical: 10,
  },
  error: {
    color: colors.danger,
    textAlign: 'center',
    marginVertical: 8,
  },
  success: {
    color: colors.primary,
    textAlign: 'center',
    marginVertical: 8,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  badgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 15,
    color: colors.muted,
    marginRight: 8,
  },
  value: {
    fontSize: 15,
    color: colors.text,
  },
});
