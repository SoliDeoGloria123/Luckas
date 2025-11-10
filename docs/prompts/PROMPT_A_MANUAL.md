# 🤖 PROMPT A - Generación de Manual de Usuario Editable

**Uso**: Copia este prompt y úsalo en [Google AI Studio](https://aistudio.google.com/) junto con las capturas de pantalla.

---

## 📋 Prompt para Google AI Studio

```
Eres un experto en crear manuales de usuario técnicos y didácticos para software empresarial.

Necesito que generes un manual de usuario completo en formato Markdown para el rol de [INSERTAR_ROL_AQUÍ] del Sistema Luckas - Sistema de Gestión para Seminarios.

CONTEXTO DEL SISTEMA:
- Sistema web para gestión académica y administrativa de un seminario
- Tecnologías: React (Frontend), Node.js/Express (Backend), MongoDB (Base de datos)
- 4 roles principales: Admin, Tesorero, Seminarista, Externo
- Puertos: Frontend 3001, Backend 3000
- Autenticación mediante JWT

ROL ESPECÍFICO: [INSERTAR_ROL_AQUÍ]

PERMISOS Y FUNCIONALIDADES DEL ROL:

[PARA ADMIN]
- Gestión completa de usuarios (crear, editar, eliminar, activar/desactivar)
- Gestión de cursos y programas académicos
- Gestión de programas técnicos
- Gestión de eventos
- Acceso a reportes y estadísticas completas
- Configuración del sistema

[PARA TESORERO]
- Gestión de usuarios (crear, editar - NO eliminar)
- Gestión financiera y pagos
- Reportes financieros
- Visualización de estadísticas

[PARA SEMINARISTA]
- Dashboard personal
- Visualización de cursos inscritos
- Edición de perfil propio
- Calendario de eventos
- Consulta de información académica

[PARA EXTERNO]
- Acceso a páginas públicas
- Formulario de registro/inscripción
- Visualización de información general
- Contacto

CAPTURAS ADJUNTAS:
He adjuntado [X] capturas de pantalla numeradas secuencialmente que muestran el flujo completo del usuario.

ESTRUCTURA REQUERIDA DEL MANUAL:

# Manual de Usuario - [ROL]

## 📋 Tabla de Contenidos
[Genera tabla de contenidos automática]

## 1. Introducción
### 1.1 Propósito del Manual
### 1.2 Alcance del Rol
### 1.3 Requisitos Previos
- Navegador compatible (Chrome, Firefox, Edge)
- Conexión a Internet
- Credenciales de acceso

## 2. Acceso al Sistema
### 2.1 URL de Acceso
### 2.2 Proceso de Login
- Paso a paso con referencia a capturas
- Credenciales de ejemplo
- Recuperación de contraseña

### 2.3 Primer Ingreso

## 3. Interfaz Principal
### 3.1 Navegación General
- Menú lateral (Sidebar)
- Barra superior (Header)
- Área de contenido principal

### 3.2 Dashboard Principal
- Descripción de cada sección
- Tarjetas informativas
- Gráficos y estadísticas

## 4. Funcionalidades Principales

[Para cada funcionalidad, incluir:]

### 4.X [Nombre de Funcionalidad]
#### Descripción
¿Qué hace esta función?

#### Acceso
¿Cómo llegar a esta función?

#### Pasos Detallados
1. Primer paso (referencia a captura X)
2. Segundo paso (referencia a captura Y)
3. ...

#### Campos y Opciones
- Campo 1: Descripción y validaciones
- Campo 2: Descripción y validaciones
- ...

#### Ejemplos Prácticos
Caso de uso real

#### Mensajes y Validaciones
- Mensaje de éxito
- Mensajes de error comunes
- Soluciones

#### Consejos y Buenas Prácticas
Tips para usar mejor esta función

## 5. Gestión de Perfil
### 5.1 Ver Perfil
### 5.2 Editar Información Personal
### 5.3 Cambiar Contraseña
### 5.4 Configuraciones Personales

## 6. Casos de Uso Comunes
### Caso 1: [Nombre del caso]
Flujo completo paso a paso

### Caso 2: [Nombre del caso]
Flujo completo paso a paso

## 7. Preguntas Frecuentes (FAQ)
### ¿Cómo...?  
### ¿Qué hacer si...?  
### ¿Por qué...?  

## 8. Solución de Problemas
### Problema 1: No puedo iniciar sesión
**Causas posibles:**
**Soluciones:**

### Problema 2: Error al guardar cambios
**Causas posibles:**
**Soluciones:**

### Problema 3: No veo ciertas opciones del menú
**Causas posibles:**
**Soluciones:**

## 9. Glosario de Términos
- **Término 1**: Definición
- **Término 2**: Definición

## 10. Contacto y Soporte
### Soporte Técnico
### Reportar Problemas
### Sugerencias de Mejora

## 11. Anexos
### Anexo A: Atajos de Teclado
### Anexo B: Códigos de Error
### Anexo C: Actualizaciones del Sistema

---

INSTRUCCIONES ESPECÍFICAS:

1. **Usa las capturas adjuntas** para referenciar cada paso. Menciona: "Ver Figura X" o "(Captura 01-login.png)"

2. **Sé específico y claro**: Este manual es para usuarios que pueden no ser técnicos

3. **Incluye advertencias**: Usa bloques de nota para advertencias importantes:
   > ⚠️ **Advertencia**: Texto de advertencia
   > ℹ️ **Nota**: Información adicional
   > ✅ **Tip**: Consejo útil

4. **Formato visual**: 
   - Usa emojis apropiados para cada sección
   - Tablas para comparar opciones
   - Listas numeradas para procesos secuenciales
   - Listas con viñetas para opciones

5. **Tono**: Profesional pero amigable, instructivo pero no condescendiente

6. **Longitud**: Detallado pero conciso. Cada sección debe ser completa pero no redundante

7. **Referencias cruzadas**: Cuando menciones algo explicado en otra sección, haz referencia: "Ver Sección 4.2"

8. **Capturas**: Para cada captura, describe:
   - Qué muestra la imagen
   - Elementos clave señalados
   - Acción que representa

9. **Validaciones**: Para cada formulario, lista todas las validaciones y formatos requeridos

10. **Ejemplos reales**: Usa datos de ejemplo realistas pero ficticios

GENERA EL MANUAL COMPLETO EN MARKDOWN AHORA.
```  

---

## 🔄 Cómo Usar Este Prompt

1. **Copia** todo el prompt anterior
2. **Reemplaza** `[INSERTAR_ROL_AQUÍ]` con: `Admin`, `Tesorero`, `Seminarista` o `Externo`
3. **Actualiza** la sección de permisos según el rol elegido
4. **Adjunta** tus capturas de pantalla a Google AI Studio
5. **Pega** el prompt y genera el manual
6. **Revisa y edita** el resultado antes de guardarlo

## 📸 Tips para las Capturas

- Numera secuencialmente: `01-login.png`, `02-dashboard.png`, etc.
- Captura en resolución 1920x1080 o similar
- Incluye el flujo completo de cada funcionalidad
- Marca elementos importantes con anotaciones si es necesario
- Usa nombres descriptivos para las capturas

---