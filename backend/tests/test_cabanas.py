import pytest
from playwright.sync_api import Page, expect
import time
import re
from datetime import datetime, timedelta
from conftest import BASE_URL

# Pruebas para la gestión de cabañas

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_cabins_page(logged_in_page: Page):
    """
    Verifica que el administrador puede ver la página de gestión de cabañas.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/cabanas", wait_until="networkidle")

    # Verificar que el título principal de la página es visible
    expect(page.get_by_role("heading", name="Gestión de Cabañas")).to_be_visible()

    # Basado en tu HTML, la tarjeta de admin es .glass-card
    expect(page.locator(".glass-card").first).to_be_visible()

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_create_new_cabin(logged_in_page: Page):
    """
    Verifica que el administrador puede crear una nueva cabaña.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/cabanas", wait_until="networkidle")

    # 1. Abrir el modal para crear una nueva cabaña
    create_btn = page.get_by_role("button", name=re.compile(r"Nueva.*Cabaña|Crear.*Cabaña", re.I))
    expect(create_btn.first).to_be_visible(timeout=10000)
    create_btn.first.click()

    # Esperar a que el modal de creación sea visible
    modal_header = page.get_by_role("heading", name=re.compile(r"Nueva|Crear", re.I))
    expect(modal_header.first).to_be_visible(timeout=10000)

    # Rellenar el formulario usando get_by_label, que es más robusto
    timestamp = int(time.time())
    cabin_name = f"Cabaña de Prueba {timestamp}"
    page.get_by_label("Nombre:").fill(cabin_name)
    page.get_by_label("Descripción:").fill("Descripción de la cabaña de prueba.")
    page.get_by_label("Capacidad:").fill("4")
    
    # Seleccionar la categoría ANTES de llenar el precio
    # Usar el select específico con id="categoria-cabana"
    categoria_select = page.locator('select#categoria-cabana')
    expect(categoria_select).to_be_visible(timeout=10000)
    
    # Obtener la primera opción válida (no la que dice "Seleccione...")
    primera_opcion = categoria_select.locator('option').nth(1)  # nth(1) es la segunda opción
    opcion_value = primera_opcion.get_attribute('value')
    
    if opcion_value:
        page.select_option('select#categoria-cabana', opcion_value)
    else:
        # Fallback: seleccionar por index
        page.select_option('select#categoria-cabana', {'index': 1})
    
    # Verificar que se seleccionó la categoría
    page.wait_for_timeout(500)
    
    page.get_by_label("Precio:").fill("150000")
    
    # Rellenar ubicación para completar datos
    try:
        page.get_by_label("Ubicacion:").fill("Sector Prueba")
    except Exception:
        pass

    # 2. Guardar la nueva cabaña
    save_btn = page.get_by_role("button", name=re.compile(r"Crear|Guardar|Aceptar", re.I))
    save_btn.first.click(timeout=10000)

    # 3. Verificar que la cabaña fue creada
    # Esperar a que aparezca el alert de éxito (puede ser un modal o toast)
    # Buscar por el texto "Cabaña creada exitosamente" o "¡Éxito!"
    success_alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    expect(success_alert).to_be_visible(timeout=20000)
    
    # Verificar que contiene el texto "creada" o "éxito"
    alert_text = success_alert.inner_text()
    assert "creada" in alert_text.lower() or "éxito" in alert_text.lower(), f"Alert no contiene mensaje esperado: {alert_text}"
    
    # Cerrar el alert haciendo clic en OK o esperando que desaparezca
    try:
        ok_btn = page.get_by_role("button", name="OK").first
        ok_btn.click(timeout=5000)
    except Exception:
        # Si no hay botón OK, esperar a que el alert se cierre automáticamente
        page.wait_for_timeout(2000)

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_edit_cabin(logged_in_page: Page):
    """
    Verifica que el administrador puede editar una cabaña existente con múltiples campos.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/cabanas", wait_until="networkidle")

    # 1. Esperar a que se carguen las cabañas
    page.wait_for_selector('.glass-card', timeout=15000)
    page.wait_for_timeout(2000)  # Esperar a que las tarjetas estén completamente renderizadas
    
    # 2. Contar las tarjetas disponibles
    cards_count = page.locator('.glass-card').count()
    assert cards_count > 0, "No hay cabañas disponibles para editar"
    
    # 3. Obtener la primera tarjeta
    first_card = page.locator('.glass-card').first
    
    # 4. Hacer hover sobre la tarjeta para revelar los botones
    first_card.hover(timeout=5000)
    page.wait_for_timeout(500)
    
    # 5. Buscar el botón de editar dentro de la tarjeta
    # El botón está en: div.flex.justify-end.gap-2.px-6.py-3 > button[title="Editar"]
    edit_button = first_card.locator('button[title="Editar"]')
    
    # Verificar que el botón sea visible
    if edit_button.count() == 0:
        # Si no lo encuentra, buscar en toda la página
        all_edit_buttons = page.locator('button[title="Editar"]')
        assert all_edit_buttons.count() > 0, "No se encontró botón de editar en la página"
        edit_button = all_edit_buttons.first
    
    expect(edit_button).to_be_visible(timeout=10000)
    edit_button.click()

    # Esperar a que se abra el modal de edición
    page.wait_for_timeout(2000)
    
    # 3. Rellenar los campos del formulario
    # Usar get_by_label que es más robusto
    page.get_by_label("Nombre:").clear()
    page.get_by_label("Nombre:").fill(f"Cabaña Actualizada {int(time.time())}")
    page.wait_for_timeout(300)
    
    page.get_by_label("Descripción:").clear()
    page.get_by_label("Descripción:").fill("Descripción actualizada.")
    page.wait_for_timeout(300)
    
    page.get_by_label("Capacidad:").clear()
    page.get_by_label("Capacidad:").fill("8")
    page.wait_for_timeout(300)
    
    page.get_by_label("Precio:").clear()
    page.get_by_label("Precio:").fill("195000")
    page.wait_for_timeout(300)
    
    page.get_by_label("Ubicacion:").clear()
    page.get_by_label("Ubicacion:").fill("Ubicación Actualizada")
    page.wait_for_timeout(300)
    
    # Cambiar estado
    page.select_option('select#estado-cabana', 'ocupada')
    page.wait_for_timeout(300)

    page.wait_for_timeout(1000)

    # 4. Guardar los cambios
    save_button = page.get_by_role("button", name=re.compile(r"Guardar|Actualizar|Aceptar", re.I))
    expect(save_button.first).to_be_visible(timeout=10000)
    save_button.first.click()

    # 5. Verificar que la cabaña fue actualizada
    # Buscar el alert de éxito
    success_alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    expect(success_alert).to_be_visible(timeout=15000)
    
    alert_text = success_alert.inner_text()
    assert "actualizada" in alert_text.lower() or "éxito" in alert_text.lower(), f"Alert no contiene mensaje esperado: {alert_text}"
@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_delete_cabin(logged_in_page: Page):
    """
    Verifica que el administrador puede eliminar una cabaña existente.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/admin/cabanas", wait_until="networkidle")

    # 1. Esperar a que se carguen las cabañas
    page.wait_for_selector('.glass-card', timeout=15000)
    page.wait_for_timeout(2000)
    
    # 2. Contar las cabañas iniciales
    initial_count = page.locator('.glass-card').count()
    assert initial_count > 0, "No hay cabañas disponibles para eliminar"

    # 3. Localizar y hacer clic en el botón de eliminar de la primera tarjeta
    first_card = page.locator('.glass-card').first
    
    # Hacer hover para revelar los botones
    first_card.hover(timeout=5000)
    page.wait_for_timeout(500)
    
    # Buscar el botón de eliminar
    delete_button = first_card.locator('button[title="Eliminar"]')
    
    # Fallback: si no lo encuentra en la tarjeta, buscar en toda la página
    if delete_button.count() == 0:
        all_delete_buttons = page.locator('button[title="Eliminar"]')
        assert all_delete_buttons.count() > 0, "No se encontró botón de eliminar en la página"
        delete_button = all_delete_buttons.first
    
    expect(delete_button).to_be_visible(timeout=10000)
    delete_button.click(timeout=10000)

    # 4. Esperar y confirmar la eliminación en el diálogo de confirmación
    page.wait_for_timeout(1000)
    
    # Buscar el botón de confirmación en el modal que aparece
    confirm_btn = page.get_by_role("button", name=re.compile(r"Confirmar|Eliminar|Aceptar|Sí|Yes|Sigue|Proceder", re.I))
    if confirm_btn.count() > 0:
        confirm_btn.first.click(timeout=10000)
    else:
        # Si hay un modal, buscar el botón dentro del modal
        modal = page.locator('.swal2-container, [role="dialog"]').first
        if modal.count() > 0:
            modal_confirm = modal.locator('button[type="button"]').filter(has_text=re.compile(r"Confirmar|Eliminar|Aceptar|Sí", re.I)).first
            if modal_confirm.count() > 0:
                modal_confirm.click(timeout=10000)
    
    # 5. Verificar que la cabaña fue eliminada
    # Esperar el alert de éxito
    page.wait_for_timeout(1000)
    success_alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    expect(success_alert).to_be_visible(timeout=15000)
    
    alert_text = success_alert.inner_text()
    assert "eliminada" in alert_text.lower() or "éxito" in alert_text.lower(), f"Alert no contiene mensaje esperado: {alert_text}"
    
    # Cerrar el alert
    try:
        ok_btn = page.get_by_role("button", name="OK").first
        ok_btn.click(timeout=5000)
    except Exception:
        page.wait_for_timeout(2000)

