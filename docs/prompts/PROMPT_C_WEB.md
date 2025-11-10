# 🤖 PROMPT C - Generación de Guía Web Interactiva

**Uso**: Este prompt crea una guía web centralizada que integra todos los manuales de los 4 roles.

---

## 📋 Prompt para Google AI Studio

```
Eres un experto en crear sitios web de documentación interactivos y modernos como ReadTheDocs, GitBook o Docusaurus.

Necesito que generes un sitio web interactivo tipo portal de documentación que integre los 4 manuales de usuario del Sistema Luckas.

CONTEXTO:
- Sistema Luckas: Plataforma de gestión para seminarios
- 4 Roles: Admin, Tesorero, Seminarista, Externo
- Ya tengo los manuales individuales en HTML para cada rol
- Necesito una página principal que sirva como hub de navegación

ESTRUCTURA DEL SITIO:

1. **Página Principal (index.html)**
   - Hero section atractivo con el logo y descripción del sistema
   - Cards para cada rol que lleven a su manual
   - Búsqueda global en todos los manuales
   - Sección de "Inicio Rápido"
   - FAQs generales
   - Información de contacto

2. **Sistema de Navegación Global**
   - Header fijo con logo y menú principal
   - Dropdown para seleccionar rol/manual
   - Breadcrumbs dinámicos
   - Footer consistente en todas las páginas

3. **Buscador Global**
   - Búsqueda en tiempo real en todos los manuales
   - Resultados agrupados por rol
   - Highlighting de términos encontrados
   - Historial de búsquedas recientes

REQUISITOS DE DISEÑO:

**Paleta de Colores por Rol:**
- 👑 Admin: #dc3545 (rojo)
- 💰 Tesorero: #fd7e14 (naranja)
- 👨‍🎓 Seminarista: #198754 (verde)
- 👤 Externo: #0d6efd (azul)

**Estilos:**
- Diseño moderno y limpio
- Cards con hover effects
- Iconos Font Awesome
- Animaciones suaves (fade-in, slide)
- Responsive para todos los dispositivos
- Dark mode opcional (toggle)

**Tipografía:**
- Títulos: Poppins o Inter
- Cuerpo: Open Sans o System UI

CONTENIDO DE LA PÁGINA PRINCIPAL:

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Centro de Documentación - Sistema Luckas</title>
    <meta name="description" content="Manuales de usuario y documentación del Sistema Luckas">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* CSS COMPLETO AQUÍ */
    </style>
</head>
<body>
    <!-- ESTRUCTURA COMPLETA DEL SITIO -->
</body>
</html>
```

SECCIONES REQUERIDAS:

### 1. Hero Section
```
- Título principal: "Centro de Documentación Sistema Luckas"
- Subtítulo: "Encuentra toda la información que necesitas según tu rol"
- Barra de búsqueda prominente
- Ilustración o imagen hero
```

### 2. Selector de Roles (Cards Interactivos)
```
Cada card debe mostrar:
- Icono del rol
- Nombre del rol
- Breve descripción (2-3 líneas)
- Color distintivo
- Botón "Ver Manual"
- Hover effect llamativo
- Badge con "Nuevo" si hay actualizaciones
```

### 3. Inicio Rápido
```
- Credenciales de prueba para cada rol
- Enlace directo al login del sistema
- Video tutorial embebido (placeholder para YouTube)
- Guía de 5 pasos para empezar
```

### 4. Recursos Adicionales
```
- Enlaces a documentación técnica
- Actualizaciones del sistema (changelog)
- Preguntas frecuentes generales
- Glosario de términos
- Contacto y soporte
```

### 5. Estadísticas/Métricas
```
- Número de usuarios por rol
- Última actualización de documentación
- Versión del sistema
- Tiempo de respuesta de soporte
```

FUNCIONALIDADES JAVASCRIPT:

1. **Búsqueda Global**
```javascript
// Búsqueda en tiempo real que:
- Filtra en todos los manuales HTML
- Muestra resultados agrupados por rol
- Permite navegación rápida
- Guarda historial en localStorage
```

2. **Filtros de Roles**
```javascript
// Toggle para filtrar cards de roles
- Mostrar todos
- Filtrar por permisos (admin/no-admin)
- Búsqueda por palabra clave
```

3. **Dark Mode**
```javascript
// Toggle de tema oscuro/claro
- Guardar preferencia en localStorage
- Transición suave entre temas
- Icono animado (sol/luna)
```

