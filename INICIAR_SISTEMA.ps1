# INICIAR SISTEMA LUCKAS - PowerShell
# =================================

Write-Host "🚀 INICIANDO SISTEMA LUCKAS" -ForegroundColor Green
Write-Host "===========================" -ForegroundColor Green

# Verificar si MongoDB está corriendo
Write-Host "`n📊 Verificando MongoDB..." -ForegroundColor Yellow
$mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
if (-not $mongoProcess) {
    Write-Host "❌ MongoDB no está corriendo. Por favor, inicia MongoDB primero." -ForegroundColor Red
    Write-Host "   En Windows: net start MongoDB" -ForegroundColor White
    Write-Host "   O ejecuta mongod desde la línea de comandos" -ForegroundColor White
    exit 1
}
Write-Host "✅ MongoDB está corriendo" -ForegroundColor Green

# Verificar dependencias del backend
Write-Host "`n📦 Verificando dependencias del backend..." -ForegroundColor Yellow
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "⚠️  Instalando dependencias del backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}
Write-Host "✅ Dependencias del backend OK" -ForegroundColor Green

# Verificar dependencias del frontend
Write-Host "`n📦 Verificando dependencias del frontend..." -ForegroundColor Yellow
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "⚠️  Instalando dependencias del frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}
Write-Host "✅ Dependencias del frontend OK" -ForegroundColor Green

# Verificar archivo .env
Write-Host "`n🔧 Verificando configuración..." -ForegroundColor Yellow
if (-not (Test-Path "backend/.env")) {
    Write-Host "⚠️  Creando archivo .env..." -ForegroundColor Yellow
    @"
PORT=3000
MONGODB_URI=mongodb://localhost:27017/LuckasEnt
JWT_SECRET=tu_secreto_seguro123456
"@ | Out-File -FilePath "backend/.env" -Encoding UTF8
}
Write-Host "✅ Configuración OK" -ForegroundColor Green

# Preguntar si crear usuarios de prueba
Write-Host "`n👤 ¿Deseas crear/verificar usuarios de prueba? (S/n): " -ForegroundColor Cyan -NoNewline
$respuesta = Read-Host
if ($respuesta -eq "" -or $respuesta.ToLower() -eq "s" -or $respuesta.ToLower() -eq "si") {
    Write-Host "⚠️  Creando usuarios de prueba..." -ForegroundColor Yellow
    node SETUP_USUARIOS_PRUEBA.js
}

Write-Host "`n🌐 INICIANDO SERVIDORES..." -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

# Terminar procesos existentes en los puertos
Write-Host "🔄 Liberando puertos..." -ForegroundColor Yellow
$processes3000 = netstat -ano | Select-String ":3000" | ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object | Get-Unique
$processes3001 = netstat -ano | Select-String ":3001" | ForEach-Object { ($_ -split '\s+')[-1] } | Sort-Object | Get-Unique

foreach ($pid in $processes3000) {
    if ($pid -and $pid -ne "0") {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}
foreach ($pid in $processes3001) {
    if ($pid -and $pid -ne "0") {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
}

Write-Host "✅ Puertos liberados" -ForegroundColor Green

# Iniciar Backend
Write-Host "`n🖥️  Iniciando Backend (Puerto 3000)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; Write-Host '🖥️  BACKEND SERVIDOR' -ForegroundColor Green; npm start" -WindowStyle Minimized

# Esperar un poco para que el backend inicie
Start-Sleep -Seconds 3

# Iniciar Frontend
Write-Host "🌐 Iniciando Frontend React (Puerto 3001)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; `$env:PORT=3001; Write-Host '🌐 FRONTEND REACT' -ForegroundColor Blue; npm start" -WindowStyle Minimized

Write-Host "`n🎉 SISTEMA INICIADO CORRECTAMENTE!" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n📋 URLS DEL SISTEMA:" -ForegroundColor White
Write-Host "===================" -ForegroundColor White
Write-Host "🏠 Página Principal:    http://localhost:3000" -ForegroundColor Yellow
Write-Host "👥 Área Externa:        http://localhost:3000/external" -ForegroundColor Yellow
Write-Host "📚 Programas Académicos: http://localhost:3000/programas-academicos" -ForegroundColor Yellow
Write-Host "🎓 Cursos:              http://localhost:3000/cursos" -ForegroundColor Yellow
Write-Host "🎪 Eventos:             http://localhost:3000/eventos" -ForegroundColor Yellow
Write-Host "📝 Inscripciones:       http://localhost:3000/inscripcion" -ForegroundColor Yellow
Write-Host ""
Write-Host "🔐 Dashboard Admin:     http://localhost:3001/login" -ForegroundColor Cyan
Write-Host "🎛️  Panel de Control:    http://localhost:3001/dashboard" -ForegroundColor Cyan

Write-Host "`n🔑 CREDENCIALES DE PRUEBA:" -ForegroundColor White
Write-Host "=========================" -ForegroundColor White
Write-Host "👤 ADMIN" -ForegroundColor Red
Write-Host "   Usuario: admin / Email: admin@luckas.com" -ForegroundColor White
Write-Host "   Contraseña: admin123" -ForegroundColor White
Write-Host ""
Write-Host "👤 SEMINARISTA" -ForegroundColor Blue
Write-Host "   Usuario: seminarista / Email: seminarista@luckas.com" -ForegroundColor White
Write-Host "   Contraseña: seminarista123" -ForegroundColor White
Write-Host ""
Write-Host "👤 EXTERNO" -ForegroundColor Green
Write-Host "   Usuario: externo / Email: externo@luckas.com" -ForegroundColor White
Write-Host "   Contraseña: externo123" -ForegroundColor White
Write-Host ""
Write-Host "👤 TESORERO" -ForegroundColor Magenta
Write-Host "   Usuario: tesorero / Email: tesorero@luckas.com" -ForegroundColor White
Write-Host "   Contraseña: tesorero123" -ForegroundColor White

Write-Host "`n⚡ Para detener el sistema, cierra las ventanas del terminal o usa Ctrl+C" -ForegroundColor Yellow
Write-Host ""

# Abrir automáticamente las páginas principales
Write-Host "🌐 Abriendo páginas principales..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"
Start-Sleep -Seconds 2
Start-Process "http://localhost:3001/login"

Write-Host "`n✨ ¡Sistema Luckas listo para usar!" -ForegroundColor Green
Write-Host "Presiona Enter para continuar..." -ForegroundColor Gray
Read-Host
