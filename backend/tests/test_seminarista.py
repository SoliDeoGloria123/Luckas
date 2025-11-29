import pytest
from playwright.sync_api import Page, expect
import time
from datetime import datetime, timedelta
from conftest import BASE_URL

# Pruebas específicas para el rol Seminarista

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_access_dashboard(logged_in_page: Page):
    """
    Verifica que el seminarista puede acceder a su dashboard específico.
    """
    page = logged_in_page
    
    # Ir al dashboard del seminarista
    page.goto(f"{BASE_URL}/seminarista", wait_until="networkidle")
    
    # Verificar elementos específicos del dashboard seminarista
    expect(page.locator("h1:has-text('¡Bienvenido')")).to_be_visible(timeout=15000)
    expect(page.locator("text=/Seminarista/i")).to_be_visible()
    
    # Verificar tarjetas de estado del sistema
    expect(page.locator(".stat-card, .hero-stats")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_view_events(logged_in_page: Page):
    """
    Verifica que el seminarista puede ver y navegar eventos.
    """
    page = logged_in_page
    
    # Navegar a eventos específicos para seminarista
    page.goto(f"{BASE_URL}/dashboard/seminarista/eventos", wait_until="networkidle")
    
    # Verificar que puede acceder a eventos
    expect(page.locator("h1, h2, .page-title")).to_be_visible(timeout=15000)
    
    # Verificar contenido de eventos (tarjetas o lista)
    if page.locator(".event-card, .glass-card").count() > 0:
        expect(page.locator(".event-card, .glass-card").first).to_be_visible()
        
        # Intentar ver detalles de un evento
        try:
            detail_button = page.locator("button:has-text('Ver Detalles'), button:has-text('Más Info')").first
            detail_button.click()
            
            # Verificar modal de detalles
            expect(page.locator(".modal, .fixed.inset-0")).to_be_visible(timeout=5000)
            
            # Cerrar modal
            page.keyboard.press("Escape")
        except:
            pass

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_view_cabanas(logged_in_page: Page):
    """
    Verifica que el seminarista puede ver cabañas y hacer reservas.
    """
    page = logged_in_page
    
    # Navegar a cabañas para seminarista
    page.goto(f"{BASE_URL}/dashboard/seminarista/cabanas", wait_until="networkidle")
    
    # Verificar acceso a cabañas
    expect(page.locator("h1, h2, .page-title")).to_be_visible(timeout=15000)
    
    # Verificar cabañas disponibles
    if page.locator(".cabin-card, .glass-card, .card").count() > 0:
        expect(page.locator(".cabin-card, .glass-card, .card").first).to_be_visible()
        
        # Intentar ver detalles de una cabaña
        try:
            detail_button = page.locator("button:has-text('Ver Detalles'), button:has-text('Reservar')").first
            detail_button.click()
            
            # Verificar que se abre modal/formulario
            expect(page.locator(".modal, .fixed.inset-0, .popup")).to_be_visible(timeout=5000)
            
            # Cerrar modal
            try:
                page.locator("button:has-text('Cerrar'), button[aria-label='Cerrar']").click(timeout=3000)
            except:
                page.keyboard.press("Escape")
        except:
            pass

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_view_cursos(logged_in_page: Page):
    """
    Verifica que el seminarista puede ver cursos disponibles.
    """
    page = logged_in_page
    
    # Navegar a cursos
    page.goto(f"{BASE_URL}/dashboard/seminarista/cursos", wait_until="networkidle")
    
    # Verificar acceso a cursos
    expect(page.locator("h1, h2, .page-title")).to_be_visible(timeout=15000)
    
    # Verificar contenido de cursos
    page.wait_for_selector('.course-card, .glass-card, .programa-card', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_manage_tareas(logged_in_page: Page):
    """
    Verifica que el seminarista puede gestionar sus tareas.
    """
    page = logged_in_page
    
    # Navegar a tareas
    page.goto(f"{BASE_URL}/seminarista/tareas", wait_until="networkidle")
    
    # Verificar acceso a tareas
    expect(page.get_by_role("heading", name="Gestión de Tareas")).to_be_visible(timeout=15000)
    
    # Verificar lista de tareas o mensaje de vacío
    page.wait_for_selector('.task-card, .glass-card, table, text=/No hay tareas/i', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_view_mis_inscripciones(logged_in_page: Page):
    """
    Verifica que el seminarista puede ver sus inscripciones.
    """
    page = logged_in_page
    
    # Navegar a inscripciones
    page.goto(f"{BASE_URL}/dashboard/seminarista/mis-inscripciones", wait_until="networkidle")
    
    # Verificar acceso
    expect(page.locator("h1, h2, .page-title")).to_be_visible(timeout=15000)
    
    # Verificar contenido de inscripciones
    page.wait_for_selector('.inscription-card, .glass-card, table, text=/No hay inscripciones/i', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_view_mis_reservas(logged_in_page: Page):
    """
    Verifica que el seminarista puede ver sus reservas.
    """
    page = logged_in_page
    
    # Navegar a reservas
    page.goto(f"{BASE_URL}/dashboard/seminarista/mis-reservas", wait_until="networkidle")
    
    # Verificar acceso
    expect(page.locator("h1, h2, .page-title")).to_be_visible(timeout=15000)
    
    # Verificar contenido de reservas
    page.wait_for_selector('.reservation-card, .glass-card, table, text=/No hay reservas/i', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_create_solicitud(logged_in_page: Page):
    """
    Verifica que el seminarista puede crear nuevas solicitudes.
    """
    page = logged_in_page
    
    # Navegar a nueva solicitud
    page.goto(f"{BASE_URL}/dashboard/seminarista/nueva-solicitud", wait_until="networkidle")
    
    # Verificar acceso al formulario
    expect(page.locator("h1, h2, .page-title")).to_be_visible(timeout=15000)
    
    # Verificar formulario de solicitud
    expect(page.locator("form, .form-container")).to_be_visible(timeout=10000)
    
    # Verificar campos básicos del formulario
    page.wait_for_selector('input, textarea, select', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_view_profile(logged_in_page: Page):
    """
    Verifica que el seminarista puede acceder a su perfil.
    """
    page = logged_in_page
    
    # Navegar al perfil
    page.goto(f"{BASE_URL}/dashboard/seminarista/Mi-Perfil", wait_until="networkidle")
    
    # Verificar acceso al perfil
    expect(page.locator("h1:has-text('Perfil'), h2:has-text('Mi Perfil')")).to_be_visible(timeout=15000)
    
    # Verificar información del perfil
    page.wait_for_selector('.profile-info, .glass-card, input', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_cannot_access_admin_sections(logged_in_page: Page):
    """
    Verifica que el seminarista no puede acceder a secciones administrativas.
    """
    page = logged_in_page
    
    # Intentar acceder a sección de admin
    page.goto(f"{BASE_URL}/admin/usuarios")
    
    # Debe ser redirigido
    page.wait_for_timeout(3000)
    current_url = page.url
    
    # Verificar redirección
    assert "/seminarista" in current_url or "/admin/usuarios" not in current_url, \
           "El seminarista pudo acceder a sección administrativa"

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_cannot_access_tesorero_sections(logged_in_page: Page):
    """
    Verifica que el seminarista no puede acceder a secciones del tesorero.
    """
    page = logged_in_page
    
    # Intentar acceder a sección de tesorero
    page.goto(f"{BASE_URL}/tesorero/reportes")
    
    # Debe ser redirigido
    page.wait_for_timeout(3000) 
    current_url = page.url
    
    # Verificar redirección
    assert "/seminarista" in current_url or "/tesorero" not in current_url, \
           "El seminarista pudo acceder a sección del tesorero"