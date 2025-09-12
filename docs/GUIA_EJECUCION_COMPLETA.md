# 🚀 GUÍA COMPLETA - SISTEMA LUCKAS

## 📋 TABLA DE CONTENIDOS
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Configuración](#configuración)
4. [Ejecución Paso a Paso](#ejecución-paso-a-paso)
5. [Acceso al Sistema](#acceso-al-sistema)
6. [Credenciales de Prueba](#credenciales-de-prueba)
7. [Funcionalidades](#funcionalidades)
8. [Solución de Problemas](#solución-de-problemas)

---

## 🛠️ REQUISITOS PREVIOS

### Software Necesario
- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **MongoDB** (versión 6 o superior) - [Descargar aquí](https://www.mongodb.com/try/download/community)
- **Git** (opcional) - [Descargar aquí](https://git-scm.com/)

### Verificar Instalaciones
```powershell
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar MongoDB (si está en PATH)
mongod --version
```

---

## 📥 INSTALACIÓN

### Opción 1: Descarga Directa
1. Descargar el proyecto completo
2. Extraer a `c:\xampp\htdocs\Luckas\` (o la ruta deseada)

### Opción 2: Clonar con Git
```bash
git clone <repositorio-url> c:\xampp\htdocs\Luckas
cd c:\xampp\htdocs\Luckas
```

---

## ⚙️ CONFIGURACIÓN

### 1. Iniciar MongoDB
```powershell
# Opción A: Como servicio (Windows)
net start MongoDB

# Opción B: Manualmente
mongod
```

### 2. Configuración Automática
El proyecto incluye scripts que configuran todo automáticamente:

```powershell
cd c:\xampp\htdocs\Luckas
.\INICIAR_SISTEMA.ps1
```

### 3. Configuración Manual (si prefieres)

#### Backend:
```powershell
cd backend
npm install
```

Crear archivo `.env` en `backend/.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/LuckasEnt
JWT_SECRET=tu_secreto_seguro123456
```

#### Frontend:
```powershell
cd frontend
npm install
```

---

## 🚀 EJECUCIÓN PASO A PASO

### Método Automático (RECOMENDADO)
```powershell
# 1. Abrir PowerShell como Administrador
# 2. Navegar al proyecto
cd c:\xampp\htdocs\Luckas

# 3. Ejecutar script de inicio
.\INICIAR_SISTEMA.ps1
```

### Método Manual

#### 1. Iniciar MongoDB
```powershell
# Si no está como servicio
mongod
```

#### 2. Crear Usuarios de Prueba
```powershell
node SETUP_USUARIOS_PRUEBA.js
```

#### 3. Iniciar Backend (Terminal 1)
```powershell
cd backend
npm start
```

#### 4. Iniciar Frontend (Terminal 2)
```powershell
cd frontend
set PORT=3001
npm start
```

---

## 🌐 ACCESO AL SISTEMA

### Páginas Públicas (Puerto 3000)
- **Inicio:** http://localhost:3000
- **Área Externa:** http://localhost:3000/external
- **Programas Académicos:** http://localhost:3000/programas-academicos
- **Cursos:** http://localhost:3000/cursos
- **Eventos:** http://localhost:3000/eventos
- **Inscripciones:** http://localhost:3000/inscripcion

### Panel de Administración (Puerto 3001)
- **Login:** http://localhost:3001/login
- **Dashboard:** http://localhost:3001/dashboard

---

## 🔑 CREDENCIALES DE PRUEBA

### 👑 ADMINISTRADOR
- **Usuario:** admin
- **Email:** admin@luckas.com
- **Contraseña:** admin123
- **Acceso:** Todas las funcionalidades del sistema

### 👨‍🎓 SEMINARISTA
- **Usuario:** seminarista
- **Email:** seminarista@luckas.com
- **Contraseña:** seminarista123
- **Acceso:** Dashboard limitado, inscripciones

### 👤 EXTERNO
- **Usuario:** externo
- **Email:** externo@luckas.com
- **Contraseña:** externo123
- **Acceso:** Páginas públicas, inscripciones

### 💰 TESORERO
- **Usuario:** tesorero
- **Email:** tesorero@luckas.com
- **Contraseña:** tesorero123
- **Acceso:** Dashboard financiero, reportes

---

## ⭐ FUNCIONALIDADES

### Para Administradores
- ✅ Gestión completa de programas académicos (CRUD)
- ✅ Gestión completa de cursos (CRUD)
- ✅ Gestión completa de programas técnicos (CRUD)
- ✅ Gestión de eventos
- ✅ Gestión de usuarios
- ✅ Gestión de inscripciones
- ✅ Reportes y estadísticas
- ✅ Gestión de reservas de cabañas

### Para Usuarios Externos
- ✅ Navegación por programas académicos
- ✅ Consulta de cursos disponibles
- ✅ Inscripción a eventos
- ✅ Visualización de información institucional

### Características Técnicas
- 🔐 Sistema de autenticación JWT
- 📱 Interfaz responsive
- 🎨 Diseño moderno con Bootstrap
- 📊 Dashboard administrativo completo
- 🔄 API REST completa
- 📄 Filtros y búsquedas avanzadas

---

## 🔧 SOLUCIÓN DE PROBLEMAS

### Error: Puerto en Uso
```powershell
# Encontrar proceso usando el puerto
netstat -ano | findstr :3000

# Terminar proceso
taskkill /F /PID <numero_proceso>
```

### Error: MongoDB No Conecta
```powershell
# Verificar si MongoDB está corriendo
Get-Process mongod

# Iniciar MongoDB
net start MongoDB
# O manualmente:
mongod
```

### Error: Módulos No Encontrados
```powershell
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: CORS o Proxy
- Verificar que el backend esté en puerto 3000
- Verificar que el frontend esté en puerto 3001
- Revisar `frontend/setupProxy.js`

### Reiniciar Sistema Completo
```powershell
# Terminar todos los procesos Node.js
Get-Process node | Stop-Process -Force

# Reiniciar
.\INICIAR_SISTEMA.ps1
```

---

## 📞 SOPORTE

### Logs del Sistema
- **Backend:** Consola donde se ejecutó `npm start`
- **Frontend:** Consola del navegador (F12)
- **MongoDB:** Logs del servicio MongoDB

### Verificar Estado
```powershell
# Verificar puertos ocupados
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Verificar procesos Node.js
Get-Process node
```

---

## 🎯 FLUJO DE TRABAJO TÍPICO

### Como Administrador:
1. Acceder a http://localhost:3001/login
2. Iniciar sesión con credenciales de admin
3. Gestionar programas académicos, cursos y eventos
4. Revisar inscripciones y reportes

### Como Usuario Externo:
1. Acceder a http://localhost:3000
2. Navegar por programas y cursos
3. Inscribirse a eventos de interés
4. Consultar información institucional

---

**¡Sistema Luckas listo para usar! 🎉**

Para más información o soporte, consultar la documentación técnica o contactar al equipo de desarrollo.
