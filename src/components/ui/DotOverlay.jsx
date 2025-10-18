import React, { useEffect, useRef } from 'react';

const DotOverlay = ({ width = 400, height = 400 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const dots = Array.from({ length: 150 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.5,
      alpha: Math.random(),
      phase: Math.random() * Math.PI * 2,
    }));

    let scanY = 0;
    let scanDirection = 1;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Background subtle glow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Dots with flicker and glow
      dots.forEach(dot => {
        dot.phase += 0.04;
        dot.alpha = 0.5 + 0.5 * Math.sin(dot.phase);

        const gradient = ctx.createRadialGradient(dot.x, dot.y, 0, dot.x, dot.y, dot.radius * 2);
        gradient.addColorStop(0, `rgba(0,255,255,${dot.alpha})`);
        gradient.addColorStop(1, `rgba(0,255,255,0)`);

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius * 2, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      // Scan line (moving down)
      const scanGradient = ctx.createLinearGradient(0, scanY, 0, scanY + 20);
      scanGradient.addColorStop(0, 'rgba(0,255,255,0)');
      scanGradient.addColorStop(0.5, 'rgba(0,255,255,0.2)');
      scanGradient.addColorStop(1, 'rgba(0,255,255,0)');

      ctx.fillStyle = scanGradient;
      ctx.fillRect(0, scanY, width, 20);

      scanY += scanDirection * 1.5;
      if (scanY > height || scanY < 0) scanDirection *= -1;

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationFrameId);
  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 z-10 pointer-events-none mix-blend-screen"
    />
  );
};

export default DotOverlay;

