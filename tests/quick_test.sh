#!/bin/bash

# Script rápido para ejecutar tests con el entorno virtual correcto

cd "$(dirname "${BASH_SOURCE[0]}")"

# Activar venv
source venv/bin/activate

# Ejecutar un test específico o todos
if [ -z "$1" ]; then
    echo "Uso: ./quick_test.sh [archivo_test.py]"
    echo "Ejemplo: ./quick_test.sh test_auth.py"
    echo ""
    echo "O ejecuta todos con: bash run_all_tests.sh"
else
    pytest "$1" -v --tb=short
fi
