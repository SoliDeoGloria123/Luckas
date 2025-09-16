# Proyecto Luckas - Sistema de Gestión

## Descripción
Sistema de gestión con dos interfaces:
- **Interfaz Externa** (puerto 3000): Para usuarios externos y visitantes
- **Interfaz Administrativa** (puerto 3001): Para administradores, tesoreros y seminaristas

## ⚠️ SOLUCIÓN AL PROBLEMA "Cannot GET /"

El error "Cannot GET /" ocurría porque:
1. El servidor backend (puerto 3000) solo tenía rutas de API
2. No había configuración para servir contenido estático
3. Se intentaba acceder directamente al backend sin configuración de rutas públicas

### ✅ SOLUCIÓN IMPLEMENTADA:
1. **Backend actualizado** para servir contenido estático y páginas externas
2. **Rutas específicas** configuradas para usuarios externos
3. **Scripts automatizados** para iniciar ambos servidores
4. **Separación clara** de responsabilidades entre puertos

## Estructura del Proyecto
```
Luckas/
├── backend/         # Servidor API y contenido estático externo
├── frontend/        # Aplicación React para administración
├── start-servers.bat # Script para iniciar ambos servidores
├── start-servers.ps1 # Script PowerShell alternativo
├── test-routes.bat   # Script para probar todas las rutas
└── README.md        # Esta documentación
```

## Requisitos Previos
- Node.js 16+ instalado
- MongoDB ejecutándose
- Variables de entorno configuradas en backend/.env

## Configuración de Variables de Entorno
Crea un archivo `.env` en la carpeta `backend` con:
```
MONGODB_URI=mongodb://localhost:27017/luckas
JWT_SECRET=tu_clave_secreta_aqui
PORT=3000
```

## Instalación y Ejecución

### Opción 1: Script Automático (Recomendado)
```powershell
# Ejecutar desde la carpeta raíz del proyecto
.\start-servers.ps1
```

### Opción 2: Manual
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend  
cd frontend
npm install
npm run start-dev
```

## Acceso al Sistema

### Para Usuarios Externos
- URL: http://localhost:3000
- Páginas disponibles:
  - `/` o `/home` - Página de inicio
  - `/external` - Página externa
  - `/eventos` - Eventos
  - `/cursos` - Cursos
  - `/programas-academicos` - Programas académicos
  - `/inscripcion` - Inscripciones

### Para Administradores
- URL: http://localhost:3001
- Páginas disponibles:
  - `/login` - Inicio de sesión
  - `/admin/users` - Panel de administración
  - `/tesorero/dashboard` - Panel de tesorero
  - `/seminarista/dashboard` - Panel de seminarista

## Roles del Sistema
1. **Externo**: Acceso a información pública (puerto 3000)
2. **Admin**: Gestión completa del sistema (puerto 3001)
3. **Tesorero**: Gestión financiera (puerto 3001)
4. **Seminarista**: Panel de estudiante (puerto 3001)

## Estructura de Rutas

### Backend (Puerto 3000)
- `/api/*` - Rutas de la API REST
- `/` - Páginas estáticas para usuarios externos
- `/admin` - Redirección al frontend para administradores

### Frontend React (Puerto 3001)
- Aplicación de página única (SPA) para roles administrativos
- Autenticación JWT
- Dashboards específicos por rol

## Problemas Comunes

### Error "Cannot GET /"
- Verificar que ambos servidores estén ejecutándose
- Para usuarios externos: usar puerto 3000
- Para administradores: usar puerto 3001
- Asegurarse de que el backend esté configurado para servir contenido estático

### Error de Conexión a MongoDB
- Verificar que MongoDB esté ejecutándose
- Revisar la cadena de conexión en `.env`

### Error de Puertos Ocupados
- Verificar que los puertos 3000 y 3001 estén disponibles
- Detener otros servicios que usen estos puertos

## Desarrollo

### Backend
```bash
cd backend
npm run dev  # Usar nodemon para desarrollo
```

### Frontend
```bash
cd frontend
npm start    # Desarrollo en puerto 3000 (conflicto con backend)
npm run start-dev  # Desarrollo en puerto 3001 (recomendado)
```

## Tecnologías Utilizadas
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React, React Router, Bootstrap
- **Autenticación**: JWT
- **Base de Datos**: MongoDB
