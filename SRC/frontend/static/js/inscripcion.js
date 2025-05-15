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
            nombres: '',
            apellidos: '',
            tipoDocumento: '',
            documento: '',
            correo: '',
            telefono: '',
            edad: '',
            iglesia: '',
            hospedajeAnterior: false
        },
        participantesAdicionales: [],
        evento: {
            id: '',
            titulo: 'Conferencia de Teología',
            precio: 150000,
            fecha: '16 de mayo, 2025',
            imagen: 'images/events/conference.jpg',
            ubicacion: 'Auditorio Principal'
        },
        costos: {
            precioEvento: 150000,
            precioHospedaje: 14000,
            totalHospedaje: 0,
            total: 150000
        },
        metodoPago: '',
        fechaInscripcion: new Date(),
        codigoInscripcion: generarCodigoInscripcion()
    };
    
    // Obtener datos del evento desde URL
    function obtenerDatosEvento() {
        const params = new URLSearchParams(window.location.search);
        const eventoId = params.get('id');
        
        if (eventoId && eventosData[eventoId]) {
            const evento = eventosData[eventoId];
            formState.evento.id = eventoId;
            formState.evento.titulo = evento.title;
            formState.evento.imagen = evento.image;
            formState.evento.fecha = evento.date;
            formState.evento.precio = parseFloat(evento.price.replace(/[^\d]/g, ''));
            formState.costos.precioEvento = formState.evento.precio;
            formState.costos.total = formState.evento.precio;
            formState.evento.ubicacion = evento.location.split('<p>')[1].split('</p>')[0];
            
            // Actualizar elementos visuales
            document.getElementById('event-title').textContent = formState.evento.titulo;
            document.getElementById('event-date').textContent = formState.evento.fecha;
            document.getElementById('event-location').textContent = formState.evento.ubicacion;
            document.getElementById('event-price').textContent = `$${formatNumber(formState.evento.precio)}`;
            document.getElementById('event-image').src = formState.evento.imagen;
        }
    }
    
    // Inicializar la página
    function inicializar() {
        obtenerDatosEvento();
        actualizarResumenCostos();
        
        // Event listeners para navegación
        if (btnSiguientePaso1) btnSiguientePaso1.addEventListener('click', irPaso2);
        if (btnRegresarPaso2) btnRegresarPaso2.addEventListener('click', irPaso1);
        if (btnSiguientePaso2) btnSiguientePaso2.addEventListener('click', irPaso3);
        
        // Evento para el botón de descargar comprobante
        if (btnDescargarComprobante) {
            btnDescargarComprobante.addEventListener('click', function(e) {
                e.preventDefault();
                generarComprobantePDF();
            });
        }
        
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
        if (btnAgregarPersona) {
            btnAgregarPersona.addEventListener('click', agregarPersonaAdicional);
        }
        
        // Actualizar costos cuando cambia la opción de hospedaje
        radioHospedajeAnterior.forEach(radio => {
            radio.addEventListener('change', function() {
                formState.participantePrincipal.hospedajeAnterior = (this.value === 'si');
                actualizarResumenCostos();
            });
        });
        
        // Mostrar campos según el método de pago
        if (selectMetodoPago) {
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
        }
        
        // Capturar datos del participante principal cuando cambian
        document.getElementById('nombres')?.addEventListener('change', function() {
            formState.participantePrincipal.nombres = this.value;
        });
        
        document.getElementById('apellidos')?.addEventListener('change', function() {
            formState.participantePrincipal.apellidos = this.value;
        });
        
        document.getElementById('tipo-documento')?.addEventListener('change', function() {
            formState.participantePrincipal.tipoDocumento = this.value;
        });
        
        document.getElementById('documento')?.addEventListener('change', function() {
            formState.participantePrincipal.documento = this.value;
        });
        
        document.getElementById('correo')?.addEventListener('change', function() {
            formState.participantePrincipal.correo = this.value;
        });
        
        document.getElementById('telefono')?.addEventListener('change', function() {
            formState.participantePrincipal.telefono = this.value;
        });
        
        document.getElementById('edad')?.addEventListener('change', function() {
            formState.participantePrincipal.edad = this.value;
        });
        
        document.getElementById('iglesia')?.addEventListener('change', function() {
            formState.participantePrincipal.iglesia = this.value;
        });
        
        // Simular cambio de estado (en una aplicación real esto vendría del servidor)
        setTimeout(function() {
            document.getElementById('estado-pendiente')?.classList.add('hidden');
            document.getElementById('estado-aprobado')?.classList.remove('hidden');
            
            // Guardar la inscripción en localStorage para mostrar en el dashboard
            guardarInscripcionEnLocal();
            
            // Añadir notificación
            crearNotificacion();
        }, 5000);
    }
    
    // Guardar la inscripción en localStorage para mostrarla en el dashboard
    function guardarInscripcionEnLocal() {
        // Construir datos de la inscripción
        const inscripcion = {
            id: formState.codigoInscripcion,
            eventoId: formState.evento.id,
            eventoTitulo: formState.evento.titulo,
            eventoImagen: formState.evento.imagen,
            fecha: formState.fechaInscripcion.toISOString(),
            participante: `${formState.participantePrincipal.nombres} ${formState.participantePrincipal.apellidos}`,
            monto: formState.costos.total,
            estado: 'aprobado',
            metodoPago: formState.metodoPago
        };
        
        // Recuperar inscripciones existentes o crear nuevo array
        let inscripciones = JSON.parse(localStorage.getItem('inscripciones') || '[]');
        inscripciones.unshift(inscripcion); // Añadir al principio para que aparezca primero
        
        // Limitar a 10 inscripciones para no sobrecargar el localStorage
        if (inscripciones.length > 10) {
            inscripciones = inscripciones.slice(0, 10);
        }
        
        // Guardar en localStorage
        localStorage.setItem('inscripciones', JSON.stringify(inscripciones));
        
        // Actualizar contador de notificaciones
        let notificaciones = JSON.parse(localStorage.getItem('notificaciones') || '[]');
        notificaciones.unshift({
            id: Date.now(),
            tipo: 'inscripcion',
            mensaje: `Inscripción confirmada: ${formState.evento.titulo}`,
            leida: false,
            fecha: new Date().toISOString()
        });
        
        // Limitar notificaciones
        if (notificaciones.length > 10) {
            notificaciones = notificaciones.slice(0, 10);
        }
        
        localStorage.setItem('notificaciones', JSON.stringify(notificaciones));
        localStorage.setItem('contadorNotificaciones', notificaciones.filter(n => !n.leida).length);
    }
    
    // Crear notificación para mostrar al usuario
    function crearNotificacion() {
        // En una implementación real, esto se conectaría con un sistema de notificaciones
        // Por ahora, lo simulamos actualizando el contador de notificaciones en el header
        const badgeElement = document.querySelector('.header-icon-button.notifications .badge');
        if (badgeElement) {
            const currentCount = parseInt(badgeElement.textContent) || 0;
            badgeElement.textContent = currentCount + 1;
        }
    }
    
    // Generar un código único para la inscripción
    function generarCodigoInscripcion() {
        const timestamp = Date.now().toString().slice(-6);
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `SBC-${timestamp}-${random}`;
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
            nombres: '',
            apellidos: '',
            tipoDocumento: '',
            documento: '',
            correo: '',
            edad: '',
            iglesia: '',
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
                
                // Actualizar el estado
                const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
                if (personaIndex !== -1) {
                    formState.participantesAdicionales[personaIndex].nombres = formState.participantePrincipal.nombres;
                    formState.participantesAdicionales[personaIndex].apellidos = formState.participantePrincipal.apellidos;
                    formState.participantesAdicionales[personaIndex].correo = formState.participantePrincipal.correo;
                }
            } else {
                // Limpiar campos
                personaElement.querySelector(`#${personaId}-nombres`).value = '';
                personaElement.querySelector(`#${personaId}-apellidos`).value = '';
                personaElement.querySelector(`#${personaId}-correo`).value = '';
                
                // Actualizar el estado
                const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
                if (personaIndex !== -1) {
                    formState.participantesAdicionales[personaIndex].nombres = '';
                    formState.participantesAdicionales[personaIndex].apellidos = '';
                    formState.participantesAdicionales[personaIndex].correo = '';
                }
            }
        });
        
        // Event listener para los campos de texto
        personaElement.querySelector(`#${personaId}-nombres`).addEventListener('change', function() {
            const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
            if (personaIndex !== -1) {
                formState.participantesAdicionales[personaIndex].nombres = this.value;
            }
        });
        
        personaElement.querySelector(`#${personaId}-apellidos`).addEventListener('change', function() {
            const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
            if (personaIndex !== -1) {
                formState.participantesAdicionales[personaIndex].apellidos = this.value;
            }
        });
        
        personaElement.querySelector(`#${personaId}-tipo-documento`).addEventListener('change', function() {
            const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
            if (personaIndex !== -1) {
                formState.participantesAdicionales[personaIndex].tipoDocumento = this.value;
            }
        });
        
        personaElement.querySelector(`#${personaId}-documento`).addEventListener('change', function() {
            const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
            if (personaIndex !== -1) {
                formState.participantesAdicionales[personaIndex].documento = this.value;
            }
        });
        
        personaElement.querySelector(`#${personaId}-correo`).addEventListener('change', function() {
            const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
            if (personaIndex !== -1) {
                formState.participantesAdicionales[personaIndex].correo = this.value;
            }
        });
        
        personaElement.querySelector(`#${personaId}-edad`).addEventListener('change', function() {
            const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
            if (personaIndex !== -1) {
                formState.participantesAdicionales[personaIndex].edad = this.value;
            }
        });
        
        personaElement.querySelector(`#${personaId}-iglesia`).addEventListener('change', function() {
            const personaIndex = formState.participantesAdicionales.findIndex(p => p.id === personaId);
            if (personaIndex !== -1) {
                formState.participantesAdicionales[personaIndex].iglesia = this.value;
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
        if (subtotalInscripciones) subtotalInscripciones.textContent = `$${formatNumber(costoInscripciones)}`;
        if (costoHospedaje) costoHospedaje.textContent = `$${formatNumber(costoTotalHospedaje)}`;
        if (totalPagar) totalPagar.textContent = `$${formatNumber(formState.costos.total)}`;
        
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
        const resumenCodigo = document.getElementById('resumen-codigo');
        
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
        
        if (resumenCodigo) {
            resumenCodigo.textContent = formState.codigoInscripcion;
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
        const nombres = document.getElementById('nombres')?.value;
        const apellidos = document.getElementById('apellidos')?.value;
        const tipoDocumento = document.getElementById('tipo-documento')?.value;
        const documento = document.getElementById('documento')?.value;
        const correo = document.getElementById('correo')?.value;
        
        if (!nombres || !apellidos || !tipoDocumento || !documento || !correo) {
            alert('Por favor complete los campos obligatorios del participante principal.');
            return false;
        }
        
        // Actualizar el estado
        formState.participantePrincipal.nombres = nombres;
        formState.participantePrincipal.apellidos = apellidos;
        formState.participantePrincipal.tipoDocumento = tipoDocumento;
        formState.participantePrincipal.documento = documento;
        formState.participantePrincipal.correo = correo;
        
        // Validar participantes adicionales
        if (formState.participantesAdicionales.length > 0) {
            for (const participante of formState.participantesAdicionales) {
                const personaElement = document.querySelector(`.additional-person[data-persona-id="${participante.id}"]`);
                if (personaElement) {
                    const nombre = personaElement.querySelector(`#${participante.id}-nombres`)?.value;
                    const apellido = personaElement.querySelector(`#${participante.id}-apellidos`)?.value;
                    const doc = personaElement.querySelector(`#${participante.id}-documento`)?.value;
                    
                    if (!nombre || !apellido || !doc) {
                        alert(`Por favor complete los campos obligatorios del participante adicional.`);
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    // Validar campos del paso 2 (básico)
    function validarPaso2() {
        const metodoPago = document.getElementById('metodo-pago')?.value;
        
        if (!metodoPago) {
            alert('Por favor seleccione un método de pago.');
            return false;
        }
        
        // Validaciones específicas según el método de pago
        if (metodoPago === 'tarjeta') {
            const numeroTarjeta = document.getElementById('numero-tarjeta')?.value;
            const nombreTarjeta = document.getElementById('nombre-tarjeta')?.value;
            
            if (!numeroTarjeta || !nombreTarjeta) {
                alert('Por favor complete los datos de la tarjeta.');
                return false;
            }
        } else if (metodoPago === 'pse') {
            const banco = document.getElementById('banco')?.value;
            
            if (!banco) {
                alert('Por favor seleccione un banco.');
                return false;
            }
        } else if (metodoPago === 'transferencia') {
            const comprobante = document.getElementById('comprobante')?.value;
            
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
    
    // Función para generar el PDF del comprobante de pago
    function generarComprobantePDF() {
        // Cargar la biblioteca jsPDF si aún no está disponible
        if (typeof jspdf === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);
            
            script.onload = function() {
                const fontScript = document.createElement('script');
                fontScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.25/jspdf.plugin.autotable.min.js';
                document.head.appendChild(fontScript);
                
                fontScript.onload = function() {
                    crearPDF();
                };
            };
        } else {
            crearPDF();
        }
    }
    
    function crearPDF() {
        // Usar la biblioteca jsPDF para generar el PDF
        const { jsPDF } = window.jspdf;
        
        // Crear un nuevo documento PDF
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });
        
        // Configuración de fuentes y colores
        const azulOscuro = [14, 26, 64]; // #0A1A40
        const azulMedio = [59, 89, 182]; // #3B59B6
        const grisTexto = [60, 60, 60]; // #3C3C3C
        
        // Fecha actual formateada
        const hoy = new Date();
        const fechaFormateada = hoy.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        
        // Header con logo (simulado con texto para este ejemplo)
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 210, 40, 'F');
        
        doc.setFontSize(24);
        doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
        doc.setFont("helvetica", "bold");
        doc.text("SEMINARIO BAUTISTA DE COLOMBIA", 105, 15, { align: "center" });
        
        doc.setFontSize(14);
        doc.setTextColor(azulMedio[0], azulMedio[1], azulMedio[2]);
        doc.text("COMPROBANTE DE INSCRIPCIÓN", 105, 25, { align: "center" });
        
        // Información del evento
        doc.setDrawColor(200, 200, 200);
        doc.line(15, 45, 195, 45); // Línea separadora
        
        doc.setFontSize(16);
        doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
        doc.text(`${formState.evento.titulo}`, 15, 55);
        
        doc.setFontSize(12);
        doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
        doc.text(`Fecha del evento: ${formState.evento.fecha}`, 15, 63);
        doc.text(`Lugar: ${formState.evento.ubicacion}`, 15, 70);
        
        // Detalles de la inscripción
        doc.setFillColor(240, 240, 245);
        doc.rect(15, 80, 180, 25, 'F');
        
        doc.setFontSize(12);
        doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
        doc.setFont("helvetica", "bold");
        doc.text("INFORMACIÓN DE LA INSCRIPCIÓN", 20, 90);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
        doc.text(`Código: ${formState.codigoInscripcion}`, 20, 98);
        doc.text(`Fecha: ${fechaFormateada}`, 120, 98);
        
        // Información del participante principal
        doc.setFontSize(12);
        doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
        doc.setFont("helvetica", "bold");
        doc.text("PARTICIPANTE PRINCIPAL", 15, 115);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
        
        doc.text(`Nombre: ${formState.participantePrincipal.nombres} ${formState.participantePrincipal.apellidos}`, 20, 123);
        doc.text(`Documento: ${obtenerTipoDocumentoTexto(formState.participantePrincipal.tipoDocumento)} ${formState.participantePrincipal.documento}`, 20, 130);
        doc.text(`Correo: ${formState.participantePrincipal.correo || "No especificado"}`, 20, 137);
        
        // Participantes adicionales
        let yPos = 150;
        
        if (formState.participantesAdicionales.length > 0) {
            doc.setFontSize(12);
            doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
            doc.setFont("helvetica", "bold");
            doc.text("PARTICIPANTES ADICIONALES", 15, yPos);
            
            yPos += 8;
            
            formState.participantesAdicionales.forEach((participante, index) => {
                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
                
                doc.text(`${index + 1}. ${participante.nombres} ${participante.apellidos}`, 20, yPos);
                yPos += 7;
                
                if (yPos > 270) {
                    doc.addPage();
                    yPos = 20;
                }
            });
            
            yPos += 5;
        }
        
        // Resumen de costos
        const costoInscripciones = (1 + formState.participantesAdicionales.length) * formState.costos.precioEvento;
        
        doc.setFillColor(240, 240, 245);
        doc.rect(15, yPos, 180, 35, 'F');
        
        doc.setFontSize(12);
        doc.setTextColor(azulOscuro[0], azulOscuro[1], azulOscuro[2]);
        doc.setFont("helvetica", "bold");
        doc.text("RESUMEN DE PAGO", 20, yPos + 10);
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
        
        doc.text(`Subtotal Inscripciones:`, 20, yPos + 20);
        doc.text(`$${formatNumber(costoInscripciones)}`, 150, yPos + 20, { align: "right" });
        
        doc.text(`Hospedaje adicional:`, 20, yPos + 27);
        doc.text(`$${formatNumber(formState.costos.totalHospedaje)}`, 150, yPos + 27, { align: "right" });
        
        doc.setFont("helvetica", "bold");
        doc.text(`TOTAL:`, 20, yPos + 34);
        doc.setTextColor(azulMedio[0], azulMedio[1], azulMedio[2]);
        doc.text(`$${formatNumber(formState.costos.total)}`, 150, yPos + 34, { align: "right" });
        
        // Método de pago
        yPos += 45;
        
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(grisTexto[0], grisTexto[1], grisTexto[2]);
        doc.text(`Método de pago:`, 20, yPos);
        
        let metodoPagoTexto = '';
        switch (formState.metodoPago) {
            case 'tarjeta': metodoPagoTexto = 'Tarjeta de Crédito/Débito'; break;
            case 'pse': metodoPagoTexto = 'PSE - Pagos en línea'; break;
            case 'transferencia': metodoPagoTexto = 'Transferencia Bancaria'; break;
            default: metodoPagoTexto = 'No especificado';
        }
        
        doc.setFont("helvetica", "normal");
        doc.text(metodoPagoTexto, 70, yPos);
        
        // Estado del pago
        doc.setFont("helvetica", "bold");
        doc.text(`Estado:`, 20, yPos + 7);
        
        doc.setTextColor(0, 150, 0); // Color verde para "Aprobado"
        doc.setFont("helvetica", "normal");
        doc.text("APROBADO", 70, yPos + 7);
        
        // Footer
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.text("Este documento es un comprobante de inscripción. Por favor, preséntelo el día del evento.", 105, 280, { align: "center" });
        doc.text("Seminario Bautista de Colombia - www.seminariobautista.edu.co", 105, 287, { align: "center" });
        
        // Guardar PDF
        const nombreArchivo = `Comprobante_${formState.codigoInscripcion}.pdf`;
        doc.save(nombreArchivo);
        
        // Redirigir a la página de eventos
        setTimeout(() => {
            window.location.href = 'eventos.html';
        }, 500);
    }
    
    function obtenerTipoDocumentoTexto(tipo) {
        switch (tipo) {
            case 'cc': return 'Cédula de Ciudadanía';
            case 'ce': return 'Cédula de Extranjería';
            case 'pasaporte': return 'Pasaporte';
            default: return 'Documento';
        }
    }
    
    // Iniciar la página
    inicializar();
});