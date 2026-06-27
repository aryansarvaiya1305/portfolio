/* ============================================================
   ARYAN SARVAIYA PORTFOLIO — main.js
   Navigation, scroll reveals, counters, contact form
   ============================================================ */

'use strict';

/* ── Scroll reveal (IntersectionObserver) ────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger skill bars when the skills section reveals
        if (entry.target.classList.contains('skill-fill')) {
          entry.target.style.width = entry.target.style.getPropertyValue('--fill') || '0%';
        }

        // Trigger learning progress bars
        if (entry.target.classList.contains('lp-bar')) {
          entry.target.classList.add('animated');
        }

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

// Observe all reveal elements
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) =>
  revealObserver.observe(el)
);

// Observe arch nodes and connectors independently
document.querySelectorAll('.arch-node, .arch-connector').forEach((el) =>
  revealObserver.observe(el)
);

// Observe skill bars
const skillBarObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        skillBarObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.skill-fill, .lp-bar').forEach((el) =>
  skillBarObserver.observe(el)
);

/* ── Floating Navbar ─────────────────────────────────────── */
const navbar  = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

let lastScrollY = 0;

function handleScroll() {
  const scrollY = window.scrollY;

  // Scrolled class for shadow
  navbar.classList.toggle('scrolled', scrollY > 50);

  lastScrollY = scrollY;
}

window.addEventListener('scroll', handleScroll, { passive: true });

/* ── Active nav link on scroll ───────────────────────────── */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach((s) => navObserver.observe(s));

/* ── Mobile nav toggle ───────────────────────────────────── */
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');

navToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

// Close on link click
navMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    navMenu?.classList.remove('open');
    navToggle?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* ── Animated Counters ───────────────────────────────────── */
function animateCounter(el, target, duration = 1400) {
  let start = 0;
  const startTime = performance.now();
  const isFloat   = target !== Math.floor(target);

  function update(currentTime) {
    const elapsed  = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = eased * target;
    el.textContent = isFloat ? value.toFixed(1) : Math.round(value).toString();
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'), 10);
        animateCounter(entry.target, target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('[data-target]').forEach((el) =>
  counterObserver.observe(el)
);

/* ── Contact Form ────────────────────────────────────────── */
const contactForm = document.getElementById('contactForm');
const formSuccess  = document.getElementById('formSuccess');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('.form-submit');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Sending…';

  // Simulate async send (replace with real API call)
  setTimeout(() => {
    contactForm.reset();
    formSuccess.hidden = false;
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
    submitBtn.classList.add('success');
    setTimeout(() => submitBtn.classList.remove('success'), 500);

    // Hide success after 6 seconds
    setTimeout(() => { formSuccess.hidden = true; }, 6000);
  }, 1200);
});

/* ── Footer year ─────────────────────────────────────────── */
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ── Smooth scroll for anchor links ─────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navHeight = navbar?.offsetHeight ?? 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ── Lazy image loading fallback ─────────────────────────── */
if ('loading' in HTMLImageElement.prototype) {
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.src = img.dataset.src || img.src;
  });
} else {
  // Intersection Observer fallback for older browsers
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        lazyObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[loading="lazy"]').forEach((img) =>
    lazyObserver.observe(img)
  );
}