/**
 * Theme Switcher Script for Luckas Website
 * Enables switching between dark and light themes
 */

document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay una preferencia de tema guardada
    const savedTheme = localStorage.getItem('theme') || 'dark';
    
    // Aplicar el tema guardado
    document.documentElement.classList.add(savedTheme + '-theme');
    
    // Crear el botón de cambio de tema
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <i class="fas fa-sun"></i>
        <i class="fas fa-moon"></i>
    `;
    document.body.appendChild(themeToggle);
    
    // Función para cambiar el tema
    function toggleTheme() {
        const isCurrentlyDark = document.documentElement.classList.contains('dark-theme');
        
        // Quitar ambos temas
        document.documentElement.classList.remove('dark-theme');
        document.documentElement.classList.remove('light-theme');
        
        // Aplicar el nuevo tema
        const newTheme = isCurrentlyDark ? 'light' : 'dark';
        document.documentElement.classList.add(newTheme + '-theme');
        
        // Guardar la preferencia
        localStorage.setItem('theme', newTheme);
        
        // Actualizar estilos específicos según el tema actual
        updateDynamicElements(newTheme);
        
        // Si existe la función updateBackgroundColor en inscripcion.js, llamarla
        if (typeof window.updateBackgroundColor === 'function') {
            window.updateBackgroundColor();
        }
    }
    
    // Función para actualizar elementos dinámicos que necesitan 
    // cambios específicos según el tema
    function updateDynamicElements(theme) {
        // Hero y secciones con fondo
        if (theme === 'light') {
            // Si hay un hero animado, cambiar su background
            const heroAnimated = document.querySelector('.hero-animated');
            if (heroAnimated) {
                heroAnimated.style.background = 'linear-gradient(rgba(255, 255, 255, 0.7), rgba(235, 235, 235, 0.8)), url("images/hero-bg.jpg")';
                heroAnimated.style.backgroundSize = 'cover';
                heroAnimated.style.backgroundPosition = 'center';
            }
            
            // Si hay elementos de scroll indicator, hacer el texto más oscuro
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.querySelectorAll('p').forEach(p => {
                    p.style.color = '#333333';
                });
                const scrollArrow = scrollIndicator.querySelector('.scroll-arrow');
                if (scrollArrow) {
                    scrollArrow.style.borderColor = '#333333';
                }
            }
            
            // Para la sección de inscripción
            const inscripcionHero = document.querySelector('.inscripcion-hero');
            if (inscripcionHero) {
                inscripcionHero.style.background = 'radial-gradient(circle at center, #f0f0f0, #ffffff)';
            }

            // Ajustar las ondas animadas si existen
            const waves = document.querySelectorAll('.wave');
            if (waves.length > 0) {
                waves.forEach(wave => {
                    wave.style.opacity = '0.5';
                });
            }
            
            // Ajustar colores de texto específicos
            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                heading.style.color = '#333333';
            });
            
            document.querySelectorAll('.curso-precio p').forEach(precio => {
                precio.style.color = '#0033FF';
            });
            
            document.querySelectorAll('.proceso-content h3').forEach(heading => {
                heading.style.color = '#0033FF';
            });
        } else {
            // Restaurar estilos para tema oscuro
            const heroAnimated = document.querySelector('.hero-animated');
            if (heroAnimated) {
                heroAnimated.style.background = 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("images/hero-bg.jpg")';
                heroAnimated.style.backgroundSize = 'cover';
                heroAnimated.style.backgroundPosition = 'center';
            }
            
            // Restaurar el color del scroll indicator
            const scrollIndicator = document.querySelector('.scroll-indicator');
            if (scrollIndicator) {
                scrollIndicator.querySelectorAll('p').forEach(p => {
                    p.style.color = '#FFFFFF';
                });
                const scrollArrow = scrollIndicator.querySelector('.scroll-arrow');
                if (scrollArrow) {
                    scrollArrow.style.borderColor = '#FFFFFF';
                }
            }
            
            // Para la sección de inscripción
            const inscripcionHero = document.querySelector('.inscripcion-hero');
            if (inscripcionHero) {
                inscripcionHero.style.background = 'radial-gradient(circle at center, #1a237e, #121212)';
            }

            // Restaurar opacidad de las ondas
            const waves = document.querySelectorAll('.wave');
            if (waves.length > 0) {
                waves.forEach(wave => {
                    wave.style.opacity = '1';
                });
            }
            
            // Restaurar colores de texto
            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                heading.style.color = '';
            });
            
            document.querySelectorAll('.curso-precio p').forEach(precio => {
                precio.style.color = '';
            });
            
            document.querySelectorAll('.proceso-content h3').forEach(heading => {
                heading.style.color = '';
            });
        }
    }
    
    // Agregar evento al botón
    themeToggle.addEventListener('click', toggleTheme);
    
    // Aplicar estilos específicos según el tema actual
    updateDynamicElements(savedTheme);
});