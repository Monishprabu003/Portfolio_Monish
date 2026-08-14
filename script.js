/* ═══════════════════════════════════════════════
   MONISH PRABU B — PORTFOLIO SCRIPTS
   Features: Cursor · Particles · Typewriter ·
             Scroll-spy · Reveal · 3D Tilt · Counter
   ═══════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. MAGNETIC CURSOR
   ───────────────────────────────────────── */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
})();


/* ─────────────────────────────────────────
   2. PARTICLE CANVAS
   ───────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const PARTICLE_COUNT = window.innerWidth < 768 ? 60 : 120;
  const CONNECT_DIST   = 120;
  const MOUSE_DIST     = 140;

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x   = Math.random() * W;
      this.y   = init ? Math.random() * H : Math.random() * H;
      this.vx  = (Math.random() - 0.5) * 0.4;
      this.vy  = (Math.random() - 0.5) * 0.4;
      this.r   = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.5 + 0.1;
      // pick accent color
      const colors = ['124,58,237', '6,182,212', '167,139,250', '99,102,241'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;

      // mouse repulsion
      const dx = this.x - mouse.x;
      const dy = this.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_DIST) {
        const force = (MOUSE_DIST - dist) / MOUSE_DIST;
        this.x += (dx / dist) * force * 2;
        this.y += (dy / dist) * force * 2;
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }
  loop();
})();


/* ─────────────────────────────────────────
   3. TYPEWRITER EFFECT
   ───────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const phrases = [
    'scalable web apps.',
    'secure APIs.',
    'DevSecOps pipelines.',
    'full-stack solutions.',
    'beautiful UIs.',
  ];

  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (!deleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = deleting ? 50 : 90;
    setTimeout(type, speed);
  }

  setTimeout(type, 800);
})();


/* ─────────────────────────────────────────
   4. NAVBAR — SCROLL + SCROLL-SPY
   ───────────────────────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Sticky style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // Scroll-spy
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { rootMargin: `-${getNavH()}px 0px -55% 0px` });

  function getNavH() {
    const nav = document.getElementById('navbar');
    return nav ? nav.offsetHeight : 72;
  }

  sections.forEach(s => observer.observe(s));

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();


/* ─────────────────────────────────────────
   5. SCROLL REVEAL (Intersection Observer)
   ───────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => observer.observe(el));
})();


/* ─────────────────────────────────────────
   6. 3D CARD TILT EFFECT
   ───────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width  / 2;
      const cy = rect.height / 2;
      const rotX = ((y - cy) / cy) * -8;
      const rotY = ((x - cx) / cx) *  8;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;

      // Move shine
      const shine = card.querySelector('.project-card-shine');
      if (shine) {
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        shine.style.background = `radial-gradient(circle at ${px}% ${py}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
        shine.style.opacity = '1';
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      const shine = card.querySelector('.project-card-shine');
      if (shine) {
        shine.style.opacity = '0';
        shine.style.background = '';
      }
    });
  });
})();


/* ─────────────────────────────────────────
   7. NUMBER COUNTER ANIMATION
   ───────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1800;
      const start  = performance.now();

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        el.textContent = Math.floor(easeOutQuart(progress) * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ─────────────────────────────────────────
   8. HERO AVATAR — PARALLAX ON SCROLL
   ───────────────────────────────────────── */
(function initHeroParallax() {
  const frame = document.querySelector('.avatar-frame');
  if (!frame) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const offset  = scrollY * 0.12;
    frame.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
})();


/* ─────────────────────────────────────────
   9. SKILL CHIPS — STAGGERED ENTRANCE
   ───────────────────────────────────────── */
(function initSkillChips() {
  const chips = document.querySelectorAll('.skill-chip');

  chips.forEach((chip, i) => {
    chip.style.opacity   = '0';
    chip.style.transform = 'translateY(12px)';
    chip.style.transition = `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.skill-chip').forEach(chip => {
        chip.style.opacity   = '1';
        chip.style.transform = 'translateY(0)';
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.skill-category').forEach(cat => observer.observe(cat));
})();


/* ─────────────────────────────────────────
   10. FEAT CARDS — STAGGER ON SCROLL
   ───────────────────────────────────────── */
(function initFeatCards() {
  const cards = document.querySelectorAll('.feat-card');
  cards.forEach((card, i) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateX(30px)';
    card.style.transition = `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const list = entry.target;
      list.querySelectorAll('.feat-card').forEach(card => {
        card.style.opacity   = '1';
        card.style.transform = 'translateX(0)';
      });
      observer.unobserve(list);
    });
  }, { threshold: 0.15 });

  const list = document.getElementById('feats-list');
  if (list) observer.observe(list);
})();


/* ─────────────────────────────────────────
   11. TIMELINE ITEMS — ANIMATE IN
   ───────────────────────────────────────── */
(function initTimeline() {
  const items = document.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    item.style.opacity    = '0';
    item.style.transform  = 'translateX(-20px)';
    item.style.transition = `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity   = '1';
        item.style.transform = 'translateX(0)';
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  const tl = document.getElementById('experience-timeline');
  if (tl) observer.observe(tl);
})();
