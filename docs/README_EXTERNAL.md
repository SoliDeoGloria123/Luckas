# 🌟 Dashboard External - Luckas

Dashboard moderno para usuarios externos del Seminario Bautista de Colombia.

## ✨ Características

- **Dashboard moderno** con diseño dark mode
- **Inscripción a cursos** creados por Admin
- **Inscripción a eventos** (campamentos, conferencias)
- **Aplicación para seminarista** con formulario completo
- **Sistema de pagos** (PSE/Nequi) - pendiente integración
- **Diseño responsive** y minimalista

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/SoliDeoGloria123/Luckas.git
cd Luckas

# Ejecutar script de configuración
./setup-external.sh
```

## 📁 Estructura de Archivos

```
frontend/
├── src/
│   ├── pages/External/
│   │   ├── ExternalDashboard.js
│   │   ├── ExternalDashboard.css
│   │   └── index.js
│   └── components/External/
│       ├── SeminaristaForm.js
│       └── SeminaristaForm.css
└── external-demo.html
```

## 🎨 Diseño

El dashboard implementa el diseño específico solicitado:
- **Fondo negro** (#000000) con shaders animados
- **Tipografías**: Figtree (sans-serif) + Instrument Serif
- **Colores**: Negro, Blanco, Azul (#1b62fc)
- **Efectos**: Backdrop blur, animaciones suaves, estados hover

## 🔧 Integración Futura

### Backend APIs a conectar:
- `GET /api/external/courses/available` - Cursos disponibles
- `POST /api/external/inscriptions/course` - Inscribirse a curso
- `POST /api/external/inscriptions/event` - Inscribirse a evento
- `POST /api/external/seminarista/apply` - Aplicar para seminarista

### Sistema de Pagos:
- Integración PSE
- Integración Nequi
- Webhooks de confirmación

## 📝 Para tus Compañeros

1. **Admin**: Los cursos y eventos que crees serán visibles aquí
2. **Tesorero**: Podrás ver las inscripciones y pagos
3. **Integración**: Conectar las APIs con los datos reales

## 🎯 Próximos Pasos

1. Conectar con sistema de autenticación existente
2. Integrar APIs del backend
3. Configurar pasarela de pagos
4. Implementar notificaciones por email
5. Agregar sistema de archivos para documentos

## 📱 Vista Previa

Abre `frontend/external-demo.html` en tu navegador para ver el diseño.