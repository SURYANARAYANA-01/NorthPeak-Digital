// ---- Immediate Theme Initializer ----
(function initTheme(){
  try {
    var stored = localStorage.getItem('northpeak-theme');
    var prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
    var theme = stored || (prefersLight ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  } catch(e) {}
})();

// ---- Theme toggle ----
(function(){
  var toggle = document.getElementById('theme-toggle');
  var root = document.documentElement;
  if (!toggle) return;

  toggle.addEventListener('click', function(){
    var current = root.getAttribute('data-theme') || 'dark';
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { 
      localStorage.setItem('northpeak-theme', next); 
    } catch(e) {
    }
  });
})();

// ---- Mobile menu toggle ----
(function(){
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('nav-links');
  if(!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', function(){
    const isOpen = navLinks.classList.toggle('nav-open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('nav-open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });
})();

// ---- Scroll reveal ----
(function(){
  var items = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    items.forEach(el => el.classList.add('in'));
    return;
  }
  var obs = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => obs.observe(el));
})();

// ---- Contact form validation ----
(function(){
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  const validators = {
    name: v => v.trim().length >= 2,
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    company: v => v.trim().length >= 1,
    project: v => v !== '',
    message: v => v.trim().length >= 10
  };

  function validateField(field){
    const input = field.querySelector('input, select, textarea');
    if(!input || !validators[input.name]) return true;
    const isValid = validators[input.name](input.value);
    field.classList.toggle('invalid', !isValid);
    input.setAttribute('aria-invalid', !isValid);
    return isValid;
  }

  form.querySelectorAll('.field').forEach(field => {
    const input = field.querySelector('input, select, textarea');
    if(!input || !validators[input.name]) return;
    
    input.addEventListener('blur', () => validateField(field));
    input.addEventListener('change', () => validateField(field));
    input.addEventListener('input', () => {
      if(field.classList.contains('invalid')) validateField(field);
    });
  });

  form.addEventListener('submit', function(e){
    e.preventDefault();
    let allValid = true;

    form.querySelectorAll('.field').forEach(field => {
      const input = field.querySelector('input, select, textarea');
      if(input && validators[input.name] && !validateField(field)) {
        allValid = false;
      }
    });

    status.classList.remove('ok', 'err');

    if(!allValid){
      status.textContent = 'Please complete the required fields above before submitting.';
      status.classList.add('show', 'err');
      return;
    }

    status.textContent = "Thanks — your message is in. We'll reply within one business day.";
    status.classList.add('show', 'ok');
    form.reset();
  });
})();