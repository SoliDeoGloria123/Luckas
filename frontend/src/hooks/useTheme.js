import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [tema, setTema] = useState(() => {
    // Verificar si hay un tema guardado en localStorage
    const temaGuardado = localStorage.getItem('luckas-theme');
    if (temaGuardado) {
      return temaGuardado;
    }
    
    // Si no hay tema guardado, usar la preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Aplicar el tema al DOM
    const aplicarTema = (nuevoTema) => {
      const root = document.documentElement;
      
      if (nuevoTema === 'dark') {
        root.classList.add('dark');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.setAttribute('data-theme', 'light');
      }
      
      // Guardar en localStorage
      localStorage.setItem('luckas-theme', nuevoTema);
    };

    aplicarTema(tema);
  }, [tema]);

  const toggleTema = () => {
    setTema(temaAnterior => temaAnterior === 'light' ? 'dark' : 'light');
  };

  const setTemaEspecifico = (nuevoTema) => {
    setTema(nuevoTema);
  };

  return {
    tema,
    toggleTema,
    setTemaEspecifico,
    esTemaOscuro: tema === 'dark'
  };
};
