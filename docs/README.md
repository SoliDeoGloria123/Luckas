# 📚 Documentación y Manuales de Usuario - Sistema Luckas

Bienvenido a la documentación completa del Sistema Luckas para la gestión del Seminario.

## 📖 Manuales de Usuario por Rol

| Rol | Manual | Estado |
|-----|--------|--------|
| 👑 **Administrador** | [Ver Manual](./manuales-usuario/admin/README.md) | 🟡 En desarrollo |
| 💰 **Tesorero** | [Ver Manual](./manuales-usuario/tesorero/README.md) | 🟡 En desarrollo |
| 👨‍🎓 **Seminarista** | [Ver Manual](./manuales-usuario/seminarista/README.md) | 🟡 En desarrollo |
| 👤 **Externo** | [Ver Manual](./manuales-usuario/externo/README.md) | 🟡 En desarrollo |

## 🚀 Guía Rápida de Creación de Manuales

### Paso 1️⃣: Capturar Pantallas
1. Usa tu extensión de Chrome
2. Guarda las imágenes en `/docs/manuales-usuario/[ROL]/capturas/`
3. Nomenclatura: `01-login.png`, `02-dashboard.png`, etc.

### Paso 2️⃣: Generar Manual con IA
1. Abre [Google AI Studio](https://aistudio.google.com/)
2. Usa el [Prompt A - Manual Editable](./prompts/PROMPT_A_MANUAL.md)
3. Sube las capturas
4. Copia el resultado al README.md del rol correspondiente

### Paso 3️⃣: Revisar y Editar
- Revisa el contenido generado
- Ajusta detalles técnicos
- Verifica rutas y URLs

### Paso 4️⃣: Crear Presentación (Opcional)
1. Usa [Gamma.app](https://gamma.app/)
2. Importa el contenido del manual
3. Genera presentación visual

### Paso 5️⃣: Generar HTML Interactivo
1. Usa el [Prompt B - HTML Automático](./prompts/PROMPT_B_HTML.md)
2. Guarda el resultado en `/docs/manuales-usuario/[ROL]/manual.html`

### Paso 6️⃣: Crear Guía Web
1. Usa el [Prompt C - Guía Interactiva](./prompts/PROMPT_C_WEB.md)
2. Genera la versión web navegable

### Paso 7️⃣: Publicar
- Sube todo a Google Sites
- O usa GitHub Pages (configurado en este repo)

## 📋 Checklist por Rol

### ✅ Administrador
- [ ] Capturas de Login
- [ ] Dashboard principal
- [ ] Gestión de usuarios
- [ ] Gestión de cursos
- [ ] Gestión de programas académicos
- [ ] Gestión de eventos
- [ ] Reportes y estadísticas
- [ ] Configuración del sistema

### ✅ Tesorero
- [ ] Login y acceso
- [ ] Dashboard financiero
- [ ] Gestión de pagos
- [ ] Reportes financieros
- [ ] Gestión de usuarios (limitada)

### ✅ Seminarista
- [ ] Login y acceso
- [ ] Dashboard personal
- [ ] Ver cursos inscritos
- [ ] Perfil personal
- [ ] Calendario de eventos

### ✅ Externo
- [ ] Página principal pública
- [ ] Formulario de registro
- [ ] Información de programas
- [ ] Contacto

## 🛠️ Herramientas Recomendadas

- **Capturas**: Tu extensión de Chrome personalizada
- **IA para contenido**: [Google AI Studio](https://aistudio.google.com/)
- **Presentaciones**: [Gamma.app](https://gamma.app/)
- **Publicación**: [Google Sites](https://sites.google.com/) o GitHub Pages

## 📞 Soporte

Para dudas sobre la documentación, contacta al equipo de desarrollo.

---

**Última actualización**: 2025-11-10
**Versión del sistema**: 1.0.0