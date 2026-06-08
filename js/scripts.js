/*
  Author: Olivier César Muvuzankwaya
  File: scripts.js
*/

// ============================================================
// UTILS
// ============================================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // THEME TOGGLE
  // Reads OS preference on first load; persists manual overrides
  // ============================================================
  const themeBtn = $('#theme-toggle');
  const root = document.documentElement;

  function getTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeBtn) themeBtn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }

  applyTheme(getTheme());

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  }

  // ============================================================
  // MOBILE NAV
  // Single unified toggle — works on every page via same IDs
  // ============================================================
  const menuToggle = $('#menu-toggle');
  const navList    = $('#primary-nav');

  if (menuToggle && navList) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navList.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!menuToggle.contains(e.target) && !navList.contains(e.target)) {
        navList.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navList.classList.contains('open')) {
        navList.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.textContent = '☰';
        menuToggle.focus();
      }
    });
  }

  // ============================================================
  // WELCOME TOAST (index only)
  // ============================================================
  const isHome = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
  if (isHome) {
    const toast = document.createElement('div');
    toast.className = 'welcome-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.textContent = '👋 Welcome — thanks for visiting!';
    document.body.appendChild(toast);
    // CSS animation handles the fade-out; remove from DOM after
    setTimeout(() => toast.remove(), 3200);
  }

  // ============================================================
  // SHOW / HIDE BIO (index)
  // CSS max-height transition — no display:none flash
  // ============================================================
  const bioBtn = $('#show-bio');
  const bio    = $('#short-bio');

  if (bioBtn && bio) {
    // Start closed
    bio.classList.remove('open');
    bioBtn.setAttribute('aria-expanded', 'false');

    bioBtn.addEventListener('click', () => {
      const isOpen = bio.classList.toggle('open');
      bioBtn.setAttribute('aria-expanded', String(isOpen));
      bioBtn.textContent = isOpen ? '− Hide summary' : '+ Show summary';
    });
  }

  // ============================================================
  // SKILLS TOGGLE (index)
  // ============================================================
  const skillsBtn  = $('#load-skills');
  const skillsList = $('#skills-list');

  const SKILLS = [
    { name: '.NET Core · C# · VB.NET',    level: 'Advanced' },
    { name: 'ASP.NET MVC · Razor Pages',  level: 'Advanced' },
    { name: 'PostgreSQL · SQL Server',     level: 'Advanced' },
    { name: 'HTML5 · CSS3 · JavaScript',  level: 'Advanced' },
    { name: 'Git · Agile · Testing',       level: 'Intermediate' },
  ];

  if (skillsBtn && skillsList) {
    skillsBtn.setAttribute('aria-expanded', 'false');

    skillsBtn.addEventListener('click', () => {
      const isOpen = skillsList.classList.toggle('open');
      skillsBtn.setAttribute('aria-expanded', String(isOpen));
      skillsBtn.textContent = isOpen ? '− Hide skills' : '+ Show skills';

      if (isOpen && skillsList.children.length === 0) {
        const frag = document.createDocumentFragment();
        SKILLS.forEach(skill => {
          const card = document.createElement('div');
          card.className = 'skill-card';
          card.innerHTML = `<h4>${skill.name}</h4><span class="skill-level">${skill.level}</span>`;
          frag.appendChild(card);
        });
        skillsList.appendChild(frag);
      }
    });
  }

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const contactForm = $('#contact-form');
  const formResult  = $('#form-result');
  const messageBox  = $('#message');
  const charCount   = $('#char-count');

  // Character counter
  if (messageBox && charCount) {
    messageBox.addEventListener('input', () => {
      charCount.textContent = `${messageBox.value.length} / ${messageBox.maxLength}`;
    });
  }

  // Form submit
  if (contactForm && formResult) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formResult.className = 'form-result';

      const name    = $('#name')?.value.trim();
      const email   = $('#email')?.value.trim();
      const message = $('#message')?.value.trim();
      const errors  = [];

      if (!name)    errors.push('Name is required.');
      if (!email)   errors.push('Email is required.');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email.');
      if (!message) errors.push('Message is required.');

      if (errors.length) {
        formResult.textContent = errors.join(' ');
        formResult.className = 'form-result error';
        return;
      }

      const submitBtn = contactForm.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }

      setTimeout(() => {
        formResult.textContent = '✓ Message sent! I\'ll get back to you soon.';
        formResult.className = 'form-result success';
        contactForm.reset();
        if (charCount) charCount.textContent = '0 / 500';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message →';
        }
      }, 900);
    });
  }

  // ============================================================
  // SCROLL REVEAL
  // IntersectionObserver — progressive enhancement
  // ============================================================
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger delay for sibling cards
          const delay = i * 60;
          entry.target.style.transitionDelay = `${delay}ms`;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    $$('.reveal').forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }

});
