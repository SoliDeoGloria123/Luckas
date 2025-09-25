import React, { useEffect, useRef } from 'react';
import './ShaderBackground.css';

const ShaderBackground = ({ className = '' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Crear gradientes animados que simulan shaders
    let frame = 0;

    const animate = () => {
      frame += 0.005;
      
      // Limpiar canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Crear efectos de shader con gradientes radiales animados
      const createRadialEffect = (x, y, radius, color, opacity) => {
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(${color}, ${opacity})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      // Múltiples efectos de shader animados
      createRadialEffect(
        canvas.width * 0.2 + Math.sin(frame) * 100,
        canvas.height * 0.3 + Math.cos(frame * 0.8) * 80,
        400 + Math.sin(frame * 2) * 50,
        '27, 98, 252', // Azul #1b62fc
        0.15 + Math.sin(frame) * 0.05
      );

      createRadialEffect(
        canvas.width * 0.8 + Math.cos(frame * 1.2) * 120,
        canvas.height * 0.7 + Math.sin(frame * 0.6) * 100,
        350 + Math.cos(frame * 1.5) * 60,
        '27, 98, 252',
        0.1 + Math.cos(frame * 1.3) * 0.03
      );

      createRadialEffect(
        canvas.width * 0.5 + Math.sin(frame * 0.5) * 150,
        canvas.height * 0.5 + Math.cos(frame * 0.7) * 120,
        500 + Math.sin(frame * 0.8) * 80,
        '27, 98, 252',
        0.08 + Math.sin(frame * 2.1) * 0.02
      );

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`shader-background ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
};

export default ShaderBackground;
