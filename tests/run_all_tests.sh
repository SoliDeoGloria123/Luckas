#!/bin/bash

# Script para ejecutar todos los tests E2E del proyecto Luckas

echo "🚀 Iniciando tests E2E para el proyecto Luckas"
echo "=============================================="

# Configurar variables y activar entorno virtual
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Activar entorno virtual
if [ -d "venv" ]; then
    echo "🔧 Activando entorno virtual..."
    source venv/bin/activate
else
    echo "❌ ERROR: No se encontró el entorno virtual en $SCRIPT_DIR/venv"
    echo "Por favor, crea el entorno virtual primero:"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install pytest playwright pytest-playwright"
    echo "  playwright install"
    exit 1
fi

echo "📍 Directorio de trabajo: $(pwd)"
echo "🌐 URL base: https://luckas.zapto.org"
echo "🐍 Python: $(which python)"
echo "🧪 Pytest: $(which pytest)"
echo ""

# Función para ejecutar un test y mostrar resultado
run_test() {
    local test_file="$1"
    local test_name=$(basename "$test_file" .py)
    
    echo "🧪 Ejecutando: $test_name"
    echo "----------------------------------------"
    
    if pytest "$test_file" -v --tb=short; then
        echo "✅ $test_name: EXITOSO"
    else
        echo "❌ $test_name: FALLÓ"
        echo "📸 Revisa screenshots en: $TEST_DIR/screenshots/"
    fi
    echo ""
}

# Lista de tests a ejecutar en orden de prioridad
echo "🎯 Ejecutando tests por categorías:"
echo ""

# 1. Tests básicos (autenticación y fixtures)
echo "1️⃣  TESTS BÁSICOS"
run_test "test_auth.py"
run_test "test_all_roles.py"

# 2. Tests por rol
echo "2️⃣  TESTS POR ROL"
run_test "test_usuarios.py"        # Admin principalmente
run_test "test_tesorero.py"        # Tesorero
run_test "test_seminarista.py"     # Seminarista  
run_test "test_externo.py"         # Externo

# 3. Tests funcionales
echo "3️⃣  TESTS FUNCIONALES"
run_test "test_eventos.py"
run_test "test_cabanas.py"
run_test "test_programas.py" 
run_test "test_reservas.py"

# 4. Tests adicionales (si existen)
echo "4️⃣  TESTS ADICIONALES"
for test_file in test_*.py; do
    case "$test_file" in
        "test_auth.py"|"test_all_roles.py"|"test_usuarios.py"|"test_tesorero.py"|"test_seminarista.py"|"test_externo.py"|"test_eventos.py"|"test_cabanas.py"|"test_programas.py"|"test_reservas.py")
            # Ya ejecutados arriba
            ;;
        *)
            if [ -f "$test_file" ]; then
                run_test "$test_file"
            fi
            ;;
    esac
done

echo "🏁 Tests completados!"
echo "=============================================="

# Contar resultados
total_tests=$(find . -name "test_*.py" | wc -l)
echo "📊 Resumen:"
echo "   Total de archivos de test: $total_tests"
echo "   Screenshots disponibles en: screenshots/"
echo ""

# Sugerencias
echo "💡 Sugerencias:"
echo "   • Para ejecutar un test específico: pytest test_[nombre].py -v"
echo "   • Para ejecutar con más detalle: pytest test_[nombre].py -vvs"
echo "   • Para ejecutar solo un test: pytest test_[nombre].py::test_function -v"
echo "   • Para ver screenshots: ls -la screenshots/"
echo ""

echo "✨ ¡Todos los tests E2E han sido actualizados para los 4 roles!"