// Login Unificado - JavaScript
class LoginUnificado {
    constructor() {
        this.form = document.getElementById('loginForm');
        this.correoInput = document.getElementById('correo');
        this.passwordInput = document.getElementById('password');
        this.loginBtn = document.getElementById('loginBtn');
        this.togglePassword = document.getElementById('togglePassword');
        this.alertContainer = document.getElementById('alert-container');
        
        this.init();
    }
    
    init() {
        this.form.addEventListener('submit', this.handleLogin.bind(this));
        this.togglePassword.addEventListener('click', this.togglePasswordVisibility.bind(this));
        
        // Limpiar alertas al escribir
        this.correoInput.addEventListener('input', () => this.clearAlerts());
        this.passwordInput.addEventListener('input', () => this.clearAlerts());
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const correo = this.correoInput.value.trim();
        const password = this.passwordInput.value.trim();
        
        if (!this.validateForm(correo, password)) {
            return;
        }
        
        this.setLoading(true);
        
        try {
            const response = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.handleSuccessfulLogin(data);
            } else {
                this.showAlert(data.message || 'Error en las credenciales', 'error');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            this.showAlert('Error de conexión. Verifica tu conexión a internet.', 'error');
        } finally {
            this.setLoading(false);
        }
    }
    
    handleSuccessfulLogin(data) {
        // Guardar datos en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', JSON.stringify(data.user));
        
        this.showAlert('¡Inicio de sesión exitoso! Redirigiendo...', 'success');
        
        // Redirigir según el rol después de 1.5 segundos
        setTimeout(() => {
            this.redirectByRole(data.user.role);
        }, 1500);
    }
    
    redirectByRole(role) {
        switch (role) {
            case 'externo':
                // Redirigir al dashboard HTML estático
                window.location.href = 'dashboard.html';
                break;
            case 'admin':
                // Redirigir al dashboard React de admin
                window.location.href = 'http://localhost:3001/admin/users';
                break;
            case 'tesorero':
                // Redirigir al dashboard React de tesorero
                window.location.href = 'http://localhost:3001/tesorero/dashboard';
                break;
            case 'seminarista':
                // Redirigir al dashboard React de seminarista
                window.location.href = 'http://localhost:3001/seminarista/dashboard';
                break;
            default:
                // Por defecto, ir al dashboard externo
                window.location.href = 'dashboard.html';
        }
    }
    
    validateForm(correo, password) {
        if (!correo) {
            this.showAlert('Por favor ingresa tu correo electrónico', 'warning');
            this.correoInput.focus();
            return false;
        }
        
        if (!this.isValidEmail(correo)) {
            this.showAlert('Por favor ingresa un correo electrónico válido', 'warning');
            this.correoInput.focus();
            return false;
        }
        
        if (!password) {
            this.showAlert('Por favor ingresa tu contraseña', 'warning');
            this.passwordInput.focus();
            return false;
        }
        
        if (password.length < 6) {
            this.showAlert('La contraseña debe tener al menos 6 caracteres', 'warning');
            this.passwordInput.focus();
            return false;
        }
        
        return true;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    showAlert(message, type = 'error') {
        this.clearAlerts();
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas fa-${this.getAlertIcon(type)}"></i>
            ${message}
        `;
        
        this.alertContainer.appendChild(alertDiv);
        
        // Auto-remover después de 5 segundos
        if (type !== 'success') {
            setTimeout(() => {
                this.clearAlerts();
            }, 5000);
        }
    }
    
    getAlertIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'error': return 'times-circle';
            default: return 'info-circle';
        }
    }
    
    clearAlerts() {
        this.alertContainer.innerHTML = '';
    }
    
    togglePasswordVisibility() {
        const type = this.passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        this.passwordInput.setAttribute('type', type);
        
        this.togglePassword.classList.toggle('fa-eye');
        this.togglePassword.classList.toggle('fa-eye-slash');
    }
    
    setLoading(loading) {
        if (loading) {
            this.loginBtn.classList.add('loading');
            this.loginBtn.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <span>Iniciando sesión...</span>
            `;
            this.loginBtn.disabled = true;
        } else {
            this.loginBtn.classList.remove('loading');
            this.loginBtn.innerHTML = `
                <span>Iniciar Sesión</span>
                <i class="fas fa-arrow-right"></i>
            `;
            this.loginBtn.disabled = false;
        }
    }
}

// Utilidades para manejar autenticación
class AuthUtils {
    static isAuthenticated() {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('usuario');
        return !!(token && user);
    }
    
    static getUser() {
        const userStr = localStorage.getItem('usuario');
        return userStr ? JSON.parse(userStr) : null;
    }
    
    static getToken() {
        return localStorage.getItem('token');
    }
    
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        window.location.href = 'login-unified.html';
    }
    
    static checkAuthAndRedirect() {
        if (this.isAuthenticated()) {
            const user = this.getUser();
            if (user && user.role === 'externo') {
                // Si ya está autenticado como externo, ir al dashboard
                window.location.href = 'dashboard.html';
            }
        }
    }
}

// Función para hacer requests autenticadas
async function authenticatedFetch(url, options = {}) {
    const token = AuthUtils.getToken();
    
    if (!token) {
        AuthUtils.logout();
        return;
    }
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        // Si el token expiró, redirigir al login
        if (response.status === 401) {
            AuthUtils.logout();
            return;
        }
        
        return response;
    } catch (error) {
        console.error('Error en request autenticado:', error);
        throw error;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar si ya está autenticado
    AuthUtils.checkAuthAndRedirect();
    
    // Inicializar el login
    new LoginUnificado();
});

// Exponer utilidades globalmente para uso en otros archivos
window.AuthUtils = AuthUtils;
window.authenticatedFetch = authenticatedFetch;
