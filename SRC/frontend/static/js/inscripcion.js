document.addEventListener('DOMContentLoaded', function() {
    // Efecto de flip para las tarjetas de programas
    const programaCards = document.querySelectorAll('.programa-card');
    
    programaCards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
    
    // Colores para la transición de scroll - definidos globalmente
    window.darkThemeScrollColor = function(scrollPercentage) {
        const colorGradient = [
            '#121212', // Negro oscuro
            '#0d1a35', // Azul muy oscuro
            '#162447', // Azul oscuro
            '#1f4068', // Azul medio oscuro
            '#072142', // Azul oscuro
            '#1a1a2e', // Azul muy oscuro
            '#010048', // Azul casi negro
            '#181832', // Azul oscuro grisáceo
            '#282840', // Gris azulado
            '#383850', // Gris más claro
            '#484860', // Gris medio
            '#585870', // Gris medio claro
            '#686880', // Gris claro
            '#787890', // Gris azulado claro
            '#8888A0', // Gris muy claro
            '#A0A0B0', // Gris plateado
            '#B8B8C8', // Plata claro
            '#D0D0E0', // Casi blanco azulado
            '#E8E8F0', // Blanquecino
            '#FFFFFF'  // Blanco puro
        ];
        return getColorFromGradient(colorGradient, scrollPercentage);
    };
    
    window.lightThemeScrollColor = function(scrollPercentage) {
        const colorGradient = [
            '#F5F5F5', // Blanco humo
            '#F0F0F0', // Blanco grisáceo
            '#EAEAEA', // Blanco plata
            '#E5E5E5', // Gris muy claro
            '#E0E0E0', // Gris claro
            '#DADADA', // Gris ligeramente más oscuro
            '#D5D5D5', // Gris medio claro
            '#D0D0D0', // Gris medio
            '#CACACA', // Gris medio oscuro
            '#C5C5C5', // Gris plateado
            '#BEBEBE', // Gris
            '#B5B5B5', // Gris más oscuro
            '#AFAFAF', // Gris oscuro
            '#A5A5A5', // Gris oscuro
            '#9A9A9A', // Gris aún más oscuro
            '#909090', // Gris bastante oscuro
            '#858585', // Gris muy oscuro
            '#777777', // Gris casi negro
            '#666666', // Gris casi negro
            '#555555'  // Muy oscuro, pero no negro
        ];
        return getColorFromGradient(colorGradient, scrollPercentage);
    };
    
    // Por defecto, usar dark o light según el tema
    window.scrollColorFunction = document.documentElement.classList.contains('light-theme') ? 
        window.lightThemeScrollColor : window.darkThemeScrollColor;
    
    // Función que obtiene el color del gradiente basado en la posición de scroll
    function getColorFromGradient(colorGradient, scrollPercentage) {
        const index = Math.min(
            Math.floor(scrollPercentage * (colorGradient.length - 1)),
            colorGradient.length - 1
        );
        
        if (scrollPercentage === 1 || index === colorGradient.length - 1) {
            return colorGradient[colorGradient.length - 1];
        }
        
        const remainder = (scrollPercentage * (colorGradient.length - 1)) - index;
        
        if (remainder < 0.05) {
            return colorGradient[index];
        }
        
        return interpolateColor(
            colorGradient[index],
            colorGradient[index + 1],
            remainder
        );
    }
    
    // Función para actualizar el color de fondo según el scroll
    window.updateBackgroundColor = function() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPosition = window.scrollY;
        const scrollPercentage = Math.min(scrollPosition / scrollHeight, 1);
        
        // Usar la función de color según el tema actual
        const newColor = window.scrollColorFunction(scrollPercentage);
        document.documentElement.style.setProperty('--background-color', newColor);
        
        // Actualizar también el color de fondo de las secciones
        document.querySelectorAll('.section-color').forEach(section => {
            const sectionRect = section.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // Si la sección está en el viewport, darle un color ligeramente distinto
            if (sectionRect.top <= viewportHeight && sectionRect.bottom >= 0) {
                // Calcular su posición relativa en el documento
                const sectionPosition = (scrollPosition + sectionRect.top) / scrollHeight;
                
                // Obtener un color ligeramente diferente al del fondo
                const sectionColor = window.scrollColorFunction(
                    Math.min(sectionPosition + 0.05, 1)
                );
                
                section.style.backgroundColor = sectionColor;
            }
        });
    };
    
    // Evento de scroll para actualizar el color
    window.addEventListener('scroll', window.updateBackgroundColor);
    window.updateBackgroundColor(); // Inicializar al cargar
    
    // Efecto de scroll suave para el indicator de scroll
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const nextSection = document.querySelector('.programas-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Formulario de contacto con asesor
    const contactForm = document.getElementById('contacto-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animación de envío
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;
            
            // Simulación de envío (aquí iría la lógica real de envío)
            setTimeout(() => {
                // Mostrar mensaje de éxito
                const formContent = contactForm.innerHTML;
                contactForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>¡Mensaje enviado con éxito!</h3>
                        <p>Un asesor se pondrá en contacto contigo en las próximas 24 horas.</p>
                    </div>
                `;
                
                // Restaurar el formulario después de unos segundos
                setTimeout(() => {
                    contactForm.innerHTML = formContent;
                }, 5000);
            }, 2000);
        });
    }
});