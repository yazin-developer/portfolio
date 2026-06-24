/* ============================================================
   script.js — Personal Profile Interactive Logic
   ============================================================ */

'use strict';

/* ── Navbar: scroll effect + active link ────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const hamburger = document.getElementById('hamburger');
  const linksMenu = document.getElementById('nav-links');
  const sections = document.querySelectorAll('section[id]');

  // Scroll → add "scrolled" class
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }, { passive: true });

  // Active link on scroll
  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }
  updateActiveLink();

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    const isOpen = linksMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.children[0].style.transform = isOpen ? 'rotate(45deg) translateY(7px)' : '';
    hamburger.children[1].style.opacity = isOpen ? '0' : '1';
    hamburger.children[2].style.transform = isOpen ? 'rotate(-45deg) translateY(-7px)' : '';
  });

  // Close menu on nav link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      linksMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.children[0].style.transform = '';
      hamburger.children[1].style.opacity = '1';
      hamburger.children[2].style.transform = '';
    });
  });
})();

/* ── Typed Role Effect ──────────────────────────────────── */
(function initTypedEffect() {
  const el = document.getElementById('typed-role');
  const roles = [
    'Cyber Security Student',
    'Game Developer',
    'Simulation Builder',
    'Problem Solver',
    'Creative Technologist',
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let timeout;

  function type() {
    const current = roles[roleIndex];

    if (!isDeleting) {
      charIndex++;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === current.length) {
        isDeleting = true;
        timeout = setTimeout(type, 1800);
        return;
      }
    } else {
      charIndex--;
      el.textContent = current.slice(0, charIndex);
      if (charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        timeout = setTimeout(type, 400);
        return;
      }
    }
    timeout = setTimeout(type, isDeleting ? 60 : 100);
  }
  type();
})();

/* ── Intersection Observer: Reveal Animations ───────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
})();

/* ── Skill Bar Animation ────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Small delay to let CSS transition kick in after paint
        requestAnimationFrame(() => {
          entry.target.classList.add('animated');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(fill => observer.observe(fill));
})();

/* ── Counter Animation ──────────────────────────────────── */
(function initCounters() {
  const counters = [
    { el: document.getElementById('stat-years'), target: 1, suffix: '+' },
    { el: document.getElementById('stat-projects'), target: 10, suffix: '+' },
    { el: document.getElementById('stat-clients'), target: 1, suffix: '' },
  ];

  function animateCounter(el, target, suffix) {
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const heroSection = document.getElementById('hero');
  const counterObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      counters.forEach(c => animateCounter(c.el, c.target, c.suffix));
      counterObserver.disconnect();
    }
  }, { threshold: 0.5 });

  if (heroSection) counterObserver.observe(heroSection);
})();

/* ── Contact Form ───────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');

  if (!form) return;

  function showToast(msg, isError = false) {
    toastMsg.textContent = msg;
    toast.style.borderColor = isError ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)';
    toast.firstElementChild.textContent = isError ? '❌' : '✅';
    toast.style.transform = 'translateY(0)';
    setTimeout(() => { toast.style.transform = 'translateY(120%)'; }, 3500);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const message = document.getElementById('form-message').value.trim();

    if (!name || !email || !message) {
      showToast('Please fill in all required fields.', true);
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address.', true);
      return;
    }

    // Simulate send
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
        <circle cx="12" cy="12" r="10" stroke-dasharray="60" stroke-dashoffset="40"/>
      </svg>
      [TRANSMITTING…]`;

    await new Promise(r => setTimeout(r, 1600));

    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      [TRANSMIT_SECURE_MESSAGE]`;

    form.reset();
    showToast('Message sent! I\'ll get back to you soon.');
  });
})();

/* ── Footer Year ────────────────────────────────────────── */
(function setYear() {
  const el = document.getElementById('current-year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Smooth Scroll for all anchor links ─────────────────── */
(function initSmoothScroll() {
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

/* ── Parallax Orbs on Mouse Move ─────────────────────────── */
(function initParallax() {
  const orb1 = document.querySelector('.hero-orb-1');
  const orb2 = document.querySelector('.hero-orb-2');
  if (!orb1 || !orb2) return;

  let ticking = false;

  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      orb1.style.transform = `translate(${x}px, ${y}px)`;
      orb2.style.transform = `translate(${-x * 0.6}px, ${-y * 0.6}px)`;
      ticking = false;
    });
  }, { passive: true });
})();

/* ── Add CSS spin keyframe for loader ───────────────────── */
(function addSpinStyle() {
  const style = document.createElement('style');
  style.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
})();

/* ── Cursor glow effect ─────────────────────────────────── */
(function initCursorGlow() {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%);
    pointer-events: none; z-index: 0;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  }, { passive: true });
})();

/* ── Project card ripple on click ───────────────────────── */
(function initProjectRipple() {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('div');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        border-radius:50%;
        background:rgba(59,130,246,0.08);
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        transform:scale(0); animation:rippleAnim 0.6s ease-out forwards;
        pointer-events:none; z-index:0;
      `;
      card.style.position = 'relative';
      card.style.overflow = 'hidden';
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes rippleAnim { to { transform: scale(2); opacity: 0; } }`;
  document.head.appendChild(style);
})();
