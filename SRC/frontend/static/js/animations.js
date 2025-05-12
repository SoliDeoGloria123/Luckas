document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad para el scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            // Scroll a la primera sección después del hero
            const mainContent = document.querySelector('main .neo-container');
            if (mainContent) {
                mainContent.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Cambiar el estilo del header al hacer scroll
    const header = document.querySelector('.neo-header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Efecto de aparición en scroll para elementos
    const fadingElements = document.querySelectorAll('.fade-in');
    
    const checkFade = function() {
        fadingElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('visible');
            }
        });
    };
    
    // Ejecutar la comprobación al cargar y al hacer scroll
    window.addEventListener('scroll', checkFade);
    checkFade();
});