document.addEventListener('DOMContentLoaded', function() {
    // Mantener el código existente para menú y sidebar
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 992 && 
            sidebar && 
            sidebar.classList.contains('open') &&
            !sidebar.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            sidebar.classList.remove('open');
        }
    });
    
    // SOLUCIÓN ESPECÍFICA PARA EL TEMA
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        // Función para aplicar estilos específicos
        function applyThemeStyles(isLight) {
            // Componentes específicos que mencionaste con problemas
            const componentsToFix = [
                '.welcome-banner .banner-content h2', 
                '.welcome-banner .banner-content p',
                '.section-header h2',
                '.quick-card',
                '.quick-card h3',
                '.quick-card p',
                '.calendar-section',
                '.calendar-section h2',
                '.month-header h3',
                '.days span',
                '.upcoming-events',
                '.upcoming-events h2',
                '.event-item',
                '.event-details h3',
                '.event-meta span',
                '.timeline-content',
                '.timeline-header h3',
                '.timeline-content p'
            ];
            
            if (isLight) {
                // Aplicar estilos para tema claro
                componentsToFix.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        if (selector.includes('h2') || selector.includes('h3') || selector.includes('p') || 
                            selector.includes('span') || selector.includes('timeline-header')) {
                            element.style.color = '#121212'; // Texto oscuro para tema claro
                        }
                        
                        if (selector.includes('quick-card') || selector.includes('section') || 
                            selector.includes('event-item') || selector.includes('timeline-content')) {
                            element.style.backgroundColor = 'rgba(245, 245, 250, 0.95)'; // Fondo claro
                            element.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                        }
                    });
                });
                
                // Overlay del banner más claro
                document.querySelector('.banner-overlay').style.background = 
                    'linear-gradient(to right, rgba(230, 240, 255, 0.8) 0%, rgba(240, 245, 255, 0.4) 100%)';
                
            } else {
                // Restaurar estilos para tema oscuro
                componentsToFix.forEach(selector => {
                    document.querySelectorAll(selector).forEach(element => {
                        if (selector.includes('h2') || selector.includes('h3') || selector.includes('p') || 
                            selector.includes('span') || selector.includes('timeline-header')) {
                            element.style.color = ''; // Restaurar al valor predeterminado
                        }
                        
                        if (selector.includes('quick-card') || selector.includes('section') || 
                            selector.includes('event-item') || selector.includes('timeline-content')) {
                            element.style.backgroundColor = ''; // Restaurar al valor predeterminado
                            element.style.boxShadow = '';
                        }
                    });
                });
                
                // Restaurar overlay del banner
                document.querySelector('.banner-overlay').style.background = '';
            }
        }
        
        // Toggle para el tema con aplicación de estilos específicos
        themeToggle.addEventListener('click', function() {
            document.documentElement.classList.toggle('theme-light');
            
            const isLightTheme = document.documentElement.classList.contains('theme-light');
            localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
            
            // Aplicar los estilos específicos para los componentes mencionados
            applyThemeStyles(isLightTheme);
        });
        
        // Aplicar el tema guardado al cargar la página
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.classList.add('theme-light');
            applyThemeStyles(true);
        }
    }
    
    // Tooltips para los eventos en el calendario - código original sin cambios
    const eventDays = document.querySelectorAll('.days span.event');
    
    eventDays.forEach(day => {
        const title = day.getAttribute('title');
        if (title) {
            day.addEventListener('mouseover', function(e) {
                const tooltip = document.createElement('div');
                tooltip.className = 'calendar-tooltip';
                tooltip.textContent = title;
                tooltip.style.position = 'absolute';
                tooltip.style.top = (e.pageY - 40) + 'px';
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.backgroundColor = 'var(--surface)';
                tooltip.style.color = 'var(--text)';
                tooltip.style.padding = '0.5rem 1rem';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '0.9rem';
                tooltip.style.zIndex = '1000';
                tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
                document.body.appendChild(tooltip);
                
                day.addEventListener('mousemove', function(e) {
                    tooltip.style.top = (e.pageY - 40) + 'px';
                    tooltip.style.left = (e.pageX + 10) + 'px';
                });
                
                day.addEventListener('mouseout', function() {
                    document.body.removeChild(tooltip);
                });
            });
        }
    });
});