import pytest
import os
import re
from playwright.sync_api import sync_playwright, Page, expect, Browser, BrowserContext
from datetime import datetime
import sys

# ========== CONFIGURACIÓN GLOBAL ==========
BASE_URL = "https://luckas.zapto.org"  # Local development
SCREENSHOT_DIR = "screenshots"
TIMEOUT_DEFAULT = 10000  # 10 segundos por defecto
LOGIN_WAIT_URL_TIMEOUT = 10000  # 10s para esperar redirección tras login
LOGIN_WAIT_UI_TIMEOUT = 10000   # 10s para esperar elementos UI que confirmen sesión

# ========== MODO HEADLESS (VISUAL) ==========
# Cambia HEADLESS = False para ver el navegador durante las pruebas
HEADLESS = False  # True = sin interfaz gráfica, False = con interfaz gráfica
SLOW_MO = 1000   # Ralentiza 1 segundo entre acciones (útil para ver lo que pasa)

# Crear carpetas para resultados si no existen
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

# ========== FIXTURE PLAYWRIGHT BROWSER ==========
@pytest.fixture(scope="session")
def browser():
    """Crea el contexto del navegador para toda la sesión."""
    playwright = sync_playwright().start()
    browser = playwright.firefox.launch(
        headless=HEADLESS,  # False para ver el navegador
        slow_mo=SLOW_MO,    # Ralentiza acciones para ver en tiempo real
        args=["--start-maximized"]  # Maximizar ventana
    )
    yield browser
    browser.close()
    playwright.stop()

@pytest.fixture
def context(browser):
    """Crea un nuevo contexto del navegador para cada test."""
    context = browser.new_context()
    yield context
    context.close()

@pytest.fixture
def page(context):
    """Crea una nueva página para cada test."""
    page = context.new_page()
    page.set_default_timeout(TIMEOUT_DEFAULT)
    yield page
    page.close()

# ========== FIXTURES DE DATOS ==========

@pytest.fixture(scope="session")
def users():
    """
    Proporciona las credenciales de prueba para cada rol.
    
    NOTA: Asegúrate de que estos usuarios existan en tu BD.
    Si están en desarrollo local, usa:
    - admin3@luckas.com / admin123
    - tesorero3@luckas.com / tesorero123
    - seminarista3@luckas.com / seminarista123
    - externa3@luckas.com / externa123
    """
    return {
        "admin": {
            "correo": "admin3@luckas.com",
            "password": "admin123",
            "expected_role": "admin",
            "dashboard_path": "/admin/Dashboard"
        },
        "tesorero": {
            "correo": "tesorero3@luckas.com",
            "password": "tesorero123",
            "expected_role": "tesorero",
            "dashboard_path": "/tesorero"
        },
        "seminarista": {
            "correo": "seminarista3@luckas.com",
            "password": "seminarista123",
            "expected_role": "seminarista",
            "dashboard_path": "/seminarista"
        },
        "externo": {
            "correo": "externa3@luckas.com",
            "password": "externa123",
            "expected_role": "externo",
            "dashboard_path": "/external"
        },
    }

# ========== HELPERS Y UTILIDADES ==========

def take_screenshot_on_failure(page: Page, test_name: str):
    """
    Toma una captura de pantalla si la prueba falla.
    Se ejecuta automáticamente mediante el hook pytest_runtest_makereport.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    clean_test_name = "".join(c if c.isalnum() else "_" for c in test_name)
    screenshot_path = f"{SCREENSHOT_DIR}/{clean_test_name}_{timestamp}.png"
    try:
        page.screenshot(path=screenshot_path, full_page=True)
        print(f"Screenshot guardado: {screenshot_path}")
    except Exception as e:
        print(f"Error al tomar screenshot: {e}")

def wait_for_element(page: Page, selector: str, timeout: int = TIMEOUT_DEFAULT, description: str = ""):
    """
    Espera a que un elemento sea visible con manejo de errores.
    
    Args:
        page: Objeto Page de Playwright
        selector: Selector CSS del elemento
        timeout: Timeout en ms
        description: Descripción para logs
    
    Returns:
        True si el elemento está visible, False si timeout
    """
    try:
        expect(page.locator(selector)).to_be_visible(timeout=timeout)
        if description:
            print(f"[OK] Encontrado: {description}")
        return True
    except Exception:
        if description:
            print(f"[ERROR] No encontrado: {description}")
        return False

def verify_dashboard_loaded(page: Page, dashboard_path: str):
    """
    Verifica que el dashboard se haya cargado correctamente.
    Intenta múltiples estrategias: URL, UI, y detecta errores.
    """
    if _check_url_redirect(page, dashboard_path):
        return True
    
    if _check_dashboard_ui(page):
        return True
    
    print("   [ERROR] No se detectaron indicadores de dashboard cargado")
    print(f"   URL actual: {page.url}")
    return False

def _check_url_redirect(page: Page, dashboard_path: str):
    """Verifica si la URL cambió al dashboard."""
    try:
        page.wait_for_url(f"**{dashboard_path}**", timeout=LOGIN_WAIT_URL_TIMEOUT)
        print("   [OK] Redireccion exitosa (URL)")
        return True
    except Exception:
        print("   [WARN] URL change timed out, verificando UI del dashboard...")
        return False

def _check_dashboard_ui(page: Page):
    """Verifica si los elementos UI del dashboard están presentes."""
    try:
        page.wait_for_load_state("networkidle", timeout=LOGIN_WAIT_UI_TIMEOUT)
        
        logout_selector = "button:has-text('Cerrar Sesión')"
        user_menu_selector = "button[aria-haspopup='true']"
        dashboard_heading = "text=Gestión de"
        
        if (wait_for_element(page, logout_selector, timeout=3000) or 
            wait_for_element(page, user_menu_selector, timeout=3000) or 
            wait_for_element(page, dashboard_heading, timeout=3000)):
            print("   [OK] Dashboard cargado (UI detectada)")
            return True
        
        return False
    except Exception as redirect_error:
        print(f"   [ERROR] Error verificando UI: {redirect_error}")
        print(f"   URL actual: {page.url}")
        return False

# ========== HOOKS DE PYTEST ==========

@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    """
    Hook para capturar fallos de tests y tomar screenshots.
    Se ejecuta después de cada fase de la prueba.
    """
    outcome = yield
    rep = outcome.get_result()
    setattr(item, "rep_" + rep.when, rep)
    
    # Si la prueba falló, tomar screenshot
    if rep.failed and hasattr(item, 'funcargs') and 'page' in item.funcargs:
        page = item.funcargs['page']
        take_screenshot_on_failure(page, item.name)

# ========== FIXTURES PRINCIPALES ==========

#@pytest.fixture
#def page(page: Page, request: pytest.FixtureRequest):
#    """
#    Fixture base de página con manejo de fallos.
#    Se ejecuta para cada test.
#    """
#    yield page
#    # Cleanup después de cada test
#    try:
#        # Limpiar localStorage para pruebas posteriores
#        page.evaluate("localStorage.clear()")
#    except:
#        pass

