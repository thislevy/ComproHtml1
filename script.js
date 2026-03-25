/**
 * NEXORA — Company Profile JavaScript
 * Features: Sticky Nav, Mobile Menu, Scroll Reveal,
 *           Portfolio Filter, Form Validation, Modal, Back to Top
 */

/* ══════════════════════════════════════════
   UTILS
══════════════════════════════════════════ */
const qs  = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════════════
   1. STICKY NAVIGATION
══════════════════════════════════════════ */
(function initNav() {
  const nav = qs('#navbar');
  if (!nav) return;

  const SCROLL_THRESHOLD = 20;
  let lastY = 0;
  let ticking = false;

  function onScroll() {
    lastY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', lastY > SCROLL_THRESHOLD);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // init state
})();

/* ══════════════════════════════════════════
   2. MOBILE HAMBURGER MENU
══════════════════════════════════════════ */
(function initMobileMenu() {
  const hamburger    = qs('#hamburger');
  const mobileMenu   = qs('#mobileMenu');
  const mobileOverlay = qs('#mobileOverlay');
  if (!hamburger || !mobileMenu) return;

  const mobileLinks = qsa('.nav__mobile-link', mobileMenu);

  function openMenu() {
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = mobileMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  }

  hamburger.addEventListener('click', toggleMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
  });

  // Resize: close menu on desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMenu();
  }, { passive: true });
})();

