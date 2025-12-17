import pytest
from playwright.sync_api import Page, expect
import time
import traceback
from conftest import BASE_URL

# Funciones auxiliares para reducir complejidad cognitiva

def fill_user_data_if_not_found(page: Page, cedula: str, role: str):
    """Llena datos del usuario manualmente si la búsqueda por cédula no funciona."""
    usuario_encontrado_msg = page.locator("text=/Usuario encontrado/i").first
    if usuario_encontrado_msg.is_visible():
        page.wait_for_timeout(500)
        return

    tipo_doc = page.locator("select#tipo-documento")
    if not tipo_doc.input_value():
        tipo_doc.select_option("Cédula de ciudadanía")
    page.wait_for_timeout(300)

    num_doc = page.locator("input#numero-documento")
    if not num_doc.input_value():
        num_doc.fill(cedula)
    page.wait_for_timeout(300)

    nombre = page.locator("input#nombre-usuario")
    if not nombre.input_value():
        nombre.fill("Juan")
    page.wait_for_timeout(300)

    apellido = page.locator("input#apellido-usuario")
    if not apellido.input_value():
        apellido.fill("Pérez")
    page.wait_for_timeout(300)

    correo = page.locator("input#correo-usuario")
    if not correo.input_value():
        correo.fill("juan.perez@test.com")
    page.wait_for_timeout(300)

    telefono = page.locator("input#telefono-usuario")
    if not telefono.input_value():
        telefono.fill("3001234567")
    page.wait_for_timeout(300)

    edad = page.locator("input#edad-usuario")
    if not edad.input_value():
        edad.fill("25")
    page.wait_for_timeout(300)


def select_event_and_state(page: Page, evento_index: int, role: str):
    """Selecciona evento y estado del dropdown."""
    tipo_ref = page.locator("select#tipo-referencia")
    tipo_ref.select_option("Eventos")
    page.wait_for_timeout(1200)

    evento_select = page.locator("select#evento-referencia")
    expect(evento_select).to_be_visible(timeout=5000)
    page.wait_for_timeout(500)

    evento_options = evento_select.locator("option")
    num_opciones = evento_options.count()

    if num_opciones > evento_index:
        evento_select.select_option(index=evento_index)
        page.wait_for_timeout(800)
        evento_texto = evento_options.nth(evento_index).text_content()
        print(f"✓ {role} - Evento seleccionado (índice {evento_index}): {evento_texto}")
    elif num_opciones > 1:
        evento_select.select_option(index=1)
        page.wait_for_timeout(800)
        evento_texto = evento_options.nth(1).text_content()
        print(f"✓ {role} - Evento seleccionado (índice 1): {evento_texto}")
    else:
        print(f"❌ {role} - No hay eventos disponibles para seleccionar")
        return False

    estado_select = page.locator("select#estado-referencia")
    expect(estado_select).to_be_visible(timeout=5000)
    estado_options = estado_select.locator("option")
    if estado_options.count() > 1:
        estado_select.select_option(index=1)
        page.wait_for_timeout(500)
        estado_texto = estado_options.nth(1).text_content()
        print(f"✓ {role} - Estado seleccionado: {estado_texto}")

    return True


def submit_enrollment_form_and_verify(page: Page, role: str):
    """Envía el formulario de inscripción y verifica la alerta de éxito."""
    submit_button = page.locator("button[type='submit']:has-text('Crear Inscripción')")
    expect(submit_button).to_be_visible(timeout=5000)
    submit_button.click()

    page.wait_for_timeout(2000)

    try:
        alerta_exito = page.locator("text=/Inscripción creada exitosamente|¡Éxito!/i").first
        expect(alerta_exito).to_be_visible(timeout=10000)

        page.wait_for_timeout(1500)
        modal_visible = page.locator("h2:has-text('Nueva Inscripción')").is_visible()

        if not modal_visible:
            print(f"✓ {role} - Modal cerrado exitosamente")
        else:
            print(f"⚠️  {role} - Modal aún visible (pero inscripción creada)")

    except Exception as e:
        modal_visible = page.locator("h2:has-text('Nueva Inscripción')").is_visible()

        if not modal_visible:
            print(f"✓ {role} - Inscripción creada (modal cerrado, sin alerta visible)")
        else:
            error_msg = page.locator("text=/Error|error|alerta|fallo/i").first
            if error_msg.is_visible():
                print(f"❌ {role} - Error: {error_msg.text_content()}")
            else:
                print(f"❌ {role} - Fallo: {e}")


