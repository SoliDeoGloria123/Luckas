@echo off
title Reinicio Completo del Sistema LuckasEnt
color 0C

echo.
echo ==========================================
echo    REINICIO COMPLETO - SISTEMA LUCKASENT
echo ==========================================
echo.

echo [1/4] Cerrando procesos existentes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo [2/4] Iniciando Backend (Puerto 3000)...
start "Backend-LuckasEnt" cmd /c "cd backend && npm start"

echo [INFO] Esperando a que el backend se inicie...
timeout /t 5 /nobreak >nul

echo [3/4] Iniciando Frontend (Puerto 3001)...
start "Frontend-LuckasEnt" cmd /c "cd frontend && npm start"

echo [4/4] Abriendo navegador...
timeout /t 8 /nobreak >nul
start http://localhost:3001/login

echo.
echo ==========================================
echo              SISTEMA REINICIADO
echo ==========================================
echo.
echo Backend:   http://localhost:3000
echo Frontend:  http://localhost:3001
echo Login:     http://localhost:3001/login
echo.
echo CREDENCIALES:
echo - Admin: admin@luckas.com / admin123
echo.
echo [INFO] Monitorea las ventanas del backend para logs detallados
echo [INFO] Busca mensajes [SIGNIN] para debugging del login
echo.
echo Presiona cualquier tecla para salir...
pause >nul
