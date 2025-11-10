// Estilos inspirados en DashboardSeminarista.css y componentes Seminarista
// Adaptados para React Native

import { StyleSheet } from 'react-native';


const colors = {
  // Nueva paleta de colores actualizada
  primary: '#2563eb', // Azul principal
  primaryDark: '#1d4ed8', // Azul oscuro
  purple: '#8b5cf6', // Púrpura
  green: '#059669', // Verde
  grayDark: '#334155', // Gris oscuro
  grayLight: '#f1f5f9', // Gris claro
  white: '#ffffff',
  
  // Colores adicionales
  secondary: '#f1f5f9',
  accent: '#8b5cf6', // Púrpura como acento
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#2563eb',
  background: '#f1f5f9', // Gris claro
  card: '#ffffff',
  text: '#334155', // Gris oscuro
  muted: '#64748b', // Gris medio
};

export const seminaristaStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    //padding: 16,
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
    color: colors.primary, // Azul principal
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
    color: colors.primary, // Azul principal
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
  
  // Nuevos estilos para estadísticas
  statsContainer: {
    marginVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    width: '48%',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
  statIcon: {
    alignItems: 'center',
    marginBottom: 8,
  },
  
  // Estilos mejorados para botón de cerrar sesión
  logoutButton: {
    backgroundColor: colors.danger,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: colors.danger,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 70,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(220, 53, 69, 0.3)',
  },
  logoutButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.3,
  },
  
  // Estilos para header del usuario mejorado
userHeader: {
  backgroundColor: '#1d4ed8', // azul oscuro
  borderRadius: 16,
  padding: 24,
  marginTop: 24,
  marginBottom: 24,
  marginHorizontal: -8,
  shadowColor: '#1d4ed8',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.15,
  shadowRadius: 15,
  elevation: 10,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottomWidth: 0,
  paddingTop: 32,
  paddingHorizontal: 18,
},
userAvatar: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  shadowColor: '#1d4ed8',
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.18,
  shadowRadius: 12,
  elevation: 8,
  borderWidth: 2,
  borderColor: 'rgba(255, 255, 255, 0.3)',
},
avatarText: {
  color: '#2563eb',
  fontSize: 24,
  fontWeight: '700',
  textAlign: 'center',
},
userInfo: {
  flex: 2,
  marginLeft: 12,
},
welcomeText: {
  fontSize: 22,
  fontWeight: '800',
  color: '#fff',
  marginBottom: 6,
  letterSpacing: 0.3,
},
roleText: {
  fontSize: 14,
  color: '#fff',
  fontWeight: '600',
  backgroundColor: '#8b5cf6',
  paddingHorizontal: 10,
  paddingVertical: 3,
  borderRadius: 8,
  alignSelf: 'flex-start',
  overflow: 'hidden',
  textTransform: 'uppercase',
  letterSpacing: 0.5,
  marginBottom: 2,
},
  

  headerContainer: {
    backgroundColor: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  
  // Nuevo estilo para el header con fondo de gradiente
  headerWithGradient: {
    backgroundColor: '#2563eb',
    borderRadius: 0,
    padding: 24,
    marginTop: -16,
    marginBottom: 20,
    marginHorizontal: -16,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 30,
  },
  
  // Estilos para texto en header con fondo azul
  welcomeTextWhite: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.white,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  
  roleTextWhite: {
    fontSize: 14,
    color: colors.white,
    fontWeight: '600',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
