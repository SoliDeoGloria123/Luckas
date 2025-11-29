# Frontend Móvil - Sistema Seminario

Esta es la aplicación móvil React Native/Expo para el Sistema Seminario.

## 🚀 Configuración Inicial

### 1. Instalación de dependencias
```bash
npm install
```

### 2. Configuración del Backend

Antes de ejecutar la aplicación, debes configurar la URL de tu backend en el archivo `src/config/index.ts`:

```typescript
// Para desarrollo local con emulador Android
BASE_URL: 'http://10.0.2.2:3000/api'

// Para desarrollo local con dispositivo físico
BASE_URL: 'http://TU_IP_LOCAL:3000/api'

// Para producción
BASE_URL: 'https://tu-dominio.com/api'
```

### 3. Encontrar tu IP local (para dispositivo físico)

**Windows:**
```cmd
ipconfig
```
Busca la IP en "Adaptador de red inalámbrica Wi-Fi" → "Dirección IPv4"

**macOS/Linux:**
```bash
ifconfig | grep "inet "
```

## 📱 Ejecución

### Iniciar el servidor de desarrollo
```bash
npm start
```

### Ejecutar en diferentes plataformas
```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 🏗️ Estructura del Proyecto

```
src/
├── contexts/           # Contextos de React (AuthContext)
│   └── AuthContext.tsx
├── screens/           # Pantallas de la aplicación
│   └── LoginScreen.tsx
├── services/          # Servicios para API
│   └── auth.ts
├── types/             # Tipos TypeScript
│   └── index.ts
├── config/            # Configuración de la app
│   └── index.ts
└── components/        # Componentes reutilizables
```

## 🔧 Configuración del Backend

Asegúrate de que tu backend esté corriendo en el puerto 3000 y tenga CORS configurado correctamente:

```javascript
// En tu backend/server.js
const cors = require('cors');

app.use(cors({
    origin: ['http://localhost:3000', 'http://10.0.2.2:3000'], // Agrega las IPs necesarias
    credentials: true
}));
```

## 🔐 Autenticación

La aplicación utiliza JWT para autenticación. Los tokens se almacenan de forma segura usando AsyncStorage.

### Roles soportados:
- `admin`: Acceso completo al sistema
- `tesorero`: Manejo de reportes y finanzas
- `seminarista`: Acceso a funcionalidades específicas
- `externo`: Acceso limitado

### Uso del AuthContext:

```typescript
import { useAuth } from '../contexts/AuthContext';

function MiComponente() {
    const { 
        user, 
        isAuthenticated, 
        login, 
        logout, 
        isAdmin, 
        canEdit 
    } = useAuth();

    // Usar las funciones y estados...
}
```

## 🛠️ Desarrollo

### Debugging
Para ver los logs de la aplicación:
```bash
npx react-native log-android
# o
npx react-native log-ios
```

### Variables de entorno
Crea un archivo `.env` en la raíz del proyecto para variables de entorno si es necesario.

## 📦 Build para Producción

### Android
```bash
# Generar APK
eas build --platform android

# Para Google Play Store
eas build --platform android --profile production
```

### iOS
```bash
# Para App Store
eas build --platform ios --profile production
```

## 🔧 Solución de Problemas

### Error de conexión con el backend
1. Verifica que el backend esté corriendo
2. Revisa la URL en `src/config/index.ts`
3. Para dispositivo físico, usa tu IP local en lugar de localhost

### Errores de Metro
```bash
npx react-native start --reset-cache
```

### Errores de dependencias
```bash
rm -rf node_modules
npm install
cd ios && pod install # Solo para iOS
```

## 📋 Funcionalidades Implementadas

✅ **Autenticación**
- Login con correo y contraseña
- Manejo de tokens JWT
- Verificación automática de sesión
- Logout seguro

✅ **Contexto Global**
- Estado de autenticación compartido
- Verificación de permisos por rol
- Persistencia de sesión

✅ **Navegación**
- Navigator principal con tabs
- Navegación condicional según roles
- Pantallas adaptadas por permisos
- Animaciones fluidas

✅ **Pantallas Implementadas**
- Login Screen - Autenticación
- Home Screen - Dashboard principal
- Cursos Screen - Gestión de cursos
- Profile Screen - Perfil de usuario
- Loading Screen - Pantalla de carga

✅ **Configuración**
- Configuración centralizada de API
- Manejo de diferentes entornos
- Tipos TypeScript completos
- Estilos y temas consistentes

## 🎨 Características del Diseño

- **Tabs dinámicos**: Se muestran según el rol del usuario
- **Colores del seminario**: Azules, dorados y tonos académicos
- **Iconos Ionicons**: Consistentes en toda la app
- **Responsive**: Adaptado a diferentes tamaños de pantalla
- **Accesibilidad**: Preparado para screen readers

## 🔄 Próximos Pasos

- [ ] Implementar pantallas de Eventos (calendario, detalles)
- [ ] Crear sistema de Reservas de cabañas
- [ ] Desarrollar módulo de Programas Técnicos
- [ ] Implementar generación de Reportes
- [ ] Agregar gestión de Usuarios (admin)
- [ ] Conectar con APIs reales del backend
- [ ] Implementar formularios CRUD completos
- [ ] Agregar notificaciones push
- [ ] Modo offline básico

## 🤝 Contribución

1. Asegúrate de seguir las convenciones de TypeScript
2. Todo componente debe tener tipos definidos
3. Usa el AuthContext para verificar permisos
4. Maneja los errores apropiadamente

## 📞 Soporte

Si tienes problemas con la configuración, verifica:
1. Que el backend esté corriendo correctamente
2. Que la URL de la API esté bien configurada
3. Que tengas las dependencias instaladas
4. Que tu dispositivo/emulador tenga conexión a internet