@echo off
REM Script simple para ejecutar un test individual

cd /d "%~dp0"

if "%1"=="" (
    echo Uso: run_single_test.bat test_nombre.py
    echo Ejemplo: run_single_test.bat test_auth.py
    pause
    exit /b 1
)

echo Ejecutando: %1
echo ==========================================
venv\Scripts\pytest.exe %1 -v --tb=short

echo.
echo ==========================================
if %ERRORLEVEL% EQU 0 (
    echo [OK] Test exitoso
) else (
    echo [ERROR] Test fallo - revisa screenshots\
)
echo ==========================================

pause
