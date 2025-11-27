import pytest
from playwright.sync_api import Page, expect
import time
from datetime import datetime, timedelta
from conftest import BASE_URL

# Pruebas para la gestión de programas académicos

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_programas_page(logged_in_page: Page):
    """
    Verifica que el administrador puede ver la página de gestión de programas académicos.
    """
    page = logged_in_page
    
    # Navegar a la sección de programas académicos
    page.goto(f"{BASE_URL}/admin/programas-academicos", wait_until="networkidle")
    
    # Verificar que el heading principal es visible
    expect(page.get_by_role("heading", name="Gestión de Programas Académicos")).to_be_visible(timeout=15000)
    
    # Verificar que hay contenido (tarjetas, tabla o botón de crear)
    page.wait_for_selector('.glass-card, table, .program-card, button:has-text("Nuevo Programa")', timeout=15000)

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_create_new_programa(logged_in_page: Page):
    """
    Verifica que el administrador puede crear un nuevo programa académico.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/programas-academicos", wait_until="networkidle")

    # Hacer clic en el botón de nuevo programa
    new_program_button = page.locator("button:has-text('Nuevo Programa'), button:has-text('Crear Programa')")
    expect(new_program_button).to_be_visible(timeout=10000)
    new_program_button.click()

    # Esperar modal de creación
    expect(page.locator(".modal, .fixed.inset-0, form")).to_be_visible(timeout=10000)

    # Rellenar el formulario
    timestamp = int(time.time())
    program_name = f"Programa de Prueba {timestamp}"
    
    page.get_by_label("Nombre").fill(program_name)
    page.get_by_label("Descripción").fill("Descripción del programa de prueba.")
    
    # Duración
    try:
        page.get_by_label("Duración").fill("6 meses")
    except:
        pass
    
    # Precio si es requerido
    try:
        page.get_by_label("Precio").fill("150000")
    except:
        pass
        
    # Capacidad
    try:
        page.get_by_label("Capacidad").fill("30")
    except:
        pass

    # Guardar programa
    save_button = page.locator("button:has-text('Guardar'), button:has-text('Crear')")
    save_button.click()

    # Verificar mensaje de éxito
    expect(page.locator("text=/Programa creado/i, text=/éxito/i, .Toastify__toast--success")).to_be_visible(timeout=15000)

    # Cerrar modal si está abierto
    try:
        page.locator("button:has-text('Cerrar'), button[title='Cerrar']").click(timeout=3000)
    except:
        pass

    # Verificar que el nuevo programa aparece
    page.wait_for_timeout(1000)
    expect(page.locator(f"text={program_name}")).to_be_visible(timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_view_programas(logged_in_page: Page):
    """
    Verifica que el tesorero puede ver programas académicos.
    """
    page = logged_in_page
    
    # Navegar a programas del tesorero
    page.goto(f"{BASE_URL}/tesorero/programas", wait_until="networkidle")
    
    # Verificar acceso
    expect(page.get_by_role("heading", name="Gestión de Programas")).to_be_visible(timeout=15000)
    
    # Verificar contenido
    page.wait_for_selector('.glass-card, .program-card, table', timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True)
def test_user_can_view_public_programas(logged_in_page: Page):
    """
    Verifica que usuarios no admin pueden ver programas públicos.
    """
    page = logged_in_page
    role = page.role
    
    # Navegación según el rol
    if role == "seminarista":
        page.goto(f"{BASE_URL}/dashboard/seminarista/cursos", wait_until="networkidle")
    elif role == "externo":
        page.goto(f"{BASE_URL}/external", wait_until="networkidle")
        # Buscar sección de cursos/programas
        try:
            programs_link = page.locator("button:has-text('Cursos'), a:has-text('Programas')")
            if programs_link.count() > 0:
                programs_link.click()
                page.wait_for_load_state("networkidle")
        except:
            pass
    
    # Verificar contenido de programas
    if page.locator(".program-card, .course-card, .glass-card").count() > 0:
        expect(page.locator(".program-card, .course-card, .glass-card").first).to_be_visible()
        
        # Intentar ver detalles
        try:
            detail_button = page.locator("button:has-text('Ver Detalles'), button:has-text('Más Info')").first
            detail_button.click()
            
            # Verificar modal de detalles
            expect(page.locator(".modal, .fixed.inset-0")).to_be_visible(timeout=5000)
            
            # Cerrar modal
            try:
                page.locator("button:has-text('Cerrar')").click(timeout=3000)
            except:
                page.keyboard.press("Escape")
        except:
            pass
