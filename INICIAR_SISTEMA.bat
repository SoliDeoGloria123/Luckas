@echo off
echo.
echo ========================================
echo    🚀 SISTEMA LUCKAS - INICIO RAPIDO
echo ========================================
echo.

REM Verificar si estamos en la carpeta correcta
if not exist "backend\package.json" (
    echo ❌ Error: No se encuentra la carpeta backend
    echo    Asegurate de ejecutar este archivo desde la carpeta Luckas
    pause
    exit /b 1
)

echo 📊 Verificando MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB esta corriendo
) else (
    echo ❌ MongoDB no esta corriendo
    echo    Iniciando MongoDB...
    net start MongoDB 2>NUL
    if errorlevel 1 (
        echo    Por favor inicia MongoDB manualmente:
        echo    - Como servicio: net start MongoDB
        echo    - O ejecuta: mongod
        pause
        exit /b 1
    )
)

echo.
echo 📦 Instalando dependencias si es necesario...

REM Backend
if not exist "backend\node_modules" (
    echo    Instalando backend...
    cd backend
    call npm install
    cd ..
)

REM Frontend  
if not exist "frontend\node_modules" (
    echo    Instalando frontend...
    cd frontend
    call npm install
    cd ..
)

echo ✅ Dependencias OK

echo.
echo 🔧 Verificando configuracion...

REM Crear .env si no existe
if not exist "backend\.env" (
    echo PORT=3000> backend\.env
    echo MONGODB_URI=mongodb://localhost:27017/LuckasEnt>> backend\.env
    echo JWT_SECRET=tu_secreto_seguro123456>> backend\.env
    echo ✅ Archivo .env creado
)

echo.
echo 👤 Creando usuarios de prueba...
node SETUP_USUARIOS_PRUEBA.js

echo.
echo 🔄 Liberando puertos...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /F /PID %%a >nul 2>&1

echo.
echo 🌐 Iniciando servidores...

REM Iniciar Backend
echo    Backend (Puerto 3000)...
start "BACKEND LUCKAS" cmd /k "cd /d %cd%\backend && echo 🖥️  BACKEND SERVIDOR && npm start"

REM Esperar un poco
timeout /t 3 >nul

REM Iniciar Frontend
echo    Frontend (Puerto 3001)...
start "FRONTEND LUCKAS" cmd /k "cd /d %cd%\frontend && set PORT=3001 && echo 🌐 FRONTEND REACT && npm start"

echo.
echo 🎉 SISTEMA INICIADO!
echo.
echo 📋 URLS DEL SISTEMA:
echo =====================
echo 🏠 Página Principal:     http://localhost:3000
echo 👥 Área Externa:         http://localhost:3000/external  
echo 📚 Programas Académicos: http://localhost:3000/programas-academicos
echo 🎓 Cursos:              http://localhost:3000/cursos
echo 🎪 Eventos:             http://localhost:3000/eventos
echo.
echo 🔐 Dashboard Admin:      http://localhost:3001/login
echo 🎛️  Panel de Control:     http://localhost:3001/dashboard
echo.
echo 🔑 CREDENCIALES DE PRUEBA:
echo ===========================
echo 👤 ADMIN:       admin / admin123
echo 👤 SEMINARISTA: seminarista / seminarista123  
echo 👤 EXTERNO:     externo / externo123
echo 👤 TESORERO:    tesorero / tesorero123
echo.

REM Abrir páginas automáticamente
echo 🌐 Abriendo páginas...
timeout /t 2 >nul
start http://localhost:3000
timeout /t 2 >nul  
start http://localhost:3001/login

echo.
echo ✨ ¡Sistema Luckas listo para usar!
echo.
echo Para detener el sistema, cierra las ventanas de terminal
echo o presiona Ctrl+C en cada una.
echo.
pause
