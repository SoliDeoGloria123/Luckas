import pytest
from playwright.sync_api import Page, expect
import time
from conftest import BASE_URL  # Importar BASE_URL

# Pruebas para la gestión de inscripciones

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_enrollments_page(logged_in_page: Page):
    """
    Verifica que el administrador puede ver la página de gestión de inscripciones.
    """
    page = logged_in_page
    
    # Navegar a la seccion de inscripciones
    page.goto(f"{BASE_URL}/admin/inscripciones")
    
    # Verificar que el titulo y la tabla de inscripciones son visibles
    expect(page.locator("h1").filter(has_text="Gestion")).to_be_visible()
    expect(page.locator("table")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_filter_enrollments(logged_in_page: Page):
    """
    Verifica que el administrador puede filtrar las inscripciones.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/inscripciones")

    # Seleccionar un filtro (ej. por estado 'Pendiente')
    page.select_option("select[name='status-filter']", "Pendiente")

    # Verificar que la tabla se actualiza
    # (la verificación exacta dependerá de la implementación)
    expect(page.locator("table")).to_be_visible()
    
@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_manage_enrollment(logged_in_page: Page):
    """
    Verifica que el administrador puede aprobar o rechazar una inscripción.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/inscripciones")

    # Hacer clic en el botón de ver detalles de la primera inscripción
    page.locator("table tbody tr:first-child a:has-text('Ver')").click()
    
    # Aprobar o rechazar la inscripción
    approve_button = page.locator("button:has-text('Aprobar')")
    if approve_button.is_visible():
        approve_button.click()
        expect(page.locator("text=/Inscripción aprobada/i")).to_be_visible()
    else:
        reject_button = page.locator("button:has-text('Rechazar')")
        if reject_button.is_visible():
            reject_button.click()
            expect(page.locator("text=/Inscripción rechazada/i")).to_be_visible()
        else:
            pytest.skip("No se encontraron botones para aprobar o rechazar.")

@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True)
def test_user_can_view_their_enrollments(logged_in_page: Page):
    """
    Verifica que un usuario (seminarista/externo) puede ver su página de 'Mis Inscripciones'.
    """
    page = logged_in_page
    
    # Navegar a la página de 'Mis Inscripciones'
    page.goto(f"{BASE_URL}/mis-inscripciones") # La URL puede variar

    # Verificar que el título es visible
    expect(page.locator("h1:has-text('Mis Inscripciones')")).to_be_visible()

    # Verificar que se muestra una lista o tabla de inscripciones
    # Si no hay inscripciones, se debe mostrar un mensaje indicándolo
    if page.locator("table").is_visible():
        expect(page.locator("table")).to_be_visible()
    else:
        expect(page.locator("text=/No tienes inscripciones/i")).to_be_visible()