/* ══════════════════════════════════════════
   3. SMOOTH SCROLL FOR ANCHOR LINKS
══════════════════════════════════════════ */
(function initSmoothScroll() {
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (href === '#') return;
    const target = qs(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();

/* ══════════════════════════════════════════
   4. SCROLL REVEAL ANIMATION
══════════════════════════════════════════ */
(function initScrollReveal() {
  const elements = qsa('.reveal');
  if (!elements.length) return;

  // Immediately show elements in viewport on load
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // animate once
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  elements.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════════════
   5. PORTFOLIO FILTER
══════════════════════════════════════════ */
(function initPortfolioFilter() {
  const filterBtns = qsa('.filter-btn');
  const cards      = qsa('.portfolio-card');
  if (!filterBtns.length || !cards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;

        if (show) {
          // Fade in
          card.style.display = '';
          // Trigger reflow for transition
          requestAnimationFrame(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(16px)';
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          setTimeout(() => {
            if (btn.dataset.filter !== filter || filter === 'all') return;
            // Only hide if still same filter active
            const activeFilter = qs('.filter-btn--active')?.dataset.filter;
            if (activeFilter !== filter && activeFilter !== 'all') return;
            card.style.display = 'none';
          }, 350);
        }
      });

      // Simpler approach with immediate hide/show
      cards.forEach(card => {
        const category = card.dataset.category;
        const show = filter === 'all' || category === filter;
        card.style.display = show ? '' : 'none';
        if (show) {
          card.style.animation = 'cardReveal 0.5s ease forwards';
        }
      });
    });
  });

  // Add keyframe dynamically
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    @keyframes cardReveal {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(styleEl);
})();

/* ══════════════════════════════════════════
   6. PORTFOLIO MODAL
══════════════════════════════════════════ */
const portfolioData = {
  '1': {
    title: 'Mandiri Analytics Platform',
    category: 'Web App',
    description: 'Platform analitik enterprise yang memproses lebih dari 50.000 transaksi harian dengan visualisasi data real-time yang intuitif. Sistem ini memungkinkan tim manajemen untuk mengambil keputusan berdasarkan data dalam hitungan detik.',
    bg: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    results: [
      { num: '50K+', label: 'Transaksi/Hari' },
      { num: '99.9%', label: 'Uptime' },
      { num: '4x', label: 'Efisiensi Laporan' }
    ],
    stack: ['React', 'D3.js', 'Node.js', 'PostgreSQL', 'Redis', 'AWS']
  },
  '2': {
    title: 'GarudaPay Super App',
    category: 'Mobile App',
    description: 'Aplikasi fintech komprehensif yang menyatukan layanan pembayaran, investasi reksa dana, dan asuransi micro dalam satu platform. Berhasil meraih 200.000+ pengguna aktif hanya dalam 6 bulan pertama peluncuran.',
    bg: 'linear-gradient(135deg, #0d0d0d 0%, #1a0a00 50%, #2d1500 100%)',
    results: [
      { num: '200K+', label: 'Pengguna Aktif' },
      { num: '6 Bulan', label: 'Time to Market' },
      { num: '4.8★', label: 'Rating App Store' }
    ],
    stack: ['Flutter', 'Dart', 'Firebase', 'Go', 'PostgreSQL', 'GCP']
  },
  '3': {
    title: 'Nusantara Digital Transformation',
    category: 'Strategy',
    description: 'Proyek transformasi digital skala besar untuk konglomerat retail dengan 800+ gerai di seluruh Indonesia. Meliputi audit sistem existing, perancangan arsitektur digital baru, dan roadmap implementasi 3 tahun dengan ROI yang terukur.',
    bg: 'linear-gradient(135deg, #0a0a1a 0%, #0d1a0d 50%, #0a1a15 100%)',
    results: [
      { num: '800+', label: 'Gerai Nasional' },
      { num: '3 Tahun', label: 'Roadmap' },
      { num: '45%', label: 'Proyeksi Penghematan' }
    ],
    stack: ['Business Analysis', 'Digital Strategy', 'Change Management', 'Training']
  },
  '4': {
    title: 'Archipelago AI Engine',
    category: 'AI / Data',
    description: 'Sistem rekomendasi produk berbasis machine learning yang menganalisis perilaku 2+ juta pengguna untuk menyajikan rekomendasi yang hyper-personalized. Implementasi berhasil meningkatkan konversi sebesar 340% dalam 3 bulan.',
    bg: 'linear-gradient(135deg, #0d0014 0%, #140028 50%, #1a003d 100%)',
    results: [
      { num: '340%', label: 'Peningkatan Konversi' },
      { num: '2M+', label: 'Pengguna Dianalisis' },
      { num: '89%', label: 'Akurasi Model' }
    ],
    stack: ['Python', 'TensorFlow', 'Kafka', 'Spark', 'AWS SageMaker', 'Elasticsearch']
  },
  '5': {
    title: 'Pilar Commerce Platform',
    category: 'Web App',
    description: 'Platform e-commerce B2B custom dengan fitur manajemen inventory otomatis, integrasi 12 payment gateway, dan sistem multi-warehouse yang menangani ribuan SKU secara bersamaan.',
    bg: 'linear-gradient(135deg, #001a0d 0%, #00330f 50%, #004d18 100%)',
    results: [
      { num: '12', label: 'Payment Gateway' },
      { num: '60%', label: 'Kurangi Manual Work' },
      { num: '3x', label: 'Kecepatan Order' }
    ],
    stack: ['Next.js', 'TypeScript', 'Prisma', 'Redis', 'Stripe', 'Docker']
  },
  '6': {
    title: 'MediConnect Health App',
    category: 'Mobile App',
    description: 'Platform telemedicine yang menghubungkan 1.500+ dokter berspesialis dengan pasien di seluruh Indonesia. Fitur video konsultasi HD, e-prescription, dan jadwal rawat inap terintegrasi dengan 50+ rumah sakit mitra.',
    bg: 'linear-gradient(135deg, #1a0a0a 0%, #2d1111 50%, #3d1515 100%)',
    results: [
      { num: '1.5K+', label: 'Dokter Terdaftar' },
      { num: '50+', label: 'RS Mitra' },
      { num: '15 Mnt', label: 'Rata-rata Konsultasi' }
    ],
    stack: ['React Native', 'WebRTC', 'Node.js', 'MongoDB', 'AWS', 'Twilio']
  }
};

(function initModal() {
  const overlay    = qs('#modalOverlay');
  const modalBody  = qs('#modalBody');
  const closeBtn   = qs('#modalClose');
  if (!overlay || !modalBody) return;

  function openModal(id) {
    const data = portfolioData[id];
    if (!data) return;

    modalBody.innerHTML = `
      <div class="modal-project">
        <div class="modal-project__img" style="background: ${data.bg};"></div>
        <span class="modal-project__tag">${data.category}</span>
        <h2 id="modalTitle">${data.title}</h2>
        <p>${data.description}</p>
        <div class="modal-project__results">
          ${data.results.map(r => `
            <div class="modal-result">
              <strong>${r.num}</strong>
              <span>${r.label}</span>
            </div>
          `).join('')}
        </div>
        <div style="margin-top: 1.5rem; display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${data.stack.map(s => `
            <span style="
              font-family: var(--font-mono);
              font-size: 0.72rem;
              color: var(--clr-text-dim);
              border: 1px solid var(--clr-border);
              padding: 0.25rem 0.7rem;
              border-radius: 9999px;
            ">${s}</span>
          `).join('')}
        </div>
      </div>
    `;

    overlay.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus the modal for accessibility
    setTimeout(() => closeBtn.focus(), 100);
  }

  function closeModal() {
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  // Open on card button click
  document.addEventListener('click', e => {
    const viewBtn = e.target.closest('.portfolio-card__view');
    if (viewBtn) {
      openModal(viewBtn.dataset.id);
    }
  });

  // Close handlers
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !overlay.hasAttribute('hidden')) closeModal();
  });
})();