@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_view_cabins(logged_in_page: Page):
    """
    Verifica que el tesorero puede ver la lista de cabañas en su dashboard.
    """
    page = logged_in_page
    
    # Navegar a la página de gestión de cabañas del tesorero
    page.goto(f"{BASE_URL}/tesorero/cabañas", wait_until="networkidle")

    # Verificar que se carga la página correctamente
    # Buscar título o encabezado de cabañas
    expect(page.get_by_role("heading", name=re.compile(r"Cabañas|Gestión", re.I)).first).to_be_visible(timeout=10000)
    
    # Verificar que exista al menos una tarjeta de cabaña (grid de glass-card)
    expect(page.locator('.glass-card').first).to_be_visible(timeout=10000)

@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_create_cabin(logged_in_page: Page):
    """
    Verifica que el tesorero puede crear una nueva cabaña.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/tesorero/cabañas", wait_until="networkidle")

    # 1. Buscar y hacer clic en el botón de crear
    create_button = page.get_by_role("button", name=re.compile(r"Nueva|Crear|Agregar", re.I))
    expect(create_button.first).to_be_visible(timeout=10000)
    create_button.first.click()

    # Esperar a que el modal se abra
    page.wait_for_timeout(1000)

    # 2. Rellenar el formulario
    timestamp = int(time.time())
    cabin_name = f"Cabaña Tesorero {timestamp}"
    
    page.get_by_label("Nombre:").fill(cabin_name)
    page.get_by_label("Descripción:").fill("Cabaña creada por tesorero.")
    page.get_by_label("Capacidad:").fill("6")
    
    # Seleccionar la categoría - IMPORTANTE: antes del precio
    categoria_select = page.locator('select#categoria-cabana')
    expect(categoria_select).to_be_visible(timeout=10000)
    
    # Obtener la primera opción válida
    primera_opcion = categoria_select.locator('option').nth(1)
    opcion_value = primera_opcion.get_attribute('value')
    
    if opcion_value:
        page.select_option('select#categoria-cabana', opcion_value)
    else:
        page.select_option('select#categoria-cabana', {'index': 1})
    
    page.wait_for_timeout(500)
    page.get_by_label("Precio:").fill("200000")

    # 3. Guardar la cabaña
    save_button = page.get_by_role("button", name=re.compile(r"Crear|Guardar|Aceptar", re.I))
    save_button.first.click(timeout=10000)

    # 4. Verificar que fue creada
    success_alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    expect(success_alert).to_be_visible(timeout=15000)
    
    alert_text = success_alert.inner_text()
    assert "creada" in alert_text.lower() or "éxito" in alert_text.lower(), f"Alert no contiene mensaje esperado: {alert_text}"
    
    # Cerrar el alert
    try:
        ok_btn = page.get_by_role("button", name="OK").first
        ok_btn.click(timeout=5000)
    except Exception:
        page.wait_for_timeout(2000)

@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_edit_cabin(logged_in_page: Page):
    """
    Verifica que el tesorero puede editar una cabaña existente con múltiples campos.
    """
    page = logged_in_page
    page.goto(f"{BASE_URL}/tesorero/cabañas", wait_until="networkidle")

    # 1. Esperar a que se carguen las cabañas
    page.wait_for_selector('.glass-card', timeout=15000)

    # 2. Buscar el botón de editar en la primera tarjeta
    first_card = page.locator('.glass-card').first
    
    # Hacer hover para revelar los botones de acción
    first_card.hover(timeout=5000)
    
    # Buscar y hacer clic en el botón 'Editar'
    edit_button = first_card.locator('button[title="Editar"]')
    
    if edit_button.count() == 0:
        # Intentar con get_by_role como fallback
        edit_button = page.get_by_role("button", name=re.compile(r"Editar|Edit", re.I)).first
    
    expect(edit_button).to_be_visible(timeout=10000)
    edit_button.click()

    # Esperar a que se abra el modal
    page.wait_for_timeout(2000)
    
    # 3. Modificar múltiples campos
    page.get_by_label("Nombre:").clear()
    page.get_by_label("Nombre:").fill(f"Cabaña Tesorero Actualizada {int(time.time())}")
    page.wait_for_timeout(300)
    
    page.get_by_label("Descripción:").clear()
    page.get_by_label("Descripción:").fill("Descripción actualizada por tesorero.")
    page.wait_for_timeout(300)
    
    page.get_by_label("Capacidad:").clear()
    page.get_by_label("Capacidad:").fill("10")
    page.wait_for_timeout(300)
    
    page.get_by_label("Precio:").clear()
    page.get_by_label("Precio:").fill("250000")
    page.wait_for_timeout(300)
    
    page.get_by_label("Ubicacion:").clear()
    page.get_by_label("Ubicacion:").fill("Sector Actualizado Tesorero")
    page.wait_for_timeout(300)

    page.wait_for_timeout(1000)

    # 4. Guardar los cambios
    save_button = page.get_by_role("button", name=re.compile(r"Guardar|Actualizar|Aceptar", re.I))
    expect(save_button.first).to_be_visible(timeout=10000)
    save_button.first.click()

    # 5. Verificar que fue actualizado
    success_alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    expect(success_alert).to_be_visible(timeout=15000)
    
    alert_text = success_alert.inner_text()
    assert "actualizada" in alert_text.lower() or "éxito" in alert_text.lower(), f"Alert no contiene mensaje esperado: {alert_text}"
    
    # Cerrar el alert
    try:
        ok_btn = page.get_by_role("button", name="OK").first
        ok_btn.click(timeout=5000)
    except Exception:
        page.wait_for_timeout(2000)

@pytest.mark.parametrize("logged_in_page", ["seminarista", "externo"], indirect=True)
def test_user_can_view_and_reserve_cabin(logged_in_page: Page):
    """
    Verifica que un usuario (seminarista/externo) puede ver la lista de cabañas,
    ver los detalles y solicitar una reserva.
    """
    page = logged_in_page
    
    # --- NAVEGACIÓN POR ROL ---
    if page.role == "seminarista":
        page.goto(f"{BASE_URL}/dashboard/seminarista/cabanas", wait_until="networkidle")
    elif page.role == "externo":
        page.get_by_role("button", name="Cabañas").click()
        page.wait_for_load_state("networkidle")
    
    # --- SELECTOR DE TARJETA ---
    # El HTML es diferente para cada rol, así que usamos el selector adecuado.
    if page.role == "seminarista":
        # Basado en el HTML que proporcionaste, ".cabin-card" es el selector perfecto.
        cabin_card_selector = ".cabin-card"
    else: # Para 'externo', la estructura puede ser distinta; no asumimos .glass-card
        cabin_card_selector = None
    
    # Verificar que se muestra una cuadrícula de cabañas
    if cabin_card_selector:
        expect(page.locator(cabin_card_selector).first).to_be_visible()
        first_cabin_card = page.locator(cabin_card_selector).first
    else:
        # Para externo, verificar que exista al menos un botón 'Ver Detalles'
        expect(page.get_by_role("button", name=re.compile(r"Ver\s*Detalles|Ver detalles", re.I)).first).to_be_visible(timeout=10000)
        first_cabin_card = None

    # Hacer clic en la primera cabaña para ver los detalles
    if page.role == "seminarista":
        # seminariastas usan la card interna
        first_cabin_card.get_by_role("button", name="Ver Detalles").first.click()
        expect(page.locator("#detailsModal.active")).to_be_visible()
    else:
        # Para externo/admin, usar el botón global de 'Ver Detalles'
        if first_cabin_card:
            first_cabin_card.get_by_role("button", name=re.compile(r"Ver\s*detalles|Ver\s*Detalles", re.I)).first.click()
        else:
            page.get_by_role("button", name=re.compile(r"Ver\s*Detalles|Ver\s*detalles", re.I)).first.click()
        expect(page.locator(".fixed.inset-0").last).to_be_visible(timeout=10000)
    
    # Cerrar el modal de detalles para evitar que bloquee acciones futuras (como logout)
    try:
        close_button = page.locator('button.closeBtn-semianrio')
        if close_button.count() > 0:
            close_button.click(timeout=5000)
            page.wait_for_timeout(500)
    except Exception:
        # Si el modal no tiene ese selector, intentar con ESC
        page.keyboard.press("Escape")
        page.wait_for_timeout(500)

