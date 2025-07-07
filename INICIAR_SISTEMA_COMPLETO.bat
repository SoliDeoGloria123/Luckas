@echo off
title Sistema LuckasEnt - Iniciador Mejorado
color 0A

echo.
echo ==========================================
echo    SISTEMA LUCKASENT - INICIO AUTOMATICO
echo ==========================================
echo.

echo [1/4] Verificando MongoDB...
timeout /t 2 /nobreak >nul

REM Verificar si MongoDB está corriendo
netstat -an | find "27017" >nul
if %errorlevel%==0 (
    echo [OK] MongoDB está corriendo en puerto 27017
) else (
    echo [ERROR] MongoDB no detectado. Iniciando...
    start "MongoDB" cmd /c "mongod --dbpath C:\data\db"
    echo [INFO] Esperando a que MongoDB se inicie...
    timeout /t 5 /nobreak >nul
)

echo.
echo [2/4] Creando usuarios de prueba...
node crear-usuarios-prueba.js

echo.
echo [3/4] Iniciando Backend (Puerto 3000)...
start "Backend-LuckasEnt" cmd /c "cd backend && npm start"

echo [INFO] Esperando a que el backend se inicie...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Iniciando Frontend (Puerto 3001)...
start "Frontend-LuckasEnt" cmd /c "cd frontend && set PORT=3001 && npm start"

echo.
echo ==========================================
echo              SISTEMA INICIADO
echo ==========================================
echo.
echo Backend:   http://localhost:3000
echo Frontend:  http://localhost:3001
echo Login:     http://localhost:3001/login
echo.
echo CREDENCIALES DE PRUEBA:
echo - Admin:     admin@luckas.com     / admin123
echo - Tesorero:  tesorero@luckas.com  / tesorero123
echo.
echo [INFO] Las ventanas del sistema se abrirán automáticamente.
echo [INFO] Si hay errores, revisar las ventanas individuales.
echo.

REM Esperar un poco más y abrir el navegador
timeout /t 8 /nobreak >nul
start http://localhost:3001/login

echo [INFO] Presiona cualquier tecla para ejecutar diagnóstico completo...
pause >nul

echo.
echo [EXTRA] Ejecutando diagnóstico del sistema...
node diagnostico-completo.js

echo.
echo [FIN] Presiona cualquier tecla para salir...
pause >nul