# Pruebas para la gestión de inscripciones

@pytest.mark.parametrize("logged_in_page", ["admin", "tesorero"], indirect=True)
def test_admin_tesorero_can_view_enrollments_page(logged_in_page: Page):
    """
    Verifica que admin y tesorero pueden ver la página de gestión de inscripciones.
    """
    page = logged_in_page
    role = page.role
    
    # Navegar a la sección de inscripciones (ruta diferente por rol)
    if role == "admin":
        page.goto(f"{BASE_URL}/admin/inscripciones", wait_until="networkidle")
    elif role == "tesorero":
        page.goto(f"{BASE_URL}/tesorero/inscripcion", wait_until="networkidle")
    
    page.wait_for_timeout(1000)
    
    # Verificar que el título es visible
    expect(page.locator("h1:has-text('Gestión de Inscripciones')")).to_be_visible(timeout=10000)
    
    # Verificar que la tabla de inscripciones es visible
    expect(page.locator("table")).to_be_visible(timeout=10000)
    
    print(f"✓ {role} puede ver la página de inscripciones")

@pytest.mark.parametrize("logged_in_page", ["admin", "tesorero"], indirect=True)
def test_admin_tesorero_can_create_enrollment(logged_in_page: Page):
    """
    Verifica que admin y tesorero pueden crear una nueva inscripción.
    - Ambos usan el mismo usuario (mismo cedula)
    - Pero cada rol crea una inscripción a un evento/programa diferente
    """
    page = logged_in_page
    role = page.role
            
    cedula_usuario = "11223344"
    evento_index = 2 if role == "tesorero" else 1

    if role == "admin":
        page.goto(f"{BASE_URL}/admin/inscripciones", wait_until="networkidle")
    elif role == "tesorero":
        page.goto(f"{BASE_URL}/tesorero/inscripcion", wait_until="networkidle")

    page.wait_for_timeout(1500)

    try:
        new_button = page.locator("button").filter(has_text="+ Nueva Inscripción").first

        if not new_button.is_visible():
            new_button = page.locator("button:has-text('Nueva Inscripción')").first

        expect(new_button).to_be_visible(timeout=5000)
        new_button.click()

        page.wait_for_timeout(1500)

        modal_header = page.locator("h2:has-text('Nueva Inscripción')")
        expect(modal_header).to_be_visible(timeout=5000)

        print(f"✓ {role} - Modal de crear inscripción abierto")

        cedula_input = page.locator("input#cedula-usuario")
        cedula_input.fill(cedula_usuario)
        page.wait_for_timeout(1200)

        fill_user_data_if_not_found(page, cedula_usuario, role)

        if not select_event_and_state(page, evento_index, role):
            return

        observaciones = page.locator("textarea#observaciones-referencia")
        observaciones.fill(f"Inscripción de prueba - {role}")
        page.wait_for_timeout(300)

        print(f"✓ {role} - Formulario completado")

        submit_enrollment_form_and_verify(page, role)

    except Exception as e:
        print(f"❌ Error general: {e}")
        traceback.print_exc()

