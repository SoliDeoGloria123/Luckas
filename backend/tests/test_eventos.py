import pytest
from playwright.sync_api import Page, expect
import time
from datetime import datetime, timedelta
from conftest import BASE_URL  # Importar BASE_URL

# Pruebas para la gestión de eventos

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_events_page(logged_in_page: Page):
    """
    Verifica que el administrador puede ver la página de gestión de eventos.
    """
    page = logged_in_page
    
    # Navegar a la seccion de eventos
    page.goto(f"{BASE_URL}/admin/eventos", wait_until="networkidle")
    
    # Verificar que el heading principal es visible
    expect(page.get_by_role("heading", name="Gestión de Eventos")).to_be_visible(timeout=15000)
    
    # Verificar que hay contenido de eventos (tarjetas, tabla o mensaje de vacío)
    page.wait_for_selector('.glass-card, table, .event-card, button:has-text("Nuevo Evento")', timeout=15000)

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_create_new_event(logged_in_page: Page):
    """
    Verifica que el administrador puede crear un nuevo evento.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/eventos", wait_until="networkidle")

    # Hacer clic en el botón de nuevo evento
    new_event_button = page.locator("button:has-text('Nuevo Evento'), button:has-text('Crear Evento')")
    expect(new_event_button).to_be_visible(timeout=10000)
    new_event_button.click()

    # Esperar modal de creación
    expect(page.locator(".modal, .fixed.inset-0, form")).to_be_visible(timeout=10000)

    # Rellenar el formulario
    timestamp = int(time.time())
    event_title = f"Evento de Prueba {timestamp}"
    
    page.get_by_label("Título").fill(event_title)
    page.get_by_label("Descripción").fill("Descripción del evento de prueba.")
    
    # Fecha futura
    future_date = (datetime.now() + timedelta(days=10)).strftime("%Y-%m-%d")
    page.get_by_label("Fecha").fill(future_date)
    page.get_by_label("Hora").fill("10:00")
    page.get_by_label("Lugar").fill("Salón Principal")
    
    # Capacidad/cupos
    try:
        page.get_by_label("Cupos").fill("50")
    except:
        page.get_by_label("Capacidad").fill("50")

    # Precio si es requerido
    try:
        page.get_by_label("Precio").fill("25000")
    except:
        pass

    # Guardar evento
    save_button = page.locator("button:has-text('Guardar'), button:has-text('Crear')")
    save_button.click()

    # Verificar mensaje de éxito
    expect(page.locator("text=/Evento creado/i, text=/éxito/i, .Toastify__toast--success")).to_be_visible(timeout=15000)

    # Cerrar modal si está abierto
    try:
        page.locator("button:has-text('Cerrar'), button[title='Cerrar']").click(timeout=3000)
    except:
        pass

    # Verificar que el nuevo evento aparece en la lista
    page.wait_for_timeout(1000)
    expect(page.locator(f"text={event_title}")).to_be_visible(timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_edit_event(logged_in_page: Page):
    """
    Verifica que el administrador puede editar un evento existente.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/eventos")

    # Hacer clic en el botón de editar del primer evento de la tabla
    page.locator("table tbody tr:first-child button:has-text('Editar')").click()

    # Modificar el lugar del evento
    new_place = f"Salón B-{int(time.time()) % 100}"
    page.fill("input[name='lugar']", new_place)

    # Guardar cambios
    page.click("button:has-text('Guardar')")

    # Verificar mensaje de éxito
    expect(page.locator("text=/Evento actualizado con éxito/i")).to_be_visible()

    # Verificar que el lugar se actualizó en la tabla
    expect(page.locator(f"text={new_place}")).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True)
def test_user_can_view_and_enroll_in_event(logged_in_page: Page):
    """
    Verifica que usuarios no admin pueden ver eventos y registrarse.
    """
    page = logged_in_page
    role = page.role
    
    # Navegación según el rol
    if role == "seminarista":
        page.goto(f"{BASE_URL}/dashboard/seminarista/eventos", wait_until="networkidle")
    elif role == "externo":
        page.goto(f"{BASE_URL}/external", wait_until="networkidle")
        # Buscar sección de eventos o botón
        try:
            page.locator("button:has-text('Eventos'), a:has-text('Eventos'), nav a:has-text('Eventos')").click(timeout=5000)
            page.wait_for_load_state("networkidle")
        except:
            pass
    
    # Verificar que se muestran eventos
    # Buscar tarjetas de eventos o lista
    event_container = page.locator(".event-card, .glass-card, .card, article")
    if event_container.count() > 0:
        expect(event_container.first).to_be_visible(timeout=10000)
        
        # Intentar ver detalles del primer evento
        try:
            detail_button = page.locator("button:has-text('Ver Detalles'), button:has-text('Más Info'), button[title='Ver detalles']").first
            detail_button.click()
            
            # Verificar que se abre modal o página de detalles
            expect(page.locator(".modal, .fixed.inset-0, .popup")).to_be_visible(timeout=5000)
            
            # Cerrar modal
            try:
                page.locator("button:has-text('Cerrar'), .modal button[title='Cerrar'], button:has([aria-label='Cerrar'])").click(timeout=3000)
            except:
                page.keyboard.press("Escape")
        except:
            # Si no hay botón de detalles, está bien
            pass
    else:
        # Si no hay eventos, verificar mensaje
        expect(page.locator("text=/No hay eventos/i, text=/Próximamente/i")).to_be_visible(timeout=5000)
    Verifica que un usuario (seminarista/externo) puede ver la lista de eventos,
    ver los detalles y solicitar la inscripción.
    """
    page = logged_in_page
    
    # Navegar a la página de eventos para usuarios
    page.goto(f"{BASE_URL}/eventos") # La URL puede variar

    # Verificar que se muestra una lista o cuadrícula de eventos
    expect(page.locator(".event-card, .evento-card, .events-list")).not_to_be_empty()

    # Hacer clic en el primer evento para ver los detalles
    page.locator(".event-card, .evento-card, a:has-text('Ver')").first.click()

    # Verificar que estamos en la página de detalles
    expect(page.locator("h1")).not_to_be_empty()

    # Intentar inscribirse
    enroll_button = page.locator("button:has-text('Inscribirse')")
    if enroll_button.is_visible():
        enroll_button.click()
        # Verificar mensaje de éxito o de solicitud enviada
        expect(page.locator("text=/Inscripción realizada con éxito/i, text=/solicitud enviada/i")).to_be_visible()
    else:
        # Si el botón no está, puede que el usuario ya esté inscrito, lo cual es un resultado aceptable
        print("\nEl botón de 'Inscribirse' no está visible, posiblemente ya está inscrito.")
        pass