@pytest.fixture
def logged_in_page(page: Page, users, request):
    """
    ✨ FIXTURE PRINCIPAL PARA TESTS CON SESIÓN ✨
    
    Proporciona una página con sesión iniciada para un rol específico.
    
    Uso:
    ------
    @pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
    def test_algo(logged_in_page: Page):
        page = logged_in_page
        assert page.role == "admin"
    
    También soporta parametrización múltiple:
    @pytest.mark.parametrize("logged_in_page", ["admin", "tesorero"], indirect=True)
    def test_algo(logged_in_page: Page):
        # Se ejecutará 2 veces
    """
    
    role = request.param
    user = users[role]
    
    print(f"\n[KEY] Iniciando sesion como: {role}")
    
    # Navegar a login
    page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    
    # Obtener campos del formulario
    email_field = page.locator("[id='correo']")
    password_field = page.locator("[id='password']")
    login_button = page.locator("button:has-text('Iniciar Sesión')")
    
    try:
        expect(email_field).to_be_visible(timeout=TIMEOUT_DEFAULT)
        expect(password_field).to_be_visible(timeout=TIMEOUT_DEFAULT)
        expect(login_button).to_be_visible(timeout=TIMEOUT_DEFAULT)
    except Exception as login_error:
        print(f"[ERROR] No se encontraron los campos de login: {login_error}")
        raise
    
    # Rellenar y enviar formulario
    email_field.fill(user["correo"])
    password_field.fill(user["password"])
    
    print(f"   Correo: {user['correo']}")
    print(f"   Contrasena: {'*' * len(user['password'])}")
    
    login_button.click()
    
    # Verificar que el dashboard se cargó
    print(f"   Esperando redireccion a {user['dashboard_path']}...")
    if not verify_dashboard_loaded(page, user['dashboard_path']):
        raise AssertionError("Dashboard no cargó correctamente tras login")
    
    # Adjuntar información al objeto page
    page.user = user
    page.role = role
    page.test_user_email = user["correo"]
    page.test_user_password = user["password"]
    
    print(f"[OK] Sesion iniciada exitosamente como {role}\n")
    
    yield page
    
    # CLEANUP: Cerrar sesión después (deshabilitado para no cerrar sesión al final del test)
    # logout_session(page, role)

def logout_session(page: Page, role: str):
    """
    Intenta cerrar sesión haciendo clic en el botón de logout.
    Maneja diferentes estructuras de menú por rol.
    """
    try:
        # Para seminarista: el botón está en .user-dropdown-header
        if role == "seminarista":
            user_menu_btn = page.locator(".user-profile-seminario")
            if user_menu_btn.count() > 0:
                user_menu_btn.click(timeout=3000)
                page.wait_for_timeout(800)
                
                # El botón está dentro de .user-dropdown-header
                logout_button = page.locator(".user-dropdown-header button:has-text('Cerrar Sesión')")
                if logout_button.count() > 0:
                    logout_button.click(timeout=3000)
                    page.wait_for_url("**/login**", timeout=TIMEOUT_DEFAULT)
                    print(f"[OK] Sesion cerrada para {role}")
                    return
        
        # Para otros roles: usar selector genérico
        menu_button = page.locator("button[aria-haspopup='true']").first
        if menu_button.count() > 0:
            menu_button.click(timeout=3000)
            page.wait_for_timeout(500)
            
            logout_button = page.locator("button:has-text('Cerrar Sesión')").last
            if logout_button.count() > 0:
                logout_button.click(timeout=3000)
                page.wait_for_url("**/login**", timeout=TIMEOUT_DEFAULT)
                print(f"[OK] Sesion cerrada para {role}")
                
    except Exception as logout_error:
        print(f"⚠️  No se pudo cerrar sesión automáticamente: {logout_error}")
        page.evaluate("localStorage.clear()")

# ========== FIXTURE PARAMETRIZADA PARA MÚLTIPLES ROLES ==========

@pytest.fixture(params=["admin", "tesorero", "seminarista", "externo"])
def logged_in_page_all_roles(logged_in_page: Page, request):
    """
    Versión parametrizada que proporciona una sesión para CADA rol.
    
    Uso:
    -----
    def test_algo(logged_in_page_all_roles: Page):
        # Esta prueba se ejecutará 4 veces, una para cada rol
        print(f"Probando con rol: {logged_in_page_all_roles.role}")
    """
    return logged_in_page