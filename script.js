/* ─────────────────────────────────────────────
   Aryan Sarvaiya — Portfolio
   script.js  ·  Vanilla JS
   ───────────────────────────────────────────── */

'use strict';

/* ── LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => loader.classList.add('out'), 1000);
});
setTimeout(() => {
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('out');
}, 2800);

/* ── NAV SCROLL SHADOW ── */
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 16);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── MOBILE BURGER ── */
const burger = document.getElementById('nav-burger');
const drawer = document.getElementById('nav-drawer');
if (burger && drawer) {
  burger.addEventListener('click', () => {
    const open = drawer.classList.toggle('open');
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
  });
  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      drawer.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 64;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});

/* ── FADE-UP REVEAL ── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });

document.querySelectorAll('.fade-up').forEach(el => revealObs.observe(el));

/* ── ACTIVE NAV LINK ── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
const activeObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-64px 0px -55% 0px' });
sections.forEach(s => activeObs.observe(s));

/* ── SKILL BAR ANIMATION ── */
const barObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.sbar-fill[data-w]').forEach(bar => {
      bar.style.width = bar.dataset.w + '%';
    });
    barObs.unobserve(entry.target);
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-block').forEach(b => barObs.observe(b));

/* ── STAT COUNTER ── */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.querySelectorAll('.stat-n[data-target]').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '+';
      let current = 0;
      const steps = 40;
      const inc = target / steps;
      const tick = () => {
        current = Math.min(current + inc, target);
        el.textContent = Math.round(current) + suffix;
        if (current < target) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    counterObs.unobserve(entry.target);
  });
}, { threshold: 0.5 });
const heroStats = document.querySelector('.hero-stats');
if (heroStats) counterObs.observe(heroStats);

/* ── PROJECT CARD SUBTLE TILT ── */
if (!window.matchMedia('(pointer: coarse)').matches) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      card.style.transform = `perspective(700px) rotateX(${-dy * 3}deg) rotateY(${dx * 3}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* ── FOOTER YEAR ── */
const yrEl = document.getElementById('yr');
if (yrEl) yrEl.textContent = new Date().getFullYear();
