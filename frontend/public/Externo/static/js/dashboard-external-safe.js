// Dashboard External - Versión simplificada sin conflictos
console.log('Dashboard External JS cargado correctamente');

// Verificar autenticación básica
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        console.log('No hay token, redirigiendo...');
        window.location.href = '/';
        return false;
    }
    return true;
}

// Cargar datos del usuario de forma segura
function loadUserDataSafe() {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) return;
        
        const user = JSON.parse(userStr);
        
        // Actualizar nombre del usuario
        const userNameElement = document.getElementById('user-name');
        if (userNameElement && user.username) {
            // Limitar a 20 caracteres para evitar problemas de layout
            const username = user.username.length > 20 ? 
                user.username.substring(0, 17) + '...' : 
                user.username;
            userNameElement.textContent = username;
        }
        
        // Actualizar perfil
        const profileNameElement = document.getElementById('profile-name');
        if (profileNameElement && user.username) {
            profileNameElement.textContent = user.username;
        }
        
        const profileEmailElement = document.getElementById('profile-email');
        if (profileEmailElement && user.email) {
            profileEmailElement.textContent = user.email;
        }
        
        console.log('Datos de usuario cargados correctamente');
    } catch (error) {
        console.error('Error cargando datos de usuario:', error);
    }
}

// Función de logout segura
function logoutSafe() {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
    } catch (error) {
        console.error('Error en logout:', error);
        window.location.href = '/';
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, inicializando dashboard...');
    
    // Verificar autenticación
    if (!checkAuth()) {
        return;
    }
    
    // Cargar datos del usuario
    loadUserDataSafe();
    
    // Configurar eventos de logout si existen
    const logoutLinks = document.querySelectorAll('[onclick*="logout"]');
    logoutLinks.forEach(link => {
        // No agregar event listeners adicionales para evitar conflictos
        console.log('Enlace de logout encontrado');
    });
    
    console.log('Dashboard inicializado correctamente');
});

// Función auxiliar para mostrar notificaciones
function showNotification(message, type = 'info') {
    console.log(`Notificación ${type}: ${message}`);
    // Implementar notificaciones visuales en el futuro
}

// Exportar funciones para uso global si es necesario
window.dashboardExternal = {
    loadUserDataSafe,
    logoutSafe,
    showNotification,
    checkAuth
};
