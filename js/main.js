(function() {
  'use strict';

  let currentScene = 0;
  let shownMessages = JSON.parse(localStorage.getItem('missMessages') || '[]');

  const messages = [
    'Gracias por aparecer en mi vida.',
    'Aunque nos separen miles de kilómetros, siempre te siento cerca.',
    'Me haces feliz incluso en los días difíciles.',
    'Sos el lugar al que siempre quiero volver.',
    'Cada conversación con vos hace mejor mi día.',
    'No veo la hora de poder abrazarte.',
    'Nuestro primer abrazo va a valer toda la espera.',
    'No importa la distancia, siempre encuentro una razón para sonreír cuando pienso en vos.',
    'Gracias por existir.',
    'Te elegiría una y mil veces.'
  ];

  const dreams = [
    'Primer abrazo físico',
    'Primer beso',
    'Primer viaje juntos',
    'Primer café compartido',
    'Primer atardecer juntos',
    'Decirte "te amo" por voz por primera vez'
  ];

  function loadMessages() {
    const container = document.getElementById('messages');
    if (!container) return;
    
    container.innerHTML = messages.map(function(msg) {
      return '<div class="message-card"><p class="message-text">' + escapeHtml(msg) + '</p></div>';
    }).join('');
  }

  function loadDreams() {
    const container = document.getElementById('dreams');
    if (!container) return;
    
    container.innerHTML = dreams.map(function(dream) {
      return '<div class="dream-card"><p class="dream-text">' + escapeHtml(dream) + '</p></div>';
    }).join('');
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

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
      loadMessages();
      loadDreams();
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
          const sceneNum = parseInt(scene.id.replace('scene', ''), 10);
          
          if (!scene.classList.contains('visible')) {
            scene.classList.add('visible');
            currentScene = sceneNum;
          }
          
          if (sceneNum === 3 && !document.getElementById('messages-loaded')) {
            loadMessages();
            document.getElementById('messages-loaded')?.remove();
            const tag = document.createElement('span');
            tag.id = 'messages-loaded';
            tag.style.display = 'none';
            scene.appendChild(tag);
          }
          
          if (sceneNum === 5 && !document.getElementById('dreams-loaded')) {
            loadDreams();
            if (!document.getElementById('dreams-loaded')) {
              const tag = document.createElement('span');
              tag.id = 'dreams-loaded';
              tag.style.display = 'none';
              scene.appendChild(tag);
            }
          }
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
    
    if (!btn) return;
    
    btn.addEventListener('click', function() {
      if (!card.classList.contains('showing')) {
        card.classList.add('showing');
      }
      
      const available = messages.filter(function(_, i) {
        return shownMessages.indexOf(i) === -1;
      });
      
      let msg;
      if (available.length === 0) {
        shownMessages = [];
        localStorage.setItem('missMessages', JSON.stringify(shownMessages));
        msg = messages[Math.floor(Math.random() * messages.length)];
      } else {
        const idx = Math.floor(Math.random() * available.length);
        msg = available[idx];
        shownMessages.push(messages.indexOf(msg));
      }
      
      localStorage.setItem('missMessages', JSON.stringify(shownMessages));
      textEl.textContent = msg;
    });
  }

  function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
    document.getElementById('day').textContent = days[now.getDay()];
    document.getElementById('month').textContent = months[now.getMonth()];
    document.getElementById('day-num').textContent = now.getDate();
    document.getElementById('year').textContent = now.getFullYear();
  }

  function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
  }

  function initFloatingPlayer() {
    const player = document.getElementById('floating-player');
    const timeEl = document.getElementById('player-time');
    
    if (player) {
      player.classList.add('floating-player-visible');
    }
    
    function updateTime() {
      if (!timeEl) return;
      const now = new Date();
      const mins = now.getMinutes().toString().padStart(2, '0');
      const secs = now.getSeconds().toString().padStart(2, '0');
      timeEl.textContent = mins + ':' + secs;
    }
    
    setInterval(updateTime, 1000);
    updateTime();
  }

  function initFooter() {
    const footer = document.querySelector('.footer');
    if (footer) {
      setTimeout(function() {
        footer.classList.add('footer-visible');
      }, 1000);
    }
  }

  function initPlayButton() {
    const btn = document.getElementById('play-btn');
    const audio = document.getElementById('music-player');
    
    if (!btn || !audio) return;
    
    btn.addEventListener('click', function() {
      if (audio.paused) {
        audio.play().catch(function() {});
      } else {
        audio.pause();
      }
    });
  }

  function init() {
    initIntro();
    initObserver();
    initMissButton();
    initClock();
    initFloatingPlayer();
    initFooter();
    initPlayButton();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();