# Luckas - Documentación técnica del Frontend para el Rol Externo

## 1. Descripción General
El dashboard externo de Luckas es una SPA (Single Page Application) desarrollada en React, diseñada para que usuarios externos puedan consultar, inscribirse y gestionar su participación en eventos, cursos y reservas de cabañas del Seminario Bautista de Colombia. Cumple con los requisitos y restricciones definidos en el IEEE830 y la SRS del proyecto.

## 2. Estructura de Componentes
La estructura principal se encuentra en `src/components/ExternalDashboard/` e incluye:
- **DashboardExternal.jsx**: Contenedor principal, orquesta la navegación y renderizado de módulos.
- **EventosList.jsx**: Visualiza eventos en tiempo real, permite inscripción y pago.
- **ProgramasList.jsx**: Muestra programas/cursos disponibles, permite inscripción y pago.
- **ReservasCabanas.jsx**: Consulta y reserva cabañas disponibles.
- **Certificados.jsx**: Descarga de certificados de participación.
- **UserProfile.jsx**: Consulta y actualización de datos personales.
- **InscripcionForm.jsx**: Formulario de inscripción a eventos/cursos.
- **PagoPSE.jsx**: Módulo para integración con pasarela de pagos (PayU/Stripe).
- **socket.js**: Conexión en tiempo real para actualizaciones instantáneas.
- **styles/base.css**: Estilos base, listos para mejoras visuales.

## 3. Relación con Requisitos IEEE830
Según la SRS y el extracto de requisitos comunes:

### Permisos del Rol Externo
- **Gestión de usuario**: Leer, Actualizar
- **Gestión de cabañas**: Leer, Actualizar
- **Gestión de eventos**: Leer, Actualizar
- **Gestión de cursos**: Leer, Actualizar

### Mapeo de Componentes a Requisitos
- **UserProfile.jsx**: Permite consultar y actualizar datos personales (RF02)
- **EventosList.jsx**: Consulta de eventos, inscripción, actualización de estado (RF03, RF07)
- **ProgramasList.jsx**: Consulta de cursos/programas, inscripción, actualización de estado (RF01, RF07)
- **ReservasCabanas.jsx**: Consulta y reserva de cabañas, actualización de reservas (RF04, RF08)
- **Certificados.jsx**: Descarga de certificados (RF06)
- **InscripcionForm.jsx**: Registro en eventos/cursos (RF07)
- **PagoPSE.jsx**: Pago de inscripciones/reservas (RF07, integración con requisitos de pagos)
- **socket.js**: Cumple con el requisito de actualizaciones en tiempo real y notificaciones (RNF01, RNF04)

## 4. Flujos de Usuario
- El usuario externo accede al dashboard, visualiza eventos, cursos y cabañas disponibles.
- Puede inscribirse en eventos/cursos y reservar cabañas mediante formularios dedicados.
- Los pagos se gestionan a través de la pasarela integrada.
- El usuario puede consultar y actualizar su perfil.
- Puede descargar certificados de participación.
- Todas las vistas se actualizan en tiempo real mediante sockets.

## 5. Cumplimiento de Requisitos No Funcionales
- **Desempeño**: SPA optimizada, actualizaciones en tiempo real.
- **Seguridad**: Acceso por roles, datos personales protegidos, integración con backend seguro.
- **Disponibilidad**: Compatible con dispositivos móviles y escritorio.
- **Portabilidad**: React, compatible con Linux, Windows y navegadores modernos.

## 6. Siguientes pasos
- Integrar datos reales desde la API REST y sockets.
- Documentar cada componente con ejemplos de uso y props.
- Añadir guías para contribuidores y desarrolladores.

---
Esta documentación cubre la estructura y el cumplimiento de requisitos para el frontend del rol externo. A continuación, se procederá con la integración de datos reales y la conexión con el backend.
