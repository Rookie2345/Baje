// ============================================================
// BAJE AI — Visual Effects & Utilities
// ============================================================

// ---- Rotating Hero Speech Bubbles ----
const bajeSayings = [
  '"ए बाबु! स्वागत छ! के छ खबर?"',
  '"ल भन त, आज के कुरा गर्ने हो?"',
  '"अनि के छ आजकल? पढाइ चल्दैछ?"',
  '"हौ बाबु! आउनु भयो! बसौँ कुरा गरौँ।"',
  '"हाहा! रमाइलो कुरा छ भने भन्नुस् है!"',
  '"चिया खाँदै गफ गरौँ आउ!"',
  '"के हो यस्तो? बाजेलाई भन!"',
  '"नाति! ल भन — के सिकेको छौ आज?"'
];

let sayingIdx = 0;

function initSpeechBubbleRotation() {
  const bubble = document.getElementById('hero-speech');
  const textEl = document.getElementById('hero-speech-text');

  if (!bubble || !textEl) return;

  setInterval(() => {
    // Fade out
    bubble.style.opacity = '0';
    bubble.style.transform = 'translateY(-4px)';

    setTimeout(() => {
      sayingIdx = (sayingIdx + 1) % bajeSayings.length;
      textEl.textContent = bajeSayings[sayingIdx];
      // Fade in
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateY(0)';
    }, 350);
  }, 5000);
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  // Fade in hero elements on load
  const heroEls = document.querySelectorAll('[data-animate]');

  setTimeout(() => {
    heroEls.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('animated');
      }, i * 150);
    });
  }, 300);

  // IntersectionObserver for other elements
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // Observe trait cards with staggered delay
  document.querySelectorAll('.trait-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
    observer.observe(card);
  });

  document.querySelectorAll('.about-card, .about-header').forEach(el => {
    observer.observe(el);
  });
}

// ---- Navbar Scroll Effect ----
function initNavbarScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ---- Smooth Scroll to Chat ----
function scrollToChat() {
  const chatSection = document.getElementById('chat');
  if (chatSection) {
    chatSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(() => {
      const input = document.getElementById('chat-input');
      if (input) input.focus();
    }, 700);
  }
}

// ---- Toast Notifications ----
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ---- Starter Buttons Entrance ----
function initStarterAnimations() {
  const starters = document.querySelectorAll('.starter-btn');
  starters.forEach((btn, i) => {
    btn.style.opacity = '0';
    btn.style.transform = 'translateY(10px)';
    btn.style.transition = `opacity 0.4s ease ${i * 60}ms, transform 0.4s ease ${i * 60}ms`;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          btn.style.opacity = '1';
          btn.style.transform = 'translateY(0)';
          observer.unobserve(btn);
        }
      });
    }, { threshold: 0.1 });

    observer.observe(btn);
  });
}

// ---- Prevent empty Devanagari issues ----
function fixDevanagariInput() {
  const input = document.getElementById('chat-input');
  if (!input) return;

  // Handle mobile keyboard for Nepali input
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('autocorrect', 'off');
  input.setAttribute('autocapitalize', 'off');
  input.setAttribute('spellcheck', 'false');
}

// ---- Initialize All Effects ----
function initEffects() {
  initSpeechBubbleRotation();
  initScrollAnimations();
  initNavbarScroll();
  initStarterAnimations();
  fixDevanagariInput();

  // Add transition to speech bubble
  const bubble = document.getElementById('hero-speech');
  if (bubble) {
    bubble.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
  }
}
