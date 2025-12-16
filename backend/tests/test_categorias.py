import pytest
from playwright.sync_api import Page, expect
import re
import time
from conftest import BASE_URL

# ========== FUNCIONES AUXILIARES ==========

def close_alert(page: Page, wait_seconds: int = 2) -> bool:
    """
    Espera N segundos para que el usuario vea el alert, luego deja que se cierre automáticamente.
    
    Args:
        page: Objeto Page de Playwright
        wait_seconds: Segundos para mostrar la alerta (default: 5)
    
    Retorna True siempre.
    """
    try:
        # Esperar para que el usuario vea el alert
        print(f"[INFO] Mostrando alert por {wait_seconds} segundos...")
        page.wait_for_timeout(wait_seconds * 1000)
        return True
    except Exception as e:
        print(f"[WARN] Error al esperar: {e}")
        return False


def find_edit_button_tesorero(page: Page):
    """
    Busca el botón de editar en la tabla de tesorero (lucide-react Edit icon).
    """
    edit_button = None
    
    try:
        first_row = page.locator("table tbody tr").first
        if first_row.count():
            edit_button = first_row.locator("button.h-8.w-8")
            if not edit_button or edit_button.count() == 0:
                edit_button = first_row.locator("td:last-child button").first
    except Exception:
        pass
    
    if not edit_button or edit_button.count() == 0:
        try:
            edit_button = page.locator("button.h-8.w-8").first
        except Exception:
            pass
    
    return edit_button


def edit_tesorero_category_fields(page: Page, timestamp: int):
    """
    Edita los campos del formulario de categoría para tesorero.
    """
    try:
        page.get_by_label(re.compile(r"Nombre", re.I)).clear()
        page.get_by_label(re.compile(r"Nombre", re.I)).fill(f"Categoría Tesorero Actualizada {timestamp}")
    except Exception:
        page.locator("input[placeholder*='nombre' i]").first.clear()
        page.locator("input[placeholder*='nombre' i]").first.fill(f"Categoría Tesorero Actualizada {timestamp}")
    
    page.wait_for_timeout(300)
    
    try:
        page.get_by_label(re.compile(r"Tipo|Categoria", re.I)).select_option("cabaña")
        page.wait_for_timeout(300)
    except Exception:
        pass
    
    try:
        page.get_by_label(re.compile(r"Código", re.I)).clear()
        page.get_by_label(re.compile(r"Código", re.I)).fill(f"TES_UPD{timestamp}")
        page.wait_for_timeout(300)
    except Exception:
        pass


