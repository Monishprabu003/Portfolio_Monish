'use strict';
/* ═══════════════════════════════════════════════
   MONISH PRABU B — PORTFOLIO  v2  SCRIPTS
   Three.js Globe · Orbit Skills · Trail Cursor
   Typewriter · Scroll-snap · Side-nav · Counters
   ═══════════════════════════════════════════════ */

/* ──────────────────────────────────────
   UTILS
────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ──────────────────────────────────────
   1.  CURSOR + GLOW TRAIL
────────────────────────────────────── */
(function Cursor() {
  const dot    = $('#cursor-dot');
  const ring   = $('#cursor-ring');
  const canvas = $('#trail-canvas');
  if (!dot || !ring || !canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H;
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let mx = 0, my = 0, rx = 0, ry = 0;
  const trail = [];
  const TRAIL_LEN = 22;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  // initialise trail
  for (let i = 0; i < TRAIL_LEN; i++) trail.push({ x: 0, y: 0 });

  function loop() {
    // dot follows instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';

    // ring lags
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';

    // trail: shift and insert head
    trail.unshift({ x: mx, y: my });
    trail.length = TRAIL_LEN;

    // draw trail
    ctx.clearRect(0, 0, W, H);
    for (let i = 1; i < trail.length; i++) {
      const alpha = (1 - i / trail.length) * 0.35;
      const size  = (1 - i / trail.length) * 5;
      ctx.beginPath();
      ctx.arc(trail[i].x, trail[i].y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167,139,250,${alpha})`;
      ctx.fill();
    }

    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
})();


/* ──────────────────────────────────────
   2.  THREE.JS GLOBE (Hero Background)
────────────────────────────────────── */
(function Globe() {
  if (typeof THREE === 'undefined') return;
  const canvas = $('#three-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.set(0, 0, 3.2);

  function resize() {
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* — Wireframe sphere — */
  const sphereGeo  = new THREE.IcosahedronGeometry(1.15, 4);
  const sphereMat  = new THREE.MeshBasicMaterial({
    color: 0x7c3aed, wireframe: true,
    transparent: true, opacity: 0.18
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  scene.add(sphere);

  /* — Inner glow sphere — */
  const glowGeo = new THREE.SphereGeometry(1.08, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4, transparent: true, opacity: 0.04, side: THREE.BackSide
  });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  /* — Floating particles orbiting the sphere — */
  const PARTICLE_COUNT = 280;
  const positions = new Float32Array(PARTICLE_COUNT * 3);
  const particleData = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Fibonacci sphere distribution
    const phi   = Math.acos(1 - (2 * i) / PARTICLE_COUNT);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;
    const r = 1.22 + Math.random() * 0.3;
    positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
    particleData.push({ speed: 0.0003 + Math.random() * 0.0004 });
  }

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const ptMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.025, transparent: true, opacity: 0.6 });
  const points = new THREE.Points(ptGeo, ptMat);
  scene.add(points);

  /* — Orbiting ring — */
  const ringGeo = new THREE.TorusGeometry(1.4, 0.003, 8, 120);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, transparent: true, opacity: 0.3 });
  const ring1 = new THREE.Mesh(ringGeo, ringMat);
  ring1.rotation.x = Math.PI / 3;
  scene.add(ring1);

  const ring2 = ring1.clone();
  ring2.rotation.x = -Math.PI / 5;
  ring2.rotation.z = Math.PI / 4;
  scene.add(ring2);

  // mouse tilt
  let targetRotX = 0, targetRotY = 0;
  document.addEventListener('mousemove', e => {
    targetRotY =  (e.clientX / window.innerWidth  - 0.5) * 0.6;
    targetRotX = -(e.clientY / window.innerHeight - 0.5) * 0.4;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.006;

    sphere.rotation.y  += 0.0025;
    sphere.rotation.x  += 0.0008;
    points.rotation.y  += 0.0018;
    ring1.rotation.z   += 0.004;
    ring2.rotation.y   += 0.003;

    // smooth mouse tilt
    sphere.rotation.y += (targetRotY - sphere.rotation.y) * 0.02;
    sphere.rotation.x += (targetRotX - sphere.rotation.x) * 0.02;

    // camera gentle float
    camera.position.y = Math.sin(t) * 0.08;

    renderer.render(scene, camera);
  }
  animate();
})();


/* ──────────────────────────────────────
   3.  ORBIT SKILLS CANVAS (2D)
────────────────────────────────────── */
(function OrbitSkills() {
  const canvas = $('#orbit-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const SIZE = 360;
  canvas.width  = SIZE;
  canvas.height = SIZE;

  const icons = [
    { label:'Python',     color:'#3776AB' },
    { label:'Node.js',    color:'#339933' },
    { label:'Docker',     color:'#2496ED' },
    { label:'MongoDB',    color:'#47A248' },
    { label:'Git',        color:'#F05032' },
    { label:'Figma',      color:'#F24E1E' },
    { label:'Tailwind',   color:'#06B6D4' },
    { label:'Jenkins',    color:'#D24939' },
    { label:'PostgreSQL', color:'#336791' },
    { label:'Flask',      color:'#aaaaaa' },
  ];

  const CX = SIZE / 2, CY = SIZE / 2;
  const ORBITS = [
    { r: 70,  speed: 0.008, items: icons.slice(0, 4) },
    { r: 125, speed: -0.005, items: icons.slice(4, 7) },
    { r: 162, speed: 0.003, items: icons.slice(7) },
  ];
  ORBITS.forEach((o, oi) => {
    o.angles = o.items.map((_, i) => (i / o.items.length) * Math.PI * 2 + oi * 1.2);
  });

  let hover = null;
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (SIZE / rect.width);
    const my = (e.clientY - rect.top)  * (SIZE / rect.height);
    hover = null;
    ORBITS.forEach(o => {
      o.angles.forEach((a, i) => {
        const x = CX + Math.cos(a) * o.r;
        const y = CY + Math.sin(a) * o.r;
        if (Math.hypot(mx - x, my - y) < 22) hover = o.items[i].label;
      });
    });
  });
  canvas.addEventListener('mouseleave', () => { hover = null; });

  function draw() {
    ctx.clearRect(0, 0, SIZE, SIZE);

    // draw orbits
    ORBITS.forEach(o => {
      ctx.beginPath();
      ctx.arc(CX, CY, o.r, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // center dot
    const grd = ctx.createRadialGradient(CX, CY, 2, CX, CY, 28);
    grd.addColorStop(0, 'rgba(124,58,237,0.6)');
    grd.addColorStop(1, 'rgba(124,58,237,0)');
    ctx.beginPath();
    ctx.arc(CX, CY, 28, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(CX, CY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#a78bfa';
    ctx.fill();

    // draw items
    ORBITS.forEach(o => {
      o.angles = o.angles.map((a, i) => {
        const newA = a + o.speed;
        const x = CX + Math.cos(newA) * o.r;
        const y = CY + Math.sin(newA) * o.r;
        const item = o.items[i];
        const isHover = hover === item.label;
        const r = isHover ? 20 : 16;

        // glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, r * 2);
        g.addColorStop(0, item.color + '55');
        g.addColorStop(1, 'transparent');
        ctx.beginPath();
        ctx.arc(x, y, r * 2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();

        // circle
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = isHover ? item.color : 'rgba(17,17,24,0.92)';
        ctx.strokeStyle = item.color;
        ctx.lineWidth = isHover ? 2 : 1.5;
        ctx.fill();
        ctx.stroke();

        // label
        ctx.fillStyle = isHover ? '#fff' : item.color;
        ctx.font = isHover ? 'bold 7px Inter' : '6.5px Inter';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.label.length > 6 ? item.label.slice(0, 5) + '…' : item.label, x, y);

        return newA;
      });
    });

    requestAnimationFrame(draw);
  }
  draw();
})();


/* ──────────────────────────────────────
   4.  TYPEWRITER
────────────────────────────────────── */
(function Typewriter() {
  const el = $('#typewriter');
  if (!el) return;

  const phrases = [
    'scalable web apps.',
    'secure CI/CD pipelines.',
    'RESTful APIs.',
    'full-stack solutions.',
    'beautiful interfaces.',
  ];
  let pi = 0, ci = 0, del = false;

  function tick() {
    const cur = phrases[pi];
    el.textContent = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
    if (!del) ci++;
    else ci--;
    if (!del && ci === cur.length) { del = true; setTimeout(tick, 1800); return; }
    if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
    setTimeout(tick, del ? 48 : 88);
  }
  setTimeout(tick, 900);
})();


/* ──────────────────────────────────────
   5.  FULL-SCREEN SCROLL SNAP (JS)
────────────────────────────────────── */
(function ScrollSnap() {
  const sections = $$('.snap-section');
  if (!sections.length) return;

  // only activate on large screens
  let active = false;
  function checkSize() {
    active = window.innerWidth > 900;
    document.body.style.overflow = active ? 'hidden' : 'auto';
  }
  checkSize();
  window.addEventListener('resize', checkSize);

  let current = 0, scrolling = false;

  function goTo(idx) {
    if (idx < 0 || idx >= sections.length) return;
    current = idx;
    sections[idx].scrollIntoView({ behavior: 'smooth' });
    updateDots(idx);
    // brief lock to prevent double scroll
    scrolling = true;
    setTimeout(() => { scrolling = false; }, 900);
  }

  // wheel
  window.addEventListener('wheel', e => {
    if (!active || scrolling) return;
    if (e.deltaY > 30)       goTo(current + 1);
    else if (e.deltaY < -30) goTo(current - 1);
  }, { passive: true });

  // touch
  let touchY = 0;
  window.addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
  window.addEventListener('touchend', e => {
    if (!active || scrolling) return;
    const diff = touchY - e.changedTouches[0].clientY;
    if (diff > 40)       goTo(current + 1);
    else if (diff < -40) goTo(current - 1);
  }, { passive: true });

  // keyboard
  window.addEventListener('keydown', e => {
    if (!active || scrolling) return;
    if (e.key === 'ArrowDown' || e.key === 'PageDown') goTo(current + 1);
    if (e.key === 'ArrowUp'   || e.key === 'PageUp'  ) goTo(current - 1);
  });

  // side dot clicks
  $$('.side-nav-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
  });

  // anchor links
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = $(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const idx = sections.indexOf(target);
      if (idx !== -1 && active) goTo(idx);
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // top bar scroll state
  const topBar = $('#top-bar');
  function onScroll() {
    if (topBar) topBar.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ──────────────────────────────────────
   6.  SIDE NAV DOT UPDATE (via IntersectionObserver)
────────────────────────────────────── */
(function SideNav() {
  const dots    = $$('.side-nav-dot');
  const sections = $$('.snap-section');
  if (!dots.length || !sections.length) return;

  const map = {};
  sections.forEach((s, i) => { if (s.id) map[s.id] = i; });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        const idx = map[en.target.id];
        if (idx === undefined) return;
        dots.forEach((d, i) => d.classList.toggle('active', i === idx));
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => obs.observe(s));
})();

function updateDots(idx) {
  const dots = $$('.side-nav-dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === idx));
}


/* ──────────────────────────────────────
   7.  SCROLL REVEAL
────────────────────────────────────── */
(function Reveal() {
  // Sections other than hero need reveal for children
  const reveal = (el, delay = 0) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(32px)';
    el.style.transition = `opacity .65s ease ${delay}s, transform .65s ease ${delay}s`;
  };

  $$('.acard, .scat, .flip-card, .tl-body, .feat-item, .ccard').forEach((el, i) => {
    reveal(el, (i % 4) * 0.1);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.style.opacity   = '1';
        en.target.style.transform = 'translateY(0)';
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.acard, .scat, .flip-card, .tl-body, .feat-item, .ccard').forEach(el => obs.observe(el));
})();


/* ──────────────────────────────────────
   8.  NUMBER COUNTER
────────────────────────────────────── */
(function Counter() {
  const nums = $$('.hstat-n[data-target]');
  if (!nums.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el  = en.target;
      const end = +el.dataset.target;
      const dur = 1800;
      const t0  = performance.now();
      const easeOut = p => 1 - Math.pow(1 - p, 4);

      (function tick(now) {
        const prog = Math.min((now - t0) / dur, 1);
        el.textContent = Math.floor(easeOut(prog) * end);
        if (prog < 1) requestAnimationFrame(tick);
        else el.textContent = end;
      })(t0);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();


/* ──────────────────────────────────────
   9.  FLIP CARD — touch support
────────────────────────────────────── */
(function FlipTouch() {
  $$('.flip-card').forEach(card => {
    let flipped = false;
    card.addEventListener('click', () => {
      // Only activate on touch/small screens
      if (window.innerWidth > 900) return;
      flipped = !flipped;
      card.querySelector('.flip-inner').style.transform = flipped ? 'rotateY(180deg)' : '';
    });
  });
})();


/* ──────────────────────────────────────
   10.  ABOUT AVATAR — subtle mouse parallax
────────────────────────────────────── */
(function AvatarParallax() {
  const avatar = $('.about-avatar');
  if (!avatar) return;

  document.addEventListener('mousemove', e => {
    const rx = (e.clientY / window.innerHeight - 0.5) * -8;
    const ry = (e.clientX / window.innerWidth  - 0.5) *  8;
    avatar.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.03)`;
    avatar.style.transition = 'transform .1s ease';
  });
})();
