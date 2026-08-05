(function() {
  'use strict';

  let currentScene = 0;

  const messages = [
    'Si estas leyendo esto, significa que me extrañaste. Aunque estemos lejos, cada día que paso pienso en lo afortunado que soy de conocerte. Tu sonrisa ilumina mis días más oscuros.',
    'El tiempo pasa, pero el recuerdo de nuestras conversaciones guardadas se queda. Cada palabra tuya tiene un lugar especial en mi corazón.',
    'A veces me pregunto cómo sería si hubiéramos cruzado los caminos antes. Pero creo que todo tiene su sentido. Tú llegaste justo cuando necesitaba luz.',
    'Quiero que sepas que cada mesita que pasa contigo es un regalo. No hay día que no me despierto pensando en algo que hiciste o dijiste.',
    'Si alguna vez dudas de lo que sentimos, recuerda que el amor verdadero no tiene miedo de la distancia. Él busca formas de estar cerca.'
  ];

  const msgHistoryKey = 'missMessagesHistory';

  function initIntro() {
    const intro = document.getElementById('intro');
    const enterBtn = document.getElementById('enter-btn');

    function start() {
      if (intro) {
        intro.classList.add('hidden');
      }
      setTimeout(function() {
        const firstScene = document.querySelector('.scene');
        if (firstScene) {
          firstScene.classList.add('visible');
          currentScene = 1;
        }
      }, 100);
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', start);
    }
    if (intro) {
      intro.addEventListener('click', start);
      intro.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          start();
        }
      });
    }
  }

  function initObserver() {
    if (!('IntersectionObserver' in window)) {
      const scenes = document.querySelectorAll('.scene');
      scenes.forEach(function(scene) {
        scene.classList.add('visible');
      });
      return;
    }

    const options = {
      root: null,
      threshold: 0.1
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const scene = entry.target;
          scene.classList.add('visible');
        }
      });
    }, options);

    const scenes = document.querySelectorAll('.scene');
    scenes.forEach(function(scene) {
      observer.observe(scene);
    });
  }

  function initMissButton() {
    const btn = document.getElementById('miss-btn');
    const card = document.getElementById('miss-card');
    const textEl = document.getElementById('miss-text');
    const history = JSON.parse(localStorage.getItem(msgHistoryKey) || '[]');

    if (!btn) return;

    btn.addEventListener('click', function() {
      if (!card.classList.contains('showing')) {
        card.classList.add('showing');
      }

      let available = messages.filter(function(msg, i) {
        return history.indexOf(i) === -1;
      });

      let msg;
      if (available.length === 0) {
        localStorage.setItem(msgHistoryKey, JSON.stringify([]));
        msg = messages[Math.floor(Math.random() * messages.length)];
      } else {
        const idx = messages.indexOf(available[Math.floor(Math.random() * available.length)]);
        history.push(idx);
        localStorage.setItem(msgHistoryKey, JSON.stringify(history));
        msg = available[history[history.length - 1]];
      }

      textEl.textContent = msg;
    });
  }

  function updateClock() {
    const arFormatter = new Intl.DateTimeFormat('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Argentina/Catamarca'
    });

    const doFormatter = new Intl.DateTimeFormat('es-DO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'America/Santo_Domingo'
    });

    function updateTimeAr() {
      const now = new Date();
      const parts = arFormatter.formatToParts(now);
      const hour = parts.find(function(p) { return p.type === 'hour'; }).value;
      const min = parts.find(function(p) { return p.type === 'minute'; }).value;
      const sec = parts.find(function(p) { return p.type === 'second'; }).value;
      const weekday = parts.find(function(p) { return p.type === 'weekday'; }).value;
      const day = parts.find(function(p) { return p.type === 'day'; }).value;
      const month = parts.find(function(p) { return p.type === 'month'; }).value;
      const year = parts.find(function(p) { return p.type === 'year'; }).value;

      const hourEl = document.getElementById('hour-ar');
      const minEl = document.getElementById('min-ar');
      const secEl = document.getElementById('sec-ar');
      const dateEl = document.getElementById('date-ar');

      if (hourEl) hourEl.textContent = hour;
      if (minEl) minEl.textContent = min;
      if (secEl) secEl.textContent = sec;
      if (dateEl) dateEl.textContent = weekday + ', ' + day + ' ' + month + ' ' + year;
    }

    function updateTimeDo() {
      const now = new Date();
      const parts = doFormatter.formatToParts(now);
      const hour = parts.find(function(p) { return p.type === 'hour'; }).value;
      const min = parts.find(function(p) { return p.type === 'minute'; }).value;
      const sec = parts.find(function(p) { return p.type === 'second'; }).value;
      const weekday = parts.find(function(p) { return p.type === 'weekday'; }).value;
      const day = parts.find(function(p) { return p.type === 'day'; }).value;
      const month = parts.find(function(p) { return p.type === 'month'; }).value;
      const year = parts.find(function(p) { return p.type === 'year'; }).value;

      const hourEl = document.getElementById('hour-do');
      const minEl = document.getElementById('min-do');
      const secEl = document.getElementById('sec-do');
      const dateEl = document.getElementById('date-do');

      if (hourEl) hourEl.textContent = hour;
      if (minEl) minEl.textContent = min;
      if (secEl) secEl.textContent = sec;
      if (dateEl) dateEl.textContent = weekday + ', ' + day + ' ' + month + ' ' + year;
    }

    updateTimeAr();
    updateTimeDo();
    setInterval(updateTimeAr, 1000);
    setInterval(updateTimeDo, 1000);
  }

  function initClocks() {
    const clockContainer = document.querySelector('.clocks-container');
    if (clockContainer) {
      clockContainer.classList.add('visible');
    }
    updateClock();
  }

  function initFooter() {
    const footer = document.querySelector('.footer');
    if (footer) {
      setTimeout(function() {
        footer.classList.add('footer-visible');
      }, 1000);
    }
  }

  function init() {
    initIntro();
    initObserver();
    initMissButton();
    initClocks();
    initFooter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();