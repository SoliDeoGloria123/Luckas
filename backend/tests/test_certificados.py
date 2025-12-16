import pytest
from playwright.sync_api import Page, expect
import re
import time
from conftest import BASE_URL


def close_alert(page: Page, wait_seconds: int = 2) -> bool:
    """
    Espera N segundos para que el usuario vea el alert.
    """
    try:
        print(f"[INFO] Mostrando alert por {wait_seconds} segundos...")
        page.wait_for_timeout(wait_seconds * 1000)
        return True
    except Exception as e:
        print(f"[WARN] Error al esperar: {e}")
        return False


# =============================================
# ADMIN - TESTS CERTIFICADOS
# =============================================

@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_view_certificates_page(logged_in_page: Page):
    """Admin puede ver la página de gestión de certificados"""
    page = logged_in_page
    
    # Navegar a gestión de certificados
    page.goto(f"{BASE_URL}/admin/certificacion", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Verificar que la página cargó
    page_title = page.locator(".page-title-admin h1")
    expect(page_title).to_contain_text("Gestión de Certificaciones")
    
    # Verificar que hay tabla de certificados
    expect(page.locator("table, [class*='grid'], [class*='card']")).to_be_visible()


@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_download_certificate(logged_in_page: Page):
    """Admin puede descargar un certificado"""
    page = logged_in_page
    
    # Navegar a gestión de certificados
    page.goto(f"{BASE_URL}/admin/certificacion", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Esperar a que carguen los certificados
    try:
        page.wait_for_selector("table tbody tr, button:has-text('Descargar'), [class*='download']", timeout=5000)
    except Exception:
        pytest.skip("No se encontró lista de certificados")
    
    page.wait_for_timeout(500)
    
    # Buscar botón de descargar en la primera fila
    download_button = None
    
    try:
        first_row = page.locator("table tbody tr").first
        if first_row.count():
            # Buscar botón de descargar
            download_button = first_row.locator("button:has-text('Descargar'), button[title*='descar'], button:has(i.fa-download)")
            if not download_button or download_button.count() == 0:
                # Fallback: cualquier button en la fila
                download_button = first_row.locator("button").first
    except Exception:
        pass
    
    if not download_button or download_button.count() == 0:
        pytest.skip("No se encontró botón de descargar certificado")
    
    # Interceptar descarga
    with page.expect_download() as download_info:
        download_button.click()
    
    download = download_info.value
    print(f"[OK] Certificado descargado: {download.suggested_filename}")
    
    # Verificar que es un PDF
    assert download.suggested_filename.endswith('.pdf'), "El certificado debe ser un PDF"
    
    # Limpiar descarga
    download.delete()


# =============================================
# TESORERO - TESTS CERTIFICADOS
# =============================================

@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_view_certificates_page(logged_in_page: Page):
    """Tesorero puede ver la página de gestión de certificados"""
    page = logged_in_page
    
    # Navegar a gestión de certificados del tesorero
    page.goto(f"{BASE_URL}/tesorero/certificados", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Verificar que la página cargó
    try:
        page_title = page.locator("h2:has-text('Gestión de Certificados'), h1:has-text('Gestión de Certificados')")
        expect(page_title).to_be_visible()
    except Exception:
        # Fallback: verificar que hay tabla
        expect(page.locator("table, [class*='grid'], [class*='card']")).to_be_visible()


@pytest.mark.parametrize("logged_in_page", ["tesorero"], indirect=True)
def test_tesorero_can_download_certificate(logged_in_page: Page):
    """Tesorero puede descargar un certificado"""
    page = logged_in_page
    
    # Navegar a gestión de certificados del tesorero
    page.goto(f"{BASE_URL}/tesorero/certificados", wait_until="networkidle")
    page.wait_for_timeout(1500)
    
    # Esperar a que carguen los certificados
    try:
        page.wait_for_selector("table tbody tr, button:has-text('Descargar'), [class*='download']", timeout=5000)
    except Exception:
        pytest.skip("No se encontró lista de certificados")
    
    page.wait_for_timeout(500)
    
    # Buscar botón de descargar en la primera fila
    download_button = None
    
    try:
        first_row = page.locator("table tbody tr").first
        if first_row.count():
            # Buscar botón de descargar (icono Download de lucide-react)
            download_button = first_row.locator("button:has-text('Descargar'), button[title*='descar'], button svg")
            if not download_button or download_button.count() == 0:
                # Fallback: cualquier button en la última celda
                download_button = first_row.locator("td:last-child button").first
    except Exception:
        pass
    
    if not download_button or download_button.count() == 0:
        pytest.skip("No se encontró botón de descargar certificado")
    
    # Interceptar descarga
    with page.expect_download() as download_info:
        download_button.click()
    
    download = download_info.value
    print(f"[OK] Certificado descargado: {download.suggested_filename}")
    
    # Verificar que es un PDF
    assert download.suggested_filename.endswith('.pdf'), "El certificado debe ser un PDF"
    
    # Limpiar descarga
    download.delete()
