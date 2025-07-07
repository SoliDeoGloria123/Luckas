@echo off
echo ================================================
echo    LIMPIEZA COMPLETA DE TOKENS Y REINICIO
echo ================================================
echo.

echo 🧹 Paso 1: Matando procesos existentes...
taskkill /f /im node.exe 2>nul
taskkill /f /im cmd.exe /fi "WINDOWTITLE eq*npm*" 2>nul
echo ✅ Procesos terminados

echo.
echo 🧹 Paso 2: Limpiando cache de npm...
cd /d "c:\xampp\htdocs\Luckas\backend"
call npm cache clean --force 2>nul
cd /d "c:\xampp\htdocs\Luckas\frontend"
call npm cache clean --force 2>nul
echo ✅ Cache de npm limpiado

echo.
echo 🔄 Paso 3: Iniciando backend en puerto 3000...
cd /d "c:\xampp\htdocs\Luckas\backend"
start "Backend-LuckasEnt" cmd /k "npm start"

echo.
echo ⏳ Esperando 5 segundos para que el backend se inicie...
timeout /t 5 /nobreak > nul

echo.
echo 🔄 Paso 4: Iniciando frontend en puerto 3001...
cd /d "c:\xampp\htdocs\Luckas\frontend"
start "Frontend-LuckasEnt" cmd /k "set PORT=3001 && npm start"

echo.
echo ✅ SISTEMA REINICIADO COMPLETAMENTE
echo.
echo 🚨 IMPORTANTE: 
echo    1. Ve al navegador y borra TODOS los datos del sitio
echo    2. Abre las herramientas de desarrollador (F12)
echo    3. Ve a Application/Storage y borra localStorage
echo    4. Haz Ctrl+Shift+R para recargar sin cache
echo    5. Haz login nuevamente para obtener un token fresco
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:3001
echo.
pause
