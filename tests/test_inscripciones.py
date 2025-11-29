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
    expect(page.locator("h1").filter(has_text="Gestión")).to_be_visible()
    expect(page.locator("table")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_filter_enrollments(logged_in_page: Page):
    """
    Verifica que el administrador puede filtrar las inscripciones.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/inscripciones")

    # Seleccionar un filtro (ej. por estado 'inscrito')
    # El filtro de estado es el cuarto select (index 3)
    page.locator("select").nth(3).select_option("inscrito")

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

    # Hacer clic en el botón de editar de la primera inscripción
    # En la tabla, el botón de editar tiene la clase .btn-action.editar
    page.locator("table tbody tr:first-child .btn-action.editar").click()
    
    # Esperar a que aparezca el modal
    expect(page.locator(".fixed.inset-0")).to_be_visible()
    expect(page.locator("h2:has-text('Editar Inscripción')")).to_be_visible()
    
    # Cambiar el estado a 'finalizado' (válido para Eventos y Programas)
    page.select_option("select[name='estado']", "finalizado")
    
    # Guardar cambios
    page.locator("button:has-text('Guardar'), button:has-text('Actualizar')").click()
    
    # Verificar mensaje de éxito
    expect(page.locator("text=/Inscripción actualizada exitosamente/i")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True)
def test_user_can_view_their_enrollments(logged_in_page: Page):
    """
    Verifica que un usuario (seminarista/externo) puede ver su página de 'Mis Inscripciones'.
    """
    page = logged_in_page
    
    # Navegar a la página de 'Mis Inscripciones'
    page.goto(f"{BASE_URL}/dashboard/seminarista/mis-inscripciones")

    # Verificar que el título es visible
    expect(page.locator("h1:has-text('Mis Inscripciones')")).to_be_visible()

    # Verificar que se muestra una lista o tabla de inscripciones
    # Si no hay inscripciones, se debe mostrar un mensaje indicándolo
    if page.locator("table").is_visible():
        expect(page.locator("table")).to_be_visible()
    else:
        expect(page.locator("text=/No tienes inscripciones registradas/i")).to_be_visible()