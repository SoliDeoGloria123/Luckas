#!/bin/bash

# Script de inicio completo para el sistema Luckas
# Autor: Assistant
# Fecha: $(date)

echo "🚀 Iniciando Sistema Luckas - Dashboard External"
echo "=================================================="

# Función para verificar si un comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Función para verificar si un puerto está en uso
check_port() {
    lsof -i :$1 >/dev/null 2>&1
}

# 1. Verificar dependencias
echo "🔍 Verificando dependencias..."

if ! command_exists node; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm no está instalado"
    exit 1
fi

if ! command_exists mongod; then
    echo "⚠️  MongoDB no está instalado. Instalando..."
    # Instalar MongoDB en Ubuntu/WSL
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
fi

echo "✅ Dependencias verificadas"

# 2. Iniciar MongoDB
echo "🗄️  Iniciando MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    sudo systemctl start mongod
    sleep 3
    
    if ! pgrep -x "mongod" > /dev/null; then
        echo "⚠️  Iniciando MongoDB manualmente..."
        sudo mkdir -p /data/db
        sudo chown -R $(whoami) /data/db
        mongod --dbpath /data/db --fork --logpath /tmp/mongodb.log
        sleep 3
    fi
fi

if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB iniciado correctamente"
else
    echo "❌ Error al iniciar MongoDB"
    exit 1
fi

# 3. Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd /home/juan/Luckas/backend
if [ ! -d "node_modules" ]; then
    npm install
fi

# 4. Crear credenciales de usuario
echo "👤 Creando usuarios de prueba..."
node recrear-credenciales.js

# 5. Instalar dependencias del frontend
echo "📦 Instalando dependencias del frontend..."
cd /home/juan/Luckas/frontend
if [ ! -d "node_modules" ]; then
    npm install
fi

# 6. Verificar puertos disponibles
echo "🌐 Verificando puertos..."
if check_port 3000; then
    echo "⚠️  Puerto 3000 en uso, terminando proceso..."
    sudo kill -9 $(lsof -t -i:3000) 2>/dev/null || true
    sleep 2
fi

if check_port 3001; then
    echo "⚠️  Puerto 3001 en uso, terminando proceso..."
    sudo kill -9 $(lsof -t -i:3001) 2>/dev/null || true
    sleep 2
fi

# 7. Iniciar el backend
echo "🚀 Iniciando backend (Puerto 3000)..."
cd /home/juan/Luckas/backend
npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Esperar a que el backend esté listo
echo "⏳ Esperando a que el backend esté listo..."
for i in {1..30}; do
    if curl -s http://localhost:3000/api/health >/dev/null 2>&1; then
        echo "✅ Backend listo"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Timeout esperando backend"
        kill $BACKEND_PID 2>/dev/null || true
        exit 1
    fi
    sleep 1
done

# 8. Iniciar el frontend
echo "🚀 Iniciando frontend (Puerto 3001)..."
cd /home/juan/Luckas/frontend
PORT=3001 npm start &
FRONTEND_PID=$!
echo "Frontend PID: $FRONTEND_PID"

# 9. Mostrar información de acceso
echo ""
echo "🎉 ¡Sistema iniciado correctamente!"
echo "=================================="
echo ""
echo "📍 URLs de acceso:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:3000/api"
echo ""
echo "👤 Credenciales de prueba:"
echo "   Admin: admin@seminario.edu.co / 123456"
echo "   Tesorero: tesorero@seminario.edu.co / 123456"
echo "   Seminarista: seminarista@seminario.edu.co / 123456"
echo "   Externo: externo@seminario.edu.co / 123456"
echo ""
echo "🖥️  Dashboard External:"
echo "   1. Ir a http://localhost:3001"
echo "   2. Hacer login con: externo@seminario.edu.co / 123456"
echo "   3. ¡Disfrutar del dashboard moderno!"
echo ""
echo "🛑 Para detener el sistema: Ctrl+C"
echo ""

# 10. Esperar a Ctrl+C para terminar
trap 'echo "🛑 Deteniendo sistema..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit' INT

# Mantener el script corriendo
wait
