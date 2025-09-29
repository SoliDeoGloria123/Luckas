@echo off
echo ========================================
echo  INICIANDO SISTEMA LUCKAS (MEJORADO)
echo ========================================

echo.
echo [1] Verificando MongoDB...
net start MongoDB >nul 2>&1
if %errorlevel%==0 (
    echo ✓ MongoDB iniciado correctamente
) else (
    echo ! MongoDB ya estaba ejecutándose
)

echo.
echo [2] Liberando puertos en uso...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3001') do taskkill /F /PID %%a >nul 2>&1
echo ✓ Puertos liberados

echo.
echo [3] Iniciando Backend (Puerto 3000)...
cd backend
start "Luckas Backend" cmd /k "npm start"
echo ✓ Backend iniciándose...

echo.
echo [4] Esperando 5 segundos...
timeout /t 5 /nobreak >nul

echo.
echo [5] Iniciando Frontend (Puerto 3001)...
cd ..\frontend
set PORT=3001
start "Luckas Frontend" cmd /k "set PORT=3001 && npm start"
echo ✓ Frontend iniciándose...

echo.
echo [6] Esperando 3 segundos más...
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo  SISTEMA LUCKAS INICIADO
echo ========================================
echo.
echo 🌐 ACCESOS:
echo   • Backend: http://localhost:3000
echo   • Frontend: http://localhost:3001
echo   • Dashboard Admin: http://localhost:3001/login
echo.
echo 🔑 CREDENCIALES:
echo   • Admin: admin / admin123
echo   • Externo: externo / externo123
echo.
echo ⚠️  Si hay errores, cierra todas las ventanas
echo    y ejecuta este script nuevamente.
echo.
pause