/* ══════════════════════════════════════════
   7. CONTACT FORM VALIDATION
══════════════════════════════════════════ */
(function initContactForm() {
  const form        = qs('#contactForm');
  const submitBtn   = qs('#submitBtn');
  const formSuccess = qs('#formSuccess');
  if (!form) return;

  const fields = {
    name:    { el: qs('#name'),    error: qs('#nameError'),    validate: v => v.trim().length >= 2 ? '' : 'Nama minimal 2 karakter.' },
    email:   { el: qs('#email'),   error: qs('#emailError'),   validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Format email tidak valid.' },
    message: { el: qs('#message'), error: qs('#messageError'), validate: v => v.trim().length >= 10 ? '' : 'Pesan minimal 10 karakter.' }
  };

  // Live validation on blur
  Object.values(fields).forEach(({ el, error, validate }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle('error', !!msg);
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        const msg = validate(el.value);
        error.textContent = msg;
        el.classList.toggle('error', !!msg);
      }
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Validate all fields
    let hasError = false;
    Object.values(fields).forEach(({ el, error, validate }) => {
      if (!el) return;
      const msg = validate(el.value);
      error.textContent = msg;
      el.classList.toggle('error', !!msg);
      if (msg) hasError = true;
    });

    if (hasError) {
      // Shake the form
      form.style.animation = 'none';
      form.offsetHeight; // reflow
      form.style.animation = 'shake 0.4s ease';
      return;
    }

    // Simulate submission
    const btnText    = qs('.btn-text', submitBtn);
    const btnLoading = qs('.btn-loading', submitBtn);

    submitBtn.disabled = true;
    btnText.hidden = true;
    btnLoading.hidden = false;

    await new Promise(r => setTimeout(r, 1800)); // Simulated delay

    // Show success
    form.style.opacity = '0';
    form.style.transition = 'opacity 0.3s ease';

    setTimeout(() => {
      form.style.display = 'none';
      formSuccess.removeAttribute('hidden');
      formSuccess.style.animation = 'fadeInUp 0.5s ease both';
    }, 300);
  });

  // Shake animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%       { transform: translateX(-8px); }
      40%       { transform: translateX(8px); }
      60%       { transform: translateX(-5px); }
      80%       { transform: translateX(5px); }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
})();

/* ══════════════════════════════════════════
   8. BACK TO TOP BUTTON
══════════════════════════════════════════ */
(function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 400);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════════════
   9. SERVICE CARD MOUSE SPOTLIGHT EFFECT
══════════════════════════════════════════ */
(function initCardSpotlight() {
  const cards = qsa('.service-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
})();

/* ══════════════════════════════════════════
   10. ACTIVE NAV LINK HIGHLIGHT ON SCROLL
══════════════════════════════════════════ */
(function initActiveNavLink() {
  const sections = qsa('section[id]');
  const navLinks = qsa('.nav__link:not(.nav__link--cta)');
  if (!sections.length || !navLinks.length) return;

  let ticking = false;

  function updateActiveLink() {
    const scrollY = window.scrollY;
    let current = '';

    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (scrollY >= top) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.style.color = href === current ? 'var(--clr-white)' : '';
    });
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateActiveLink();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════════════
   11. LAZY LOAD IMAGES (Future-proofing)
══════════════════════════════════════════ */
(function initLazyLoad() {
  if (!('IntersectionObserver' in window)) return;
  const imgs = qsa('img[loading="lazy"]');
  if (!imgs.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px 0px' });

  imgs.forEach(img => observer.observe(img));
})();

/* ══════════════════════════════════════════
   12. COUNTER ANIMATION (Stats)
══════════════════════════════════════════ */
(function initCounterAnimation() {
  const stats = qsa('.hero__stat-num');
  if (!stats.length) return;

  const parseNum = str => {
    const num = parseFloat(str.replace(/[^0-9.]/g, ''));
    const suffix = str.replace(/[0-9.]/g, '').trim();
    return { num, suffix };
  };

  const formatNum = (n, original) => {
    const { suffix } = parseNum(original);
    if (Number.isInteger(n)) return n + suffix;
    return n.toFixed(0) + suffix;
  };

  let animated = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      stats.forEach(el => {
        const original = el.textContent;
        const { num } = parseNum(original);
        if (isNaN(num)) return;

        let start = 0;
        const duration = 1800;
        const startTime = performance.now();

        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(num * eased * 10) / 10;
          el.textContent = formatNum(current, original);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = original;
        }
        requestAnimationFrame(step);
      });
    }
  }, { threshold: 0.5 });

  const heroStats = qs('.hero__stats');
  if (heroStats) observer.observe(heroStats);
})();

/* ══════════════════════════════════════════
   INIT LOG
══════════════════════════════════════════ */
console.log('%cNexora Digital Studio', 'color: #c9a84c; font-size: 1.2rem; font-weight: bold;');
console.log('%cWebsite loaded successfully ✓', 'color: #4cc9a8; font-size: 0.9rem;');
