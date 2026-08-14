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
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ─────────────────────────────────────────────────────────────
   2. EYELID SHUTTER & MULTILINGUAL GREETINGS ANIMATION
   ───────────────────────────────────────────────────────────── */
(function initEyeGreetings() {
  const eyeOverlay   = document.getElementById('eye-loader');
  const greetingText = document.getElementById('greeting-text');
  const replayBtn    = document.getElementById('btn-replay-intro');

  if (!eyeOverlay || !greetingText) return;

  // Multilingual greetings list (English, French, Spanish, Hindi, Tamil, German, Italian, Portuguese, Japanese)
  const greetings = [
    'HELLO',
    'BONJOUR',
    'HOLA',
    'नमस्ते',
    'வணக்கம்',
    'HALLO',
    'CIAO',
    'OLÀ',
    'KONNICHIWA'
  ];

  let isPlaying = false;

  function runGreetingsSequence(onComplete) {
    let index = 0;

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

    showNextWord();
  }

  function playEyeIntro() {
    if (isPlaying) return;
    isPlaying = true;

    // 1. Close eyelids (curtains close)
    eyeOverlay.classList.remove('eye-open');

    // 2. Run greetings word cycling
    setTimeout(() => {
      runGreetingsSequence(() => {
        // 3. Open eyelids (smooth eye-opening transition to reveal hero page)
        setTimeout(() => {
          eyeOverlay.classList.add('eye-open');
          isPlaying = false;
        }, 300);
      });
    }, 400);
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
  const avatar = document.getElementById('hero-avatar');
  const brand  = document.querySelector('.hero-brand-title');
  if (!avatar || !brand) return;

  document.addEventListener('mousemove', (e) => {
    if (window.innerWidth < 850) return;

    const normX = (e.clientX / window.innerWidth - 0.5) * 2;
    const normY = (e.clientY / window.innerHeight - 0.5) * 2;

    // Subtle 3D tilt
    avatar.style.transform = `translateX(-50%) translate3d(${normX * 12}px, ${normY * 8}px, 0) scale(1.02)`;
    brand.style.transform  = `translate(-50%, -50%) translate3d(${normX * -15}px, ${normY * -10}px, 0)`;
  });
})();
