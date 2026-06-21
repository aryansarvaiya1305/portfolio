/* =============================================
   ARYAN SARVAIYA — DevOps Portfolio
   script.js
   ============================================= */

'use strict';

/* ===========================================
   1. PARTICLE / STAR CANVAS
   =========================================== */
(function initCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, particles = [], mouse = { x: null, y: null };

  // Detect reduced motion preference
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  // Particle class
  function Particle() {
    this.reset();
  }

  Particle.prototype.reset = function () {
    this.x      = Math.random() * W;
    this.y      = Math.random() * H;
    this.size   = Math.random() * 1.5 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.2;
    this.speedY = (Math.random() - 0.5) * 0.2;
    this.alpha  = Math.random() * 0.6 + 0.1;
    this.twinkle = Math.random() * Math.PI * 2; // phase
    this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    // Occasional cyan tint
    this.isCyan = Math.random() < 0.08;
  };

  function buildParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function draw() {
    // Clear with subtle background tint
    ctx.clearRect(0, 0, W, H);

    // Very faint deep teal gradient overlay
    const grad = ctx.createRadialGradient(W * 0.5, H * 0.3, 0, W * 0.5, H * 0.3, W * 0.8);
    grad.addColorStop(0, 'rgba(0,80,100,0.08)');
    grad.addColorStop(1, 'rgba(7,26,34,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Render particles
    for (const p of particles) {
      p.twinkle += p.twinkleSpeed;
      const opacity = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));

      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.isCyan ? '#00D4FF' : '#FFFFFF';
      ctx.fill();
      ctx.restore();

      if (!reducedMotion) {
        p.x += p.speedX;
        p.y += p.speedY;

        // Subtle mouse repulsion
        if (mouse.x !== null) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            p.x += (dx / dist) * 0.5;
            p.y += (dy / dist) * 0.5;
          }
        }

        // Wrap edges
        if (p.x < -5)    p.x = W + 5;
        if (p.x > W + 5) p.x = -5;
        if (p.y < -5)    p.y = H + 5;
        if (p.y > H + 5) p.y = -5;
      }
    }
  }

  function loop() {
    draw();
    requestAnimationFrame(loop);
  }

  // Init
  resize();
  buildParticles(180);
  loop();

  window.addEventListener('resize', () => {
    resize();
    buildParticles(180);
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });
})();

/* ===========================================
   2. NAVBAR
   =========================================== */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  const links     = document.querySelectorAll('.nav-link');

  // Scroll state
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveLink();
  });

  // Hamburger toggle
  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active link tracking
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top <= 120) currentId = sec.id;
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }
})();

/* ===========================================
   3. SCROLL REVEAL
   =========================================== */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

/* ===========================================
   4. COUNTER ANIMATION
   =========================================== */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1500;
      const start = performance.now();

      function tick(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ===========================================
   5. SKILL BAR ANIMATION
   =========================================== */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill[data-width]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const fill  = entry.target;
      const width = fill.dataset.width;
      // Small delay for visual elegance
      setTimeout(() => {
        fill.style.width = width + '%';
      }, 100);
      observer.unobserve(fill);
    });
  }, { threshold: 0.3 });

  fills.forEach(f => observer.observe(f));
})();

/* ===========================================
   6. PARALLAX (light rays + portrait)
   =========================================== */
(function initParallax() {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const rays    = document.querySelectorAll('.ray');
  const portrait = document.querySelector('.portrait-wrapper');

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;

        // Rays move slightly on scroll
        rays.forEach((ray, i) => {
          const speed = 0.04 + i * 0.01;
          ray.style.transform = `rotate(${-20 + i * 10}deg) translateY(${sy * speed}px)`;
        });

        ticking = false;
      });
      ticking = true;
    }
  });

  // Portrait subtle mouse parallax
  if (portrait) {
    document.addEventListener('mousemove', (e) => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      portrait.style.transform = `translate(${dx * 8}px, ${dy * 8}px)`;
    });
  }
})();

/* ===========================================
   7. ARCHITECTURE FLOW ANIMATION
   =========================================== */
(function initArchFlow() {
  const archNodes = document.querySelectorAll('.arch-node .arch-box');
  if (!archNodes.length) return;

  let currentHighlight = 0;

  function pulse() {
    archNodes.forEach(n => n.style.boxShadow = '');

    const node = archNodes[currentHighlight];
    node.style.boxShadow = '0 0 20px rgba(0,212,255,0.35)';

    currentHighlight = (currentHighlight + 1) % archNodes.length;
    setTimeout(pulse, 700);
  }

  // Start pulsing when section is in view
  const archCard = document.querySelector('.arch-card');
  if (archCard) {
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(pulse, 600);
        obs.disconnect();
      }
    }, { threshold: 0.4 });
    obs.observe(archCard);
  }
})();

/* ===========================================
   8. SMOOTH SECTION TRANSITIONS
   =========================================== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ===========================================
   9. SKILL CARD GLOW ON HOVER
   =========================================== */
(function initSkillGlow() {
  const skillCards = document.querySelectorAll('.skill-card');
  skillCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 0 30px rgba(0,212,255,0.12), 0 20px 60px rgba(0,0,0,0.3)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });
})();

/* ===========================================
   10. TYPING EFFECT FOR HERO SUBTITLE
   =========================================== */
(function initTyping() {
  const titleEl = document.querySelector('.hero-title');
  if (!titleEl) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  const roles = [
    'Aspiring DevOps Engineer',
    'Cloud Infrastructure Builder',
    'CI/CD Pipeline Designer',
    'Automation Enthusiast',
  ];

  let roleIndex  = 0;
  let charIndex  = 0;
  let deleting   = false;
  const speed    = { type: 70, delete: 40, pause: 2000 };

  function type() {
    const current = roles[roleIndex];

    if (!deleting) {
      titleEl.textContent = current.slice(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, speed.pause);
        return;
      }
    } else {
      titleEl.textContent = current.slice(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }

    setTimeout(type, deleting ? speed.delete : speed.type);
  }

  // Start after a short intro delay
  setTimeout(type, 1200);
})();

/* ===========================================
   11. ROADMAP ITEM HOVER HIGHLIGHT
   =========================================== */
(function initRoadmapHover() {
  const items = document.querySelectorAll('.roadmap-item');
  items.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.color = 'var(--primary)';
      item.style.paddingLeft = '0.5rem';
      item.style.transition = 'all 0.2s ease';
    });
    item.addEventListener('mouseleave', () => {
      item.style.color = '';
      item.style.paddingLeft = '';
    });
  });
})();

/* ===========================================
   12. PAGE LOAD ENTRANCE
   =========================================== */
(function initPageLoad() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';

  window.addEventListener('load', () => {
    document.body.style.opacity = '1';

    // Trigger hero reveal immediately
    const heroReveals = document.querySelectorAll('.hero .reveal');
    heroReveals.forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), i * 150);
    });
  });
})();