/* ============================================================
   YASIN ULLAKHAN A — PORTFOLIO SCRIPT
   Futuristic Cyberpunk Command Center Interactivity
   ============================================================ */

'use strict';

/* ── Cyber Grid Background Canvas ─────────────────────────── */
(function initCyberGrid() {
  const canvas = document.getElementById('cyber-grid');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId = null;
  let width = 0;
  let height = 0;
  let isHeroVisible = true;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Grid packets/nodes that travel along grid lines
  const packets = [];
  const maxPackets = 18;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.parentElement.offsetHeight || 600;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    ctx.scale(dpr, dpr);
  }

  function createPacket() {
    const isHorizontal = Math.random() > 0.5;
    const gridSize = 40;
    return {
      x: Math.floor(Math.random() * (width / gridSize)) * gridSize,
      y: Math.floor(Math.random() * (height / gridSize)) * gridSize,
      length: Math.random() * 30 + 15,
      speed: Math.random() * 1.5 + 0.8,
      horizontal: isHorizontal,
      color: Math.random() > 0.35 ? 'rgba(0, 240, 255, ' : 'rgba(168, 85, 247, ',
      opacity: Math.random() * 0.5 + 0.3
    };
  }

  // Populate initial packets
  for (let i = 0; i < maxPackets; i++) {
    packets.push(createPacket());
  }

  function drawGrid() {
    ctx.clearRect(0, 0, width, height);

    const gridSize = 40;
    ctx.lineWidth = 1;

    // Draw vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw subtle grid intersections
    ctx.fillStyle = 'rgba(0, 240, 255, 0.15)';
    for (let x = 0; x <= width; x += gridSize * 2) {
      for (let y = 0; y <= height; y += gridSize * 2) {
        ctx.fillRect(x - 1, y - 1, 2, 2);
      }
    }

    // If user prefers reduced motion, draw static grid only
    if (isReducedMotion) return;

    // Draw traveling light packets
    packets.forEach((p, idx) => {
      ctx.strokeStyle = `${p.color}${p.opacity})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();

      if (p.horizontal) {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + p.length, p.y);
        p.x += p.speed;
        if (p.x > width) packets[idx] = createPacket();
      } else {
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x, p.y + p.length);
        p.y += p.speed;
        if (p.y > height) packets[idx] = createPacket();
      }
      ctx.stroke();
    });
  }

  function animate() {
    if (isHeroVisible && document.visibilityState === 'visible') {
      drawGrid();
      animationFrameId = requestAnimationFrame(animate);
    }
  }

  // IntersectionObserver to pause when hero is scrolled out of view
  const heroSection = document.getElementById('hero');
  if ('IntersectionObserver' in window && heroSection) {
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
      if (isHeroVisible && !isReducedMotion) {
        cancelAnimationFrame(animationFrameId);
        animate();
      }
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  window.addEventListener('resize', () => {
    resize();
    drawGrid();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && isHeroVisible && !isReducedMotion) {
      cancelAnimationFrame(animationFrameId);
      animate();
    }
  });

  resize();
  drawGrid();
  if (!isReducedMotion) {
    animate();
  }
})();

/* ── Scroll Reveal via IntersectionObserver ───────────────── */
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Immediate visibility if user prefers reduced motion or no IntersectionObserver
  if (isReducedMotion || !('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.05
  });

  reveals.forEach(el => observer.observe(el));

  // Safety fallback: ensure all elements become visible if observer stalls
  window.addEventListener('load', () => {
    setTimeout(() => {
      reveals.forEach(el => {
        if (!el.classList.contains('visible')) {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight + 100) {
            el.classList.add('visible');
          }
        }
      });
    }, 400);
  });
})();

/* ── Navbar Scroll & Active Tracking ─────────────────────── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-overlay');
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');
  const iconMenu = navToggle ? navToggle.querySelector('.icon-menu') : null;
  const iconClose = navToggle ? navToggle.querySelector('.icon-close') : null;

  /* Scrolled shadow */
  window.addEventListener('scroll', () => {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }

    /* Active link highlighting */
    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }, { passive: true });

  /* Mobile menu toggle */
  function openMenu() {
    navLinks.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    if (overlay) overlay.classList.add('active');
    if (iconMenu) iconMenu.style.display = 'none';
    if (iconClose) iconClose.style.display = '';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    if (overlay) overlay.classList.remove('active');
    if (iconMenu) iconMenu.style.display = '';
    if (iconClose) iconClose.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    /* Close menu when a nav link is clicked */
    links.forEach(l => {
      l.addEventListener('click', closeMenu);
    });

    /* Close menu when overlay is clicked */
    if (overlay) {
      overlay.addEventListener('click', closeMenu);
    }

    /* Close menu on Escape key */
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navLinks.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }
})();

/* ── Technical Notes / Lab Writeups Modal ─────────────────── */
(function initNotesModal() {
  const modal = document.getElementById('note-modal');
  const contentArea = document.getElementById('modal-content-area');
  const closeBtn = document.getElementById('modal-close-btn');
  const noteCards = document.querySelectorAll('.note-card[data-note]');
  let lastFocusedElement = null;

  if (!modal || !contentArea) return;

  const notesDatabase = {
    arp: {
      title: 'How ARP Spoofing Works & How I Wrote a Detector in Python',
      date: 'Published February 2026 · Network Security & Protocol Analysis',
      body: `
        <p>The Address Resolution Protocol (ARP) was conceived in 1982 (RFC 826) for trusted local networks. It maps a Layer 3 IPv4 address to a Layer 2 hardware MAC address.</p>
        <p>The fundamental design flaw of ARP is that it is entirely <strong>stateless</strong>. Hosts accept and cache ARP replies even if they never sent an ARP request. If an attacker on the same local subnet broadcasts:</p>
        <pre><code>ARP Reply: 192.168.1.1 (Gateway) is at [Attacker's MAC Address]</code></pre>
        <p>Target hosts will immediately overwrite their internal ARP cache table, routing all gateway-bound packets straight through the attacker's network interface (Man-in-the-Middle).</p>
        
        <h3>Writing the Anomaly Detector in Python</h3>
        <p>To detect this without bulky commercial appliances, I used Python's <code>socket</code> library with raw Ethernet frames:</p>
        <pre><code>import socket, struct

# Open raw packet socket on Linux
s = socket.socket(socket.AF_PACKET, socket.SOCK_RAW, socket.ntohs(0x0806))
known_ip_mac_table = {}

while True:
    packet = s.recvfrom(2048)[0]
    arp_header = packet[14:42]
    arp_data = struct.unpack("2s2s1s1s2s6s4s6s4s", arp_header)
    
    sender_mac = ":".join(f"{b:02x}" for b in arp_data[5])
    sender_ip  = ".".join(str(b) for b in arp_data[6])

    if sender_ip in known_ip_mac_table and known_ip_mac_table[sender_ip] != sender_mac:
        print(f"[!] ALERT: Potential ARP Spoofing on {sender_ip}!")
        print(f"    Expected: {known_ip_mac_table[sender_ip]} | Received: {sender_mac}")
    else:
        known_ip_mac_table[sender_ip] = sender_mac</code></pre>
        <p><strong>Takeaway:</strong> By inspecting the raw frames directly, we can maintain an ephemeral state table and detect malicious MAC drifts in real time.</p>
      `
    },
    physics: {
      title: 'From Physics Loops to Security: Why Systems Knowledge Matters',
      date: 'Published January 2026 · Systems Programming & Philosophy',
      body: `
        <p>When I started programming, I built 2D physics engines and game mechanics from scratch in Python and Pygame rather than relying on engines like Unity or Unreal.</p>
        <p>In a rigid-body physics engine, you calculate the following every 16.6 milliseconds (60 FPS):</p>
        <ul>
          <li>Numerical integration (position = position + velocity * dt)</li>
          <li>Broad-phase bounding box culling</li>
          <li>Narrow-phase Separating Axis Theorem (SAT) collision math</li>
          <li>Impulse resolution with restitution and friction</li>
        </ul>
        <p>If your float precision slips or your delta time spikes, objects tunnel through solid walls ("bullet through paper" problem). If you mutate a list during an iteration cycle, the state machine corrupts.</p>

        <h3>The Security Bridge</h3>
        <p>When you transition from that to analyzing computer systems security, you quickly realize that <strong>vulnerabilities are almost always unexpected state transitions</strong>:</p>
        <ul>
          <li>A buffer overflow is just an input exceeding the developer's assumed bounding box.</li>
          <li>A race condition in multithreading is just an unsynchronized gameloop.</li>
          <li>A format string vulnerability is just unvalidated string formatting in memory.</li>
        </ul>
        <p>Building real software from the mathematical roots up gave me the architectural intuition needed to anticipate where software fails.</p>
      `
    },
    siem: {
      title: 'Analyzing /var/log/auth.log to Spot SSH Brute-Force Attacks',
      date: 'Published December 2025 · Defensive SecOps & Linux Hardening',
      body: `
        <p>Every Linux server exposed to the public internet gets probed by automated botnets within minutes. On Debian and Ubuntu systems, all authentication events are logged to <code>/var/log/auth.log</code>.</p>
        <p>A typical brute-force attempt produces thousands of entries that look like this:</p>
        <pre><code>sshd[14210]: Failed password for invalid user admin from 198.51.100.24 port 43210 ssh2
sshd[14212]: Failed password for root from 198.51.100.24 port 43212 ssh2</code></pre>
        
        <h3>Automated Triage Script</h3>
        <p>Instead of manually grep-ing through gigabytes of logs, I wrote a lightweight Python daemon that tails the log file, parses IP addresses using regular expressions, and maintains a sliding window count of failures per IP:</p>
        <pre><code># Sliding window threshold logic
if ip_failure_count[attacker_ip] > 5:
    os.system(f"ufw insert 1 deny from {attacker_ip} to any")
    log_security_alert(f"Banned malicious IP {attacker_ip}")</code></pre>
        <p><strong>Lesson learned:</strong> Good defensive security isn't about buying expensive tools. It's about understanding the telemetry your systems already provide and writing clean, reliable scripts to act on it.</p>
      `
    }
  };

  function openNote(key, triggerElement) {
    const note = notesDatabase[key];
    if (!note) return;

    lastFocusedElement = triggerElement || document.activeElement;

    contentArea.innerHTML = `
      <h3 id="modal-title">${note.title}</h3>
      <div class="meta">${note.date}</div>
      ${note.body}
    `;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    /* Focus close button for accessibility */
    closeBtn && closeBtn.focus();
  }

  function closeNote() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    /* Restore focus to the card that triggered the modal */
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  noteCards.forEach(card => {
    card.setAttribute('aria-haspopup', 'dialog');

    card.addEventListener('click', () => {
      const key = card.getAttribute('data-note');
      openNote(key, card);
    });

    /* Keyboard accessibility for note cards */
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const key = card.getAttribute('data-note');
        openNote(key, card);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeNote);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeNote();
  });

  // Modal key handling: Escape to close, Tab focus trapping
  window.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') {
      closeNote();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;

      const firstEl = focusable[0];
      const lastEl = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    }
  });
})();

/* ── Contact Form Handling ───────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = document.getElementById('toast-icon');
  const successBanner = document.getElementById('form-success-banner');

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const msgInput = document.getElementById('form-message');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorMsg = document.getElementById('error-message');

  if (!form || !submitBtn) return;

  const originalBtnText = submitBtn.innerHTML;

  /* ── Inline field validation helpers ── */
  function setError(input, errorEl, message) {
    input.classList.add('error');
    input.classList.remove('valid');
    errorEl.textContent = message;
    errorEl.classList.add('visible');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input, errorEl) {
    input.classList.remove('error');
    input.classList.add('valid');
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
    input.removeAttribute('aria-invalid');
  }

  /* Live validation on blur and input typing */
  nameInput && nameInput.addEventListener('blur', () => {
    if (!nameInput.value.trim()) {
      setError(nameInput, errorName, 'Please enter your name.');
    } else {
      clearError(nameInput, errorName);
    }
  });

  nameInput && nameInput.addEventListener('input', () => {
    if (nameInput.classList.contains('error') && nameInput.value.trim()) {
      clearError(nameInput, errorName);
    }
  });

  emailInput && emailInput.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    if (!val) {
      setError(emailInput, errorEmail, 'Please enter your email address.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setError(emailInput, errorEmail, 'Please enter a valid email address (e.g. you@example.com).');
    } else {
      clearError(emailInput, errorEmail);
    }
  });

  emailInput && emailInput.addEventListener('input', () => {
    const val = emailInput.value.trim();
    if (emailInput.classList.contains('error') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      clearError(emailInput, errorEmail);
    }
  });

  msgInput && msgInput.addEventListener('blur', () => {
    if (!msgInput.value.trim()) {
      setError(msgInput, errorMsg, 'Please write a message before sending.');
    } else {
      clearError(msgInput, errorMsg);
    }
  });

  msgInput && msgInput.addEventListener('input', () => {
    if (msgInput.classList.contains('error') && msgInput.value.trim()) {
      clearError(msgInput, errorMsg);
    }
  });

  /* ── Toast notification ── */
  let toastTimer = null;
  function showToast(message, isError = false) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = message;
    if (toastIcon) toastIcon.textContent = isError ? '⚠️' : '✅';
    toast.style.borderColor = isError ? 'var(--red-border)' : 'var(--green-border)';
    toast.style.transform = 'translateY(0)';
    
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.transform = 'translateY(120%)';
    }, 4500);
  }

  /* ── Form submission ── */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const message = msgInput.value.trim();

    /* Run all validations */
    let hasError = false;

    if (!name) {
      setError(nameInput, errorName, 'Please enter your name.');
      hasError = true;
    }

    if (!email) {
      setError(emailInput, errorEmail, 'Please enter your email address.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(emailInput, errorEmail, 'Please enter a valid email address (e.g. you@example.com).');
      hasError = true;
    }

    if (!message) {
      setError(msgInput, errorMsg, 'Please write a message before sending.');
      hasError = true;
    }

    if (hasError) {
      const firstError = form.querySelector('.form-input.error, .form-textarea.error');
      if (firstError) firstError.focus();
      showToast('Transmission error: Check required fields.', true);
      return;
    }

    /* Loading state */
    submitBtn.disabled = true;
    submitBtn.textContent = 'Transmitting... // Encrypting';

    /* Simulate async transmission */
    await new Promise(r => setTimeout(r, 1100));

    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText || 'Transmit Message &rarr;';
    form.reset();

    /* Clear all valid states */
    [nameInput, emailInput, msgInput].forEach(el => el && el.classList.remove('valid', 'error'));

    /* Show inline success banner */
    if (successBanner) {
      successBanner.removeAttribute('hidden');
      successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(() => {
        successBanner.setAttribute('hidden', '');
      }, 8000);
    }

    /* Show toast */
    showToast("Transmission successful! Thanks for reaching out.");
  });
})();

/* ── Subtle Mouse Spotlight on Cards ──────────────────────── */
(function initCardSpotlight() {
  const cards = document.querySelectorAll('.project-entry, .hero-portrait-card, .stack-card, .info-card, .note-card');

  if (window.matchMedia('(hover: none)').matches) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(0, 240, 255, 0.04), var(--bg-card))`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ── Project Category Filter Logic ───────────────────────── */
(function initProjectFilters() {
  const filterPills = document.querySelectorAll('.filter-pill[data-filter]');
  const projectEntries = document.querySelectorAll('.project-entry[data-category]');
  const emptyState = document.getElementById('projects-empty');

  if (!filterPills.length || !projectEntries.length) return;

  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const selectedFilter = pill.getAttribute('data-filter');

      // Update pill active states
      filterPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-selected', 'true');

      let visibleCount = 0;

      projectEntries.forEach(entry => {
        const category = entry.getAttribute('data-category');

        if (selectedFilter === 'all' || category === selectedFilter) {
          entry.style.display = '';
          entry.style.opacity = '1';
          visibleCount++;
        } else {
          entry.style.display = 'none';
          entry.style.opacity = '0';
        }
      });

      if (emptyState) {
        emptyState.hidden = visibleCount > 0;
      }
    });
  });
})();

/* ── Resume / CV Modal Logic ─────────────────────────────── */
(function initCVModal() {
  const modal = document.getElementById('cv-modal');
  const closeBtn = document.getElementById('cv-modal-close-btn');
  const openNavBtn = document.getElementById('open-cv-nav-btn');
  const openHeroBtn = document.getElementById('open-cv-hero-btn');
  const printBtn = document.getElementById('cv-print-btn');

  if (!modal) return;

  function openCV() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeCV() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openNavBtn && openNavBtn.addEventListener('click', openCV);
  openHeroBtn && openHeroBtn.addEventListener('click', openCV);
  closeBtn && closeBtn.addEventListener('click', closeCV);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeCV();
  });

  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeCV();
    }
  });
})();