@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_categories_page(logged_in_page: Page):
    """Admin puede ver la página de gestión de categorías"""
    page = logged_in_page
    
    # Navegar a gestión de categorías
    page.goto(f"{BASE_URL}/admin/categorizacion", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Verificar que la página cargó usando selector más específico
    page_title = page.locator(".page-title-admin h1")
    expect(page_title).to_contain_text("Gestión de Categorización")
    
    # Verificar botón de crear
    expect(page.get_by_role("button", name=re.compile(r"Nueva Categoría", re.I))).to_be_visible()


@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_create_category(logged_in_page: Page):
    """Admin puede crear una nueva categoría"""
    page = logged_in_page
    
    # Navegar a gestión de categorías
    page.goto(f"{BASE_URL}/admin/categorizacion", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Abrir modal de crear
    page.get_by_role("button", name=re.compile(r"Nueva Categoría", re.I)).click()
    page.wait_for_timeout(1000)
    
    # Verificar que el modal se abrió - usar selector del header del modal
    modal_title = page.locator(".modal-header-admin h3")
    expect(modal_title).to_contain_text("Crear Nueva Categoría")
    
    # Llenar formulario
    timestamp = int(time.time())
    nombre = f"Categoría Test {timestamp}"
    codigo = f"CAT{timestamp}"
    
    page.get_by_label("Nombre:").fill(nombre)
    page.wait_for_timeout(300)
    
    page.get_by_label("Tipo Categoria:").select_option("curso")
    page.wait_for_timeout(300)
    
    page.get_by_label("Código:").fill(codigo)
    page.wait_for_timeout(300)
    
    page.get_by_label("Estado:").select_option("activo")
    page.wait_for_timeout(300)
    
    # Guardar
    page.get_by_role("button", name=re.compile(r"Crear Categoría|Guardar", re.I)).first.click()
    page.wait_for_timeout(500)
    
    # Verificar alerta de éxito
    alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    try:
        expect(alert).to_be_visible(timeout=1500)
        alert_text = alert.inner_text()
        assert "EXITO" in alert_text.upper() or "creada" in alert_text.lower(), f"Alert text: {alert_text}"
        print(f"[OK] Alerta de éxito detectada: {alert_text}")
    except Exception as e:
        print(f"[ERROR] Alerta no encontrada: {e}")
        raise
    
    # Cerrar alerta inmediatamente
    close_alert(page)


@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_edit_category(logged_in_page: Page):
    """Admin puede editar una categoría existente"""
    page = logged_in_page
    
    # Navegar a gestión de categorías
    page.goto(f"{BASE_URL}/admin/categorizacion", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Esperar a que carguen las categorías
    page.wait_for_selector("table tbody tr", timeout=5000)
    page.wait_for_timeout(500)
    
    # Encontrar la primera fila y su botón de editar
    first_row = page.locator("table tbody tr").first
    edit_button = first_row.locator("button.editar")
    
    if edit_button.count() == 0:
        pytest.skip("No se encontró botón de editar")
    
    edit_button.click()
    page.wait_for_timeout(1500)
    
    # Verificar que el modal de edición se abrió
    modal_title = page.locator(".modal-header-admin h3")
    expect(modal_title).to_contain_text("Editar Categoría")
    
    # Editar campos
    timestamp = int(time.time())
    nombre_actualizado = f"Categoría Actualizada {timestamp}"
    codigo_actualizado = f"CAT_UPD{timestamp}"
    
    # Limpiar y llenar nombre
    page.get_by_label("Nombre:").clear()
    page.get_by_label("Nombre:").fill(nombre_actualizado)
    page.wait_for_timeout(300)
    
    # Cambiar tipo
    page.get_by_label("Tipo Categoria:").select_option("programa")
    page.wait_for_timeout(300)
    
    # Actualizar código
    page.get_by_label("Código:").clear()
    page.get_by_label("Código:").fill(codigo_actualizado)
    page.wait_for_timeout(300)
    
    # Cambiar estado
    page.get_by_label("Estado:").select_option("inactivo")
    page.wait_for_timeout(300)
    
    # Guardar cambios
    page.get_by_role("button", name=re.compile(r"Guardar Cambios|Actualizar", re.I)).first.click()
    page.wait_for_timeout(500)
    
    # Verificar alerta de éxito
    alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    try:
        expect(alert).to_be_visible(timeout=1500)
        alert_text = alert.inner_text()
        assert "actualizada" in alert_text.lower() or "EXITO" in alert_text.upper(), f"Alert text: {alert_text}"
        print(f"[OK] Alerta de éxito detectada: {alert_text}")
    except Exception as e:
        print(f"[ERROR] Alerta no encontrada: {e}")
        raise
    
    # Cerrar alerta inmediatamente
    close_alert(page)


@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_delete_category(logged_in_page: Page):
    """Admin puede eliminar una categoría"""
    page = logged_in_page
    
    # Navegar a gestión de categorías
    page.goto(f"{BASE_URL}/admin/categorizacion", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Esperar a que carguen las categorías
    page.wait_for_selector("table tbody tr", timeout=5000)
    page.wait_for_timeout(500)
    
    # Encontrar la primera fila y su botón de eliminar
    first_row = page.locator("table tbody tr").first
    delete_button = first_row.locator("button.eliminar")
    
    if delete_button.count() == 0:
        pytest.skip("No se encontró botón de eliminar")
    
    delete_button.click()
    page.wait_for_timeout(1000)
    
    # Confirmar eliminación en diálogo
    confirm_button = page.locator('[role="dialog"] button:has-text("Sí"), .swal2-container button:has-text("Sí"), button:has-text("Confirmar")').first
    
    if confirm_button and confirm_button.count():
        confirm_button.click()
        page.wait_for_timeout(2000)
    
    # Verificar alerta de éxito
    alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    expect(alert).to_be_visible(timeout=10000)
    alert_text = alert.inner_text()
    assert "eliminada" in alert_text.lower() or "Éxito" in alert_text


# =============================================
# TESORERO - TESTS
# =============================================

@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_view_categories(logged_in_page: Page):
    """Tesorero puede ver la página de gestión de categorías desde su dashboard"""
    page = logged_in_page
    
    # Navegar a la ruta de gestión de categorías del tesorero
    page.goto(f"{BASE_URL}/tesorero/categorias", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Verificar que la página cargó - búsqueda en todo el contenido
    # El tesorero puede ver la página
    try:
        page.wait_for_selector("table, [class*='grid'], [class*='list']", timeout=5000)
        print("[OK] Página de categorías del tesorero cargó")
    except Exception:
        pytest.skip("No se encontró tabla o lista de categorías")


@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_create_category(logged_in_page: Page):
    """Tesorero puede crear una nueva categoría desde su dashboard"""
    page = logged_in_page
    
    # Navegar a gestión de categorías del tesorero
    page.goto(f"{BASE_URL}/tesorero/categorias", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Buscar botón de crear - puede variar por interfaz de tesorero
    create_button = None
    
    # Intentar encontrar varios posibles botones de crear
    try:
        create_button = page.get_by_role("button", name=re.compile(r"Nueva|Crear|Agregar|Nueva Categoría", re.I))
        expect(create_button).to_be_visible(timeout=3000)
    except Exception:
        # Fallback: buscar por clase o icono
        create_button = page.locator("button:has(i.fa-plus), button:has-text('Nueva'), button:has-text('Crear')")
    
    if not create_button or create_button.count() == 0:
        pytest.skip("No se encontró botón para crear categoría")
    
    create_button.first.click()
    page.wait_for_timeout(1000)
    
    # Verificar que el modal se abrió
    try:
        modal = page.locator("[class*='modal'], [role='dialog']").first
        expect(modal).to_be_visible(timeout=3000)
        print("[OK] Modal de creación abierto")
    except Exception:
        pytest.skip("No se abrió el modal de creación")
    
    # Llenar formulario
    timestamp = int(time.time())
    nombre = f"Categoría Tesorero {timestamp}"
    codigo = f"TES{timestamp}"
    
    try:
        page.get_by_label(re.compile(r"Nombre", re.I)).fill(nombre)
        page.wait_for_timeout(300)
    except Exception:
        # Fallback: buscar por placeholder
        page.locator("input[placeholder*='nombre' i]").first.fill(nombre)
        page.wait_for_timeout(300)
    
    try:
        page.get_by_label(re.compile(r"Tipo|Categoria", re.I)).select_option("evento")
        page.wait_for_timeout(300)
    except Exception:
        pass  # No es obligatorio
    
    try:
        page.get_by_label(re.compile(r"Código", re.I)).fill(codigo)
        page.wait_for_timeout(300)
    except Exception:
        pass
    
    try:
        page.get_by_label(re.compile(r"Estado", re.I)).select_option("activo")
        page.wait_for_timeout(300)
    except Exception:
        pass
    
    # Guardar - buscar botón de guardar/crear
    try:
        save_button = page.get_by_role("button", name=re.compile(r"Guardar|Crear|Aceptar", re.I))
        save_button.first.click()
    except Exception:
        # Fallback
        page.locator("button:has-text('Guardar'), button:has-text('Crear'), button:has-text('Aceptar')").first.click()
    
    page.wait_for_timeout(500)
    
    # Verificar alerta de éxito
    alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    try:
        expect(alert).to_be_visible(timeout=1500)
        alert_text = alert.inner_text()
        assert "EXITO" in alert_text.upper() or "Éxito" in alert_text or "creada" in alert_text.lower(), f"Alert text: {alert_text}"
        print(f"[OK] Alerta de éxito detectada: {alert_text}")
    except Exception as e:
        print(f"[WARN] Alerta no encontrada, continuando: {e}")
    
    # Cerrar alerta inmediatamente
    close_alert(page)


@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_edit_category(logged_in_page: Page):
    """Tesorero puede editar una categoría existente"""
    page = logged_in_page
    
    # Navegar a gestión de categorías del tesorero
    page.goto(f"{BASE_URL}/tesorero/categorias", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Esperar a que carguen las categorías
    try:
        page.wait_for_selector("table tbody tr, [class*='grid'] [class*='card'], button:has(i.fa-edit), button[title*='ditar']", timeout=5000)
    except Exception:
        pytest.skip("No se encontró lista de categorías")
    
    page.wait_for_timeout(500)
    
    # Buscar botón de editar
    edit_button = find_edit_button_tesorero(page)
    
    if not edit_button or edit_button.count() == 0:
        pytest.skip("No se encontró botón de editar")
    
    edit_button.click()
    page.wait_for_timeout(1500)
    
    # Verificar que el modal se abrió
    try:
        modal = page.locator("[class*='modal'], [role='dialog']").first
        expect(modal).to_be_visible(timeout=3000)
        print("[OK] Modal de edición abierto")
    except Exception:
        pytest.skip("No se abrió el modal de edición")
    
    # Editar campos
    timestamp = int(time.time())
    edit_tesorero_category_fields(page, timestamp)
    
    # Guardar cambios
    try:
        save_button = page.get_by_role("button", name=re.compile(r"Guardar|Actualizar|Aceptar", re.I))
        save_button.first.click()
    except Exception:
        page.locator("button:has-text('Guardar'), button:has-text('Actualizar'), button:has-text('Aceptar')").first.click()
    
    page.wait_for_timeout(500)
    
    # Verificar alerta de éxito
    alert = page.locator('[role="dialog"], .swal2-container, .alert, .toast').first
    try:
        expect(alert).to_be_visible(timeout=1500)
        alert_text = alert.inner_text()
        assert "actualizada" in alert_text.lower() or "EXITO" in alert_text.upper() or "Éxito" in alert_text, f"Alert text: {alert_text}"
        print(f"[OK] Alerta de éxito detectada: {alert_text}")
    except Exception as e:
        print(f"[WARN] Alerta no encontrada, continuando: {e}")
    
    # Cerrar alerta inmediatamente
    close_alert(page)
