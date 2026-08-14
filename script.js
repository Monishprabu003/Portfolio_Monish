'use strict';
/* ═══════════════════════════════════════════════════════════════
   MONISH PRABU — PORTFOLIO SCRIPT
   - Magnetic Cursor
   - Eyelid Shutter & Multilingual Greetings Animation
   - Dynamic 3D Portrait & Typography Tilt
   ═══════════════════════════════════════════════════════════════ */

/* ─────────────────────────────────────────────────────────────
   1. CUSTOM MAGNETIC CURSOR
   ───────────────────────────────────────────────────────────── */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
})();

/* ─────────────────────────────────────────────────────────────
   2. EYELID SHUTTER & MULTILINGUAL GREETINGS ANIMATION
   ───────────────────────────────────────────────────────────── */
(function initEyeGreetings() {
  const eyeOverlay         = document.getElementById('eye-loader');
  const greetingText       = document.getElementById('greeting-text');
  const greetingsContainer = document.querySelector('.greetings-container');
  const replayBtn          = document.getElementById('btn-replay-intro');

  if (!eyeOverlay || !greetingText || !greetingsContainer) return;

  // Multilingual greetings list (English, Spanish, Tamil, French, Hindi, German, Italian, Portuguese, Japanese)
  const greetings = [
    'HELLO',
    'HOLA',
    'வணக்கம்',
    'BONJOUR',
    'नमस्ते',
    'HALLO',
    'CIAO',
    'OLÀ',
    'KONNICHIWA'
  ];

  let isPlaying = false;

  function runGreetingsSequence(onComplete) {
    let index = 1;

    function showNextWord() {
      if (index >= greetings.length) {
        if (onComplete) onComplete();
        return;
      }

      // Exit transition
      greetingText.classList.add('word-exit');

      setTimeout(() => {
        greetingText.textContent = greetings[index];
        greetingText.classList.remove('word-exit');
        greetingText.classList.add('word-enter');

        // Force reflow
        void greetingText.offsetWidth;

        greetingText.classList.remove('word-enter');
        index++;

        // Display timing per word (faster rhythm for cinematic feel)
        setTimeout(showNextWord, 260);
      }, 140);
    }

    // Show initial word ('HELLO') for 300ms before starting transitions
    setTimeout(showNextWord, 300);
  }

  function playEyeIntro() {
    if (isPlaying) return;
    isPlaying = true;

    // Reset greeting to first word ('HELLO') and hide text during shutter closing
    greetingText.textContent = greetings[0];
    greetingText.classList.remove('word-exit', 'word-enter');
    greetingsContainer.style.opacity = '0';
    greetingsContainer.style.transition = 'opacity 0.25s ease';

    // 1. Close eyelids (curtains close)
    eyeOverlay.classList.remove('eye-open');

    // 2. Only show text and run sequence after screen is ~90% closed (700ms)
    setTimeout(() => {
      greetingsContainer.style.opacity = '1';
      runGreetingsSequence(() => {
        // Fade out text before eyelids open
        greetingsContainer.style.opacity = '0';

        // 3. Open eyelids (smooth eye-opening transition to reveal hero page)
        setTimeout(() => {
          eyeOverlay.classList.add('eye-open');
          isPlaying = false;
        }, 200);
      });
    }, 700);
  }

  // Initial Sequence:
  // Show page for 2.5 seconds, then trigger the eye shutter + multilingual greetings sequence,
  // then open up into the first page!
  setTimeout(() => {
    playEyeIntro();
  }, 2500);

  // Allow replaying via the Intro button
  if (replayBtn) {
    replayBtn.addEventListener('click', () => {
      playEyeIntro();
    });
  }
})();

/* ─────────────────────────────────────────────────────────────
   3. SUBTLE MOUSE PARALLAX (Portrait & Brand Title)
   ───────────────────────────────────────────────────────────── */
(function initParallax() {
  const avatarWrapper = document.querySelector('.portrait-wrapper');
  const brand = document.querySelector('.hero-brand-title');
  if (!avatarWrapper || !brand) return;

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 850) return;

    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    // Smooth subtle floating without breaking center alignment
    avatarWrapper.style.transform = `translateX(calc(-50% + ${normX * 8}px)) translateY(${normY * 4}px)`;
    brand.style.transform = `translate(calc(-50% + ${normX * -10}px), calc(-50% + ${normY * -6}px))`;
  });
})();

/* ─────────────────────────────────────────────────────────────
   4. SCROLL-DRIVEN DYNAMIC VERTICAL CHAINS (Up/Down Momentum)
   ───────────────────────────────────────────────────────────── */
(function initScrollChains() {
  const trackLeft = document.getElementById('chain-track-left');
  const trackRight = document.getElementById('chain-track-right');
  if (!trackLeft || !trackRight) return;

  let lastScrollY = window.scrollY;
  let leftPos = -120;
  let rightPos = -60;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - lastScrollY;
    lastScrollY = currentScrollY;

    // Left chain moves UP when scrolling down (and down when scrolling up)
    leftPos -= scrollDelta * 0.45;
    // Right chain moves in counter-direction or alternate speed
    rightPos += scrollDelta * 0.35;

    // Wrap around for seamless infinite vertical chain loop
    if (leftPos < -350) leftPos = 0;
    if (leftPos > 50) leftPos = -300;
    if (rightPos > 50) rightPos = -300;
    if (rightPos < -350) rightPos = 0;

    trackLeft.style.transform = `translate3d(0, ${leftPos}px, 0)`;
    trackRight.style.transform = `translate3d(0, ${rightPos}px, 0)`;
  }, { passive: true });
})();

