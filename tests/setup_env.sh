#!/bin/bash

# Script para configurar el entorno de testing E2E

echo "🔧 Configurando entorno de testing E2E para Luckas"
echo "=================================================="

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Verificar si existe el entorno virtual
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual..."
    python3 -m venv venv
fi

# Activar entorno virtual
echo "🔌 Activando entorno virtual..."
source venv/bin/activate

# Actualizar pip
echo "⬆️  Actualizando pip..."
pip install --upgrade pip

# Instalar dependencias
echo "📥 Instalando dependencias de testing..."
pip install pytest playwright pytest-playwright pytest-base-url

# Instalar navegadores de Playwright
echo "🌐 Instalando navegadores de Playwright..."
playwright install

# Verificar instalación
echo ""
echo "✅ Verificando instalación..."
echo "   Python: $(which python)"
echo "   Pytest: $(which pytest)"
echo "   Playwright: $(playwright --version)"

echo ""
echo "=================================================="
echo "✨ Entorno configurado exitosamente!"
echo "=================================================="
echo ""
echo "Para ejecutar los tests:"
echo "  source venv/bin/activate"
echo "  bash run_all_tests.sh"
echo ""