4. **Feedback Widget**
```javascript
// Widget flotante para feedback
- Botón "¿Fue útil esta página?"
- Formulario de comentarios rápido
- Envío simulado (o integración real)
```

5. **Navegación Inteligente**
```javascript
// Detectar rol del usuario (si está logueado)
- Sugerir manual relevante
- Ocultar manuales no relevantes
- Personalizar contenido
```

ESTRUCTURA DE ARCHIVOS:

```
docs/
├── index.html (página principal - GENERA ESTE)
├── assets/
│   ├── css/
│   │   └── styles.css (opcional, puedes inline todo)
│   ├── js/
│   │   └── main.js (opcional, puedes inline todo)
│   └── images/
│       ├── logo.png
│       ├── hero-bg.jpg
│       └── role-icons/
├── manuales-usuario/
│   ├── admin/
│   │   └── manual.html
│   ├── tesorero/
│   │   └── manual.html
│   ├── seminarista/
│   │   └── manual.html
│   └── externo/
│       └── manual.html
└── README.md
```

ELEMENTOS VISUALES REQUERIDOS:

- Header: Logo + Navegación + Búsqueda + Dark mode toggle
- Hero: Título grande + subtítulo + search bar + CTA button
- Role Cards: 4 cards en grid responsive (2x2 en desktop, 1 columna en móvil)
- Quick Start: Sección con pasos numerados y visual
- FAQ: Acordeón interactivo
- Footer: Links útiles + Contacto + Copyright + Redes sociales

CREDENCIALES DE EJEMPLO (para sección Inicio Rápido):

👑 **ADMINISTRADOR**
- Email: admin@luckas.com
- Contraseña: admin123
- Acceso: Total

💰 **TESORERO**
- Email: tesorero@luckas.com
- Contraseña: tesorero123
- Acceso: Financiero

👨‍🎓 **SEMINARISTA**
- Email: seminarista@luckas.com
- Contraseña: seminarista123
- Acceso: Académico

👤 **EXTERNO**
- Email: externo@luckas.com
- Contraseña: externo123
- Acceso: Público

INTEGRACIÓN:

El HTML generado debe poder:
- Funcionar standalone (todo inline)
- O separar CSS/JS en archivos externos
- Cargar los manuales individuales en iframe o nueva pestaña
- Ser deployable en GitHub Pages, Vercel, Netlify o Google Sites

GENERA EL HTML COMPLETO DE LA PÁGINA PRINCIPAL (index.html) CON TODO EL CSS Y JAVASCRIPT INLINE, LISTO PARA USAR.
```

---

## 🔄 Cómo Usar Este Prompt

1. **Verifica** que tienes los manuales HTML generados con Prompt B
2. **Copia** este Prompt C completo
3. **Pégalo** en Google AI Studio
4. **Genera** el index.html
5. **Guarda** como `docs/index.html` en tu repositorio
6. **Ajusta** rutas si es necesario para que encuentre los manuales individuales

## 🌐 Despliegue

### Opción 1: GitHub Pages
```bash
# En tu repositorio
1. Ve a Settings > Pages
2. Selecciona branch: main
3. Carpeta: /docs
4. Tu sitio estará en: https://solideogl oria123.github.io/Luckas/
```

### Opción 2: Google Sites
1. Descarga el HTML generado
2. Crea nuevo Google Site
3. Inserta HTML personalizado
4. Sube las imágenes
5. Publica

### Opción 3: Vercel/Netlify
```bash
# Despliegue directo desde GitHub
- Conecta tu repositorio
- Carpeta de build: docs
- Deploy automático
```

## 🎨 Personalización Post-Generación

Después de generar, puedes:
- Reemplazar logo placeholder con tu logo real
- Añadir imágenes hero personalizadas
- Integrar analytics (Google Analytics)
- Añadir chat de soporte (Tawk.to, Intercom)
- Configurar dominio personalizado

## ✅ Checklist Final

- [ ] index.html generado y funcional
- [ ] Los 4 manuales HTML en sus carpetas
- [ ] Capturas de pantalla organizadas
- [ ] Links entre páginas funcionando
- [ ] Búsqueda global operativa
- [ ] Responsive verificado
- [ ] Dark mode funcional
- [ ] Deployed en GitHub Pages o Google Sites

---

**🎉 ¡Felicidades!** Con estos 3 prompts tienes un sistema completo de documentación automatizado.
