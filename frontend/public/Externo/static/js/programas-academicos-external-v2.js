// Programas Académicos - External JavaScript (versión simplificada)
class ProgramasAcademicosExternal {
    constructor() {
        this.programas = [];
        this.programasFiltrados = [];
        this.filtros = {
            tipo: '',
            modalidad: '',
            duracion: ''
        };
        
        this.init();
    }
    
    init() {
        // Verificar autenticación
        this.checkAuthentication();
        
        // Cargar datos del usuario
        this.loadUserData();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar programas académicos
        this.loadProgramas();
    }
    
    checkAuthentication() {
        if (!AuthUtils.isAuthenticated()) {
            window.location.href = 'login-unified.html';
            return;
        }
        
        const user = AuthUtils.getUser();
        if (user && user.role !== 'externo') {
            AuthUtils.logout();
            return;
        }
    }
    
    loadUserData() {
        const user = AuthUtils.getUser();
        if (!user) return;
        
        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        
        if (userNameElement) {
            // Mostrar solo nombres, limitado a 20 caracteres máximo
            const fullName = `${user.firstName || user.nombre || ''} ${user.lastName || user.apellido || ''}`.trim();
            const shortName = fullName.length > 20 ? fullName.substring(0, 17) + '...' : fullName;
            userNameElement.textContent = shortName;
        }
        
        if (userRoleElement) {
            userRoleElement.textContent = 'Usuario Externo';
        }
    }
    
