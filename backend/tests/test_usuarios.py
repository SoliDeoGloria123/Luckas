import pytest
from playwright.sync_api import Page, expect
import time
from conftest import BASE_URL  # Importar BASE_URL

# Pruebas para la gestión de usuarios
# TODO: Migrar la lógica de `e2e_test_completo.py.deprecated`

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_users_page(logged_in_page: Page):
    """
    Verifica que el administrador puede ver la página de gestión de usuarios.
    """
    page = logged_in_page
    
    # Navegar a la seccion de usuarios
    page.goto(f"{BASE_URL}/admin/usuarios", wait_until="networkidle")
    
    # Verificar que el heading principal es visible (basado en GestionUsuario.jsx)
    expect(page.get_by_role("heading", name="Gestión de Usuarios")).to_be_visible(timeout=15000)
    
    # Verificar que la tabla de usuarios o contenedor principal está presente
    # El componente usa .glass-card para las tarjetas de usuario
    page.wait_for_selector('.glass-card, table, .tabla-usuarios', timeout=15000)
    
    # Verificar que hay contenido de usuarios o botón para crear
    expect(page.locator("button:has-text('Nuevo Usuario'), .glass-card, table tbody tr")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True)
def test_non_admin_cannot_view_users_page(logged_in_page: Page):
    """
    Verifica que los usuarios no administradores no pueden acceder a la página de gestión de usuarios.
    """
    page = logged_in_page
    role = page.role
    
    # Intentar navegar a la sección de usuarios
    page.goto(f"{BASE_URL}/admin/usuarios")
    
    # Dar tiempo para redirección si la hay
    page.wait_for_timeout(3000)
    
    # Verificar que se redirigió o muestra error
    current_url = page.url
    
    # Verificar redirección según el rol (basado en GestionUsuario.jsx)
    if role == "seminarista":
        assert "/seminarista" in current_url or "/admin/usuarios" not in current_url
    elif role == "externo":
        assert "/external" in current_url or "/admin/usuarios" not in current_url
    
    # Si aún está en la página, verificar que no puede ver el contenido admin
    if "/admin/usuarios" in current_url:
        # No debe poder ver el heading de gestión
        admin_heading_visible = page.locator("h1:has-text('Gestión de Usuarios')").is_visible()
        assert not admin_heading_visible, f"Usuario {role} puede ver contenido admin cuando no debería"

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_create_new_user(logged_in_page: Page):
    """
    Verifica que el administrador puede crear un nuevo usuario.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/usuarios", wait_until="networkidle")

    # Hacer clic en el botón de nuevo usuario
    new_user_button = page.locator("button:has-text('Nuevo Usuario'), button:has-text('Agregar Usuario'), button[title='Nuevo Usuario']")
    expect(new_user_button).to_be_visible(timeout=10000)
    new_user_button.click()

    # Esperar que el modal/formulario sea visible
    expect(page.locator(".modal, .fixed.inset-0, form")).to_be_visible(timeout=10000)

    # Rellenar el formulario con selectores mejorados
    timestamp = int(time.time())
    new_email = f"usuario_test_{timestamp}@luckas.com"
    
    page.get_by_label("Nombre").fill("Usuario")
    page.get_by_label("Apellido").fill("Test")
    page.get_by_label("Correo").fill(new_email)
    page.get_by_label("Teléfono").fill(f"310{timestamp % 10000000}")
    
    # Seleccionar tipo de documento
    page.locator("select[name='tipoDocumento'], select:has-option[value*='Cédula']").select_option("Cédula de ciudadanía")
    page.get_by_label("Número de Documento").fill(f"1098{timestamp % 100000}")
    page.get_by_label("Contraseña").fill("Password123!")
    
    # Seleccionar rol
    page.locator("select[name='role'], select[name='rol']").select_option("externo")

    # Guardar usuario
    save_button = page.locator("button:has-text('Guardar'), button:has-text('Crear'), button:has-text('Agregar')")
    save_button.click()

    # Verificar mensaje de éxito (puede variar el texto)
    expect(page.locator("text=/Usuario creado/i, text=/Éxito/i, .Toastify__toast--success")).to_be_visible(timeout=15000)

    # Cerrar modal si aún está abierto
    try:
        page.locator("button:has-text('Cerrar'), .modal button[title='Cerrar'], button:has([data-testid='close'])").click(timeout=3000)
    except:
        pass

    # Verificar que el nuevo usuario aparece en la lista
    page.wait_for_timeout(1000)
    expect(page.locator(f"text={new_email}")).to_be_visible(timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_edit_user(logged_in_page: Page):
    """
    Verifica que el administrador puede editar un usuario existente.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/usuarios", wait_until="networkidle")

    # Esperar a que carguen los usuarios
    page.wait_for_selector('.glass-card, table tbody tr, .user-card', timeout=15000)

    # Hacer clic en el botón de editar del primer usuario
    edit_button = page.locator("button[title='Editar'], button:has-text('Editar'), .btn-editar").first
    expect(edit_button).to_be_visible(timeout=10000)
    edit_button.click()

    # Esperar modal de edición
    expect(page.locator(".modal, .fixed.inset-0, form")).to_be_visible(timeout=10000)

    # Modificar el teléfono
    new_phone = f"300{int(time.time()) % 10000000}"
    phone_input = page.get_by_label("Teléfono")
    phone_input.clear()
    phone_input.fill(new_phone)

    # Guardar cambios
    save_button = page.locator("button:has-text('Guardar'), button:has-text('Actualizar'), button:has-text('Modificar')")
    save_button.click()

    # Verificar mensaje de éxito
    expect(page.locator("text=/Usuario actualizado/i, text=/actualizado exitosamente/i, .Toastify__toast--success")).to_be_visible(timeout=15000)

    # Cerrar modal si está abierto
    try:
        page.locator("button:has-text('Cerrar'), .modal button[title='Cerrar']").click(timeout=3000)
    except:
        pass

    # Verificar que el teléfono se actualizó
    page.wait_for_timeout(1000)
    expect(page.locator(f"text={new_phone}")).to_be_visible(timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_filter_users(logged_in_page: Page):
    """
    Verifica que el administrador puede filtrar usuarios por rol.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/usuarios")

    # Seleccionar el filtro por rol "admin"
    page.select_option("select[name='role-filter']", "admin")

    # Verificar que solo se muestran los usuarios con el rol "admin"
    # Esto puede variar dependiendo de la implementación
    # Por ejemplo, podemos verificar que no hay usuarios con otros roles
    expect(page.locator("text=seminarista")).not_to_be_visible()
    expect(page.locator("text=tesorero")).not_to_be_visible()
    expect(page.locator("text=externo")).not_to_be_visible()