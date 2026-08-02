// app.js — entrada, navegación y scroll

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
      '.timeline-item, .reason-card, .promise-item'
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
});
