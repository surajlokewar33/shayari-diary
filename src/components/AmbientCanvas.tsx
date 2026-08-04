'use client';

import { useEffect, useRef } from 'react';

type Mode = 'petals' | 'rain' | 'stars' | 'fireflies' | 'smoke' | 'none';

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  angle: number;
  opacity: number;
  hue?: number;
};

export default function AmbientCanvas({ mode = 'petals', className = '' }: { mode?: Mode; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (mode === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);
    let particles: Particle[] = [];
    let raf = 0;

    const count = mode === 'stars' ? 90 : mode === 'rain' ? 120 : mode === 'smoke' ? 14 : 45;

    function makeParticle(): Particle {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: mode === 'stars' ? Math.random() * 1.6 + 0.4 : Math.random() * 8 + 4,
        speed: Math.random() * 0.6 + 0.2,
        drift: Math.random() * 0.6 - 0.3,
        angle: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.5 + 0.2,
      };
    }

    function init() {
      particles = Array.from({ length: count }, makeParticle);
    }

    function resize() {
      width = canvas!.width = canvas!.offsetWidth;
      height = canvas!.height = canvas!.offsetHeight;
    }

    function drawPetal(p: Particle) {
      ctx!.save();
      ctx!.translate(p.x, p.y);
      ctx!.rotate(p.angle);
      ctx!.globalAlpha = p.opacity;
      ctx!.fillStyle = '#c4536b';
      ctx!.beginPath();
      ctx!.ellipse(0, 0, p.size, p.size / 2, 0, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawRain(p: Particle) {
      ctx!.save();
      ctx!.globalAlpha = p.opacity * 0.6;
      ctx!.strokeStyle = '#8fb3ff';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.moveTo(p.x, p.y);
      ctx!.lineTo(p.x - 2, p.y + p.size * 2);
      ctx!.stroke();
      ctx!.restore();
    }

    function drawStar(p: Particle) {
      const tw = 0.5 + 0.5 * Math.sin(Date.now() / 900 + p.x);
      ctx!.save();
      ctx!.globalAlpha = p.opacity * tw;
      ctx!.fillStyle = '#e4c878';
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawFirefly(p: Particle) {
      const tw = 0.4 + 0.6 * Math.sin(Date.now() / 500 + p.x * 0.1);
      ctx!.save();
      ctx!.globalAlpha = p.opacity * tw;
      const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
      grad.addColorStop(0, '#e4c878');
      grad.addColorStop(1, 'rgba(228,200,120,0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function drawSmoke(p: Particle) {
      ctx!.save();
      ctx!.globalAlpha = p.opacity * 0.15;
      const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 8);
      grad.addColorStop(0, '#8b93a7');
      grad.addColorStop(1, 'rgba(139,147,167,0)');
      ctx!.fillStyle = grad;
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size * 8, 0, Math.PI * 2);
      ctx!.fill();
      ctx!.restore();
    }

    function step(p: Particle) {
      if (mode === 'rain') {
        p.y += p.speed * 12;
        p.x += p.drift;
        if (p.y > height) { p.y = -10; p.x = Math.random() * width; }
      } else if (mode === 'stars') {
        // stationary, twinkle only
      } else if (mode === 'fireflies') {
        p.x += Math.sin(Date.now() / 1200 + p.y) * 0.4;
        p.y += Math.cos(Date.now() / 1500 + p.x) * 0.3;
      } else if (mode === 'smoke') {
        p.y -= p.speed * 0.3;
        p.x += p.drift * 0.2;
        if (p.y < -p.size * 8) { p.y = height + p.size * 8; p.x = Math.random() * width; }
      } else {
        // petals
        p.y += p.speed;
        p.x += Math.sin(p.y / 40) * 0.6 + p.drift;
        p.angle += 0.01;
        if (p.y > height) { p.y = -10; p.x = Math.random() * width; }
      }
    }

    function draw(p: Particle) {
      if (mode === 'petals') drawPetal(p);
      else if (mode === 'rain') drawRain(p);
      else if (mode === 'stars') drawStar(p);
      else if (mode === 'fireflies') drawFirefly(p);
      else if (mode === 'smoke') drawSmoke(p);
    }

    function loop() {
      ctx!.clearRect(0, 0, width, height);
      for (const p of particles) {
        step(p);
        draw(p);
      }
      raf = requestAnimationFrame(loop);
    }

    init();
    loop();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [mode]);

  if (mode === 'none') return null;

  return <canvas ref={canvasRef} className={`pointer-events-none absolute inset-0 w-full h-full ${className}`} aria-hidden="true" />;
}
