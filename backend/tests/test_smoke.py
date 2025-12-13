from playwright.sync_api import Page
from conftest import BASE_URL
import pytest

def test_login_page_loads_and_take_screenshot(page: Page):
    """
    Esta es una prueba de diagnóstico.
    Navega a la página de login y toma una captura de pantalla para
    verificar visualmente si la página se está cargando correctamente.
    """
    try:
        # Aumentar el timeout de la navegación por si la red es lenta
        page.goto(f"{BASE_URL}/login", timeout=60000)
        page.screenshot(path="screenshots/diagnostic_login_page.png", full_page=True)
        print("\n📸 Captura de diagnóstico guardada en 'e2e_tests/screenshots/diagnostic_login_page.png'")
    except Exception as e:
        page.screenshot(path="e2e_tests/screenshots/diagnostic_error_page.png", full_page=True)
        pytest.fail(f"No se pudo navegar a la página de login. ¿Está la aplicación corriendo y accesible en {BASE_URL}? Error: {e}")
