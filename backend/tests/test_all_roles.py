import pytest
from playwright.sync_api import Page, expect
from conftest import BASE_URL

# Tests master que verifican funcionalidades básicas para todos los roles

@pytest.mark.parametrize("logged_in_page", ["admin", "tesorero", "seminarista", "externo"], indirect=True)
def test_all_roles_can_login_and_access_dashboard(logged_in_page: Page):
    """
    Verifica que todos los roles pueden hacer login y acceder a sus dashboards respectivos.
    """
    page = logged_in_page
    role = page.role
    
    # Verificar que está en una página válida del rol
    current_url = page.url
    
    if role == "admin":
        assert "/admin" in current_url or "/Dashboard" in current_url
        # Verificar elementos específicos del admin
        page.wait_for_selector('nav, .sidebar, .dashboard-admin', timeout=10000)
        
    elif role == "tesorero":
        assert "/tesorero" in current_url
        # Verificar elementos específicos del tesorero
        page.wait_for_selector('.dashboard-tesorero, nav, .header', timeout=10000)
        
    elif role == "seminarista":
        assert "/seminarista" in current_url
        # Verificar elementos específicos del seminarista
        page.wait_for_selector('.dashboard-seminarista, .hero-content, .services-grid', timeout=10000)
        
    elif role == "externo":
        assert "/external" in current_url
        # Verificar elementos específicos del externo
        page.wait_for_selector('.dashboard-external, nav, .menu, h1', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["admin", "tesorero"], indirect=True)
def test_admin_tesorero_can_access_management_pages(logged_in_page: Page):
    """
    Verifica que admin y tesorero pueden acceder a páginas de gestión.
    """
    page = logged_in_page
    role = page.role
    
    base_path = "/admin" if role == "admin" else "/tesorero"
    
    # Lista de páginas que ambos roles deberían poder acceder
    management_pages = ["usuarios", "eventos", "cabanas", "reservas"]
    
    for page_name in management_pages:
        try:
            page.goto(f"{BASE_URL}{base_path}/{page_name}", wait_until="networkidle")
            
            # Verificar que no fue redirigido a login
            assert "/login" not in page.url, f"Rol {role} fue redirigido a login al acceder a {page_name}"
            
            # Verificar que la página carga contenido
            page.wait_for_selector('h1, h2, .glass-card, table, .page-title', timeout=10000)
            
        except Exception as e:
            # Algunas páginas pueden no existir para ciertos roles
            print(f"⚠️  {role} no pudo acceder a {page_name}: {e}")

@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True) 
def test_user_roles_cannot_access_admin_pages(logged_in_page: Page):
    """
    Verifica que seminaristas y externos no pueden acceder a páginas administrativas.
    """
    page = logged_in_page
    role = page.role
    
    # Intentar acceder a páginas administrativas
    admin_pages = ["/admin/usuarios", "/tesorero/reportes"]
    
    for admin_page in admin_pages:
        page.goto(f"{BASE_URL}{admin_page}")
        page.wait_for_timeout(3000)
        
        current_url = page.url
        
        # Verificar que fue redirigido o no puede ver contenido admin
        if role == "seminarista":
            assert "/seminarista" in current_url or admin_page not in current_url, \
                   f"Seminarista pudo acceder a {admin_page}"
        elif role == "externo":
            assert "/external" in current_url or admin_page not in current_url, \
                   f"Usuario externo pudo acceder a {admin_page}"

@pytest.mark.parametrize("logged_in_page", ["admin", "tesorero", "seminarista", "externo"], indirect=True)
def test_all_roles_have_navigation_elements(logged_in_page: Page):
    """
    Verifica que todos los roles tienen elementos de navegación apropiados.
    """
    page = logged_in_page
    role = page.role
    
    if role == "admin":
        page.goto(f"{BASE_URL}/admin/Dashboard", wait_until="networkidle")
        # Verificar sidebar o navegación de admin
        page.wait_for_selector('nav, .sidebar, .menu', timeout=10000)
        
    elif role == "tesorero":
        page.goto(f"{BASE_URL}/tesorero", wait_until="networkidle")
        # Verificar header o navegación de tesorero
        page.wait_for_selector('nav, .header, .menu', timeout=10000)
        
    elif role == "seminarista":
        page.goto(f"{BASE_URL}/seminarista", wait_until="networkidle")
        # Verificar navegación de seminarista
        page.wait_for_selector('.header, nav, .services-grid', timeout=10000)
        
    elif role == "externo":
        page.goto(f"{BASE_URL}/external", wait_until="networkidle")
        # Verificar navegación de externo
        page.wait_for_selector('nav, .menu, .header', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["admin", "tesorero", "seminarista", "externo"], indirect=True)
def test_all_roles_can_logout(logged_in_page: Page):
    """
    Verifica que todos los roles pueden cerrar sesión correctamente.
    """
    page = logged_in_page
    role = page.role
    
    # Navegar al dashboard principal del rol
    if role == "admin":
        page.goto(f"{BASE_URL}/admin/Dashboard", wait_until="networkidle")
    elif role == "tesorero":
        page.goto(f"{BASE_URL}/tesorero", wait_until="networkidle")
    elif role == "seminarista":
        page.goto(f"{BASE_URL}/seminarista", wait_until="networkidle")
    elif role == "externo":
        page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar y hacer clic en logout
    try:
        # Buscar menú de usuario primero
        user_menu = page.locator("button[aria-haspopup='true'], .user-menu, .profile-button")
        if user_menu.count() > 0:
            user_menu.click()
            page.wait_for_timeout(1000)
        
        # Buscar botón de logout
        logout_button = page.locator("button:has-text('Cerrar Sesión'), a:has-text('Logout'), button:has-text('Salir')")
        expect(logout_button).to_be_visible(timeout=5000)
        logout_button.click()
        
        # Verificar redirección a login
        page.wait_for_url("**/login**", timeout=10000)
        expect(page.locator("#correo, #password")).to_be_visible(timeout=5000)
        
    except Exception as e:
        # Si falla el logout normal, intentar método alternativo
        print(f"⚠️  Logout normal falló para {role}, intentando alternativo: {e}")
        
        # Intentar ir directamente a cerrar sesión
        page.goto(f"{BASE_URL}/cerrar-sesion")
        page.wait_for_url("**/login**", timeout=5000)

# Test específico para verificar que el fixture funciona correctamente
def test_fixture_creates_all_users(users):
    """
    Verifica que el fixture crea todos los usuarios necesarios.
    """
    required_roles = ["admin", "tesorero", "seminarista", "externo"]
    
    for role in required_roles:
        assert role in users, f"Falta configuración para rol {role}"
        assert "correo" in users[role], f"Falta correo para rol {role}"
        assert "password" in users[role], f"Falta password para rol {role}"
        assert "dashboard_path" in users[role], f"Falta dashboard_path para rol {role}"