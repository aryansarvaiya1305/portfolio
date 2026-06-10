/* ─────────────────────────────────────────────
   ARYAN SARVAIYA — PORTFOLIO
   script.js  ·  Vanilla JS
   ───────────────────────────────────────────── */

'use strict';

/* ── LOADER ── */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 1200);
  });

  // Safety net: remove loader after 3s regardless
  setTimeout(() => loader.classList.add('hidden'), 3000);
})();

/* ── DARK / LIGHT MODE ── */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Respect system preference on first visit
  const saved = localStorage.getItem('theme');
  const pref  = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  html.setAttribute('data-theme', pref);

  if (!btn) return;
  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();

/* ── NAV — scroll shadow ── */
(function initNav() {
  const nav    = document.getElementById('nav');
  const burger = document.getElementById('nav-burger');
  const drawer = document.getElementById('nav-drawer');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // Mobile burger
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open);
      drawer.setAttribute('aria-hidden', !open);
    });

    // Close drawer on link click
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', false);
        drawer.setAttribute('aria-hidden', true);
      });
    });
  }
})();

/* ── SCROLL REVEAL ── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-right');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ── SMOOTH SCROLL for anchor links ── */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement)
                    .getPropertyValue('--nav-h')) || 68;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ── ACTIVE NAV LINKS on scroll ── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href^="#"], .nav-drawer a[href^="#"]');
  if (!sections.length || !links.length) return;

  const navH = 80;
  const obs  = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: `-${navH}px 0px -55% 0px` });

  sections.forEach(s => obs.observe(s));
})();

/* ── SKILL CHIPS — staggered entrance ── */
(function initSkillStagger() {
  const chips = document.querySelectorAll('.chip');
  chips.forEach((chip, i) => {
    chip.style.transitionDelay = `${i * 40}ms`;
  });
})();

/* ── PROJECT CARDS — tilt on mouse move ── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.project-card');
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const cx    = rect.left + rect.width  / 2;
      const cy    = rect.top  + rect.height / 2;
      const dx    = (e.clientX - cx) / (rect.width  / 2);
      const dy    = (e.clientY - cy) / (rect.height / 2);
      const rotX  = -dy * 5;
      const rotY  =  dx * 5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ── STAT COUNTER ANIMATION ── */
(function initCounters() {
  const stats = document.querySelectorAll('.stat-n');
  if (!stats.length) return;

  const parseNum = str => {
    const match = str.match(/[\d.]+/);
    return match ? parseFloat(match[0]) : 0;
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseNum(el.textContent);
      const suffix = el.textContent.replace(/[\d.]+/, '');
      let current  = 0;
      const step   = target / 40;
      const tick   = () => {
        current = Math.min(current + step, target);
        el.textContent = Math.round(current) + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(s => obs.observe(s));
})();

/* ── TYPED HERO EYEBROW ── */
(function initTyped() {
  const el = document.querySelector('.hero-eyebrow');
  if (!el) return;

  const texts   = ['Cloud Engineering · DevOps · AWS', 'Infrastructure Automation', 'Kubernetes · Docker · Terraform'];
  let   tIdx    = 0;
  let   cIdx    = 0;
  let   deleting = false;
  const delay   = () => deleting ? 45 : 85;

  const type = () => {
    const current = texts[tIdx];
    if (!deleting) {
      el.textContent = current.slice(0, ++cIdx);
      if (cIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      el.textContent = current.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        tIdx = (tIdx + 1) % texts.length;
      }
    }
    setTimeout(type, delay());
  };

  // Start after loader
  setTimeout(type, 1600);
})();

/* ── PARALLAX CLOUDS ── */
(function initParallax() {
  const clouds = document.querySelectorAll('.cloud');
  if (!clouds.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const speeds = [0.04, 0.02, 0.03, 0.025];

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    clouds.forEach((cloud, i) => {
      const speed = speeds[i % speeds.length];
      cloud.style.transform = `translateY(${y * speed}px)`;
    });
  }, { passive: true });
})();

/* ── TIMELINE ENTRANCE (cascaded) ── */
(function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  items.forEach((item, i) => {
    item.style.opacity    = '0';
    item.style.transform  = 'translateX(-16px)';
    item.style.transition = `opacity 0.5s ${i * 0.12}s, transform 0.5s ${i * 0.12}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const itemsInView = document.querySelectorAll('.tl-item');
      itemsInView.forEach(item => {
        item.style.opacity   = '1';
        item.style.transform = 'none';
      });
      obs.disconnect();
    });
  }, { threshold: 0.15 });

  const tl = document.querySelector('.timeline');
  if (tl) obs.observe(tl);
})();

/* ── FOOTER YEAR ── */
(function initYear() {
  const span = document.querySelector('.footer-inner span');
  if (span) span.textContent = span.textContent.replace('2025', new Date().getFullYear());
})();
