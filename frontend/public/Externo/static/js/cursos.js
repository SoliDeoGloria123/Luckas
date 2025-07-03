document.addEventListener('DOMContentLoaded', function() {
    // Funcionalidad de filtro para los cursos
    const nivelSelect = document.getElementById('nivel');
    const categoriaSelect = document.getElementById('categoria');
    const duracionSelect = document.getElementById('duracion');
    
    // Si los elementos existen en la página
    if (nivelSelect && categoriaSelect && duracionSelect) {
        const filtros = [nivelSelect, categoriaSelect, duracionSelect];
        
        filtros.forEach(filtro => {
            filtro.addEventListener('change', aplicarFiltros);
        });
    }
    
    function aplicarFiltros() {
        // Placeholder para la funcionalidad de filtrado
        console.log('Filtros aplicados');
        
        // Simulación de filtrado (solo para demostración)
        const nivelSeleccionado = nivelSelect.value;
        const categoriaSeleccionada = categoriaSelect.value;
        const duracionSeleccionada = duracionSelect.value;
        
        console.log(`Nivel: ${nivelSeleccionado}, Categoría: ${categoriaSeleccionada}, Duración: ${duracionSeleccionada}`);
        
        // Efecto visual al filtrar
        const cursoCards = document.querySelectorAll('.curso-card');
        
        cursoCards.forEach(card => {
            // Reinicia las animaciones al aplicar filtros
            card.classList.remove('visible');
            setTimeout(() => {
                card.classList.add('visible');
            }, 100 + Math.random() * 300); // Tiempo aleatorio para un efecto escalonado
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
    
    // Verificar si hay un curso preseleccionado en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const cursoParam = urlParams.get('curso');
    
    if (cursoParam) {
        // Buscar el elemento con ese ID y hacer scroll hasta él
        const cursoElement = document.getElementById(cursoParam);
        if (cursoElement) {
            setTimeout(() => {
                cursoElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }

    // Efecto hover para los select
    const selectWrappers = document.querySelectorAll('.custom-select-wrapper');
    
    selectWrappers.forEach(wrapper => {
        const select = wrapper.querySelector('select');
        const icon = wrapper.querySelector('.select-icon');
        
        select.addEventListener('focus', function() {
            wrapper.classList.add('focused');
        });
        
        select.addEventListener('blur', function() {
            wrapper.classList.remove('focused');
        });
    });
});