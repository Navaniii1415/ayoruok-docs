/* ============================================================
   AYO - RUOK | SECURITY — COMPLETE SCRIPT
   ============================================================ */

(function() {
    'use strict';

    // ---------- INTRO OVERLAY ----------
    const overlay = document.getElementById('intro-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('hide');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1200);
        }, 2200);
    }

    // ---------- MOUSE GLOW ----------
    const glow = document.getElementById('mouse-glow');
    let glowActive = false;

    document.addEventListener('mousemove', (e) => {
        if (!glowActive) {
            glow.classList.add('active');
            glowActive = true;
        }
        const x = e.clientX;
        const y = e.clientY;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
    });

    document.addEventListener('mouseleave', () => {
        glow.classList.remove('active');
        glowActive = false;
    });

    // ---------- NAVBAR SCROLL EFFECT ----------
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (currentScroll > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // ---------- MOBILE MENU ----------
    const toggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggle && navLinks) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }

    // ---------- SCROLL REVEAL (Intersection Observer) ----------
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -30px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---------- ANIMATED COUNTERS ----------
    const statNumbers = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10);
                if (isNaN(target) || target === 0) return;
                const duration = 1800;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease-out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = Math.round(eased * target);
                    if (target === 999) {
                        el.textContent = (current / 10).toFixed(1) + '%';
                    } else if (target === 247) {
                        el.textContent = '24/7';
                    } else {
                        el.textContent = current.toLocaleString();
                    }
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        if (target === 999) {
                            el.textContent = '99.9%';
                        } else if (target === 247) {
                            el.textContent = '24/7';
                        } else {
                            el.textContent = target.toLocaleString();
                        }
                    }
                }
                requestAnimationFrame(updateCounter);
                counterObserver.unobserve(el);
            }
        });
    }, {
        threshold: 0.25
    });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                const offsetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ---------- PARALLAX HERO (subtle) ----------
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                const translate = scrolled * 0.15;
                heroContent.style.transform = `translateY(${translate}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
        });
    }

    console.log('AYO · RUOK | Premium Website Loaded Successfully');

})();
