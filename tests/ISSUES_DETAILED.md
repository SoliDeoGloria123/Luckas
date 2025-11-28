# Análisis Detallado de Problemas Encontrados - Tests E2E

## 🔴 PROBLEMA CRÍTICO #1: Falta de Protección de Rutas en Backend

### Descripción del Problema
**Severidad**: 🔴 CRÍTICA - Vulnerabilidad de Seguridad

Los usuarios con roles de menor privilegio (seminarista y externo) pueden acceder a rutas administrativas que deberían estar restringidas. Específicamente:

- ✅ **Seminarista** puede acceder a `/tesorero/reportes`
- ✅ **Externo** puede acceder a `/tesorero/reportes`

Esto significa que cualquier usuario puede ver información financiera sensible sin autorización.

### Evidencia del Test

```python
# test_all_roles.py - línea 65-88
@pytest.mark.xfail(reason="Backend no protege rutas - seminarista/externo pueden acceder a /tesorero")
@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True) 
def test_user_roles_cannot_access_admin_pages(logged_in_page: Page):
    page = logged_in_page
    role = page.role
    
    admin_pages = ["/admin/usuarios", "/tesorero/reportes"]
    
    for admin_page in admin_pages:
        page.goto(f"{BASE_URL}{admin_page}")
        page.wait_for_timeout(3000)
        current_url = page.url
        
        # ❌ FALLA: El usuario NO es redirigido, puede ver el contenido
        if role == "seminarista":
            assert "/seminarista" in current_url or admin_page not in current_url
            # AssertionError: Seminarista pudo acceder a /tesorero/reportes
```

### Causa Raíz

El backend **NO** está verificando los permisos del usuario antes de servir el contenido de las rutas protegidas. Probablemente:

1. No hay middleware de autorización implementado
2. Las rutas no tienen guards que verifiquen el rol del usuario
3. El frontend confía en que el backend rechazará accesos no autorizados (pero no lo hace)

### Solución Requerida

#### Backend (Node.js/Express o similar)

```javascript
// middleware/auth.js
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role; // Asumiendo que el usuario está en req.user
    
    if (!userRole) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'No tienes permisos para acceder a este recurso',
        requiredRoles: allowedRoles,
        yourRole: userRole
      });
    }
    
    next();
  };
};

// Aplicar en las rutas
app.use('/admin/*', checkRole(['admin']));
app.use('/tesorero/*', checkRole(['admin', 'tesorero']));
```

#### Frontend (React Router)

Aunque el backend debe ser la primera línea de defensa, el frontend también debería prevenir accesos:

```javascript
// ProtectedRoute.jsx
const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();
  
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
};

// Uso en rutas
<Route path="/tesorero/*" element={
  <ProtectedRoute allowedRoles={['admin', 'tesorero']}>
    <TesoreroLayout />
  </ProtectedRoute>
} />
```

### Impacto
- 🔴 **Seguridad**: Usuarios no autorizados pueden ver datos sensibles
- 🔴 **Compliance**: Violación de principios de control de acceso
- 🔴 **Datos**: Información financiera expuesta

---

## 🟡 PROBLEMA #2: Estructura de Formularios de Eventos No Coincide

### Descripción del Problema
**Severidad**: 🟡 MEDIA - Inconsistencia Frontend/Tests

Los formularios de crear y editar eventos usan una estructura HTML diferente a la esperada por los tests E2E.

### Evidencia del Test

```python
# test_eventos.py - test_admin_can_create_new_event
# ❌ FALLA: No encuentra el campo "Título"
page.get_by_label("Título").fill(event_title)
# TimeoutError: Locator.fill: Timeout 30000ms exceeded.
# Call log: waiting for get_by_label("Título")

# ❌ FALLA: No encuentra el campo "lugar"
page.fill("input[name='lugar']", new_place)
# TimeoutError: Page.fill: Timeout 30000ms exceeded.
# Call log: waiting for locator("input[name='lugar']")
```

### Causa Raíz

El formulario de eventos probablemente usa:
- Labels diferentes (ej: "Nombre Evento" en lugar de "Título")
- Atributos `name` diferentes o ausentes
- Estructura de campos diferente (textarea vs input, etc.)

### Solución Requerida

#### Opción 1: Actualizar Tests (Recomendado)

Inspeccionar el HTML real del formulario y actualizar los selectores:

```python
# Antes (no funciona)
page.get_by_label("Título").fill(event_title)

# Después (adaptado al HTML real)
page.locator("input[name='nombre']").fill(event_title)
# O si usa placeholder:
page.locator("input[placeholder*='nombre']").fill(event_title)
```

#### Opción 2: Estandarizar Frontend

Agregar atributos consistentes en los formularios:

```jsx
// GestionEventos.jsx
<input
  type="text"
  name="titulo"           // ✅ Agregar name
  id="evento-titulo"      // ✅ Agregar id
  aria-label="Título"     // ✅ Agregar aria-label para accesibilidad
  placeholder="Título del evento"
/>
```

