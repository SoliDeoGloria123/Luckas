@echo off
REM Script para ejecutar todos los tests E2E del proyecto Luckas en Windows

echo ========================================== echo Iniciando tests E2E para el proyecto Luckas
echo ==========================================
echo.

cd /d "%~dp0"

echo Directorio de trabajo: %CD%
echo URL base: https://luckas.zapto.org
echo.

REM Función para ejecutar un test
:run_test
set test_file=%1
echo.
echo ========================================
echo Ejecutando: %test_file%
echo ========================================
venv\Scripts\pytest.exe %test_file% -v --tb=short
if %ERRORLEVEL% EQU 0 (
    echo [OK] %test_file%: EXITOSO
) else (
    echo [ERROR] %test_file%: FALLO
    echo Revisa screenshots en: screenshots\
)
echo.
goto:eof

REM Ejecutar tests
echo ========================================
echo 1. TESTS BASICOS
echo ========================================
call:run_test test_auth.py
call:run_test test_all_roles.py

echo ========================================
echo 2. TESTS POR ROL
echo ========================================
call:run_test test_usuarios.py
call:run_test test_tesorero.py
call:run_test test_seminarista.py
call:run_test test_externo.py

echo ========================================
echo 3. TESTS FUNCIONALES
echo ========================================
call:run_test test_eventos.py
call:run_test test_cabanas.py
call:run_test test_programas.py
call:run_test test_reservas.py

echo ========================================
echo 4. TESTS ADICIONALES
echo ========================================
call:run_test test_inscripciones.py
call:run_test test_usuarios_mejorado.py

echo.
echo ==========================================
echo Tests completados!
echo ==========================================

pause
