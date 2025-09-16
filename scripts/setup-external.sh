#!/bin/bash
# setup-external.sh

echo "🚀 Configurando el Rol External para Luckas..."

# Crear directorios si no existen
mkdir -p frontend/src/pages/External
mkdir -p frontend/src/components/External
mkdir -p frontend/src/styles/External

echo "✅ Directorios creados"

# Instalar dependencias si es necesario
if [ -d "frontend" ]; then
    cd frontend
    if [ -f "package.json" ]; then
        echo "📦 Instalando dependencias del frontend..."
        npm install
    fi
    cd ..
fi

if [ -d "backend" ]; then
    cd backend
    if [ -f "package.json" ]; then
        echo "📦 Instalando dependencias del backend..."
        npm install
    fi
    cd ..
fi

echo "✅ Configuración del Rol External completada"
echo "🎉 Ya puedes ver el dashboard en: frontend/external-demo.html"