/* ── Interactive Command Center Terminal Widget ───────────── */
(function initTerminalWidget() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const chips = document.querySelectorAll('.term-chip[data-cmd]');

  if (!form || !input || !output) return;

  const commandResponses = {
    help: `Available Commands:
  • <span class="term-cyan">whoami</span>    - Print developer identity & profile summary
  • <span class="term-cyan">skills</span>    - List cybersecurity & programming stack
  • <span class="term-cyan">projects</span>  - Show featured systems & tools
  • <span class="term-cyan">cv</span>        - Open printable CV / Resume modal
  • <span class="term-cyan">scan</span>      - Run simulated network vulnerability audit
  • <span class="term-cyan">notes</span>     - View technical security lab notes
  • <span class="term-cyan">contact</span>   - Get direct communication channels
  • <span class="term-cyan">matrix</span>    - Trigger cyber matrix packet grid mode
  • <span class="term-cyan">clear</span>     - Clear terminal buffer screen`,

    whoami: `<span class="term-cyan">USER:</span> Yasin Ullakhan A
<span class="term-cyan">ROLE:</span> Cyber Security Student & Systems Developer
<span class="term-cyan">DEGREE:</span> BCA — St. Joseph's University, Chennai (2024 – 2027)
<span class="term-cyan">LOCATION:</span> Chennai, Tamil Nadu, India
<span class="term-cyan">STATUS:</span> OPEN_FOR_INTERNSHIPS // CYBER_SECURITY_ROLES`,

    skills: `<span class="term-cyan">[CYBERSECURITY]</span> Vulnerability Assessment, Network Auditing, Wireshark, Nmap, Scapy, Burp Suite, Kali Linux
<span class="term-cyan">[LANGUAGES]</span> Python 3, C++, C, JavaScript, Bash, SQL, HTML/CSS
<span class="term-cyan">[SYSTEMS]</span> Linux Raw Sockets, 2D Rigid-Body Physics, Shannon Entropy, Packet Sniffing`,

    projects: `<span class="term-cyan">1. NetAegis</span> — Multi-Threaded Port Scanner & CVE Correlator
<span class="term-cyan">2. PacketPulse</span> — Raw-Socket Packet Sniffer & ARP Detector
<span class="term-cyan">3. Vortex 2D</span> — Rigid-Body Physics Engine (SAT Collision Math)
<span class="term-cyan">4. EntropyGuard</span> — NIST SP 800-63B Shannon Entropy Password Auditor
<span class="term-cyan">5. CyberSim</span> — Interactive Web Network Threat Sandbox
<span class="term-cyan">6. Command Center</span> — Cyber Security Portfolio Web App`,

    scan: `<span class="term-dim">[INITIATING NMAP RECON SCAN...]</span>
Target: local_subnet/24
PORT     STATE SERVICE     VERSION
22/tcp   OPEN  ssh         OpenSSH 8.9p1 Ubuntu (Protocol 2.0)
80/tcp   OPEN  http        Nginx 1.18.0
443/tcp  OPEN  ssl/https   OpenSSL 3.0.2
<span class="term-green">✔ SCAN COMPLETE: 0 Critical Vulnerabilities Detected. Firewall Active.</span>`,

    cv: `<span class="term-green">✔ Launching Resume / CV Dialog Window...</span>`,

    download: `<span class="term-green">✔ Opening printable CV document...</span>`,

    contact: `<span class="term-cyan">EMAIL:</span> yasinullakhan4321@gmail.com
<span class="term-cyan">GITHUB:</span> github.com/yazin-developer
<span class="term-cyan">LOCATION:</span> Chennai, Tamil Nadu, India`,

    notes: `<span class="term-cyan">1. How ARP Spoofing Works & Detector in Python</span>
<span class="term-cyan">2. From Physics Loops to Security: Systems Engineering</span>
<span class="term-cyan">3. Analyzing /var/log/auth.log for SSH Attacks</span>`,

    matrix: `<span class="term-green">[MATRIX MODE ACTIVATED] Accelerating cyber grid canvas nodes...</span>`
  };

  function executeCommand(cmdRaw) {
    const cmd = cmdRaw.trim().toLowerCase();
    if (!cmd) return;

    // Append user input line
    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">yasin@sec:~$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;
    output.appendChild(userLine);

    if (cmd === 'clear') {
      output.innerHTML = `<div class="term-line"><span class="term-dim">Session reset:</span> <span class="term-cyan">NODE-CHENNAI-01</span></div>`;
      input.value = '';
      return;
    }

    if (cmd === 'cv' || cmd === 'download' || cmd === 'resume') {
      const openBtn = document.getElementById('open-cv-nav-btn');
      openBtn && openBtn.click();
    }

    const resDiv = document.createElement('div');
    resDiv.className = 'term-res';

    if (commandResponses[cmd]) {
      resDiv.innerHTML = commandResponses[cmd];
    } else {
      resDiv.innerHTML = `<span class="term-dim">Command not found: '${escapeHtml(cmd)}'. Type <span class="term-cyan">'help'</span> for list of available commands.</span>`;
    }

    output.appendChild(resDiv);
    output.scrollTop = output.scrollHeight;
    input.value = '';
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    executeCommand(input.value);
  });

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const command = chip.getAttribute('data-cmd');
      if (command) executeCommand(command);
    });
  });
})();

