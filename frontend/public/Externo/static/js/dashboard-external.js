// Dashboard External - Gestión de usuario autenticado
class DashboardExternal {
    constructor() {
        this.init();
    }
    
    init() {
        // Verificar autenticación al cargar la página
        this.checkAuthentication();
        
        // Cargar datos del usuario
        this.loadUserData();
        
        // Configurar event listeners
        this.setupEventListeners();
        
        // Cargar datos del dashboard
        this.loadDashboardData();
    }
    
    checkAuthentication() {
        if (!AuthUtils.isAuthenticated()) {
            // Si no está autenticado, redirigir al login
            window.location.href = 'login-unified.html';
            return;
        }
        
        const user = AuthUtils.getUser();
        if (user && user.role !== 'externo') {
            // Si no es un usuario externo, redirigir al login correspondiente
            AuthUtils.logout();
            return;
        }
    }
    
    loadUserData() {
        const user = AuthUtils.getUser();
        if (!user) return;
        
        // Actualizar información del usuario en el sidebar
        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        
        if (userNameElement) {
            // Mostrar solo nombres, limitado a 20 caracteres máximo
            const fullName = `${user.firstName || user.nombre || ''} ${user.lastName || user.apellido || ''}`.trim();
            const shortName = fullName.length > 20 ? fullName.substring(0, 17) + '...' : fullName;
            userNameElement.textContent = shortName;
        }
        
        if (userRoleElement) {
            userRoleElement.textContent = this.getRoleDisplayName(user.role);
        }
        
        // Actualizar imagen del usuario si existe
        this.updateUserImage(user);
    }
    
    getRoleDisplayName(role) {
        const roleNames = {
            'externo': 'Usuario Externo',
            'admin': 'Administrador',
            'tesorero': 'Tesorero',
            'seminarista': 'Seminarista'
        };
        return roleNames[role] || 'Usuario';
    }
    
    updateUserImage(user) {
        const userImageElement = document.querySelector('.user-image');
        if (userImageElement && user.imagen) {
            userImageElement.src = user.imagen;
            userImageElement.alt = `Foto de ${user.nombre}`;
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
        
        // Actualizar notificaciones
        this.updateNotificationsBadge();
    }
    
    handleLogout() {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            AuthUtils.logout();
        }
    }
    
    async loadDashboardData() {
        try {
            // Cargar estadísticas del dashboard
            await this.loadUserStats();
            
            // Cargar actividades recientes
            await this.loadRecentActivities();
            
            // Cargar notificaciones
            await this.loadNotifications();
            
        } catch (error) {
            console.error('Error cargando datos del dashboard:', error);
        }
    }
    
    async loadUserStats() {
        try {
            const response = await authenticatedFetch('/api/users/stats');
            if (response && response.ok) {
                const stats = await response.json();
                this.updateStatsDisplay(stats);
            }
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        }
    }
    
    updateStatsDisplay(stats) {
        // Actualizar tarjetas de estadísticas si existen
        const statsElements = {
            'eventos-count': stats.eventosInscritos || 0,
            'cursos-count': stats.cursosInscritos || 0,
            'reservas-count': stats.reservasActivas || 0,
            'notificaciones-count': stats.notificacionesPendientes || 0
        };
        
        Object.entries(statsElements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value;
            }
        });
    }
    
    async loadRecentActivities() {
        try {
            const response = await authenticatedFetch('/api/users/recent-activities');
            if (response && response.ok) {
                const activities = await response.json();
                this.displayRecentActivities(activities);
            }
        } catch (error) {
            console.error('Error cargando actividades recientes:', error);
        }
    }
    
    displayRecentActivities(activities) {
        const container = document.getElementById('recent-activities');
        if (!container || !activities.length) return;
        
        const activitiesHtml = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="activity-time">${this.formatDate(activity.fecha)}</span>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = activitiesHtml;
    }
    
    async loadNotifications() {
        try {
            const response = await authenticatedFetch('/api/users/notifications');
            if (response && response.ok) {
                const notifications = await response.json();
                this.updateNotificationsBadge(notifications.length);
                this.displayNotifications(notifications);
            }
        } catch (error) {
            console.error('Error cargando notificaciones:', error);
        }
    }
    
    updateNotificationsBadge(count = 0) {
        const badge = document.querySelector('.nav-section .badge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'inline' : 'none';
        }
    }
    
    displayNotifications(notifications) {
        const container = document.getElementById('notifications-preview');
        if (!container) return;
        
        if (notifications.length === 0) {
            container.innerHTML = '<p class="no-notifications">No tienes notificaciones pendientes</p>';
            return;
        }
        
        const notificationsHtml = notifications.slice(0, 3).map(notification => `
            <div class="notification-item ${notification.leida ? '' : 'unread'}">
                <div class="notification-icon">
                    <i class="fas fa-${notification.icon || 'bell'}"></i>
                </div>
                <div class="notification-content">
                    <h5>${notification.titulo}</h5>
                    <p>${notification.mensaje}</p>
                    <span class="notification-time">${this.formatDate(notification.fecha)}</span>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = notificationsHtml;
    }
    
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return 'Hoy';
        } else if (diffDays === 1) {
            return 'Ayer';
        } else if (diffDays < 7) {
            return `Hace ${diffDays} días`;
        } else {
            return date.toLocaleDateString('es-ES');
        }
    }
    
    // Método para refrescar datos
    async refreshData() {
        await this.loadDashboardData();
    }
}

// Funciones utilitarias para el dashboard
const DashboardUtils = {
    showToast(message, type = 'info') {
        // Crear toast notification
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Mostrar toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Ocultar toast después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    },
    
    async confirmAction(message, action) {
        if (confirm(message)) {
            try {
                await action();
                this.showToast('Acción completada exitosamente', 'success');
            } catch (error) {
                this.showToast('Error al realizar la acción', 'error');
                console.error('Error:', error);
            }
        }
    }
};

// Inicializar dashboard cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Incluir el script de login-unified para tener AuthUtils disponible
    if (typeof AuthUtils === 'undefined') {
        // Si AuthUtils no está disponible, cargar el script
        const script = document.createElement('script');
        script.src = '../static/js/login-unified.js';
        script.onload = () => {
            new DashboardExternal();
        };
        document.head.appendChild(script);
    } else {
        new DashboardExternal();
    }
});

// Exponer utilidades globalmente
window.DashboardUtils = DashboardUtils;