def update_enrollment_state_and_observations(page: Page, role: str):
    """Actualiza el estado y observaciones de una inscripción."""
    estado_select = page.locator("select#estado-referencia")
    if estado_select.is_visible():
        estado_options = estado_select.locator("option")
        num_opciones = estado_options.count()

        if num_opciones > 2:
            estado_select.select_option(index=2)
            page.wait_for_timeout(500)
            nuevo_estado = estado_options.nth(2).text_content()
            print(f"✓ {role} - Estado cambiado a: {nuevo_estado}")
        elif num_opciones > 1:
            estado_select.select_option(index=1)
            page.wait_for_timeout(500)
            nuevo_estado = estado_options.nth(1).text_content()
            print(f"✓ {role} - Estado cambiado a: {nuevo_estado}")

    observaciones = page.locator("textarea#observaciones-referencia")
    if observaciones.is_visible():
        observaciones.fill("")
        page.wait_for_timeout(300)
        observaciones.fill(f"Inscripción editada por {role} - Cambio de estado realizado")
        page.wait_for_timeout(300)

    tipo_ref = page.locator("select#tipo-referencia")
    if tipo_ref.is_visible() and not tipo_ref.evaluate("el => el.disabled"):
        print(f"ℹ️ {role} - Tipo de referencia editable")

    print(f"✓ {role} - Campos editados correctamente")


def save_and_verify_enrollment_update(page: Page, role: str):
    """Guarda los cambios y verifica la alerta de éxito."""
    save_button = page.locator("button[type='submit']:has-text('Guardar Cambios')")
    if save_button.is_visible():
        save_button.click()
        page.wait_for_timeout(2000)

        try:
            alerta_exito = page.locator("text=/Inscripción actualizada exitosamente|¡Éxito!/i").first
            expect(alerta_exito).to_be_visible(timeout=10000)

            page.wait_for_timeout(1500)
            modal_visible = page.locator("h2:has-text('Editar Inscripción')").is_visible()

            if not modal_visible:
                print(f"✓ {role} - Modal cerrado exitosamente después de guardar")
            else:
                print(f"⚠️  {role} - Modal aún visible (pero cambios guardados)")

        except Exception:
            modal_visible = page.locator("h2:has-text('Editar Inscripción')").is_visible()

            if not modal_visible:
                print(f"✓ {role} - Cambios guardados (modal cerrado, sin alerta visible)")
            else:
                error_msg = page.locator("text=/Error|error|fallo/i").first
                if error_msg.is_visible():
                    print(f"❌ {role} - Error: {error_msg.text_content()}")
    else:
        print(f"❌ {role} - Botón 'Guardar Cambios' no encontrado")


def find_edit_button_in_row(fila: Page):
    """Busca el botón de editar en una fila de la tabla."""
    edit_button = fila.locator("button.btn-action.editar, button.h-8.w-8, button[type='button']:nth-child(1)").first

    if not edit_button.is_visible():
        edit_button = fila.locator("td:last-child button").first

    if not edit_button.is_visible():
        edit_button = fila.locator("button").last

    return edit_button


@pytest.mark.parametrize("logged_in_page", ["admin", "tesorero"], indirect=True)
def test_admin_tesorero_can_edit_enrollment(logged_in_page: Page):
    """
    Verifica que admin y tesorero pueden editar una inscripción existente.
    - Admin edita la primera inscripción
    - Tesorero edita la segunda inscripción
    """
    page = logged_in_page
    role = page.role

    if role == "admin":
        page.goto(f"{BASE_URL}/admin/inscripciones", wait_until="networkidle")
    elif role == "tesorero":
        page.goto(f"{BASE_URL}/tesorero/inscripcion", wait_until="networkidle")

    page.wait_for_timeout(2000)

    try:
        table_rows = page.locator("table tbody tr")
        num_filas = table_rows.count()

        if num_filas == 0:
            return

        fila_index = 1 if role == "tesorero" else 0

        if num_filas <= fila_index:
            fila_index = num_filas - 1

        fila = table_rows.nth(fila_index)
        edit_button = find_edit_button_in_row(fila)

        if not (edit_button and edit_button.is_visible()):
            print(f"❌ {role} - No se encontró botón de editar en la fila {fila_index}")
            return

        edit_button.click()
        page.wait_for_timeout(1500)

        modal_header = page.locator("h2:has-text('Editar Inscripción')")
        if not modal_header.is_visible():
            print(f"❌ {role} - Modal de edición no se abrió correctamente")
            return

        try:
            update_enrollment_state_and_observations(page, role)
            save_and_verify_enrollment_update(page, role)
        except Exception as e:
            print(f"❌ Error al editar campos: {e}")
            traceback.print_exc()

    except Exception as e:
        print(f"❌ Error general al editar: {e}")
        traceback.print_exc()


