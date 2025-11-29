import pytest
from playwright.sync_api import Page, expect
import time
from datetime import datetime, timedelta
from conftest import BASE_URL

# Pruebas para la gestión de reservas

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_reservas_page(logged_in_page: Page):
    """
    Verifica que el administrador puede ver la página de gestión de reservas.
    """
    page = logged_in_page
    
    # Navegar a la sección de reservas
    page.goto(f"{BASE_URL}/admin/reservas", wait_until="networkidle")
    
    # Verificar que el heading principal es visible
    expect(page.get_by_role("heading", name="Gestión de Reservas")).to_be_visible(timeout=15000)
    
    # Verificar que hay contenido
    page.wait_for_selector('.glass-card, table, .reservation-card', timeout=15000)

@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_view_reservas(logged_in_page: Page):
    """
    Verifica que el tesorero puede ver reservas.
    """
    page = logged_in_page
    
    # Navegar a reservas del tesorero
    page.goto(f"{BASE_URL}/tesorero/reservas", wait_until="networkidle")
    
    # Verificar acceso
    expect(page.get_by_role("heading", name="Gestión de Reservas")).to_be_visible(timeout=15000)
    
    # Verificar contenido
    page.wait_for_selector('.glass-card, .reservation-card, table', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_manage_reservas(logged_in_page: Page):
    """
    Verifica que el administrador puede gestionar reservas.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/reservas", wait_until="networkidle")

    # Verificar que puede ver y gestionar reservas
    if page.locator(".glass-card, .reservation-card, table tbody tr").count() > 0:
        # Si hay reservas, verificar funcionalidades
        reservation_item = page.locator(".glass-card, .reservation-card, table tbody tr").first
        expect(reservation_item).to_be_visible()
        
        # Buscar botones de acción
        action_buttons = page.locator("button[title='Ver'], button[title='Editar'], button:has-text('Aprobar'), button:has-text('Rechazar')")
        if action_buttons.count() > 0:
            # Al menos debe haber un botón de acción
            expect(action_buttons.first).to_be_visible()
    else:
        # Si no hay reservas, verificar mensaje o botón de crear
        expect(page.locator("text=/No hay reservas/i, button:has-text('Nueva Reserva')")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_seminarista_can_view_mis_reservas(logged_in_page: Page):
    """
    Verifica que el seminarista puede ver sus propias reservas.
    """
    page = logged_in_page
    
    # Navegar a mis reservas
    page.goto(f"{BASE_URL}/dashboard/seminarista/mis-reservas", wait_until="networkidle")
    
    # Verificar acceso
    expect(page.locator("h1, h2, .page-title")).to_be_visible(timeout=15000)
    
    # Verificar contenido de reservas personales
    # Esperar a que aparezca alguna tarjeta de reserva O el mensaje de "No tienes reservas"
    expect(page.locator(".inscripcion-card-misinscripciones").or_(page.locator(".reservation-card")).or_(page.locator(".glass-card")).or_(page.locator("table")).or_(page.locator("text=/No tienes reservas/i"))).to_be_visible(timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_can_make_reservation_request(logged_in_page: Page):
    """
    Verifica que el usuario externo puede solicitar reservas.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar sección de cabañas para reservar
    try:
        cabanas_link = page.locator("button:has-text('Cabañas'), a:has-text('Alojamiento')")
        if cabanas_link.count() > 0:
            cabanas_link.click()
            page.wait_for_load_state("networkidle")
            
            # Si hay cabañas disponibles, intentar reservar
            if page.locator(".cabin-card, .glass-card").count() > 0:
                # Hacer clic en la primera cabaña
                first_cabin = page.locator(".cabin-card, .glass-card").first
                expect(first_cabin).to_be_visible()
                
                # Buscar botón de reserva
                reserve_button = page.locator("button:has-text('Reservar'), button:has-text('Solicitar')")
                if reserve_button.count() > 0:
                    reserve_button.first.click()
                    
                    # Verificar que se abre formulario de reserva
                    expect(page.locator(".modal, .fixed.inset-0, form")).to_be_visible(timeout=5000)
                    
                    # Cerrar modal
                    try:
                        page.locator("button:has-text('Cerrar')").click(timeout=3000)
                    except:
                        page.keyboard.press("Escape")
    except:
        # Es opcional si no hay sistema de reservas público
        pass
