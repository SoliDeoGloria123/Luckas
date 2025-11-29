#!/bin/bash

# Script de instalación completa del entorno de testing

echo "=================================================="
echo "🚀 Instalación del Entorno de Testing E2E"
echo "=================================================="
echo ""

cd "$(dirname "${BASH_SOURCE[0]}")"

echo "📍 Directorio: $(pwd)"
echo ""

# Paso 1: Crear entorno virtual
echo "1️⃣  Creando entorno virtual..."
python3 -m venv venv
echo "   ✅ Entorno virtual creado"
echo ""

# Paso 2: Activar entorno virtual
echo "2️⃣  Activando entorno virtual..."
source venv/bin/activate
echo "   ✅ Entorno activado"
echo ""

# Paso 3: Actualizar pip
echo "3️⃣  Actualizando pip..."
pip install --upgrade pip
echo ""

# Paso 4: Instalar dependencias
echo "4️⃣  Instalando dependencias de testing..."
pip install pytest playwright pytest-playwright pytest-base-url
echo "   ✅ Dependencias instaladas"
echo ""

# Paso 5: Instalar navegadores
echo "5️⃣  Instalando navegadores de Playwright..."
echo "   (Esto puede tomar varios minutos...)"
playwright install chromium
echo "   ✅ Navegadores instalados"
echo ""

# Verificación
echo "=================================================="
echo "✅ INSTALACIÓN COMPLETA"
echo "=================================================="
echo ""
echo "📊 Verificación:"
echo "   Python: $(python --version)"
echo "   Pip: $(pip --version)"
echo "   Pytest: $(pytest --version)"
echo "   Playwright: $(playwright --version)"
echo ""
echo "=================================================="
echo "🎯 SIGUIENTE PASO:"
echo "=================================================="
echo ""
echo "Ejecuta los tests con:"
echo "  source venv/bin/activate"
echo "  bash run_all_tests.sh"
echo ""
echo "O un test individual:"
echo "  source venv/bin/activate"
echo "  pytest test_auth.py -v"
echo ""
