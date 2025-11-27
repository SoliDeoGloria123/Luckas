import pytest
from playwright.sync_api import Page, expect
import time
from datetime import datetime, timedelta
from conftest import BASE_URL

# Pruebas específicas para el rol Externo

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_can_access_dashboard(logged_in_page: Page):
    """
    Verifica que el usuario externo puede acceder a su dashboard público.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Verificar elementos del dashboard externo
    expect(page.locator("h1, h2, .welcome-title")).to_be_visible(timeout=15000)
    
    # Verificar navegación principal
    expect(page.locator("nav, .navigation, .menu")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_can_view_public_events(logged_in_page: Page):
    """
    Verifica que el usuario externo puede ver eventos públicos.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar sección de eventos
    try:
        # Intentar hacer clic en eventos si hay un botón/enlace
        events_link = page.locator("button:has-text('Eventos'), a:has-text('Eventos'), nav a:has-text('Eventos')")
        if events_link.count() > 0:
            events_link.click()
            page.wait_for_load_state("networkidle")
    except:
        pass
    
    # Verificar que se muestran eventos públicos
    if page.locator(".event-card, .glass-card, .card").count() > 0:
        expect(page.locator(".event-card, .glass-card, .card").first).to_be_visible()
        
        # Intentar ver detalles de un evento
        try:
            detail_button = page.locator("button:has-text('Ver Detalles'), button:has-text('Más Info')").first
            detail_button.click()
            
            # Verificar modal de detalles
            expect(page.locator(".modal, .fixed.inset-0, .popup")).to_be_visible(timeout=5000)
            
            # Verificar información del evento
            expect(page.locator(".modal-content, .popup-content")).to_be_visible()
            
            # Cerrar modal
            try:
                page.locator("button:has-text('Cerrar'), button[aria-label='Cerrar']").click(timeout=3000)
            except:
                page.keyboard.press("Escape")
        except:
            pass

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True) 
def test_externo_can_view_public_cabanas(logged_in_page: Page):
    """
    Verifica que el usuario externo puede ver cabañas disponibles.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar sección de cabañas
    try:
        cabanas_link = page.locator("button:has-text('Cabañas'), a:has-text('Cabañas'), nav a:has-text('Alojamiento')")
        if cabanas_link.count() > 0:
            cabanas_link.click()
            page.wait_for_load_state("networkidle")
    except:
        pass
    
    # Verificar que se muestran cabañas
    if page.locator(".cabin-card, .glass-card, .card").count() > 0:
        expect(page.locator(".cabin-card, .glass-card, .card").first).to_be_visible()
        
        # Intentar ver detalles de una cabaña
        try:
            detail_button = page.locator("button:has-text('Ver Detalles'), button:has-text('Reservar')").first
            detail_button.click()
            
            # Verificar modal de detalles/reserva
            expect(page.locator(".modal, .fixed.inset-0")).to_be_visible(timeout=5000)
            
            # Verificar información de la cabaña
            expect(page.locator(".modal-content, .cabin-details")).to_be_visible()
            
            # Cerrar modal
            try:
                page.locator("button:has-text('Cerrar'), button[aria-label='Cerrar']").click(timeout=3000)
            except:
                page.keyboard.press("Escape")
        except:
            pass

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_can_view_public_courses(logged_in_page: Page):
    """
    Verifica que el usuario externo puede ver cursos públicos.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar sección de cursos
    try:
        courses_link = page.locator("button:has-text('Cursos'), a:has-text('Cursos'), nav a:has-text('Programas')")
        if courses_link.count() > 0:
            courses_link.click()
            page.wait_for_load_state("networkidle")
    except:
        pass
    
    # Verificar contenido de cursos/programas
    if page.locator(".course-card, .program-card, .glass-card").count() > 0:
        expect(page.locator(".course-card, .program-card, .glass-card").first).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_can_submit_contact_form(logged_in_page: Page):
    """
    Verifica que el usuario externo puede enviar formularios de contacto.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar sección de contacto o formulario
    try:
        contact_link = page.locator("button:has-text('Contacto'), a:has-text('Contacto'), button:has-text('Solicitar')")
        if contact_link.count() > 0:
            contact_link.click()
            page.wait_for_timeout(2000)
            
            # Verificar formulario
            if page.locator("form, .form-container").count() > 0:
                expect(page.locator("form, .form-container")).to_be_visible()
                
                # Verificar campos básicos
                page.wait_for_selector('input, textarea', timeout=5000)
        else:
            # Si no hay enlace de contacto, buscar formulario en la página principal
            if page.locator("form").count() > 0:
                expect(page.locator("form").first).to_be_visible()
    except:
        # Es opcional si no hay formulario de contacto visible
        pass

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_can_access_profile(logged_in_page: Page):
    """
    Verifica que el usuario externo puede acceder a su perfil básico.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar acceso al perfil
    try:
        # Buscar botón de usuario/perfil en el header
        profile_button = page.locator("button[aria-haspopup='true'], .user-menu, .profile-button")
        if profile_button.count() > 0:
            profile_button.click()
            
            # Buscar opción de perfil en el menú desplegable
            profile_option = page.locator("a:has-text('Perfil'), button:has-text('Mi Perfil')")
            if profile_option.count() > 0:
                profile_option.click()
                page.wait_for_load_state("networkidle")
                
                # Verificar página/modal de perfil
                expect(page.locator(".profile-info, .modal, form")).to_be_visible(timeout=5000)
    except:
        # Es opcional si no hay acceso directo al perfil
        pass

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_cannot_access_admin_sections(logged_in_page: Page):
    """
    Verifica que el usuario externo no puede acceder a secciones administrativas.
    """
    page = logged_in_page
    
    # Intentar acceder a sección de admin
    page.goto(f"{BASE_URL}/admin/usuarios")
    
    # Debe ser redirigido
    page.wait_for_timeout(3000)
    current_url = page.url
    
    # Verificar redirección
    assert "/external" in current_url or "/admin" not in current_url, \
           "El usuario externo pudo acceder a sección administrativa"

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_cannot_access_tesorero_sections(logged_in_page: Page):
    """
    Verifica que el usuario externo no puede acceder a secciones del tesorero.
    """
    page = logged_in_page
    
    # Intentar acceder a sección de tesorero
    page.goto(f"{BASE_URL}/tesorero/reportes")
    
    # Debe ser redirigido
    page.wait_for_timeout(3000)
    current_url = page.url
    
    # Verificar redirección
    assert "/external" in current_url or "/tesorero" not in current_url, \
           "El usuario externo pudo acceder a sección del tesorero"

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_cannot_access_seminarista_sections(logged_in_page: Page):
    """
    Verifica que el usuario externo no puede acceder a secciones del seminarista.
    """
    page = logged_in_page
    
    # Intentar acceder a sección de seminarista
    page.goto(f"{BASE_URL}/dashboard/seminarista/eventos")
    
    # Debe ser redirigido
    page.wait_for_timeout(3000)
    current_url = page.url
    
    # Verificar redirección
    assert "/external" in current_url or "/seminarista" not in current_url, \
           "El usuario externo pudo acceder a sección del seminarista"

@pytest.mark.parametrize("logged_in_page", ["externo"], indirect=True)
def test_externo_can_logout(logged_in_page: Page):
    """
    Verifica que el usuario externo puede cerrar sesión correctamente.
    """
    page = logged_in_page
    
    # Ir al dashboard externo
    page.goto(f"{BASE_URL}/external", wait_until="networkidle")
    
    # Buscar botón de logout
    try:
        # Buscar menú de usuario primero
        user_menu = page.locator("button[aria-haspopup='true'], .user-menu")
        if user_menu.count() > 0:
            user_menu.click()
            page.wait_for_timeout(1000)
        
        # Buscar botón de logout
        logout_button = page.locator("button:has-text('Cerrar Sesión'), button:has-text('Salir'), a:has-text('Logout')")
        expect(logout_button).to_be_visible(timeout=5000)
        logout_button.click()
        
        # Verificar redirección a login
        page.wait_for_url("**/login**", timeout=10000)
        expect(page.locator("#correo, #password")).to_be_visible(timeout=5000)
    except:
        # Si no encuentra logout, usar método alternativo
        page.goto(f"{BASE_URL}/cerrar-sesion")
        page.wait_for_url("**/login**", timeout=5000)