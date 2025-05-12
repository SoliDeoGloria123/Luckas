document.addEventListener('DOMContentLoaded', function() {
    // Cambio de color por sección al hacer scroll
    const colorSections = document.querySelectorAll('.section-color');
    let currentSection = null;
    
    function checkSectionInView() {
        let found = false;
        
        colorSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Si la sección está en el viewport
            if (rect.top <= viewportHeight/2 && rect.bottom >= viewportHeight/2) {
                if (currentSection !== section) {
                    currentSection = section;
                    const bgColor = section.getAttribute('data-color');
                    document.documentElement.style.setProperty('--background-color', bgColor);
                }
                found = true;
            }
        });
        
        if (!found) {
            currentSection = null;
        }
    }
    
    window.addEventListener('scroll', checkSectionInView);
    checkSectionInView(); // Verificar al cargar la página
    
    // Efecto de scroll suave para el indicator de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.programa-descripcion');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Tabs del plan de estudios
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Desactivar todos los botones y contenidos
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Activar el botón y contenido seleccionado
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Animación para la tarjeta 3D en el hero
    const card3d = document.querySelector('.programa-3d-card');
    if (card3d) {
        document.addEventListener('mousemove', function(e) {
            const hero = document.querySelector('.programa-hero');
            const heroRect = hero.getBoundingClientRect();
            
            // Solo aplicar efecto si el mouse está en la sección hero
            if (e.clientY >= heroRect.top && e.clientY <= heroRect.bottom) {
                // Calcular la posición relativa del mouse en la ventana
                const x = (e.clientX / window.innerWidth) - 0.5;
                const y = (e.clientY / window.innerHeight) - 0.5;
                
                // Aplicar rotación inversa al movimiento del mouse
                card3d.style.transform = `rotateY(${-x * 20}deg) rotateX(${y * 20}deg)`;
                
                // Desactivar la animación automática
                card3d.style.animation = 'none';
            }
        });
        
        // Restaurar la animación cuando el mouse sale de la sección
        document.addEventListener('mouseleave', function() {
            card3d.style.animation = 'rotateSlow 12s linear infinite';
            card3d.style.transform = '';
        });
    }
});