    setupEventListeners() {
        // Configurar logout
        const logoutLinks = document.querySelectorAll('.logout');
        logoutLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        });
        
        // Event listeners para modales
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.cerrarModales();
            }
        });
    }
    
    handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            AuthUtils.logout();
        }
    }
    
    async loadProgramas() {
        try {
            this.showLoading(true);
            
            // Intentar cargar desde el backend
            try {
                const response = await authenticatedFetch('/api/programas-academicos');
                if (response && response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        this.programas = data.data;
                        this.programasFiltrados = [...this.programas];
                        this.renderProgramas();
                        return;
                    }
                }
            } catch (backendError) {
                console.warn('Backend no disponible, usando datos de ejemplo:', backendError);
            }
            
            // Cargar datos de ejemplo como fallback
            this.loadProgramasEjemplo();
            
        } catch (error) {
            console.error('Error cargando programas:', error);
            this.showError('Error al cargar los programas académicos');
        } finally {
            this.showLoading(false);
        }
    }
    
    loadProgramasEjemplo() {
        const programasEjemplo = [
            {
                id: 1,
                titulo: 'Diplomado en Teología Bíblica',
                tipo: 'diplomado',
                descripcion: 'Programa intensivo de estudios bíblicos y teológicos para fortalecer el conocimiento de las Escrituras.',
                modalidad: 'presencial',
                duracion: '6 meses',
                precio: 850000,
                fechaInicio: '2025-08-15',
                cupos: 25,
                profesor: 'Dr. Carlos Mendoza',
                requisitos: ['Bachiller completo', 'Carta de motivación'],
                pensum: ['Introducción a la Teología', 'Hermenéutica Bíblica', 'Historia del Cristianismo', 'Teología Sistemática']
            },
            {
                id: 2,
                titulo: 'Curso de Música Sacra',
                tipo: 'curso',
                descripcion: 'Aprende a dirigir coros y tocar instrumentos para el servicio en la iglesia.',
                modalidad: 'mixta',
                duracion: '3 meses',
                precio: 450000,
                fechaInicio: '2025-09-01',
                cupos: 15,
                profesor: 'Maestro Juan Arango',
                requisitos: ['Conocimientos básicos de música'],
                pensum: ['Teoría Musical Básica', 'Dirección Coral', 'Instrumentos de Adoración', 'Liturgia Musical']
            },
            {
                id: 3,
                titulo: 'Técnico en Ministerios Pastorales',
                tipo: 'tecnico',
                descripcion: 'Formación integral para líderes que desean servir en ministerios pastorales.',
                modalidad: 'presencial',
                duracion: '12 meses',
                precio: 1200000,
                fechaInicio: '2025-08-01',
                cupos: 20,
                profesor: 'Pastor Miguel Rodríguez',
                requisitos: ['Bachiller completo', 'Experiencia en liderazgo cristiano', 'Carta de recomendación pastoral'],
                pensum: ['Fundamentos Pastorales', 'Consejería Cristiana', 'Administración Eclesiástica', 'Evangelismo y Misiones', 'Predicación Expositiva', 'Cuidado Pastoral']
            }
        ];
        
        this.programas = programasEjemplo;
        this.programasFiltrados = [...this.programas];
        this.renderProgramas();
    }
    
    showLoading(show) {
        const loading = document.getElementById('loading');
        const container = document.getElementById('programas-container');
        
        if (show) {
            loading.style.display = 'flex';
            container.style.display = 'none';
        } else {
            loading.style.display = 'none';
            container.style.display = 'grid';
        }
    }
    
    showError(message) {
        const container = document.getElementById('programas-container');
        container.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Error</h3>
                <p>${message}</p>
                <button class="btn-primary" onclick="location.reload()">Reintentar</button>
            </div>
        `;
    }
    
    renderProgramas() {
        const container = document.getElementById('programas-container');
        const noResultsDiv = document.getElementById('no-programas');
        
        if (this.programasFiltrados.length === 0) {
            container.style.display = 'none';
            noResultsDiv.style.display = 'block';
            return;
        }
        
        container.style.display = 'grid';
        noResultsDiv.style.display = 'none';
        
        container.innerHTML = this.programasFiltrados.map(programa => this.createProgramaCard(programa)).join('');
    }
    
    createProgramaCard(programa) {
        const formatPrice = (price) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(price);
        };
        
        const formatDate = (dateString) => {
            return new Date(dateString).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        };
        
        const tipoLabels = {
            'curso': 'Curso',
            'tecnico': 'Técnico',
            'especializacion': 'Especialización',
            'diplomado': 'Diplomado'
        };
        
        const modalidadIcons = {
            'presencial': 'fa-users',
            'virtual': 'fa-laptop',
            'mixta': 'fa-blender'
        };
        
        return `
            <div class="programa-card" onclick="mostrarDetalles(${programa.id})">
                <div class="programa-header">
                    <span class="programa-tipo">${tipoLabels[programa.tipo]}</span>
                    <span class="programa-precio">${formatPrice(programa.precio)}</span>
                </div>
                
                <h3 class="programa-titulo">${programa.titulo}</h3>
                <p class="programa-descripcion">${programa.descripcion}</p>
                
                <div class="programa-info">
                    <div class="info-item">
                        <i class="fas ${modalidadIcons[programa.modalidad]}"></i>
                        <span>${programa.modalidad.charAt(0).toUpperCase() + programa.modalidad.slice(1)}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-clock"></i>
                        <span>${programa.duracion}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-calendar-alt"></i>
                        <span>${formatDate(programa.fechaInicio)}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-user-graduate"></i>
                        <span>${programa.cupos} cupos</span>
                    </div>
                </div>
                
                <div class="programa-actions">
                    <button class="btn-secondary" onclick="event.stopPropagation(); mostrarDetalles(${programa.id})">
                        <i class="fas fa-info-circle"></i>
                        Ver Detalles
                    </button>
                    <button class="btn-primary" onclick="event.stopPropagation(); mostrarModalInscripcion(${programa.id})">
                        <i class="fas fa-pen"></i>
                        Inscribirse
                    </button>
                </div>
            </div>
        `;
    }
    
    aplicarFiltros() {
        const tipoSelect = document.getElementById('tipo-programa');
        const modalidadSelect = document.getElementById('modalidad');
        const duracionSelect = document.getElementById('duracion');
        
        this.filtros = {
            tipo: tipoSelect.value,
            modalidad: modalidadSelect.value,
            duracion: duracionSelect.value
        };
        
        this.programasFiltrados = this.programas.filter(programa => {
            let cumpleFiltros = true;
            
            if (this.filtros.tipo && programa.tipo !== this.filtros.tipo) {
                cumpleFiltros = false;
            }
            
            if (this.filtros.modalidad && programa.modalidad !== this.filtros.modalidad) {
                cumpleFiltros = false;
            }
            
            if (this.filtros.duracion) {
                const duracionMeses = this.getDuracionEnMeses(programa.duracion);
                if (this.filtros.duracion === 'corto' && duracionMeses >= 3) {
                    cumpleFiltros = false;
                } else if (this.filtros.duracion === 'medio' && (duracionMeses < 3 || duracionMeses > 6)) {
                    cumpleFiltros = false;
                } else if (this.filtros.duracion === 'largo' && duracionMeses <= 6) {
                    cumpleFiltros = false;
                }
            }
            
            return cumpleFiltros;
        });
        
        this.renderProgramas();
    }
    
    getDuracionEnMeses(duracionString) {
        const numero = parseInt(duracionString.match(/\d+/)[0]);
        if (duracionString.includes('mes')) {
            return numero;
        } else if (duracionString.includes('año')) {
            return numero * 12;
        }
        return numero;
    }
    
    limpiarFiltros() {
        document.getElementById('tipo-programa').value = '';
        document.getElementById('modalidad').value = '';
        document.getElementById('duracion').value = '';
        
        this.filtros = { tipo: '', modalidad: '', duracion: '' };
        this.programasFiltrados = [...this.programas];
        this.renderProgramas();
    }
    
    mostrarDetalles(programaId) {
        const programa = this.programas.find(p => p.id === programaId);
        if (!programa) return;
        
        const modal = document.getElementById('modal-detalles');
        const titulo = document.getElementById('modal-titulo');
        const content = document.getElementById('detalles-content');
        
        titulo.textContent = programa.titulo;
        
        const formatPrice = (price) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(price);
        };
        
        content.innerHTML = `
            <div class="programa-detalles">
                <div class="detalle-header">
                    <div class="detalle-info">
                        <h3>${programa.titulo}</h3>
                        <p>${programa.descripcion}</p>
                        <div class="precio-destacado">${formatPrice(programa.precio)}</div>
                    </div>
                </div>
                
                <div class="detalles-grid">
                    <div class="detalle-section">
                        <h4><i class="fas fa-info-circle"></i> Información General</h4>
                        <ul>
                            <li><strong>Modalidad:</strong> ${programa.modalidad.charAt(0).toUpperCase() + programa.modalidad.slice(1)}</li>
                            <li><strong>Duración:</strong> ${programa.duracion}</li>
                            <li><strong>Fecha de inicio:</strong> ${new Date(programa.fechaInicio).toLocaleDateString('es-ES')}</li>
                            <li><strong>Cupos disponibles:</strong> ${programa.cupos}</li>
                            <li><strong>Profesor:</strong> ${programa.profesor}</li>
                        </ul>
                    </div>
                    
                    <div class="detalle-section">
                        <h4><i class="fas fa-list-check"></i> Requisitos</h4>
                        <ul>
                            ${programa.requisitos.map(req => `<li>${req}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                <div class="detalle-section">
                    <h4><i class="fas fa-book"></i> Plan de Estudios</h4>
                    <div class="pensum-grid">
                        ${programa.pensum.map((materia, index) => `
                            <div class="materia-item">
                                <span class="materia-numero">${index + 1}</span>
                                <span class="materia-nombre">${materia}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="detalle-actions">
                    <button class="btn-secondary" onclick="cerrarModalDetalles()">Cerrar</button>
                    <button class="btn-primary" onclick="cerrarModalDetalles(); mostrarModalInscripcion(${programa.id})">
                        <i class="fas fa-pen"></i>
                        Inscribirse Ahora
                    </button>
                </div>
            </div>
        `;
        
        modal.classList.add('show');
    }
    
    mostrarModalInscripcion(programaId) {
        const programa = this.programas.find(p => p.id === programaId);
        const user = AuthUtils.getUser();
        if (!programa || !user) return;
        
        const modal = document.getElementById('modal-inscripcion');
        const resumen = document.getElementById('programa-seleccionado');
        
        // Llenar información del programa
        const formatPrice = (price) => {
            return new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
                minimumFractionDigits: 0
            }).format(price);
        };
        
        resumen.innerHTML = `
            <h3>${programa.titulo}</h3>
            <p>${programa.descripcion}</p>
            <div class="resumen-info">
                <span><strong>Modalidad:</strong> ${programa.modalidad}</span>
                <span><strong>Duración:</strong> ${programa.duracion}</span>
                <span><strong>Precio:</strong> ${formatPrice(programa.precio)}</span>
            </div>
        `;
        
        // Llenar datos del usuario
        document.getElementById('nombres').value = user.nombre;
        document.getElementById('apellidos').value = user.apellido;
        document.getElementById('documento').value = user.numeroDocumento;
        document.getElementById('telefono').value = user.telefono || '';
        document.getElementById('correo').value = user.correo;
        
        // Configurar precios
        document.getElementById('precio-total').textContent = formatPrice(programa.precio);
        document.getElementById('precio-cuotas').textContent = formatPrice(Math.ceil(programa.precio / 3)) + ' x 3 cuotas';
        
        // Configurar formulario
        const form = document.getElementById('form-inscripcion');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.procesarInscripcion(programa.id);
        };
        
        modal.classList.add('show');
    }
    
    async procesarInscripcion(programaId) {
        try {
            const formData = new FormData(document.getElementById('form-inscripcion'));
            const inscripcionData = {
                programaId: programaId,
                nombres: formData.get('nombres'),
                apellidos: formData.get('apellidos'),
                documento: formData.get('documento'),
                telefono: formData.get('telefono'),
                correo: formData.get('correo'),
                nivelEducativo: formData.get('nivelEducativo'),
                experiencia: formData.get('experiencia'),
                metodoPago: formData.get('metodoPago')
            };
            
            // Validar campos requeridos
            if (!inscripcionData.nivelEducativo) {
                alert('Por favor selecciona tu nivel educativo');
                return;
            }
            
            // Simular procesamiento por ahora
            this.mostrarProcesandoPago();
            
            setTimeout(() => {
                this.cerrarModales();
                this.mostrarConfirmacionInscripcion(programaId);
            }, 3000);
            
        } catch (error) {
            console.error('Error en inscripción:', error);
            alert('Error al procesar la inscripción. Inténtalo nuevamente.');
        }
    }
    
    mostrarProcesandoPago() {
        const modal = document.getElementById('modal-inscripcion');
        const modalBody = modal.querySelector('.modal-body');
        
        modalBody.innerHTML = `
            <div class="procesando-pago">
                <div class="spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                </div>
                <h3>Procesando inscripción...</h3>
                <p>Por favor espera mientras procesamos tu pago.</p>
                <div class="progreso-barra">
                    <div class="progreso-fill"></div>
                </div>
            </div>
        `;
    }
    
    mostrarConfirmacionInscripcion(programaId) {
        const programa = this.programas.find(p => p.id === programaId);
        alert(`¡Felicitaciones! Te has inscrito exitosamente al programa "${programa.titulo}". Recibirás un correo con todos los detalles.`);
    }
    
    cerrarModales() {
        const modales = document.querySelectorAll('.modal');
        modales.forEach(modal => modal.classList.remove('show'));
    }
}

// Funciones globales para los event handlers
function aplicarFiltros() {
    if (window.programasApp) {
        window.programasApp.aplicarFiltros();
    }
}

function limpiarFiltros() {
    if (window.programasApp) {
        window.programasApp.limpiarFiltros();
    }
}

function mostrarDetalles(programaId) {
    if (window.programasApp) {
        window.programasApp.mostrarDetalles(programaId);
    }
}

function mostrarModalInscripcion(programaId) {
    if (window.programasApp) {
        window.programasApp.mostrarModalInscripcion(programaId);
    }
}

function cerrarModalInscripcion() {
    const modal = document.getElementById('modal-inscripcion');
    modal.classList.remove('show');
}

function cerrarModalDetalles() {
    const modal = document.getElementById('modal-detalles');
    modal.classList.remove('show');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.programasApp = new ProgramasAcademicosExternal();
});
