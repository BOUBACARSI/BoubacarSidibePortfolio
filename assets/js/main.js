(() => {
  'use strict';

  const root = document.documentElement;
  const mobileQuery = window.matchMedia('(max-width: 968px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /*===== THÈME (sombre par défaut) =====*/
  const themeToggle = document.getElementById('theme-toggle');
  const getStoredTheme = () => { try { return localStorage.getItem('portfolio-theme'); } catch (e) { return null; } };
  const storeTheme = (t) => { try { localStorage.setItem('portfolio-theme', t); } catch (e) { /* stockage indisponible */ } };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#FFFFFF' : '#0A0A0A');
    if (themeToggle) {
      const icon = themeToggle.querySelector('i');
      icon.className = theme === 'light' ? 'bx bx-moon' : 'bx bx-sun';
      themeToggle.setAttribute('aria-label', theme === 'light' ? 'Passer au thème sombre' : 'Passer au thème clair');
    }
  };
  applyTheme(getStoredTheme() === 'light' ? 'light' : 'dark');

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
      storeTheme(next);
    });
  }

  /*===== MENU MOBILE =====*/
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  const setMenu = (open) => {
    if (!navToggle || !navMenu) return;
    navMenu.classList.toggle('show', open);
    document.body.classList.toggle('menu-open', open && mobileQuery.matches);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    navToggle.querySelector('i').className = open ? 'bx bx-x' : 'bx bx-menu';
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => setMenu(!navMenu.classList.contains('show')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('show')) { setMenu(false); navToggle.focus(); }
    });
    document.addEventListener('click', (e) => {
      if (mobileQuery.matches && navMenu.classList.contains('show') &&
          !navMenu.contains(e.target) && !navToggle.contains(e.target)) setMenu(false);
    });
    const onViewportChange = () => { if (!mobileQuery.matches) setMenu(false); };
    mobileQuery.addEventListener ? mobileQuery.addEventListener('change', onViewportChange) : mobileQuery.addListener(onViewportChange);
  }

  /*===== SOUS-MENU « PARCOURS » (clic sur mobile) =====*/
  document.querySelectorAll('.nav__item--dropdown').forEach((item) => {
    const link = item.querySelector('.nav__link--dropdown');
    if (!link) return;
    link.addEventListener('click', (e) => {
      if (mobileQuery.matches) {
        e.preventDefault();
        const open = item.classList.toggle('mobile-open');
        link.setAttribute('aria-expanded', String(open));
      }
    });
  });

  /* Fermer le menu au clic sur un lien de navigation */
  document.querySelectorAll('.nav__link:not(.nav__link--dropdown), .nav__dropdown-link').forEach((a) => {
    a.addEventListener('click', () => setMenu(false));
  });

  /*===== LIEN ACTIF AU DÉFILEMENT =====*/
  const sections = document.querySelectorAll('main section[id]');
  const links = new Map();
  document.querySelectorAll('.nav__menu a[href^="#"]').forEach((a) => links.set(a.getAttribute('href').slice(1), a));

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const link = links.get(entry.target.id);
        if (link && entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active-link'));
          link.classList.add('active-link');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /*===== OMBRE DU HEADER =====*/
  const header = document.querySelector('.header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /*===== ANIMATIONS D'ENTRÉE (ScrollReveal si disponible) =====*/
  window.addEventListener('load', () => {
    if (reduceMotion || typeof ScrollReveal === 'undefined') return;
    const distance = mobileQuery.matches ? '20px' : '40px';
    const sr = ScrollReveal({ origin: 'bottom', distance, duration: 700, easing: 'cubic-bezier(0.5, 0, 0, 1)', reset: false, mobile: true });
    sr.reveal('.hero__content', { delay: 100 });
    sr.reveal('.hero__image', { delay: 250 });
    sr.reveal('.section-title');
    sr.reveal('.about__img, .about__content', { interval: 150 });
    sr.reveal('.skill-card', { interval: 100 });
    sr.reveal('.project-card', { interval: 80 });
    sr.reveal('.projects__more, .experience__item, .certification__item, .leadership__item, .contact__form');
  });

  /*===== COMPTEURS ANIMÉS =====*/
  const animateCounter = (el) => {
    const target = parseInt(el.textContent, 10);
    if (Number.isNaN(target)) return;
    const suffix = el.textContent.replace(/[0-9]/g, '');
    if (reduceMotion) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.round(target * p) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ('IntersectionObserver' in window) {
    const counters = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const h = entry.target.querySelector('h4');
        if (h && !h.dataset.animated) { h.dataset.animated = 'true'; animateCounter(h); }
        counters.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.info-box').forEach((b) => counters.observe(b));
  }

  /*===== FORMULAIRE DE CONTACT (Formspree) =====*/
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');
  const MAIL = 'elabubakr1161@gmail.com';

  const setStatus = (msg, type) => {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + (type || '');
  };

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Envoi en cours...";
      setStatus('', '');

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        if (res.ok) {
          setStatus('Message envoyé. Je vous répondrai dès que possible.', 'success');
          form.reset();
        } else {
          const data = await res.json().catch(() => null);
          const msg = data && data.errors ? data.errors.map((er) => er.message).join(', ') : "Une erreur est survenue lors de l'envoi.";
          setStatus(msg + ' Vous pouvez aussi m\'écrire à ' + MAIL + '.', 'error');
        }
      } catch (err) {
        setStatus("Envoi impossible pour le moment. Merci de m'écrire directement à " + MAIL + '.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = original;
      }
    });
  }
})();