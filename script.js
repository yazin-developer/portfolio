/* ============================================================
   YASIN ULLAKHAN A — CYBER SECURITY PORTFOLIO INTERACTIVITY
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize Lucide Icons (Item 2)
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Terminal Window Tab Switcher (Item 14)
  const termTabs = document.querySelectorAll('.term-tab');
  const termTabContents = {
    'tab-logs': document.getElementById('tab-logs'),
    'tab-config': document.getElementById('tab-config'),
    'tab-stats': document.getElementById('tab-stats')
  };

  termTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      
      termTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      Object.keys(termTabContents).forEach(key => {
        if (termTabContents[key]) {
          termTabContents[key].style.display = key === target ? 'block' : 'none';
        }
      });
    });
  });

  // 3. Simulated Terminal Typing Animation (Item 14)
  const typedTextEl = document.getElementById('typed-text');
  const commands = [
    'scapy --sniff interface=eth0 --count=100',
    'nmap -sV -p 1-65535 192.168.1.1',
    'python3 packetsentinel.py --live-decode',
    'vortex-engine --sat-collision-test'
  ];
  let cmdIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeTerminal() {
    if (!typedTextEl) return;
    const currentCmd = commands[cmdIndex];

    if (isDeleting) {
      typedTextEl.textContent = currentCmd.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typedTextEl.textContent = currentCmd.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 30 : 75;

    if (!isDeleting && charIndex === currentCmd.length) {
      typeSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      cmdIndex = (cmdIndex + 1) % commands.length;
      typeSpeed = 400;
    }

    setTimeout(typeTerminal, typeSpeed);
  }

  typeTerminal();

  // 4. Live Counter Incrementer (Item 13 & 18)
  const counterEl = document.getElementById('live-req-count');
  if (counterEl) {
    let reqCount = 65535;
    setInterval(() => {
      reqCount += Math.floor(Math.random() * 200) + 20;
      counterEl.textContent = reqCount.toLocaleString();
    }, 1800);
  }

  // 5. Interactive Mock Product Sandbox Controls (Item 18)
  const btnFast = document.getElementById('btn-mode-fast');
  const btnSecure = document.getElementById('btn-mode-secure');
  const btnQuantum = document.getElementById('btn-mode-quantum');
  const metricThreads = document.getElementById('metric-threads');
  const metricTp = document.getElementById('metric-tp');
  const metricEff = document.getElementById('metric-eff');
  const chartBars = document.querySelectorAll('.chart-bars .bar');

  const modes = [
    { btn: btnFast, threads: '65,535', tp: '2.4 GB/s', eff: '99.98%', heights: [55, 75, 85, 60, 98, 80, 90, 65, 85] },
    { btn: btnSecure, threads: '1,024', tp: '420 MB/s', eff: '100.00%', heights: [35, 50, 65, 45, 80, 55, 60, 50, 65] },
    { btn: btnQuantum, threads: '131,072', tp: '8.6 GB/s', eff: '99.999%', heights: [90, 95, 100, 85, 95, 90, 100, 95, 90] }
  ];

  modes.forEach(mode => {
    if (!mode.btn) return;
    mode.btn.addEventListener('click', () => {
      modes.forEach(m => m.btn && m.btn.classList.remove('active'));
      mode.btn.classList.add('active');

      if (metricThreads) metricThreads.textContent = mode.threads;
      if (metricTp) metricTp.textContent = mode.tp;
      if (metricEff) metricEff.textContent = mode.eff;

      chartBars.forEach((bar, index) => {
        if (mode.heights[index]) {
          bar.style.height = `${mode.heights[index]}%`;
        }
      });
    });
  });

  // 6. Interactive CV / Resume Modal Trigger Logic
  const cvModal = document.getElementById('cv-modal');
  const openCvNavBtn = document.getElementById('open-cv-nav-btn');
  const openCvHeroBtn = document.getElementById('open-cv-hero-btn');
  const closeCvBtn = document.getElementById('cv-modal-close-btn');
  const printCvBtn = document.getElementById('cv-print-btn');

  function openCvModal() {
    if (cvModal) cvModal.classList.add('active');
  }

  function closeCvModal() {
    if (cvModal) cvModal.classList.remove('active');
  }

  if (openCvNavBtn) openCvNavBtn.addEventListener('click', openCvModal);
  if (openCvHeroBtn) openCvHeroBtn.addEventListener('click', openCvModal);
  if (closeCvBtn) closeCvBtn.addEventListener('click', closeCvModal);

  if (cvModal) {
    cvModal.addEventListener('click', (e) => {
      if (e.target === cvModal) closeCvModal();
    });
  }

  if (printCvBtn) {
    printCvBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // 7. Contact Form Handler with Toast Popup
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) return;
    const msgEl = document.getElementById('toast-msg');
    if (msgEl && msg) msgEl.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => {
      toast.classList.remove('active');
    }, 4000);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value;
      const email = document.getElementById('form-email')?.value;
      const message = document.getElementById('form-message')?.value;

      if (!name || !email || !message) {
        showToast('⚠️ Please fill in all required fields.');
        return;
      }

      showToast('✅ Transmission successful! Thanks for reaching out.');
      contactForm.reset();
    });
  }

});
