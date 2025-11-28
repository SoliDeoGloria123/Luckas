# Tests E2E - Proyecto Luckas

## Descripción

Este directorio contiene tests end-to-end (E2E) para el proyecto Luckas usando Playwright con pytest. Los tests están organizados para validar las funcionalidades de los 4 roles de usuario del sistema.

## Estructura del Proyecto

### Roles de Usuario
- **admin**: Acceso completo a todas las funcionalidades administrativas
- **tesorero**: Acceso a funcionalidades financieras y de reportes
- **seminarista**: Acceso a funcionalidades estudiantiles (eventos, cabañas, cursos)  
- **externo**: Acceso público limitado (vista de eventos, cabañas, cursos públicos)

### Rutas por Rol
- **Admin**: `/admin/*` (Dashboard, usuarios, eventos, cabañas, etc.)
- **Tesorero**: `/tesorero/*` (Dashboard, reportes, reservas, etc.)
- **Seminarista**: `/seminarista/*` y `/dashboard/seminarista/*`
- **Externo**: `/external` (Dashboard público)

## Archivos de Test

### Tests Principales
- `test_auth.py` - Tests de autenticación y login
- `test_all_roles.py` - Tests master para verificar funcionalidades básicas de todos los roles
- `test_usuarios.py` - Gestión de usuarios (principalmente admin)
- `test_tesorero.py` - Funcionalidades específicas del tesorero
- `test_seminarista.py` - Funcionalidades específicas del seminarista
- `test_externo.py` - Funcionalidades específicas del usuario externo

### Tests Funcionales
- `test_eventos.py` - Gestión de eventos para múltiples roles
- `test_cabanas.py` - Gestión de cabañas y reservas
- `test_programas.py` - Programas académicos
- `test_reservas.py` - Sistema de reservas

### Configuración
- `conftest.py` - Fixtures y configuración global de pytest
- `run_all_tests.sh` - Script para ejecutar todos los tests

## Configuración

### Variables de Entorno
```bash
BASE_URL = "https://luckas.zapto.org"  # URL del ambiente de pruebas
```

### Usuarios de Prueba
Los tests usan estos usuarios predefinidos (deben existir en la BD):
```
admin3@luckas.com / admin123
tesorero3@luckas.com / tesorero123  
seminarista3@luckas.com / seminarista123
externa3@luckas.com / externa123
```

## Ejecución

### Ejecutar Todos los Tests
```bash
# Opción 1: Script automatizado
./run_all_tests.sh

# Opción 2: Pytest directo
pytest -v
```

### Ejecutar Tests Específicos
```bash
# Por archivo
pytest test_auth.py -v
pytest test_usuarios.py -v

# Por función específica
pytest test_auth.py::test_login_page_has_all_elements -v

# Por rol específico (usando marcas)
pytest -k "admin" -v
pytest -k "tesorero" -v
```

### Ejecutar con Más Detalle
```bash
# Modo verbose con salida completa
pytest test_cabanas.py -vvs

# Solo mostrar fallos
pytest test_usuarios.py --tb=short

# Con captura de pantalla automática en fallos
pytest test_eventos.py -v --capture=no
```

## Características Técnicas

### Fixtures Principales
- `logged_in_page`: Proporciona página con sesión iniciada para rol específico
- `users`: Credenciales y configuración de todos los roles
- `page`: Página base de Playwright

### Selectores Robustos
Los tests usan selectores resistentes a cambios:
```python
# Preferidos
page.get_by_role("heading", name="Gestión de Usuarios")
page.get_by_label("Nombre")
page.locator("button:has-text('Guardar')")

# Alternativos
page.locator(".glass-card, table, .user-card")  # Múltiples opciones
```

### Manejo de Errores
- Screenshots automáticos en fallos
- Timeouts configurables
- Reintentos en operaciones críticas
- Manejo de elementos dinámicos

## Debugging

### Screenshots
Las capturas se guardan automáticamente en fallos:
```bash
ls -la screenshots/
```

### Logs Detallados
```bash
# Ver logs de login
pytest test_auth.py -vvs

# Debug específico
pytest test_cabanas.py::test_admin_can_create_new_cabin -vvs
```

### Modo Interactivo
```bash
# Ejecutar en modo headed (ver navegador)
pytest test_usuarios.py -v --headed

# Pausa en fallos
pytest test_eventos.py -v --pdb
```

## Mejores Prácticas

### Estructura de Test
```python
@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_function(logged_in_page: Page):
    page = logged_in_page
    
    # 1. Navegar
    page.goto(f"{BASE_URL}/admin/usuarios", wait_until="networkidle")
    
    # 2. Verificar página cargó
    expect(page.get_by_role("heading", name="Gestión")).to_be_visible()
    
    # 3. Interactuar
    page.locator("button:has-text('Nuevo')").click()
    
    # 4. Validar resultado
    expect(page.locator("text=/Creado exitosamente/")).to_be_visible()
```

### Selectores Recomendados
1. `get_by_role()` - Para elementos semánticos
2. `get_by_label()` - Para inputs de formulario  
3. `locator("button:has-text()")` - Para botones con texto
4. `.glass-card, .alternative` - Múltiples opciones como fallback

### Waits y Timeouts
```python
# Esperar navegación completa
page.goto(url, wait_until="networkidle")

# Esperar elemento específico
page.wait_for_selector('.glass-card', timeout=15000)

# Verificación con timeout
expect(element).to_be_visible(timeout=10000)
```

## Solución de Problemas

### Errores Comunes

1. **Login falló**: Verificar que usuarios de prueba existen en BD
2. **Elemento no encontrado**: Verificar que selector coincide con frontend actual
3. **Timeout**: Aumentar timeouts o verificar carga de página
4. **Redirección inesperada**: Verificar roles y permisos en backend

### Verificación Rápida
```bash
# Test básico de conectividad  
curl https://luckas.zapto.org/login

# Verificar que usuarios existen
pytest test_all_roles.py::test_fixture_creates_all_users -v

# Test mínimo de login
pytest test_auth.py::test_login_page_has_all_elements -v
```

## Contribución

### Agregar Nuevo Test
1. Crear archivo `test_[modulo].py`
2. Importar fixtures necesarias
3. Usar decorator `@pytest.mark.parametrize` para roles
4. Seguir patrón: navegar → verificar → interactuar → validar

### Actualizar Test Existente
1. Verificar selectores en frontend actual
2. Probar en todos los roles relevantes
3. Agregar screenshots de debugging si es necesario
4. Actualizar documentación si cambia comportamiento

## Estado Actual

✅ **Completados**:
- Tests básicos de autenticación para 4 roles
- Tests de navegación y permisos por rol
- Tests funcionales principales (usuarios, eventos, cabañas, programas, reservas)
- Fixtures robustos con manejo de errores
- Scripts de ejecución automatizada

🔄 **En progreso**:
- Optimización de selectores según evolución del frontend
- Tests de performance y carga
- Integración con CI/CD

🎯 **Próximos pasos**:
- Tests de API complementarios
- Tests de integración con base de datos
- Monitoreo continuo