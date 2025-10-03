import * as Font from 'expo-font';
import { 
  MaterialIcons, 
  Ionicons, 
  FontAwesome, 
  AntDesign, 
  Entypo,
  Feather,
  MaterialCommunityIcons 
} from '@expo/vector-icons';

// Función para cargar las fuentes de íconos
export const loadFonts = async () => {
  try {
    await Font.loadAsync({
      ...MaterialIcons.font,
      ...Ionicons.font,
      ...FontAwesome.font,
      ...AntDesign.font,
      ...Entypo.font,
      ...Feather.font,
      ...MaterialCommunityIcons.font,
    });
    console.log('✅ Fuentes de íconos cargadas correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error cargando fuentes de íconos:', error);
    return false;
  }
};

export default {
  loadFonts
};