/* ─────────────────────────────────────────────────────────────
   5. PROJECT CARDS SCROLL REVEAL (Staggered Animation)
   ───────────────────────────────────────────────────────────── */
(function initCardsReveal() {
  const cards = document.querySelectorAll('.pcard');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, (i % 3) * 120);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(36px)';
    card.style.transition = 'opacity 0.6s var(--ease-smooth), transform 0.6s var(--ease-smooth)';
    observer.observe(card);
  });
})();

/* ─────────────────────────────────────────────────────────────
   6. EDUCATION ROWS HOVER PREVIEW (Floating Card Tracking)
   ───────────────────────────────────────────────────────────── */
(function initEducationHoverPreview() {
  const preview = document.getElementById('edu-hover-preview');
  const visual = document.getElementById('edu-preview-visual');
  const rows = document.querySelectorAll('.edu-row');
  const eduStage = document.getElementById('education');

  if (!preview || !visual || !rows.length || !eduStage) return;

  const visualData = {
    'preview-college': {
      class: 'preview-college',
      icon: '<i class="fa-solid fa-graduation-cap"></i>',
      label: 'Sri Shakthi Institute'
    },
    'preview-hsc': {
      class: 'preview-hsc',
      icon: '<i class="fa-solid fa-school"></i>',
      label: 'Higher Secondary (HSC)'
    },
    'preview-sslc': {
      class: 'preview-sslc',
      icon: '<i class="fa-solid fa-book-open"></i>',
      label: 'Secondary School (SSLC)'
    }
  };

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let isHovering = false;

  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      isHovering = true;
      rows.forEach(r => r.classList.remove('active'));
      row.classList.add('active');

      const type = row.getAttribute('data-visual');
      const data = visualData[type] || visualData['preview-college'];

      visual.className = `edu-preview-visual ${data.class}`;
      visual.innerHTML = `
        <div class="preview-glow"></div>
        <div class="preview-icon">${data.icon}</div>
        <span class="preview-label">${data.label}</span>
      `;

      preview.classList.add('visible');
    });

    row.addEventListener('mousemove', (e) => {
      const rect = eduStage.getBoundingClientRect();
      targetX = e.clientX - rect.left + 24;
      targetY = e.clientY - rect.top - 70;
    });

    row.addEventListener('mouseleave', () => {
      isHovering = false;
      preview.classList.remove('visible');
    });
  });

  function renderPreviewMotion() {
    if (isHovering) {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      preview.style.left = `${currentX}px`;
      preview.style.top = `${currentY}px`;
    }
    requestAnimationFrame(renderPreviewMotion);
  }
  renderPreviewMotion();
})();

/* ─────────────────────────────────────────────────────────────
   7. MY STACK ITEMS SCROLL REVEAL
   ───────────────────────────────────────────────────────────── */
(function initStackReveal() {
  const stackRows = document.querySelectorAll('.stack-category-row');
  if (!stackRows.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  stackRows.forEach(row => {
    row.style.opacity = '0';
    row.style.transform = 'translateY(28px)';
    row.style.transition = 'opacity 0.55s var(--ease-smooth), transform 0.55s var(--ease-smooth)';
    observer.observe(row);
  });
})();

/* ─────────────────────────────────────────────────────────────
   8. CONTACT STAGE INTERACTION (Live Clock & Copy Email)
   ───────────────────────────────────────────────────────────── */
(function initContactInteractive() {
  // 1. Live Coimbatore (IST) Clock
  const clockEl = document.getElementById('live-ist-clock');
  function updateISTClock() {
    if (!clockEl) return;
    const now = new Date();
    // Format in IST (Asia/Kolkata)
    const options = {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockEl.textContent = `${new Intl.DateTimeFormat('en-US', options).format(now)} IST`;
  }
  updateISTClock();
  setInterval(updateISTClock, 1000);

  // 2. Email Copy Button
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-btn-text');
  const emailVal = 'monishprabu392005@gmail.com';

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailVal);
        const original = copyText.textContent;
        copyText.textContent = 'Copied! ✓';
        copyBtn.style.background = '#000000';
        copyBtn.style.color = '#ffffff';

        setTimeout(() => {
          copyText.textContent = original;
          copyBtn.style.background = '';
          copyBtn.style.color = '';
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        window.location.href = `mailto:${emailVal}`;
      }
    });
  }
})();

/* ─────────────────────────────────────────────────────────────
   9. DYNAMIC NAV SCROLLSPY (Pill background on current section)
   ───────────────────────────────────────────────────────────── */
(function initNavScrollSpy() {
  const navLinks = document.querySelectorAll('.floating-nav-menu .nav-item');
  if (!navLinks.length) return;

  const sections = [
    { id: 'education', el: document.getElementById('education') },
    { id: 'projects', el: document.getElementById('projects') },
    { id: 'technologies', el: document.getElementById('technologies') },
    { id: 'contact', el: document.getElementById('contact') }
  ];

  function onScrollSpy() {
    const scrollPos = window.scrollY + 200;

    let currentSectionId = '';
    for (let i = sections.length - 1; i >= 0; i--) {
      const sec = sections[i];
      if (sec.el && sec.el.offsetTop <= scrollPos) {
        currentSectionId = sec.id;
        break;
      }
    }

    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', onScrollSpy, { passive: true });
  onScrollSpy();

  // Instant active switch on click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
})();
