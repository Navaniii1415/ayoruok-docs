/* ==========================================================================
   AYO - RUOK | Security — interaction layer
   ========================================================================== */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  /* ---------------- Loader ---------------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('is-done');
      document.body.classList.add('is-ready');
      revealTopOfPage();
    }, 1400);
  });
  // Safety net in case 'load' is slow / already fired
  setTimeout(() => {
    if (!loader.classList.contains('is-done')) {
      loader.classList.add('is-done');
      revealTopOfPage();
    }
  }, 3200);

  function revealTopOfPage() {
    document.querySelectorAll('.hero [data-reveal]').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), i * 90);
    });
  }

  /* ---------------- Custom cursor ---------------- */
  if (!isCoarse) {
    const glow = document.getElementById('cursorGlow');
    const dot = document.getElementById('cursorDot');
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2;
    let dx = gx, dy = gy, tx = gx, ty = gy;

    window.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
    });

    function raf() {
      // dot: snappy follow
      dx += (tx - dx) * 0.35;
      dy += (ty - dy) * 0.35;
      dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
      // glow: lazy follow
      gx += (tx - gx) * 0.09;
      gy += (ty - gy) * 0.09;
      glow.style.transform = `translate(${gx}px, ${gy}px) translate(-50%,-50%)`;
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const hoverables = 'a, button, [data-tilt], [data-tilt-soft], input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) dot.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) dot.classList.remove('is-hover');
    });
  }

  /* ---------------- Nav scroll state + burger ---------------- */
  const nav = document.getElementById('nav');
  const navBurger = document.getElementById('navBurger');
  const navMobile = document.getElementById('navMobile');

  function onScroll() {
    nav.classList.toggle('is-scrolled', window.scrollY > 24);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  navBurger.addEventListener('click', () => {
    const open = navMobile.classList.toggle('is-open');
    navBurger.setAttribute('aria-expanded', String(open));
  });
  navMobile.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('is-open');
      navBurger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------- Scroll reveal ---------------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const siblings = [...el.parentElement.querySelectorAll('[data-reveal]')];
        const idx = siblings.indexOf(el);
        el.style.transitionDelay = `${Math.min(idx, 6) * 70}ms`;
        el.classList.add('is-visible');
        io.unobserve(el);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  revealEls.forEach((el) => {
    if (!el.closest('.hero')) io.observe(el);
  });

  /* ---------------- Count-up numbers ---------------- */
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const isFloat = el.dataset.count.includes('.');
      const dur = 1600;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = isFloat ? val.toFixed(2) : Math.round(val).toLocaleString();
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = isFloat ? target.toFixed(2) : target.toLocaleString();
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => cio.observe(el));

  /* ---------------- Live server count ticking ---------------- */
  const serverCountEl = document.getElementById('serverCount');
  if (serverCountEl) {
    let base = 42918;
    setInterval(() => {
      base += Math.floor(Math.random() * 3);
      serverCountEl.textContent = base.toLocaleString();
    }, 4000);
  }

  /* ---------------- Panel clock ---------------- */
  const clockEl = document.getElementById('panelClock');
  if (clockEl) {
    function updateClock() {
      const d = new Date();
      const p = (n) => String(n).padStart(2, '0');
      clockEl.textContent = `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  /* ---------------- Steps rail fill ---------------- */
  const stepsFill = document.getElementById('stepsLineFill');
  const stepsRail = document.querySelector('.steps-rail');
  if (stepsFill && stepsRail) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          stepsFill.style.width = '100%';
          sio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    sio.observe(stepsRail);
  }

  /* ---------------- Card tilt (desktop only) ---------------- */
  if (!isCoarse && !reduceMotion) {
    document.querySelectorAll('[data-tilt], [data-tilt-soft]').forEach((card) => {
      const soft = card.hasAttribute('data-tilt-soft');
      const maxTilt = soft ? 4 : 8;
      let rect = null;

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rx = (0.5 - py) * maxTilt * 2;
        const ry = (px - 0.5) * maxTilt * 2;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        rect = null;
      });
    });
  }

  /* ---------------- Ambient sentinel logo follows cursor slightly ---------------- */
  const sentinelLogo = document.getElementById('sentinelLogo');
  if (sentinelLogo && !isCoarse && !reduceMotion) {
    let lx = 0, ly = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => {
      const cxRatio = e.clientX / window.innerWidth - 0.5;
      const cyRatio = e.clientY / window.innerHeight - 0.5;
      lx = cxRatio * 24;
      ly = cyRatio * 24;
    });
    function follow() {
      cx += (lx - cx) * 0.05;
      cy += (ly - cy) * 0.05;
      sentinelLogo.style.transform = `translate(${cx}px, ${cy}px)`;
      requestAnimationFrame(follow);
    }
    requestAnimationFrame(follow);
  }

  /* ---------------- Floating particles ---------------- */
  const particlesHost = document.getElementById('bgParticles');
  if (particlesHost && !reduceMotion) {
    const count = window.innerWidth < 700 ? 14 : 28;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const size = 1 + Math.random() * 2.5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.top = `${100 + Math.random() * 20}%`;
      p.style.setProperty('--drift', `${(Math.random() - 0.5) * 80}px`);
      p.style.animationDuration = `${14 + Math.random() * 16}s`;
      p.style.animationDelay = `${Math.random() * 20}s`;
      p.style.opacity = String(0.3 + Math.random() * 0.5);
      particlesHost.appendChild(p);
    }
  }

  /* ---------------- Smooth anchor scroll offset for fixed nav ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top: y, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------------- Footer year ---------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
