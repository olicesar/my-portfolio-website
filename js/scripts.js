/*
  Author: Olivier César Muvuzankwaya
  Project: My Portfolio Project
  File: scripts.css
  Updated: 2026/04/18
*/

// Utility: safe query
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------
  // Welcome message (index only)
  // -------------------------------
  if (window.location.pathname.endsWith("index.html") || window.location.pathname === "/") {
    const welcome = document.createElement('div');
    welcome.setAttribute('role', 'alert');
    welcome.className = 'welcome-box';
    welcome.textContent = 'Welcome! Thank you for visiting.';
    document.body.prepend(welcome);

    setTimeout(() => {
      welcome.style.display = 'none';
    }, 3000);
  }

  // -------------------------------
  // Menu toggle for small screens
  // -------------------------------
  $$('#menu-toggle, #menu-toggle-2, #menu-toggle-3, #menu-toggle-4').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('aria-controls');
      const menu = document.getElementById(id);
      if (menu) {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        menu.classList.toggle('show');
      }
    });
  });

  // -------------------------------
  // Show / Hide bio
  // -------------------------------
  const bio = $('#short-bio');
  const bioBtn = $('#show-bio');
  if (bioBtn && bio) {
    bioBtn.addEventListener('click', () => {
      bio.style.display = (bio.style.display === 'none') ? '' : 'none';
    });
  }

  // -------------------------------
  // Load / Unload skills
  // -------------------------------
  const skillsBtn = document.getElementById('load-skills');
  const skillsList = document.getElementById('skills-list');
  let skillsLoaded = false;

  function formatSkillCard(skill) {
    const art = document.createElement('article');
    art.className = 'card';
    const h = document.createElement('h4');
    h.textContent = skill.name;
    const p = document.createElement('p');
    p.textContent = skill.level;
    art.append(h, p);
    return art;
  }

  function toggleSkills() {
    if (!skillsLoaded) {
      const skills = [
        { name: '.NET Core | C# | VB.NET', level: 'Advanced' },
        { name: 'ASP.NET MVC | Razor Pages', level: 'Advanced' },
        { name: 'PostgreSQL | SQL Server', level: 'Advanced' },
        { name: 'HTML5 | CSS3 | JS', level: 'Advanced' },
        { name: 'Agile & Testing', level: 'Intermediate' }
      ];

      skillsList.innerHTML = '';
      for (let i = 0; i < skills.length; i++) {
        const card = formatSkillCard(skills[i]);
        skillsList.appendChild(card);
      }

      skillsBtn.textContent = 'Hide Technical Skills';
      skillsLoaded = true;
    } else {
      skillsList.innerHTML = '';
      skillsBtn.textContent = 'View Technical Skills';
      skillsLoaded = false;
    }
  }

  if (skillsBtn && skillsList) {
    skillsBtn.addEventListener('click', toggleSkills);
  }

  // -------------------------------
  // Theme toggle with persistence
  // -------------------------------
  
   const themeBtn = document.createElement('button');
   themeBtn.textContent = '☀️ Light/Dark';
   themeBtn.style.cssText = 'position:fixed;right:1rem;bottom:1rem;z-index:999;';
   document.body.appendChild(themeBtn);

  // Apply saved theme on load
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }

  // Toggle theme + save preference
  themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

  
  // ----------------------------------------
  // Contact form (live preview + validation)
  // ----------------------------------------
  const message = $('#message');
  const preview = $('#live-preview');
  if (message && preview) {
    message.addEventListener('input', () => {
      preview.textContent = message.value;
    });
  }

  const contactForm = $('#contact-form');
  const result = $('#form-result');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const required = ['name', 'email', 'message'];
      let errors = [];

      for (let i = 0; i < required.length; i++) {
        const id = required[i];
        const el = document.getElementById(id);
        if (!el || !el.value.trim()) {
          errors.push(id);
        }
      }

      const emailVal = document.getElementById('email')?.value || '';
      if (emailVal && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        errors.push('email-format');
      }

      if (errors.length) {
        result.textContent = 'Please complete the required fields correctly: ' + errors.join(', ');
        result.style.color = 'crimson';
        return;
      }

      result.style.color = 'initial';
      result.textContent = 'Sending message...';
      setTimeout(() => {
        result.textContent = 'Message sent! (Simulation)';
        result.style.color = 'crimson';		
        contactForm.reset();
        preview.textContent = '';
      }, 900);
    });
  }

  // --------------------------------------
  // Character counter for message textarea
  // --------------------------------------

	const messageBox = document.getElementById('message');
	const charCount = document.getElementById('char-count');

	if (messageBox && charCount) {
		messageBox.addEventListener('input', () => {
		charCount.textContent = `(${messageBox.value.length} / ${messageBox.maxLength})`;
	});
	}
}); 