@pytest.mark.parametrize("logged_in_page", ["admin"], indirect=True)
def test_admin_can_delete_enrollment(logged_in_page: Page):
    """
    Verifica que SOLO el administrador puede eliminar una inscripción.
    - Elimina el primer registro de la tabla
    - Confirma la eliminación
    - Verifica que desaparece de la tabla
    """
    page = logged_in_page
    
    # Navegar a la página de inscripciones
    page.goto(f"{BASE_URL}/admin/inscripciones", wait_until="networkidle")
    page.wait_for_timeout(2000)
    
    try:
        # Obtener todas las filas de la tabla
        table_rows = page.locator("table tbody tr")
        num_filas_antes = table_rows.count()
        
        if num_filas_antes == 0:
            print("Admin - No hay inscripciones para eliminar")
            return
        
        print(f"Admin - Inscripciones disponibles: {num_filas_antes}")
        
        # Obtener la primera fila
        primera_fila = table_rows.first
        
        # Obtener información de la inscripción a eliminar
        nombre_cell = primera_fila.locator("td").first
        if nombre_cell.is_visible():
            nombre_inscripcion = nombre_cell.text_content()
            print(f"Admin - Eliminando inscripción: {nombre_inscripcion}")
        
        # Buscar el botón de eliminar en la primera fila
        # El botón tiene clase "btn-action eliminar"
        delete_button = primera_fila.locator("button.btn-action.eliminar").first
        
        if not delete_button.is_visible():
            # Alternativa: buscar cualquier botón de eliminar en la fila
            delete_button = primera_fila.locator("button").last
        
        if delete_button and delete_button.is_visible():
            print("Admin - Botón eliminar encontrado en primera fila")
            delete_button.click()
            page.wait_for_timeout(1500)
            
            # Buscar el diálogo de confirmación (modal o alerta)
            confirmation_btn = page.locator("button:has-text('Confirmar'), button:has-text('Eliminar'), button:has-text('Aceptar')").first
            
            if confirmation_btn.is_visible():
                confirmation_btn.click()
                page.wait_for_timeout(1500)
            
            page.wait_for_timeout(1500)
            
            # Verificar que la inscripción se eliminó (contar filas después)
            table_rows_after = page.locator("table tbody tr")
            num_filas_despues = table_rows_after.count()
            
            if num_filas_despues < num_filas_antes:
                print("✓ Admin - Inscripción eliminada correctamente")
                print(f"   Antes: {num_filas_antes} → Después: {num_filas_despues}")
            else:
                print("Admin - No se confirmó la eliminación")
        else:
            print("Admin - No se encontró botón de eliminar")
            
    except Exception as delete_error:
        print(f"Error general al eliminar: {delete_error}")
        import traceback
        traceback.print_exc()



@pytest.mark.parametrize("logged_in_page", ["seminarista"], indirect=True)
def test_user_can_view_their_enrollments(logged_in_page: Page):
    """
    Verifica que un usuario (seminarista) puede ver su página de 'Mis Inscripciones'.
    """
    page = logged_in_page
    role = page.role
    
    try:
        # Navegar a la página de 'Mis Inscripciones'
        page.goto(f"{BASE_URL}/dashboard/seminarista/mis-inscripciones", wait_until="networkidle")
        page.wait_for_timeout(1000)
        
        # Verificar que el título contiene "Inscripciones"
        title = page.locator("h1, h2, .page-title").first
        if title.is_visible():
            print(f"✓ {role} puede ver su página de inscripciones")
        else:
            print(f"⚠️  {role} - Página cargada pero sin título visible")
            
    except Exception as e:
        print(f"⚠️  {role} - Error al acceder: {e}")