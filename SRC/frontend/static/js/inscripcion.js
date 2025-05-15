document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos de navegación y pasos
    const steps = document.querySelectorAll('.step');
    const formSections = document.querySelectorAll('.form-section');
    
    // Botones de navegación
    const btnSiguientePaso1 = document.getElementById('btn-siguiente-paso1');
    const btnSiguientePaso2 = document.getElementById('btn-siguiente-paso2');
    const btnRegresarPaso2 = document.getElementById('btn-regresar-paso2');
    const btnDescargarComprobante = document.getElementById('btn-descargar-comprobante');
    
    // Campos para añadir personas
    const radioOtraPersona = document.querySelectorAll('input[name="otra-persona"]');
    const personasAdicionalesContainer = document.getElementById('personas-adicionales');
    const btnAgregarPersona = document.getElementById('agregar-persona');
    
    // Campo de hospedaje
    const radioHospedajeAnterior = document.querySelectorAll('input[name="hospedaje-anterior"]');
    
    // Campos del método de pago
    const selectMetodoPago = document.getElementById('metodo-pago');
    const detallesPago = document.getElementById('detalles-pago');
    const pagoTarjeta = document.getElementById('pago-tarjeta');
    const pagoPSE = document.getElementById('pago-pse');
    const pagoTransferencia = document.getElementById('pago-transferencia');
    
    // Elementos de resumen
    const subtotalInscripciones = document.getElementById('subtotal-inscripciones');
    const costoHospedaje = document.getElementById('costo-hospedaje');
    const totalPagar = document.getElementById('total-pagar');
    
    // Estado del formulario
    let formState = {
        participantePrincipal: {
            hospedajeAnterior: false
        },
        participantesAdicionales: [],
        evento: {
            id: '',
            titulo: 'Conferencia de Teología',
            precio: 150000,
            fecha: '16 de mayo, 2025'
        },
        costos: {
            precioEvento: 150000,
            precioHospedaje: 14000,
            totalHospedaje: 0,
            total: 150000
        },
        metodoPago: ''
    };
    
    // Obtener datos del evento desde URL
    function obtenerDatosEvento() {
        const params = new URLSearchParams(window.location.search);
        const eventoId = params.get('id');
        
        if (eventoId) {
            formState.evento.id = eventoId;
            // Aquí normalmente harías una petición para obtener los datos del evento
            // Pero para este ejemplo, usaremos datos estáticos
        }
    }
    
    // Inicializar la página
    function inicializar() {
        obtenerDatosEvento();
        actualizarResumenCostos();
        
        // Event listeners para navegación
        btnSiguientePaso1.addEventListener('click', irPaso2);
        btnRegresarPaso2.addEventListener('click', irPaso1);
        btnSiguientePaso2.addEventListener('click', irPaso3);
        
        // Mostrar/ocultar formularios para personas adicionales
        radioOtraPersona.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'si' && this.checked) {
                    personasAdicionalesContainer.classList.remove('hidden');
                    btnAgregarPersona.classList.remove('hidden');
                    agregarPersonaAdicional();
                } else {
                    personasAdicionalesContainer.classList.add('hidden');
                    btnAgregarPersona.classList.add('hidden');
                    personasAdicionalesContainer.innerHTML = '';
                    formState.participantesAdicionales = [];
                    actualizarResumenCostos();
                }
            });
        });
        
        // Añadir nueva persona
        btnAgregarPersona.addEventListener('click', agregarPersonaAdicional);
        
        // Actualizar costos cuando cambia la opción de hospedaje
        radioHospedajeAnterior.forEach(radio => {
            radio.addEventListener('change', function() {
                formState.participantePrincipal.hospedajeAnterior = (this.value === 'si');
                actualizarResumenCostos();
            });
        });
        
        // Mostrar campos según el método de pago
        selectMetodoPago.addEventListener('change', function() {
            const metodoPago = this.value;
            formState.metodoPago = metodoPago;
            
            if (metodoPago) {
                detallesPago.classList.remove('hidden');
                pagoTarjeta.classList.add('hidden');
                pagoPSE.classList.add('hidden');
                pagoTransferencia.classList.add('hidden');
                
                switch (metodoPago) {
                    case 'tarjeta':
                        pagoTarjeta.classList.remove('hidden');
                        break;
                    case 'pse':
                        pagoPSE.classList.remove('hidden');
                        break;
                    case 'transferencia':
                        pagoTransferencia.classList.remove('hidden');
                        break;
                }
            } else {
                detallesPago.classList.add('hidden');
            }
        });
        
        // Simular cambio de estado (en una aplicación real esto vendría del servidor)
        setTimeout(function() {
            document.getElementById('estado-pendiente').classList.add('hidden');
            document.getElementById('estado-aprobado').classList.remove('hidden');
        }, 5000);
    }
    
    // Crear formulario para una persona adicional
    function agregarPersonaAdicional() {
        const personaIndex = formState.participantesAdicionales.length;
        const personaId = `persona-${personaIndex + 1}`;
        
        // Crear elemento para la persona adicional
        const personaElement = document.createElement('div');
        personaElement.classList.add('additional-person');
        personaElement.dataset.personaId = personaId;
        
        // Añadir HTML del formulario
        personaElement.innerHTML = `
            <h4>
                Participante adicional #${personaIndex + 1}
                <button type="button" class="remove-person" data-persona-id="${personaId}">
                    <i class="fas fa-times"></i>
                </button>
            </h4>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="${personaId}-nombres">Nombres</label>
                    <input type="text" id="${personaId}-nombres" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="${personaId}-apellidos">Apellidos</label>
                    <input type="text" id="${personaId}-apellidos" class="form-control" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="${personaId}-tipo-documento">Tipo de Documento</label>
                    <select id="${personaId}-tipo-documento" class="form-control" required>
                        <option value="">Seleccione</option>
                        <option value="cc">Cédula de Ciudadanía</option>
                        <option value="ce">Cédula de Extranjería</option>
                        <option value="pasaporte">Pasaporte</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="${personaId}-documento">Número de Documento</label>
                    <input type="text" id="${personaId}-documento" class="form-control" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="${personaId}-correo">Correo Electrónico</label>
                    <input type="email" id="${personaId}-correo" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="${personaId}-edad">Edad</label>
                    <input type="number" id="${personaId}-edad" class="form-control" min="18" max="100" required>
                </div>
            </div>
            
            <div class="form-group">
                <label for="${personaId}-iglesia">Iglesia a la que pertenece</label>
                <select id="${personaId}-iglesia" class="form-control" required>
                    <option value="">Seleccione</option>
                    <option value="iglesia1">Primera Iglesia Bautista de Bogotá</option>
                    <option value="iglesia2">Iglesia Bautista Central de Medellín</option>
                    <option value="iglesia3">Iglesia Bautista El Redil</option>
                    <option value="iglesia4">Iglesia Bautista Esperanza Viva</option>
                    <option value="iglesia5">Otra</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>¿Misma persona que inscribe?</label>
                <div class="form-check">
                    <input type="checkbox" id="${personaId}-misma-persona" class="same-as-main">
                    <label for="${personaId}-misma-persona">Usar mis datos</label>
                </div>
            </div>
            
            <div class="form-group">
                <label>¿Necesita hospedaje la noche anterior al evento?</label>
                <div class="form-check">
                    <input type="radio" name="${personaId}-hospedaje" id="${personaId}-hospedaje-si" value="si" class="hospedaje-radio">
                    <label for="${personaId}-hospedaje-si">Sí, deseo reservar ($14.000 por noche)</label>
                </div>
                <div class="form-check">
                    <input type="radio" name="${personaId}-hospedaje" id="${personaId}-hospedaje-no" value="no" class="hospedaje-radio" checked>
                    <label for="${personaId}-hospedaje-no">No</label>
                </div>
            </div>
        `;
        
        // Añadir al contenedor
        personasAdicionalesContainer.appendChild(personaElement);
        
        // Añadir a estado del formulario
        formState.participantesAdicionales.push({
            id: personaId,
            hospedajeAnterior: false
        });
        
        // Actualizar costos
        actualizarResumenCostos();
        
        // Event listeners para esta persona
        const btnEliminar = personaElement.querySelector('.remove-person');
        btnEliminar.addEventListener('click', function() {
            const personaId = this.dataset.personaId;
            eliminarPersona(personaId);
        });
        
        // Event listener para opción "Misma persona que inscribe"
        const chkMismaPersona = personaElement.querySelector('.same-as-main');
        chkMismaPersona.addEventListener('change', function() {
            if (this.checked) {
                // Copiar datos del participante principal
                personaElement.querySelector(`#${personaId}-nombres`).value = document.getElementById('nombres').value;
                personaElement.querySelector(`#${personaId}-apellidos`).value = document.getElementById('apellidos').value;
                personaElement.querySelector(`#${personaId}-correo`).value = document.getElementById('correo').value;
            } else {
                // Limpiar campos
                personaElement.querySelector(`#${personaId}-nombres`).value = '';
                personaElement.querySelector(`#${personaId}-apellidos`).value = '';
                personaElement.querySelector(`#${personaId}-correo`).value = '';
            }
        });
        
        // Event listener para radio de hospedaje
        const radiosHospedaje = personaElement.querySelectorAll('.hospedaje-radio');
        radiosHospedaje.forEach(radio => {
            radio.addEventListener('change', function() {
                const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
                if (personaIndex !== -1) {
                    formState.participantesAdicionales[personaIndex].hospedajeAnterior = (this.value === 'si');
                    actualizarResumenCostos();
                }
            });
        });
    }
    
    // Eliminar persona adicional
    function eliminarPersona(personaId) {
        // Eliminar del DOM
        const personaElement = document.querySelector(`.additional-person[data-persona-id="${personaId}"]`);
        if (personaElement) {
            personaElement.remove();
        }
        
        // Eliminar del estado
        formState.participantesAdicionales = formState.participantesAdicionales.filter(p => p.id !== personaId);
        
        // Actualizar costos
        actualizarResumenCostos();
    }
    
    // Actualizar resumen de costos
    function actualizarResumenCostos() {
        // Calcular número de participantes
        const numParticipantes = 1 + formState.participantesAdicionales.length;
        
        // Calcular costo de inscripciones
        const costoInscripciones = numParticipantes * formState.costos.precioEvento;
        
        // Calcular costo de hospedaje
        let costoTotalHospedaje = 0;
        
        // Hospedaje para participante principal
        if (formState.participantePrincipal.hospedajeAnterior) {
            costoTotalHospedaje += formState.costos.precioHospedaje;
        }
        
        // Hospedaje para participantes adicionales
        formState.participantesAdicionales.forEach(participante => {
            if (participante.hospedajeAnterior) {
                costoTotalHospedaje += formState.costos.precioHospedaje;
            }
        });
        
        // Actualizar totales
        formState.costos.totalHospedaje = costoTotalHospedaje;
        formState.costos.total = costoInscripciones + costoTotalHospedaje;
        
        // Actualizar UI
        subtotalInscripciones.textContent = `$${formatNumber(costoInscripciones)}`;
        costoHospedaje.textContent = `$${formatNumber(costoTotalHospedaje)}`;
        totalPagar.textContent = `$${formatNumber(formState.costos.total)}`;
        
        // Actualizar resumen de inscripción
        actualizarResumenInscripcion();
    }
    
    // Actualizar resumen de inscripción en paso 2
    function actualizarResumenInscripcion() {
        const resumenInscripcion = document.getElementById('resumen-inscripcion');
        if (!resumenInscripcion) return;
        
        let html = '';
        
        // Participante principal
        const nombreCompleto = document.getElementById('nombres')?.value + ' ' + document.getElementById('apellidos')?.value;
        if (nombreCompleto.trim() !== ' ') {
            html += `
                <div class="summary-item">
                    <div class="summary-label">Participante:</div>
                    <div class="summary-value">${nombreCompleto}</div>
                </div>
            `;
        }
        
        // Participantes adicionales
        if (formState.participantesAdicionales.length > 0) {
            formState.participantesAdicionales.forEach((participante, index) => {
                const personaElement = document.querySelector(`.additional-person[data-persona-id="${participante.id}"]`);
                if (personaElement) {
                    const nombre = personaElement.querySelector(`#${participante.id}-nombres`)?.value || '';
                    const apellido = personaElement.querySelector(`#${participante.id}-apellidos`)?.value || '';
                    
                    if (nombre || apellido) {
                        html += `
                            <div class="summary-item">
                                <div class="summary-label">Adicional ${index + 1}:</div>
                                <div class="summary-value">${nombre} ${apellido}</div>
                            </div>
                        `;
                    }
                }
            });
        }
        
        resumenInscripcion.innerHTML = html;
        
        // Actualizar también el resumen final en el paso 3
        const resumenParticipante = document.getElementById('resumen-participante');
        const resumenEvento = document.getElementById('resumen-evento');
        const resumenFecha = document.getElementById('resumen-fecha');
        const resumenTotal = document.getElementById('resumen-total');
        const resumenAdicionales = document.getElementById('resumen-adicionales');
        const resumenPago = document.getElementById('resumen-pago');
        
        if (resumenParticipante && nombreCompleto.trim() !== ' ') {
            resumenParticipante.textContent = nombreCompleto;
        }
        
        if (resumenEvento) {
            resumenEvento.textContent = formState.evento.titulo;
        }
        
        if (resumenFecha) {
            resumenFecha.textContent = formState.evento.fecha;
        }
        
        if (resumenTotal) {
            resumenTotal.textContent = `$${formatNumber(formState.costos.total)}`;
        }
        
        if (resumenPago) {
            let metodoPagoTexto = '';
            switch (formState.metodoPago) {
                case 'tarjeta': metodoPagoTexto = 'Tarjeta de Crédito/Débito'; break;
                case 'pse': metodoPagoTexto = 'PSE - Pagos en línea'; break;
                case 'transferencia': metodoPagoTexto = 'Transferencia Bancaria'; break;
                default: metodoPagoTexto = 'Pendiente selección';
            }
            resumenPago.textContent = metodoPagoTexto;
        }
        
        // Actualizar adicionales en paso 3
        if (resumenAdicionales) {
            let htmlAdicionales = '';
            formState.participantesAdicionales.forEach((participante, index) => {
                const personaElement = document.querySelector(`.additional-person[data-persona-id="${participante.id}"]`);
                if (personaElement) {
                    const nombre = personaElement.querySelector(`#${participante.id}-nombres`)?.value || '';
                    const apellido = personaElement.querySelector(`#${participante.id}-apellidos`)?.value || '';
                    
                    if (nombre || apellido) {
                        htmlAdicionales += `
                            <div class="summary-item">
                                <div class="summary-label">Participante adicional ${index + 1}:</div>
                                <div class="summary-value">${nombre} ${apellido}</div>
                            </div>
                        `;
                    }
                }
            });
            resumenAdicionales.innerHTML = htmlAdicionales;
        }
    }
    
    // Navegar al paso 2
    function irPaso2() {
        // Aquí deberías validar el formulario del paso 1
        const esValido = validarPaso1();
        
        if (esValido) {
            // Actualizar UI de navegación
            steps.forEach(step => step.classList.remove('active', 'completed'));
            steps[0].classList.add('completed');
            steps[1].classList.add('active');
            
            // Mostrar sección correspondiente
            formSections.forEach(section => section.classList.remove('active'));
            formSections[1].classList.add('active');
            
            // Actualizar información en el paso 2
            actualizarResumenInscripcion();
            
            // Scroll al inicio de la página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Regresar al paso 1
    function irPaso1() {
        // Actualizar UI de navegación
        steps.forEach(step => step.classList.remove('active', 'completed'));
        steps[0].classList.add('active');
        
        // Mostrar sección correspondiente
        formSections.forEach(section => section.classList.remove('active'));
        formSections[0].classList.add('active');
        
        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Navegar al paso 3
    function irPaso3() {
        // Aquí deberías validar el formulario del paso 2
        const esValido = validarPaso2();
        
        if (esValido) {
            // Actualizar UI de navegación
            steps.forEach(step => step.classList.remove('active', 'completed'));
            steps[0].classList.add('completed');
            steps[1].classList.add('completed');
            steps[2].classList.add('active');
            
            // Mostrar sección correspondiente
            formSections.forEach(section => section.classList.remove('active'));
            formSections[2].classList.add('active');
            
            // Actualizar información final
            actualizarResumenFinal();
            
            // Scroll al inicio de la página
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // Validar campos del paso 1 (básico)
    function validarPaso1() {
        // En una implementación real, se validarían todos los campos requeridos
        const nombres = document.getElementById('nombres').value;
        const apellidos = document.getElementById('apellidos').value;
        const tipoDocumento = document.getElementById('tipo-documento').value;
        const documento = document.getElementById('documento').value;
        
        if (!nombres || !apellidos || !tipoDocumento || !documento) {
            alert('Por favor complete los campos obligatorios.');
            return false;
        }
        
        return true;
    }
    
    // Validar campos del paso 2 (básico)
    function validarPaso2() {
        const metodoPago = document.getElementById('metodo-pago').value;
        
        if (!metodoPago) {
            alert('Por favor seleccione un método de pago.');
            return false;
        }
        
        // Validaciones específicas según el método de pago
        if (metodoPago === 'tarjeta') {
            const numeroTarjeta = document.getElementById('numero-tarjeta').value;
            const nombreTarjeta = document.getElementById('nombre-tarjeta').value;
            
            if (!numeroTarjeta || !nombreTarjeta) {
                alert('Por favor complete los datos de la tarjeta.');
                return false;
            }
        } else if (metodoPago === 'pse') {
            const banco = document.getElementById('banco').value;
            
            if (!banco) {
                alert('Por favor seleccione un banco.');
                return false;
            }
        } else if (metodoPago === 'transferencia') {
            const comprobante = document.getElementById('comprobante').value;
            
            if (!comprobante) {
                alert('Por favor cargue el comprobante de pago.');
                return false;
            }
        }
        
        return true;
    }
    
    // Actualizar resumen final en el paso 3
    function actualizarResumenFinal() {
        // Ya lo hacemos en actualizarResumenInscripcion(), pero podríamos hacer cosas específicas aquí
    }
    
    // Función para formatear números como moneda
    function formatNumber(number) {
        return new Intl.NumberFormat('es-CO').format(number);
    }
    
    // Iniciar la página
    inicializar();
});