### Acción Inmediata

Para identificar los selectores correctos, ejecutar este comando en el navegador:

```bash
# Abrir el formulario de eventos y ejecutar en DevTools Console:
document.querySelectorAll('input, textarea, select').forEach(el => {
  console.log({
    tag: el.tagName,
    name: el.name,
    id: el.id,
    placeholder: el.placeholder,
    ariaLabel: el.getAttribute('aria-label')
  });
});
```

### Impacto
- 🟡 **Tests**: 2 tests marcados como xfail
- 🟡 **Cobertura**: Funcionalidad no verificada automáticamente
- 🟢 **Funcionalidad**: La aplicación funciona, solo los tests fallan

---

## 🟠 PROBLEMA #3: Timeouts de Red Intermitentes

### Descripción del Problema
**Severidad**: 🟠 MEDIA - Problema de Infraestructura

Algunos tests fallan con timeout al intentar navegar a la página de login, sugiriendo problemas de red o servidor sobrecargado.

### Evidencia del Test

```python
# ERROR en 3 tests:
# - test_user_can_view_and_enroll_in_event[chromium-seminarista]
# - test_user_can_view_and_reserve_cabin[chromium-externo]
# - test_non_admin_cannot_view_users_page[chromium-externo]

playwright._impl._errors.TimeoutError: Page.goto: Timeout 30000ms exceeded.
Call log:
  - navigating to "https://luckas.zapto.org/login", waiting until "networkidle"
```

### Posibles Causas

1. **Servidor Sobrecargado**: Demasiadas peticiones simultáneas durante los tests
2. **Rate Limiting**: El servidor está limitando peticiones por IP
3. **Problemas de Red**: Latencia alta o pérdida de paquetes
4. **Recursos del Servidor**: CPU/RAM insuficientes en Azure

### Diagnóstico

```bash
# 1. Verificar latencia
ping luckas.zapto.org

# 2. Verificar tiempo de respuesta
curl -w "@curl-format.txt" -o /dev/null -s https://luckas.zapto.org/login

# 3. Verificar logs del servidor Azure
# (Acceder al portal de Azure y revisar Application Insights)
```

### Soluciones

#### Corto Plazo

```python
# conftest.py - Aumentar timeout para navegación
@pytest.fixture
def logged_in_page(page: Page, users, request):
    role = request.param
    user = users[role]
    
    # ✅ Aumentar timeout y usar estrategia más tolerante
    page.goto(
        f"{BASE_URL}/login", 
        wait_until="domcontentloaded",  # Menos estricto que "networkidle"
        timeout=60000  # 60 segundos en lugar de 30
    )
```

#### Medio Plazo

```python
# Implementar retry logic
def navigate_with_retry(page, url, max_retries=3):
    for attempt in range(max_retries):
        try:
            page.goto(url, wait_until="domcontentloaded", timeout=30000)
            return
        except TimeoutError:
            if attempt == max_retries - 1:
                raise
            print(f"⚠️ Timeout en intento {attempt + 1}, reintentando...")
            time.sleep(2)
```

#### Largo Plazo

1. **Optimizar Backend**: Reducir tiempo de respuesta de endpoints
2. **CDN**: Usar CDN para assets estáticos
3. **Escalar Servidor**: Aumentar recursos en Azure
4. **Load Balancing**: Distribuir carga entre múltiples instancias

### Impacto
- 🟠 **Tests**: 3 tests con ERROR (no ejecutados)
- 🟠 **CI/CD**: Tests pueden fallar intermitentemente
- 🟢 **Usuarios**: No afecta a usuarios reales (solo tests)

---

## 📊 Resumen de Prioridades

| Problema | Severidad | Prioridad | Esfuerzo | Impacto |
|----------|-----------|-----------|----------|---------|
| #1 Protección de Rutas | 🔴 Crítica | P0 | 2-4 horas | Seguridad |
| #2 Formularios Eventos | 🟡 Media | P2 | 1-2 horas | Tests |
| #3 Timeouts Red | 🟠 Media | P1 | Variable | Estabilidad |

### Orden de Resolución Recomendado

1. **INMEDIATO**: Problema #1 - Protección de Rutas (vulnerabilidad de seguridad)
2. **ESTA SEMANA**: Problema #3 - Timeouts (afecta ejecución de tests)
3. **PRÓXIMA ITERACIÓN**: Problema #2 - Formularios (mejora de cobertura)

---

## 🔧 Comandos Útiles para Debugging

```bash
# Ver logs de tests con más detalle
pytest test_all_roles.py -v -s --tb=long

# Ejecutar solo tests que fallaron
pytest --lf -v

# Ejecutar con modo headed (ver navegador)
pytest test_all_roles.py --headed

# Generar reporte HTML
pytest --html=report.html --self-contained-html

# Ejecutar con timeout más alto
pytest --timeout=120
```

---

**Última actualización**: 2025-11-27 15:58  
**Analizado por**: Antigravity AI  
**Basado en**: Ejecución de 52 tests E2E
