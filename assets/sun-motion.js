'use strict';
/* SUN COMPUTER — animaciones de presentación (no afecta site.js)
   1. Entradas al hacer scroll (.reveal, escalonadas con --d)
   2. Brillo cian que sigue al cursor (.glow)
   3. Inclinación 3D suave de tarjetas (.tilt)
   Respeta "reducir movimiento" del sistema y no inclina en pantallas táctiles. */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.documentElement.classList.add('motion-ready');

  /* 1. Entradas */
  const items = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(el => io.observe(el));
  }

  if (!finePointer) return;

  /* 2. Brillo que sigue al cursor */
  document.querySelectorAll('.glow').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* 3. Inclinación 3D */
  if (reduce) return;
  const MAX = 4; // grados
  document.querySelectorAll('.tilt').forEach(el => {
    let raf = 0;
    el.addEventListener('pointermove', e => {
      if (!el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.transform = `perspective(900px) rotateX(${(-y * MAX).toFixed(2)}deg) rotateY(${(x * MAX).toFixed(2)}deg) translateY(-4px)`;
      });
    });
    el.addEventListener('pointerleave', () => { cancelAnimationFrame(raf); el.style.transform = ''; });
  });
})();
