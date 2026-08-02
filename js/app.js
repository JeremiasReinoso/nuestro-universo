// app.js — entrada, navegación, relojes y corazón permanente

document.addEventListener('DOMContentLoaded', () => {
  const entryScreen = document.getElementById('entry-screen');
  const heartContainer = document.getElementById('heart-container');
  const heartSvg = document.getElementById('heart-svg');
  const tagline = document.getElementById('entry-tagline');
  const btnEnter = document.getElementById('btn-enter');
  const main = document.getElementById('main');
  const sideNav = document.getElementById('side-nav');

  // ── Secuencia de entrada ──
  setTimeout(() => {
    heartContainer.classList.add('animate');
    heartSvg.classList.add('beating');
  }, 600);

  setTimeout(() => tagline.classList.add('animate'), 1200);
  setTimeout(() => btnEnter.classList.add('animate'), 1800);

  // ── Botón entrar ──
  btnEnter.addEventListener('click', () => {
    entryScreen.classList.add('exit');
    main.classList.remove('hidden');
    sideNav.classList.add('visible');

    setTimeout(() => {
      entryScreen.style.display = 'none';
      main.classList.add('visible');
      initSections();
      showPermanentHeart();
      updateGreeting();
    }, 600);
  });

  // ── Navegación lateral ──
  const navDots = document.querySelectorAll('.nav-dot');
  navDots.forEach(dot => {
    dot.addEventListener('click', e => {
      e.preventDefault();
      const target = document.querySelector(dot.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── IntersectionObserver: secciones ──
  function initSections() {
    const sections = document.querySelectorAll('.section');

    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          updateNav(entry.target.id);
        }
      });
    }, { threshold: 0.25 });

    sections.forEach(s => sectionObserver.observe(s));

    // Elementos con animación propia (timeline, reasons, promises)
    const fadeItems = document.querySelectorAll(
      '.timeline-item, .reason-card, .promise-item, .book-page, .dream-card, .capsula-card'
    );
    const itemObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    }, { threshold: 0.15 });

    fadeItems.forEach(el => itemObserver.observe(el));
  }

  function updateNav(activeId) {
    navDots.forEach(dot => {
      const href = dot.getAttribute('href').replace('#', '');
      dot.classList.toggle('active', href === activeId);
    });
  }

  // ── Corazón permanente ──
  function showPermanentHeart() {
    const permanentHeart = document.getElementById('permanent-heart');
    if (permanentHeart) {
      permanentHeart.classList.remove('hidden');
      permanentHeart.addEventListener('click', () => {
        permanentHeart.style.transform = 'scale(1.2)';
        setTimeout(() => {
          permanentHeart.style.transform = 'scale(1)';
        }, 200);
      });
    }
  }

  // ── Saludo según la hora ──
  function updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.querySelector('.greeting-message');
    
    if (!greetingEl) return;

    let greeting = '';
    let color = '';

    if (hour >= 5 && hour < 12) {
      greeting = 'Buenos días';
      color = '#f1c40f';
    } else if (hour >= 12 && hour < 19) {
      greeting = 'Buenas tardes';
      color = '#e67e22';
    } else if (hour >= 19 && hour < 22) {
      greeting = 'Buenas noches';
      color = '#9b59b6';
    } else {
      greeting = 'Buenas madrugadas';
      color = '#3498db';
    }

    if (hour >= 22) {
      greetingEl.innerHTML = '<span style="color:var(--pink);font-size:1.2rem">Te extraño más que nunca...</span>';
    } else {
      greetingEl.textContent = greeting;
    }
  }
});
